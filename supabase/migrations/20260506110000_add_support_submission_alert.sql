-- BrewLotto V1: Support submission alert config

INSERT INTO public.system_alerts (
    alert_key,
    alert_name,
    alert_type,
    severity,
    description,
    threshold_config,
    is_enabled,
    auto_resolve_minutes,
    notification_channels
)
VALUES (
    'support-submission',
    'Support Submission',
    'system',
    'info',
    'User-submitted support request from BrewU Systems area',
    '{}'::jsonb,
    true,
    NULL,
    '{"in_app": true, "email": true}'::jsonb
)
ON CONFLICT (alert_key) DO UPDATE SET
    alert_name = EXCLUDED.alert_name,
    alert_type = EXCLUDED.alert_type,
    severity = EXCLUDED.severity,
    description = EXCLUDED.description,
    threshold_config = EXCLUDED.threshold_config,
    is_enabled = EXCLUDED.is_enabled,
    auto_resolve_minutes = EXCLUDED.auto_resolve_minutes,
    notification_channels = EXCLUDED.notification_channels,
    updated_at = now();
