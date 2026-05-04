const fs = require('fs');
const path = require('path');

function loadDefaultExport(relativePath, exportName, dependencies = {}) {
  const sourcePath = path.join(__dirname, '..', relativePath);
  const source = fs
    .readFileSync(sourcePath, 'utf8')
    .replace(/^import .*$/gm, '')
    .replace(/^export default .*$/gm, '');

  const argNames = [...Object.keys(dependencies), 'module', 'exports'];
  const argValues = [...Object.values(dependencies), { exports: {} }, {}];

  const factory = new Function(
    ...argNames,
    `${source}\nreturn typeof ${exportName} !== 'undefined' ? ${exportName} : module.exports.default || module.exports;`
  );

  return factory(...argValues);
}

const PoissonStrategy = loadDefaultExport('lib/strategies/poisson/poissonStrategy.js', 'PoissonStrategy');
const MomentumStrategy = loadDefaultExport('lib/strategies/momentum/momentumStrategy.js', 'MomentumStrategy');
const MarkovStrategy = loadDefaultExport('lib/strategies/markov/markovStrategy.js', 'MarkovStrategy');
const EnsembleStrategy = loadDefaultExport('lib/strategies/ensemble/ensembleStrategy.js', 'EnsembleStrategy');

const StrategyEngine = loadDefaultExport('lib/prediction/strategyEngine.js', 'StrategyEngine', {
  PoissonStrategy,
  MomentumStrategy,
  MarkovStrategy,
  EnsembleStrategy,
});

const FEATURE_FIXTURES = {
  pick3: {
    frequency: { 0: 2, 1: 8, 2: 5, 3: 1, 4: 7, 5: 3, 6: 4, 7: 2, 8: 6, 9: 1 },
    recentFrequency: { 0: 1, 1: 5, 2: 4, 3: 1, 4: 6, 5: 2, 6: 3, 7: 1, 8: 4, 9: 1 },
    momentum: { 0: 0.2, 1: 0.9, 2: 0.7, 3: 0.1, 4: 1.0, 5: 0.3, 6: 0.4, 7: 0.2, 8: 0.8, 9: 0.1 },
    transitionMatrix: {
      0: { 0: 0.1, 1: 0.3, 2: 0.6 },
      1: { 0: 0.2, 1: 0.2, 2: 0.6 },
      2: { 0: 0.3, 1: 0.4, 2: 0.3 },
    },
    numberRange: { min: 0, max: 9 },
  },
  pick4: {
    frequency: { 0: 3, 1: 6, 2: 4, 3: 8, 4: 5, 5: 2, 6: 7, 7: 1, 8: 4, 9: 2 },
    recentFrequency: { 0: 2, 1: 5, 2: 3, 3: 7, 4: 4, 5: 1, 6: 6, 7: 1, 8: 3, 9: 1 },
    momentum: { 0: 0.3, 1: 0.8, 2: 0.5, 3: 1.0, 4: 0.7, 5: 0.2, 6: 0.9, 7: 0.1, 8: 0.4, 9: 0.2 },
    transitionMatrix: {
      0: { 0: 0.2, 1: 0.4, 2: 0.4 },
      1: { 0: 0.3, 1: 0.3, 2: 0.4 },
      2: { 0: 0.4, 1: 0.2, 2: 0.4 },
    },
    numberRange: { min: 0, max: 9 },
  },
  cash5: {
    frequency: { 1: 4, 2: 5, 3: 8, 4: 2, 5: 7, 6: 3, 7: 1, 8: 6, 9: 4, 10: 2 },
    recentFrequency: { 1: 3, 2: 4, 3: 7, 4: 2, 5: 6, 6: 2, 7: 1, 8: 5, 9: 3, 10: 2 },
    momentum: { 1: 0.4, 2: 0.5, 3: 1.0, 4: 0.2, 5: 0.9, 6: 0.3, 7: 0.1, 8: 0.8, 9: 0.4, 10: 0.2 },
    transitionMatrix: {
      1: { 1: 0.2, 2: 0.5, 3: 0.3 },
      2: { 1: 0.3, 2: 0.2, 3: 0.5 },
      3: { 1: 0.4, 2: 0.3, 3: 0.3 },
    },
    numberRange: { min: 1, max: 39 },
  },
  powerball: {
    frequency: { 1: 6, 2: 8, 3: 3, 4: 7, 5: 4, 6: 2, 7: 5, 8: 1, 9: 4, 10: 6, 11: 5, 12: 3 },
    recentFrequency: { 1: 5, 2: 7, 3: 2, 4: 6, 5: 4, 6: 2, 7: 4, 8: 1, 9: 3, 10: 5, 11: 4, 12: 2 },
    momentum: { 1: 0.7, 2: 1.0, 3: 0.4, 4: 0.9, 5: 0.5, 6: 0.2, 7: 0.6, 8: 0.1, 9: 0.4, 10: 0.7, 11: 0.5, 12: 0.3 },
    transitionMatrix: {
      1: { 1: 0.2, 2: 0.4, 3: 0.4 },
      2: { 1: 0.3, 2: 0.3, 3: 0.4 },
      3: { 1: 0.4, 2: 0.2, 3: 0.4 },
    },
    numberRange: { min: 1, max: 69 },
  },
  megamillions: {
    frequency: { 1: 5, 2: 4, 3: 7, 4: 3, 5: 6, 6: 2, 7: 4, 8: 1, 9: 5, 10: 3, 11: 6, 12: 2 },
    recentFrequency: { 1: 4, 2: 3, 3: 6, 4: 2, 5: 5, 6: 1, 7: 3, 8: 1, 9: 4, 10: 2, 11: 5, 12: 2 },
    momentum: { 1: 0.6, 2: 0.5, 3: 1.0, 4: 0.3, 5: 0.8, 6: 0.2, 7: 0.4, 8: 0.1, 9: 0.6, 10: 0.3, 11: 0.7, 12: 0.2 },
    transitionMatrix: {
      1: { 1: 0.2, 2: 0.4, 3: 0.4 },
      2: { 1: 0.3, 2: 0.2, 3: 0.5 },
      3: { 1: 0.5, 2: 0.2, 3: 0.3 },
    },
    numberRange: { min: 1, max: 70 },
  },
};

