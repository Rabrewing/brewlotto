/**
 * API Route: /api/predictions
 * Description: Serves predicted numbers for each game and strategy
 */

import { generatePrediction } from '@/utils/generatePrediction';

export default async function handler(req, res) {
    try {
        const games = ['Pick 3', 'Pick 4', 'Pick 5', 'Mega Millions', 'Powerball'];
        const strategies = ['Poisson', 'Markov', 'Momentum'];

        const picks = [];

        for (const game of games) {
            for (const strategy of strategies) {
                const { numbers, score } = await console.log(`➡️ Generating for ${game} + ${strategy}`); generatePrediction({ game, strategy });
                picks.push({ game, strategy, numbers, score });
            }
        }

        return res.status(200).json(picks);
    } catch (e) {
        console.error('❌ Prediction API Error:', e);
        return res.status(500).json({ message: `Prediction error: ${e.message}` });
    }
}