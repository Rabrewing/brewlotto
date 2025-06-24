// /pages/api/play/log.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    const { user_id, game, draw_type, strategy, numbers, add_on, amount_spent, outcome, prize } = req.body;
    const { data, error } = await supabase
        .from('play_log')
        .insert([{ user_id, game, draw_type, strategy, numbers, add_on, amount_spent, outcome, prize }]);
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ success: true, data });
}
