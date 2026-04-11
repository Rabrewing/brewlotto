#!/usr/bin/env node

/**
 * Ingestion Scheduler
 * Schedules ingestion around actual draw windows with follow-up retries.
 */

import { execSync } from 'child_process';
import cron from 'node-cron';
import 'dotenv/config';

const JOBS = [
  {
    name: 'CA Daily 3 Day',
    command: 'node scripts/scrapeCA_Data.js daily3 100',
    cron: '10 13 * * *',
    timezone: 'America/Los_Angeles',
    retryOffsetsMinutes: [8, 20, 40],
  },
  {
    name: 'CA Daily 3 Evening',
    command: 'node scripts/scrapeCA_Data.js daily3 100',
    cron: '40 18 * * *',
    timezone: 'America/Los_Angeles',
    retryOffsetsMinutes: [10, 25, 45],
  },
  {
    name: 'CA Daily 4 Evening',
    command: 'node scripts/scrapeCA_Data.js daily4 100',
    cron: '40 18 * * *',
    timezone: 'America/Los_Angeles',
    retryOffsetsMinutes: [10, 25, 45],
  },
  {
    name: 'CA Fantasy 5 Night',
    command: 'node scripts/fetchCAData.js',
    cron: '40 18 * * *',
    timezone: 'America/Los_Angeles',
    retryOffsetsMinutes: [10, 25, 45],
  },
  {
    name: 'NC Pick 3 Day',
    command: 'node scripts/scrapeNC_Pick3.js',
    cron: '5 15 * * *',
    timezone: 'America/New_York',
    retryOffsetsMinutes: [8, 20, 40],
  },
  {
    name: 'NC Pick 3 Evening',
    command: 'node scripts/scrapeNC_Pick3.js',
    cron: '27 23 * * *',
    timezone: 'America/New_York',
    retryOffsetsMinutes: [10, 25, 45],
  },
  {
    name: 'NC Pick 4 Day',
    command: 'node scripts/scrapeNC_Pick4.js',
    cron: '5 15 * * *',
    timezone: 'America/New_York',
    retryOffsetsMinutes: [8, 20, 40],
  },
  {
    name: 'NC Pick 4 Evening',
    command: 'node scripts/scrapeNC_Pick4.js',
    cron: '27 23 * * *',
    timezone: 'America/New_York',
    retryOffsetsMinutes: [10, 25, 45],
  },
  {
    name: 'NC Cash 5 Night',
    command: 'node scripts/scrapeNC_Cash5.js',
    cron: '27 23 * * *',
    timezone: 'America/New_York',
    retryOffsetsMinutes: [10, 25, 45],
  },
  {
    name: 'Powerball Draw Window',
    command: 'node scripts/scrapePowerball.js',
    cron: '59 22 * * 1,3,6',
    timezone: 'America/New_York',
    retryOffsetsMinutes: [10, 25, 45, 70],
  },
  {
    name: 'Mega Millions Draw Window',
    command: 'node scripts/scrapeMega.js',
    cron: '59 22 * * 2,5',
    timezone: 'America/New_York',
    retryOffsetsMinutes: [10, 25, 45, 70],
  },
];

function runJob(command, name, triggerLabel) {
  console.log(`\n[🚀] Running ${name} (${triggerLabel}) at ${new Date().toISOString()}`);
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

function scheduleFollowUpRetries(job) {
  for (const offset of job.retryOffsetsMinutes) {
    const delayMs = offset * 60 * 1000;
    setTimeout(() => {
      runJob(job.command, job.name, `retry +${offset}m`);
    }, delayMs);
  }
}

function scheduleScrapers() {
  console.log('🚀 Starting Ingestion Scheduler');
  console.log('📅 Scheduling draw-window ingestion jobs with follow-up retries...');
  console.log('─'.repeat(60));

  for (const job of JOBS) {
    cron.schedule(
      job.cron,
      () => {
        runJob(job.command, job.name, 'primary');
        scheduleFollowUpRetries(job);
      },
      { timezone: job.timezone }
    );

    console.log(`✅ ${job.name} scheduled: ${job.cron} (${job.timezone}) retries at +${job.retryOffsetsMinutes.join('m, +')}m`);
  }

  console.log('\n' + '─'.repeat(60));
  console.log('🎉 Scheduler started! Draw-window jobs and retry windows are active.');
  console.log('─'.repeat(60));
  console.log('\nPress Ctrl+C to stop the scheduler.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  scheduleScrapers();
}

export { JOBS, scheduleScrapers };
