// /scripts/scrapeNC_Pick3.js
// BrewLotto AI — NC Pick 3 Scraper
// Last updated: 2025-06-22

import 'dotenv/config';
import axios from 'axios';
import { load } from 'cheerio';
import { supabase } from "@/utils/supabase";

const MONTHS_BACK = 24;

(async () => {
    const allDraws = [];
    const today = new Date();

    for (let i = 0; i < MONTHS_BACK; i++) {
        const dt = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const url = `https://nclottery.com/pick3-past-draws?month=${dt.getMonth() + 1}&year=${dt.getFullYear()}`;
        console.log(`Fetching: ${url}`);

        try {
            const resp = await axios.get(url);
            const $ = load(resp.data);

            $('.past-draws-table tbody tr').each((_, el) => {
                const tds = $(el).find('td');
                const date = $(tds[0]).text().trim();
                const draw_type = $(tds[1]).text().toLowerCase().includes('day') ? 'day' : 'evening';
                const numbers = $(tds[2])
                    .text()
                    .split('-')
                    .map(n => parseInt(n.trim()))
                    .filter(n => !isNaN(n));

                if (date && numbers.length === 3) {
                    allDraws.push({
                        draw_date: formatDate(date),
                        draw_type,
                        numbers
                    });
                }
            });
        } catch (err) {
            console.error(`❌ Failed to fetch ${url}:`, err.message);
        }
    }

    // Remove duplicates by draw_date + draw_type
    const uniqueDraws = allDraws.filter(
        (v, i, a) =>
            a.findIndex(t => t.draw_date === v.draw_date && t.draw_type === v.draw_type) === i
    );

    console.log(`📊 Total Pick 3 draws: ${uniqueDraws.length}`);

    for (let i = 0; i < uniqueDraws.length; i += 1000) {
        const batch = uniqueDraws.slice(i, i + 1000);
        const { error } = await supabase
            .from('pick3_draws')
            .upsert(batch, { onConflict: ['draw_date', 'draw_type'] });

        if (error) console.error('🚫 Upload error:', error.message);
        else console.log(`⬆️ Uploaded ${batch.length} rows`);
    }

    console.log('✅ Pick 3 history loaded!');
})();

function formatDate(str) {
    const [m, d, y] = str.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}