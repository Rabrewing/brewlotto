# BrewLotto Strategy Decision Checklist

Use this when a new strategy idea comes up during launch reviews.
It is a quick filter, not a spec document.

## Put it in `Now` if:

- it is already in the live V1 engine
- it improves the user’s understanding of an existing pick
- it helps with saved-hit, confirmed-play, or settled-win clarity
- it is already visible in BrewU, My Picks, Stats, Strategy Locker, or Billing
- it respects state/game/draw-window differences

## Put it in `Later` if:

- it is useful, but not needed for V1 launch
- it would add educational value without changing core settlement
- it needs more backtesting, visualization, or comparison work
- it could become a useful layer after the core funnel is stable

## Put it in `Maybe never` if:

- it suggests a guarantee or certainty
- it hides the state, game, or draw-window context
- it duplicates Stats without adding learning value
- it is a black-box output with no explanation path
- it creates confusion between saved hits, confirmed plays, and wins

## Fast questions

Ask these before green-lighting a new idea:

1. Does this help the customer understand a pick?
2. Does it stay honest about NC / CA, game, and window differences?
3. Does it add something that Stats or My Picks cannot already show?
4. Can BrewU explain it in plain language?
5. Does it avoid implying a sure win?

If most answers are no, the idea is probably not ready.

