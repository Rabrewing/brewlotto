-- Split timing access into Pro TimePulse and Master TimePulse II.
ALTER TABLE public.user_entitlements
  ADD COLUMN IF NOT EXISTS timepulse_access boolean DEFAULT false;

UPDATE public.user_entitlements
SET timepulse_access = true
WHERE tier_code IN ('pro', 'master');

UPDATE public.feature_entitlements
SET
  feature_name = 'TimePulse II Timing Analysis',
  description = 'Master-tier adaptive timing windows and strategy profile analysis.',
  category = 'analytics',
  min_tier = 'master',
  sort_order = 75
WHERE feature_key = 'timing_analysis';

INSERT INTO public.feature_entitlements (feature_key, feature_name, description, category, min_tier, sort_order)
VALUES
  ('timepulse', 'TimePulse Timing Analysis', 'BrewPro timing window and strategy profile analysis.', 'analytics', 'pro', 74)
ON CONFLICT (feature_key) DO UPDATE SET
  feature_name = EXCLUDED.feature_name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  min_tier = EXCLUDED.min_tier,
  sort_order = EXCLUDED.sort_order;
