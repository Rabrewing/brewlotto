/**
 * Prediction Generator
 * Core module for generating lottery predictions using statistical strategies
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { PredictionStorage } from './predictionStorage.js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const GAME_CONFIG = {
  pick3: { primary_count: 3, primary_min: 0, primary_max: 9, has_bonus: false },
  pick4: { primary_count: 4, primary_min: 0, primary_max: 9, has_bonus: false },
  cash5: { primary_count: 5, primary_min: 1, primary_max: 39, has_bonus: false },
  daily3: { primary_count: 3, primary_min: 0, primary_max: 9, has_bonus: false },
  daily4: { primary_count: 4, primary_min: 0, primary_max: 9, has_bonus: false },
  fantasy5: { primary_count: 5, primary_min: 1, primary_max: 39, has_bonus: false },
  powerball: { primary_count: 5, primary_min: 1, primary_max: 69, has_bonus: true, bonus_min: 1, bonus_max: 26 },
  megamillions: { primary_count: 5, primary_min: 1, primary_max: 70, has_bonus: true, bonus_min: 1, bonus_max: 25 },
};

const STATE_GAME_MAP = {
  NC: { pick3: 'pick3', pick4: 'pick4', cash5: 'cash5' },
  CA: { daily3: 'daily3', daily4: 'daily4', fantasy5: 'fantasy5' },
  MULTI: { powerball: 'powerball', megamillions: 'mega_millions' },
};

/**
 * Get game configuration
 */
function getGameConfig(gameKey) {
  return GAME_CONFIG[gameKey] || null;
}

/**
 * Get game ID from database
 */
async function getGameId(state, gameKey) {
  const gameKeyDb = STATE_GAME_MAP[state]?.[gameKey] || gameKey;
  
  // Map states: NC, CA, or MULTI for multi-state
  const stateCode = state === 'MULTI' ? ['NC', 'CA'] : [state];
  
  const { data, error } = await supabase
    .from('lottery_games')
    .select('id, game_key, primary_count, primary_min, primary_max, has_bonus, state_code')
    .in('state_code', stateCode)
    .eq('game_key', gameKeyDb)
    .single();
  
  if (error || !data) {
    console.error(`Game not found: ${state}/${gameKey}`);
    return null;
  }
  
  return data;
}

/**
 * Get recent draw data for feature extraction
 */
async function getRecentDraws(gameId, lookback = 100) {
  const { data, error } = await supabase
    .from('official_draws')
    .select('*')
    .eq('game_id', gameId)
    .order('draw_date', { ascending: false })
    .limit(lookback);
  
  if (error) {
    console.error(`Error fetching draws:`, error.message);
    return [];
  }
  
  return data || [];
}

/**
 * Extract features from historical draw data
 */
function extractFeatures(draws, gameConfig) {
  if (!draws || draws.length === 0) {
    return null;
  }
  
  const numberFrequency = {};
  const positionFrequency = [{}, {}, {}];
  const consecutiveCount = {};
  const sumTotals = [];
  
  // Initialize frequency maps
  for (let i = gameConfig.primary_min; i <= gameConfig.primary_max; i++) {
    numberFrequency[i] = 0;
  }
  
  // Count frequency from draws
  for (const draw of draws) {
    const numbers = draw.primary_numbers || [];
    
    // Track sum
    const sum = numbers.reduce((a, b) => a + b, 0);
    sumTotals.push(sum);
    
    // Count occurrences
    numbers.forEach((num, idx) => {
      if (numberFrequency[num] !== undefined) {
        numberFrequency[num]++;
      }
      if (positionFrequency[idx]) {
        positionFrequency[idx][num] = (positionFrequency[idx][num] || 0) + 1;
      }
    });
    
    // Track consecutive numbers
    const sorted = [...numbers].sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === sorted[i - 1] + 1) {
        consecutiveCount[`${sorted[i - 1]}-${sorted[i]}`] = (consecutiveCount[`${sorted[i - 1]}-${sorted[i]}`] || 0) + 1;
      }
    }
  }
  
  // Calculate hot/cold metrics
  const avgFrequency = draws.length / (gameConfig.primary_max - gameConfig.primary_min + 1);
  const hotNumbers = Object.entries(numberFrequency)
    .filter(([, count]) => count > avgFrequency * 1.2)
    .map(([num]) => parseInt(num));
  const coldNumbers = Object.entries(numberFrequency)
    .filter(([, count]) => count < avgFrequency * 0.8)
    .map(([num]) => parseInt(num));
  
  return {
    draws,
    numberFrequency,
    positionFrequency,
    consecutiveCount,
    sumTotals,
    avgSum: sumTotals.length > 0 ? sumTotals.reduce((a, b) => a + b, 0) / sumTotals.length : 0,
    hotNumbers,
    coldNumbers,
    totalDraws: draws.length,
  };
}

