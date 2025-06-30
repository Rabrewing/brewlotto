// Smart Pick Engine: Handles strategy-based number selection for lottery games
// @lastUpdated: 2025-06-27
// @status: ✅ Refactored (circular import removed, STRATEGY_EXPLAINERS-aware)

// @status: ✅ Refactored (live in Brew 2)
// @lastMoved: 2025-06-27 → /lib/engines/
// @purpose: Dispatch strategy keys to prediction engines (Poisson, Markov, etc.)
// @notes: Consumes internal keys only — STRATEGY_EXPLAINERS should be used upstream in UI

import { runPoisson } from '@/strategies/poisson';
import { runMarkov } from '@/strategies/markov';
import { runMomentum } from '@/strategies/momentum';
import { runRandom } from '@/strategies/random';
import { STRATEGY_EXPLAINERS } from '@/lib/explainers/strategyExplainers';

/**
 * Executes the appropriate strategy engine based on internal strategy key.
 * UI should only reference STRATEGY_EXPLAINERS for display purposes.
 */
export async function smartPick({ game, strategy, userId = null }) {
    switch (strategy) {
        case 'Poisson':
            return await runPoisson(game, userId);
        case 'Markov':
            return await runMarkov(game, userId);
        case 'Momentum':
            return await runMomentum(game, userId);
        default:
            return await runRandom(game);
    }
}

/**
 * Public interface for generating a prediction.
 * Accepts internal strategy key, not tier label.
 */
export async function generatePrediction({ game, strategy, userId = null }) {
    return await smartPick({ game, strategy, userId });
}