# BrewLotto V1 - Current State & Next Steps

**Last Updated:** 2026-05-15 ET (desktop/tablet shell widened, changelog + responsive checklist added, admin alerting cleanup, branch truth update, blob-backed landing reel, home-state preference wiring, billing live-mode verification, strategy locker save/run flow fix, compact entitlement summary + collapsible ladder, BrewU Systems support scaffold, support screenshots bucket added, canonical play log bridge, support inbox notifications, settlement sweep, customer notifications plan added, docs timestamp rule added, BrewU play-style guidance live, shared play-style and payout matrix centralized, settlement classification upgraded, strategy validation pass queued, landing video replacement completed with the watermark-free local asset, AI strategy notifications tracked, momentum meter kept single, ingestion-driven strategy signal sweep wired, Strategy Signals BrewCommand section added, play confirmation nudges added, My Picks confirm-play action added, results page date/time dividers added, results history range controls added, strategy locker ratio chips live, results history and win-ratio plan added, My Picks saved-only 30-day history added, Fireball modifier now tracked in play logs and settlement labels for NC Pick 3/4, Fireball visibility surfaced in results / My Picks / Strategy Locker / Stats / Admin, Fireball clarity added to BrewU/help, prize-table snapshots added to BrewU/help, BrewU quick index added for fast topic jumping, BrewU index polish added with chips and a popular-topics strip, BrewU FAQ phrasing added so the index reads like a browsable question hub, Notifications snapshot polish added so the feed opens with a compact state summary, TimePulse timing analysis is now an explicit Master-tier entitlement flag with backfilled access for current Master users, Billing benefit list deduped so TimePulse remains visible without repeated rows, visible schema names were cleaned from Billing, Settings, and Stats copy, QA Test Lab added for approved tester accounts and queued into BrewCommand, visual polish sweep on BrewU/Strategy Locker in progress, `/pricing` is now a real state-aware plan-selection surface with monthly/yearly toggle and billing-portal handoff, pricing route map normalized, pricing page CTA flow tightened so the primary action matches trial/free/paid state, Stripe CLI test-mode readiness confirmed, midday/evening ingestion verified, momentum gauge re-centered)
**Phase:** Shared UI/UX framework and product truth pass

## 2026-05-05 Truth Update

