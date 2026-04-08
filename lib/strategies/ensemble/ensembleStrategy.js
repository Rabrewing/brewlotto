/**
 * Ensemble strategy that combines multiple prediction strategies
 * Uses weighted averaging to produce final scores
 */

class EnsembleStrategy {
  /**
   * Execute the Ensemble strategy by combining precomputed strategy scores
   * @param {Object} strategyScores - Raw scores from each strategy
   * @param {Object} weights - Weights for each strategy (defaults to equal)
   * @returns {Object} Combined scores for each number
   */
  execute(strategyScores = {}, weights = {}) {
    if (!strategyScores || Object.keys(strategyScores).length === 0) {
      return {};
    }

    const validScores = Object.fromEntries(
      Object.entries(strategyScores).filter(([, scores]) => scores && typeof scores === 'object')
    );

    if (Object.keys(validScores).length === 0) {
      return {};
    }

    const combinedScores = {};
    const allNumbers = new Set();

    for (const scores of Object.values(validScores)) {
      for (const number of Object.keys(scores)) {
        allNumbers.add(number);
      }
    }

    allNumbers.forEach(number => {
      let weightedSum = 0;
      let totalWeight = 0;

      for (const [key, scores] of Object.entries(validScores)) {
        const score = scores[number] || 0;
        const weight = weights[key] || 1.0;

        weightedSum += score * weight;
        totalWeight += weight;
      }

      combinedScores[number] = totalWeight > 0 ? weightedSum / totalWeight : 0;
    });

    return combinedScores;
  }
}

export default EnsembleStrategy;
