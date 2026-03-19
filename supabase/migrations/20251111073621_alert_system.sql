-- BrewLotto V1: Alert System Tables
-- BrewCommand V1 alerting infrastructure for ingestion monitoring

-- 1. System Alerts Configuration
CREATE TABLE IF NOT EXISTS public.system_alerts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_key text UNIQUE NOT NULL,
    alert_name text NOT NULL,
    alert_type text NOT NULL CHECK (alert_type IN ('freshness', 'ingestion', 'validation', 'system', 'billing', 'prediction')),
    severity text NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
    description text NULL,
    threshold_config jsonb DEFAULT '{}'::jsonb,
    is_enabled boolean DEFAULT true,
    auto_resolve_minutes integer NULL,
    notification_channels jsonb DEFAULT '{"in_app": true, "email": false}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. Alert Events (occurrences)
CREATE TABLE IF NOT EXISTS public.alert_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id uuid NOT NULL REFERENCES system_alerts(id) ON DELETE CASCADE,
    game_id uuid NULL REFERENCES lottery_games(id) ON DELETE SET NULL,
    state_code text NULL,
    severity text NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
    status text NOT NULL CHECK (status IN ('raised', 'acknowledged', 'resolved', 'escalated')),
    title text NOT NULL,
    message text NOT NULL,
    event_data jsonb DEFAULT '{}'::jsonb,
    triggered_at timestamptz DEFAULT now(),
    acknowledged_at timestamptz NULL,
    acknowledged_by uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    resolved_at timestamptz NULL,
    resolved_by uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    escalated_at timestamptz NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. Alert Deliveries (notification tracking)
CREATE TABLE IF NOT EXISTS public.alert_deliveries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_event_id uuid NOT NULL REFERENCES alert_events(id) ON DELETE CASCADE,
    channel text NOT NULL CHECK (channel IN ('in_app', 'email', 'sms', 'webhook')),
    recipient_identifier text NULL,
    status text NOT NULL CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
    sent_at timestamptz NULL,
    delivered_at timestamptz NULL,
    error_message text NULL,
    retry_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 4. Helper Functions

-- Raise a new alert event
CREATE OR REPLACE FUNCTION public.raise_system_alert(
    p_alert_key text,
    p_severity text,
    p_title text,
    p_message text,
    p_game_id uuid DEFAULT NULL,
    p_state_code text DEFAULT NULL,
    p_event_data jsonb DEFAULT '{}'::jsonb
) RETURNS uuid AS $$
DECLARE
    v_alert_id uuid;
    v_event_id uuid;
BEGIN
    -- Look up alert configuration
    SELECT id INTO v_alert_id FROM system_alerts WHERE alert_key = p_alert_key AND is_enabled = true;
    
    IF v_alert_id IS NULL THEN
        RAISE WARNING 'Alert key % not found or disabled', p_alert_key;
        RETURN NULL;
    END IF;
    
    -- Create alert event
    INSERT INTO alert_events (alert_id, game_id, state_code, severity, status, title, message, event_data)
    VALUES (v_alert_id, p_game_id, p_state_code, p_severity, 'raised', p_title, p_message, p_event_data)
    RETURNING id INTO v_event_id;
    
    RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Acknowledge an alert
CREATE OR REPLACE FUNCTION public.acknowledge_system_alert(
    p_event_id uuid,
    p_user_id uuid
) RETURNS void AS $$
BEGIN
    UPDATE alert_events 
    SET status = 'acknowledged', 
        acknowledged_at = now(), 
        acknowledged_by = p_user_id,
        updated_at = now()
    WHERE id = p_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Resolve an alert
CREATE OR REPLACE FUNCTION public.resolve_system_alert(
    p_event_id uuid,
    p_user_id uuid DEFAULT NULL
) RETURNS void AS $$
BEGIN
    UPDATE alert_events 
    SET status = 'resolved', 
        resolved_at = now(), 
        resolved_by = p_user_id,
        updated_at = now()
    WHERE id = p_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Escalate an alert
CREATE OR REPLACE FUNCTION public.escalate_system_alert(
    p_event_id uuid
) RETURNS void AS $$
BEGIN
    UPDATE alert_events 
    SET status = 'escalated', 
        severity = 'critical',
        escalated_at = now(),
        updated_at = now()
    WHERE id = p_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. BrewCommand Alert Center View
