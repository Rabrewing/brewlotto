#!/usr/bin/env node

/**
 * Cross-Source Validation Script
 * Validates data consistency across sources and database
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
);

/**
 * Get game ID from state_code and game_key
 */
async function getGameId(stateCode, gameKey) {
  const { data, error } = await supabase
    .from('lottery_games')
    .select('id')
    .eq('state_code', stateCode)
    .eq('game_key', gameKey)
    .limit(1);
  
  if (error || !data || data.length === 0) {
    return null;
  }
  return data[0].id;
}

/**
 * Check database consistency for a specific game
 */
async function checkGameConsistency(stateCode, gameKey, gameName) {
  console.log(`\n📍 Checking consistency for ${stateCode} ${gameKey} (${gameName})`);
  
  // Get game ID
  const gameId = await getGameId(stateCode, gameKey);
  if (!gameId) {
    console.log(`❌ Game not found: ${stateCode} ${gameKey}`);
    return { valid: false, error: 'Game not found' };
  }

  // Get all draws for this game from official_draws table
  const { data: draws, error } = await supabase
    .from('official_draws')
    .select('draw_date, draw_window_label, created_at')
    .eq('game_id', gameId)
    .order('draw_date', { ascending: true });

  if (error) {
    console.log(`❌ Error fetching draws: ${error.message}`);
    return { valid: false, error: error.message };
  }

  if (!draws || draws.length === 0) {
    console.log(`⚠️ No draws found for ${stateCode} ${gameKey}`);
    return { valid: true, count: 0 }; // Valid but empty
  }

  console.log(`✅ Found ${draws.length} draws`);

  // Check for date gaps
  const dates = draws.map(d => new Date(d.draw_date));
  const gaps = [];
  
  for (let i = 1; i < dates.length; i++) {
    const prevDate = dates[i - 1];
    const currDate = dates[i];
    const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);
    
    // Check for gaps larger than expected based on game frequency
    let maxGapDays = 2; // Default
    if (gameKey.includes('powerball') || gameKey.includes('mega_millions')) {
      maxGapDays = 4; // Weekly games
    } else if (gameKey === 'fantasy5' || gameKey.includes('cash5')) {
      maxGapDays = 2; // Daily games
    } else if (gameKey.includes('daily3') || gameKey.includes('daily4')) {
      maxGapDays = 1; // Daily or twice daily
    }
    
    if (diffDays > maxGapDays) {
      gaps.push({
        from: prevDate.toISOString().split('T')[0],
        to: currDate.toISOString().split('T')[0],
        days: diffDays
      });
    }
  }

  if (gaps.length > 0) {
    console.log(`⚠️ Found ${gaps.length} date gaps:`);
    gaps.slice(0, 5).forEach(gap => { // Show first 5 gaps
      console.log(`   ${gap.from} to ${gap.to} (${gap.days.toFixed(1)} days)`);
    });
    if (gaps.length > 5) {
      console.log(`   ... and ${gaps.length - 5} more gaps`);
    }
  } else {
    console.log(`✅ No date gaps found`);
  }

  // Check draw window consistency
  const windows = draws.map(d => d.draw_window_label);
  const uniqueWindows = [...new Set(windows)];
  console.log(`✅ Draw windows: ${uniqueWindows.join(', ')}`);

  return {
    valid: gaps.length === 0,
    count: draws.length,
    gaps: gaps.length,
    windows: uniqueWindows
  };
}

/**
 * Check latest draw freshness
 */
async function checkSourceFreshness() {
  console.log('\n📍 PHASE 2: Source Freshness Check');
  console.log('─'.repeat(60));

  // Define games to check
  const games = [
    { stateCode: 'CA', gameKey: 'daily3', name: 'CA Daily 3' },
    { stateCode: 'CA', gameKey: 'daily4', name: 'CA Daily 4' },
    { stateCode: 'CA', gameKey: 'fantasy5', name: 'CA Fantasy 5' },
    { stateCode: 'NC', gameKey: 'powerball', name: 'Powerball (NC)' },
    { stateCode: 'NC', gameKey: 'mega_millions', name: 'Mega Millions (NC)' }
  ];

  const results = [];

  for (const game of games) {
    const gameId = await getGameId(game.stateCode, game.gameKey);
    if (!gameId) {
      console.log(`❌ ${game.name}: Game not found`);
      results.push({ name: game.name, status: 'not_found' });
      continue;
    }

    const { data: latestDraw, error } = await supabase
      .from('official_draws')
      .select('draw_date, created_at')
      .eq('game_id', gameId)
      .order('draw_date', { ascending: false })
      .limit(1);

    if (error || !latestDraw || latestDraw.length === 0) {
      console.log(`❌ ${game.name}: No data`);
      results.push({ name: game.name, status: 'no_data' });
      continue;
    }

    const draw = latestDraw[0];
    const drawDate = new Date(draw.draw_date);
    const today = new Date();
    const daysOld = Math.floor((today - drawDate) / (1000 * 60 * 60 * 24));

    let status = 'fresh';
    if (daysOld > 7) status = 'stale';
    if (daysOld > 30) status = 'very_stale';

    console.log(`✅ ${game.name}: ${draw.draw_date} (${daysOld} days old) [${status}]`);
    results.push({ name: game.name, status, daysOld, date: draw.draw_date });
  }

  return results;
}

/**
 * Main validation function
 */
async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('📊 CROSS-SOURCE VALIDATION REPORT');
  console.log('📅 Generated:', new Date().toISOString());
  console.log('═'.repeat(60));

  try {
    // Phase 1: Database consistency checks
    console.log('\n📍 PHASE 1: Database Consistency Check');
    console.log('─'.repeat(60));

    const consistencyChecks = [
      { stateCode: 'CA', gameKey: 'daily3', gameName: 'CA Daily 3' },
      { stateCode: 'CA', gameKey: 'daily4', gameName: 'CA Daily 4' },
      { stateCode: 'CA', gameKey: 'fantasy5', gameName: 'CA Fantasy 5' },
      { stateCode: 'NC', gameKey: 'powerball', gameName: 'Powerball (NC)' },
      { stateCode: 'NC', gameKey: 'mega_millions', gameName: 'Mega Millions (NC)' }
    ];

    const consistencyResults = [];
    for (const check of consistencyChecks) {
      const result = await checkGameConsistency(check.stateCode, check.gameKey, check.gameName);
      consistencyResults.push({ ...check, ...result });
    }

    // Phase 2: Source freshness
    const freshnessResults = await checkSourceFreshness();

    // Summary
    console.log('\n' + '═'.repeat(60));
    console.log('📋 VALIDATION SUMMARY');
    console.log('═'.repeat(60));

    const totalGames = consistencyResults.length;
    const validGames = consistencyResults.filter(r => r.valid === true).length;
    const staleGames = freshnessResults.filter(r => r.status === 'stale' || r.status === 'very_stale').length;

    console.log(`\n✅ Database Consistency: ${validGames}/${totalGames} games valid`);
    console.log(`⚠️ Stale Data: ${staleGames} games haven't updated in 7+ days`);

    if (staleGames > 0) {
      console.log('\n🚨 ACTION REQUIRED:');
      freshnessResults
        .filter(r => r.status === 'stale' || r.status === 'very_stale')
        .forEach(game => {
          console.log(`   - ${game.name}: Last draw ${game.daysOld} days old`);
        });
    }

    console.log('\n✅ Validation complete');

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();