#!/usr/bin/env node

/**
 * Unified Ingestion Job with Delayed-Draw Retry
 * Runs all scrapers, then retries delayed games up to 2 more times.
 */

import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DELAY_BETWEEN_SCRAPERS = 2000;
const RETRY_DELAY_MS = 10000;

const STATE_GAME_KEYS = {
  caDaily3: { state: 'CA', game: 'daily3' },
  caDaily4: { state: 'CA', game: 'daily4' },
  caFantasy5: { state: 'CA', game: 'fantasy5' },
  ncLive: { state: 'NC', game: ['pick3', 'pick4', 'cash5'] },
  powerball: { state: 'NC', game: 'powerball' },
  megaMillions: { state: 'NC', game: 'mega_millions' },
};

const SCRAPER_COMMANDS = {
  caDaily3: 'node scripts/scrapeCA_Data.js daily3 50',
  caDaily4: 'node scripts/scrapeCA_Data.js daily4 50',
  caFantasy5: 'node scripts/fetchCAData.js',
  ncLive: 'node scripts/scrapeNC_Live.js',
  powerball: 'node scripts/scrapePowerball.js',
  megaMillions: 'node scripts/scrapeMega.js',
};

function runCommand(command, description, maxRetries = 3) {
  console.log(`\n🔄 ${description}...`);
  console.log(`   Command: ${command}`);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
      console.log(`✅ ${description} completed (attempt ${attempt}/${maxRetries})`);
      return { success: true, output, attempts: attempt };
    } catch (error) {
      console.log(`⚠️ Attempt ${attempt}/${maxRetries} failed: ${error.message.slice(0, 120)}`);
      if (attempt < maxRetries) {
        waitSync(Math.min(1000 * Math.pow(2, attempt), 30000));
      }
    }
  }

  console.error(`❌ ${description} failed after ${maxRetries} attempts`);
  return { success: false, error: 'max retries', attempts: maxRetries };
}

