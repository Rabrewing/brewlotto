/**
 * Core strategy engine for BrewLotto V1
 * Executes deterministic statistical strategies and combines them via ensemble scoring
 */

import PoissonStrategy from "../strategies/poisson/poissonStrategy.js";
import MomentumStrategy from "../strategies/momentum/momentumStrategy.js";
import MarkovStrategy from "../strategies/markov/markovStrategy.js";
import EnsembleStrategy from "../strategies/ensemble/ensembleStrategy.js";

function shuffle(array) {
  const values = [...array];

  for (let index = values.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [values[index], values[randomIndex]] = [values[randomIndex], values[index]];
  }

  return values;
}

class StrategyEngine {
  constructor() {
    this.strategies = {};
    this.strategyWeights = {}; // For ensemble scoring
    this.ensemble = new EnsembleStrategy();
    
    // Register the default V1 strategies
    this.registerStrategy('poisson', new PoissonStrategy(), 1.0);
    this.registerStrategy('momentum', new MomentumStrategy(), 1.0);
    this.registerStrategy('markov', new MarkovStrategy(), 1.0);
  }

  /**
   * Register a strategy module
   * @param {string} key - Unique strategy identifier
   * @param {Object} strategy - Strategy module with execute method
   * @param {number} weight - Weight for ensemble scoring (default: 1.0)
   */
  registerStrategy(key, strategy, weight = 1.0) {
    this.strategies[key] = strategy;
    this.strategyWeights[key] = weight;
  }

  /**
   * Execute all registered strategies on feature data
   * @param {Object} featureData - Prepared feature vectors from historical data
   * @returns {Object} Strategy scores keyed by strategy key
   */
  executeStrategies(featureData) {
    const scores = {};

    for (const [key, strategy] of Object.entries(this.strategies)) {
      try {
        if (typeof strategy.execute !== "function") {
          throw new Error(`Strategy ${key} must have an execute method`);
        }
        scores[key] = strategy.execute(featureData);
      } catch (error) {
        console.error(`Error executing strategy ${key}:`, error.message);
        scores[key] = null; // Mark as failed
      }
    }

    return scores;
  }

  /**
   * Calculate ensemble scores from individual strategy scores
   * @param {Object} strategyScores - Raw scores from each strategy
   * @returns {Object} Normalized ensemble scores
   */
  calculateEnsembleScores(strategyScores) {
    return this.ensemble.execute(strategyScores, this.strategyWeights);
  }

  /**
   * Generate candidate picks based on strategy scores
   * @param {Object} ensembleScores - Normalized ensemble scores
   * @param {Object} gameConfig - Game configuration (primary count, range, etc.)
   * @param {number} count - Number of candidate picks to generate
   * @returns {Array<Array<number>>} Array of candidate number combinations
   */
  generateCandidatePicks(ensembleScores, gameConfig, count = 10) {
    const candidates = [];

    // For now, implement a simple top-N approach
    // In a full implementation, this would use more sophisticated selection
    const sortedNumbers = Object.entries(ensembleScores)
      .filter(([_, score]) => score !== null && !isNaN(score))
      .sort(([, a], [, b]) => b - a)
      .map(([num]) => parseInt(num));

    // Generate combinations from top numbers
    if (sortedNumbers.length >= gameConfig.primary_count) {
      // Simple approach: take top N numbers and create variations
      const topNumbers = sortedNumbers.slice(0, Math.min(20, sortedNumbers.length));
      
      for (let i = 0; i < count; i++) {
        // Shuffle and take first primary_count numbers
        const shuffled = shuffle(topNumbers);
        const pick = shuffled.slice(0, gameConfig.primary_count).sort((a, b) => a - b);
        candidates.push(pick);
      }
    }

    return candidates;
  }
}

export default StrategyEngine;