CREATE OR REPLACE VIEW public.v_brewcommand_alert_center AS
SELECT 
    ae.id,
    ae.alert_id,
    sa.alert_key,
    sa.alert_name,
    sa.alert_type,
    ae.game_id,
    lg.display_name AS game_name,
    ae.state_code,
    ae.severity,
    ae.status,
    ae.title,
    ae.message,
    ae.event_data,
    ae.triggered_at,
    ae.acknowledged_at,
    au_ack.display_name AS acknowledged_by_name,
    ae.resolved_at,
    au_res.display_name AS resolved_by_name,
    ae.escalated_at,
    ae.created_at,
    ae.updated_at,
    sa.is_enabled,
    sa.auto_resolve_minutes,
    sa.notification_channels
FROM alert_events ae
JOIN system_alerts sa ON ae.alert_id = sa.id
LEFT JOIN lottery_games lg ON ae.game_id = lg.id
LEFT JOIN auth.users au_ack ON ae.acknowledged_by = au_ack.id
LEFT JOIN auth.users au_res ON ae.resolved_by = au_res.id
ORDER BY 
    CASE ae.severity 
        WHEN 'critical' THEN 1 
        WHEN 'warning' THEN 2 
        ELSE 3 
    END,
    ae.triggered_at DESC;

-- 6. Ingestion Health Summary View
CREATE OR REPLACE VIEW public.v_ingestion_health_summary AS
SELECT 
    ds.state_code,
    lg.id AS game_id,
    lg.display_name AS game_name,
    lg.game_key,
    df.status AS freshness_status,
    df.staleness_minutes,
    df.latest_draw_datetime_local,
    df.expected_next_draw_at,
    dir.id AS last_run_id,
    dir.status AS last_run_status,
    dir.draws_seen,
    dir.draws_inserted,
    dir.draws_updated,
    dir.finished_at AS last_run_finished_at,
    dir.error_count
FROM lottery_games lg
JOIN states s ON lg.state_code = s.code
LEFT JOIN draw_sources ds ON ds.game_id = lg.id AND ds.is_active = true
LEFT JOIN draw_freshness_status df ON df.game_id = lg.id
LEFT JOIN LATERAL (
    SELECT id, status, draws_seen, draws_inserted, draws_updated, finished_at, error_count
    FROM draw_ingestion_runs
    WHERE game_id = lg.id
    ORDER BY started_at DESC
    LIMIT 1
) dir ON true
WHERE lg.is_active = true
ORDER BY s.code, lg.display_name;

-- Enable RLS
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_deliveries ENABLE ROW LEVEL SECURITY;

-- Admin policies (BrewCommand access)
CREATE POLICY "Service role can manage alerts" ON public.system_alerts
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage alert events" ON public.alert_events
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage alert deliveries" ON public.alert_deliveries
    FOR ALL USING (auth.role() = 'service_role');

-- Read access for authenticated users (dashboard)
CREATE POLICY "Authenticated users can view alert center" ON public.v_brewcommand_alert_center
    FOR SELECT USING (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY "Authenticated users can view ingestion health" ON public.v_ingestion_health_summary
    FOR SELECT USING (auth.role() IN ('authenticated', 'service_role'));

-- Insert default alert configurations
INSERT INTO public.system_alerts (alert_key, alert_name, alert_type, severity, description, threshold_config, is_enabled, auto_resolve_minutes)
VALUES
    ('stale-data-critical', 'Critical Data Staleness', 'freshness', 'critical', 
     'Draw data has not been updated for extended period', 
     '{"staleness_threshold_minutes": 1440}', true, 60),
    
    ('stale-data-warning', 'Data Staleness Warning', 'freshness', 'warning', 
     'Draw data is getting stale', 
     '{"staleness_threshold_minutes": 720}', true, 240),
    
    ('ingestion-failure', 'Ingestion Run Failed', 'ingestion', 'critical', 
     'Scheduled or manual ingestion run failed', 
     '{"consecutive_failures": 3}', true, NULL),
    
    ('ingestion-degraded', 'Ingestion Degraded', 'ingestion', 'warning', 
     'Ingestion run completed with errors', 
     '{"error_threshold": 10}', true, 120),
    
    ('validation-failure', 'Validation Failed', 'validation', 'warning', 
     'Cross-source validation detected inconsistencies', 
     '{"failure_threshold": 5}', true, 60),
    
    ('duplicate-draws', 'Duplicate Draws Detected', 'ingestion', 'warning', 
     'Potential duplicate draws detected in data', 
     '{"duplicate_threshold": 1}', true, 30),
    
    ('low-record-count', 'Low Record Count', 'ingestion', 'info', 
     'Record count below expected threshold', 
     '{"min_records": 100}', true, NULL)
ON CONFLICT (alert_key) DO NOTHING;
