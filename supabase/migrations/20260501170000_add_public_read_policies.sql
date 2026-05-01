-- BrewLotto V1: Add public read policies for dashboard access
-- Allows anon and authenticated users to read draw data and game configs

DO $$
BEGIN
  -- Enable RLS on official_draws if not already
  ALTER TABLE public.official_draws ENABLE ROW LEVEL SECURITY;

  -- Anon/authenticated users can read all official_draws (draw results are public)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'official_draws'
    AND policyname = 'Anyone can view official draws'
  ) THEN
    CREATE POLICY "Anyone can view official draws" ON public.official_draws
      FOR SELECT USING (true);
  END IF;

  -- Anon/authenticated users can read lottery_games (game configs are public)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'lottery_games'
    AND policyname = 'Anyone can view lottery games'
  ) THEN
    CREATE POLICY "Anyone can view lottery games" ON public.lottery_games
      FOR SELECT USING (true);
  END IF;

  -- Anon/authenticated users can read draw_sources (source configs are public)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'draw_sources'
    AND policyname = 'Anyone can view draw sources'
  ) THEN
    CREATE POLICY "Anyone can view draw sources" ON public.draw_sources
      FOR SELECT USING (true);
  END IF;

  -- Re-assert security_invoker on user-scoped views
  ALTER VIEW IF EXISTS public.v_ingestion_health_summary SET (security_invoker = true);
END $$;
