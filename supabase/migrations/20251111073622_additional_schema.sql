-- BrewLotto V1: Additional Schema Tables (Simplified for V1)
-- Timestamp: 2026-03-19 ET
-- Purpose: Add missing tables from Brewlotto_v01.md specs that don't conflict with existing V1 schema

-- =========================================================
-- Extensions
-- =========================================================
create extension if not exists pgcrypto;

-- =========================================================
-- updated_at helper
-- =========================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- 1) STATES (reference table)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.states (
    code text PRIMARY KEY,
    name text NOT NULL,
    lottery_code text UNIQUE NULL,
    timezone text NOT NULL,
    is_active boolean DEFAULT true,
    launch_wave smallint DEFAULT 1,
    created_at timestamptz DEFAULT now()
);

-- =========================================================
-- 2) USER PREFERENCES (if not exists from V1)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    default_state_code text NULL,
    default_game_id uuid NULL,
    favorite_games jsonb DEFAULT '[]'::jsonb,
    favorite_strategy_labels jsonb DEFAULT '[]'::jsonb,
    budget_guardrails jsonb NULL,
    education_mode boolean DEFAULT true,
    show_advanced_explanations boolean DEFAULT false,
    notification_channels jsonb DEFAULT '{"in_app": true, "email": false}'::jsonb,
    updated_at timestamptz DEFAULT now()
);

-- =========================================================
-- 3) USER ENTITLEMENTS (if not exists from V1)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.user_entitlements (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tier_code text NOT NULL DEFAULT 'free',
    tier_rank smallint NOT NULL DEFAULT 1,
    ai_quota_monthly integer DEFAULT 0,
    ai_quota_used integer DEFAULT 0,
    pick_generation_limit_daily integer NULL,
    advanced_strategy_access boolean DEFAULT false,
    premium_explanations_access boolean DEFAULT false,
    premium_comparison_access boolean DEFAULT false,
    export_access boolean DEFAULT false,
    voice_commentary_access boolean DEFAULT false,
    notifications_premium_access boolean DEFAULT false,
    effective_from timestamptz DEFAULT now(),
    effective_to timestamptz NULL,
    updated_at timestamptz DEFAULT now()
);

-- =========================================================
-- 4) DRAW FRESHNESS STATUS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.draw_freshness_status (
    game_id uuid PRIMARY KEY REFERENCES lottery_games(id) ON DELETE CASCADE,
    latest_draw_id uuid NULL REFERENCES official_draws(id) ON DELETE SET NULL,
    latest_draw_datetime_local timestamptz NULL,
    latest_ingestion_run_id uuid NULL REFERENCES draw_ingestion_runs(id) ON DELETE SET NULL,
    expected_next_draw_at timestamptz NULL,
    staleness_minutes integer NULL,
    status text NOT NULL CHECK (status IN ('healthy', 'delayed', 'stale', 'failed')),
    updated_at timestamptz DEFAULT now()
);

-- =========================================================
-- 5) USER PICKS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.user_picks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    state text NOT NULL,
    game text NOT NULL,
    draw_date date NOT NULL,
    draw_time text NULL,
    numbers jsonb NOT NULL,
    bonus_number integer NULL,
    strategy_used text NULL,
    source text NOT NULL DEFAULT 'manual',
    is_saved boolean NOT NULL DEFAULT true,
    notes text NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT user_picks_game_check CHECK (game IN ('pick3', 'pick4', 'cash5', 'daily3', 'daily4', 'fantasy5', 'powerball', 'mega_millions')),
    CONSTRAINT user_picks_state_check CHECK (state IN ('NC', 'CA')),
    CONSTRAINT user_picks_draw_time_check CHECK (draw_time IS NULL OR draw_time IN ('midday', 'evening', 'nightly', 'draw')),
    CONSTRAINT user_picks_numbers_is_array CHECK (jsonb_typeof(numbers) = 'array')
);