/**
 * Generate candidate numbers using simple frequency-based approach
 */
function generateCandidates(features, gameConfig, count = 10) {
  if (!features) {
    return [];
  }
  
  const candidates = [];
  const { hotNumbers, coldNumbers, numberFrequency } = features;
  
  // Combine hot and cold numbers with weights
  const weightedNumbers = Object.entries(numberFrequency)
    .map(([num, freq]) => ({
      num: parseInt(num),
      freq,
      weight: hotNumbers.includes(parseInt(num)) ? freq * 1.5 : 
               coldNumbers.includes(parseInt(num)) ? freq * 0.7 : freq
    }))
    .sort((a, b) => b.weight - a.weight);
  
  // Generate combinations
  for (let i = 0; i < count; i++) {
    const pick = [];
    const available = [...weightedNumbers];
    
    for (let j = 0; j < gameConfig.primary_count; j++) {
      // Weighted random selection
      const totalWeight = available.reduce((sum, n) => sum + n.weight, 0);
      let random = Math.random() * totalWeight;
      
      for (let k = 0; k < available.length; k++) {
        random -= available[k].weight;
        if (random <= 0) {
          pick.push(available[k].num);
          available.splice(k, 1);
          break;
        }
      }
      
      // Fallback if something went wrong
      if (pick.length <= j) {
        pick.push(available[j % available.length].num);
      }
    }
    
    candidates.push({
      numbers: pick.sort((a, b) => a - b),
      score: pick.reduce((sum, n) => sum + (numberFrequency[n] || 1), 0),
    });
  }
  
  // Sort by score and return top candidates
  return candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(c => c.numbers);
}

/**
 * Generate a prediction for a specific game
 */
