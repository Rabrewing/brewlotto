/**
 * Utility: generatePrediction
 * Description: Generates predicted numbers for a game using a named strategy
 * Last updated: 2025-06-25T03:25:00-04:00 (EDT)
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

await supabase.from('predictions').insert([{
    user_id: null, // or pass from auth
    game,
    strategy,
    numbers,
    score
}]);

export async function generatePrediction({ game, strategy }) {
    // Placeholder logic — replace with real modeling later
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

    return {
        numbers: Array.from(numbers).sort((a, b) => a - b),
        score: Math.random() // placeholder confidence
    };
}