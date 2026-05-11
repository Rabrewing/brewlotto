// @lib/voice/brewVoiceLines.js
// Summary: Generates dynamic commentary and intros using Brew voice layer

import { STRATEGY_EXPLAINERS } from "@/lib/explainers/strategyExplainers";
import { getStrategyLabel } from "@/utils/strategyLabel";

/**
 * Generate a dynamic intro when a strategy is activated
 * @param {string} id - strategy ID key
 * @returns {string} voice line
 */
export function generateStrategyIntro(id) {
    const label = getStrategyLabel(id);
    const info = STRATEGY_EXPLAINERS?.[id];
    if (info?.desc) {
        return `${label}: ${info.desc}`;
    }
    return `Brew is deploying ${label}. Observing pattern formation.`;
}

/**
 * Generate a win-rate observation
 * @param {number} percent - success rate (0–1)
 */
export function generateHitRateComment(percent) {
    if (percent >= 0.9) return "Brew sees consistent fire — strategy is locked in.";
    if (percent >= 0.6) return "Hit rate solid — pattern formation stable.";
    if (percent >= 0.3) return "Mixed results. Might need a shuffle soon.";
    return "Low sync rate detected — Brew recommends switching strategies.";
}