CREATE INDEX IF NOT EXISTS idx_user_picks_user_id ON public.user_picks (user_id);
CREATE INDEX IF NOT EXISTS idx_user_picks_user_date ON public.user_picks (user_id, draw_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_picks_game_state_date ON public.user_picks (game, state, draw_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_picks_draw_time ON public.user_picks (draw_time);

DROP TRIGGER IF EXISTS trg_user_picks_updated_at ON public.user_picks;
CREATE TRIGGER trg_user_picks_updated_at BEFORE UPDATE ON public.user_picks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- 6) PICK RESULTS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.pick_results (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_pick_id uuid NOT NULL REFERENCES public.user_picks(id) ON DELETE CASCADE,
    user_id uuid NOT NULL,
    state text NOT NULL,
    game text NOT NULL,
    draw_date date NOT NULL,
    draw_time text NULL,
    official_numbers jsonb NOT NULL,
    official_bonus_number integer NULL,
    match_count integer NOT NULL DEFAULT 0,
    positional_match_count integer NOT NULL DEFAULT 0,
    bonus_match boolean NOT NULL DEFAULT false,
    result_code text NOT NULL,
    is_win boolean NOT NULL DEFAULT false,
    payout_tier text NULL,
    comparison_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT pick_results_game_check CHECK (game IN ('pick3', 'pick4', 'cash5', 'daily3', 'daily4', 'fantasy5', 'powerball', 'mega_millions')),
    CONSTRAINT pick_results_state_check CHECK (state IN ('NC', 'CA')),
    CONSTRAINT pick_results_user_pick_unique UNIQUE (user_pick_id),
    CONSTRAINT pick_results_official_numbers_is_array CHECK (jsonb_typeof(official_numbers) = 'array'),
    CONSTRAINT pick_results_match_count_nonnegative CHECK (match_count >= 0),
    CONSTRAINT pick_results_positional_match_count_nonnegative CHECK (positional_match_count >= 0)
);

CREATE INDEX IF NOT EXISTS idx_pick_results_user_id ON public.pick_results (user_id);
CREATE INDEX IF NOT EXISTS idx_pick_results_user_date ON public.pick_results (user_id, draw_date DESC);
CREATE INDEX IF NOT EXISTS idx_pick_results_game_state_date ON public.pick_results (game, state, draw_date DESC);
CREATE INDEX IF NOT EXISTS idx_pick_results_result_code ON public.pick_results (result_code);

DROP TRIGGER IF EXISTS trg_pick_results_updated_at ON public.pick_results;
CREATE TRIGGER trg_pick_results_updated_at BEFORE UPDATE ON public.pick_results FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- 7) USER DAILY STATS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.user_daily_stats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    stat_date date NOT NULL,
    picks_count integer NOT NULL DEFAULT 0,
    wins_count integer NOT NULL DEFAULT 0,
    partial_hits_count integer NOT NULL DEFAULT 0,
    exact_hits_count integer NOT NULL DEFAULT 0,
    accuracy numeric(6,2) NOT NULL DEFAULT 0.00,
    best_game text NULL,
    current_streak integer NOT NULL DEFAULT 0,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT user_daily_stats_unique UNIQUE (user_id, stat_date),
    CONSTRAINT user_daily_stats_counts_nonnegative CHECK (picks_count >= 0 AND wins_count >= 0 AND partial_hits_count >= 0 AND exact_hits_count >= 0 AND current_streak >= 0),
    CONSTRAINT user_daily_stats_accuracy_range CHECK (accuracy >= 0 AND accuracy <= 100)
);

CREATE INDEX IF NOT EXISTS idx_user_daily_stats_user_date ON public.user_daily_stats (user_id, stat_date DESC);

DROP TRIGGER IF EXISTS trg_user_daily_stats_updated_at ON public.user_daily_stats;
CREATE TRIGGER trg_user_daily_stats_updated_at BEFORE UPDATE ON public.user_daily_stats FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- 8) USER SETTINGS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.user_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    theme text NOT NULL DEFAULT 'dark',
    accent_mode text NOT NULL DEFAULT 'gold',
    voice_enabled boolean NOT NULL DEFAULT true,
    brew_commentary_enabled boolean NOT NULL DEFAULT true,
    strategy_explanations_enabled boolean NOT NULL DEFAULT true,
    motion_enabled boolean NOT NULL DEFAULT true,
    sound_effects_enabled boolean NOT NULL DEFAULT false,
    default_state text DEFAULT 'NC',
    default_game text DEFAULT 'pick3',
    auto_save_picks boolean NOT NULL DEFAULT true,
    show_results_first boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT user_settings_theme_check CHECK (theme IN ('dark', 'light', 'system')),
    CONSTRAINT user_settings_accent_mode_check CHECK (accent_mode IN ('gold', 'blue', 'auto')),
    CONSTRAINT user_settings_default_state_check CHECK (default_state IS NULL OR default_state IN ('NC', 'CA')),
    CONSTRAINT user_settings_default_game_check CHECK (default_game IS NULL OR default_game IN ('pick3', 'pick4', 'cash5', 'daily3', 'daily4', 'fantasy5', 'powerball', 'mega_millions'))
);

