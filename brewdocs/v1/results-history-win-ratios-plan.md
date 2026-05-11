# BrewLotto V1 - Results History, Win Ratios, and Play Confirmation Plan

**Last Updated:** 2026-05-11 ET (results page now groups draws by date with explicit time chips, near-hit play confirmation nudge added, My Picks now shows saved picks only with a broader 30-day history window, Strategy Locker ratio chips and Stats summary are live, results page has a 3/6 month history toggle)

## Purpose
Define the customer and admin workflow for:
- confirmed wins that came from a real play on the correct draw date
- longer draw/result history across NC and CA
- strategy-specific win ratios
- clear separation between a same-day play and a retroactive close match

## Current Truth
- `/results` already shows recent official draws, match counts, and the closest stored prediction for the selected game/state.
- `/results` now groups the draw history by draw date with a visible date divider and time chip so the customer can see when each day’s draws happened at a glance, and it includes 3-month / 6-month history controls.
- Near-hit settlement events now create a customer nudge that says “if you played this, confirm it,” which gives the app a bridge toward a true confirmed-play flow without confusing close matches for confirmed wins.
- The same confirmed-play signal now feeds a compact hit / win ratio chip in Strategy Locker and the Stats & Performance strategy summary so each saved strategy can show whether it is actually working.
- `/my-picks` now shows saved prediction history only, grouped by day, with generated timestamps, saved state, and strategy labels.
- `/my-picks` now uses a broader roughly 30-day fetch window so customers can review and confirm older saved picks without leaving BrewLotto.
- `/stats` already shows settled plays, wins, hit rate, daily stats, and strategy summary data for the signed-in account.
- `/notifications` already exists for customer inbox updates.
- NC Pick 3 / Pick 4 Fireball is now tracked in the play-log and settlement path so the confirmed-play flow can preserve the add-on context instead of flattening it into a generic straight or box result.
- The current flow still needs a stronger confirmation layer so BrewLotto does not imply a win unless the play was actually logged for the draw date/time that won.

## What Must Be True Before a Win Counts
- The customer must have a logged play or confirmed strategy entry tied to the winning draw date/time.
- A result that appears later as a close match should stay labeled as a match or pattern signal unless the play was actually made for that draw.
- The app must never say “you won” just because a later-generated strategy looks close to an earlier draw.

## Recommended User Flow
1. Customer generates a strategy or pick.
2. Customer can save it, or tap a `Mark as Played` / `I Played This` action for the draw they actually entered.
3. The app writes a canonical play record tied to the intended draw date, draw time, game, state, and strategy.
4. After official draw settlement, Brew compares the logged play against the result.
5. If the play was real and the draw is official, Brew marks the play settled and creates:
   - an in-app `user_notifications` row
   - a customer email
   - admin visibility in BrewCommand

## Required Surfaces
- `/results`
  - show recent draw history with date and time
  - show closest prediction separately from confirmed play
  - make the difference between `close match` and `real same-day win` explicit
  - group each day’s draws with a visible divider and time label so the history reads as dated context, not a flat feed
- `/my-picks`
  - show the timestamp and draw context for each generated pick
  - allow a customer to mark a pick as actually played
- `/stats`
  - show win ratios by strategy, game, and state
  - show settled-play ratios only from canonical play history
- `/admin`
  - show user win ratios, strategy performance, and settlement history
  - allow BrewCommand to review false positives or late confirmations

## Data Model Notes
- `play_logs` remains the canonical settlement source.
- `predictions` can still hold generated picks, but generated predictions alone should not count as a win.
- `user_notifications` should receive win, settlement, and strategy outcome alerts only after a canonical play exists.
- If we add a `play_confirmations` or `play_intents` concept later, it should map cleanly into `play_logs` rather than duplicate it.

## Success Criteria
- A prediction generated on May 10 cannot be shown as a May 9 win unless the user actually logged it for May 9.
- Results pages show history clearly enough that the customer does not need to leave BrewLotto to review past outcomes.
- Stats and BrewCommand show win ratios by strategy and by game.
- Notifications and email are sent only for real, confirmed plays and real settlement outcomes.

## Execution Order
1. Add explicit play confirmation / “I played this” behavior so wins are tied to the correct draw date and time.
2. Keep the results history controls on `/results` so customers can review 3-6 months of draw history.
3. Add strategy-specific win ratios to `/stats` and BrewCommand.
4. Keep settlement notifications tied to canonical `play_logs` and official draw settlement.
5. If the user wants deeper analytics later, add a dedicated play-intent table or richer settlement audit layer.
6. Keep the play-confirmation nudge limited to near-hit outcomes until the UI exposes a true confirm-play action.
7. Keep `My Picks` saved-only so Strategy Locker previews do not masquerade as confirmed entries.
8. Add a compact Strategy Locker ratio chip after the confirmed-play signal is stable so each strategy can show a practical hit / win picture.
