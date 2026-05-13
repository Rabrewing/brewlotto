#!/usr/bin/env node

/**
 * Unified Ingestion Job with Delayed-Draw Retry
 * Runs all scrapers, then retries delayed games up to 2 more times.
 */

import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { sendStrategySignalNotifications } from '../lib/notifications/strategySignals.js';
import { sendPlayConfirmationNudge } from '../lib/notifications/playSettlements.js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DELAY_BETWEEN_SCRAPERS = 2000;
const RETRY_DELAY_MS = 10000;

const STATE_GAME_KEYS = {
  caLive: { state: 'CA', game: ['daily3', 'daily4', 'fantasy5'] },
  caMultiState: { state: 'CA', game: ['powerball', 'mega_millions'] },
  ncLive: { state: 'NC', game: ['pick3', 'pick4', 'cash5'] },
  powerball: { state: 'NC', game: 'powerball' },
  megaMillions: { state: 'NC', game: 'mega_millions' },
};

const SCRAPER_COMMANDS = {
  caLive: 'node scripts/scrapeCA_Live.js',
  caMultiState: 'node scripts/scrapeCA_MultiState.js',
  ncLive: 'node scripts/scrapeNC_Live.js',
  powerball: 'node scripts/scrapePowerball.js',
  megaMillions: 'node scripts/scrapeMega.js',
};

const STRATEGY_SIGNAL_GAME_KEYS = ['pick3', 'daily3', 'pick4', 'daily4', 'cash5', 'fantasy5', 'powerball', 'mega_millions'];

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

const RUN_ORDER = ['caLive', 'caMultiState', 'ncLive', 'powerball', 'megaMillions'];

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

async function runStrategySignalSweep() {
  try {
    console.log('\n🧠 Running strategy signal sweep...');
    const { data: lotteryGames, error: lotteryGamesError } = await supabase
      .from('lottery_games')
      .select('id, state_code, game_key, display_name, primary_count, primary_min, primary_max, has_bonus, bonus_min, bonus_max')
      .in('game_key', STRATEGY_SIGNAL_GAME_KEYS)
      .in('state_code', ['NC', 'CA']);

    if (lotteryGamesError) {
      console.log(`   ⚠️ Strategy signal sweep skipped: ${lotteryGamesError.message}`);
      return;
    }

    let processed = 0;
    let notificationsCreated = 0;
    let emailsSent = 0;

    for (const game of lotteryGames || []) {
      const { data: draws, error: drawsError } = await supabase
        .from('official_draws')
        .select('id, draw_date, draw_window_label, primary_numbers, bonus_numbers, draw_datetime_local')
        .eq('game_id', game.id)
        .order('draw_datetime_local', { ascending: false })
        .limit(120);

      if (drawsError) {
        console.log(`   ⚠️ ${game.state_code} ${game.display_name} skipped: ${drawsError.message}`);
        continue;
      }

      const latestDraw = (draws || [])[0];
      if (!latestDraw) {
        continue;
      }

      const result = await sendStrategySignalNotifications(supabase, {
        stateCode: game.state_code,
        gameKey: game.game_key,
        gameLabel: game.display_name,
        drawId: latestDraw.id,
        drawDate: latestDraw.draw_date,
        drawWindowLabel: latestDraw.draw_window_label,
        primaryCount: Number(game.primary_count || 0),
        primaryMin: Number(game.primary_min || 0),
        primaryMax: Number(game.primary_max || 0),
        hasBonus: Boolean(game.has_bonus),
        bonusMin: Number(game.bonus_min || 0) || null,
        bonusMax: Number(game.bonus_max || 0) || null,
        draws,
      });

      if (!result?.skipped) {
        processed += 1;
        notificationsCreated += Number(result.notificationsCreated || 0);
        emailsSent += Number(result.emailsSent || 0);
        console.log(`   ✅ ${game.state_code} ${game.display_name}: ${result.signalType} (${result.momentumPercent}% momentum)`);
      }
    }

    console.log(`   ℹ️ Strategy signal sweep complete (${processed} game(s), ${notificationsCreated} notification(s), ${emailsSent} email(s))`);
  } catch (error) {
    console.log(`   ⚠️ Strategy signal sweep failed: ${error.message}`);
  }
}

