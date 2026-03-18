#!/usr/bin/env node

/**
 * Unified Ingestion Job
 * Runs all scrapers in sequence to fetch and ingest lottery data
 */

import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
);

const DELAY_BETWEEN_SCRAPERS = 2000; // 2 seconds between scrapers

/**
 * Run a command with retry logic
 */
function runCommand(command, description, maxRetries = 3) {
  console.log(`\n🔄 ${description}...`);
  console.log(`   Command: ${command}`);
  
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
      console.log(`✅ ${description} completed (attempt ${attempt}/${maxRetries})`);
      return { success: true, output, attempts: attempt };
    } catch (error) {
      lastError = error.message;
      console.log(`⚠️ Attempt ${attempt}/${maxRetries} failed: ${error.message}`);
      
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 30000); // Exponential backoff, max 30s
        console.log(`   Retrying in ${delay/1000} seconds...`);
        waitSync(delay);
      }
    }
  }
  
  console.error(`❌ ${description} failed after ${maxRetries} attempts`);
  return { success: false, error: lastError, attempts: maxRetries };
}

/**
 * Synchronous wait function
 */
function waitSync(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // Busy wait
  }
}

/**
 * Wait for a specified duration
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main ingestion job
 */
async function runIngestionJob() {
  console.log('🚀 Starting Unified Ingestion Job');
  console.log(`📅 Date: ${new Date().toISOString()}`);
  console.log('─'.repeat(60));

  const results = {
    caDaily3: null,
    caDaily4: null,
    caFantasy5: null,
    ncPick3: null,
    ncPick4: null,
    ncCash5: null,
    powerball: null,
    megaMillions: null,
  };

  try {
    // 1. CA Daily 3 & 4 (from lotteryextreme.com)
    console.log('\n📍 PHASE 1: California Daily Games');
    results.caDaily3 = runCommand(
      'node scripts/scrapeCA_Data.js daily3 1000',
      'CA Daily 3 scraper'
    );
    await wait(DELAY_BETWEEN_SCRAPERS);
    
    results.caDaily4 = runCommand(
      'node scripts/scrapeCA_Data.js daily4 1000',
      'CA Daily 4 scraper'
    );
    await wait(DELAY_BETWEEN_SCRAPERS);

    // 2. CA Fantasy 5 (from lotto-8.com)
    console.log('\n📍 PHASE 2: California Fantasy 5');
    results.caFantasy5 = runCommand(
      'node scripts/fetchCAData.js',
      'CA Fantasy 5 scraper'
    );
    await wait(DELAY_BETWEEN_SCRAPERS);

    // 3. NC Games (from nclottery.com)
    console.log('\n📍 PHASE 3: North Carolina Games');
    results.ncPick3 = runCommand(
      'node scripts/scrapeNC_Pick3.js',
      'NC Pick 3 scraper'
    );
    await wait(DELAY_BETWEEN_SCRAPERS);
    
    results.ncPick4 = runCommand(
      'node scripts/scrapeNC_Pick4.js',
      'NC Pick 4 scraper'
    );
    await wait(DELAY_BETWEEN_SCRAPERS);
    
    results.ncCash5 = runCommand(
      'node scripts/scrapeNC_Cash5.js',
      'NC Cash 5 scraper'
    );
    await wait(DELAY_BETWEEN_SCRAPERS);

    // 4. Multi-State Games (from NCEL)
    console.log('\n📍 PHASE 4: Multi-State Games');
    results.powerball = runCommand(
      'node scripts/scrapePowerball.js',
      'Powerball scraper'
    );
    await wait(DELAY_BETWEEN_SCRAPERS);
    
    results.megaMillions = runCommand(
      'node scripts/scrapeMega.js',
      'Mega Millions scraper'
    );
    await wait(DELAY_BETWEEN_SCRAPERS);

    // 5. Generate summary report
    console.log('\n' + '─'.repeat(60));
    console.log('📊 INGESTION JOB SUMMARY');
    console.log('─'.repeat(60));

    const totalSuccess = Object.values(results).filter(r => r?.success).length;
    const totalFailed = Object.values(results).filter(r => r && !r.success).length;

    console.log(`\n✅ Successful: ${totalSuccess}/${Object.keys(results).length}`);
    console.log(`❌ Failed: ${totalFailed}/${Object.keys(results).length}`);

    // Print detailed results
    Object.entries(results).forEach(([key, result]) => {
      if (result) {
        const status = result.success ? '✅' : '❌';
        console.log(`${status} ${key}: ${result.success ? 'Success' : 'Failed'}`);
      }
    });

    // 6. Check Supabase for recent inserts
    console.log('\n📍 PHASE 5: Database Validation');
    try {
      const { data: recentDraws } = await supabase
        .from('official_draws')
        .select('game_id, draw_date')
        .order('created_at', { ascending: false })
        .limit(20);

      if (recentDraws && recentDraws.length > 0) {
        console.log(`✅ Found ${recentDraws.length} recent draws in database`);
        console.log('   Latest draws:');
        recentDraws.slice(0, 5).forEach((draw, i) => {
          console.log(`   ${i + 1}. ${draw.draw_date} (game: ${draw.game_id})`);
        });
      } else {
        console.log('⚠️ No recent draws found in database');
      }
    } catch (dbError) {
      console.log(`⚠️ Database validation failed: ${dbError.message}`);
    }

    console.log('\n' + '═'.repeat(60));
    console.log('🎉 Ingestion job completed!');
    console.log('═'.repeat(60));

  } catch (error) {
    console.error('\n❌ Fatal error in ingestion job:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runIngestionJob();
}

export { runIngestionJob };