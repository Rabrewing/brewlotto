# BrewLotto Strategy Product Vision

**Status:** Planning / decision guide

This page sits above the live V1 engine and below the historical strategy notes.
It is not the engine spec itself. It is the product lens for deciding which
strategy ideas deserve to become user-facing features, which stay educational,
and which should never be shipped as-is.

## Product goal

BrewLotto strategy should help users:

- understand why a pick exists
- see how a strategy behaves by state, game, and draw window
- compare strategies without pretending any model can guarantee a win
- keep saved-hit, confirmed-play, and settled-win semantics separate

## What strategy means in BrewLotto

Strategy is not just number generation. It includes:

- the live engine behavior
- the timing and play-window context
- the educational explanation layer in BrewU
- the saved-pick and history surfaces in My Picks and Stats
- the product labels users actually see, like TimePulse and TimePulse II

## Live V1 boundary

The current production engine stays narrow:

- `poisson`
- `momentum`
- `markov`
- `ensemble`

Anything outside that core is either:

- a helper or compatibility layer
- a product explanation
- a history or visualization concept
- or future work

## Strategy ladder by intent

### Now

- Live engine core
- TimePulse / TimePulse II as tiered timing language
- BrewU explanations for play styles and payout shapes
- Saved hits, confirmed plays, and settled wins as separate product facts

### Later

- odds heatmaps and positional insights
- strategy comparison views
- backtests and mixers
- hot/cold and overdue overlays
- per-state, per-game, per-window strategy explainers

### Maybe never

- any interface that implies certainty or guarantees
- black-box strategy views with no explanation path
- duplicate dashboards that repeat Stats without adding insight
- odds displays that hide the game, state, or draw-window context

## The odds visualization rule

The old “visual odds heatmap” concept should only return if it does one of two things:

1. helps users learn how a pattern behaves
2. helps users compare strategies across state, game, or draw window

If it cannot do one of those, it should stay out of V1.

## Decision filter

Before a strategy idea ships, ask:

- Does this help a user make sense of the pick?
- Does this respect NC / CA / game / window differences?
- Does this avoid promising a guaranteed outcome?
- Does it add something new beyond Stats and My Picks?
- Can BrewU explain it in plain language?

If the answer is no to most of those, the idea belongs in `maybe never` or in a later research bucket.

## Related docs

- [Historical strategy ideas](./historical-strategy-ideas.md)
- [Strategy validation checklist](./strategy-validation-checklist.md)
- [Future growth strategy](./future_growth.md)

