// @lib/utils/strategyLabel.js
// Utility to safely convert internal strategy ID to public-facing label

import { STRATEGY_EXPLAINERS } from "@/lib/explainers/strategyExplainers";

/**
 * Returns the branded label for a given strategy ID
 * @param {string} id
 * @returns {string}
 */
export const getStrategyLabel = (id) =>
    STRATEGY_EXPLAINERS?.[id]?.label || id;