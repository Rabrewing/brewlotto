# BrewLotto V1 Strategy Validation Checklist

**Last Updated:** 2026-05-10 ET

## Goal
Keep the live strategy engine aligned with the BrewLotto V1 spec and prevent legacy wrappers or future strategy names from being mistaken for current production behavior.

## Live Engine Scope

- `poisson`
- `momentum`
- `markov`
- `ensemble`

## Checklist

- [ ] Verify `lib/prediction/strategyEngine.js` registers only the live V1 core strategies
- [ ] Verify `tests/strategyEngine.test.js` covers core strategy execution, fallback behavior, and ensemble weighting
- [ ] Cross-reference each live strategy module against the BrewLotto V1 strategy spec wording
- [ ] Mark legacy compatibility wrappers as transitional in docs so they are not mistaken for the live engine
- [ ] Confirm candidate generation stays within the correct number range for Pick 3, Pick 4, Cash 5, Powerball, and Mega Millions
- [ ] Confirm BrewU/help guidance matches the same live strategy language used by the engine
- [ ] Re-check any tier-gated strategy labels against the current spec before launch

## Notes

- The broader spec lists future strategy ideas such as hot/cold, overdue, positional trend, sum-range, low/high balance, odd/even, mirror, and combo-filter modules.
- Those are useful product/spec references, but they are not all active live V1 engine modules today.
- Keep the documentation honest: only the core deterministic trio and ensemble are production live right now.
