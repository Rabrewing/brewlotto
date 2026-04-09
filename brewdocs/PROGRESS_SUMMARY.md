# BrewLotto Progress Summary

**Last Updated:** 2026-04-09 ET (12:24 EDT)

## Current State

- App Router dashboard is now the canonical frontend entrypoint
- BrewCommand admin work is active in Phase 8
- Live Supabase security issues reported by the database linter were corrected
- `draw_freshness_status` has been backfilled in the live database
- Duplicate `lottery_games` placeholder rows were deactivated after dependency audit

## 2026-04-08 Delivery Summary

### Completed
- Fixed live Supabase security lints for user views and alert tables
- Added `supabase/migrations/20260408120000_fix_security_lints.sql`
- Restored missing BrewCommand database views and alert helper RPCs
- Added `supabase/migrations/20260408133000_restore_brewcommand_admin_views.sql`
- Added BrewCommand App Router page at `/admin`
- Added live ingestion health API at `app/api/admin/ingestion-health/route.ts`
- Backfilled `draw_freshness_status` from draw history and schedule configuration
- Added `supabase/migrations/20260408143000_backfill_draw_freshness_status.sql`

### Verified Live
- `v_brewcommand_alert_center`
- `v_ingestion_health_summary`
- `raise_system_alert(...)`
- `draw_freshness_status` populated with current rows

### Completed Follow-up Cleanup
- Audited duplicate `lottery_games` placeholder rows across dependent V1 tables
- Verified placeholders had no draw, source, run, feature, prediction request, user preference, or alert usage
- Deactivated the empty placeholders instead of deleting them
- Removed their derived freshness rows and refreshed freshness state
- Confirmed BrewCommand ingestion health now reflects canonical active games only

### Next Step
- Continue BrewCommand phase polish or begin wiring real prediction explanations into the dashboard for Phase 9

### Canonical Rows Kept Active
- NC: `pick3`, `pick4`, `cash5`, `powerball`, `mega_millions`
- CA: `daily3`, `daily4`, `fantasy5`, `powerball`, `mega_millions`

## 2026-04-08 Late Progress Update (22:37 EDT)

### Recent Commits
- `8ecd68d` `feat(dashboard): add V1 dashboard shell and PWA assets`
- `910d577` `docs(v1): add UI architecture docs and supporting shared components`
- `f456919` `chore(repo): ignore local artifacts and untrack logs`

### Completed
- Grouped the remaining V1 dashboard work into isolated commit boundaries
- Added the canonical dashboard shell component set and public PWA assets
- Added supporting shared UI components for pricing and match-score surfaces
- Added `lib/supabase/serverClient.d.ts` to capture the current Supabase helper exports
- Expanded `.gitignore` to ignore local/export artifacts and removed tracked log files from git noise

### Verification Snapshot
- `npm run lint` fails on pre-existing repo-wide ESLint debt
- `npm run build` fails on unresolved legacy import/module-path issues in `app/api/stats/[game]/route.ts`, `app/api/suggest-fix/route.ts`, and `components/index.js`
- `npm test` is partially green: 3 suites / 29 tests pass, but `tests/ingestionManager.test.js` fails because Jest loads `lib/supabase/serverClient.js` as CJS while the helper uses ESM imports

### Recommended Next Step
- Stabilize the lint/build/test baseline in a dedicated compatibility pass before continuing additional Phase 9 UI work

### Lint Cleanup Roadmap
- Defer repo-wide lint cleanup until after active Phase 9 feature work unless a touched file needs immediate cleanup
- Fix lint debt in slices instead of repo-wide all at once
- Recommended order:
  - `app/api/admin/**`
  - remaining active `app/api/**` routes
  - actively used `components/**`
  - `lib/supabase/**`
  - `lib/ingestion/**/*.ts`
  - `lib/ingestion/**/*.js` last
- Prioritize mechanical fixes first:
  - unused variables
  - `prefer-const`
  - empty interfaces
  - rename intentionally unused params to `_param`
- Handle `any` replacements after the easy wins using narrow inline types, interfaces, or `unknown`
- Treat legacy CommonJS ingestion files as a separate policy decision: either migrate them to ESM or relax lint rules for explicitly legacy paths
- Keep lint-only cleanup commits separate from V1 feature commits

