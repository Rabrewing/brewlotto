# BrewLotto V1 — Game-Aware Strategy Locker (2026-05-11)

## Problem

The Strategy Locker was locked to Pick 3 only. The run route hardcoded
`gameKey = 'pick3'`, so every strategy run targeted Pick 3 regardless of
the user's game. My Picks linked to `/strategy-locker` with no context.

## Changes

### Strategy Locker Page (`app/strategy-locker/page.tsx`)

- Added `GameTabs` component from the shared dashboard — users can switch
  between Pick 3, Pick 4, Cash 5, Powerball, and Mega Millions
- Added draw window toggle (Midday / Evening) for Pick 3 and Pick 4
- Reads `?game=` and `?state=` query params from URL on mount — supports
  deep linking from My Picks
- Passes `gameKey`, `state`, and `drawWindow` to the run API
- Run preview stores and displays `drawWindow` when applicable

### Run Route (`app/api/strategy-locker/run/route.ts`)

- Accepts `gameKey`, `state`, `drawWindow` from request body
- Falls back to home state and Pick 3 if not provided (backward compatible)
- Stores `game`, `state`, and `drawWindow` in the prediction record
- Logs `game` and `state` in `user_strategy_activity` table for per-game
  strategy tracking

### My Picks Link

- The "Open Strategy Locker" button now passes the current game and state
  filters as URL query params so Strategy Locker opens on the right game

### Stats & Performance

- Already reads `game` and `state` from predictions table — no changes
  needed since runs now store correct values
- Strategy performance breakdowns will automatically reflect per-game data

## Files Changed

```
app/strategy-locker/page.tsx             — game tabs, draw window toggle, query param support
app/api/strategy-locker/run/route.ts      — accept gameKey/state/drawWindow, log to activity
app/my-picks/page.tsx                     — pass game/state context in link href
```

## Data Flow

```
My Picks (filtered to Pick 4)
  → clicks "Open Strategy Locker"
  → /strategy-locker?game=pick4&state=NC
  → Strategy Locker loads with Pick 4 selected
  → user clicks "Run Strategy"
  → POST /api/strategy-locker/run { strategyId, gameKey:"pick4", state:"NC", drawWindow:"midday" }
  → prediction stored with game:"pick4", state:"NC", draw_window_label:"midday"
  → user clicks "Save to My Picks"
  → prediction shows in My Picks under Pick 4 filter
```

## Remaining

- Draw window filtering in the strategy engine itself (currently stores the
  label but doesn't filter draws by window — that's a strategy engine wiring task)
- Admin surface for per-game strategy activity (data is logged but not surfaced)
