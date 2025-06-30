// @status: ❌ @deprecated
// @archivedOn: 2025-06-27
// @reason: Superseded by lib/engines/smartPickEngine.js
// @notes: Used hardcoded config, lacked tier abstraction, and bypassed STRATEGY_EXPLAINERS

import { supabase } from "@/utils/supabase";
/**
 * Generates a set of random numbers for a lottery game based on its configuration.
 * @param {Object} params - Parameters for the prediction.
 * @param {string} params.game - The name of the lottery game (e.g., 'Pick 3', 'Powerball').
 * @param {string} params.strategy - The strategy used for generating the prediction.
 * @returns {Promise<Object>} An object containing the generated numbers and a confidence score.
 */
// Note: This function is designed to be used with Supabase for data storage.
export async function generatePrediction({ game, strategy }) {
    const gameConfig = {
        'Pick 3': { pool: 10, count: 3 },
        'Pick 4': { pool: 10, count: 4 },
        'Pick 5': { pool: 43, count: 5 },
        'Mega Millions': { pool: 70, count: 5 },
        'Powerball': { pool: 69, count: 5 }
    };

    const { pool, count } = gameConfig[game] || {};
    if (!pool || !count) return { numbers: [], score: 0 };

    const numbers = new Set();
    while (numbers.size < count) {
        numbers.add(Math.floor(Math.random() * pool));
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
    const score = Math.random(); // Placeholder — replace with real confidence metric later

    await supabase.from('predictions').insert([{
        user_id: null, // Replace when auth hooks are added
        game,
        strategy,
        numbers: sortedNumbers,
        score
    }]);

    return { numbers: sortedNumbers, score };
}
