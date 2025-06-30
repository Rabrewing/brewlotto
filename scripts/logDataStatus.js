/**
 * /scripts/logDataStatus.js
 * Description: Logs draw count and most recent draw date for each supported game in Supabase
 * Usage: node scripts/logDataStatus.js
 * Author: Randy Brewington
 * Last updated: 2025-06-25T02:39:00-04:00 (EDT)
 */

import { supabase } from "@/utils/supabase";
import 'dotenv/config';

const games = [
    { game: 'pick3', table: 'pick3_draws' },
    { game: 'pick4', table: 'pick4_draws' },
    { game: 'pick5', table: 'pick5_draws' },
    { game: 'powerball', table: 'powerball_draws' },
    { game: 'mega', table: 'mega_draws' }
];

async function checkStatus() {
    console.log(`📊 Draw Data Status (${new Date().toLocaleString()})`);
    console.log('────────────────────────────────────────────');

    for (const { game, table } of games) {
        const { data: countRes, error: countErr } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });

        const { data: latest, error: dateErr } = await supabase
            .from(table)
            .select('draw_date')
            .order('draw_date', { ascending: false })
            .limit(1);

        if (countErr || dateErr) {
            console.error(`❌ ${game.toUpperCase()}: Error loading data`);
            continue;
        }

        const count = countRes?.length ?? 0;
        const lastDate = latest?.[0]?.draw_date ?? '–';

        const flag = count < 10 ? '🟥' : count < 100 ? '🟡' : '🟢';
        console.log(`${flag} ${game.toUpperCase()}: ${count} draws (latest: ${lastDate})`);
    }

    console.log('\n🧩 Tip: Run `loadFromCsv.js` if any count is low or stale');
}

checkStatus();