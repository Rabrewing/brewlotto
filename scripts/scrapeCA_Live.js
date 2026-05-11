#!/usr/bin/env node

import 'dotenv/config';
import axios from 'axios';
import { load } from 'cheerio';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
);

const SUFFICIENT_COUNT = 500;

const LXE_CONFIGS = {
  daily3: { baseUrl: 'https://www.lotteryextreme.com/california/daily3-detailed_results', latestDraw: 20924, primaryCount: 3, drawsPerDay: 2 },
  daily4: { baseUrl: 'https://www.lotteryextreme.com/california/daily4-detailed_results', latestDraw: 6510, primaryCount: 4, drawsPerDay: 1 },
  fantasy5: { baseUrl: 'https://www.lotteryextreme.com/california/fantasy5-detailed_results', latestDraw: 3500, primaryCount: 5, drawsPerDay: 1 },
};

const GAME_CONFIGS = [
  {
    name: 'daily3',
    url: 'https://www.calottery.com/draw-games/daily-3',
    gameId: '3dcc5b27-93d2-48d6-98db-6e8f252d1d4c',
    sourceId: 'ba37d645-227c-476f-a75e-e196b0b9bc5b',
    primaryCount: 3,
    dateTzLabel: 'PT',
    timeMap: { midday: '13:00', evening: '20:00' },
    lxKey: 'daily3',
  },
  {
    name: 'daily4',
    url: 'https://www.calottery.com/draw-games/daily-4',
    gameId: 'd3a39a20-3dc2-4d5a-ba44-a540db08334b',
    sourceId: '90350f06-25ac-47f7-8ae7-816ba347e5f9',
    primaryCount: 4,
    dateTzLabel: 'PT',
    timeMap: { daily: '20:00' },
    lxKey: 'daily4',
  },
  {
    name: 'fantasy5',
    url: 'https://www.calottery.com/draw-games/fantasy-5',
    gameId: 'b2d06c21-4171-4f9d-9245-69d097e1f836',
    sourceId: 'c6898951-2194-400f-822c-f901855fc9f5',
    primaryCount: 5,
    dateTzLabel: 'PT',
    timeMap: { nightly: '20:00' },
    lxKey: 'fantasy5',
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

function extractWindow(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  if (lower.includes('midday')) return 'midday';
  if (lower.includes('evening')) return 'evening';
  return 'daily';
}

async function countExistingDraws(gameId) {
  const { count, error } = await supabase
    .from('official_draws')
    .select('*', { count: 'exact', head: true })
    .eq('game_id', gameId);
  return error ? 0 : (count || 0);
}

async function scrapeLotteryExtremeDraw(lxConfig, drawId) {
  const drawsPerDay = lxConfig.drawsPerDay || 1;
  const refDate = new Date('2026-03-16');
  const daysBack = Math.floor((lxConfig.latestDraw - drawId) / drawsPerDay);
  const estimatedDate = new Date(refDate.getTime() - daysBack * 24 * 60 * 60 * 1000);
  const dateStr = estimatedDate.toISOString().split('T')[0];
  const url = `${lxConfig.baseUrl}(${dateStr}_${drawId})`;

  try {
    const resp = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 10000,
    });
    if (resp.status === 404 || resp.status === 410) return null;
    const $ = load(resp.data);
    const title = $('title').text();
    const dateMatch = title.match(/(\w+) (\d+), (\d{4})/);
    if (!dateMatch) return null;
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const month = (monthNames.indexOf(dateMatch[1]) + 1).toString().padStart(2, '0');
    const day = dateMatch[2].padStart(2, '0');
    const year = dateMatch[3];
    const drawDate = `${year}-${month}-${day}`;
    const numbers = [];
    $('ul.displayball li').each((i, el) => {
      if (i < lxConfig.primaryCount) {
        const num = $(el).text().trim();
        if (/^\d+$/.test(num)) numbers.push(parseInt(num));
      }
    });
    if (numbers.length !== lxConfig.primaryCount) return null;
    return { draw_date: drawDate, numbers };
  } catch {
    return null;
  }
}

