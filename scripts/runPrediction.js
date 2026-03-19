#!/usr/bin/env node

/**
 * Run Prediction CLI
 * Run predictions from command line
 */

const args = process.argv.slice(2);
const game = args[0];
const state = args[1] || 'NC';

async function main() {
  console.log('🎯 BrewLotto Prediction Generator\n');
  
  const { generatePrediction, runAllPredictions } = await import('../lib/prediction/predictionGenerator.js');
  
  if (game === 'all') {
    console.log('Running predictions for all games...\n');
    const results = await runAllPredictions();
    
    for (const result of results) {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.state} ${result.gameKey}: ${result.success ? 'Generated' : result.error}`);
    }
  } else if (game) {
    console.log(`Generating prediction for ${state} ${game}...\n`);
    const result = await generatePrediction({ gameKey: game, state });
    
    if (result.success) {
      console.log('✅ Prediction generated successfully!');
      console.log('Prediction ID:', result.predictionId);
      console.log('\nNumbers:', result.prediction?.predicted_numbers);
      console.log('Confidence:', result.prediction?.confidence_score);
    } else {
      console.log('❌ Prediction failed:', result.error);
    }
  } else {
    console.log('Usage:');
    console.log('  npm run predict <game> <state>  - Generate prediction for specific game');
    console.log('  npm run predict all             - Generate predictions for all games');
    console.log('\nGames: pick3, pick4, cash5, daily3, daily4, fantasy5, powerball, megamillions');
    console.log('States: NC, CA, MULTI');
  }
}

main();
