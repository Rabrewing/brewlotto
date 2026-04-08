-- BrewLotto V1: fix Supabase security lints for user views and alert tables

-- Ensure user-scoped views execute with the querying user's privileges.
ALTER VIEW public.v_user_current_tier SET (security_invoker = true);
ALTER VIEW public.v_user_strategy_access SET (security_invoker = true);
ALTER VIEW public.v_user_feature_access SET (security_invoker = true);
ALTER VIEW public.v_user_picks_with_results SET (security_invoker = true);

-- Re-assert RLS for public alert tables in case older environments missed it.
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_deliveries ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'system_alerts'
      AND policyname = 'Service role can manage alerts'
  ) THEN
    CREATE POLICY "Service role can manage alerts" ON public.system_alerts
      FOR ALL USING (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'alert_events'
      AND policyname = 'Service role can manage alert events'
  ) THEN
    CREATE POLICY "Service role can manage alert events" ON public.alert_events
      FOR ALL USING (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'alert_deliveries'
      AND policyname = 'Service role can manage alert deliveries'
  ) THEN
    CREATE POLICY "Service role can manage alert deliveries" ON public.alert_deliveries
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;