### ✅ Already Real
- Public landing page, login page, pricing page, onboarding flow, and dashboard entry points are live on the `brew2-overhaul` preview branch; production tracks `brewlotto-v1`.
- Stripe downgrades are currently managed through the billing portal, and the webhook path reflects the new tier via `customer.subscription.updated` so entitlements roll back cleanly when Stripe changes the subscription.
- Stripe CLI test-mode is authenticated and ready for webhook verification (`acct_1TTVRiCi8lUllKJd`, test keys configured, config.toml readable).
- Landing reel now uses a Vercel Blob-backed source with muted autoplay plus explicit `Play with sound`, `Replay`, and `Expand` controls.
- Landing reel now starts in its expanded movie-style state by default and includes captions plus a transcript toggle for accessibility.
- The BrewU/onboarding tutorial is now Blob-backed as well, with captions, a transcript toggle, and a BrewU replay path at `/learn#tutorial`.
- BrewCommand now has an internal onboarding reset action so the disclaimer/tutorial flow can be re-run without manual database edits during launch testing.
- BrewCommand AI usage monitoring is being added so request count, tokens, latency, and estimated spend can be compared against tier pricing and customer billing.
- The AI provider layer is connected end-to-end for commentary and suggestion routes via env-driven OpenAI / DeepSeek / NIM routing, and usage logging writes tokens/cost to BrewCommand; deterministic pick generation remains the launch default. The provider selector now accepts explicit `AI_PROVIDER=nim` instead of only implicit fallback.
- TimePulse timing analysis is now a real Master-tier entitlement (`timing_analysis_access`) instead of only a label in the UI. The billing and strategy locker surfaces read the explicit flag, and Master entitlements are backfilled so existing users keep access.
- BrewCommand now has a notification bell for the admin surface, critical/email-worthy alerts are fanned out to one selected superadmin inbox by email, and the admin console shows recent alert delivery history alongside the shared alert center.
- Sentry remains an external observability tool; BrewCommand should track product/business truth directly and only mirror Sentry status if we later decide we need a lightweight dashboard summary.
- `SectionCard` is centralized in `components/brewlotto/dashboard/SectionCard.tsx` and the duplicated copies are gone.
- Dropdown menu destinations are wired to live routes for gameplay, account, and system surfaces, and the older shared `Header` account button now points to `/profile` instead of a dead `/account` route.
- `scrapeCA_Live.js` and `scrapeNC_Live.js` exist and are wired into `scripts/ingestionJob.js`.
- Strategy Locker, Billing, Notifications, Settings, Profile, Results, My Picks, Learn, Legal, and Admin routes all exist in the App Router.
- Strategy Locker saves now route through a server-side save endpoint and the underlying `user_saved_strategies` table supports multiple saved strategies per user, one row per strategy.
- Strategy Locker currently acts as a saved-strategy library and entitlement surface, and it now exposes a real run-preview action from each card while the entitlement ladder is compact by default; the dashboard `Generate Numbers` action remains the main app generate path.
- The trial banner is now a thin blue/glowing strip on dashboard, billing, and profile; when the trial has ended, the dashboard `Generate Numbers` action routes to `/pricing` so the user can convert without being fully locked out of the app.
- Strategy Locker now shows compact confirmed-play / hit-rate / win-rate chips beside each strategy card, and the same confirmed-play source now flows into the stats/performance summary so the ratio is based on actual logged plays rather than loose prediction closeness.
- Dashboard/results freshness gating is real and blocks stale/failed output.
- Login is temporarily locked to BrewCommand-approved admin and QA tester allowlist accounts; remove or widen that gate before public V1 launch if the full product needs broader access.
- BrewCommand does not yet have a full internal RBAC / user-provisioning system; it still relies on the superadmin allowlist for internal admin work, while approved QA testers are routed into a separate Test Lab.
- Home-state preference is now a first-class V1 preference (`user_preferences.default_state_code`) and is being used to drive dashboard/result labels, freshness, and default game selection; it can become a future analytics dimension later.
- BrewU now has a Systems area and a support intake scaffold with category dropdown, comments, screenshots, and a 24-hour response disclaimer; submissions route into BrewCommand alerting, a tracked `support_requests` ticket table, and email fan-out to the selected superadmin inbox. A private `support-screenshots` Supabase bucket is also seeded for storage sync, and resolved tickets now trigger a customer-facing status email.
- BrewU now also has a dedicated Test Lab flow for approved QA testers. Family testers can sign in with approved tester emails, see a gated intro overlay first, then walk the app by tier and submit yes/no + freeform QA reports with screenshots into a separate BrewCommand QA queue backed by `qa_reports` and `qa-screenshots`. Tester identity is auto-captured from the signed-in account so the form can stay simple, drafts are saved per tester email so they can stop and resume later without starting over, the initial tester roster is seeded in `BREWQA_TESTER_EMAILS`, and the Test Lab also documents Stripe test-card usage (`4242...` for success, `4000...0002` for a generic decline) so tier upgrades can be exercised without real cards.
- BrewU now also has a quick index at the top of the page so users can jump straight to tutorial replay, play-style guides, Fireball, payout ladders, freshness, AI guidance, prize tables, and systems links without scrolling.
- Resolved support tickets now also create an in-app `user_notifications` record so the customer notification center reflects support updates in addition to email.
- The legacy play-log path now writes into the canonical `play_logs` table with auth validation and normalized draw-time / number payloads, which makes it possible to build settlement and winnings alerts on one source of truth.
- BrewCommand now has a settlement sweep endpoint and admin trigger that can settle unsettled `play_logs` against official draws, covering both NC and CA through the same state/game mapping the dashboard uses.
- Customer-facing notifications are still only partially wired: the notification center exists, support updates now land in inbox + email, and winnings/settlement alerts now read from `play_logs` but still need a real cash-value prize-table source before they become fully precise.
- Near-hit settlement prompts now create a `confirm your play` notification so the app can ask the user to verify a real play without marking a later close match as a confirmed win.
- The same confirmed-play bridge now feeds compact hit / win ratio chips in Strategy Locker and the stats/performance summary so the user can see which strategies are actually working.
- The live strategy engine is intentionally narrow in V1: `lib/prediction/strategyEngine.js` currently registers the core deterministic trio (`poisson`, `momentum`, `markov`) plus the ensemble combiner, while the older `lib/strategies/*.js` wrappers and `hooks/usePredictionEngine.js` are legacy compatibility layers that should not be mistaken for the current spec truth.
- The next strategy-intelligence pass should capture each launch game’s official play styles and odds so the AI layer can explain straight, box, straight/box, 50/50, combo, pair, Fireball, Power Play, Double Play, and similar choices in a customer-friendly way.
- NC Pick 3 / Pick 4 Fireball is now tracked in play-log metadata and settlement labels so the play/result model can account for the modifier instead of treating the draw like a plain straight or box only result.
- The BrewU/help surface now turns that same play-style matrix into plain-English strategy guidance so customers can learn when a straight play, box play, or game-specific add-on is the better educational option. That guidance now comes from shared BrewU matrix modules so future AI copy, help surfaces, and settlement labels can stay aligned.
- The midday/evening ingestion schedule has now been verified via the live scheduler output; keep it under watch in case future auth/schedule changes regress the NC/CA draw-window timing.
- Settlement classification now uses the shared payout matrix, so exact-order, box-style, and standard match-number games are no longer all treated as the same generic result label.
- BrewU/help copy, support categories, and tutorial transcript content remain static by design for V1; a DB/CMS-backed content pass is tracked separately in `brewdocs/v1/content-externalization-plan.md` if launch pressure later justifies content management.
- Brew AI strategy-detection alerts are intentionally modeled as an ingestion-driven, event-based sweep that can write to `user_notifications` and send an email with a BrewLotto return link when the user is eligible and the signal is strong enough; the main momentum meter remains a single gauge, with hot/cold still presented as separate cards.
- The dashboard momentum gauge has been re-centered so it shows a visible trend-strength value instead of flattening to zero across games; keep watching for any game-specific data shape regressions.
- Confirmed wins still need a tighter play-date confirmation layer before the app can safely say a user truly won on that draw; the new results-history plan tracks that as a launch-critical flow item so a May 10 prediction cannot masquerade as a May 9 win.

