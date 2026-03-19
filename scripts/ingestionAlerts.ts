#!/usr/bin/env node

/**
 * Ingestion Alert System
 * Sends alerts when data quality issues are detected
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
);

const ALERT_THRESHOLDS = {
  maxDaysStale: 3,
  maxGapDays: 14,
  minRecordsPerGame: 100,
};

interface Alert {
  type: 'stale_data' | 'data_gap' | 'low_record_count' | 'ingestion_failure';
  severity: 'critical' | 'warning' | 'info';
  game?: string;
  message: string;
  details?: any;
}

const alerts: Alert[] = [];

/**
 * Check for stale data (not updated in X days)
 */
async function checkDataFreshness() {
  console.log('🔍 Checking data freshness...');

  const { data: games } = await supabase
    .from('lottery_games')
    .select('id, display_name, state_code');

  if (!games) return;

  for (const game of games) {
    const { data } = await supabase
      .from('official_draws')
      .select('draw_date')
      .eq('game_id', game.id)
      .order('draw_date', { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      const lastDraw = new Date(data[0].draw_date);
      const daysSinceLastDraw = Math.floor((Date.now() - lastDraw.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceLastDraw > ALERT_THRESHOLDS.maxDaysStale) {
        alerts.push({
          type: 'stale_data',
          severity: daysSinceLastDraw > 7 ? 'critical' : 'warning',
          game: `${game.state_code} ${game.display_name}`,
          message: `No new draws for ${daysSinceLastDraw} days`,
          details: { lastDraw: data[0].draw_date, daysSinceLastDraw }
        });
      }
    }
  }
}

/**
 * Check for data gaps
 */
async function checkDataGaps() {
  console.log('🔍 Checking for data gaps...');

  const { data: games, error } = await supabase
    .from('lottery_games')
    .select('id, display_name, state_code');

  if (error || !games) return;

  for (const game of games) {
    const { data: draws } = await supabase
      .from('official_draws')
      .select('draw_date')
      .eq('game_id', game.id)
      .order('draw_date', { ascending: false });

    if (!draws || draws.length === 0) continue;

    const sortedDates = draws.map(d => new Date(d.draw_date)).sort((a, b) => a.getTime() - b.getTime());
    
    for (let i = 1; i < sortedDates.length; i++) {
      const gap = Math.floor((sortedDates[i].getTime() - sortedDates[i - 1].getTime()) / (1000 * 60 * 60 * 24));
      
      if (gap > ALERT_THRESHOLDS.maxGapDays) {
        alerts.push({
          type: 'data_gap',
          severity: 'warning',
          game: `${game.state_code} ${game.display_name}`,
          message: `Data gap of ${gap} days detected`,
          details: { startDate: sortedDates[i - 1], endDate: sortedDates[i], gapDays: gap }
        });
      }
    }
  }
}

/**
 * Check record counts
 */
async function checkRecordCounts() {
  console.log('🔍 Checking record counts...');

  // Get all game-state combinations that have records
  const { data: gameStats } = await supabase
    .from('official_draws')
    .select('game_id');

  if (!gameStats) return;

  // Get unique game IDs
  const uniqueGameIds = [...new Set(gameStats.map(d => d.game_id))];

  // Get game details
  const { data: games } = await supabase
    .from('lottery_games')
    .select('id, display_name, state_code')
    .in('id', uniqueGameIds);

  if (!games) return;

  for (const game of games) {
    const { count } = await supabase
      .from('official_draws')
      .select('*', { count: 'exact', head: true })
      .eq('game_id', game.id);

    if (count !== null && count < ALERT_THRESHOLDS.minRecordsPerGame) {
      alerts.push({
        type: 'low_record_count',
        severity: count === 0 ? 'critical' : 'warning',
        game: `${game.state_code} ${game.display_name}`,
        message: `Low record count: ${count} records`,
        details: { recordCount: count, threshold: ALERT_THRESHOLDS.minRecordsPerGame }
      });
    }
  }
}

/**
 * Generate alert report
 */
function generateAlertReport() {
  console.log('\n' + '═'.repeat(60));
  console.log('🚨 INGESTION ALERT REPORT');
  console.log(`📅 Generated: ${new Date().toLocaleString()}`);
  console.log('═'.repeat(60));

  if (alerts.length === 0) {
    console.log('✅ No alerts detected - all systems healthy!');
    return { alertCount: 0, criticalCount: 0 };
  }

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;
  const infoCount = alerts.filter(a => a.severity === 'info').length;

  console.log(`\n📊 Alert Summary:`);
  console.log(`   🔴 Critical: ${criticalCount}`);
  console.log(`   ⚠️ Warning: ${warningCount}`);
  console.log(`   ℹ️ Info: ${infoCount}`);

  if (criticalCount > 0) {
    console.log('\n🔴 CRITICAL ALERTS:');
    alerts.filter(a => a.severity === 'critical').forEach(alert => {
      console.log(`   - [${alert.game || 'System'}] ${alert.message}`);
    });
  }

  if (warningCount > 0) {
    console.log('\n⚠️ WARNING ALERTS:');
    alerts.filter(a => a.severity === 'warning').forEach(alert => {
      console.log(`   - [${alert.game || 'System'}] ${alert.message}`);
    });
  }

  if (infoCount > 0) {
    console.log('\nℹ️ INFO ALERTS:');
    alerts.filter(a => a.severity === 'info').forEach(alert => {
      console.log(`   - [${alert.game || 'System'}] ${alert.message}`);
    });
  }

  console.log('\n' + '═'.repeat(60));
  console.log(criticalCount > 0 ? '🚨 ACTION REQUIRED' : '✅ Review warnings at your convenience');
  console.log('═'.repeat(60));

  return { alertCount: alerts.length, criticalCount };
}

/**
 * Main execution
 */
async function runAlertSystem() {
  console.log('🚀 Starting Ingestion Alert System...\n');

  await checkDataFreshness();
  await checkDataGaps();
  await checkRecordCounts();

  const result = generateAlertReport();

  return result;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAlertSystem().catch(console.error);
}

export { runAlertSystem, generateAlertReport };