export async function generatePrediction({ gameKey, state, drawTime = 'midday', userId = null }) {
  try {
    // Get game configuration
    const gameConfig = getGameConfig(gameKey);
    if (!gameConfig) {
      return { success: false, error: `Unknown game: ${gameKey}` };
    }
    
    // Get game ID from database
    const game = await getGameId(state, gameKey);
    if (!game) {
      return { success: false, error: `Game not found in database: ${state}/${gameKey}` };
    }
    
    // Get recent draw data
    const draws = await getRecentDraws(game.id, 100);
    if (draws.length < 10) {
      return { success: false, error: `Insufficient draw data: ${draws.length} draws` };
    }
    
    // Extract features
    const features = extractFeatures(draws, gameConfig);
    if (!features) {
      return { success: false, error: 'Failed to extract features' };
    }
    
    // Generate candidates
    const candidates = generateCandidates(features, gameConfig, 10);
    if (candidates.length === 0) {
      return { success: false, error: 'Failed to generate candidates' };
    }
    
    // Select the best candidate (top scored)
    const primaryNumbers = candidates[0];
    
    // Generate bonus number if applicable
    let bonusNumbers = [];
    if (gameConfig.has_bonus) {
      const bonusPool = [];
      for (let i = gameConfig.bonus_min; i <= gameConfig.bonus_max; i++) {
        bonusPool.push(i);
      }
      // Simple random selection for bonus
      bonusNumbers = [bonusPool[Math.floor(Math.random() * bonusPool.length)]];
    }
    
    // Calculate confidence (based on feature strength)
    const avgFreq = draws.length / (gameConfig.primary_max - gameConfig.primary_min + 1);
    const confidence = Math.min(100, Math.max(30, 
      (Object.values(features.numberFrequency).filter(f => f >= avgFreq * 0.8 && f <= avgFreq * 1.2).length / 
       Object.keys(features.numberFrequency).length) * 100
    ));
    
    // Get next draw date
    const nextDrawDate = getNextDrawDate(gameKey, drawTime);
    
    // Prepare prediction data
    const predictionData = {
      game_id: game.id,
      user_id: userId,
      target_draw_date: nextDrawDate,
      target_draw_window_label: drawTime,
      primary_numbers: primaryNumbers,
      bonus_numbers: bonusNumbers,
      composite_score: confidence,
      confidence_band: confidence > 70 ? 'high' : confidence > 50 ? 'medium' : 'low',
      strategy_public_label: 'frequency_analysis',
      strategy_internal_bundle: {
        strategy: 'frequency',
        lookback: draws.length,
        hotNumbers: features.hotNumbers,
        coldNumbers: features.coldNumbers,
      },
      evidence_bundle: {
        totalDraws: draws.length,
        avgFrequency: avgFreq,
        frequencyDistribution: features.numberFrequency,
      },
      prediction_hash: generateHash(`${game.id}-${nextDrawDate}-${JSON.stringify(primaryNumbers)}`),
      is_saved_by_default: true,
      request_source: 'on_demand',
      entitlement_tier_code: 'free',
      explanations: [
        {
          explanation_type: 'summary',
          content: `Based on frequency analysis of ${draws.length} historical draws, the numbers ${primaryNumbers.join(', ')} show strong historical patterns.`,
          brewtruth_output_class: 'informational',
        }
      ],
      strategyScores: [
        {
          strategy_key: 'frequency',
          public_label: 'Frequency Analysis',
          weight: 1.0,
          score: confidence,
          notes: [`Analyzed ${draws.length} draws`],
        }
      ],
    };
    
    // Store prediction
    const storage = new PredictionStorage(supabase);
    const stored = await storage.storePrediction(predictionData);
    
    return {
      success: true,
      predictionId: stored?.id,
      prediction: stored,
    };
  } catch (error) {
    console.error('Prediction generation error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get the next draw date for a game
 */
function getNextDrawDate(gameKey, drawTime) {
  const now = new Date();
  const date = new Date(now);
  
  if (gameKey === 'pick3' || gameKey === 'pick4' || gameKey === 'daily3' || gameKey === 'daily4') {
    // Daily games - next draw is today or tomorrow
    if (drawTime === 'midday') {
      date.setHours(13, 0, 0, 0); // 1:00 PM
    } else {
      date.setHours(18, 30, 0, 0); // 6:30 PM PT for CA, 11:30 PM ET for NC
    }
  } else if (gameKey === 'cash5' || gameKey === 'fantasy5') {
    // Evening draws
    date.setHours(18, 30, 0, 0);
  } else if (gameKey === 'powerball') {
    // Sun, Wed, Sat
    while (date.getDay() !== 0 && date.getDay() !== 3 && date.getDay() !== 6) {
      date.setDate(date.getDate() + 1);
    }
    date.setHours(23, 0, 0, 0);
  } else if (gameKey === 'megamillions') {
    // Tue, Fri
    while (date.getDay() !== 1 && date.getDay() !== 4) {
      date.setDate(date.getDate() + 1);
    }
    date.setHours(23, 0, 0, 0);
  }
  
  return date.toISOString().split('T')[0];
}

/**
 * Generate a simple hash for deduplication
 */
function generateHash(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Run predictions for all games
 */
export async function runAllPredictions() {
  const games = [
    { gameKey: 'pick3', state: 'NC' },
    { gameKey: 'pick4', state: 'NC' },
    { gameKey: 'cash5', state: 'NC' },
    { gameKey: 'daily3', state: 'CA' },
    { gameKey: 'daily4', state: 'CA' },
    { gameKey: 'fantasy5', state: 'CA' },
    { gameKey: 'powerball', state: 'MULTI' },
    { gameKey: 'megamillions', state: 'MULTI' },
  ];
  
  const results = [];
  for (const { gameKey, state } of games) {
    const result = await generatePrediction({ gameKey, state });
    results.push({ gameKey, state, ...result });
  }
  
  return results;
}

export default { generatePrediction, runAllPredictions };