### ⚠️ Still Partial Or Needs Verification
- `scripts/ingestionScheduler.js` has been archived; Cloud Scheduler + Cloud Run are the active production ingestion path.
- Billing has checkout, webhook, and customer portal API scaffolding, and the remaining step is live-mode verification plus production transaction confirmation.
- Billing downgrades are portal-managed rather than custom-coded; the webhook should remain the source of truth for tier rollback and entitlement updates.
- Strategy Locker is live and tier-aware, the save/favorite flow is server-backed, the run-preview action is exposed, and the entitlement snapshot now collapses by default; the remaining verification is whether each registry label still matches the intended strategy behavior.
- The dashboard "Generate Numbers" action is wired to `POST /api/predictions`, and a historical-style strategy smoke test now covers the current strategy engine across Pick 3, Pick 4, Cash 5, Powerball, and Mega Millions ranges.
- The live strategy engine is intentionally narrow in V1: `lib/prediction/strategyEngine.js` currently registers the core deterministic trio (`poisson`, `momentum`, `markov`) plus the ensemble combiner, while the older `lib/strategies/*.js` wrappers and `hooks/usePredictionEngine.js` are legacy compatibility layers that should not be mistaken for the current spec truth.
- `My Picks` now includes a confirm-play action for the stored pick card, while `Replay` is still a scroll-to-top placeholder and not a true replay interaction yet.
- `My Picks` now shows saved picks only, loads a broader 30-day-ish history window, and groups the saved entries by date so customers can confirm older saved picks without leaving the app while keeping the confirmation action tied to the saved record.
- `Today's Results` now groups draw history by date with visible time chips and offers a 3- or 6-month history toggle, while still keeping the closest prediction separate from the confirmed-play workflow.
- `Logout` signs out immediately; the confirm-modal UX called for in the screen map is still pending.
- Learn and Legal are lightweight V1 shells, not full CMS/legal surfaces yet.
- Settings stores values, but full theme application across the UI is still future work.
- Notifications stores preferences and reads history, but real delivery wiring still needs a full verification pass.
- Menu/tab and mockup QA still needs another visual pass against the current rendered routes, with Strategy Locker and Learn/BrewU still the highest-priority polish pages.
- Settings now uses a centered account-style hero with clearer Gameplay / Notifications / Account groupings, which brings it closer to the mockup rhythm without inventing fake profile data.
- Billing now uses a centered account-style hero with clearer benefits / billing / quick-links flow, and Notifications now has a New / All tab strip so the live feed reads closer to the mockup rhythm.
- The watermark-free landing-page video is now synced across the local `brewlotto-no-watermark.mp4` asset and the Vercel Blob MP4 URL, with the CLI deploy path still available if you later want to promote a new variant externally.
- Tier gating still needs a deliberate test matrix across dashboard, strategy locker, pricing, billing, and AI surfaces.
- Route wiring is now cleaner, but the next visual pass should still check whether the shared dashboard surfaces breathe as well on desktop/tablet as they do on mobile mockups.
- Strategy validation still needs a spec cross-check pass that verifies each live engine module and its tests against the BrewLotto V1 strategy spec.
- BrewU content externalization is intentionally deferred until launch pressure justifies a content-management layer; the current static content is truthful and tied to real product surfaces.
- BrewCommand alerting is now operational with a single selected recipient plus history/filtering, but full internal RBAC and user provisioning are still deferred.
- BrewCommand receives BrewU support submissions so reported issues can be tracked with notifications, ticket status, and email escalation back to the customer when resolved.
- Shared tier access now normalizes legacy `brew` labels and numeric strategy tiers into the current `free / starter / pro / master` ladder, and the dashboard generate action plus strategy smoke tests now pass against historical-style feature data.
- State analytics is intentionally deferred until the state preference flow settles, but the data model is ready for it once we instrument events.
- The results/history workflow still needs a confirmed-play layer so a prediction created after a draw does not get described as a win just because it matched an earlier result.
- Pricing direction is now locked for the next billing pass: 3-day capped trial, then Starter at $4.99, Pro at $9.99, and Master at $19.99, with AI starting in Starter and expanding upward; annual billing should target a 30% savings message.
- Stripe setup should mirror that ladder with six price records: Starter monthly/yearly, Pro monthly/yearly, and Master monthly/yearly, with live-mode confirmation still pending.
- Trial nudges are now contextual only and appear on dashboard, billing, and profile instead of periodic nags.
- The onboarding tutorial is now a skippable BrewLotto avatar-led video step, and the same replayable tutorial is exposed from BrewU at `/learn#tutorial`.
- Referral growth loop is now captured as a deferred V1.5 plan in `brewdocs/v1/referral-growth-plan.md`; do not wire it into the core launch path until the launch stack is stable.
- The superadmin-only login gate is temporary and must be removed before public V1 launch.
- AI usage logging now feeds an internal BrewCommand spend dashboard so token usage and estimated model cost can be audited before margin-sensitive launch decisions.

### 🎯 Current Truth Priority
1. Do a desktop/tablet/mobile responsive pass on the landing, login, and shared framework surfaces so the structure stays polished across devices. The new checklist lives in `brewdocs/v1/responsive-layout-checklist.md`.
2. Run a visual QA pass on the dropdown/menu destinations against the current mockups and rendered pages, focusing next on any remaining spacing or rhythm gaps in Billing and Notifications.
3. Run a tier matrix test across dashboard, strategy locker, pricing, billing, and AI commentary surfaces.
4. Verify Stripe live-mode checkout/webhook flow against the current billing ladder.
5. Finish the CA Powerball/Mega live scraper work that remains stale/expected.
6. Keep the BrewCommand AI usage ledger visible while live-mode billing is validated.
7. Keep the onboarding tutorial and future Opus Clip clips aligned with the landing/login flow.
8. Tighten the BrewU support intake flow and verify screenshot upload / notification delivery.
9. Build the QA/Test Lab flow for approved testers so the whole app can be exercised tier-by-tier, with yes/no checks, screenshots, and simple notes written into the BrewCommand QA queue.
10. Normalize the customer notification pipeline so support updates, settlement events, and Brew AI strategy detections can write to `user_notifications` and email the correct BrewLotto return link.
11. Continue tightening the confirmed-play workflow so same-day wins are counted correctly and retroactive close matches never masquerade as a real win; near-hit play confirmation nudges are the interim bridge.
12. Capture every launch game’s play-style odds and payout ladders, including NC Fireball handling, then teach the AI layer plus BrewU/help content to offer educational straight/box/50/50/combo suggestions per game.
13. Replace the landing-page video with the watermark-free Blob asset once it lands, and use the Vercel CLI deployment path for the swap.
14. Keep the referral growth loop deferred until billing, notifications, and strategy gating are stable.

### Tutorial Prompt Status
- Opus Clip prompt pack is ready to generate for the disclaimer, walkthrough, and dashboard intro clips.

---