DROP TRIGGER IF EXISTS trg_user_settings_updated_at ON public.user_settings;
CREATE TRIGGER trg_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- 9) NOTIFICATION PREFERENCES
-- =========================================================
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    email_enabled boolean NOT NULL DEFAULT true,
    push_enabled boolean NOT NULL DEFAULT true,
    sms_enabled boolean NOT NULL DEFAULT false,
    draw_results_enabled boolean NOT NULL DEFAULT true,
    pick_reminders_enabled boolean NOT NULL DEFAULT true,
    streak_alerts_enabled boolean NOT NULL DEFAULT true,
    mission_alerts_enabled boolean NOT NULL DEFAULT true,
    promo_alerts_enabled boolean NOT NULL DEFAULT false,
    subscription_alerts_enabled boolean NOT NULL DEFAULT true,
    security_alerts_enabled boolean NOT NULL DEFAULT true,
    quiet_hours_enabled boolean NOT NULL DEFAULT false,
    quiet_hours_start time,
    quiet_hours_end time,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_notification_preferences_updated_at ON public.notification_preferences;
CREATE TRIGGER trg_notification_preferences_updated_at BEFORE UPDATE ON public.notification_preferences FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- 10) USER NOTIFICATIONS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.user_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type text NOT NULL,
    title text NOT NULL,
    body text,
    cta_label text,
    cta_url text,
    is_read boolean NOT NULL DEFAULT false,
    priority text NOT NULL DEFAULT 'normal',
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    read_at timestamptz,
    CONSTRAINT user_notifications_type_check CHECK (type IN ('draw_result', 'pick_reminder', 'streak', 'mission', 'achievement', 'subscription', 'security', 'system')),
    CONSTRAINT user_notifications_priority_check CHECK (priority IN ('low', 'normal', 'high', 'critical'))
);

CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON public.user_notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_read ON public.user_notifications (user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_user_notifications_created_at ON public.user_notifications (created_at DESC);

-- =========================================================
-- 11) SUBSCRIPTION TIERS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.subscription_tiers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tier_key text NOT NULL UNIQUE,
    display_name text NOT NULL,
    marketing_label text,
    price_monthly numeric(10,2),
    price_annual numeric(10,2),
    sort_order integer NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT subscription_tiers_tier_key_check CHECK (tier_key IN ('free', 'starter', 'pro', 'master'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscription_tiers_sort_order ON public.subscription_tiers (sort_order);

DROP TRIGGER IF EXISTS trg_subscription_tiers_updated_at ON public.subscription_tiers;
CREATE TRIGGER trg_subscription_tiers_updated_at BEFORE UPDATE ON public.subscription_tiers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- 12) STRATEGY REGISTRY
-- =========================================================
CREATE TABLE IF NOT EXISTS public.strategy_registry (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    strategy_key text NOT NULL UNIQUE,
    internal_name text NOT NULL,
    public_name text NOT NULL,
    voice_alias text,
    description text,
    category text NOT NULL DEFAULT 'core',
    min_tier text NOT NULL DEFAULT 'free',
    is_active boolean NOT NULL DEFAULT true,
    is_experimental boolean NOT NULL DEFAULT false,
    sort_order integer NOT NULL DEFAULT 100,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT strategy_registry_min_tier_check CHECK (min_tier IN ('free', 'starter', 'pro', 'master')),
    CONSTRAINT strategy_registry_category_check CHECK (category IN ('core', 'advanced', 'ai', 'utility', 'experimental'))
);

CREATE INDEX IF NOT EXISTS idx_strategy_registry_min_tier ON public.strategy_registry (min_tier);
CREATE INDEX IF NOT EXISTS idx_strategy_registry_is_active ON public.strategy_registry (is_active);

DROP TRIGGER IF EXISTS trg_strategy_registry_updated_at ON public.strategy_registry;
CREATE TRIGGER trg_strategy_registry_updated_at BEFORE UPDATE ON public.strategy_registry FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- 13) FEATURE ENTITLEMENTS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.feature_entitlements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_key text NOT NULL UNIQUE,
    feature_name text NOT NULL,
    description text,
    category text NOT NULL DEFAULT 'general',
    min_tier text NOT NULL DEFAULT 'free',
    is_active boolean NOT NULL DEFAULT true,
    sort_order integer NOT NULL DEFAULT 100,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT feature_entitlements_min_tier_check CHECK (min_tier IN ('free', 'starter', 'pro', 'master')),
    CONSTRAINT feature_entitlements_category_check CHECK (category IN ('general', 'strategy', 'history', 'alerts', 'commentary', 'analytics', 'export', 'admin'))
);

