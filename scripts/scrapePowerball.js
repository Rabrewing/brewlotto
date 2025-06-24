// /scripts/scrapePowerball.js
// BrewLotto AI — Powerball History Scraper
// Last updated: 2025-06-22

import 'dotenv/config';
import axios from 'axios';
import { load } from 'cheerio';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

const POWERBALL_URL = 'https://www.powerball.com/previous-results';

(async () => {
    const allDraws = [];

    try {
        const resp = await axios.get(POWERBALL_URL, { timeout: 10000 });
        const $ = load(resp.data);

        $('.table-responsive table tbody tr').each((_, el) => {
            const tds = $(el).find('td');
            const date = $(tds[0]).text().trim();
            const numbers = $(tds[1])
                .find('.white-ball')
                .map((_, el) => parseInt($(el).text().trim()))
                .get();
            const powerball = parseInt($(tds[1]).find('.powerball').text().trim());
            const powerplay = parseInt($(tds[2]).text().replace(/[^\d]/g, '')) || null;

            if (date && numbers.length === 5 && powerball) {
                allDraws.push({
                    draw_date: formatDate(date),
                    numbers,
                    powerball,
                    powerplay
                });
            }
        });

        // Remove duplicate draw dates
        const uniqueDraws = allDraws.filter(
            (v, i, a) => a.findIndex(t => t.draw_date === v.draw_date) === i
        );

        console.log(`✅ Parsed ${uniqueDraws.length} Powerball draws`);

        for (let i = 0; i < uniqueDraws.length; i += 1000) {
            const batch = uniqueDraws.slice(i, i + 1000);
            const { error } = await supabase
                .from('powerball_draws')
                .upsert(batch, { onConflict: ['draw_date'] });

            if (error) {
                console.error('🚫 Supabase upload error:', error.message);
            } else {
                console.log(`⬆️ Uploaded ${batch.length} rows`);
            }
        }

        console.log('🎉 Powerball history uploaded successfully');
    } catch (err) {
        console.error('❌ Failed to fetch Powerball data:', err.message);
    }
})();

function formatDate(str) {
    const [m, d, y] = str.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}