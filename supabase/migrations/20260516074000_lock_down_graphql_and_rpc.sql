-- BrewLotto V1: lock down anonymous GraphQL exposure and admin-only RPC execution.

-- Anonymous users should not discover the public schema. The app's real data paths
-- go through authenticated browser sessions or service-role server routes.
REVOKE SELECT ON ALL TABLES IN SCHEMA public FROM anon;

-- Admin and internal helper surfaces should not be discoverable to every signed-in user.
REVOKE SELECT ON TABLE
  public.admin_operations,
  public.alert_deliveries,
  public.alert_events,
  public.audit_logs,
  public.brew_sentinel_logs,
  public.brewtruth_validations,
  public.brewcommand_settings,
  public.billing_webhook_events,
  public.draw_feature_snapshots,
  public.draw_freshness_status,
  public.draw_ingestion_errors,
  public.draw_ingestion_runs,
  public.draw_results,
  public.draw_schedule_windows,
  public.draw_sources,
  public.feature_flags,
  public.game_settings,
  public.game_variants,
  public.geo_audit_logs,
  public.lottery_games,
  public.official_draw_number_facts,
  public.official_draws,
  public.odds,
  public.play_log,
  public.play_settlements,
  public.prediction_requests,
  public.provider_routing_logs,
  public.states,
  public.subscription_products,
  public.system_alerts,
  public.users,
  public.profiles,
  public.support_requests,
  public.qa_reports,
  public.ai_usage_events,
  public.user_entitlement_overrides,
  public.user_subscriptions,
  public.v_brewcommand_alert_center,
  public.v_ingestion_health_summary,
  public.v_user_current_tier,
  public.v_user_feature_access,
  public.v_user_picks_with_results,
  public.v_user_strategy_access
FROM authenticated;

-- SECURITY DEFINER RPCs should be callable only by the service role.
REVOKE EXECUTE ON FUNCTION public.raise_system_alert(
  text,
  text,
  text,
  text,
  uuid,
  text,
  jsonb
) FROM anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.acknowledge_system_alert(
  uuid,
  uuid
) FROM anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.resolve_system_alert(
  uuid,
  uuid
) FROM anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.escalate_system_alert(
  uuid
) FROM anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.execute_sql(
  text
) FROM anon, authenticated;

DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'public.admin_operations',
    'public.audit_logs',
    'public.badges',
    'public.billing_webhook_events',
    'public.brewtruth_validations',
    'public.brewwu_lite_progress',
    'public.draw_feature_snapshots',
    'public.draw_ingestion_errors',
    'public.draw_ingestion_runs',
    'public.draw_results',
    'public.draw_schedule_windows',
    'public.feature_flags',
    'public.game_variants',
    'public.notifications',
    'public.official_draw_number_facts',
    'public.play_settlements',
    'public.prediction_requests',
    'public.prediction_strategy_scores',
    'public.provider_routing_logs',
    'public.saved_picks',
    'public.subscription_products',
    'public.user_streaks',
    'public.user_subscriptions',
    'public.watchlists'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %s', 'service_role_all_access', tbl);
    EXECUTE format(
      'CREATE POLICY %I ON %s FOR ALL TO service_role USING (true) WITH CHECK (true)',
      'service_role_all_access',
      tbl
    );
  END LOOP;
END
$$;
