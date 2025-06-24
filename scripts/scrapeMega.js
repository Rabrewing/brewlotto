// /scripts/scrapeMega.js
// BrewLotto AI — Mega Millions Scraper
// Last updated: 2025-06-22

import 'dotenv/config';
import axios from 'axios';
import { load } from 'cheerio';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

const MEGA_URL = 'https://www.megamillions.com/Winning-Numbers.aspx';

(async () => {
    const draws = [];

    try {
        const resp = await axios.get(MEGA_URL, { timeout: 10000 });
        const $ = load(resp.data);

        // Selector may need to be updated if Mega Millions updates page layout
        $('.winning-numbers-table tbody tr').each((i, el) => {
            const tds = $(el).find('td');
            if (tds.length >= 5) {
                const date = $(tds[0]).text().trim();
                const numbers = $(tds[1])
                    .text()
                    .split(/\s+/)
                    .filter(x => /^\d+$/.test(x))
                    .slice(0, 5)
                    .map(Number);
                const megaBall = $(tds[2]).text().trim();
                const megaPlier = $(tds[3]).text().trim();

                if (date && numbers.length === 5) {
                    draws.push({
                        draw_date: formatDate(date),
                        numbers,
                        megaBall: Number(megaBall),
                        megaPlier
                    });
                }
            }
        });

        console.log(`✅ Parsed ${draws.length} Mega Millions draws`);
    } catch (err) {
        console.error('❌ Failed to fetch Mega Millions data:', err.message);
    }

    if (draws.length > 0) {
        for (let i = 0; i < draws.length; i += 500) {
            const batch = draws.slice(i, i + 500);
            const { error } = await supabase
                .from('mega_draws')
                .upsert(batch, { onConflict: ['draw_date'] });

            if (error) {
                console.error('🚫 Supabase upload error:', error.message);
            } else {
                console.log(`⬆️ Uploaded ${batch.length} rows`);
            }
        }
        console.log('🎉 Mega Millions history uploaded successfully');
    } else {
        console.log('⚠️ No draws found — nothing uploaded');
    }
})();

function formatDate(str) {
    // Input: MM/DD/YYYY → Output: YYYY-MM-DD
    const [m, d, y] = str.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}