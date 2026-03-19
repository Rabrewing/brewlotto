#!/usr/bin/env node

/**
 * Prediction Scheduler
 * Generates predictions for each game based on draw schedules
 * Runs predictions before each draw window
 */

import cron from 'node-cron';
import 'dotenv/config';

const PREDICTION_SCHEDULES = {
  // CA Daily 3 - Midday (1:00 PM PT) and Evening (6:30 PM PT)
  caDaily3Midday: '30 19 * * *',   // 12:30 PM PT = 19:30 UTC (30 min before draw)
  caDaily3Evening: '30 2 * * *',   // 6:30 PM PT = 02:30 UTC (1 hour before draw)
  
  // CA Daily 4 - Evening only (6:30 PM PT)
  caDaily4Evening: '0 3 * * *',   // 6:30 PM PT = 02:00 UTC (1.5 hours before draw)
  
  // CA Fantasy 5 - Evening (6:30 PM PT)
  caFantasy5Evening: '5 3 * * *', // 6:30 PM PT = 02:05 UTC (25 min before draw)
  
  // NC Pick 3 & 4 - Midday (3:00 PM ET) and Evening (11:22 PM ET)
  ncPick3Midday: '0 19 * * *',    // 2:00 PM ET = 19:00 UTC (1 hour before draw)
  ncPick3Evening: '30 3 * * *',   // 10:30 PM ET = 03:30 UTC (45 min before draw)
  ncPick4Midday: '0 19 * * *',    // 2:00 PM ET = 19:00 UTC
  ncPick4Evening: '30 3 * * *',    // 10:30 PM ET = 03:30 UTC
  
  // NC Cash 5 - Evening (11:22 PM ET)
  ncCash5Evening: '0 4 * * *',     // 11:00 PM ET = 04:00 UTC (22 min before draw)
  
  // Powerball (11:00 PM ET on Sun/Wed/Sat)
  powerball: '30 3 * * 0,3,6',    // 10:30 PM ET = 03:30 UTC (30 min before draw)
  
  // Mega Millions (11:00 PM ET on Tue/Fri)
  megaMillions: '30 3 * * 1,4',   // 10:30 PM ET = 03:30 UTC (30 min before draw)
};

/**
 * Run prediction for a specific game
 */
async function runPrediction(gameKey, state, options = {}) {
  console.log(`\n🎯 Generating prediction for ${state} ${gameKey} at ${new Date().toISOString()}`);
  
  try {
    const { generatePrediction } = await import('../lib/prediction/predictionGenerator.js');
    const result = await generatePrediction({
      gameKey,
      state,
      ...options
    });
    
    if (result.success) {
      console.log(`✅ Prediction generated: ${result.predictionId}`);
      return { success: true, predictionId: result.predictionId };
    } else {
      console.log(`❌ Prediction failed: ${result.error}`);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error(`❌ Prediction error:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Run predictions for all NC games
 */
async function runNCPredictions(drawTime = 'midday') {
  console.log(`\n🌵 Running NC predictions (${drawTime})`);
  
  const results = await Promise.allSettled([
    runPrediction('pick3', 'NC', { drawTime }),
    runPrediction('pick4', 'NC', { drawTime }),
  ]);
  
  if (drawTime === 'evening') {
    results.push(await Promise.allSettled([
      runPrediction('cash5', 'NC', { drawTime }),
    ]));
  }
  
  return results;
}

/**
 * Run predictions for all CA games
 */
async function runCAPredictions(drawTime = 'midday') {
  console.log(`\n🌴 Running CA predictions (${drawTime})`);
  
  if (drawTime === 'midday') {
    await runPrediction('daily3', 'CA', { drawTime });
  }
  
  if (drawTime === 'evening') {
    await Promise.allSettled([
      runPrediction('daily3', 'CA', { drawTime }),
      runPrediction('daily4', 'CA', { drawTime }),
      runPrediction('fantasy5', 'CA', { drawTime }),
    ]);
  }
}

/**
 * Run multi-state predictions
 */
async function runMultiStatePredictions() {
  console.log(`\n🏛️ Running multi-state predictions`);
  
  await Promise.allSettled([
    runPrediction('powerball', 'MULTI', {}),
    runPrediction('megamillions', 'MULTI', {}),
  ]);
}

/**
 * Schedule all prediction jobs
 */
function schedulePredictions() {
  console.log('🎯 Starting Prediction Scheduler');
  console.log('📅 Scheduling prediction generation jobs...');
  console.log('─'.repeat(60));

  // CA Daily 3 Midday
  cron.schedule(PREDICTION_SCHEDULES.caDaily3Midday, () => {
    runCAPredictions('midday');
  });
  console.log('✅ CA Daily 3 Midday scheduled');

  // CA Daily 3 Evening
  cron.schedule(PREDICTION_SCHEDULES.caDaily3Evening, () => {
    runCAPredictions('evening');
  });
  console.log('✅ CA Daily 3 Evening scheduled');

  // CA Daily 4 Evening
  cron.schedule(PREDICTION_SCHEDULES.caDaily4Evening, () => {
    runCAPredictions('evening');
  });
  console.log('✅ CA Daily 4 Evening scheduled');

  // CA Fantasy 5 Evening
  cron.schedule(PREDICTION_SCHEDULES.caFantasy5Evening, () => {
    runCAPredictions('evening');
  });
  console.log('✅ CA Fantasy 5 Evening scheduled');

  // NC Midday predictions
  cron.schedule(PREDICTION_SCHEDULES.ncPick3Midday, () => {
    runNCPredictions('midday');
  });
  console.log('✅ NC Pick 3/4 Midday scheduled');

  // NC Evening predictions
  cron.schedule(PREDICTION_SCHEDULES.ncPick3Evening, () => {
    runNCPredictions('evening');
  });
  console.log('✅ NC Pick 3/4/Cash5 Evening scheduled');

  // Powerball (Sun/Wed/Sat)
  cron.schedule(PREDICTION_SCHEDULES.powerball, () => {
    runMultiStatePredictions();
  });
  console.log('✅ Powerball scheduled (Sun/Wed/Sat)');

  // Mega Millions (Tue/Fri)
  cron.schedule(PREDICTION_SCHEDULES.megaMillions, () => {
    runMultiStatePredictions();
  });
  console.log('✅ Mega Millions scheduled (Tue/Fri)');

  console.log('\n' + '─'.repeat(60));
  console.log('🎉 Prediction Scheduler started!');
  console.log('─'.repeat(60));
  console.log('\nPress Ctrl+C to stop the scheduler.');
}

export { runPrediction, runNCPredictions, runCAPredictions, runMultiStatePredictions, schedulePredictions };
