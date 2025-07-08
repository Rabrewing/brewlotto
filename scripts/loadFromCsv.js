/**
 * /scripts/loadFromCsv.js
 * Description: CLI runner that uploads draw data from CSV files inside a specified directory (default: ./data)
 * Dependencies: Uses csvUtils.js for parsing, sanitizing, and inserting per game
 * Author: Randy Brewington
 * Last updated: 2025-06-25T02:22:00-04:00 (EDT)
 */

import fs from 'fs';
import path from 'path';
import { parseCsvFile, sanitizeRows, upsertDrawsToSupabase } from './upload/csvUtils.js';

const folder = process.argv[2] || './data';

async function main() {
    if (!fs.existsSync(folder)) {
        console.error('📁 Data folder not found:', folder);
        process.exit(1);
    }

    const files = fs.readdirSync(folder);
    const matches = files.filter(f =>
        f.toLowerCase().endsWith('.csv') &&
        ['pick3', 'pick4', 'pick5', 'powerball', 'mega'].some(g => f.toLowerCase().includes(g))
    );

    if (matches.length === 0) {
        console.log(`⚠️ No valid game CSVs found in ${folder}`);
        return;
    }

    for (const file of matches) {
        const game = ['pick3', 'pick4', 'pick5', 'powerball', 'mega'].find(g =>
            file.toLowerCase().includes(g)
        );
        if (!game) continue;

        console.log(`📂 Processing ${file} → ${game}`);
        const raw = parseCsvFile(path.join(folder, file));
        const records = sanitizeRows(raw, game);
        const count = await upsertDrawsToSupabase(game, records);

        console.log(`✅ ${count} rows upserted for ${game}`);
    }

    console.log('🎉 All CSV loads complete.');
}

main();