## 🔧 2026-05-01 INGESTION FIX SUMMARY

### Problem
NC scrapers reported "Success" but no data was inserted into `official_draws`. Root cause: adapter schema mismatched V1 canonical schema.

### Solution Applied
1. Fixed ESM/CommonJS compatibility by renaming adapter files to `.cjs`
2. Fixed hardcoded path `/home/brewexec/brewlotto/data` → `process.cwd() + '/data'`
3. Fixed typo in require statement (mismatched quotes)
4. Updated adapter to use proper V1 schema: `game_id` (uuid), `source_id` (uuid), `primary_numbers`, etc.
5. Reduced scrape count from 1000 to 50 draws per run (faster, only latest data)

### Result
- ✅ All 8/8 scrapers now insert into canonical `official_draws` table
- ✅ NC Pick 3, Pick 4, Cash 5 data flowing
- ✅ CA Daily 3, Daily 4, Fantasy 5 data flowing
- ✅ Powerball, Mega Millions data flowing
- ✅ Cloud Scheduler jobs active (7 jobs running at scheduled times)

---

## Data Files Status

### ✅ California Data
| Game | File | Draws | Date Range | Source | Status |
|------|------|-------|------------|--------|--------|
| Daily 3 | `/data/ca/ca-daily3.csv` | 200 | 2025-12-07 to 2026-03-16 | lotteryextreme.com | ✅ VALIDATED |
| Daily 4 | `/data/ca/ca-daily4.csv` | 200 | 2025-08-29 to 2026-03-16 | lotteryextreme.com | ✅ VALIDATED |
| Fantasy 5 | `/data/ca/ca-fantasy5.csv` | 30 | Recent | lotto-8.com | ⚠️ Needs more |

### ✅ North Carolina Data
| Game | File | Draws | Source | Status |
|------|------|-------|--------|--------|
| Pick 3 | `/data/nc/nc-pick3.csv` | ~13,600 | nclottery.com | ✅ In Database (adapter verified 2026-05-01) |
| Pick 4 | `/data/nc/nc-pick4.csv` | ~11,700 | nclottery.com | ✅ In Database (adapter verified 2026-05-01) |
| Cash 5 | `/data/nc/nc-cash5.csv` | ~8,800 | nclottery.com | ✅ In Database (adapter verified 2026-05-01) |

### ✅ Multi-State Data
| Game | File | Draws | Source | Status |
|------|------|-------|--------|--------|
| Powerball | `/data/multi-state/powerball.csv` | 2,373 | NCEL | ✅ Ready |
| Mega Millions | `/data/multi-state/mega-millions.csv` | 1,682 | NCEL | ✅ Ready |

## Data Fetching Scripts

### ✅ Created Scripts
1. **`scripts/scrapeCA_Data.js`** - Fetches CA Daily 3/Daily 4 from lotteryextreme.com
   - Daily 3: Working (2 draws/day)
   - Daily 4: Working (1 draw/day)
   - Command: `node scripts/scrapeCA_Data.js [daily3|daily4|both] [max_draws]`

2. **`scripts/fetchCAData.js`** - Fetches CA Fantasy 5 from lotto-8.com
   - Fantasy 5: Working (30 draws retrieved)
   - Command: `node scripts/fetchCAData.js`

3. **`scripts/scrapePowerball.js`** - Fetches Powerball from NCEL
   - Powerball: Working (uses NCEL as fallback)
   - Command: `node scripts/scrapePowerball.js`

4. **`scripts/scrapeMega.js`** - Fetches Mega Millions from NCEL
   - Mega Millions: Working (uses NCEL as fallback)
   - Command: `node scripts/scrapeMega.js`

5. **`scripts/ingestionJob.js`** - Unified ingestion job with retry logic
   - Runs all scrapers and ingests data into Supabase
   - Command: `node scripts/ingestionJob.js`

6. **`scripts/archive/ingestionScheduler.js`** - Archived local cron scheduler reference only
   - Do not use for production ingestion
   - Historical command: `node scripts/archive/ingestionScheduler.js`

7. **`scripts/ingestionHealth.js`** - Health monitor for ingestion pipeline
   - Checks data freshness and ingestion status
   - Command: `node scripts/ingestionHealth.js`

### ✅ Live Scrapers Now Present
1. **`scripts/scrapeCA_Live.js`** - Live CA scraper for calottery.com pages
2. **`scripts/scrapeNC_Live.js`** - Live NC scraper for nclottery.com pages

These are already referenced by `scripts/ingestionJob.js`; the scheduler still needs to be aligned with them.

### Data Source Summary
| Game | State | Source | Script |
|------|-------|--------|--------|
| Daily 3 | CA | lotteryextreme.com | scrapeCA_Data.js |
| Daily 4 | CA | lotteryextreme.com | scrapeCA_Data.js |
| Fantasy 5 | CA | lotto-8.com | fetchCAData.js |
| Pick 3 | NC | nclottery.com | scrapeNC_Pick3.js |
| Pick 4 | NC | nclottery.com | scrapeNC_Pick4.js |
| Cash 5 | NC | nclottery.com | scrapeNC_Cash5.js |
| Powerball | NC/CA | NCEL (fallback) | scrapePowerball.js |
| Mega Millions | NC/CA | NCEL (fallback) | scrapeMega.js |
| Mega Millions | NC/CA | NCEL (fallback) | scrapeMega.js |

## Parser Implementation

### ✅ Created Parsers
1. **`lib/ingestion/parsers/caPick3Parser.js`** - CA Daily 3 parser
2. **`lib/ingestion/parsers/caPick4Parser.js`** - CA Daily 4 parser
3. **`lib/ingestion/parsers/caFantasy5Parser.js`** - CA Fantasy 5 parser (new)

## CA Historical Adapter (D7.1 & D7.2)