CREATE INDEX IF NOT EXISTS idx_feature_entitlements_min_tier ON public.feature_entitlements (min_tier);

DROP TRIGGER IF EXISTS trg_feature_entitlements_updated_at ON public.feature_entitlements;
CREATE TRIGGER trg_feature_entitlements_updated_at BEFORE UPDATE ON public.feature_entitlements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- 14) USER SAVED STRATEGIES
-- =========================================================
CREATE TABLE IF NOT EXISTS public.user_saved_strategies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    strategy_id uuid NOT NULL REFERENCES public.strategy_registry(id) ON DELETE CASCADE,
    nickname text,
    notes text,
    is_favorite boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT user_saved_strategies_unique UNIQUE (user_id, strategy_id)
);

CREATE INDEX IF NOT EXISTS idx_user_saved_strategies_user_id ON public.user_saved_strategies (user_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_strategies_strategy_id ON public.user_saved_strategies (strategy_id);

DROP TRIGGER IF EXISTS trg_user_saved_strategies_updated_at ON public.user_saved_strategies;
CREATE TRIGGER trg_user_saved_strategies_updated_at BEFORE UPDATE ON public.user_saved_strategies FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- 15) USER STRATEGY ACTIVITY
-- =========================================================
CREATE TABLE IF NOT EXISTS public.user_strategy_activity (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    strategy_id uuid NOT NULL REFERENCES public.strategy_registry(id) ON DELETE CASCADE,
    game text,
    state text,
    context text NOT NULL DEFAULT 'prediction',
    prediction_id uuid,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    occurred_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT user_strategy_activity_context_check CHECK (context IN ('prediction', 'locker_view', 'comparison', 'explanation', 'favorite'))
);

CREATE INDEX IF NOT EXISTS idx_user_strategy_activity_user_id ON public.user_strategy_activity (user_id);
CREATE INDEX IF NOT EXISTS idx_user_strategy_activity_strategy_id ON public.user_strategy_activity (strategy_id);
CREATE INDEX IF NOT EXISTS idx_user_strategy_activity_occurred_at ON public.user_strategy_activity (occurred_at DESC);

-- =========================================================
-- 16) USER ENTITLEMENT OVERRIDES
-- =========================================================
CREATE TABLE IF NOT EXISTS public.user_entitlement_overrides (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    feature_key text,
    strategy_key text,
    access_granted boolean NOT NULL DEFAULT true,
    reason text,
    starts_at timestamptz,
    ends_at timestamptz,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT user_entitlement_overrides_target_check CHECK (
        (feature_key IS NOT NULL AND strategy_key IS NULL) OR
        (feature_key IS NULL AND strategy_key IS NOT NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_user_entitlement_overrides_user_id ON public.user_entitlement_overrides (user_id);

-- =========================================================
-- 17) PLAY LOGS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.play_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    prediction_id uuid NULL REFERENCES public.predictions(id) ON DELETE SET NULL,
    user_pick_id uuid NULL REFERENCES public.user_picks(id) ON DELETE SET NULL,
    state text NOT NULL,
    game text NOT NULL,
    draw_date date NOT NULL,
    draw_time text,
    played_numbers jsonb NOT NULL,
    played_bonus_number integer,
    play_source text NOT NULL DEFAULT 'saved_prediction',
    amount_spent numeric(10,2),
    was_played boolean NOT NULL DEFAULT true,
    is_settled boolean NOT NULL DEFAULT false,
    settled_at timestamptz,
    outcome_result_code text,
    outcome_match_count integer,
    outcome_bonus_match boolean,
    outcome_payout_amount numeric(10,2),
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT play_logs_state_check CHECK (state IN ('NC', 'CA')),
    CONSTRAINT play_logs_game_check CHECK (game IN ('pick3', 'pick4', 'cash5', 'daily3', 'daily4', 'fantasy5', 'powerball', 'mega_millions')),
    CONSTRAINT play_logs_source_check CHECK (play_source IN ('saved_prediction', 'manual_entry', 'quick_pick', 'import')),
    CONSTRAINT play_logs_numbers_is_array CHECK (jsonb_typeof(played_numbers) = 'array'),
    CONSTRAINT play_logs_amount_spent_nonnegative CHECK (amount_spent IS NULL OR amount_spent >= 0),
    CONSTRAINT play_logs_payout_nonnegative CHECK (outcome_payout_amount IS NULL OR outcome_payout_amount >= 0),
    CONSTRAINT play_logs_match_count_nonnegative CHECK (outcome_match_count IS NULL OR outcome_match_count >= 0)
);

CREATE INDEX IF NOT EXISTS idx_play_logs_user_id ON public.play_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_play_logs_user_date ON public.play_logs (user_id, draw_date DESC);
CREATE INDEX IF NOT EXISTS idx_play_logs_prediction_id ON public.play_logs (prediction_id);
CREATE INDEX IF NOT EXISTS idx_play_logs_user_pick_id ON public.play_logs (user_pick_id);

DROP TRIGGER IF EXISTS trg_play_logs_updated_at ON public.play_logs;
CREATE TRIGGER trg_play_logs_updated_at BEFORE UPDATE ON public.play_logs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- 18) WATCHLIST NUMBERS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.watchlist_numbers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    watchlist_id uuid NOT NULL REFERENCES public.watchlists(id) ON DELETE CASCADE,
    numbers jsonb NOT NULL,
    bonus_number integer,
    label text,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT watchlist_numbers_is_array CHECK (jsonb_typeof(numbers) = 'array')
);

