import { NextResponse } from 'next/server';
import { supabase } from "../../../../lib/supabase/browserClient"; // Adjusted path

export async function POST(req: Request) {
    const { user_id, game, draw_type, strategy, numbers, add_on, amount_spent, outcome, prize } = await req.json();

    const { data, error } = await supabase
        .from('play_log')
        .insert([{ user_id, game, draw_type, strategy, numbers, add_on, amount_spent, outcome, prize }]);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
}
