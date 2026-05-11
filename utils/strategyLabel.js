import { STRATEGY_EXPLAINERS } from "@/lib/explainers/strategyExplainers";

const LEGACY_KEY_MAP = {
  hot_cold: 'hotCold',
  poisson_basic: 'poisson+',
  advanced_scoring: 'poisson+',
  strategy_explanations: 'hotCold',
  confidence_bands: 'momentum',
  prediction_comparisons: 'hotCold',
  deep_ai_explanations: 'poisson++',
  early_access_strategies: 'markov++',
  frequency_analysis: 'hotCold',
  frequency: 'hotCold',
};

const FALLBACK_CLEAN = (key) => {
  if (!key) return 'Brew Strategy';
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/[+]+/g, '');
};

export const getStrategyLabel = (id) => {
  if (!id) return 'Brew Strategy';
  const mapped = LEGACY_KEY_MAP[id] || id;
  return STRATEGY_EXPLAINERS?.[mapped]?.label || FALLBACK_CLEAN(id);
};

export const getStrategyDesc = (id) => {
  if (!id) return '';
  const mapped = LEGACY_KEY_MAP[id] || id;
  return STRATEGY_EXPLAINERS?.[mapped]?.desc || '';
};

export const getStrategyIcon = (id) => {
  if (!id) return '';
  const mapped = LEGACY_KEY_MAP[id] || id;
  return STRATEGY_EXPLAINERS?.[mapped]?.icon || '';
};
