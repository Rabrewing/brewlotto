// /scripts/scrapeNC_Live.js
// BrewLotto AI — Live NC Lottery Scraper
// Fetches latest draws from nclottery.com Pick3, Pick4, Cash5 pages

import 'dotenv/config';
import axios from 'axios';
import { load } from 'cheerio';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
);

const GAME_CONFIGS = {
  pick3: {
    url: 'https://nclottery.com/Pick3',
    gameId: '4c13cf53-f76b-4a58-9aee-d44bef7d08a8',
    sourceId: '06fc5df1-02af-4a34-813a-1f53f81cdc16',
    primaryCount: 3,
    drawsPerPage: 2,
    windows: ['day', 'evening'],
    timeMap: { day: '13:00', evening: '20:30' },
  },
  pick4: {
    url: 'https://nclottery.com/Pick4',
    gameId: 'cc7d82ed-cfcf-4ab2-a5aa-997f8249f18a',
    sourceId: 'c2716672-d2c2-49f8-956b-3050ccbbffca',
    primaryCount: 4,
    drawsPerPage: 2,
    windows: ['day', 'evening'],
    timeMap: { day: '13:00', evening: '20:30' },
  },
  cash5: {
    url: 'https://nclottery.com/Cash5',
    gameId: '25bd118c-d0f3-465c-8052-c2a9782481e1',
    sourceId: 'f439839b-5742-41c8-9774-340b9f75bf84',
    primaryCount: 5,
    drawsPerPage: 2,
    windows: ['nightly'],
    timeMap: { nightly: '23:22' },
  },
};

function parseDate(dateStr) {
  if (!dateStr) return null;
  // Handle "Thu, Apr 30" or "Thursday, Apr 30, 2026"
  const m = dateStr.match(/([A-Za-z]+),?\s+([A-Za-z]+)\s+(\d+),?\s*(\d{4})?/);
  if (!m) return null;
  const months = { Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12 };
  const month = months[m[2].substring(0,3)];
  const day = parseInt(m[3]);
  const year = m[4] ? parseInt(m[4]) : new Date().getFullYear();
  if (!month || !day) return null;
  return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

async function scrapeGame(config, gameName) {
  console.log(`\n🔍 Scraping ${gameName} from ${config.url}`);
  const resp = await axios.get(config.url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    timeout: 15000,
  });
  const $ = load(resp.data);
  const draws = [];

  if (gameName === 'cash5') {
    draws[0] = { numbers: [], dateStr: null };
    // Cash5 main content uses rptCash5 — only take first draw (ctl00), 5 balls
    $('span[id*="rptCash5_ctl00"]').each((i, el) => {
      const id = $(el).attr('id') || '';
      if (id.includes('lblBall')) {
        const ballNum = parseInt($(el).text().trim());
        if (!isNaN(ballNum) && draws[0].numbers.length < 5) draws[0].numbers.push(ballNum);
      }
      if (id.includes('lblDateValue')) {
        draws[0].dateStr = $(el).text().trim();
      }
    });
  } else {
    // NCEL IDs: Results{Game}Day_{Game}DayRepeater, Results{Game}Eve_{Game}EveRepeater
    const gameUpper = gameName.charAt(0).toUpperCase() + gameName.slice(1);
    const repeaterDay = `${gameUpper}DayRepeater`;
    const repeaterEve = `${gameUpper}EveRepeater`;

    $(`span[id*="${repeaterDay}"], span[id*="${repeaterEve}"]`).each((i, el) => {
      const id = $(el).attr('id') || '';
      // Only game-specific main content, not sidebar WinningNumbers section
      if (!id.includes('MainContent')) return;
      const isFireball = id.includes('Fireball') || $(el).hasClass('fireball');
      const isBall = id.includes('Ball') && !isFireball;

      if (isBall) {
        const drawIdx = id.includes(repeaterDay) ? 0 : 1;
        if (!draws[drawIdx]) draws[drawIdx] = { numbers: [], fireball: null, dateStr: null };
        const val = parseInt($(el).text().trim());
        if (!isNaN(val)) draws[drawIdx].numbers.push(val);
      }
      if (isFireball) {
        const drawIdx = id.includes(repeaterDay) ? 0 : 1;
        if (!draws[drawIdx]) draws[drawIdx] = { numbers: [], fireball: null, dateStr: null };
        draws[drawIdx].fireball = parseInt($(el).text().trim());
      }
      if (id.includes('lblDrawDate') && !id.includes('Label') && !id.includes('Next')) {
        const drawIdx = id.includes(repeaterDay) ? 0 : 1;
        if (!draws[drawIdx]) draws[drawIdx] = { numbers: [], fireball: null, dateStr: null };
        draws[drawIdx].dateStr = $(el).text().trim();
      }
    });
  }

  // Filter and insert
  const results = [];
  for (let i = 0; i < draws.length; i++) {
    const d = draws[i];
    if (!d || !d.numbers || d.numbers.length === 0) continue;

    const drawDate = d.dateStr ? parseDate(d.dateStr) : null;
    if (!drawDate) {
      console.log(`  ⚠️ Could not parse date for draw ${i}`);
      continue;
    }

    const windowIdx = config.windows[i] || config.windows[0];
    const timeStr = config.timeMap[windowIdx] || '20:00';
    const sourceDrawId = `${drawDate}-${windowIdx}-${gameName}`;

    results.push({
      id: crypto.randomUUID(),
      game_id: config.gameId,
      draw_date: drawDate,
      draw_window_label: windowIdx,
      draw_datetime_local: `${drawDate}T${timeStr}:00-05:00`,
      primary_numbers: d.numbers,
      bonus_numbers: [],
      fireball_value: d.fireball || null,
      source_id: config.sourceId,
      source_draw_id: sourceDrawId,
      result_status: 'official',
      is_latest_snapshot: false,
      source_payload: {},
    });

    console.log(`  📅 ${drawDate} ${windowIdx}: [${d.numbers.join(', ')}]${d.fireball ? ` FB:${d.fireball}` : ''}`);
  }

  return results;
}

