# BrewLotto V1 Changelog

**Last Updated:** 2026-05-11 ET

This changelog records shipped or committed V1 changes in a compact, timestamped format.

## [Unreleased]

### 2026-05-10
- Widened the shared dashboard shell for desktop and tablet while preserving the current mobile layout.
- Reworked Strategy Locker so the entitlement snapshot opens as a compact summary with a collapsible full ladder, keeping the strategy cards visually primary.
- Tuned BrewU so the page opens with an intelligence-center style coverage overview before the tutorial replay and lesson cards, and tracked content externalization as a later V1 follow-on.
- Added a BrewCommand Strategy Signals section so ingestion-driven alerts can be audited by recipient, reason, momentum context, and eligible strategy keys.
- Grouped `/results` draw history by date with explicit time chips so each day reads as a dated history instead of a flat feed.
- Added a near-hit play confirmation nudge so settled draws can prompt the user to confirm a real play without turning late close matches into confirmed wins.
- Added a My Picks confirm-play action and made notification cards more compact on mobile while keeping desktop spacing roomy.
- Expanded `My Picks` to pull a broader roughly 30-day history window so users can confirm older plays without leaving BrewLotto.
- Added confirmed-play hit / win ratio chips to Strategy Locker and the Stats & Performance strategy summary so real play history drives the ratio instead of loose prediction closeness.
- Added 3-month / 6-month history controls to `/results` so the customer can review a wider dated draw history without leaving BrewLotto.
- Tightened Settings with a centered account-style hero and clearer Gameplay / Notifications / Account section rhythm to better match the mockup flow.
- Polished Billing with a centered account-style hero, clearer benefits / billing / quick-link flow, and polished Notifications with New / All tabs so both routes better match their mockups.
- Documented the decision to keep the momentum meter as a single gauge, while tracking Brew AI strategy-detection alerts as event-driven, deduplicated notifications that can email a BrewLotto return link when the user is away.
- Wired an ingestion-driven strategy signal sweep that uses a branded Brew AI email template, writes `user_notifications` for eligible users, and keeps the momentum meter as the single visible gauge.
- Added a results-history and win-ratio plan so confirmed wins are tied to the correct play date/time, longer NC/CA histories can surface in the product, and same-day wins do not get confused with retroactive close matches.
- Added a BrewU play-style matrix and payout ladder matrix so help content, AI guidance, and settlement classification share one source of truth.

