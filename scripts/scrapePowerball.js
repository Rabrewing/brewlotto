// /scripts/scrapePowerball.js
// BrewLotto AI — Powerball Scraper
// Scrapes from official Powerball website with NCEL fallback

import 'dotenv/config';
import axios from 'axios';
import { load } from 'cheerio';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
);

const MONTHS_BACK = 3;

(async () => {
    const allDraws = [];
    const today = new Date();

    console.log('🚀 Starting Powerball scraper...');

    for (let i = 0; i < MONTHS_BACK; i++) {
        const dt = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const year = dt.getFullYear();
        const month = dt.getMonth() + 1;
        
        // Try official Powerball website first
        const url = `https://www.powerball.com/previous-results?game=pb&month=${month}&year=${year}`;
        console.log(`Fetching: ${url}`);

        try {
            const resp = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            const $ = load(resp.data);

            // Look for draw results table
            $('.results-table tbody tr').each((_, el) => {
                const tds = $(el).find('td');
                
                if (tds.length >= 6) {
                    const dateText = $(tds[0]).text().trim();
                    const numbers = $(tds[1]).text().trim().split(/\s+/).map(n => parseInt(n)).filter(n => !isNaN(n));
                    const powerball = parseInt($(tds[2]).text().trim());
                    const powerPlay = $(tds[3]).text().trim();
                    
                    if (dateText && numbers.length === 5 && !isNaN(powerball)) {
                        allDraws.push({
                            draw_date: formatDate(dateText),
                            numbers: numbers,
                            bonus_number: powerball,
                            multiplier: powerPlay,
                            source: 'powerball_official'
                        });
                    }
                }
            });

            console.log(`  ✅ Found ${allDraws.length} draws so far...`);
        } catch (err) {
            console.log(`  ⚠️ Official Powerball site failed: ${err.message}`);
            console.log(`  🔄 Trying NCEL as fallback...`);
            
            // Fallback to NCEL
            try {
                const ncelUrl = `https://nclottery.com/powerball-past-draws?month=${month}&year=${year}`;
                const ncelResp = await axios.get(ncelUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                const ncel$ = load(ncelResp.data);
                
                // NCEL uses ASP.NET table structure
                // Row structure: Cell 0 = Date, Cell 1 = Numbers (with newlines), Cell 2 = "View"
                ncel$('table tbody tr').each((_, el) => {
                    const tds = ncel$(el).find('td');
                    
                    if (tds.length >= 3) {
                        const dateText = ncel$(tds[0]).text().trim();
                        const numbersBlock = ncel$(tds[1]).text().trim();
                        
                        // Extract numbers from block (numbers are separated by newlines/spaces)
                        const numbers = numbersBlock
                            .split(/\s+/)
                            .filter(x => /^\d+$/.test(x))
                            .map(Number)
                            .slice(0, 5); // Take first 5 as main numbers
                        
                        // Last number in the block is usually the Powerball
                        const allNums = numbersBlock
                            .split(/\s+/)
                            .filter(x => /^\d+$/.test(x))
                            .map(Number);
                        const powerball = allNums.length > 5 ? allNums[allNums.length - 1] : null;
                        
                        if (dateText && numbers.length === 5 && powerball) {
                            allDraws.push({
                                draw_date: formatDate(dateText),
                                numbers: numbers,
                                bonus_number: powerball,
                                source: 'powerball_official'
                            });
                        }
                    }
                });
                
                console.log(`  ✅ NCEL fallback successful: ${allDraws.length} draws total`);
            } catch (ncelErr) {
                console.log(`  ❌ NCEL fallback also failed: ${ncelErr.message}`);
            }
        }
    }

    // Remove duplicates
    const uniqueDraws = allDraws.filter(
        (v, i, a) => a.findIndex(t => t.draw_date === v.draw_date) === i
    );

    console.log(`\n📊 Total unique draws found: ${uniqueDraws.length}`);

    // Insert into Supabase
    if (uniqueDraws.length > 0) {
        try {
            // Get or create game_id for NC Powerball
            const { data: ncGame } = await supabase
                .from('lottery_games')
                .select('id')
                .eq('state_code', 'NC')
                .eq('game_key', 'powerball')
                .single();

            let ncGameId = ncGame?.id;
            if (!ncGameId) {
                ncGameId = crypto.randomUUID();
                await supabase.from('lottery_games').insert({
                    id: ncGameId,
                    state_code: 'NC',
                    game_key: 'powerball',
                    display_name: 'Powerball',
                    game_family: 'powerball',
                    primary_count: 5,
                    primary_min: 1,
                    primary_max: 69,
                    has_bonus: true,
                    bonus_count: 1,
                    bonus_min: 1,
                    bonus_max: 26,
                    bonus_label: 'Powerball',
                    draw_style: 'weekly',
                    supports_multiplier: true,
                    supports_fireball: false,
                    schedule_config: { windows: [{ label: 'nightly', time: '22:59', days: ['Mon', 'Wed', 'Sat'] }] }
                });
            }

            // Get or create source_id
            const { data: ncSource } = await supabase
                .from('draw_sources')
                .select('id')
                .eq('state_code', 'NC')
                .eq('source_key', 'powerball_official')
                .single();

            let ncSourceId = ncSource?.id;
            if (!ncSourceId) {
                ncSourceId = crypto.randomUUID();
                await supabase.from('draw_sources').insert({
                    id: ncSourceId,
                    state_code: 'NC',
                    source_key: 'powerball_official',
                    source_type: 'api',
                    base_url: 'https://www.powerball.com/',
                    parser_key: 'html',
                    priority: 1,
                    is_official: true,
                    is_active: true
                });
            }

            // Prepare records for insertion
            const dbRecords = uniqueDraws.map(draw => ({
                id: crypto.randomUUID(),
                game_id: ncGameId,
                draw_date: draw.draw_date,
                draw_window_label: 'nightly',
                draw_datetime_local: `${draw.draw_date}T22:59:00-05:00`,
                primary_numbers: draw.numbers,
                bonus_numbers: [draw.bonus_number],
                multiplier_value: draw.multiplier ? parseInt(draw.multiplier) : null,
                source_id: ncSourceId,
                source_draw_id: `${draw.draw_date}-powerball`,
                result_status: 'official',
                is_latest_snapshot: false
            }));

            // Check for existing records
            const dates = dbRecords.map(r => r.draw_date);
            const { data: existingDraws } = await supabase
                .from('official_draws')
                .select('draw_date')
                .eq('game_id', ncGameId)
                .in('draw_date', dates);

            const existingDates = existingDraws?.map(d => d.draw_date) || [];
            const newRecords = dbRecords.filter(r => !existingDates.includes(r.draw_date));

            console.log(`\n📈 New records to insert: ${newRecords.length}`);
            console.log(`⏭️  Skipped (already exist): ${existingDates.length}`);

            if (newRecords.length > 0) {
                const { error, data } = await supabase
                    .from('official_draws')
                    .insert(newRecords);

                if (error) {
                    console.error(`❌ Insert error: ${error.message}`);
                } else {
                    console.log(`✅ Successfully inserted ${newRecords.length} Powerball draws!`);
                }
            } else {
                console.log('✅ All draws already exist in database.');
            }
        } catch (err) {
            console.error(`❌ Database error: ${err.message}`);
        }
    }
})();

function formatDate(dateStr) {
    // Handle different date formats
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
}