function waitSync(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {}
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function refreshFreshness() {
  try {
    const { error } = await supabase.rpc('refresh_draw_freshness_status');
    if (error) {
      // Fallback: use raw SQL via DB
      console.log('  ℹ️ RPC not available for refresh');
    }
  } catch {
    // silently skip — refresh may fail if RPC doesn't exist
  }
}

async function getDelayedGames() {
  try {
    const { data, error } = await supabase
      .from('v_ingestion_health_summary')
      .select('state_code, game_key, freshness_status, game_name');

    if (error) {
      console.log(`  ⚠️ Could not query freshness: ${error.message}`);
      return [];
    }

    const delayed = (data || []).filter(
      r => r.freshness_status === 'delayed' || r.freshness_status === 'stale'
    );

    if (delayed.length > 0) {
      console.log(`  🔍 Delayed games detected:`);
      delayed.forEach(d => console.log(`     ${d.state_code} ${d.game_name} (${d.freshness_status})`));
    }

    return delayed;
  } catch (err) {
    console.log(`  ⚠️ Freshness check error: ${err.message}`);
    return [];
  }
}

function getDelayedKeys(delayedGames) {
  const delayed = new Set(
    delayedGames.map(d => `${d.state_code}:${d.game_key}`)
  );

  return Object.entries(STATE_GAME_KEYS).filter(([key, spec]) => {
    const games = Array.isArray(spec.game) ? spec.game : [spec.game];
    return games.some(g => delayed.has(`${spec.state}:${g}`));
  }).map(([key]) => key);
}

const RUN_ORDER = ['caDaily3', 'caDaily4', 'caFantasy5', 'ncLive', 'powerball', 'megaMillions'];

async function ingestRound(results, keys, label) {
  console.log(`\n📍 ${label}`);
  for (const key of keys) {
    if (!results[key]) results[key] = null;
    if (results[key]?.success && label !== 'ROUND 1') {
      console.log(`   Skipping ${key} (already succeeded in earlier round)`);
      continue;
    }
    results[key] = runCommand(SCRAPER_COMMANDS[key], key);
    await wait(DELAY_BETWEEN_SCRAPERS);
  }
}

async function printSummary(results) {
  console.log('\n' + '─'.repeat(60));
  console.log('📊 INGESTION JOB SUMMARY');
  console.log('─'.repeat(60));

  const entries = Object.values(results).filter(Boolean);
  const totalSuccess = entries.filter(r => r.success).length;
  const totalFailed = entries.filter(r => !r.success).length;

  console.log(`\n✅ Successful: ${totalSuccess}/${entries.length}`);
  console.log(`❌ Failed: ${totalFailed}/${entries.length}`);

  Object.entries(results).forEach(([key, result]) => {
    if (result) {
      const displayKey = key === 'ncLive' ? 'ncLive (Pick3+Pick4+Cash5)' : key;
      console.log(`${result.success ? '✅' : '❌'} ${displayKey}: ${result.success ? 'Success' : 'Failed'}`);
    }
  });
}

async function runIngestionJob() {
  console.log('🚀 Starting Unified Ingestion Job');
  console.log(`📅 Date: ${new Date().toISOString()}`);
  console.log('═'.repeat(60));

  const results = {};
  const trackedKeys = Object.keys(SCRAPER_COMMANDS);

  // ── ROUND 1: Primary scrape ──
  await ingestRound(results, RUN_ORDER, 'PHASE 1: Primary Scrape');

  // ── Refresh freshness ──
  console.log('\n📍 REFRESH: Checking freshness');
  await refreshFreshness();
  let delayedGames = await getDelayedGames();

  if (delayedGames.length === 0) {
    console.log('   ✅ All games healthy — no retry needed');
    await printSummary(results);
    console.log('\n' + '═'.repeat(60));
    console.log('🎉 Ingestion job completed!');
    console.log('═'.repeat(60));
    return;
  }

  // ── ROUND 2: Retry delayed games ──
  const round2Keys = getDelayedKeys(delayedGames);
  console.log(`\n⏳ Waiting ${RETRY_DELAY_MS/1000}s before retry round...`);
  await wait(RETRY_DELAY_MS);

  await ingestRound(results, round2Keys, `PHASE 2: Retry Round (${round2Keys.length} delayed)`);

  await refreshFreshness();
  delayedGames = await getDelayedGames();

  if (delayedGames.length === 0) {
    console.log('   ✅ Retry resolved all delayed games');
    await printSummary(results);
    console.log('\n' + '═'.repeat(60));
    console.log('🎉 Ingestion job completed!');
    console.log('═'.repeat(60));
    return;
  }

  // ── ROUND 3: Final retry ──
  const round3Keys = getDelayedKeys(delayedGames);
  console.log(`\n⏳ Waiting ${RETRY_DELAY_MS/1000}s before final retry...`);
  await wait(RETRY_DELAY_MS);

  await ingestRound(results, round3Keys, `PHASE 3: Final Retry (${round3Keys.length} still delayed)`);

  await refreshFreshness();
  delayedGames = await getDelayedGames();

  // ── Final status ──
  console.log('\n📍 FINAL FRESHNESS STATUS');
  if (delayedGames.length > 0) {
    console.log(`   ⚠️ ${delayedGames.length} game(s) still delayed after retries:`);
    delayedGames.forEach(d => console.log(`      ${d.state_code} ${d.game_name} — ${d.freshness_status}`));
    console.log('   ℹ️ Trust Badge will remain amber. Will retry on next scheduled run.');
  } else {
    console.log('   ✅ All games healthy after retry rounds');
  }

  await printSummary(results);

  console.log('\n' + '═'.repeat(60));
  console.log('🎉 Ingestion job completed!');
  console.log('═'.repeat(60));
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runIngestionJob();
}

export { runIngestionJob };
