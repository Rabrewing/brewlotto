#!/usr/bin/env node

/**
 * Ingestion Scheduler
 * Schedules and runs daily ingestion jobs
 */

import { execSync } from 'child_process';
import cron from 'node-cron';
import 'dotenv/config';

const SCHEDULES = {
  // CA Daily 3 & 4 - Run after draws (1:00 PM PT and 6:30 PM PT)
  caDaily3: '30 13 * * *',   // 1:30 PM PT (10 minutes after draw)
  caDaily4: '30 18 * * *',   // 6:30 PM PT (10 minutes after draw)
  
  // CA Fantasy 5 - Run after draw (6:30 PM PT)
  caFantasy5: '35 18 * * *', // 6:35 PM PT
  
  // NC Games - Run after draws (3:00 PM ET and 11:22 PM ET)
  ncPick3: '30 15 * * *',    // 3:00 PM ET
  ncPick4: '30 15 * * *',    // 3:00 PM ET
  ncCash5: '30 23 * * *',    // 11:22 PM ET (approx)
  
  // Multi-state games
  powerball: '0 23 * * 0,2,5',   // 11:00 PM ET on Sun, Wed, Sat
  megaMillions: '0 23 * * 1,4',  // 11:00 PM ET on Tue, Fri
};

/**
 * Run a scraper command
 */
function runScraper(command, name) {
  console.log(`\n[🚀] Running ${name} at ${new Date().toISOString()}`);
  console.log(`     Command: ${command}`);
  
  try {
    const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
    console.log(`[✅] ${name} completed successfully`);
    return { success: true, output };
  } catch (error) {
    console.error(`[❌] ${name} failed:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Schedule all scrapers
 */
function scheduleScrapers() {
  console.log('🚀 Starting Ingestion Scheduler');
  console.log('📅 Scheduling daily ingestion jobs...');
  console.log('─'.repeat(60));

  // CA Daily 3 (1:30 PM PT = 21:30 UTC)
  cron.schedule('30 21 * * *', () => {
    runScraper('node scripts/scrapeCA_Data.js daily3 100', 'CA Daily 3');
  });
  console.log('✅ CA Daily 3 scheduled: 1:30 PM PT daily');

  // CA Daily 4 (6:30 PM PT = 02:30 UTC next day)
  cron.schedule('30 2 * * *', () => {
    runScraper('node scripts/scrapeCA_Data.js daily4 100', 'CA Daily 4');
  });
  console.log('✅ CA Daily 4 scheduled: 6:30 PM PT daily');

  // CA Fantasy 5 (6:35 PM PT = 02:35 UTC next day)
  cron.schedule('35 2 * * *', () => {
    runScraper('node scripts/fetchCAData.js', 'CA Fantasy 5');
  });
  console.log('✅ CA Fantasy 5 scheduled: 6:35 PM PT daily');

  // NC Pick 3 & 4 (3:00 PM ET = 20:00 UTC)
  cron.schedule('0 20 * * *', () => {
    runScraper('node scripts/scrapeNC_Pick3.js', 'NC Pick 3');
    runScraper('node scripts/scrapeNC_Pick4.js', 'NC Pick 4');
  });
  console.log('✅ NC Pick 3 & 4 scheduled: 3:00 PM ET daily');

  // NC Cash 5 (11:22 PM ET = 04:22 UTC next day)
  cron.schedule('22 4 * * *', () => {
    runScraper('node scripts/scrapeNC_Cash5.js', 'NC Cash 5');
  });
  console.log('✅ NC Cash 5 scheduled: 11:22 PM ET daily');

  // Powerball (11:00 PM ET on Sun/Wed/Sat = 04:00 UTC next day)
  cron.schedule('0 4 * * 0,3,6', () => {
    runScraper('node scripts/scrapePowerball.js', 'Powerball');
  });
  console.log('✅ Powerball scheduled: 11:00 PM ET on Sun/Wed/Sat');

  // Mega Millions (11:00 PM ET on Tue/Fri = 04:00 UTC next day)
  cron.schedule('0 4 * * 2,5', () => {
    runScraper('node scripts/scrapeMega.js', 'Mega Millions');
  });
  console.log('✅ Mega Millions scheduled: 11:00 PM ET on Tue/Fri');

  console.log('\n' + '─'.repeat(60));
  console.log('🎉 Scheduler started! All jobs are now running on schedule.');
  console.log('─'.repeat(60));
  console.log('\nPress Ctrl+C to stop the scheduler.');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  scheduleScrapers();
}

export { scheduleScrapers };