import { STRATEGY_EXPLAINERS } from "@/lib/explainers/strategyExplainers";

const normalize = (value) => String(value || '').trim().toLowerCase();

const TIERED_MAP = {
  hot_cold: 'heatcheck',
  hotCold: 'heatcheck',
  frequency_analysis: 'heatcheck',
  frequency: 'heatcheck',
  poisson_basic: 'heatcheck_ii',
  'poisson+': 'heatcheck_ii',
  poisson: 'heatcheck',
  advanced_scoring: 'heatcheck_iii',
  confidence_bands: 'heatwave_ii',
  prediction_comparisons: 'heatwave_iii',
  deep_ai_explanations: 'heatcheck_iv',
  'poisson++': 'heatcheck_iv',
  momentum: 'heatwave',
  strategy_explanations: 'pulsesync',
  early_access_strategies: 'pulsesync_ii',
  'markov++': 'sequencex',
  markov: 'sequencex',
  ensemble: 'heatcheck_iii',
};

const LABEL_TO_KEY = Object.fromEntries(
  Object.entries(STRATEGY_EXPLAINERS || {}).map(([key, value]) => [normalize(value?.label), key]),
);

const resolveStrategyKey = (id) => {
  if (!id) return '';

  if (TIERED_MAP[id]) {
    return TIERED_MAP[id];
  }

  const normalized = normalize(id);
  return LABEL_TO_KEY[normalized] || id;
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
  const mapped = resolveStrategyKey(id);
  return STRATEGY_EXPLAINERS?.[mapped]?.label || FALLBACK_CLEAN(id);
};

export const getStrategyDesc = (id) => {
  if (!id) return '';
  const mapped = resolveStrategyKey(id);
  return STRATEGY_EXPLAINERS?.[mapped]?.desc || '';
};

export const getStrategyIcon = (id) => {
  if (!id) return '';
  const mapped = resolveStrategyKey(id);
  return STRATEGY_EXPLAINERS?.[mapped]?.icon || '';
};

export const getStrategyLucideIcon = (id) => {
  if (!id) return 'Zap';
  const mapped = resolveStrategyKey(id);
  return STRATEGY_EXPLAINERS?.[mapped]?.lucide || 'Zap';
};

export const getStrategyColor = (id) => {
  if (!id) return '#94a3b8';
  const mapped = resolveStrategyKey(id);
  return STRATEGY_EXPLAINERS?.[mapped]?.color || '#94a3b8';
};
