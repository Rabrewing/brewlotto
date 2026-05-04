// /scripts/scrapePowerball.js
// BrewLotto AI — Powerball Scraper
// Sources from NCEL (nclottery.com) — server-rendered, reliable HTML

import 'dotenv/config';
import axios from 'axios';
import { load } from 'cheerio';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
);

const MONTHS_BACK = 6;

function parseNCELDate(text) {
  if (!text) return null;
  const m = text.match(/(\d{4}),\s*([A-Za-z]+)\s+(\d+)/);
  if (!m) return null;
  const months = { Jan:1,Feb:1,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12 };
  const month = months[m[2].substring(0,3)];
  const day = String(parseInt(m[3])).padStart(2,'0');
  if (!month) return null;
  return `${m[1]}-${String(month).padStart(2,'0')}-${day}`;
}

(async () => {
  const allDraws = [];
  const today = new Date();

  console.log('🚀 Starting Powerball scraper (NCEL)...\n');

  for (let i = 0; i < MONTHS_BACK; i++) {
    const dt = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const year = dt.getFullYear();
    const month = dt.getMonth() + 1;
    const url = `https://nclottery.com/powerball-past-draws?month=${month}&year=${year}`;

    console.log(`Fetching: ${url}`);

    try {
      const resp = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 15000,
      });

      const $ = load(resp.data);
      let currentDate = null;

      $('table tbody tr').each((_, row) => {
        const tds = $(row).find('td');
        if (tds.length < 2) return;

        // Cell 0: draw date or empty (Double Play row)
        const dateText = $(tds[0]).text().trim();
        if (dateText) {
          currentDate = parseNCELDate(dateText);
        }
        if (!currentDate) return;

        // Cell 1: ball row
        const ballCell = $(tds[1]);
        const allBalls = ballCell.find('.ball');

        // White balls (5): any .ball without .powerball or .powerplay class
        const whiteBalls = [];
        let powerball = null;
        let powerplay = null;

        allBalls.each((_, el) => {
          const cls = $(el).attr('class') || '';
          const val = parseInt($(el).text().trim());
          if (cls.includes('powerball')) {
            powerball = val;
          } else if (cls.includes('powerplay')) {
            powerplay = $(el).text().trim();
          } else if (!isNaN(val)) {
            whiteBalls.push(val);
          }
        });

        if (whiteBalls.length === 5 && powerball) {
          allDraws.push({
            draw_date: currentDate,
            numbers: whiteBalls,
            bonus_number: powerball,
            multiplier: powerplay || null,
            source: 'powerball_official',
          });
        }
      });

      console.log(`  → ${allDraws.length} total draws so far`);
    } catch (err) {
      console.log(`  ⚠️ NCEL month ${month}/${year} failed: ${err.message}`);
    }
  }

  // Remove duplicates (same date from overlapping months)
  const seen = new Set();
  const uniqueDraws = allDraws.filter(d => {
    if (seen.has(d.draw_date)) return false;
    seen.add(d.draw_date);
    return true;
  });

  console.log(`\n📊 Total unique draws found: ${uniqueDraws.length}`);

  if (uniqueDraws.length === 0) {
    console.log('❌ No draws found!');
    process.exit(1);
  }

  // Insert into DB
  try {
    const { data: ncGame } = await supabase
      .from('lottery_games')
      .select('id')
      .eq('state_code', 'NC')
      .eq('game_key', 'powerball')
      .single();

    let ncGameId = ncGame?.id;

    const { data: ncSource } = await supabase
      .from('draw_sources')
      .select('id')
      .eq('state_code', 'NC')
      .eq('source_key', 'powerball_official')
      .single();

    const ncSourceId = ncSource?.id;
    if (!ncGameId || !ncSourceId) {
      console.error('❌ Game or source not found in database');
      process.exit(1);
    }

    console.log(`  ℹ️ Using game_id: ${ncGameId}`);
    console.log(`  ℹ️ Using source_id: ${ncSourceId}`);

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
      is_latest_snapshot: false,
    }));

    const dates = dbRecords.map(r => r.draw_date);
    const { data: existingDraws } = await supabase
      .from('official_draws')
      .select('draw_date')
      .eq('game_id', ncGameId)
      .in('draw_date', dates);

    const existingDates = new Set(existingDraws?.map(d => d.draw_date) || []);
    const newRecords = dbRecords.filter(r => !existingDates.has(r.draw_date));

    console.log(`\n📈 New records to insert: ${newRecords.length}`);
    console.log(`⏭️  Skipped (already exist): ${existingDates.size}`);

    if (newRecords.length > 0) {
      const { error } = await supabase.from('official_draws').insert(newRecords);
      if (error) {
        console.error(`❌ Insert error: ${error.message}`);
        process.exit(1);
      }
      console.log(`✅ Successfully inserted ${newRecords.length} Powerball draws!`);
      console.log(`   Latest: ${newRecords[0].draw_date} — [${newRecords[0].primary_numbers.join(', ')}] PB:${newRecords[0].bonus_numbers[0]}`);
    } else {
      console.log('✅ All draws already exist in database.');
    }
  } catch (err) {
    console.error(`❌ Database error: ${err.message}`);
    process.exit(1);
  }

  console.log('\n✅ Powerball scraper done!\n');
})();
