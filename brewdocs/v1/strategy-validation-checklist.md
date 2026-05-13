# BrewLotto V1 Strategy Validation Checklist

**Last Updated:** 2026-05-13 ET

## Goal
Keep the live strategy engine aligned with the BrewLotto V1 spec and prevent legacy wrappers or future strategy names from being mistaken for current production behavior.

## Live Engine Scope

- `poisson`
- `momentum`
- `markov`
- `ensemble`

## Checklist

- [x] Verify `lib/prediction/strategyEngine.js` registers only the live V1 core strategies
- [x] Verify `tests/strategyEngine.test.js` covers core strategy execution, fallback behavior, and ensemble weighting
- [x] Cross-reference each live strategy module against the BrewLotto V1 strategy spec wording
- [x] Mark legacy compatibility wrappers as transitional in docs so they are not mistaken for the live engine
- [x] Confirm candidate generation stays within the correct number range for Pick 3, Pick 4, Cash 5, Powerball, and Mega Millions
- [x] Confirm BrewU/help guidance matches the same live strategy language used by the engine
- [x] Re-check any tier-gated strategy labels against the current spec before launch

## Findings (2026-05-13)

| Check | Result |
|-------|--------|
| Engine registers poisson, momentum, markov, ensemble | ✅ `registerStrategy('poisson', ..., 1.0)`, `registerStrategy('momentum', ..., 1.0)`, `registerStrategy('markov', ..., 1.0)`. Ensemble is implicit via `calculateEnsembleScores`. |
| Test file covers core execution | ✅ `tests/strategyEngine.test.js` loads all 4 strategy modules via `loadDefaultExport` and tests execution, fallback, and ensemble weighting. |
| Legacy wrappers marked | ✅ `lib/strategies/poisson.js`, `lib/strategies/momentum.js`, `lib/strategies/markov.js`, `lib/strategies/ensemble.js` — all marked `// @deprecated — use lib/strategies/{name}/{name}Strategy.js instead` |
| Candidate generation respects range | ✅ `generateCandidatePicks` uses `gameConfig.primary_max` for the number range and `primary_count` for the pick size. Shuffle-based selection stays within range. |
| BrewU uses branded strategy names | ✅ All references use HeatCheck, HeatWave, PulseSync, SequenceX from the tiered ladder. No raw internal keys in user-facing text. |
| Tier labels match current spec | ✅ Ladder: HeatCheck I→II→III→IV, HeatWave I→II→III, PulseSync I→II, SequenceX. Matches the spec in `strategy-engine-cleanup-2026-05-11.md`. |

## Notes

- The broader spec lists future strategy ideas such as hot/cold, overdue, positional trend, sum-range, low/high balance, odd/even, mirror, and combo-filter modules.
- Those are useful product/spec references, but they are not all active live V1 engine modules today.
- Keep the documentation honest: only the core deterministic trio and ensemble are production live right now.