CREATE INDEX IF NOT EXISTS idx_watchlist_numbers_watchlist_id ON public.watchlist_numbers (watchlist_id);

-- =========================================================
-- HELPER VIEWS AND FUNCTIONS
-- =========================================================

-- Tier ranking function
CREATE OR REPLACE FUNCTION public.tier_rank(tier text)
RETURNS integer
LANGUAGE sql
IMMUTABLE AS $$
  SELECT CASE tier
    WHEN 'free' THEN 0
    WHEN 'starter' THEN 1
    WHEN 'pro' THEN 2
    WHEN 'master' THEN 3
    ELSE -1
  END;
$$;

-- User current tier view
CREATE OR REPLACE VIEW public.v_user_current_tier AS
SELECT
  p.id as user_id,
  COALESCE(
    (SELECT sp.code FROM subscription_products sp 
     JOIN user_subscriptions us ON us.subscription_product_id = sp.id 
     WHERE us.user_id = p.id AND us.status IN ('active', 'trialing') LIMIT 1),
    'free'
  ) as tier_key
FROM public.profiles p;

-- Strategy access view
CREATE OR REPLACE VIEW public.v_user_strategy_access AS
SELECT
  uct.user_id,
  sr.id as strategy_id,
  sr.strategy_key,
  sr.internal_name,
  sr.public_name,
  sr.voice_alias,
  sr.description,
  sr.category,
  sr.min_tier,
  sr.is_active,
  uct.tier_key as user_tier,
  CASE
    WHEN public.tier_rank(uct.tier_key) >= public.tier_rank(sr.min_tier) THEN true
    ELSE false
  END as has_access
FROM public.v_user_current_tier uct
CROSS JOIN public.strategy_registry sr
WHERE sr.is_active = true;

-- Feature access view
CREATE OR REPLACE VIEW public.v_user_feature_access AS
SELECT
  uct.user_id,
  fe.feature_key,
  fe.feature_name,
  fe.description,
  fe.category,
  fe.min_tier,
  fe.is_active,
  uct.tier_key as user_tier,
  CASE
    WHEN public.tier_rank(uct.tier_key) >= public.tier_rank(fe.min_tier) THEN true
    ELSE false
  END as has_access
FROM public.v_user_current_tier uct
CROSS JOIN public.feature_entitlements fe
WHERE fe.is_active = true;

-- User picks with results view
CREATE OR REPLACE VIEW public.v_user_picks_with_results AS
SELECT
  up.id as user_pick_id,
  up.user_id,
  up.state,
  up.game,
  up.draw_date,
  up.draw_time,
  up.numbers as user_numbers,
  up.bonus_number as user_bonus_number,
  up.strategy_used,
  up.source,
  up.is_saved,
  up.created_at as pick_created_at,
  pr.id as pick_result_id,
  pr.official_numbers,
  pr.official_bonus_number,
  pr.match_count,
  pr.positional_match_count,
  pr.bonus_match,
  pr.result_code,
  pr.is_win,
  pr.payout_tier,
  pr.comparison_metadata,
  pr.created_at as result_created_at
FROM public.user_picks up
LEFT JOIN public.pick_results pr ON pr.user_pick_id = up.id;

-- =========================================================
-- RLS POLICIES
-- =========================================================
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_freshness_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pick_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategy_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_strategy_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_entitlement_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.play_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist_numbers ENABLE ROW LEVEL SECURITY;

