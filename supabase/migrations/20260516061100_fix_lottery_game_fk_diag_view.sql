-- Keep the lottery game FK diagnostic view, but make it respect caller RLS.
-- Supabase linter: security_definer_view_public___lottery_game_fk_diag

ALTER VIEW IF EXISTS public.__lottery_game_fk_diag SET (security_invoker = true);
