/**
 * /scripts/refreshDraws.js
 * Description: Smart draw sync — checks each game’s freshness and reloads its CSV only if data is missing or stale
 * Dependencies: csvUtils.js (parse, sanitize, upload)
 * Author: Randy Brewington
 * Last updated: 2025-06-25T02:50:00-04:00 (EDT)
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { parseCsvFile, sanitizeRows, upsertDrawsToSupabase } from './upload/csvUtils.js';
import 'dotenv/config';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const games = [
    { key: 'pick3', table: 'pick3_draws' },
    { key: 'pick4', table: 'pick4_draws' },
    { key: 'pick5', table: 'pick5_draws' },
    { key: 'powerball', table: 'powerball_draws' },
    { key: 'mega', table: 'mega_draws' }
];

const today = new Date().toISOString().slice(0, 10);
const dataFolder = process.argv[2] || './data';

async function refreshGame(game) {
    const { key, table } = game;

    const { data: latest, error } = await supabase
        .from(table)
        .select('draw_date')
        .order('draw_date', { ascending: false })
        .limit(1);

    const lastDate = latest?.[0]?.draw_date;
    const isStale = !lastDate || lastDate < today;

    if (!isStale) {
        console.log(`🟢 ${key.toUpperCase()} is up-to-date (latest: ${lastDate})`);
        return;
    }

    console.log(`🟡 Reloading ${key.toUpperCase()} — stale or missing (latest: ${lastDate || '–'})`);

    const fileMatch = fs.readdirSync(dataFolder)
        .find(f => f.toLowerCase().includes(key) && f.toLowerCase().endsWith('.csv'));

    if (!fileMatch) {
        console.warn(`❌ No CSV found for ${key} in ${dataFolder}`);
        return;
    }

    const raw = parseCsvFile(path.join(dataFolder, fileMatch));
    const clean = sanitizeRows(raw, key);
    const inserted = await upsertDrawsToSupabase(key, clean);

    console.log(`⬆️ ${inserted} rows inserted for ${key} from ${fileMatch}`);
}

async function main() {
    console.log(`📦 BrewLotto Refresh Run — ${today}\n`);
    for (const game of games) {
        await refreshGame(game);
    }
    console.log('\n🎯 Refresh complete.');
}

main();