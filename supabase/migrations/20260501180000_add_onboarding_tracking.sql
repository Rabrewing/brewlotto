-- BrewLotto V1: Add onboarding tracking to user_preferences

ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS disclaimer_acknowledged boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS acknowledged_at timestamptz;
