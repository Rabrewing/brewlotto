-- BrewLotto V1 Initial Schema
-- Following the V1 specification for database schema

-- Drop existing extensions if needed (keeping the ones from original migration)
-- Creating V1 schema tables

-- 1. Identity and User Profile Tables
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name text,
    username text UNIQUE NULL,
    avatar_url text NULL,
    home_state_code text NULL,
    timezone text DEFAULT 'America/New_York',
    preferred_locale text DEFAULT 'en-US',
    marketing_opt_in boolean DEFAULT false,
    notifications_opt_in boolean DEFAULT true,
    voice_mode_enabled boolean DEFAULT false,
    onboarding_completed boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

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

-- 2. Subscription and Entitlement Tables
CREATE TABLE IF NOT EXISTS public.subscription_products (
    id uuid PRIMARY KEY,
    provider text NOT NULL DEFAULT 'stripe',
    provider_product_id text,
    provider_price_id text,
    code text UNIQUE NOT NULL, -- e.g. free, pro, elite, founder
    name text NOT NULL,
    billing_interval text CHECK (billing_interval IN ('month','year','lifetime')),
    is_active boolean DEFAULT true,
    rank smallint NOT NULL,
    feature_matrix jsonb NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id uuid PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider text NOT NULL DEFAULT 'stripe',
    provider_customer_id text,
    provider_subscription_id text UNIQUE,
    subscription_product_id uuid NOT NULL REFERENCES subscription_products(id),
    status text NOT NULL CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'expired')),
    current_period_start timestamptz NULL,
    current_period_end timestamptz NULL,
    cancel_at_period_end boolean DEFAULT false,
    trial_end timestamptz NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS public.billing_webhook_events (
    id uuid PRIMARY KEY,
    provider text NOT NULL,
    provider_event_id text UNIQUE NOT NULL,
    event_type text NOT NULL,
    payload jsonb NOT NULL,
    processed boolean DEFAULT false,
    processed_at timestamptz NULL,
    error_message text NULL,
    created_at timestamptz DEFAULT now()
);