**Status**: ✅ COMPLETED
**D7.1 Completion Time**: 2026-03-18 14:30 ET
**D7.2 Completion Time**: 2026-03-18 15:00 ET
**Total Duration**: ~3 hours

### ✅ Created Adapter
1. **`lib/ingestion/adapters/caHistoricalAdapter.ts`** - CA historical data ingestion adapter

### ✅ Adapter Features
- Parses CA Daily 3, Daily 4, and Fantasy 5 CSV files
- Normalizes data using the core ingestion framework
- Validates records using the validator
- Handles different date formats across CSV files
- Maps source keys to game config keys
- **D7.2**: Supabase integration with game/source lookups
- **D7.2**: Creates missing game and source records
- **D7.2**: Inserts draws into official_draws table
- **D7.2**: Duplicate checking to avoid re-insertion

### ✅ Test Results (2026-03-18 15:30 ET)

**California Lottery Draw Schedule (Verified from calottery.com)**:
- **Daily 3**: 2 draws per day
  - Day draw: 1:00 PM PT (ticket close: 1:00 PM)
  - Evening draw: 6:30 PM PT (ticket close: 6:30 PM)
- **Daily 4**: 1 draw per day
  - Evening draw: 6:30 PM PT (ticket close: 6:30 PM)
- **Fantasy 5**: 1 draw per day
  - Nightly draw: 6:30 PM PT

**North Carolina Lottery Draw Schedule (Verified from nclottery.com)**:
- **Pick 3**: 2 draws per day
  - Daytime: 3:00 PM ET
  - Evening: 11:22 PM ET
- **Pick 4**: 2 draws per day
  - Daytime: 3:00 PM ET
  - Evening: 11:22 PM ET
- **Cash 5**: 1 draw per day
  - Evening: 11:22 PM ET (with Double Play option)

**Data Processing Results (CA Historical)**:
- **CA Daily 3**: 199 valid out of 200 records (1 invalid with all zeros from 2026-02-28)
  - Most recent date: 2026-03-16 (2 draws: day @ 1:00 PM PT = 9-3-5, evening @ 6:30 PM PT = 7-8-8)
- **CA Daily 4**: 200 valid out of 200 records (1 draw per day)
  - Assigned as evening draw @ 6:30 PM PT
- **CA Fantasy 5**: 30 valid out of 30 records (1 draw per day, nightly @ 6:30 PM PT)
- **Total**: 429 valid records out of 430 total records
- **Supabase Insertion**: All valid records successfully inserted with correct draw_window_label

**Note**: NC data is available but not yet ingested. The NC CSV files have proper day/evening markers ("D"/"E") for Pick 3 and Pick 4.

### Test Command
```bash
npx tsx scripts/testCAIngestion.ts
```

### ✅ D7.3 - Multi-State Adapters & Infrastructure (COMPLETED)
**Completion Time**: 2026-03-18 ET

#### ✅ Created Components
1. **`lib/ingestion/adapters/multiStatePowerballAdapter.ts`** - Powerball adapter for NC/CA
2. **`lib/ingestion/adapters/multiStateMegaMillionsAdapter.ts`** - Mega Millions adapter for NC/CA
3. **`scripts/ingestionJob.js`** - Unified ingestion job with retry logic
4. **`scripts/archive/ingestionScheduler.js`** - Archived local scheduler reference
5. **`scripts/ingestionHealth.js`** - Health monitor for ingestion pipeline
6. **`scripts/scrapePowerball.js`** - Powerball scraper with NCEL fallback
7. **`scripts/scrapeMega.js`** - Mega Millions scraper with NCEL fallback

#### ✅ D7.3 Features
- Multi-state game adapters for Powerball and Mega Millions
- State-specific database entries (NC vs CA) for multi-state games
- DoubleDraw handling as separate draw window variant
- Daily scheduling based on actual draw times
- Retry logic for failed insertions
- Health monitoring and status reporting
- Unified job runner for all ingestion tasks

#### ✅ NPM Scripts Added
```bash
# Fetch California data
npm run fetch-ca-data

# Ingest all lottery data into Supabase
npm run ingest-all
```

### Next Steps (D8 - Cross-Source Validation)
- Compare data from multiple sources to ensure accuracy
- Identify and resolve data discrepancies
- Implement automated data reconciliation
- Set up alerting system for data quality issues
- **Target Completion**: 2026-03-20 ET

## Ingestion Core Modules (Phase D1)

### ✅ Created
1. **`lib/ingestion/core/fetcher.ts`** - HTTP fetcher with retry logic
2. **`lib/ingestion/core/parser.ts`** - CSV and HTML parser utilities
3. **`lib/ingestion/core/normalizer.ts`** - Converts all sources to canonical format
4. **`lib/ingestion/core/validator.ts`** - Validates draw data before insertion
5. **`lib/ingestion/core/sourceRegistry.ts`** - Central registry of all ingest sources

### Source Registry
- NC official sources (tier 1, trust 100)
- CA official page sources (tier 1, trust 90)
- CA historical archive sources (tier 2, trust 75)
- Multi-state official sources (tier 1, trust 100)

## Documentation Updates

### ✅ Created Files
1. **`brewdocs/v1/future_growth.md`** - State expansion strategy
2. **`brewdocs/v1/data-sources.md`** - Official lottery data sources
3. **`brewdocs/v1/current_state.md`** - This file

### ✅ Updated Files
1. **`AGENTS.md`** - Added data fetching commands and directory structure
2. **`brewdocs/v1/ingestion-freshness-policy.md`** - Canonical freshness and UI-gating policy
3. **`brewdocs/v1/launch-infrastructure-plan.md`** - Canonical launch stack and setup order
4. **`brewdocs/v1/monitoring-runbook.md`** - Canonical uptime and Sentry setup
5. **`brewdocs/v1/deployment-checklist.md`** - Step-by-step deployment and validation checklist

