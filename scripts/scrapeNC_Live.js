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

const GAME_CONFIGS = {
  pick3: {
    url: 'https://nclottery.com/Pick3',
    pastUrl: 'https://nclottery.com/pick3-past-draws',
    gameId: '4c13cf53-f76b-4a58-9aee-d44bef7d08a8',
    sourceId: '06fc5df1-02af-4a34-813a-1f53f81cdc16',
    primaryCount: 3,
    windows: ['day', 'evening'],
    timeMap: { day: '13:00', evening: '20:30' },
    hasFireball: true,
  },
  pick4: {
    url: 'https://nclottery.com/Pick4',
    pastUrl: 'https://nclottery.com/pick4-past-draws',
    gameId: 'cc7d82ed-cfcf-4ab2-a5aa-997f8249f18a',
    sourceId: 'c2716672-d2c2-49f8-956b-3050ccbbffca',
    primaryCount: 4,
    windows: ['day', 'evening'],
    timeMap: { day: '13:00', evening: '20:30' },
    hasFireball: true,
  },
  cash5: {
    url: 'https://nclottery.com/Cash5',
    pastUrl: 'https://nclottery.com/cash5-past-draws',
    gameId: '25bd118c-d0f3-465c-8052-c2a9782481e1',
    sourceId: 'f439839b-5742-41c8-9774-340b9f75bf84',
    primaryCount: 5,
    windows: ['nightly'],
    timeMap: { nightly: '23:22' },
    hasFireball: false,
  },
};

