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
const SUFFICIENT_COUNT = 500;

function parseNCELDate(text) {
  if (!text) return null;
  const m = text.match(/(\d{4}),\s*([A-Za-z]+)\s+(\d+)/);
  if (!m) return null;
  const months = { Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12 };
  const month = months[m[2].substring(0,3)];
  const day = String(parseInt(m[3])).padStart(2,'0');
  if (!month) return null;
  return `${m[1]}-${String(month).padStart(2,'0')}-${day}`;
}

async function getGames() {
  const { data } = await supabase
    .from('lottery_games')
    .select('id, state_code')
    .eq('game_key', 'powerball')
    .in('state_code', ['NC', 'CA'])
    .eq('is_active', true);
  return data || [];
}

async function getSources() {
  const { data } = await supabase
    .from('draw_sources')
    .select('id, state_code')
    .eq('source_key', 'powerball_official');
  return data || [];
}

async function scrapeMonth(year, month) {
  const url = `https://nclottery.com/powerball-past-draws?month=${month}&year=${year}`;
  const resp = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    timeout: 15000,
  });
  const $ = load(resp.data);
  const draws = [];
  let currentDate = null;

  $('table tbody tr').each((_, row) => {
    const tds = $(row).find('td');
    if (tds.length < 2) return;
    const dateText = $(tds[0]).text().trim();
    if (dateText) currentDate = parseNCELDate(dateText);
    if (!currentDate) return;
    const ballCell = $(tds[1]);
    const allBalls = ballCell.find('.ball');
    const whiteBalls = [];
    let powerball = null;
    allBalls.each((_, el) => {
      const cls = $(el).attr('class') || '';
      const val = parseInt($(el).text().trim());
      if (cls.includes('powerball')) powerball = val;
      else if (!cls.includes('powerplay') && !isNaN(val)) whiteBalls.push(val);
    });
    if (whiteBalls.length === 5 && powerball) {
      draws.push({ draw_date: currentDate, numbers: whiteBalls, bonus_number: powerball });
    }
  });

  return draws;
}

(async () => {
  const games = await getGames();
  const sources = await getSources();

  if (games.length === 0) {
    console.error('❌ No active Powerball game entries for NC or CA');
    process.exit(1);
  }

  let totalDbCount = 0;
  for (const game of games) {
    const { count } = await supabase
      .from('official_draws')
      .select('*', { count: 'exact', head: true })
      .eq('game_id', game.id);
    totalDbCount += count || 0;
  }

  const needsBackfill = totalDbCount < SUFFICIENT_COUNT;
  console.log(`🚀 Starting Powerball scraper (NCEL, multi-state)...`);
  console.log(`📊 Total draws in DB: ${totalDbCount} (threshold: ${SUFFICIENT_COUNT}, backfill: ${needsBackfill ? 'YES' : 'NO'})\n`);

  const today = new Date();
  const monthCount = needsBackfill ? MONTHS_BACK : 2;
  const allDraws = [];

  for (let i = 0; i < monthCount; i++) {
    const dt = new Date(today.getFullYear(), today.getMonth() - i, 1);
    try {
      const draws = await scrapeMonth(dt.getFullYear(), dt.getMonth() + 1);
      allDraws.push(...draws);
      console.log(`  ${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}: ${draws.length} draws (total: ${allDraws.length})`);
    } catch (err) {
      console.log(`  ⚠️ ${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')} failed: ${err.message}`);
    }
  }

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

  for (const game of games) {
    const source = sources.find(s => s.state_code === game.state_code);
    if (!source) {
      console.log(`  ⚠️ No source for ${game.state_code} — skipping`);
      continue;
    }

    const { data: existing } = await supabase
      .from('official_draws')
      .select('draw_date')
      .eq('game_id', game.id)
      .in('draw_date', uniqueDraws.map(d => d.draw_date));

    const existingDates = new Set(existing?.map(d => d.draw_date) || []);

    const dbRecords = uniqueDraws
      .filter(d => !existingDates.has(d.draw_date))
      .map(draw => ({
        id: crypto.randomUUID(),
        game_id: game.id,
        draw_date: draw.draw_date,
        draw_window_label: 'nightly',
        draw_datetime_local: `${draw.draw_date}T22:59:00-04:00`,
        primary_numbers: draw.numbers,
        bonus_numbers: [draw.bonus_number],
        source_id: source.id,
        source_draw_id: `${draw.draw_date}-powerball-${game.state_code}`,
        result_status: 'official',
        is_latest_snapshot: false,
      }));

    if (dbRecords.length > 0) {
      const { error } = await supabase.from('official_draws').insert(dbRecords);
      if (error) {
        console.error(`  ❌ Insert error for ${game.state_code}: ${error.message}`);
      } else {
        console.log(`  ✅ Inserted ${dbRecords.length} new ${game.state_code} draws`);
      }
    } else {
      console.log(`  ✅ ${game.state_code} — all up to date`);
    }
  }

  console.log('\n✅ Powerball scraper done!\n');
})();