## 2026-04-09 Operational Freshness Update

### ✅ New Policy Direction
- Draw freshness is now treated as a hard product requirement instead of a passive dashboard warning
- The canonical V1 freshness policy now lives in `brewdocs/v1/ingestion-freshness-policy.md`
- The canonical launch stack now lives in `brewdocs/v1/launch-infrastructure-plan.md`
- Scheduler behavior is being normalized around real draw windows plus retry windows instead of a generic once-daily pass
- Dashboard and prediction surfaces are now expected to withhold live output whenever freshness is not healthy

### ✅ Launch Direction Locked
- BrewLotto remains a web-first product on Vercel + Supabase
- The same app should support website, mobile web, and PWA delivery
- Production ingestion must run outside local development through dedicated scheduled infrastructure
- Google Play packaging is a later distribution step, not the launch hosting model
- `brewlotto-v1` is the intended V1 production truth branch; active development continues on non-production branches until merge approval

### ✅ Operational Hardening Added
- BrewCommand server routes now require authorized admin access instead of being openly callable
- `/admin` now sits behind server-side BrewCommand authorization
- PWA support is re-enabled in production with install affordance in the dashboard header
- Results now withhold official draw output when freshness is not healthy, matching dashboard truthfulness rules
- Sentry foundation is now wired for app and API error capture
- `/api/health` now reports database plus freshness degradation for uptime monitoring

### 🔒 Required Runtime Behavior
- Do not present stale stats as current
- Do not generate predictions from delayed, stale, failed, or unknown freshness states
- Use `draw_freshness_status` / `v_ingestion_health_summary` as the UI gating source of truth

## Updated Todo List

### High Priority
1. Keep ingestion on the Cloud Scheduler + Cloud Run path and leave the local cron helper archived.
2. Run a visual QA pass on the dropdown/menu destinations against the current mockups and rendered pages.
3. Finish Stripe checkout, webhook, and customer portal wiring so `/billing` becomes a real self-serve flow.
4. Run a tier matrix test across dashboard, strategy locker, pricing, billing, and AI commentary surfaces.
5. Verify the strategy replay / run-strategy affordance and tighten the comparison/animation polish where needed, but keep the animation itself as polish-only rather than a launch blocker; the preferred version is a brief BrewLotto avatar running-in-place cue that says the strategy is being computed.
6. Do a desktop/tablet/mobile responsive pass on the landing, login, and shared framework surfaces so the structure stays polished across devices.
7. Finish the BrewCommand Strategy Signals view so every ingestion-driven alert shows the recipient, reason, and qualifying strategy keys before moving back to results-history work.

### Medium Priority
1. Replace the lightweight Learn and Legal shells with fuller CMS-backed and policy-backed content.
2. Wire settings theme application into the actual UI so stored settings affect the experience.
3. Complete notifications delivery integration so in-app history and delivery are fully connected.
4. Add/update the Opus Clip tutorial prompts for onboarding once the current flow is stable.
5. Add the remaining Playwright/E2E coverage for the public landing, login, onboarding, and menu flows.

### Low Priority
1. Add Chart.js or equivalent stats visualizations if they still add value after the live data pass.
2. Clean up lint debt after the current product passes stabilize.
3. Expand profile polish such as avatar upload if it remains in scope.

### Deferred / V1.5 Growth
1. Build the referral growth loop from `brewdocs/v1/referral-growth-plan.md` after billing, notifications, and strategy gating are stable.

## Package.json Updates

### ✅ Added Scripts
```bash
npm run fetch-ca-data   # Fetch California lottery data
npm run ingest-all      # Ingest all data into Supabase
```

## Data Structure Compliance

### ✅ V1 Spec Compliance
According to `brewdocs/v1/Brewlotto_v1.md`, data files should be structured as:

```
data/
├── ca/
│   ├── ca-pick3.csv         # Daily 3 (Pick 3)
│   ├── ca-pick4.csv         # Daily 4 (Pick 4)
│   └── ca-fantasy5.csv      # Fantasy 5 (Cash 5)
├── nc/
│   ├── nc-pick3.csv         # Pick 3
│   ├── nc-pick4.csv         # Pick 4
│   └── nc-cash5.csv         # Cash 5
└── multi-state/
    ├── powerball.csv        # Powerball
    └── mega-millions.csv    # Mega Millions
```

**Current Status**: ✅ All files follow this structure

## 2026-04-08 Progress Snapshot

### ✅ Completed Since Phase 7
- Live Supabase security lints corrected
  - User access views now run with `security_invoker = true`
  - Alert tables now have RLS enabled in the live project
- Root route cleanup completed
  - `/` now reuses the canonical App Router dashboard instead of maintaining a second forked dashboard implementation
- BrewCommand App Router surface added at `/admin`
  - alert summary cards
  - open alert feed
  - acknowledge / resolve actions
  - ingestion health panel
- Missing live BrewCommand DB objects restored
  - `v_brewcommand_alert_center`
  - `v_ingestion_health_summary`
  - alert helper RPC functions
- `draw_freshness_status` backfilled from live `official_draws` and game `schedule_config`
- Dashboard prediction commentary now reads from real stored prediction explanations
- Dashboard generate action now creates real predictions via `/api/predictions`
- Dashboard hot/cold/momentum cards now read from live recent `official_draws`
- Dashboard now surfaces live stale-data messaging from the ingestion health/freshness layer
- Dashboard game tabs now map to canonical source games instead of blending NC and CA families
- Voice Mode now performs real browser narration when supported

### 🔎 Current Findings
- BrewCommand health no longer renders blank and now reflects the canonical active game catalog
- The previously identified duplicate placeholder `lottery_games` rows were confirmed empty and then deactivated safely
- The canonical rows are the records that already own the actual `official_draws` history
- Current freshness output now surfaces actual stale game status instead of duplicate placeholder failures