### 2026-05-11
- Wired NC Pick 3 / Pick 4 Fireball into the play-log and settlement label path so the modifier is tracked explicitly instead of being flattened into plain straight/box settlement math.
- Added explicit NC Pick 3 / Pick 4 Fireball tracking to the play-style and payout workstream so the modifier is not lost in plain straight/box settlement math.
- Surfaced NC Pick 3 / Pick 4 Fireball context in Results, My Picks, Strategy Locker, Stats & Performance, and BrewCommand so the modifier is visible in the product surfaces that drive confirmation and ratio tracking.
- Added a BrewU Fireball explainer so NC-only Fireball is clearly framed as a draw-date-specific settlement modifier instead of a trend signal.
- Added prize-table snapshots to BrewU so fixed ladders can be shown directly and CA pari-mutuel games can be labeled as draw-specific certified values instead of fake static payouts.
- Tightened the Strategy Locker metric presentation into a cleaner grid and shortened BrewU Fireball / prize-table copy for a more premium mockup-aligned read.
- Started converting `/pricing` into a real state-aware plan-selection surface so upgrade, current, and downgrade labels can route properly into checkout or the billing portal.
- Switched `My Picks` to saved-pick-only history with date dividers so confirmed-play nudges land on explicit user-saved entries instead of every generated locker run, and stopped new predictions from auto-saving by default.
- Upgraded settlement classification to distinguish exact-order, box-style, and standard match-number outcomes more cleanly.
- Centralized support intake, support tickets, BrewCommand notifications, and customer resolution emails.
- Added a strategy-validation checklist and tightened the live engine spec alignment notes.
- Added a landing-video replacement note so the watermark-free Blob asset can be swapped in through the Vercel CLI update path.
- Tightened the live strategy engine test suite so each deterministic module and the ensemble combiner are validated explicitly.
- Repointed the legacy shared header `Account` button from dead `/account` to the live `/profile` route.
- Added a follow-up note to re-check midday/evening ingestion timing and the dashboard momentum gauge after the scheduler/auth changes.
- Verified the midday/evening Cloud Scheduler jobs are healthy and re-centered the dashboard momentum gauge so it reports a visible trend-strength value instead of flattening to zero.
- Fixed the momentum gauge formula: the `totalHits / (drawCount * primaryCount)` rate was always 1.0, producing flat 50%. Switched to delta-distribution balance so momentum varies with actual number trends (0–100 centered at 50).
- Rewrote `scrapePowerball.js` to write to both NC and CA game_ids, fixed `Feb:1→Feb:2` bug, and added data-sufficiency gating (skips 24-month iteration if >500 draws exist).
- Rewrote `scrapeMega.js` to write to both NC and CA game_ids with the same sufficiency gate.
- Rewrote `scrapeNC_Live.js` to add 24-month past-draws iteration (~1000+ draws per game), fireball handling for Pick3/4 only, and a three-tier late-post fallback (main page → staleness check → current-month past-draws).
- Rewrote `scrapeCA_MultiState.js` to use lotteryextreme.com for CA Powerball (switched from broken calottery.com selector).
- Rewrote `scrapeCA_Live.js` to add lotteryextreme.com historical backfill (up to 2000 draws via draw-ID iteration) when data < 500 threshold.
- Added Phase 4 deferred retry to `ingestionJob.js`: 10-minute wait after 3 fast retry rounds catches late-posted draws.
- Increased Cloud Run request timeout to 30 minutes and all 7 scheduler attempt deadlines to 15 minutes.
- Fixed `lib/prediction/predictionGenerator.js`: stopped `.single()` crash on MULTI state predictions, added `state`/`game` fields to prediction data, and added `draw_window_label` filter for daily games.
- Centralized strategy name mapping in `utils/strategyLabel.js`: all surfaces (Strategy Locker, Stats, My Picks, Dashboard, Results, Voice, Commentary) now display branded labels like "HeatCheck™", "HeatWave™", "PulseSync™" instead of raw internal keys.
- Fixed Strategy Locker performance chip bug: `strategyPerformanceMap` keyed by display label but looked up with raw key, always producing undefined.
- Added Data Freshness section to BrewU explaining healthy/delayed/stale states.
- Documented all changes in `brewdocs/v1/strategy-engine-cleanup-2026-05-11.md`.
- Replaced flat strategy brand names with tiered ladder naming: HeatCheck → HeatCheck II → III → IV, HeatWave → II → III, PulseSync → II. Each family progresses across tier unlocks instead of showing unrelated brand names.
- Assigned Lucide icons per strategy family (Flame for HeatCheck, TrendingUp for HeatWave, Brain for PulseSync, Sparkles for SequenceX) with branded colors (amber, blue, purple, teal).
- Updated AGENTS.md tiered naming entry, CHANGELOG.md, and strategy-engine-cleanup case study.
- Added game selector (GameTabs) and draw window toggle (Midday/Evening) to Strategy Locker so users can strategize for any game, not just Pick 3.
- Updated the run route to accept gameKey, state, and drawWindow from the request body instead of hardcoding Pick 3.
- Updated My Picks "Open Strategy Locker" link to pass game/state as URL query params so the locker opens on the right game.
- Added game and state fields to user_strategy_activity logging for per-game strategy tracking.
- Documented in brewdocs/v1/game-aware-strategy-locker-2026-05-11.md.
### 2026-05-07
- Added BrewU support intake, support screenshot storage, canonical play-log bridge, settlement sweep, and customer notifications planning.
- Added timestamp discipline to AGENTS and Brewdocs so future AI sessions can read state without guessing.

### 2026-05-05
- Fixed cloud ingestion scheduler routing, AI usage tracking, and state-aware dashboard behavior.
- Verified live NC and CA ingestion paths and updated the shared dashboard game mapping.
