#!/usr/bin/env node

import 'dotenv/config';
import axios from 'axios';
import { load } from 'cheerio';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
);

const MONTHS_BACK = 24;

function parseLxDate(text) {
  if (!text) return null;
  const m = text.match(/([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/);
  if (!m) return null;
  const months = { Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12 };
  const month = months[m[1].substring(0,3)];
  const day = String(parseInt(m[2])).padStart(2,'0');
  if (!month) return null;
  return `${m[3]}-${String(month).padStart(2,'0')}-${day}`;
}

async function getGameId(stateCode, gameKey) {
  const { data } = await supabase
    .from('lottery_games')
    .select('id')
    .eq('state_code', stateCode)
    .eq('game_key', gameKey)
    .maybeSingle();
  return data?.id;
}

async function scrape(name, url, gameKey) {
  console.log(`\n🔍 Scraping ${name} from lotteryextreme.com...`);

  try {
    const resp = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 15000,
    });

    const $ = load(resp.data);
    const draws = [];

    $('tr').each((_, row) => {
      const dateLink = $(row).find('td.cx a.link');
      if (dateLink.length === 0) return;

      const href = dateLink.attr('href') || '';
      const dateMatch = href.match(/numbers\/(\d{4}-\d{2}-\d{2})/);
      if (!dateMatch) return;

      const drawDate = dateMatch[1];

      const numsRow = $(row).next('tr');
      if (numsRow.length === 0) return;

      const ballItems = numsRow.find('ul.displayball li');
      if (ballItems.length < 6) return;

      const numbers = [];
      let bonus = null;

      ballItems.each((i, el) => {
        const cls = $(el).attr('class') || '';
        const val = parseInt($(el).text().trim());
        if (cls.includes('dbx')) return;
        if (isNaN(val)) return;
        if (i < 5) {
          numbers.push(val);
        } else if (bonus === null) {
          bonus = val;
        }
      });

      if (numbers.length === 5 && bonus !== null) {
        draws.push({
          draw_date: drawDate,
          numbers,
          bonus_number: bonus,
        });
      }
    });

    console.log(`  Found ${draws.length} draws`);

    if (draws.length === 0) return;

    const gameId = await getGameId('CA', gameKey);
    if (!gameId) {
      console.log(`  ⚠️ No active CA ${name} game entry found`);
      return;
    }

    const dates = draws.map(d => d.draw_date);
    const { data: existing } = await supabase
      .from('official_draws')
      .select('draw_date')
      .eq('game_id', gameId)
      .in('draw_date', dates);

    const existingDates = new Set(existing?.map(d => d.draw_date) || []);
    const newRecords = draws
      .filter(d => !existingDates.has(d.draw_date))
      .map(d => ({
        id: crypto.randomUUID(),
        game_id: gameId,
        draw_date: d.draw_date,
        draw_window_label: 'nightly',
        draw_datetime_local: `${d.draw_date}T20:00:00-07:00`,
        primary_numbers: d.numbers,
        bonus_numbers: [d.bonus_number],
        source_id: null,
        source_draw_id: `lx-${d.draw_date}-${gameKey}`,
        result_status: 'official',
        is_latest_snapshot: false,
      }));

    if (newRecords.length === 0) {
      console.log(`  ⏭️ All CA ${name} draws already exist`);
      return;
    }

    const { error } = await supabase.from('official_draws').insert(newRecords);
    if (error) {
      console.error(`  ❌ Insert error: ${error.message}`);
    } else {
      console.log(`  ✅ Inserted ${newRecords.length} CA ${name} draws from lotteryextreme.com`);
    }
  } catch (err) {
    console.error(`  ❌ Error scraping ${name}: ${err.message}`);
  }
}

(async () => {
  console.log('🚀 Starting CA Multi-State Scraper (lotteryextreme.com)...\n');
  await scrape('Powerball', 'https://www.lotteryextreme.com/powerball/results', 'powerball');
  console.log('\n✅ CA Multi-State scraper done!\n');
})();