## 2026-04-09 Navigation Normalization Update (10:21 EDT)

### Completed
- Normalized the oversized dropdown/menu ideation into canonical V1 navigation docs
- Added:
  - `brewdocs/v1/navigation/dropdown-menu-normalized.md`
  - `brewdocs/v1/navigation/dropdown-screen-map.md`
  - `brewdocs/v1/navigation/dropdown-execution-plan.md`
- Updated the raw `brewdocs/v1/dropdown-menu-v1.md` to point future work at the canonical normalized docs
- Corrected the dashboard momentum meter so it better matches `brewdocs/v1/mockups/brewlotto_design.png`

### Canonical Route Plan
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
- `/logout` as confirmable action flow

### Approved Execution Order
1. Phase 9B: avatar dropdown identity system
2. Phase 9C: `/my-picks`, `/results`, `/profile`
3. Phase 9D: `/stats`, `/strategy-locker`
4. Phase 9E: `/notifications`, `/settings`, `/billing`, `/learn`, `/legal`

### Guidance
- Build from the normalized navigation docs, not directly from the oversized ideation file
- Keep each new route thin, real, and consistent with the existing dashboard shell

## 2026-04-09 Route Rollout Update (11:14 EDT)

### Completed
- Finished the first high-value dropdown route tranche: `/my-picks`, `/results`, and `/profile`
- Enabled `/profile` from the avatar dropdown alongside the already-live picks/results destinations
- Added a thin real profile surface with:
  - live auth/profile loading
  - editable display name via auth metadata
  - default-state persistence via `user_preferences`
  - truthful security actions only

### Verification
- `npm run build` passes
- `npm test` passes (4 suites, 33 tests)

### Next Step
- Move into Phase 9D by building `/stats` and `/strategy-locker`

## 2026-04-09 Phase 9 Completion Update (12:24 EDT)

### Completed
- Finished Phase 9D by adding:
  - `/stats`
  - `/strategy-locker`
- Finished Phase 9E by adding:
  - `/notifications`
  - `/settings`
  - `/billing`
  - `/learn`
  - `/legal`
- Updated the avatar dropdown so the full normalized destination set now routes to live pages
- Renamed the visible learn destination to `BrewU` while keeping the canonical route at `/learn`

### Data Truthfulness
- `/stats` reads real account-scoped performance data from `play_logs`, `pick_results`, `user_daily_stats`, and user-owned `predictions`
- `/strategy-locker` reads real strategy/tier data from `strategy_registry`, `user_saved_strategies`, `user_strategy_activity`, `user_entitlements`, `subscription_tiers`, and user-owned `predictions`
- `/notifications` reads and updates `notification_preferences` and `user_notifications`
- `/settings` reads and updates `user_settings`
- `/billing` reads `user_entitlements`, `subscription_tiers`, and `feature_entitlements`
- `/learn` and `/legal` are thin truthful support surfaces without fake backend dependencies

### Verification
- `npm run build` passes
- `npm test` passes (4 suites, 33 tests)

### Current Navigation State
- Live normalized dropdown destinations:
  - `/profile`
  - `/my-picks`
  - `/results`
  - `/stats`
  - `/strategy-locker`
  - `/notifications`
  - `/settings`
  - `/billing`
  - `/learn` as `BrewU`
  - `/legal`
  - `/logout`

### Next Step
- Decide whether the next slice should deepen the new routes, resume BrewCommand/Phase 8 work, or start a focused lint-debt cleanup pass

---

# Migration and PWA Implementation Plan

This document outlines the plan for migrating the BrewLotto application from the Next.js `pages` router to the `app` router, with a focus on implementing PWA functionality and a new UI facelift.

## Phase 1: PWA and UI Facelift Implementation - COMPLETE

1.  **Install `next-pwa`:** COMPLETE
2.  **Configure `next.config.js`:** COMPLETE
3.  **Update `app/layout.tsx`:** COMPLETE
4.  **Create `public/manifest.webmanifest`:** COMPLETE
5.  **Create `public/offline.html`:** COMPLETE
6.  **Add Icons:** COMPLETE
7.  **Create New Components:** COMPLETE
    *   `components/PwaInstall.tsx`
    *   `components/CustomerNavDropdown.tsx`
    *   `components/Header.tsx`
