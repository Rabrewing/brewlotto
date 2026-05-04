// /scripts/scrapeCA_Live.js
// BrewLotto AI — Live CA Lottery Scraper
// Fetches latest draws from calottery.com Daily 3, Daily 4, Fantasy 5 pages

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
    name: 'daily3',
    url: 'https://www.calottery.com/draw-games/daily-3',
    gameId: '3dcc5b27-93d2-48d6-98db-6e8f252d1d4c',
    sourceId: 'ba37d645-227c-476f-a75e-e196b0b9bc5b',
    primaryCount: 3,
    dateTzLabel: 'PT',
    timeMap: { midday: '13:00', evening: '20:00' },
  },
  {
    name: 'daily4',
    url: 'https://www.calottery.com/draw-games/daily-4',
    gameId: 'd3a39a20-3dc2-4d5a-ba44-a540db08334b',
    sourceId: '90350f06-25ac-47f7-8ae7-816ba347e5f9',
    primaryCount: 4,
    dateTzLabel: 'PT',
    timeMap: { daily: '20:00' },
  },
  {
    name: 'fantasy5',
    url: 'https://www.calottery.com/draw-games/fantasy-5',
    gameId: 'b2d06c21-4171-4f9d-9245-69d097e1f836',
    sourceId: 'c6898951-2194-400f-822c-f901855fc9f5',
    primaryCount: 5,
    dateTzLabel: 'PT',
    timeMap: { nightly: '20:00' },
  },
];

function parseCADate(text) {
  if (!text) return null;
  // "FRI/MAY 1, 2026 - EVENING" or "FRI/MAY 1, 2026"
  const m = text.match(/([A-Z]+)\/([A-Za-z]+)\s+(\d+),?\s*(\d{4})/i);
  if (!m) return null;
  const months = { JAN:1,FEB:1,MAR:3,APR:4,MAY:5,JUN:6,JUL:7,AUG:8,SEP:9,OCT:10,NOV:11,DEC:12 };
  const month = months[m[2].toUpperCase().substring(0,3)];
  const day = String(parseInt(m[3])).padStart(2,'0');
  const year = m[4] || new Date().getFullYear();
  if (!month) return null;
  return `${year}-${String(month).padStart(2,'0')}-${day}`;
}

function extractWindow(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  if (lower.includes('midday')) return 'midday';
  if (lower.includes('evening')) return 'evening';
  return 'daily';
}

async function scrape() {
  console.log('🚀 Starting CA Live Lottery Scraper...\n');
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
      let currentWindow = null;
      let currentNumbers = [];

      const collectNumber = (val) => {
        currentNumbers.push(val);
        if (currentDate && currentNumbers.length === config.primaryCount) {
          const key = `${currentDate}-${currentWindow}`;
          if (!seenKeys.has(key)) {
            draws.push({ date: currentDate, window: currentWindow, numbers: [...currentNumbers] });
            seenKeys.add(key);
          }
          // Reset for next section (mobile/desktop duplicate)
          currentNumbers = [];
        }
      };

      $('[class*="draw-cards"]').each((_, el) => {
        const cls = $(el).attr('class') || '';

        if (cls.includes('draw-cards--draw-date')) {
          const text = $(el).text().trim();
          currentDate = parseCADate(text);
          currentWindow = config.name === 'daily3'
            ? extractWindow(text)
            : config.name === 'fantasy5' ? 'nightly' : 'daily';
          currentNumbers = currentNumbers.filter(n => !n); // reset from any stale data
        }

        if (cls.includes('draw-cards--winning-numbers-inner-wrapper')) {
          const val = parseInt($(el).text().trim());
          if (!isNaN(val)) collectNumber(val);
        }
      });

      if (draws.length === 0) {
        console.log(`  ⚠️ No draws found for ${config.name}`);
        continue;
      }

      console.log(`  📅 Found ${draws.length} draws`);
      for (const d of draws) {
        console.log(`     ${d.date} ${d.window}: [${d.numbers.join(', ')}]`);
      }

      // Insert into DB
      const records = draws.map(d => ({
        id: crypto.randomUUID(),
        game_id: config.gameId,
        draw_date: d.date,
        draw_window_label: d.window,
        draw_datetime_local: `${d.date}T${config.timeMap[d.window] || config.timeMap.daily}:00-08:00`,
        primary_numbers: d.numbers,
        bonus_numbers: [],
        source_id: config.sourceId,
        source_draw_id: `${d.date}-${d.window}-${config.name}`,
        result_status: 'official',
        is_latest_snapshot: false,
        source_payload: {},
      }));

      // Dedup
      const dates = records.map(r => r.draw_date);
      const { data: existing } = await supabase
        .from('official_draws')
        .select('draw_date, draw_window_label')
        .eq('game_id', config.gameId)
        .in('draw_date', dates);

      const existingKeys = new Set((existing || []).map(d => `${d.draw_date}-${d.draw_window_label}`));
      const newRecords = records.filter(r => !existingKeys.has(`${r.draw_date}-${r.draw_window_label}`));

      if (newRecords.length === 0) {
        console.log(`  ⏭️ All ${records.length} draws already exist`);
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
  console.log('✅ CA Live scraper done!\n');
}

scrape();