describe('StrategyEngine', () => {
  test('executes the core strategies from historical-style feature data', () => {
    const engine = new StrategyEngine();
    const scores = engine.executeStrategies(FEATURE_FIXTURES.pick3);

    expect(scores.poisson).toBeTruthy();
    expect(scores.momentum).toBeTruthy();
    expect(scores.markov).toBeTruthy();

    for (const strategyScores of Object.values(scores)) {
      expect(strategyScores).not.toBeNull();
      expect(typeof strategyScores).toBe('object');
      expect(Object.keys(strategyScores)).toContain('1');
    }
  });

  test('generates valid candidate picks for each supported game range', () => {
    const engine = new StrategyEngine();

    for (const [gameKey, features] of Object.entries(FEATURE_FIXTURES)) {
      const strategyScores = engine.executeStrategies(features);
      const ensembleScores = engine.calculateEnsembleScores(strategyScores);
      const candidateCount = gameKey === 'pick3' ? 5 : 3;
      const primaryCount = gameKey === 'pick3' ? 3 : 5;

      const candidates = engine.generateCandidatePicks(
        ensembleScores,
        {
          primary_count: primaryCount,
        },
        candidateCount
      );

      expect(candidates.length).toBe(candidateCount);
      candidates.forEach((pick) => {
        expect(pick.length).toBe(primaryCount);
        expect(new Set(pick).size).toBe(primaryCount);
        const min = features.numberRange.min;
        const max = features.numberRange.max;
        pick.forEach((num) => {
          expect(num).toBeGreaterThanOrEqual(min);
          expect(num).toBeLessThanOrEqual(max);
        });
      });
    }
  });

  test('normalizes ensemble scores from multiple strategies', () => {
    const engine = new StrategyEngine();
    const ensembleScores = engine.calculateEnsembleScores({
      poisson: { 1: 0.2, 2: 0.8 },
      momentum: { 1: 0.5, 2: 0.4 },
      markov: { 1: 0.9, 2: 0.3 },
    });

    expect(ensembleScores['1']).toBeGreaterThan(ensembleScores['2']);
    expect(Object.keys(ensembleScores)).toEqual(expect.arrayContaining(['1', '2']));
  });
});
