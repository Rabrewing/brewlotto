#!/usr/bin/env node

/**
 * Ingestion Health Monitor
 * Monitors the health and status of ingestion jobs
 */

import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import fs from 'fs';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
);

/**
 * Check database connection and recent activity
 */
async function checkDatabaseHealth() {
  console.log('\n📍 PHASE 1: Database Health Check');
  console.log('─'.repeat(60));

  try {
    // Test connection
    const { data: testResult } = await supabase
      .from('lottery_games')
      .select('count')
      .limit(1);

    console.log('✅ Database connection: OK');

    // Check recent draws (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: recentDraws } = await supabase
      .from('official_draws')
      .select('id, draw_date, created_at')
      .gte('created_at', twentyFourHoursAgo)
      .order('created_at', { ascending: false })
      .limit(50);

    console.log(`✅ Recent draws (24h): ${recentDraws ? recentDraws.length : 0}`);

    if (recentDraws && recentDraws.length > 0) {
      console.log('   Latest 5 draws:');
      recentDraws.slice(0, 5).forEach((draw, i) => {
        console.log(`   ${i + 1}. ${draw.draw_date} (${new Date(draw.created_at).toLocaleString()})`);
      });
    }

    return { success: true, recentDraws: recentDraws ? recentDraws.length : 0 };
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Check disk space and file system
 */
function checkFileSystemHealth() {
  console.log('\n📍 PHASE 2: File System Health Check');
  console.log('─'.repeat(60));

  try {
    // Check data directory
    const dataDirExists = fs.existsSync('/home/brewexec/brewlotto/data');
    console.log(`✅ Data directory exists: ${dataDirExists ? 'Yes' : 'No'}`);

    // Check CSV files
    const files = [
      '/home/brewexec/brewlotto/data/ca/ca-daily3.csv',
      '/home/brewexec/brewlotto/data/ca/ca-daily4.csv',
      '/home/brewexec/brewlotto/data/ca/ca-fantasy5.csv',
      '/home/brewexec/brewlotto/data/nc/nc-pick3.csv',
      '/home/brewexec/brewlotto/data/nc/nc-pick4.csv',
      '/home/brewexec/brewlotto/data/nc/nc-cash5.csv',
      '/home/brewexec/brewlotto/data/multi-state/powerball.csv',
      '/home/brewexec/brewlotto/data/multi-state/mega-millions.csv'
    ];

    console.log('✅ CSV files status:');
    files.forEach(file => {
      const exists = fs.existsSync(file);
      console.log(`   ${exists ? '✅' : '❌'} ${file}`);
    });

    return { success: true };
  } catch (error) {
    console.error('❌ File system check failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Check scraper health by running a quick test
 */
async function checkScraperHealth() {
  console.log('\n📍 PHASE 3: Scraper Health Check');
  console.log('─'.repeat(60));

  const scrapers = [
    { name: 'CA Daily 3', command: 'node scripts/scrapeCA_Data.js daily3 10' },
    { name: 'CA Daily 4', command: 'node scripts/scrapeCA_Data.js daily4 10' },
    { name: 'CA Fantasy 5', command: 'node scripts/fetchCAData.js' },
    { name: 'Powerball', command: 'node scripts/scrapePowerball.js' }
  ];

  const results = [];

  for (const scraper of scrapers) {
    try {
      execSync(scraper.command, { encoding: 'utf-8', stdio: 'pipe' });
      console.log(`✅ ${scraper.name}: OK`);
      results.push({ name: scraper.name, success: true });
    } catch (error) {
      console.log(`❌ ${scraper.name}: FAILED - ${error.message}`);
      results.push({ name: scraper.name, success: false, error: error.message });
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`\n📊 Scraper Health: ${successCount}/${scrapers.length} working`);

  return { success: successCount > 0, results };
}

/**
 * Generate health report
 */
async function generateHealthReport() {
  console.log('\n' + '═'.repeat(60));
  console.log('📊 INGESTION HEALTH REPORT');
  console.log(`📅 Generated: ${new Date().toLocaleString()}`);
  console.log('═'.repeat(60));

  const dbHealth = await checkDatabaseHealth();
  const fsHealth = await checkFileSystemHealth();
  const scraperHealth = await checkScraperHealth();

  console.log('\n' + '═'.repeat(60));
  console.log('📋 SUMMARY');
  console.log('═'.repeat(60));

  const checks = [
    { name: 'Database', status: dbHealth.success },
    { name: 'File System', status: fsHealth.success },
    { name: 'Scrapers', status: scraperHealth.success }
  ];

  checks.forEach(check => {
    console.log(`${check.status ? '✅' : '❌'} ${check.name}: ${check.status ? 'HEALTHY' : 'UNHEALTHY'}`);
  });

  const overallHealth = checks.every(c => c.status);
  console.log('\n' + (overallHealth ? '🎉 Overall: HEALTHY' : '⚠️ Overall: UNHEALTHY - Review issues above'));

  return { overallHealth, checks };
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateHealthReport().catch(console.error);
}

export { generateHealthReport };