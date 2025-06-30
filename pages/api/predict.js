// pages/api/predict.js
import { getSupabaseServerClient } from '@/utils/supabaseServerClient';
import { generatePrediction } from '@/utils/generatePrediction';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const supabase = getSupabaseServerClient(req, res);
    const {
        data: { user },
        error
    } = await supabase.auth.getUser();

    if (error || !user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { game, strategy } = req.body;

    if (!game || !strategy) {
        return res.status(400).json({ message: 'Missing game or strategy' });
    }

    try {
        const prediction = await generatePrediction({
            game,
            strategy,
            user_id: user.id
        });

        return res.status(200).json(prediction);
    } catch (err) {
        console.error('❌ Prediction error:', err.message);
        return res.status(500).json({ message: 'Prediction failed' });
    }
}