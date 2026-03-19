-- BrewLotto V1: Fix Predictions Table Schema
-- Timestamp: 2026-03-19 ET
-- Purpose: Recreate predictions table to match Brewlotto_v01 schema

DROP TABLE IF EXISTS public.predictions CASCADE;
DROP TABLE IF EXISTS public.prediction_explanations CASCADE;
DROP TABLE IF EXISTS public.prediction_strategy_scores CASCADE;

CREATE TABLE public.predictions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NULL,
    state text NOT NULL,
    game text NOT NULL,
    draw_date date,
    draw_time text,
    prediction_type text NOT NULL DEFAULT 'on_demand',
    source_strategy_key text,
    strategy_bundle jsonb NOT NULL DEFAULT '[]'::jsonb,
    predicted_numbers jsonb NOT NULL,
    bonus_number integer,
    confidence_score numeric(6,2),
    rank_score numeric(10,4),
    risk_level text DEFAULT 'medium',
    is_saved boolean NOT NULL DEFAULT false,
    is_featured boolean NOT NULL DEFAULT false,
    generation_context jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    
    CONSTRAINT predictions_state_check CHECK (state IN ('NC', 'CA', 'MULTI')),
    CONSTRAINT predictions_game_check CHECK (game IN ('pick3', 'pick4', 'cash5', 'daily3', 'daily4', 'fantasy5', 'powerball', 'mega_millions')),
    CONSTRAINT predictions_type_check CHECK (prediction_type IN ('on_demand', 'scheduled', 'daily_featured', 'comparison', 'simulation')),
    CONSTRAINT predictions_risk_level_check CHECK (risk_level IN ('low', 'medium', 'high'))
);

CREATE INDEX idx_predictions_user_id ON public.predictions (user_id);
CREATE INDEX idx_predictions_state_game_date ON public.predictions (state, game, draw_date DESC);
CREATE INDEX idx_predictions_created_at ON public.predictions (created_at DESC);

CREATE TABLE public.prediction_explanations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    prediction_id uuid NOT NULL REFERENCES public.predictions(id) ON DELETE CASCADE,
    user_id uuid NULL,
    explanation_type text NOT NULL DEFAULT 'summary',
    title text,
    summary_text text,
    detail_text text,
    commentary_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    evidence_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    provider text,
    provider_model text,
    trust_score integer,
    is_compliant boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_prediction_explanations_prediction_id ON public.prediction_explanations (prediction_id);

CREATE TABLE public.prediction_strategy_scores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    prediction_id uuid NOT NULL REFERENCES public.predictions(id) ON DELETE CASCADE,
    strategy_key text NOT NULL,
    public_label text,
    weight numeric(5,2),
    score numeric(8,4),
    notes jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_prediction_strategy_scores_prediction_id ON public.prediction_strategy_scores (prediction_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_predictions_updated_at ON public.predictions;
CREATE TRIGGER trg_predictions_updated_at
BEFORE UPDATE ON public.predictions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS Policies
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_explanations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_strategy_scores ENABLE ROW LEVEL SECURITY;

-- Users can see their own predictions + featured
DROP POLICY IF EXISTS "predictions_select_own_or_featured" ON public.predictions;
CREATE POLICY "predictions_select_own_or_featured" ON public.predictions
FOR SELECT TO authenticated USING (
    auth.uid() = user_id OR is_featured = true
);

DROP POLICY IF EXISTS "predictions_insert_own" ON public.predictions;
CREATE POLICY "predictions_insert_own" ON public.predictions
FOR INSERT TO authenticated WITH CHECK (
    user_id IS NULL OR auth.uid() = user_id
);

DROP POLICY IF EXISTS "predictions_update_own" ON public.predictions;
CREATE POLICY "predictions_update_own" ON public.predictions
FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "prediction_explanations_select" ON public.prediction_explanations;
CREATE POLICY "prediction_explanations_select" ON public.prediction_explanations
FOR SELECT TO authenticated USING (
    user_id IS NULL OR auth.uid() = user_id
);