async function insertDraws(records, gameName) {
  if (records.length === 0) {
    console.log(`  ⏭️ No records to insert for ${gameName}`);
    return 0;
  }

  const dates = records.map(r => r.draw_date);
  const { data: existing } = await supabase
    .from('official_draws')
    .select('draw_date, draw_window_label')
    .eq('game_id', records[0].game_id)
    .in('draw_date', dates);

  const existingKeys = new Set(
    (existing || []).map(d => `${d.draw_date}-${d.draw_window_label}`)
  );

  const newRecords = records.filter(r => !existingKeys.has(`${r.draw_date}-${r.draw_window_label}`));

  if (newRecords.length === 0) {
    console.log(`  ⏭️ All ${records.length} draws already exist`);
    return 0;
  }

  const { error } = await supabase.from('official_draws').insert(newRecords);
  if (error) {
    console.error(`  ❌ Insert error: ${error.message}`);
    return -1;
  }

  console.log(`  ✅ Inserted ${newRecords.length} new ${gameName} draws!`);
  return newRecords.length;
}

(async () => {
  console.log('🚀 Starting Live NC Lottery Scraper...\n');

  let totalInserted = 0;

  for (const [gameName, config] of Object.entries(GAME_CONFIGS)) {
    try {
      const records = await scrapeGame(config, gameName);
      const inserted = await insertDraws(records, gameName);
      if (inserted > 0) totalInserted += inserted;
    } catch (err) {
      console.error(`  ❌ Error scraping ${gameName}: ${err.message}`);
    }
  }

  console.log(`\n📊 TOTAL: ${totalInserted} new draws inserted`);
  if (totalInserted === 0) {
    console.log('✅ All draws already up to date');
  }
  console.log('✅ NC Live scraper done!\n');
})();
