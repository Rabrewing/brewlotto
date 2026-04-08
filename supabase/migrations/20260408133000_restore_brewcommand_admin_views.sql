-- BrewLotto V1: restore BrewCommand admin views and alert RPCs safely.

-- Alert helper functions. Keep SECURITY DEFINER because these are service/admin operations.
CREATE OR REPLACE FUNCTION public.raise_system_alert(
    p_alert_key text,
    p_severity text,
    p_title text,
    p_message text,
    p_game_id uuid DEFAULT NULL,
    p_state_code text DEFAULT NULL,
    p_event_data jsonb DEFAULT '{}'::jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_alert_id uuid;
    v_event_id uuid;
BEGIN
    SELECT id INTO v_alert_id
    FROM public.system_alerts
    WHERE alert_key = p_alert_key
      AND is_enabled = true;

    IF v_alert_id IS NULL THEN
        RAISE WARNING 'Alert key % not found or disabled', p_alert_key;
        RETURN NULL;
    END IF;

    INSERT INTO public.alert_events (
        alert_id,
        game_id,
        state_code,
        severity,
        status,
        title,
        message,
        event_data
    )
    VALUES (
        v_alert_id,
        p_game_id,
        p_state_code,
        p_severity,
        'raised',
        p_title,
        p_message,
        p_event_data
    )
    RETURNING id INTO v_event_id;

    RETURN v_event_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.acknowledge_system_alert(
    p_event_id uuid,
    p_user_id uuid
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.alert_events
    SET status = 'acknowledged',
        acknowledged_at = now(),
        acknowledged_by = p_user_id,
        updated_at = now()
    WHERE id = p_event_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.resolve_system_alert(
    p_event_id uuid,
    p_user_id uuid DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.alert_events
    SET status = 'resolved',
        resolved_at = now(),
        resolved_by = p_user_id,
        updated_at = now()
    WHERE id = p_event_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.escalate_system_alert(
    p_event_id uuid
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.alert_events
    SET status = 'escalated',
        severity = 'critical',
        escalated_at = now(),
        updated_at = now()
    WHERE id = p_event_id;
END;
$$;

-- BrewCommand alert center view. Uses auth.users columns that exist across Supabase projects.
CREATE OR REPLACE VIEW public.v_brewcommand_alert_center
WITH (security_invoker = true) AS
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
    NULLIF(ae.event_data ->> 'acknowledged_by_name', '') AS acknowledged_by_name,
    ae.resolved_at,
    NULLIF(ae.event_data ->> 'resolved_by_name', '') AS resolved_by_name,
    ae.escalated_at,
    ae.created_at,
    ae.updated_at,
    sa.is_enabled,
    sa.auto_resolve_minutes,
    sa.notification_channels
FROM public.alert_events ae
JOIN public.system_alerts sa ON ae.alert_id = sa.id
LEFT JOIN public.lottery_games lg ON ae.game_id = lg.id;

-- Ingestion health summary view. Avoids duplicate rows from draw_sources joins.
CREATE OR REPLACE VIEW public.v_ingestion_health_summary
WITH (security_invoker = true) AS
SELECT
    lg.state_code,
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
FROM public.lottery_games lg
LEFT JOIN public.draw_freshness_status df ON df.game_id = lg.id
LEFT JOIN LATERAL (
    SELECT id, status, draws_seen, draws_inserted, draws_updated, finished_at, error_count
    FROM public.draw_ingestion_runs
    WHERE game_id = lg.id
    ORDER BY started_at DESC
    LIMIT 1
) dir ON true
WHERE lg.is_active = true;

GRANT SELECT ON public.v_brewcommand_alert_center TO authenticated;
GRANT SELECT ON public.v_brewcommand_alert_center TO service_role;
GRANT SELECT ON public.v_ingestion_health_summary TO authenticated;
GRANT SELECT ON public.v_ingestion_health_summary TO service_role;