8.  **Update `app/page.tsx`:** COMPLETE
9.  **Update `app/layout.tsx`:** COMPLETE

## Phase 2: Migration of Existing Routes - COMPLETE

1.  **Analyze `pages` directory:** COMPLETE
2.  **Prioritize Routes:** COMPLETE
3.  **Migrate Routes:**
    *   `pages/dashboard.js` to `app/dashboard/page.tsx`: COMPLETE (Note: `RequireAuth` component removed, authentication will need to be handled at a higher level, e.g., `app/dashboard/layout.tsx` or middleware).
    *   `pages/login.js` to `app/login/page.tsx`: COMPLETE
    *   `pages/logout.js` to `app/logout/page.tsx`: COMPLETE
    *   `pages/pricing.jsx` to `app/pricing/page.tsx`: COMPLETE
    *   `pages/pick3.js` to `app/pick3/page.tsx`: COMPLETE
    *   `pages/pick4.js` to `app/pick4/page.tsx`: COMPLETE
    *   `pages/pick5.js` to `app/pick5/page.tsx`: COMPLETE
    *   `pages/mega.js` to `app/mega/page.tsx`: COMPLETE
    *   `pages/powerball.js` to `app/powerball/page.tsx`: COMPLETE
4.  **API Routes:**
    *   `pages/api/play/log.js` to `app/api/play/log/route.ts`: COMPLETE
    *   `pages/api/predict/[game].js` to `app/api/predict/[game]/route.ts`: COMPLETE
    *   `pages/api/stats/[game].js` to `app/api/stats/[game]/route.ts`: COMPLETE
    *   `pages/api/predict.js` to `app/api/predict/route.ts`: COMPLETE (Note: Potential compatibility issue with `getSupabaseServerClient` and `Request`/`NextResponse` objects.)
    *   `pages/api/predictions.js` to `app/api/predictions/route.ts`: COMPLETE
    *   `pages/api/audit.js` to `app/api/audit/route.ts`: COMPLETE
    *   `pages/api/brew-ai.js` to `app/api/brew-ai/route.ts`: COMPLETE
    *   `pages/api/annotate-pick.js` to `app/api/annotate-pick/route.ts`: COMPLETE
    *   `pages/api/fix-file.js` to `app/api/fix-file/route.ts`: COMPLETE
    *   `pages/api/generate-merge-report.js` to `app/api/generate-merge-report/route.ts`: COMPLETE (Note: Dynamic import of CJS module might require specific Node.js configurations or a wrapper.)
    *   `pages/api/ledger.js` to `app/api/ledger/route.ts`: COMPLETE
    *   `pages/api/load-file.js` to `app/api/load-file/route.ts`: COMPLETE
    *   `pages/api/refresh.js` to `app/api/refresh/route.ts`: COMPLETE
    *   `pages/api/save-file.js` to `app/api/save-file/route.ts`: COMPLETE
    *   `pages/api/scan.js` to `app/api/scan/route.ts`: COMPLETE
    *   `pages/api/suggest-fix.js` to `app/api/suggest-fix/route.ts`: COMPLETE

## Phase 3: Cleanup and Finalization - IN PROGRESS

1.  **Remove `pages` directory:** COMPLETE
2.  **Testing:** RESOLVED - New UI facelift applied.
3.  **Update Documentation:** Update the project documentation to reflect the new `app` router structure.

## Current Development Tasks - IN PROGRESS

*   [Implement BrewLotto Navigation Engine](tasks/feature_updates/implement_brewlotto_nav_engine.md) - Testing Required - Error

## Current Status: UI Facelift Complete

The new UI facelift has been successfully applied and verified. The Tailwind CSS configuration has been corrected, and the cosmic theme with glowing elements is now displaying as expected.

**Next Steps:**
1.  Wiring strategies into the frontend.
2.  Gating the app for MVP.
3.  Wiring in all the buttons.

## Questions for You

*   I will create placeholder icons for now. Do you have specific designs or assets for the PWA icons?