### 🔄 In Progress
- BrewCommand phase completion work
- Phase 9 commentary integration and replacement of remaining mocked dashboard data

## 2026-04-09 Route Rollout Update (11:14 EDT)

### ✅ Completed
- Avatar dropdown is now aligned to the normalized IA and routes to live `/my-picks`, `/results`, `/profile`, and confirmable `/logout`
- `/profile` is now live as a thin real V1 surface
  - authenticated identity summary
  - editable display name through auth metadata
  - default-state persistence through `user_preferences`
  - truthful security actions without speculative account controls

### 🧪 Verification
- `npm run build` ✅
- `npm test` ✅ (4 suites, 33 tests)

### 🔜 Next Recommended Action
1. Build `/stats`
2. Build `/strategy-locker`
3. Continue the remaining account/support surfaces after the analysis/premium pass

### Next Recommended Action
1. Continue BrewCommand admin improvements beyond the current alert and ingestion health surfaces
2. Replace dashboard mock prediction commentary with real prediction/explanation data
3. Add follow-up validation around stale-game handling and scheduler freshness updates

## Current Issues & Workarounds

### Issue 1: CA Pick 3/Pick 4 Live Data
**Problem**: Official sources (lotto-8.com) return 404 for Pick 3/Pick 4 pages
**Workaround**: Sample data generated for development and testing
**Next Steps**: 
1. Check with ChatGPT for alternative California data sources
2. Try official Calottery.com API if available
3. Use public APIs like LotteryAPI.net as fallback

### Issue 2: Data Format Inconsistencies
**Problem**: NC and CA data have different CSV formats
**Workaround**: Parsers handle format differences during ingestion
**Next Steps**: 
1. Standardize format during ingestion process
2. Ensure all data maps to V1 spec database schema

## Next Steps for Data Ingestion

### ✅ Completed: D7.1 - California Historical Backfill
- CA Historical Adapter created and tested
- All CA historical data parsed and validated
- Ready for Supabase integration (D7.2)

### ✅ Completed: D7.2 - Supabase Integration
- Supabase integration with game_id/source_id lookups
- Game and source records created automatically
- Draws inserted into official_draws table
- Duplicate checking to avoid re-insertion
- Draw window labeling (day/evening/nightly)

### ✅ Completed: D7.3 - Multi-State Adapters & Infrastructure
- Multi-state adapters for Powerball and Mega Millions
- Unified ingestion job with retry logic
- Daily scheduler using node-cron
- Health monitor for ingestion pipeline
- State-specific database entries for multi-state games

### Immediate Actions (D8 - Cross-Source Validation)
1. **Compare data from multiple sources** to ensure accuracy
2. **Identify and resolve data discrepancies**
3. **Implement automated data reconciliation**
4. **Set up alerting system** for data quality issues
5. **Test complete ingestion pipeline** with `npm run ingest-all`

### Medium-term Actions (D9-D12)
1. **Prediction Engine** - Implement Poisson, Momentum, Markov, Ensemble strategies
2. **API Layer** - Expose predictions through RESTful endpoints
3. **Dashboard UI** - Create customer dashboard with prediction panel
4. **BrewCommand Admin** - Build internal monitoring console

### Long-term Actions
1. **Expand to additional states** (Texas, Florida, New York)
2. **Implement real-time ingestion** from official APIs
3. **Add data freshness monitoring**
4. **Create admin dashboard** for ingestion health

## Testing the Data Pipeline

### Current Test Coverage
- ✅ Fantasy 5 data fetching working
- ✅ Parsers created for all CA games
- ✅ Sample data generated for CA Pick 3/Pick 4
- ⚠️ Live CA Pick 3/Pick 4 data sources not found

### Test Commands
```bash
# Fetch California data
npm run fetch-ca-data

# Check data files
ls -la /home/brewexec/brewlotto/data/ca/
```

## Data Sources to Investigate (per your request)

Based on `brewdocs/v1/fetchdata.md`, recommended sources:

### Official Sources
1. **Calottery.com** - Official CA lottery site
   - https://www.calottery.com/draw-games/daily-3
   - https://www.calottery.com/draw-games/daily-4
   - https://www.calottery.com/draw-games/fantasy-5

2. **Public APIs**
   - LotteryAPI.net - https://api.lotteryapi.net
   - RapidAPI - Multiple providers

3. **Historical Datasets**
   - Kaggle datasets for model training

### Action Items for You
When checking with ChatGPT, ask for:
1. Official California lottery API endpoints
2. Public APIs with CA Pick 3/Pick 4 data
3. Historical CSV downloads for CA games
4. Web scraping strategies for calottery.com

## Summary

**Current Progress**:
- ✅ Data files organized according to V1 spec
- ✅ California historical data validated (430 total records)
- ✅ CA Historical Adapter created and tested (D7.1 COMPLETED)
- ✅ Supabase integration with game/source lookups (D7.2 COMPLETED)
- ✅ Multi-state adapters for Powerball & Mega Millions (D7.3 COMPLETED)
- ✅ Unified ingestion job with retry logic (D7.3 COMPLETED)
- ✅ Daily scheduler with node-cron (D7.3 COMPLETED)
- ✅ Health monitor for ingestion pipeline (D7.3 COMPLETED)
- ✅ **Ingestion pipeline fully tested and working** (D8 PRE-REQ COMPLETED)
- ✅ North Carolina scrapers fixed (import paths, naming)
- ✅ All 8 scrapers running successfully in unified job
- ✅ North Carolina data ready (3 games)
- ✅ Multi-state data ready (Powerball, Mega Millions)
- ✅ Parsers created for all CA games
- ✅ Fetch scripts created and tested
- ✅ Documentation updated
- ✅ Live Supabase security posture corrected for BrewCommand-related objects
- ✅ App Router BrewCommand admin console started
- ✅ Ingestion health API and live DB views restored
- ✅ `draw_freshness_status` backfilled in production
- ✅ Empty duplicate `lottery_games` placeholders deactivated in production

