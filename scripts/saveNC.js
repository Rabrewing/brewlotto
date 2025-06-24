import 'dotenv/config';
// /scripts/saveNC.js
// Only needed once per process, at top of entry file

import { supabase } from '../utils/supabase.js';
import { scrapeNCPick3Results, scrapeNCPick4Results } from './scrapeNC.js';

export async function savePickDataToSupabase() {
    try {
        console.log('🔁 Fetching Pick 3 & Pick 4 Results...');
        const pick3Results = await scrapeNCPick3Results();
        const pick4Results = await scrapeNCPick4Results();

        const allResults = [
            ...pick3Results.map(draw => ({
                game: 'Pick3',
                draw_date: draw.date,
                time_of_day: draw.time,
                numbers: draw.numbers,
                source_url: 'https://www.nclottery.com/Pick3',
            })),
            ...pick4Results.map(draw => ({
                game: 'Pick4',
                draw_date: draw.date,
                time_of_day: draw.time,
                numbers: draw.numbers,
                source_url: 'https://www.nclottery.com/Pick4',
            }))
        ];

        for (const draw of allResults) {
            // Avoid duplicates: check if draw already exists
            const { data: existing, error: readErr } = await supabase
                .from('pick_history')
                .select('id')
                .eq('game', draw.game)
                .eq('draw_date', draw.draw_date)
                .eq('time_of_day', draw.time_of_day)
                .maybeSingle();

            if (!existing) {
                const { error } = await supabase.from('pick_history').insert([draw]);
                if (error) console.error(`❌ Failed to insert ${draw.game} ${draw.draw_date} (${draw.time_of_day})`, error);
                else console.log(`✅ Saved: ${draw.game} ${draw.draw_date} (${draw.time_of_day})`);
            } else {
                console.log(`⚠️ Skipped (already exists): ${draw.game} ${draw.draw_date} (${draw.time_of_day})`);
            }
        }
    } catch (err) {
        console.error('❌ Error during save process:', err.message);
    }
}

// Optional: Run directly
if (process.argv.includes('--run')) {
    savePickDataToSupabase();
}