-- States policies
DROP POLICY IF EXISTS "states_select_all" ON public.states;
CREATE POLICY "states_select_all" ON public.states FOR SELECT TO authenticated USING (true);

-- User preferences policies
DROP POLICY IF EXISTS "user_preferences_select_own" ON public.user_preferences;
CREATE POLICY "user_preferences_select_own" ON public.user_preferences FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_preferences_insert_own" ON public.user_preferences;
CREATE POLICY "user_preferences_insert_own" ON public.user_preferences FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_preferences_update_own" ON public.user_preferences;
CREATE POLICY "user_preferences_update_own" ON public.user_preferences FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User entitlements policies
DROP POLICY IF EXISTS "user_entitlements_select_own" ON public.user_entitlements;
CREATE POLICY "user_entitlements_select_own" ON public.user_entitlements FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_entitlements_update_own" ON public.user_entitlements;
CREATE POLICY "user_entitlements_update_own" ON public.user_entitlements FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Draw freshness status policies
DROP POLICY IF EXISTS "draw_freshness_status_select_all" ON public.draw_freshness_status;
CREATE POLICY "draw_freshness_status_select_all" ON public.draw_freshness_status FOR SELECT TO authenticated USING (true);

-- User picks policies
DROP POLICY IF EXISTS "user_picks_select_own" ON public.user_picks;
CREATE POLICY "user_picks_select_own" ON public.user_picks FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_picks_insert_own" ON public.user_picks;
CREATE POLICY "user_picks_insert_own" ON public.user_picks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_picks_update_own" ON public.user_picks;
CREATE POLICY "user_picks_update_own" ON public.user_picks FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_picks_delete_own" ON public.user_picks;
CREATE POLICY "user_picks_delete_own" ON public.user_picks FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Pick results policies
DROP POLICY IF EXISTS "pick_results_select_own" ON public.pick_results;
CREATE POLICY "pick_results_select_own" ON public.pick_results FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "pick_results_insert_own" ON public.pick_results;
CREATE POLICY "pick_results_insert_own" ON public.pick_results FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "pick_results_update_own" ON public.pick_results;
CREATE POLICY "pick_results_update_own" ON public.pick_results FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User daily stats policies
DROP POLICY IF EXISTS "user_daily_stats_select_own" ON public.user_daily_stats;
CREATE POLICY "user_daily_stats_select_own" ON public.user_daily_stats FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_daily_stats_insert_own" ON public.user_daily_stats;
CREATE POLICY "user_daily_stats_insert_own" ON public.user_daily_stats FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_daily_stats_update_own" ON public.user_daily_stats;
CREATE POLICY "user_daily_stats_update_own" ON public.user_daily_stats FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User settings policies
DROP POLICY IF EXISTS "user_settings_select_own" ON public.user_settings;
CREATE POLICY "user_settings_select_own" ON public.user_settings FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_settings_insert_own" ON public.user_settings;
CREATE POLICY "user_settings_insert_own" ON public.user_settings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_settings_update_own" ON public.user_settings;
CREATE POLICY "user_settings_update_own" ON public.user_settings FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Notification preferences policies
DROP POLICY IF EXISTS "notification_preferences_select_own" ON public.notification_preferences;
CREATE POLICY "notification_preferences_select_own" ON public.notification_preferences FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notification_preferences_insert_own" ON public.notification_preferences;
CREATE POLICY "notification_preferences_insert_own" ON public.notification_preferences FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notification_preferences_update_own" ON public.notification_preferences;
CREATE POLICY "notification_preferences_update_own" ON public.notification_preferences FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User notifications policies
DROP POLICY IF EXISTS "user_notifications_select_own" ON public.user_notifications;
CREATE POLICY "user_notifications_select_own" ON public.user_notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_notifications_update_own" ON public.user_notifications;
CREATE POLICY "user_notifications_update_own" ON public.user_notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Subscription tiers policies (read-only for all authenticated)
DROP POLICY IF EXISTS "subscription_tiers_select_all" ON public.subscription_tiers;
CREATE POLICY "subscription_tiers_select_all" ON public.subscription_tiers FOR SELECT TO authenticated USING (true);

-- Strategy registry policies (read-only for all authenticated)
DROP POLICY IF EXISTS "strategy_registry_select_all" ON public.strategy_registry;
CREATE POLICY "strategy_registry_select_all" ON public.strategy_registry FOR SELECT TO authenticated USING (true);