**In Progress (Phase 8 / Ops Cleanup)**:
- 🔄 Final BrewCommand admin cleanup and data consistency pass
- 🔄 Remaining cross-source validation and data quality alignment

## 2026-04-08 Late Progress Update (22:37 EDT)

### ✅ Recent Commits
- `8ecd68d` `feat(dashboard): add V1 dashboard shell and PWA assets`
- `910d577` `docs(v1): add UI architecture docs and supporting shared components`
- `f456919` `chore(repo): ignore local artifacts and untrack logs`

### ✅ What Changed
- Grouped the remaining V1 dashboard UI work into isolated commits instead of leaving it mixed with legacy and local files
- Added the canonical dashboard shell components under `components/brewlotto/dashboard/`
- Added the public PWA/dashboard asset set used by the App Router dashboard
- Added the shared pricing and match-score support components required by current routes
- Added `lib/supabase/serverClient.d.ts` to document the current Supabase server helper exports
- Expanded `.gitignore` for local/export artifacts and removed tracked log noise from the repository index

### 🧪 Verification Snapshot
- `npm run lint` fails on existing repo-wide ESLint violations outside the newly grouped dashboard work
- `npm run build` still fails on unresolved legacy/module-path issues:
  - `app/api/stats/[game]/route.ts` missing `utils/fetchStats`
  - `app/api/suggest-fix/route.ts` missing `@/lib/audit/entropyTools`
  - `components/index.js` references missing legacy exports including `./NavBar`, `./dashboard/UserStatsCard`, and `./user/MyPicksCard`
- `npm test` is partially green: 3 suites / 29 tests pass, but `tests/ingestionManager.test.js` still fails because Jest loads `lib/supabase/serverClient.js` as CommonJS while that file uses ESM imports

**Next Phase**:
Fix the baseline lint/build/test compatibility issues separately, then continue Phase 8 admin cleanup and move deeper into Phase 9 commentary integration.

## Lint Debt Plan

- Current state: `build` and `test` are restored; `lint` still fails on repo-wide legacy debt
- Strategy: address lint in targeted follow-up tranches instead of mixing it with current Phase 9 feature work
- Planned tranche order:
  - `app/api/admin/**`
  - remaining active `app/api/**`
  - active `components/**`
  - `lib/supabase/**`
  - `lib/ingestion/**/*.ts`
  - `lib/ingestion/**/*.js` last
- Mechanical fixes go first, then `any` replacement work, then any legacy lint policy decisions for old CommonJS ingestion paths

## Phase 9 Navigation Normalization

- Raw ideation for dropdown and destination screens remains in `brewdocs/v1/dropdown-menu-v1.md`
- Canonical normalized V1 navigation specs now live in:
  - `brewdocs/v1/navigation/dropdown-menu-normalized.md`
  - `brewdocs/v1/navigation/dropdown-screen-map.md`
  - `brewdocs/v1/navigation/dropdown-execution-plan.md`
- Current execution focus is split into:
  - Phase 9A: dashboard shell truthfulness and mockup alignment
  - Phase 9B: avatar dropdown identity system
  - Phase 9C+: destination-screen rollout in prioritized slices

### Normalized V1 Dropdown Destinations
- `/profile`
- `/my-picks`
- `/results`
- `/stats`
- `/strategy-locker`
- `/notifications`
- `/settings`
- `/billing`
- `/learn`
- `/legal`
- `/logout` as confirmed action flow

### Recommended Build Order
1. dropdown container / identity header upgrade
2. `My Picks`
3. `Today's Results`
4. `Profile`
5. `Stats & Performance`
6. `Strategy Locker`
7. account/support surfaces (`Notifications`, `Settings`, `Billing`, `Help / Learn`, `Terms & Privacy`)

### Legacy UI Cleanup Note

- The old Brew mascot UI chain under `components/layouts/AppShell.jsx`, `components/ui/BrewLottoBotDock.jsx`, `components/ui/BrewLottoBotModal.jsx`, `components/ui/BrewAvatar.jsx`, `components/ui/BrewAvatarAnimated.jsx`, and `hooks/useBrewBot.js` is classified as dead legacy scaffolding.
- It is not part of the current V1 App Router surfaces and has been retired to keep the active code path focused on the landing, auth, dashboard, and billing flows.

## 2026-04-09 Dropdown Destination Completion Update (12:24 EDT)

### ✅ Completed
- Phase 9D shipped:
  - `/stats`
  - `/strategy-locker`
- Phase 9E shipped:
  - `/notifications`
  - `/settings`
  - `/billing`
  - `/learn`
  - `/legal`
- The avatar dropdown now routes to the full normalized V1 destination set
- The learn destination is now visibly labeled `BrewU` while keeping the route at `/learn`

### ✅ Route Data Sources
- `/stats`
  - `play_logs`
  - `pick_results`
  - `user_daily_stats`
  - user-owned `predictions`
- `/strategy-locker`
  - `strategy_registry`
  - `user_saved_strategies`
  - `user_strategy_activity`
  - `user_entitlements`
  - `subscription_tiers`
  - user-owned `predictions`
- `/notifications`
  - `notification_preferences`
  - `user_notifications`
- `/settings`
  - `user_settings`
- `/billing`
  - `user_entitlements`
  - `subscription_tiers`
  - `feature_entitlements`

### 🧪 Verification
- `npm run build` ✅
- `npm test` ✅ (4 suites, 33 tests)

### 🔜 Next Recommended Action
1. Update any remaining design/progress docs that still describe Phase 9D/9E as pending
2. Decide whether to deepen these new routes or shift back to Phase 8/BrewCommand polish
3. Start a focused lint tranche when feature priorities permit
