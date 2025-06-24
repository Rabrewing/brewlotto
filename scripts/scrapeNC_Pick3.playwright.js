// /scripts/scrapeNC_Pick3.playwright.js
// BrewLotto AI — NC Pick 3 Scraper (v6: popup terminator)
// Last updated: 2025-06-22

import 'dotenv/config';
import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

(async () => {
    const browser = await chromium.launch({ headless: false, slowMo: 100 });
    const page = await browser.newPage();
    const url = 'https://nclottery.com/pick3-past';

    console.log(`🌐 Visiting: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // 👊 Obliterate any OptinMonster-style popup and overlays
    await page.evaluate(() => {
        const popup = document.querySelector('[id^="om-"]');
        if (popup) popup.remove();

        const overlays = document.querySelectorAll('[class*="overlay"], [class*="backdrop"], [class*="modal"]');
        overlays.forEach(el => el.remove());
    });
    console.log('💥 Popup nuked');

    // 🔄 Scroll to trigger all results
    const maxScrolls = 30;
    for (let i = 0; i < maxScrolls; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        await page.waitForTimeout(500);
    }

    // 🔍 Parse draw data
    const draws = await page.$$eval('.pick3-number-history-list li', items =>
        items.map(el => {
            const dateRaw = el.querySelector('.draw-date')?.textContent?.trim();
            const emoji = el.querySelector('.emoji')?.textContent?.trim();
            const numbers = [...el.querySelectorAll('.number')]
                .map(n => parseInt(n.textContent.trim()))
                .filter(n => !isNaN(n));

            if (!dateRaw || numbers.length !== 3) return null;

            const [yearStr, monthAbbr, dayStr] = dateRaw.replace(',', '').split(' ');
            const monthMap = {
                Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
                Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
            };
            const draw_date = `${yearStr}-${monthMap[monthAbbr] || '01'}-${dayStr.padStart(2, '0')}`;
            const draw_type = emoji.includes('🌞') ? 'day' : 'evening';

            return { draw_date, draw_type, numbers };
        }).filter(Boolean)
    );

    await browser.close();

    const uniqueDraws = draws.filter(
        (v, i, a) =>
            a.findIndex(t => t.draw_date === v.draw_date && t.draw_type === v.draw_type) === i
    );

    console.log(`📊 Total Pick 3 draws scraped: ${uniqueDraws.length}`);

    for (let i = 0; i < uniqueDraws.length; i += 1000) {
        const batch = uniqueDraws.slice(i, i + 1000);
        const { error } = await supabase
            .from('pick3_draws')
            .upsert(batch, { onConflict: ['draw_date', 'draw_type'] });

        if (error) console.error('🚫 Upload error:', error.message);
        else console.log(`⬆️ Uploaded ${batch.length} rows`);
    }

    console.log('✅ NC Pick 3 archive imported successfully!');
})();