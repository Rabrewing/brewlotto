// /scripts/scrapeCA_MultiState.js
// BrewLotto AI — Live CA Multi-State Scraper
// Fetches latest draws from calottery.com Powerball & Mega Millions pages

import 'dotenv/config';
import axios from 'axios';
import { load } from 'cheerio';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
);

const GAME_CONFIGS = [
  {
    name: 'powerball',
    url: 'https://www.calottery.com/draw-games/powerball',
    gameKey: 'powerball',
    sourceKey: 'powerball_official',
    primaryCount: 5,
    hasBonus: true,
    dateTzLabel: 'PT',
    windowLabel: 'nightly',
    drawTime: '20:00',
  },
  {
    name: 'mega_millions',
    url: 'https://www.calottery.com/draw-games/mega-millions',
    gameKey: 'mega_millions',
    sourceKey: 'mega_millions_official',
    primaryCount: 5,
    hasBonus: true,
    dateTzLabel: 'PT',
    windowLabel: 'nightly',
    drawTime: '20:00',
  },
];

function parseCADate(text) {
  if (!text) return null;
  const m = text.match(/([A-Z]+)\/([A-Za-z]+)\s+(\d+),?\s*(\d{4})/i);
  if (!m) return null;
  const months = { JAN:1,FEB:2,MAR:3,APR:4,MAY:5,JUN:6,JUL:7,AUG:8,SEP:9,OCT:10,NOV:11,DEC:12 };
  const month = months[m[2].toUpperCase().substring(0,3)];
  const day = String(parseInt(m[3])).padStart(2,'0');
  const year = m[4] || new Date().getFullYear();
  if (!month) return null;
  return `${year}-${String(month).padStart(2,'0')}-${day}`;
}

async function getGameSourceIds(stateCode, gameKey, sourceKey) {
  const { data: game } = await supabase
    .from('lottery_games')
    .select('id')
    .eq('state_code', stateCode)
    .eq('game_key', gameKey)
    .single();

  const { data: source } = await supabase
    .from('draw_sources')
    .select('id')
    .eq('state_code', stateCode)
    .eq('source_key', sourceKey)
    .single();

  return { gameId: game?.id, sourceId: source?.id };
}

async function scrape() {
  console.log('🚀 Starting CA Multi-State Lottery Scraper...\n');
  let totalInserted = 0;

  for (const config of GAME_CONFIGS) {
    console.log(`🔍 Scraping ${config.name} from ${config.url}`);

    try {
      const resp = await axios.get(config.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 15000,
      });

      const $ = load(resp.data);
      const draws = [];
      const seenKeys = new Set();
      let currentDate = null;
      let currentNumbers = [];

      const collectNumber = (val) => {
        currentNumbers.push(val);
      };

      $('[class*="draw-cards"]').each((_, el) => {
        const cls = $(el).attr('class') || '';

        if (cls.includes('draw-cards--draw-date')) {
          const text = $(el).text().trim();
          currentDate = parseCADate(text);
          currentNumbers = [];
        }

        if (cls.includes('draw-cards--winning-numbers-inner-wrapper')) {
          const val = parseInt($(el).text().trim());
          if (!isNaN(val)) collectNumber(val);
        }
      });

      if (currentDate && currentNumbers.length >= config.primaryCount) {
        const primary = currentNumbers.slice(0, config.primaryCount);
        const bonus = currentNumbers.slice(config.primaryCount);
        const key = `${currentDate}-${config.windowLabel}`;
        if (!seenKeys.has(key)) {
          draws.push({ date: currentDate, window: config.windowLabel, numbers: primary, bonus });
          seenKeys.add(key);
        }
      }

      if (draws.length === 0) {
        console.log(`  ⚠️ No draws found for ${config.name}`);
        continue;
      }

      console.log(`  📅 Found ${draws.length} draw(s)`);
      for (const d of draws) {
        const bonusStr = d.bonus.length > 0 ? ` + ${d.bonus.join(',')}` : '';
        console.log(`     ${d.date}: [${d.numbers.join(', ')}]${bonusStr}`);
      }

      const { gameId, sourceId } = await getGameSourceIds('CA', config.gameKey, config.sourceKey);
      if (!gameId || !sourceId) {
        console.log(`  ⚠️ Game or source not found for CA ${config.name} — skipping`);
        console.log(`     gameId=${gameId}, sourceId=${sourceId}`);
        continue;
      }

      const records = draws.map(d => ({
        id: crypto.randomUUID(),
        game_id: gameId,
        draw_date: d.date,
        draw_window_label: d.window,
        draw_datetime_local: `${d.date}T${config.drawTime}:00-07:00`,
        primary_numbers: d.numbers,
        bonus_numbers: d.bonus,
        source_id: sourceId,
        source_draw_id: `${d.date}-${config.name}`,
        result_status: 'official',
        is_latest_snapshot: false,
        source_payload: {},
      }));

      const dates = records.map(r => r.draw_date);
      const { data: existing } = await supabase
        .from('official_draws')
        .select('draw_date, draw_window_label')
        .eq('game_id', gameId)
        .in('draw_date', dates);

      const existingKeys = new Set((existing || []).map(d => `${d.draw_date}-${d.draw_window_label}`));
      const newRecords = records.filter(r => !existingKeys.has(`${r.draw_date}-${r.draw_window_label}`));

      if (newRecords.length === 0) {
        console.log(`  ⏭️  All ${records.length} draws already exist`);
        continue;
      }

      const { error } = await supabase.from('official_draws').insert(newRecords);
      if (error) {
        console.error(`  ❌ Insert error: ${error.message}`);
        continue;
      }

      console.log(`  ✅ Inserted ${newRecords.length} new ${config.name} draws!`);
      totalInserted += newRecords.length;
    } catch (err) {
      console.error(`  ❌ Error scraping ${config.name}: ${err.message}`);
    }
  }

  console.log(`\n📊 TOTAL: ${totalInserted} new draws inserted`);
  if (totalInserted === 0) console.log('✅ All draws already up to date');
  console.log('✅ CA Multi-State scraper done!\n');
}

scrape();
