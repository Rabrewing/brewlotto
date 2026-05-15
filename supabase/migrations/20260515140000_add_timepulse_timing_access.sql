-- Add explicit TimePulse entitlement so Master-tier access is tracked in the account model.
ALTER TABLE public.user_entitlements
  ADD COLUMN IF NOT EXISTS timing_analysis_access boolean DEFAULT false;

UPDATE public.user_entitlements
SET timing_analysis_access = true
WHERE tier_code = 'master';

INSERT INTO public.feature_entitlements (feature_key, feature_name, description, category, min_tier, sort_order)
VALUES
  ('timing_analysis', 'TimePulse Timing Analysis', 'Master-tier timing window and strategy profile analysis.', 'analytics', 'master', 75)
ON CONFLICT (feature_key) DO UPDATE SET
  feature_name = EXCLUDED.feature_name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  min_tier = EXCLUDED.min_tier,
  sort_order = EXCLUDED.sort_order;
