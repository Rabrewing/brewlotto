// This API endpoint generates lottery predictions using various strategies
// and returns them in a structured format.
// File: pages/api/predictions.js
// Timestamp: 2025-06-25T21:12 EDT

import { generatePrediction } from '@/utils/generatePrediction';

export default async function handler(req, res) {
    try {
        const games = ['Pick 3', 'Pick 4', 'Pick 5', 'Mega Millions', 'Powerball'];
        const strategies = ['Poisson', 'Markov', 'Momentum'];
        const picks = [];

        for (const game of games) {
            for (const strategy of strategies) {
                try {
                    const { numbers, score } = await generatePrediction({ game, strategy });
                    picks.push({ game, strategy, numbers, score });
                } catch (err) {
                    console.error(`❌ Failed to generate for ${game} + ${strategy}:`, err.message);
                }
            }
        }

        res.status(200).json(picks); // even if picks = []
    } catch (e) {
        console.error('❌ Prediction API Error:', e);
        return res.status(500).json({ message: `Prediction error: ${e.message}` });
    }
}