-- 3. State and Game Catalog Tables
CREATE TABLE IF NOT EXISTS public.states (
    code text PRIMARY KEY, -- NC, CA
    name text NOT NULL,
    lottery_code text UNIQUE NULL,
    timezone text NOT NULL,
    is_active boolean DEFAULT true,
    launch_wave smallint DEFAULT 1,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lottery_games (
    id uuid PRIMARY KEY,
    state_code text NOT NULL REFERENCES states(code) ON DELETE CASCADE,
    game_key text NOT NULL, -- internal stable key
    display_name text NOT NULL,
    game_family text NOT NULL, -- pick3, pick4, pick5, cash5, mega_millions, powerball, etc.
    primary_count smallint NOT NULL,
    primary_min smallint NOT NULL,
    primary_max smallint NOT NULL,
    has_bonus boolean DEFAULT false,
    bonus_count smallint DEFAULT 0,
    bonus_min smallint NULL,
    bonus_max smallint NULL,
    bonus_label text NULL,
    draw_style text NOT NULL, -- day_evening, daily, weekly, jackpot
    supports_multiplier boolean DEFAULT false,
    supports_fireball boolean DEFAULT false,
    supports_double_play boolean DEFAULT false,
    supports_ez_match boolean DEFAULT false,
    schedule_config jsonb NOT NULL,
    odds_config jsonb NULL,
    payout_config jsonb NULL,
    ui_config jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT unique_state_game UNIQUE (state_code, game_key)
);

CREATE TABLE IF NOT EXISTS public.game_variants (
    id uuid PRIMARY KEY,
    game_id uuid NOT NULL REFERENCES lottery_games(id) ON DELETE CASCADE,
    variant_key text NOT NULL,
    display_name text NOT NULL,
    variant_type text NOT NULL,
    config jsonb NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT unique_game_variant UNIQUE (game_id, variant_key)
);

-- 4. Draw Schedules and Source Registry
CREATE TABLE IF NOT EXISTS public.draw_sources (
    id uuid PRIMARY KEY,
    state_code text NOT NULL,
    game_id uuid NULL REFERENCES lottery_games(id) ON DELETE SET NULL,
    source_key text NOT NULL,
    source_type text NOT NULL CHECK (source_type IN ('api', 'html', 'csv', 'rss', 'manual')),
    base_url text NOT NULL,
    auth_config jsonb NULL,
    parser_key text NOT NULL,
    priority smallint NOT NULL DEFAULT 1,
    is_official boolean DEFAULT true,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT unique_state_source UNIQUE (state_code, source_key)
);

CREATE TABLE IF NOT EXISTS public.draw_schedule_windows (
    id uuid PRIMARY KEY,
    game_id uuid NOT NULL REFERENCES lottery_games(id) ON DELETE CASCADE,
    window_label text NOT NULL, -- day, evening, nightly, monday, etc.
    schedule_type text NOT NULL CHECK (schedule_type IN ('daily', 'twice_daily', 'weekly')),
    day_of_week smallint NULL,
    local_draw_time time NOT NULL,
    cutoff_minutes_before integer NULL,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- 5. Official Draw History Tables
CREATE TABLE IF NOT EXISTS public.official_draws (
    id uuid PRIMARY KEY,
    game_id uuid NOT NULL REFERENCES lottery_games(id) ON DELETE CASCADE,
    draw_date date NOT NULL,
    draw_window_label text NULL, -- day, evening, nightly, etc.
    draw_datetime_local timestamptz NOT NULL,
    draw_sequence integer NULL, -- optional when multiple same-day windows
    primary_numbers smallint[] NOT NULL,
    bonus_numbers smallint[] DEFAULT '{}'::smallint[],
    multiplier_value smallint NULL,
    fireball_value smallint NULL,
    special_values jsonb DEFAULT '{}'::jsonb,
    jackpot_amount numeric(14,2) NULL,
    cash_value numeric(14,2) NULL,
    annuity_value numeric(14,2) NULL,
    source_id uuid NOT NULL REFERENCES draw_sources(id) ON DELETE CASCADE,
    source_draw_id text NULL,
    source_payload jsonb NULL,
    result_status text NOT NULL DEFAULT 'official',
    is_latest_snapshot boolean DEFAULT false,
    ingested_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    CONSTRAINT unique_draw UNIQUE (game_id, draw_date, draw_window_label, draw_sequence)
);

CREATE TABLE IF NOT EXISTS public.official_draw_number_facts (
    id uuid PRIMARY KEY,
    draw_id uuid NOT NULL REFERENCES official_draws(id) ON DELETE CASCADE,
    game_id uuid NOT NULL REFERENCES lottery_games(id) ON DELETE CASCADE,
    number_value smallint NOT NULL,
    number_type text NOT NULL CHECK (number_type IN ('primary', 'bonus', 'fireball', 'multiplier')),
    position_index smallint NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.draw_ingestion_runs (
    id uuid PRIMARY KEY,
    state_code text NOT NULL,
    game_id uuid NULL REFERENCES lottery_games(id) ON DELETE SET NULL,
    source_id uuid NOT NULL REFERENCES draw_sources(id) ON DELETE CASCADE,
    run_type text NOT NULL CHECK (run_type IN ('scheduled', 'manual', 'backfill', 'retry')),
    started_at timestamptz DEFAULT now(),
    finished_at timestamptz NULL,
    status text NOT NULL CHECK (status IN ('running', 'succeeded', 'partial', 'failed')),
    draws_seen integer DEFAULT 0,
    draws_inserted integer DEFAULT 0,
    draws_updated integer DEFAULT 0,
    draws_skipped integer DEFAULT 0,
    error_count integer DEFAULT 0,
    warning_count integer DEFAULT 0,
    freshness_observed_at timestamptz NULL,
    log_summary text NULL,
    metadata jsonb DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.draw_ingestion_errors (
    id uuid PRIMARY KEY,
    run_id uuid NOT NULL REFERENCES draw_ingestion_runs(id) ON DELETE CASCADE,
    severity text NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    error_code text NULL,
    message text NOT NULL,
    raw_context jsonb NULL,
    created_at timestamptz DEFAULT now()
);

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

-- 6. Feature Snapshots and Prediction Tables
CREATE TABLE IF NOT EXISTS public.draw_feature_snapshots (
    id uuid PRIMARY KEY,
    game_id uuid NOT NULL REFERENCES lottery_games(id) ON DELETE CASCADE,
    as_of_draw_id uuid NULL REFERENCES official_draws(id) ON DELETE SET NULL,
    as_of_datetime timestamptz NOT NULL,
    feature_version text NOT NULL,
    lookback_window integer NOT NULL,
    feature_payload jsonb NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.prediction_requests (
    id uuid PRIMARY KEY,
    user_id uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    game_id uuid NOT NULL REFERENCES lottery_games(id) ON DELETE CASCADE,
    request_source text NOT NULL CHECK (request_source IN ('dashboard', 'api', 'cron', 'admin', 'experiment')),
    entitlement_tier_code text NOT NULL DEFAULT 'free',
    variant_context jsonb DEFAULT '{}'::jsonb,
    requested_count smallint DEFAULT 1,
    requested_explanation_depth text DEFAULT 'short',
    request_hash text UNIQUE NULL,
    feature_snapshot_id uuid NULL REFERENCES draw_feature_snapshots(id) ON DELETE SET NULL,
    status text NOT NULL DEFAULT 'completed',
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.predictions (
    id uuid PRIMARY KEY,
    prediction_request_id uuid NOT NULL REFERENCES prediction_requests(id) ON DELETE CASCADE,
    game_id uuid NOT NULL REFERENCES lottery_games(id) ON DELETE CASCADE,
    user_id uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    target_draw_id uuid NULL REFERENCES official_draws(id) ON DELETE SET NULL,
    target_draw_date date NULL,
    target_draw_window_label text NULL,
    primary_numbers smallint[] NOT NULL,
    bonus_numbers smallint[] DEFAULT '{}'::smallint[],
    special_values jsonb DEFAULT '{}'::jsonb,
    composite_score numeric(8,4) NULL,
    confidence_band text NULL CHECK (confidence_band IN ('low', 'medium', 'elevated', 'experimental')),
    strategy_public_label text NULL,
    strategy_internal_bundle jsonb NOT NULL,
    evidence_bundle jsonb NOT NULL,
    prediction_hash text NOT NULL,
    is_saved_by_default boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT unique_prediction_hash UNIQUE (prediction_hash)
);

CREATE TABLE IF NOT EXISTS public.prediction_explanations (
    id uuid PRIMARY KEY,
    prediction_id uuid NOT NULL REFERENCES predictions(id) ON DELETE CASCADE,
    explanation_type text NOT NULL CHECK (explanation_type IN ('template', 'ai_short', 'ai_premium', 'comparison')),
    provider_name text NULL,
    model_name text NULL,
    content text NOT NULL,
    content_json jsonb NULL,
    brewtruth_output_class text NOT NULL,
    cached boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.prediction_strategy_scores (
    id uuid PRIMARY KEY,
    prediction_id uuid NOT NULL REFERENCES predictions(id) ON DELETE CASCADE,
    strategy_key text NOT NULL,
    public_label text NOT NULL,
    weight numeric(8,4) NOT NULL,
    score numeric(8,4) NOT NULL,
    notes jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now()
);

-- 7. User Play Logging and Settlement Tables
CREATE TABLE IF NOT EXISTS public.saved_picks (
    id uuid PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prediction_id uuid NULL REFERENCES predictions(id) ON DELETE SET NULL,
    game_id uuid NOT NULL REFERENCES lottery_games(id) ON DELETE CASCADE,
    pick_numbers jsonb NOT NULL, -- stores the actual numbers played
    stake_amount numeric(10,2) DEFAULT 1.00,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.play_settlements (
    id uuid PRIMARY KEY,
    saved_pick_id uuid NOT NULL REFERENCES saved_picks(id) ON DELETE CASCADE,
    draw_id uuid NOT NULL REFERENCES official_draws(id) ON DELETE CASCADE,
    matched_primary_count integer NOT NULL,
    matched_bonus_count integer NOT NULL,
    prize_amount numeric(14,2) DEFAULT 0.00,
    prize_tier text NULL,
    settled_at timestamptz DEFAULT now()
);

-- 8. Watchlists and Notifications
CREATE TABLE IF NOT EXISTS public.watchlists (
    id uuid PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id uuid NOT NULL REFERENCES lottery_games(id) ON DELETE CASCADE,
    name text NOT NULL,
    pick_numbers jsonb NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    body text NOT NULL,
    type text NOT NULL, -- info, warning, success, error, prediction_ready, settlement, etc.
    related_id uuid NULL, -- can reference predictions, saved_picks, etc.
    related_type text NULL, -- prediction, saved_pick, etc.
    is_read boolean DEFAULT false,
    is_dismissed boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- 9. Badges, Streaks, and BrewUniversity Lite Progress
CREATE TABLE IF NOT EXISTS public.badges (
    id uuid PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_key text NOT NULL,
    earned_at timestamptz DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT unique_user_badge UNIQUE (user_id, badge_key)
);

CREATE TABLE IF NOT EXISTS public.user_streaks (
    id uuid PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    streak_type text NOT NULL, -- daily_login, correct_prediction, etc.
    current_count integer DEFAULT 0,
    best_count integer DEFAULT 0,
    last_updated timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.brewwu_lite_progress (
    id uuid PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_key text NOT NULL,
    completed boolean DEFAULT false,
    completed_at timestamptz NULL,
    score integer NULL,
    CONSTRAINT unique_user_lesson UNIQUE (user_id, lesson_key)
);

-- 10. BrewTruth Audit and Governance
CREATE TABLE IF NOT EXISTS public.brewtruth_validations (
    id uuid PRIMARY KEY,
    prediction_id uuid NOT NULL REFERENCES predictions(id) ON DELETE CASCADE,
    validation_type text NOT NULL, -- strategy_consistency, statistical_significance, etc.
    passed boolean NOT NULL,
    score numeric(8,4) NULL,
    details jsonb DEFAULT '{}'::jsonb,
    validated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id uuid PRIMARY KEY,
    user_id uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    action text NOT NULL, -- user_login, prediction_generated, etc.
    entity_type text NULL, -- prediction, user_subscription, etc.
    entity_id uuid NULL,
    changes jsonb DEFAULT '{}'::jsonb,
    ip_address inet NULL,
    user_agent text NULL,
    created_at timestamptz DEFAULT now()
);

-- 11. AI/Provider Routing Telemetry
CREATE TABLE IF NOT EXISTS public.provider_routing_logs (
    id uuid PRIMARY KEY,
    request_id uuid NULL REFERENCES prediction_requests(id) ON DELETE SET NULL,
    provider_name text NOT NULL,
    model_name text NULL,
    prompt_tokens integer NULL,
    completion_tokens integer NULL,
    total_tokens integer NULL,
    cost_usd numeric(10,6) DEFAULT 0.0,
    latency_ms integer NULL,
    success boolean DEFAULT true,
    error_message text NULL,
    created_at timestamptz DEFAULT now()
);

-- 12. Admin / Feature Flags / Operations
CREATE TABLE IF NOT EXISTS public.feature_flags (
    id uuid PRIMARY KEY,
    flag_key text UNIQUE NOT NULL,
    name text NOT NULL,
    description text NULL,
    is_enabled boolean DEFAULT false,
    rollout_percentage integer DEFAULT 0, -- 0-100
    targeting_rules jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_operations (
    id uuid PRIMARY KEY,
    operation_type text NOT NULL, -- data_ingestion, strategy_execution, etc.
    status text NOT NULL, -- pending, running, completed, failed
    started_by uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    started_at timestamptz DEFAULT now(),
    finished_at timestamptz NULL,
    details jsonb DEFAULT '{}'::jsonb,
    error_message text NULL
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lottery_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_schedule_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.official_draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.official_draw_number_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_ingestion_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_ingestion_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_freshness_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_feature_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_explanations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_strategy_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.play_settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brewwu_lite_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brewtruth_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_routing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_operations ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (to be customized further)
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own preferences" ON public.user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON public.user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- Service role bypass for system operations
CREATE POLICY "Service role can do everything" ON public.profiles
    FOR ALL USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Similar policies would be created for other tables in a production environment
-- For now, we'll establish the foundation

-- Insert initial state data
INSERT INTO public.states (code, name, lottery_code, timezone, is_active, launch_wave)
VALUES 
    ('NC', 'North Carolina', 'NC-LOTTERY', 'America/New_York', true, 1),
    ('CA', 'California', 'CA-LOTTERY', 'America/Los_Angeles', true, 1)
ON CONFLICT (code) DO NOTHING;

-- Insert initial game data for NC and CA
INSERT INTO public.lottery_games (id, state_code, game_key, display_name, game_family, primary_count, primary_min, primary_max, has_bonus, bonus_count, bonus_min, bonus_max, bonus_label, draw_style, supports_multiplier, supports_fireball, supports_double_play, supports_ez_match, schedule_config, is_active, created_at, updated_at)
VALUES
    -- NC Pick 3
    (gen_random_uuid(), 'NC', 'nc-pick3', 'Pick 3', 'pick3', 3, 0, 9, false, 0, NULL, NULL, NULL, 'twice_daily', false, false, false, false, '{"day": "12:30", "night": "21:30"}', true, now(), now()),
    -- NC Pick 4
    (gen_random_uuid(), 'NC', 'nc-pick4', 'Pick 4', 'pick4', 4, 0, 9, false, 0, NULL, NULL, NULL, 'twice_daily', false, false, false, false, '{"day": "12:30", "night": "21:30"}', true, now(), now()),
    -- NC Cash 5
    (gen_random_uuid(), 'NC', 'nc-cash5', 'Cash 5', 'cash5', 5, 1, 43, false, 0, NULL, NULL, NULL, 'daily', false, false, false, false, '{"time": "23:00"}', true, now(), now()),
    -- NC Powerball
    (gen_random_uuid(), 'NC', 'nc-powerball', 'Powerball', 'powerball', 5, 1, 69, true, 1, 1, 26, 'Powerball', 'weekly', false, false, true, false, '{"wed": "22:59", "sat": "22:59"}', true, now(), now()),
    -- NC Mega Millions
    (gen_random_uuid(), 'NC', 'nc-mega-millions', 'Mega Millions', 'mega_millions', 5, 1, 70, true, 1, 1, 25, 'Mega Ball', 'weekly', false, false, false, false, '{"tue": "23:00", "fri": "23:00"}', true, now(), now()),
    -- CA Pick 3
    (gen_random_uuid(), 'CA', 'ca-pick3', 'Pick 3', 'pick3', 3, 0, 9, false, 0, NULL, NULL, NULL, 'daily', false, false, false, false, '{"time": "18:30"}', true, now(), now()),
    -- CA Pick 4
    (gen_random_uuid(), 'CA', 'ca-pick4', 'Pick 4', 'pick4', 4, 0, 9, false, 0, NULL, NULL, NULL, 'daily', false, false, false, false, '{"time": "18:30"}', true, now(), now()),
    -- CA Cash 5 (assuming similar structure, may need adjustment)
    (gen_random_uuid(), 'CA', 'ca-cash5', 'Cash 5', 'cash5', 5, 1, 43, false, 0, NULL, NULL, NULL, 'daily', false, false, false, false, '{"time": "19:00"}', true, now(), now()),
    -- CA Powerball
    (gen_random_uuid(), 'CA', 'ca-powerball', 'Powerball', 'powerball', 5, 1, 69, true, 1, 1, 26, 'Powerball', 'weekly', false, false, true, false, '{"wed": "22:59", "sat": "22:59"}', true, now(), now()),
    -- CA Mega Millions
    (gen_random_uuid(), 'CA', 'ca-mega-millions', 'Mega Millions', 'mega_millions', 5, 1, 70, true, 1, 1, 25, 'Mega Ball', 'weekly', false, false, false, false, '{"tue": "23:00", "fri": "23:00"}', true, now(), now())
ON CONFLICT DO NOTHING;

-- Insert initial subscription products
INSERT INTO public.subscription_products (id, code, name, billing_interval, rank, feature_matrix)
VALUES
    (gen_random_uuid(), 'free', 'Free', 'month', 1, '{"basic_predictions": true, "advanced_strategies": false, "premium_explanations": false, "ai_quota_monthly": 0, "pick_limit_daily": 5}'),
    (gen_random_uuid(), 'pro', 'Pro', 'month', 2, '{"basic_predictions": true, "advanced_strategies": true, "premium_explanations": true, "ai_quota_monthly": 100, "pick_limit_daily": 50}'),
    (gen_random_uuid(), 'elite', 'Elite', 'month', 3, '{"basic_predictions": true, "advanced_strategies": true, "premium_explanations": true, "ai_quota_monthly": 500, "pick_limit_daily": 200, "export_access": true, "voice_commentary": true}'),
    (gen_random_uuid(), 'founder', 'Founder', 'year', 4, '{"basic_predictions": true, "advanced_strategies": true, "premium_explanations": true, "ai_quota_monthly": 2000, "pick_limit_daily": 1000, "export_access": true, "voice_commentary": true, "notifications_premium": true}')
ON CONFLICT (code) DO NOTHING;