async function backfillFromLotteryExtreme(config, maxDraws = 2000) {
  const lxConfig = LXE_CONFIGS[config.lxKey];
  if (!lxConfig) return [];

  console.log(`  📚 Backfilling from lotteryextreme.com (${maxDraws} draws max)...`);

  const draws = [];
  let consecutiveFails = 0;
  const startDraw = lxConfig.latestDraw;
  const endDraw = Math.max(1, startDraw - maxDraws + 1);

  for (let drawId = startDraw; drawId >= endDraw; drawId--) {
    const result = await scrapeLotteryExtremeDraw(lxConfig, drawId);
    if (result) {
      draws.push(result);
      consecutiveFails = 0;
    } else {
      consecutiveFails++;
    }
    if (consecutiveFails > 100) break;
    if (draws.length % 200 === 0 && draws.length > 0) {
      console.log(`     ${draws.length} draws found so far...`);
    }
    await new Promise(r => setTimeout(r, 30));
  }

  console.log(`     ✅ Found ${draws.length} historical draws from lotteryextreme.com`);
  return draws;
}

function getWindowForDraw(config, index) {
  if (config.name === 'daily3') {
    return index % 2 === 0 ? 'midday' : 'evening';
  }
  if (config.name === 'fantasy5') return 'nightly';
  return 'daily';
}

async function scrape() {
  console.log('🚀 Starting CA Live Lottery Scraper (with historical backfill)...\n');
  let totalInserted = 0;

  for (const config of GAME_CONFIGS) {
    const existingCount = await countExistingDraws(config.gameId);
    console.log(`📊 ${config.name}: ${existingCount} existing draws (threshold: ${SUFFICIENT_COUNT})`);

    console.log(`🔍 Scraping latest from ${config.url}`);
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

      $('[class*="draw-cards"]').each((_, el) => {
        const cls = $(el).attr('class') || '';
        if (cls.includes('draw-cards--draw-date')) {
          const text = $(el).text().trim();
          currentDate = parseCADate(text);
          currentWindow = config.name === 'daily3' ? extractWindow(text) : (config.name === 'fantasy5' ? 'nightly' : 'daily');
        }
        if (cls.includes('draw-cards--winning-numbers-inner-wrapper')) {
          currentNumbers.push(parseInt($(el).text().trim()));
          if (currentDate && currentNumbers.length === config.primaryCount) {
            const key = `${currentDate}-${currentWindow}`;
            if (!seenKeys.has(key)) {
              draws.push({ date: currentDate, window: currentWindow, numbers: [...currentNumbers] });
              seenKeys.add(key);
            }
            currentNumbers = [];
          }
        }
      });

      let allHistory = [];
      if (existingCount < SUFFICIENT_COUNT) {
        const lxDraws = await backfillFromLotteryExtreme(config);
        const dateGroups = new Map();
        for (const d of lxDraws) {
          if (!dateGroups.has(d.draw_date)) dateGroups.set(d.draw_date, []);
          dateGroups.get(d.draw_date).push(d.numbers);
        }
        for (const [date, entries] of dateGroups) {
          for (let i = 0; i < entries.length; i++) {
            allHistory.push({
              date,
              window: getWindowForDraw(config, i),
              numbers: entries[i],
            });
          }
        }
        console.log(`     📚 ${allHistory.length} deduped historical draws ready`);
      }

      const allRecords = [
        ...draws.map(d => ({ date: d.date, window: d.window, numbers: d.numbers })),
        ...allHistory,
      ];

      const seen = new Set();
      const unique = allRecords.filter(r => {
        const key = `${r.date}-${r.window}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      console.log(`  📅 Total unique draws: ${unique.length}`);

      if (unique.length === 0) {
        console.log(`  ⏭️ No draws for ${config.name}`);
        continue;
      }

      const dbRecords = unique.map(d => ({
        id: crypto.randomUUID(),
        game_id: config.gameId,
        draw_date: d.date,
        draw_window_label: d.window,
        draw_datetime_local: `${d.date}T${config.timeMap[d.window] || config.timeMap.daily || '20:00'}:00-07:00`,
        primary_numbers: d.numbers,
        bonus_numbers: [],
        source_id: config.sourceId,
        source_draw_id: `${d.date}-${d.window}-${config.name}`,
        result_status: 'official',
        is_latest_snapshot: false,
        source_payload: {},
      }));

      const dates = dbRecords.map(r => r.draw_date);
      const { data: existing } = await supabase
        .from('official_draws')
        .select('draw_date, draw_window_label')
        .eq('game_id', config.gameId)
        .in('draw_date', dates);

      const existingKeys = new Set((existing || []).map(d => `${d.draw_date}-${d.draw_window_label}`));
      const newRecords = dbRecords.filter(r => !existingKeys.has(`${r.draw_date}-${r.draw_window_label}`));

      if (newRecords.length === 0) {
        console.log(`  ⏭️ All up to date for ${config.name}`);
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
