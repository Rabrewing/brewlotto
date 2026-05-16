# BrewLotto V1 Changelog

**Last Updated:** 2026-05-15 ET

This changelog records shipped or committed V1 changes in a compact, timestamped format.

## [Unreleased]

### 2026-05-12
- Recorded that the AI provider layer is connected for commentary and suggestion routes with env-driven OpenAI / DeepSeek / NIM routing and BrewCommand usage logging.
- Allowed the AI provider selector to accept explicit `AI_PROVIDER=nim` instead of only relying on fallback detection.
- Tightened `/pricing` copy so the selection surface reads cleaner while still routing upgrades to Stripe and current-plan changes to Billing.
- Made the primary `/pricing` CTA state-aware so trial, free, and paid users land on the right next step instead of a one-size-fits-all login path.
- Added a BrewU quick index / FAQ-style jump surface so users can jump directly to the help topic they need without scrolling the whole page.
- Added chips and a popular-topics strip to the BrewU index so the help hub reads more like a browsable knowledge surface.

### 2026-05-13
- Reworded the BrewU quick index so the top help surface reads like a browsable FAQ with question-style prompts and an "Ask BrewU" cue for faster topic discovery.

### 2026-05-15
- Added a dedicated QA Test Lab for approved tester accounts, with a separate login allowlist, a gated intro overlay before the form unlocks, tier-by-tier test guidance, structured yes/no feedback, screenshot upload, and a BrewCommand QA queue.
- Added a Stripe test-card cheat sheet to the QA Test Lab so testers can use `4242 4242 4242 4242` for successful tier testing and `4000 0000 0000 0002` for decline-path checks without using real cards.
- Noted the preferred Run Strategy polish direction as a short BrewLotto avatar running-in-place cue that indicates the strategy is being computed, keeping the animation as post-core-flow polish only.
- Added QA draft resume behavior so approved testers can close the Test Lab and come back later without losing the report in progress; the form is keyed per tester email and the reset button clears the saved draft when they want to start over.
- Restored the legacy `tier` alias from `useUserTier` so older prediction components still see the paid tier after the entitlement-backed billing refactor, which keeps Master-gated strategy paths from acting like the user is still free.
- Made the Billing page resilient to lookup failures by degrading entitlements, tiers, and features gracefully instead of collapsing the whole page into `Failed to load billing`.
- Seeded the initial QA tester allowlist with the current family roster so the Test Lab can open for approved testers as soon as they sign in.
- Moved the QA tester roster into the shared auth helper default allowlist so the approved tester emails work in the deployed app, not only in local `.env.local`.
- Restored direct desktop logout from the avatar menu so BrewCommand/admin sessions can sign out immediately, with `/logout` kept as a fallback route.
- Switched `useUserTier` to read the Stripe-backed `user_entitlements` row first so Master purchases surface correctly in Pricing and Dashboard after checkout/webhook processing.
- Recorded that Master purchases now display as the current plan in Billing when the entitlement row is updated, keeping the visible account state aligned with the Stripe-backed purchase record.
- Added a compact Notifications snapshot header with unread count, enabled delivery channels, category coverage, quiet hours, and support/help links so the page feels more like a control center than a raw list.
- Removed duplicated benefit rows from the Billing Master-tier entitlement summary while keeping the TimePulse Master flag visible in the canonical account view.
- Swapped the landing reel fallback to the watermark-free `public/landing/brewlotto-no-watermark.mp4` asset and synced the Vercel Blob MP4 URL so the live landing page no longer uses the older watermarked fallback.
- Cleaned visible schema-name leakage from Billing, Settings, and Stats copy so the UI reads like product language instead of table names.

### 2026-05-12
- Confirmed the Stripe CLI is authenticated in test mode and ready for webhook verification, with the Brewlotto sandbox account and config file readable in the local environment.
- Restyled the trial upgrade banner to a thinner blue/glow treatment and made expired trial generate actions route to `/pricing` instead of leaving users stuck at a hard lockout.

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
- Converted `/pricing` into a real state-aware plan-selection surface with a monthly/yearly billing toggle, clearer current/upgrade/downgrade labels, and direct routing into Stripe checkout or the billing portal depending on account state.
- Normalized the route-map docs so `/pricing` is recorded as the state-aware selection surface and `Billing` remains the authenticated subscription-management destination.
- Documented that Stripe downgrades are portal-managed and that `customer.subscription.updated` is the rollback source of truth for entitlement changes.
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
- Sealed Customer Strategy Alerts, Play Confirmation Nudges, and Results History / Win Ratios as complete in AGENTS.md.
- Tier-scaled strategy draw counts: Free=100, Starter=200, Pro=500, Master=1000.
- Added runPlayConfirmationSweep() to ingestion pipeline — nudges users when saved predictions near-match new draws.
- Created scripts/settlementSweep.js for auto-settling play_logs against official draws.
- Added /settle endpoint to ingestion server + daily Cloud Scheduler job at 12:30 AM ET.

### 2026-05-13
- Play confirmation nudges now fire during every ingestion run.
- Settlement sweep automated with daily schedule.
- Strategy runs scale draw count by user tier.
- BrewU Hit vs Win lesson added, index chips made clickable.
- Results matches scoped to saved + date-gated predictions only.
- Fireball displayed from draw data on confirmed picks.
- Created `getPlayStyleHint` helper and wired into prediction commentary.
- Completed strategy validation checklist (all 7 checks verified).
- Created `LoadingSkeleton` and `ErrorBoundary` shared components.
- Mapped engine keys (poisson, momentum, markov, ensemble) to branded names in TIERED_MAP.
- Built `brewu_content` DB-backed CMS: migration with seed data, admin API routes (GET/POST/PUT/DELETE), admin editor page at `/admin/brewu`, and updated Learn page to read from DB with hardcoded fallback.
- BrewU Content Management documented in `brewdocs/v1/brewu-content-management.md`.

### 2026-05-14
- Built TimePulse timing analysis (`lib/prediction/timingAnalysis.js`): per-strategy lag tracking, percentile windows, confidence badge (high/medium/low based on sample size and spread).
- Brew AI compares timing profiles across all registered strategies and recommends the strategy with the tightest window.
- TimePulse recommends play style (Straight / Box / 50/50) based on historical positional accuracy tracking.
- Added TimePulse to My Picks prediction cards with 36-hour refresh cooldown (blue pulsing refresh button).
- Added TimePulse to Stats & Performance strategy breakdown, Pricing, Billing, and Strategy Locker Master tier feature listings.
- My Picks draw window filter (Midday/Evening) now only visible for Pick 3/4 games.
- Added BrewU support intake, support screenshot storage, canonical play-log bridge, settlement sweep, and customer notifications planning.
- Added timestamp discipline to AGENTS and Brewdocs so future AI sessions can read state without guessing.

### 2026-05-15
- Made TimePulse timing analysis an explicit Master-tier entitlement (`timing_analysis_access`) instead of only a label-level rule.
- Backfilled existing Master users so current entitlements keep TimePulse access without a Stripe catalog change.
- Updated billing and Strategy Locker surfaces to read the explicit entitlement flag instead of only inferring access from tier text.

### 2026-05-05
- Fixed cloud ingestion scheduler routing, AI usage tracking, and state-aware dashboard behavior.
- Verified live NC and CA ingestion paths and updated the shared dashboard game mapping.