async function runPlayConfirmationSweep() {
  try {
    console.log('\n📝 Running play confirmation nudge sweep...');

    const { data: predictions, error: predictionsError } = await supabase
      .from('predictions')
      .select('id, user_id, state, game, draw_date, draw_time, predicted_numbers, bonus_number')
      .eq('is_saved', true)
      .not('draw_date', 'is', null);

    if (predictionsError) {
      console.log(`   ⚠️ Prediction fetch skipped: ${predictionsError.message}`);
      return;
    }

    if (!predictions || predictions.length === 0) {
      console.log('   ⏭️ No saved predictions to check');
      return;
    }

    let nudgesCreated = 0;

    for (const prediction of predictions) {
      const { data: existingLog } = await supabase
        .from('play_logs')
        .select('id')
        .eq('prediction_id', prediction.id)
        .maybeSingle();

      if (existingLog) continue;

      const stateCode = prediction.state === 'MULTI' ? 'NC' : prediction.state;
      const gameKey = prediction.game === 'mega_millions' || prediction.game === 'mega' ? 'mega_millions' : prediction.game;

      const { data: gameRow } = await supabase
        .from('lottery_games')
        .select('id, display_name')
        .eq('game_key', gameKey)
        .eq('state_code', stateCode)
        .maybeSingle();

      if (!gameRow) continue;

      const { data: draws } = await supabase
        .from('official_draws')
        .select('primary_numbers, bonus_numbers')
        .eq('game_id', gameRow.id)
        .eq('draw_date', prediction.draw_date)
        .eq('draw_window_label', prediction.draw_time);

      if (!draws || draws.length === 0) continue;

      const draw = draws[0];
      const predictedNums = Array.isArray(prediction.predicted_numbers) ? prediction.predicted_numbers : [];
      const drawNums = Array.isArray(draw.primary_numbers) ? draw.primary_numbers.filter((v) => typeof v === 'number') : [];
      const drawBonus = Array.isArray(draw.bonus_numbers) ? draw.bonus_numbers[0] : null;

      let matchCount = 0;
      const remaining = [...drawNums];
      for (const val of predictedNums) {
        const idx = remaining.indexOf(val);
        if (idx >= 0) { matchCount += 1; remaining.splice(idx, 1); }
      }

      if (matchCount === 0) continue;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('id', prediction.user_id)
        .maybeSingle();

      await sendPlayConfirmationNudge(supabase, {
        userId: prediction.user_id,
        contactEmail: profile?.email || null,
        state: stateCode,
        gameLabel: gameRow.display_name,
        drawDate: prediction.draw_date,
        drawWindowLabel: prediction.draw_time,
        playedNumbers: predictedNums,
        officialNumbers: drawNums,
        matchCount,
        positionalMatchCount: matchCount,
        bonusMatch: drawBonus != null && prediction.bonus_number === drawBonus,
        isWin: false,
        payoutTier: null,
        resultCode: matchCount >= 5 ? 'win' : 'partial',
        payoutAmount: null,
        payoutLabel: 'Pattern match',
        payoutSummary: `Matched ${matchCount} number${matchCount === 1 ? '' : 's'}`,
        fireballActive: false,
      });

      nudgesCreated += 1;
    }

    console.log(`   ✅ Created ${nudgesCreated} confirmation nudges`);
  } catch (error) {
    console.log(`   ⚠️ Play confirmation sweep failed: ${error.message}`);
  }
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

  // ── ROUND 4: Deferred retry (10 min wait for late-posted draws) ──
  if (delayedGames.length > 0) {
    const deferredDelayMs = 600000;
    console.log(`\n⏰ ${delayedGames.length} game(s) still delayed. Waiting ${deferredDelayMs/60000}min for deferred retry (late-posted draws)...`);
    console.log(`   Delayed: ${delayedGames.map(d => `${d.state_code} ${d.game_name}`).join(', ')}`);
    await wait(deferredDelayMs);

    await refreshFreshness();
    const stillDelayed = await getDelayedGames();
    const round4Keys = getDelayedKeys(stillDelayed);

    if (round4Keys.length > 0) {
      await ingestRound(results, round4Keys, `PHASE 4: Deferred Retry (${round4Keys.length} still delayed)`);
      await refreshFreshness();
      delayedGames = await getDelayedGames();
    } else {
      console.log('   ✅ Games recovered during wait');
      delayedGames = [];
    }
  }

  // ── Final status ──
  console.log('\n📍 FINAL FRESHNESS STATUS');
  if (delayedGames.length > 0) {
    console.log(`   ⚠️ ${delayedGames.length} game(s) still delayed after full retry cycle:`);
    delayedGames.forEach(d => console.log(`      ${d.state_code} ${d.game_name} — ${d.freshness_status}`));
    console.log('   ℹ️ Trust Badge will remain amber. Will retry on next scheduled run.');
  } else {
    console.log('   ✅ All games healthy after full retry cycle');
  }

  await printSummary(results);

  await runStrategySignalSweep();

  await runPlayConfirmationSweep();

  console.log('\n' + '═'.repeat(60));
  console.log('🎉 Ingestion job completed!');
  console.log('═'.repeat(60));
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runIngestionJob();
}

export { runIngestionJob };