-- Feature entitlements policies (read-only for all authenticated)
DROP POLICY IF EXISTS "feature_entitlements_select_all" ON public.feature_entitlements;
CREATE POLICY "feature_entitlements_select_all" ON public.feature_entitlements FOR SELECT TO authenticated USING (true);

-- User saved strategies policies
DROP POLICY IF EXISTS "user_saved_strategies_select_own" ON public.user_saved_strategies;
CREATE POLICY "user_saved_strategies_select_own" ON public.user_saved_strategies FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_saved_strategies_insert_own" ON public.user_saved_strategies;
CREATE POLICY "user_saved_strategies_insert_own" ON public.user_saved_strategies FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_saved_strategies_update_own" ON public.user_saved_strategies;
CREATE POLICY "user_saved_strategies_update_own" ON public.user_saved_strategies FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_saved_strategies_delete_own" ON public.user_saved_strategies;
CREATE POLICY "user_saved_strategies_delete_own" ON public.user_saved_strategies FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- User strategy activity policies
DROP POLICY IF EXISTS "user_strategy_activity_select_own" ON public.user_strategy_activity;
CREATE POLICY "user_strategy_activity_select_own" ON public.user_strategy_activity FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_strategy_activity_insert_own" ON public.user_strategy_activity;
CREATE POLICY "user_strategy_activity_insert_own" ON public.user_strategy_activity FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- User entitlement overrides policies
DROP POLICY IF EXISTS "user_entitlement_overrides_select_own" ON public.user_entitlement_overrides;
CREATE POLICY "user_entitlement_overrides_select_own" ON public.user_entitlement_overrides FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_entitlement_overrides_insert_own" ON public.user_entitlement_overrides;
CREATE POLICY "user_entitlement_overrides_insert_own" ON public.user_entitlement_overrides FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_entitlement_overrides_update_own" ON public.user_entitlement_overrides;
CREATE POLICY "user_entitlement_overrides_update_own" ON public.user_entitlement_overrides FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_entitlement_overrides_delete_own" ON public.user_entitlement_overrides;
CREATE POLICY "user_entitlement_overrides_delete_own" ON public.user_entitlement_overrides FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Play logs policies
DROP POLICY IF EXISTS "play_logs_select_own" ON public.play_logs;
CREATE POLICY "play_logs_select_own" ON public.play_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "play_logs_insert_own" ON public.play_logs;
CREATE POLICY "play_logs_insert_own" ON public.play_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "play_logs_update_own" ON public.play_logs;
CREATE POLICY "play_logs_update_own" ON public.play_logs FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "play_logs_delete_own" ON public.play_logs;
CREATE POLICY "play_logs_delete_own" ON public.play_logs FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Watchlist numbers policies
DROP POLICY IF EXISTS "watchlist_numbers_select_own" ON public.watchlist_numbers;
CREATE POLICY "watchlist_numbers_select_own" ON public.watchlist_numbers FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.watchlists w WHERE w.id = watchlist_id AND w.user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "watchlist_numbers_insert_own" ON public.watchlist_numbers;
CREATE POLICY "watchlist_numbers_insert_own" ON public.watchlist_numbers FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.watchlists w WHERE w.id = watchlist_id AND w.user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "watchlist_numbers_update_own" ON public.watchlist_numbers;
CREATE POLICY "watchlist_numbers_update_own" ON public.watchlist_numbers FOR UPDATE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.watchlists w WHERE w.id = watchlist_id AND w.user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "watchlist_numbers_delete_own" ON public.watchlist_numbers;
CREATE POLICY "watchlist_numbers_delete_own" ON public.watchlist_numbers FOR DELETE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.watchlists w WHERE w.id = watchlist_id AND w.user_id = auth.uid()
    )
);

-- =========================================================
-- SEED DATA
-- =========================================================

-- Seed subscription tiers
INSERT INTO public.subscription_tiers (tier_key, display_name, marketing_label, price_monthly, price_annual, sort_order)
VALUES
    ('free', 'Free Explorer', 'Free Explorer', 0.00, 0.00, 0),
    ('starter', 'BrewStarter', 'BrewStarter', 4.99, NULL, 1),
    ('pro', 'BrewPro', 'BrewPro', 9.99, NULL, 2),
    ('master', 'BrewMaster', 'BrewMaster', 19.99, NULL, 3)
ON CONFLICT (tier_key) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    marketing_label = EXCLUDED.marketing_label,
    price_monthly = EXCLUDED.price_monthly,
    price_annual = EXCLUDED.price_annual,
    sort_order = EXCLUDED.sort_order;

