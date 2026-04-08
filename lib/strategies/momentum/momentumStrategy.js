/**
 * Momentum strategy for lottery number prediction
 * Based on recent draw trends and velocity of number appearances
 */

class MomentumStrategy {
  /**
   * Execute the Momentum strategy on feature data
   * @param {Object} featureData - Prepared feature vectors from historical data
   * @returns {Object} Scores for each number (0-9 for Pick 3/4, etc.)
   */
  execute(featureData) {
    // For V1, we'll implement a simplified version
    // In a full implementation, this would calculate velocity and acceleration of number frequency
    
    const scores = {};
    
    // If featureData contains momentum information, use it
    if (featureData && featureData.momentum) {
      // Normalize momentum scores to 0-1 range
      const momentumScores = featureData.momentum;
      const maxMomentum = Math.max(...Object.values(momentumScores));
      
      for (const [number, momentum] of Object.entries(momentumScores)) {
        scores[number] = maxMomentum > 0 ? momentum / maxMomentum : 0;
      }
    } else {
      // Fallback: use recent frequency as a proxy for momentum
      // This would be replaced with actual momentum calculation
      if (featureData && featureData.recentFrequency) {
        const recentFreq = featureData.recentFrequency;
        const maxFreq = Math.max(...Object.values(recentFreq));
        
        for (const [number, freq] of Object.entries(recentFreq)) {
          scores[number] = maxFreq > 0 ? freq / maxFreq : 0;
        }
      } else {
        // Last resort: uniform distribution
        const numbers = featureData && featureData.numberRange 
          ? [...Array(featureData.numberRange.max - featureData.numberRange.min + 1).keys()].map(i => i + featureData.numberRange.min)
          : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // Default for Pick 3/4
      
        numbers.forEach(num => {
          scores[num] = 1.0 / numbers.length; // Uniform probability
        });
      }
    }
    
    return scores;
  }
}

export default MomentumStrategy;
