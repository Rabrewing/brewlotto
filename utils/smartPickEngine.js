// utils/smartPickEngine.js
// Smart Pick Engine: Handles strategy-based number selection for lottery games
// Last updated: 2025-06-25T03:25:00-04:00 (EDT)

import { runPoisson } from '@/strategies/poisson';
import { runMarkov } from '@/strategies/markov';
import { runMomentum } from '@/strategies/momentum';
import { runRandom } from '@/strategies/random'; // fallback if needed
import { smartPick } from '@/utils/smartPickEngine';

export async function generatePrediction({ game, strategy, userId = null }) {
    return await smartPick({ game, strategy, userId });
}

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