-- Seed strategy registry
INSERT INTO public.strategy_registry (strategy_key, internal_name, public_name, voice_alias, description, category, min_tier, sort_order, metadata)
VALUES
    ('hot_cold', 'hotCold', 'Hot / Cold', 'Heat Check', 'Basic hot and cold number analysis.', 'core', 'free', 10, '{"ui_group":"starter"}'::jsonb),
    ('momentum', 'momentum', 'Momentum', 'Momentum Pulse', 'Tracks trend acceleration and recent number movement.', 'core', 'free', 20, '{"ui_group":"starter"}'::jsonb),
    ('poisson_basic', 'poissonBasic', 'Poisson', 'Classic Flow', 'Basic statistical probability modeling.', 'advanced', 'starter', 30, '{"ui_group":"starter"}'::jsonb),
    ('strategy_explanations', 'strategyExplanations', 'Strategy Explanations', 'Why This Pick', 'Expanded reasoning and pick explanation layer.', 'utility', 'starter', 40, '{"ui_group":"locker"}'::jsonb),
    ('advanced_scoring', 'advancedScoring', 'Advanced Strategy Scoring', 'Scoring Matrix', 'Ranks candidate picks with richer weighted scoring.', 'advanced', 'pro', 50, '{"ui_group":"pro"}'::jsonb),
    ('confidence_bands', 'confidenceBands', 'Confidence Bands', 'Confidence View', 'Adds confidence ranges and comparison bands to picks.', 'advanced', 'pro', 60, '{"ui_group":"pro"}'::jsonb),
    ('prediction_comparisons', 'predictionComparisons', 'Prediction Comparisons', 'Compare Paths', 'Compare multiple ranked picks and strategy outputs.', 'advanced', 'pro', 70, '{"ui_group":"pro"}'::jsonb),
    ('deep_ai_explanations', 'deepAiExplanations', 'Deep AI Explanations', 'Deep Brew Insight', 'Richer AI commentary and advanced explanation threads.', 'ai', 'master', 80, '{"ui_group":"master"}'::jsonb),
    ('early_access_strategies', 'earlyAccessStrategies', 'Early Access Strategies', 'Beta Lab', 'Preview upcoming models and strategies before broad release.', 'experimental', 'master', 90, '{"ui_group":"master"}'::jsonb)
ON CONFLICT (strategy_key) DO UPDATE SET
    internal_name = EXCLUDED.internal_name,
    public_name = EXCLUDED.public_name,
    voice_alias = EXCLUDED.voice_alias,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    min_tier = EXCLUDED.min_tier,
    sort_order = EXCLUDED.sort_order,
    metadata = EXCLUDED.metadata;

-- Seed feature entitlements
INSERT INTO public.feature_entitlements (feature_key, feature_name, description, category, min_tier, sort_order)
VALUES
    ('basic_predictions', 'Basic Predictions', 'Core prediction generation.', 'general', 'free', 10),
    ('prediction_history_basic', 'Prediction History', 'Limited prediction history.', 'history', 'free', 20),
    ('saved_pick_tracking', 'Saved Pick Tracking', 'Save and track picks over time.', 'general', 'starter', 30),
    ('strategy_locker', 'Strategy Locker', 'Access Strategy Locker core experience.', 'strategy', 'starter', 40),
    ('notifications_hot', 'Hot Number Notifications', 'Notifications when hot numbers or watched events appear.', 'alerts', 'pro', 50),
    ('advanced_visual_insights', 'Advanced Visual Insights', 'Enhanced overlays and comparisons.', 'analytics', 'pro', 60),
    ('advanced_analytics_dash', 'Advanced Analytics', 'Extended analytics dashboard and deeper trends.', 'analytics', 'master', 70),
    ('deep_history_analysis', 'Deep History Analysis', 'Extended draw history and deeper comparisons.', 'history', 'master', 80),
    ('early_access_features', 'Early Access Features', 'Access beta strategies and experimental features.', 'general', 'master', 90)
ON CONFLICT (feature_key) DO UPDATE SET
    feature_name = EXCLUDED.feature_name,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    min_tier = EXCLUDED.min_tier,
    sort_order = EXCLUDED.sort_order;

-- Seed states
INSERT INTO public.states (code, name, lottery_code, timezone, is_active, launch_wave)
VALUES 
    ('NC', 'North Carolina', 'NC-LOTTERY', 'America/New_York', true, 1),
    ('CA', 'California', 'CA-LOTTERY', 'America/Los_Angeles', true, 1)
ON CONFLICT (code) DO NOTHING;
