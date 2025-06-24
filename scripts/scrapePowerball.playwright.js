import { chromium } from 'playwright';
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://www.powerball.com/previous-results', { waitUntil: 'domcontentloaded' });

    // Wait for results to be visible
    await page.waitForFunction(() => {
        const table = document.querySelector('table');
        return table && table.querySelectorAll('tbody tr').length > 0;
    }, { timeout: 60000 });

    const draws = await page.$$eval('#past-results-table tbody tr', rows =>
        rows.map(row => {
            const tds = row.querySelectorAll('td');
            const date = tds[0]?.textContent?.trim();
            const whiteBalls = [...tds[1]?.querySelectorAll('.white-ball') || []]
                .map(el => parseInt(el.textContent.trim()))
                .filter(n => !isNaN(n));
            const powerball = parseInt(tds[1]?.querySelector('.powerball')?.textContent?.trim());
            const powerplay = parseInt(tds[2]?.textContent?.replace(/[^\d]/g, '')) || null;

            if (date && whiteBalls.length === 5 && powerball)
                return {
                    draw_date: formatDate(date),
                    numbers: whiteBalls,
                    powerball,
                    powerplay,
                };
        }).filter(Boolean)
    );

    console.log(`✅ Extracted ${draws.length} Powerball draws`);

    for (let i = 0; i < draws.length; i += 1000) {
        const batch = draws.slice(i, i + 1000);
        const { error } = await supabase
            .from('powerball_draws')
            .upsert(batch, { onConflict: ['draw_date'] });

        if (error) console.error('🚫 Supabase upload error:', error.message);
        else console.log(`⬆️ Uploaded ${batch.length} rows`);
    }

    await browser.close();
    console.log('🎯 Done!');
})();

function formatDate(str) {
    const [m, d, y] = str.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}