function parseDate(dateStr) {
  if (!dateStr) return null;
  const m = dateStr.match(/([A-Za-z]+),?\s+([A-Za-z]+)\s+(\d+),?\s*(\d{4})?/);
  if (!m) return null;
  const months = { Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12 };
  const month = months[m[2].substring(0,3)];
  const day = parseInt(m[3]);
  const year = m[4] ? parseInt(m[4]) : new Date().getFullYear();
  if (!month || !day) return null;
  return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

function parseNcelDate(text) {
  if (!text) return null;
  const m = text.match(/(\d{4}),\s*([A-Za-z]+)\s+(\d+)/);
  if (!m) return null;
  const months = { Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12 };
  const month = months[m[2].substring(0,3)];
  const day = String(parseInt(m[3])).padStart(2,'0');
  if (!month) return null;
  return `${m[1]}-${String(month).padStart(2,'0')}-${day}`;
}

async function scrapeLatest(config, gameName) {
  const resp = await axios.get(config.url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    timeout: 15000,
  });
  const $ = load(resp.data);
  const draws = [];

  if (gameName === 'cash5') {
    draws[0] = { numbers: [], dateStr: null };
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
    const gameUpper = gameName.charAt(0).toUpperCase() + gameName.slice(1);
    const repeaterDay = `${gameUpper}DayRepeater`;
    const repeaterEve = `${gameUpper}EveRepeater`;

    $(`span[id*="${repeaterDay}"], span[id*="${repeaterEve}"]`).each((i, el) => {
      const id = $(el).attr('id') || '';
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

  const results = [];
  for (let i = 0; i < draws.length; i++) {
    const d = draws[i];
    if (!d || !d.numbers || d.numbers.length === 0) continue;

    const drawDate = d.dateStr ? parseDate(d.dateStr) : null;
    if (!drawDate) continue;

    const windowIdx = config.windows[i] || config.windows[0];
    const timeStr = config.timeMap[windowIdx] || '20:00';

    results.push({
      draw_date: drawDate,
      draw_window_label: windowIdx,
      draw_datetime_local: `${drawDate}T${timeStr}:00-04:00`,
      primary_numbers: d.numbers,
      bonus_numbers: [],
      fireball_value: d.fireball || null,
      source_draw_id: `${drawDate}-${windowIdx}-${gameName}`,
    });

    console.log(`  📅 ${drawDate} ${windowIdx}: [${d.numbers.join(', ')}]${d.fireball ? ` FB:${d.fireball}` : ''}`);
  }

  return results;
}

async function scrapePastDraws(config, gameName) {
  const allRecords = [];
  const today = new Date();

  for (let i = 0; i < MONTHS_BACK; i++) {
    const dt = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const year = dt.getFullYear();
    const month = dt.getMonth() + 1;
    const url = `${config.pastUrl}?month=${month}&year=${year}`;

    try {
      const resp = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 15000,
      });
      const $ = load(resp.data);

      $('table tbody tr').each((_, row) => {
        const tds = $(row).find('td');
        if (tds.length < 2) return;

        const dateText = $(tds[0]).text().trim();
        if (!dateText || dateText.includes('download')) return;

        const drawDate = parseNcelDate(dateText);
        if (!drawDate) return;

        const ballCell = $(tds[1]);
        const ballElements = ballCell.find('.ball');
        const numbers = [];
        ballElements.each((_, el) => {
          const val = parseInt($(el).text().trim());
          if (!isNaN(val)) numbers.push(val);
        });

        if (numbers.length !== config.primaryCount) return;

        let fireballValue = null;
        if (config.hasFireball) {
          const cellText = ballCell.text().trim();
          const allNums = cellText.split(/\s+/).filter(x => /^\d+$/.test(x)).map(Number);
          if (allNums.length > config.primaryCount) {
            fireballValue = allNums[allNums.length - 1];
          }
        }

        allRecords.push({
          draw_date: drawDate,
          primary_numbers: numbers,
          fireball_value: fireballValue,
        });
      });
    } catch (err) {
      // silently skip failed months
    }
  }

  const dateGroups = new Map();
  for (const r of allRecords) {
    if (!dateGroups.has(r.draw_date)) dateGroups.set(r.draw_date, []);
    dateGroups.get(r.draw_date).push(r);
  }

  const windowedRecords = [];
  const drawsPerDay = config.windows.length;

  for (const [date, entries] of dateGroups) {
    for (let i = 0; i < Math.min(entries.length, drawsPerDay); i++) {
      const entry = entries[i];
      const windowLabel = config.windows[i] || config.windows[0];
      const timeStr = config.timeMap[windowLabel] || '20:00';

      windowedRecords.push({
        draw_date: date,
        draw_window_label: windowLabel,
        draw_datetime_local: `${date}T${timeStr}:00-04:00`,
        primary_numbers: entry.primary_numbers,
        bonus_numbers: [],
        fireball_value: entry.fireball_value || null,
        source_draw_id: `${date}-${windowLabel}-${gameName}-past`,
      });
    }
  }

  windowedRecords.sort((a, b) => b.draw_date.localeCompare(a.draw_date));

  console.log(`  📚 Past draws found: ${windowedRecords.length} (${dateGroups.size} days)`);
  return windowedRecords;
}

async function insertDraws(records, gameId, sourceId, gameName) {
  if (records.length === 0) {
    console.log(`  ⏭️ No records for ${gameName}`);
    return 0;
  }

  const dates = [...new Set(records.map(r => r.draw_date))];
  const { data: existing } = await supabase
    .from('official_draws')
    .select('draw_date, draw_window_label')
    .eq('game_id', gameId)
    .in('draw_date', dates);

  const existingKeys = new Set(
    (existing || []).map(d => `${d.draw_date}-${d.draw_window_label}`)
  );

  const newRecords = records.filter(r => !existingKeys.has(`${r.draw_date}-${r.draw_window_label}`));

  if (newRecords.length === 0) {
    console.log(`  ⏭️ All ${records.length} ${gameName} draws already exist`);
    return 0;
  }

  const dbRecords = newRecords.map(r => ({
    id: crypto.randomUUID(),
    game_id: gameId,
    draw_date: r.draw_date,
    draw_window_label: r.draw_window_label,
    draw_datetime_local: r.draw_datetime_local,
    primary_numbers: r.primary_numbers,
    bonus_numbers: r.bonus_numbers || [],
    fireball_value: r.fireball_value || null,
    source_id: sourceId || null,
    source_draw_id: r.source_draw_id,
    result_status: 'official',
    is_latest_snapshot: false,
    source_payload: {},
  }));

  const { error } = await supabase.from('official_draws').insert(dbRecords);
  if (error) {
    console.error(`  ❌ Insert error for ${gameName}: ${error.message}`);
    return -1;
  }

  console.log(`  ✅ Inserted ${dbRecords.length} new ${gameName} draws!`);
  return dbRecords.length;
}

async function countExistingDraws(gameId) {
  const { count, error } = await supabase
    .from('official_draws')
    .select('*', { count: 'exact', head: true })
    .eq('game_id', gameId);
  if (error) return 0;
  return count || 0;
}

async function scrapeCurrentMonthFallback(config, gameName) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const url = `${config.pastUrl}?month=${month}&year=${year}`;
  try {
    const resp = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 15000,
    });
    const $ = load(resp.data);
    const records = [];
    let currentDate = null;

    $('table tbody tr').each((_, row) => {
      const tds = $(row).find('td');
      if (tds.length < 2) return;
      const dateText = $(tds[0]).text().trim();
      if (dateText && !dateText.includes('download')) {
        currentDate = parseNcelDate(dateText);
      }
      if (!currentDate) return;

      const ballCell = $(tds[1]);
      const numbers = [];
      ballCell.find('.ball').each((_, el) => {
        const val = parseInt($(el).text().trim());
        if (!isNaN(val)) numbers.push(val);
      });

      if (numbers.length !== config.primaryCount) return;

      const isDoublePlay = !dateText || dateText.includes('download');
      let fireballValue = null;
      if (config.hasFireball) {
        const allTextNums = ballCell.text().trim().split(/\s+/).filter(x => /^\d+$/.test(x)).map(Number);
        if (allTextNums.length > config.primaryCount) fireballValue = allTextNums[allTextNums.length - 1];
      }

      records.push({
        draw_date: currentDate,
        primary_numbers: numbers,
        fireball_value: fireballValue || null,
        double_play: isDoublePlay,
      });
    });

    const dateGroups = new Map();
    for (const r of records) {
      if (!dateGroups.has(r.draw_date)) dateGroups.set(r.draw_date, []);
      dateGroups.get(r.draw_date).push(r);
    }

    const result = [];
    for (const [date, entries] of dateGroups) {
      let windowIdx = 0;
      for (const entry of entries) {
        if (entry.double_play) continue;
        const windowLabel = config.windows[windowIdx] || config.windows[0];
        const timeStr = config.timeMap[windowLabel] || '20:00';
        result.push({
          draw_date: date,
          draw_window_label: windowLabel,
          draw_datetime_local: `${date}T${timeStr}:00-04:00`,
          primary_numbers: entry.primary_numbers,
          bonus_numbers: [],
          fireball_value: entry.fireball_value || null,
          source_draw_id: `${date}-${windowLabel}-${gameName}-fallback`,
        });
        windowIdx++;
      }
    }

    return result;
  } catch {
    return [];
  }
}

function dateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

(async () => {
  console.log('🚀 Starting Live NC Lottery Scraper (with efficient backfill)...\n');

  let totalInserted = 0;

  for (const [gameName, config] of Object.entries(GAME_CONFIGS)) {
    console.log(`\n═══════════════════════════════════`);
    console.log(`📋 ${gameName.toUpperCase()}`);
    console.log(`═══════════════════════════════════`);

    try {
      const existingCount = await countExistingDraws(config.gameId);
      console.log(`  📊 Existing draws: ${existingCount}`);

      console.log(`\n📰 Scraping latest draws from ${config.url}...`);
      const latest = await scrapeLatest(config, gameName);

      let past = [];

      if (existingCount < 500) {
        console.log(`\n📚 Backfilling past draws (${MONTHS_BACK} months, ${existingCount} < 500 threshold)...`);
        past = await scrapePastDraws(config, gameName);
      }

      console.log(`  🔍 Supplementing with current month past-draws...`);
      const supplement = await scrapeCurrentMonthFallback(config, gameName);
      if (supplement.length > 0) {
        console.log(`  📚 Found ${supplement.length} draws from current month`);
        past = [...past, ...supplement];
      }

      const allRecords = [...latest, ...past];

      if (allRecords.length === 0) {
        console.log(`  ⏭️ No records for ${gameName}`);
        continue;
      }

      const inserted = await insertDraws(allRecords, config.gameId, config.sourceId, gameName);
      if (inserted > 0) totalInserted += inserted;
    } catch (err) {
      console.error(`  ❌ Error processing ${gameName}: ${err.message}`);
    }
  }

  console.log(`\n📊 TOTAL: ${totalInserted} new draws inserted`);
  if (totalInserted === 0) {
    console.log('✅ All draws already up to date');
  }
  console.log('✅ NC Live scraper done!\n');
})();
