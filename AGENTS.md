# AGENTS.md (BrewLotto V1)

## V1 Production Deployment (2026-04-11 ET)

### Deployment Status
- Deployment Target: Vercel (preview mode, custom domain removed until V1 launch)
- Production URL: brewlotto.vercel.app (preview)
- Deployment Branch: main (production source of truth)
- Build Configuration: ESLint disabled for V1 launch (no-unused-vars off)
- Sentry: Configured (DSN added to Vercel env vars)
- Google Cloud: Ingestion deployed to Cloud Run + 7 Scheduler jobs active

### Required Environment Variables (Vercel)
Set these in Vercel project Settings → Environment Variables:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_APP_URL (production URL, e.g., https://brewlotto.app)
- BREWCOMMAND_ADMIN_EMAILS (comma-separated admin emails)
- BREWCOMMAND_ADMIN_SECRET (secure random value)
- SENTRY_DSN (optional, for error monitoring)
- NEXT_PUBLIC_SENTRY_DSN (optional)

### Git Branch Strategy
- main = V1 production truth (only push approved/ready code)
- brew2-overhaul = active development branch
- Vercel Production Branch set to main
- Do NOT merge incomplete/wip code directly to main

### Post-Deploy Validation
After successful build, manually verify:
1. https://brewlotto.app/ → loads without error
2. https://brewlotto.app/dashboard → loads without error
3. https://brewlotto.app/results → loads without error
4. https://brewlotto.app/api/health → returns 200 with health status

## Build/Lint/Test Commands

**Development**
```bash
npm run dev
```

**Build**
```bash
npm run build
```
Starts the Next.js build process.

**Linting**
```bash
npm run lint
```
Runs ESLint using the configured rules in `eslint.config.mjs`.

**Testing**
The project uses Jest for unit testing and Playwright for E2E testing.
To run unit tests:
```bash
npm test
```
To run Playwright E2E tests:
```bash
npx playwright test
```
Check `playwright.config.ts` for test configurations.

**Auditing (Custom)**
The project includes a custom auditing tool `brew-scan.js`.
- Summary: `npm run audit`
- JSON Output: `npm run audit:json`
- Git Hook: `npm run audit:hook`

**Single Test Execution**
To run a single test file:
```bash
npm test path/to/test.file.ts
```

For Playwright:
```bash
npx playwright test path/to/test.spec.ts
```

**Data Fetching & Ingestion**
```bash
# Fetch California data
npm run fetch-ca-data

# Ingest all lottery data into Supabase
npm run ingest-all
```

## Code Style Guidelines

### 1. Imports
- Use absolute imports configured in `tsconfig.json` (e.g., `@/lib/prediction/poisson`).
- Prefer named exports over default exports for better refactoring.
- Group imports: external packages, internal modules (lib/, utils/, hooks/), styles, then types.

### 2. Formatting
- The project uses Prettier (likely via ESLint integration).
- Use double quotes for strings in TypeScript/JSX unless embedding quotes.
- 2-space indentation.
- Trailing commas in multi-line objects/arrays.

### 3. Types (TypeScript)
- Strict mode is enabled (`"strict": true` in `tsconfig.json`).
- Define interfaces for component props, API responses, and database entities.
- Avoid `any`; use unknown or specific types.
- Utility types (e.g., `Pick`, `Omit`, `Record`) should be used where appropriate.
- Use branded types for IDs (e.g., type UserID = string & { __brand: 'user' }).

### 4. Naming Conventions
- **Components**: PascalCase (e.g., `GameStrategySelector`).
- **Hooks**: use camelCase, prefixed with `use` (e.g., `useUserProfile`).
- **Variables/Functions**: camelCase.
- **Constants**: UPPER_SNAKE_CASE.
- **Files**: kebab-case or PascalCase for components, camelCase for utilities.
- **Database tables**: snake_case (e.g., `game_draws`, `user_predictions`).

### 5. Error Handling
- Use `try/catch` blocks for async operations.
- Log errors to console or external service with context.
- Graceful fallbacks in UI (e.g., loading states, error messages, stale data indicators).
- Use Zod for schema validation at API boundaries.

### 6. React/Next.js Specifics
- Use `'use client'` directive for client components in App Router.
- Prefer `fetch` API over external libraries like `axios` unless necessary.
- Server Components: Keep data fetching logic in Server Components where possible.
- Use React Query (tanstack-query) for server state management.
- Implement proper error boundaries and suspense fallbacks.

### 7. Tailwind CSS
- Use utility classes directly in JSX.
- Extend theme in `tailwind.config.ts`.
- Avoid inline styles unless dynamic.
- Use CSS variables for theme colors when possible.

## Project Specifics (V1 Architecture)

### Directory Structure (V1)
- `/app/` — Next.js App Router routes and pages
- `/components/brewlotto/` — BrewLotto-specific UI components
- `/lib/` — Core libraries organized by domain:
  - `/lib/prediction/` — Strategy engine modules (poisson, momentum, etc.)
  - `/lib/ingestion/` — Data source adapters and parsers
  - `/lib/brewtruth/` — Governance and audit validation layer
  - `/lib/billing/` — Stripe integration and entitlement management
  - `/lib/notifications/` — Notification service
  - `/lib/gamification/` — Badges, streaks, and progression systems
  - `/lib/brewwu/` — Education stubs and lightweight BrewUniversity integration
  - `/lib/admin/` — BrewCommand V1 services (ingestion monitor, audit viewer, etc.)
- `/utils/` — Shared utility functions and type helpers
- `/hooks/` — Custom React hooks for state management and logic
- `/types/` — Shared TypeScript interfaces and contracts
- `/scripts/` — Build, deployment, and utility scripts
- `/supabase/` — Database schema and migration files
- `/brewdocs/` — Canonical project documentation (V1 specs)
  - `/brewdocs/v1/` — V1 specification documents
  - `/brewdocs/v1/brewlotto_v1/` — Detailed V1 implementation specifications
- `/public/` — Static assets (icons, manifests, etc.)

### Data Storage
- **Data Directory**: `/home/brewexec/brewlotto/data/`
- **Directory Structure**:
  ```
  data/
  ├── ca/                      # California historical data
  │   ├── ca-daily3.csv        # Daily 3 (2 draws/day)
  │   ├── ca-daily4.csv        # Daily 4 (1 draw/day)
  │   └── ca-fantasy5.csv      # Fantasy 5 (1 draw/day)
  ├── nc/                      # North Carolina historical data
  │   ├── nc-pick3.csv         # Pick 3 (2 draws/day)
  │   ├── nc-pick4.csv         # Pick 4 (2 draws/day)
  │   └── nc-cash5.csv         # Cash 5 (1 draw/day)
  └── multi-state/
      ├── powerball.csv        # Powerball (multi-state, Mon/Wed/Sat)
      └── mega-millions.csv    # Mega Millions (multi-state, Tue/Fri)
  ```

### Data Fetching Scripts
- **CA Daily 3/Daily 4**: `scripts/scrapeCA_Data.js` (uses lotteryextreme.com)
  - Command: `node scripts/scrapeCA_Data.js [daily3|daily4|both] [max_draws]`
  - Default: Scrapes last 5000 draws for both games
- **CA Fantasy 5**: `scripts/fetchCAData.js` (uses lotto-8.com)
  - Command: `node scripts/fetchCAData.js`
- **NC Games**: `scripts/scrapeNC_*.js` (uses nclottery.com)
- **Powerball**: `scripts/scrapePowerball.js` (uses NCEL as fallback)
- **Mega Millions**: `scripts/scrapeMega.js` (uses NCEL as fallback)
- **Multi-State Adapters**: `lib/ingestion/adapters/multiState*.ts` (ingest into Supabase)
- **Documentation Directory**: `/home/brewexec/brewlotto/brewdocs/`
- **Documentation Structure**:
  ```
  brewdocs/
  └── v1/
      ├── Brewlotto_v1.md          # Main V1 specification
      ├── current_state.md         # Current progress tracking
      ├── dashboard.md             # Dashboard specifications
      ├── data-sources.md          # Data source references
      ├── fetchdata.md             # Data fetching strategies
      ├── future_growth.md         # State expansion plans
      └── brewlotto_v1/            # Detailed V1 implementation specs
          ├── BrewLotto_Gamification_System_Spec.md
          ├── BrewLotto_Data_Source_Matrix.md
          └── BrewLotto_NemoTron_Ingestion_Task_Order.md
  ```

### Environment Variables
- Use `.env.local` for local development.
- Required variables:
  - `SUPABASE_URL` - Supabase project URL
  - `SUPABASE_ANON_KEY` - Supabase anon key for client
  - `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key for server operations
  - `STRIPE_SECRET_KEY` - Stripe secret key
  - `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
  - `NEXT_PUBLIC_APP_URL` - Public URL for the application

### Supabase
- The project uses Supabase for database and authentication.
- RLS (Row Level Security) is enabled on all tables.
- Use the Supabase server client from `lib/supabase/serverClient.js` for server-side operations.
- Use the Supabase browser client from `lib/supabase/browserClient.js` for client-side operations.

### V1 Architecture Layers

#### 1. Experience Layer
- Next.js App Router UI with Tailwind CSS
- Responsive dashboard with game tabs and cards
- Authentication, onboarding, pricing, and profile pages
- Prediction generation flow with explainable outputs
- My picks, play history, and stats tracking
- Notifications center and BrewUniversity Lite lessons
- Admin/BrewCommand Lite console

#### 2. Application/API Layer
- RESTful API routes under `/app/api/`
- Auth and user profile management
- Game metadata and configuration endpoints
- Draw data access and historical retrieval
- Prediction request handling and response formatting
- Play logging and settlement endpoints
- Gamification and badge management APIs
- Notification delivery and preference APIs
- Billing webhook handlers and subscription management
- Admin operations and health check endpoints
- Education content APIs for BrewUniversity Lite

#### 3. Prediction & Intelligence Layer (Core)
- Deterministic strategy execution (Poisson, Momentum, Markov, Ensemble)
- Feature extraction from draw data (hot/cold, overdue, sums, etc.)
- Strategy scoring and ensemble ranking
- BrewTruth validation and governance layer
- Explanation generation and confidence framing
- Entitlement and tier-based feature gating
- ML-assisted scoring (optional, tier-dependent)
- LLM-assisted commentary (cached, restricted by tier)

#### 4. Data Ingestion Layer
- Scheduler-based fetching of official lottery data
- State/game-specific parser adapters and normalizers
- Validation, deduplication, and idempotency checks
- Persistence write operations to Supabase
- Event triggering for downstream processes (notifications, insights)
- Health monitoring and freshness status reporting
- Anomaly detection and retry logic

#### 5. Persistence Layer
- Supabase/PostgreSQL as system of record
- Normalized tables for draws, users, predictions, etc.
- Denormalized summary views for performance-critical queries
- Audit fields on all critical entity tables
- Row Level Security policies enforced
- Service-role restricted writes for ingestion and admin operations

#### 6. Operations & Governance Layer
- BrewTruth as first-class governance service (validation, audit, compliance)
- Observability: API error logging, ingestion timings, prediction performance
- Feature flags for controlled rollouts and experimentation
- Admin dashboard for ingestion health, prediction audits, and subscription management
- Automated health checks and failure detection
- Release QA and deployment validation processes

#### 7. Future Expansion Layer
- Config-driven game model for easy state expansion
- Parser adapter pattern for new data sources
- Capability metadata in game configurations
- Stable interfaces that won't break with new state additions

### V1 Success Principles
1. **Truth Over Hype** - No guaranteed win claims, transparent about odds
2. **Explainability First** - Every premium pick includes strategy, reasoning, and evidence
3. **Stable Before Clever** - Reject features that introduce instability or unclear value
4. **Education Is Core** - Improve player literacy, not just generate picks
5. **Cost Discipline** - AI/ML features gated, cached, or delayed until proven value
6. **Premium Feel, Lean Core** - World-class UI with modular, practical backend

## Custom Tools (V1)

### BrewScan
A custom auditing tool located at `brew-scan.js`.
- Analyzes code complexity, usage patterns, and potential bottlenecks
- Blocks commits if high complexity is detected (configurable via `.brew-auditrc.json`)
- Run `npm run audit` to check current state
- Provides JSON snapshot and Git hook integration

### Init Script
`./docs/init.sh` scaffolds new game/strategy modules following V1 conventions.
Usage: `chmod +x ./docs/init.sh && ./docs/init.sh`

### Database Migration Tool
Custom Supabase migration runner for V1 schema updates.
Located in `scripts/runMigrations.js`
Usage: `node scripts/runMigrations.js`

### Data Validation Suite
Validation tools for ingestion pipeline integrity.
Located in `scripts/validateDrawData.js`
Usage: `node scripts/validateDrawData.js [state] [game]`

## Git Hooks
The project uses Husky for git hooks.
- `pre-commit`: Runs linting, type checking, and BrewScan audit
- `pre-push`: Runs test suite before allowing push to remote
- `commit-msg`: Enforces conventional commit format
- Note: All hooks are active and configured for V1 quality standards

## V1 Implementation Order (STRICT)
Following the NemoTron Super Execution Brief, development must proceed in this exact order:

**Phase 1 — Repository Foundation**
Create the project structure as defined in the V1 specification

**Phase 2 — Database Schema**
Create database tables for games, draws, predictions, strategy_metrics, and user_predictions

**Phase 3 — Data Ingestion Engine**
Build the ingestion pipeline to fetch, normalize, and store historical draw data

**Phase 4 — Prediction Engine**
Implement the statistical core with Poisson, Momentum, Markov, and Ensemble strategies

**Phase 5 — Prediction Storage**
Store generated predictions with full explainability metadata

**Phase 6 — API Layer**
Expose predictions through RESTful endpoints with caching and pagination

**Phase 7 — Dashboard UI**
Create the customer dashboard with game selector, prediction panel, and analysis views

**Phase 8 — BrewCommand Admin**
Build internal monitoring for strategy performance, prediction logs, and data health

**Phase 9 — AI Commentary Layer**
Add LLM-generated explanations (never for direct pick generation)

**Phase 10 — Billing + Premium Features**
Implement Stripe subscriptions and tier-gated feature access

## Supported Lottery Games (V1 Launch)
Initial implementation must support:

- **Pick 3** (3 digits, 0-9) — NC, CA
- **Pick 4** (4 digits, 0-9) — NC, CA
- **Cash 5** (5 numbers, 1-39/43) — NC (Cash 5), CA (Fantasy 5)
- **Powerball** (5 + Powerball, 1-69 + 1-26) — Multi-State
- **MegaMillions** (5 + MegaBall, 1-70 + 1-25) — Multi-State

Launch states: North Carolina (NC) and California (CA) only.

## Data Sources

### California Lottery Data
- **Official API**: https://www.calottery.com/api/
- **Historical CSV**: Available at lotto-8.com
- **Games**: Daily 3 (Pick 3), Daily 4 (Pick 4), Fantasy 5 (Cash 5)

### North Carolina Lottery Data
- **Official API**: https://nclottery.com/api/
- **Historical CSV**: Available in /data/nc/
- **Games**: Pick 3, Pick 4, Cash 5

### Multi-State Games
- **Powerball & Mega Millions**: https://www.powerball.com/ & https://www.megamillions.com/

## Testing Requirements (V1)
Required test coverage:
- **Prediction Accuracy Tests** - Validate strategy outputs against historical data
- **Data Integrity Tests** - Ensure ingestion accuracy and completeness
- **API Tests** - Validate endpoints, authentication, and error handling
- **UI Tests** - Ensure dashboard stability and component functionality
- **Audit Tests** - Verify BrewTruth validation and compliance checks

All tests must be written alongside features and maintain >80% coverage.

## V1 Success Criteria
The system is considered complete when:
✔ Historical draw data loads correctly for NC and CA games
✔ Prediction engine generates picks with reproducible statistical logic
✔ Dashboard displays predictions with explainable reasoning
✔ Strategies produce auditable reasoning and evidence trails
✔ Admin panel shows ingestion health, prediction metrics, and audit logs
✔ Billing system processes subscriptions and updates entitlements correctly
✔ All custom tools (brew-scan, init script, migrations) function as specified

---

## V1 Progress Tracker

**Last Updated:** 2026-05-01 ET (15:45 EDT - NC adapter schema fixed, all 8/8 scrapers now insert into canonical official_draws)

### Phase Status

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| D1 | Shared Ingestion Foundation | ✅ Complete | fetcher, parser, normalizer, validator, sourceRegistry |
| D2 | Canonical Schema | ✅ Complete | Schema already in supabase/migrations |
| D3 | NC Official Ingestors | ✅ Complete | NC CSV data ready in /data/nc |
| D4 | NC Backfill Runner | ✅ Complete | V1 adapters verified working - inserts into official_draws with correct schema (2026-05-01) |
| D5 | Scheduler Layer | ✅ Complete | Daily scheduler with node-cron |
| D6 | CA Official Latest Parsers | ✅ Complete | CA scraper working (50 draws per run, optimized from 1000) |
| D7 | CA Historical Adapters | ✅ Complete | Multi-state adapters, unified job, health monitor |
| D8 | Cross-Source Validation | ✅ Complete | Alert system tables created (system_alerts, alert_events, alert_deliveries), pipeline validated |
| D9 | Source Registry Config | ✅ Complete | sourceRegistry.ts created |
| D10 | Admin Monitoring Hooks | ✅ Complete | Health monitor implemented |
| D11 | Prediction Trigger | ✅ Complete | Prediction scheduler and generator created for all games |
| D12 | Testing Layer | ✅ Complete | Jest tests created for alerts, data integrity, and prediction generation (33 tests) |
| 7 | Dashboard UI | ✅ Complete | Premium dashboard implemented with mobile-first design, dynamic ball sizes, custom scrollbar, and phone-like layout |
| 8 | BrewCommand Admin | ✅ Complete | `/admin` added, alert console live, ingestion health panel live, remote admin views/RPCs restored |
| 8.1 | Database Security Hardening | ✅ Complete | Security invoker set on user views, RLS enabled on alert tables |
| 8.2 | Freshness Backfill | ✅ Complete | `draw_freshness_status` backfilled, ingestion health populated |
| 8.3 | Duplicate Game Reconciliation | ✅ Complete | Empty placeholder rows deactivated, freshness cleaned |
| 9 | Dashboard UI Phase 9 | ✅ Complete | All dropdown destinations, dashboard shell, live data integration |
| 9A | Dashboard Truthfulness | ✅ Complete | Commentary, stats, freshness live; mock data removed |
| 9B | Avatar Dropdown | ✅ Complete | Normalized IA, grouped sections, routing complete |
| 9C | My Picks/Results/Profile | ✅ Complete | Live prediction management, draw recap, identity surfaces |
| 9D | Stats/Strategy Locker | ✅ Complete | Account performance and premium strategy surfaces |
| 9E | Notifications/Settings/Billing/Learn/Legal | ✅ Complete | All V1 destination routes live |
| 10 | Cloud Infrastructure | ✅ Complete | Cloud Run + 7 Scheduler jobs deployed, Sentry configured |
| 11 | Vercel Production Deploy | ✅ Complete | Build fixed, lint disabled, Sentry DSN added, preview mode active |
| 12 | Shared UI/UX Framework | 🔄 In Progress | `shared-ui-ux-framework.md` created, implementation pending |

### Data Collection Status

| Game | State | Records | Date Range | Status |
|------|-------|---------|------------|--------|
| Pick 3 | NC | ~13,600 | Historical | ✅ In Database (adapter verified) |
| Pick 4 | NC | ~11,700 | Historical | ✅ In Database (adapter verified) |
| Cash 5 | NC | ~8,900 | Historical | ✅ In Database (adapter verified) |
| Daily 3 | CA | ~200 | 2025-12-07 to 2026-03-16 | ✅ Validated |
| Daily 4 | CA | ~200 | 2025-08-29 to 2026-03-16 | ✅ Validated |
| Fantasy 5 | CA | ~97 | Dec 2025 - Mar 2026 | ✅ Validated (3 months historical) |
| Powerball | NC/CA | ~10,000 | Historical | ✅ In Database |
| Mega Millions | NC/CA | ~2,700 | Historical | ✅ In Database |

**Total Records in Database:** ~47,397

### V1 Destination Status (Per Shared Framework)

| Destination | Status | Data Source | Framework Components |
|-------------|--------|-------------|----------------------|
| `/my-picks` | ✅ Live | API: `/api/predictions` | DashboardContainer, Header, NavigationTabs, LotteryBall |
| `/results` | ✅ Live | API: `/api/results` | DashboardContainer, Header, NavigationTabs, GameTabs |
| `/stats` | ✅ Live | Direct Supabase | DashboardContainer, Header, NavigationTabs, StatCard |
| `/strategy-locker` | ✅ Live | Direct Supabase | DashboardContainer, Header, NavigationTabs, SectionCard |
| `/profile` | ✅ Live | Auth + `user_profiles` | DashboardContainer, Header, NavigationTabs, DetailRow |
| `/notifications` | 🔄 Partial | `notification_preferences` | UI done, delivery pending |
| `/settings` | 🔄 Partial | `user_settings` | UI done, theme not applied |
| `/billing` | 🔄 Partial | `user_entitlements` | UI done, Stripe pending |
| `/learn` | ❌ Shell | Hardcoded array | Needs CMS integration |
| `/legal` | ❌ Shell | Hardcoded summaries | Needs real policy docs |
| `/logout` | ✅ Live | Supabase Auth | Minimal (auto-signOut) |

### Next Logical Steps (After Testing Current Deployment)

**IMMEDIATE (V1 Launch Prep):**
1. **Test Deployed Services**
   - Verify Vercel preview URL loads: `brewlotto.vercel.app`
   - Test Cloud Run ingestion: `curl https://brewlotto-ingestion-119469099721.us-central1.run.app`
   - Confirm Sentry receiving errors in dashboard

2. **Set Production Branch** (when ready for V1 launch)
   - Vercel Dashboard → Settings → Git → Production Branch: `brewlotto-v1`
   - Keep `main` or `brew2-overhaul` for preview/testing
   - Re-add custom domain `brewlotto.app`

3. **Complete V1 Success Criteria Validation**
   - ✅ Historical draw data loads correctly for NC and CA games
   - ✅ Prediction engine generates picks with reproducible statistical logic
   - ✅ Dashboard displays predictions with explainable reasoning
   - ✅ Strategies produce auditable reasoning and evidence trails
   - 🔄 Admin panel shows ingestion health, prediction metrics, and audit logs (test now)
   - 🔄 Billing system processes subscriptions and updates entitlements correctly
   - ✅ All custom tools (brew-scan, init script, migrations) function as specified

**POST-LAUNCH (V1.1/P1):**
1. **Fix Lint Debt** (tracked in AGENTS.md lint section)
   - Fix unused vars in `lib/strategies/*.js`, `lib/stats/*.js`, etc.
   - Re-enable ESLint in `eslint.config.mjs`
   - Remove `--ignore-during-builds` from `next.config.ts`

2. **Expand CA Historical Data**
   - Current: ~200 draws for Daily 3/4, ~97 for Fantasy 5
   - Target: 1000+ draws for better prediction accuracy
   - Use `node scripts/scrapeCA_Data.js both 1000`

3. **Stripe Billing Integration** 🔄 CRITICAL FOR LAUNCH
   - Currently placeholder pages exist at `/billing`
   - Wire up Stripe subscriptions for premium tiers
   - Implement `user_entitlements` logic
   - **Reference:** `brewdocs/v1/shared-ui-ux-framework.md` Section 3.8

4. **E2E Testing with Playwright**
   - Current: 33 Jest unit tests
   - Add Playwright E2E tests for critical paths (dashboard, predictions, auth)
   - Target: >80% coverage per V1 spec

5. **Implement Shared Framework Components**
   - Create `LoadingSkeleton.tsx` (Section 1.2)
   - Create `ErrorBoundary.tsx` (Section 1.2)
   - Migrate direct Supabase pages to API routes
   - **Reference:** `brewdocs/v1/shared-ui-ux-framework.md`

6. **Add Real Content**
   - `/learn`: Create `brewu_lessons` table, add lesson content
   - `/legal`: Add full Terms, Privacy, Responsible Use policies
   - **Reference:** `brewdocs/v1/shared-ui-ux-framework.md` Sections 3.9-3.10

### 2026-04-08 Progress Update

#### ✅ Completed Today
- Fixed live Supabase security warnings for `security_definer_view` and `rls_disabled_in_public`
- Added `supabase/migrations/20260408120000_fix_security_lints.sql`
- Consolidated the duplicated dashboard entrypoint so `/` now reuses the canonical App Router dashboard
- Added App Router BrewCommand page at `/admin`
- Added admin alerts console wired to existing alert APIs
- Added admin ingestion health API at `app/api/admin/ingestion-health/route.ts`
- Restored missing live BrewCommand database objects:
  - `public.v_brewcommand_alert_center`
  - `public.v_ingestion_health_summary`
  - `public.raise_system_alert(...)`
  - `public.acknowledge_system_alert(...)`
  - `public.resolve_system_alert(...)`
  - `public.escalate_system_alert(...)`
- Added `supabase/migrations/20260408133000_restore_brewcommand_admin_views.sql`
- Added `supabase/migrations/20260408143000_backfill_draw_freshness_status.sql`
- Backfilled live `draw_freshness_status` so BrewCommand health is no longer blank

#### 🔎 Current Findings
- The live project contains duplicate `lottery_games` rows for several NC and CA games
- The canonical rows are the ones with linked `official_draws` history
- The duplicate placeholder rows currently have:
  - `official_draws_count = 0`
  - `draw_sources_count = 0`
  - `ingestion_runs_count = 0`
  - `prediction_requests_count = 0`
  - `alert_events_count = 0`
  - only a freshness row created by the new backfill

#### ✅ Duplicate Game Cleanup Completed
- Deactivated 10 empty duplicate `lottery_games` placeholder rows in the live project
- Removed freshness rows tied only to those placeholders
- Refreshed `draw_freshness_status`
- Verified `v_ingestion_health_summary` now shows one active canonical row per game/state instead of duplicate healthy/failed entries

#### ✅ Phase 9 Commentary Pass Started
- Dashboard `PredictionCard` now loads real stored explanation text instead of hardcoded mock insights
- Added `GET /api/dashboard/commentary` for dashboard-safe commentary retrieval
- `Generate My Smart Pick` now calls `POST /api/predictions`
- The dashboard now shows the latest generated pick numbers plus strategy/confidence metadata when a stored prediction exists
- `StatsGrid` now reads live hot/cold/momentum data from recent `official_draws` through `GET /api/dashboard/stats`
- The dashboard now exposes live stale-data messaging through `GET /api/dashboard/freshness`
- Dashboard tab data selection is now tightened to canonical source games instead of blended NC/CA families
- `VoiceModeCard` now uses browser speech synthesis to narrate the live Brew summary when supported

#### ⏭️ Next Action
- Continue Phase 9 by replacing any remaining placeholder dashboard utilities with live feature data and tightening any remaining per-game dashboard behavior

### 2026-04-08 Late Progress Update (22:37 EDT)

#### ✅ Recent Commits Landed
- `8ecd68d` `feat(dashboard): add V1 dashboard shell and PWA assets`
- `910d577` `docs(v1): add UI architecture docs and supporting shared components`
- `f456919` `chore(repo): ignore local artifacts and untrack logs`

#### ✅ Repo Hygiene Completed
- Grouped the remaining V1 dashboard work into clean commit boundaries instead of mixing it with legacy leftovers
- Added the canonical dashboard shell component set under `components/brewlotto/dashboard/`
- Added committed public app assets used by the V1 dashboard and PWA surface
- Added supporting shared UI files used by current routes (`components/landing/PricingTierCard.jsx`, `components/user/MatchScoreBadge.jsx`)
- Added `lib/supabase/serverClient.d.ts` to document the existing Supabase server helper exports
- Expanded `.gitignore` for local/export artifacts and stopped tracking noisy `logs/pick3_4_day.log` and `logs/pick3_4_evening.log`

#### 🧪 Verification Snapshot
- `npm run lint` fails on pre-existing repo-wide ESLint debt outside the new dashboard commit group
- `npm run build` fails on unresolved legacy/module-path issues:
  - `app/api/stats/[game]/route.ts` -> missing `utils/fetchStats`
  - `app/api/suggest-fix/route.ts` -> missing `@/lib/audit/entropyTools`
  - `components/index.js` -> missing legacy component exports such as `./NavBar`, `./dashboard/UserStatsCard`, `./user/MyPicksCard`
- `npm test` is partially green: 3 suites pass and 29 tests pass, but `tests/ingestionManager.test.js` fails because Jest loads `lib/supabase/serverClient.js` as CJS even though it uses ESM imports

#### 🔜 Recommended Next Step
- Fix the outstanding lint/build/test baseline separately from the new dashboard work so Phase 9 UI progress stays isolated from legacy compatibility cleanup

#### 🧹 Lint Cleanup Plan
- `build` and `test` baseline are now restored; remaining lint failures are tracked as repo-wide follow-up debt
- Clean lint in focused tranches instead of repo-wide all at once
- Recommended order:
  - `app/api/admin/**`
  - remaining active `app/api/**`
  - active `components/**`
  - `lib/supabase/**`
  - `lib/ingestion/**/*.ts`
  - `lib/ingestion/**/*.js` last
- Do mechanical fixes first (`no-unused-vars`, `prefer-const`, empty interfaces, ignored params), then narrow `any` replacements
- Decide separately whether legacy CommonJS ingestion paths should be migrated or lint-relaxed

### 2026-04-09 Implementation Direction (10:21 EDT)

#### ✅ Phase 9A Dashboard Truthfulness Progress
- Dashboard commentary now distinguishes between no stored prediction, stored pick without explanation, and ready explanation states
- Dashboard stats no longer fall back to fake hardcoded values; empty live-data states are now explicit
- Utility pills and top navigation were tightened so the dashboard only presents real routes/interactions
- The momentum meter was corrected against `brewdocs/v1/mockups/brewlotto_design.png` and now uses the taller illuminated vertical tube language from the reference

#### ✅ Dropdown IA Normalized
- Raw ideation remains in `brewdocs/v1/dropdown-menu-v1.md`
- Canonical V1 dropdown/navigation docs now live in:
  - `brewdocs/v1/navigation/dropdown-menu-normalized.md`
  - `brewdocs/v1/navigation/dropdown-screen-map.md`
  - `brewdocs/v1/navigation/dropdown-execution-plan.md`

#### 🧭 Canonical V1 Dropdown Destinations
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
- `/logout` as a confirmed action flow

#### 🔜 Approved Build Direction
- Phase 9A: finish dashboard shell truthfulness and mockup alignment without adding fake destinations
- Phase 9B: build the avatar dropdown identity system
  - grouped sections
  - improved profile header
  - clickable state selector pill styling
  - anchor triangle / connected dropdown feel
  - route model based on normalized IA
- Phase 9C: build first three high-value destination surfaces in this order:
  - `/my-picks`
  - `/results`
  - `/profile`
- Phase 9D: build `/stats` and `/strategy-locker`
- Phase 9E: build `/notifications`, `/settings`, `/billing`, `/learn`, `/legal`

### 2026-04-09 Route Rollout Update (11:14 EDT)

#### ✅ Phase 9B Completed
- `AvatarDropdown` now uses the normalized grouped IA with real routing for `/my-picks`, `/results`, `/profile`, and confirmable `/logout`

#### ✅ Phase 9C Completed For First Three Routes
- Added `/my-picks` as a live prediction management surface
- Added `/results` as a live latest-draw and closest-match recap surface
- Added `/profile` as a thin real identity/preferences surface
  - live auth/profile loading
  - display-name editing through auth metadata
  - default-state persistence through `user_preferences`
  - truthful security actions without fake password controls

#### 🧪 Verification
- `npm run build` ✅
- `npm test` ✅ (4 suites, 33 tests)

#### ✅ Phase 9D Completed
- Added `/stats` as a live account performance surface backed by `play_logs`, `pick_results`, `user_daily_stats`, and user-owned `predictions`
- Added `/strategy-locker` as a live premium strategy surface backed by `strategy_registry`, `user_saved_strategies`, `user_strategy_activity`, `user_entitlements`, `subscription_tiers`, and user-owned `predictions`

#### ✅ Phase 9E Completed
- Added `/notifications` backed by `notification_preferences` and `user_notifications`
- Added `/settings` backed by `user_settings`
- Added `/billing` as an authenticated entitlement summary backed by `user_entitlements`, `subscription_tiers`, and `feature_entitlements`
- Added `/learn` as the live BrewUniversity Lite surface, visibly labeled `BrewU` in the dropdown
- Added `/legal` as a truthful V1 legal index without dead placeholder links

#### ✅ Current Destination Status
- `AvatarDropdown` now routes to every normalized V1 destination:
  - `/my-picks`
  - `/results`
  - `/profile`
  - `/stats`
  - `/strategy-locker`
  - `/notifications`
  - `/settings`
  - `/billing`
  - `/learn` labeled as `BrewU`
  - `/legal`
  - confirmable `/logout`

#### 🧪 Verification
- `npm run build` ✅
- `npm test` ✅ (4 suites, 33 tests)

#### 🔜 Next Action
- Update progress documentation and decide whether the next pass should return to Phase 8/BrewCommand polish, expand route depth, or tackle repo lint debt

#### 🛠️ Execution Rules For Any AI Picking This Up
- Treat `brewdocs/v1/navigation/dropdown-menu-normalized.md` as the IA source of truth
- Treat `brewdocs/v1/navigation/dropdown-screen-map.md` as the route-definition source of truth
- Treat `brewdocs/v1/navigation/dropdown-execution-plan.md` as the build-order source of truth
- Do not implement directly from `dropdown-menu-v1.md` without first normalizing against the above docs
- Do not add dead routes or fake interactions to the dashboard shell
- Keep each new destination thin and real, with route/data purpose clearly scoped before expansion

### Ingestion Scripts (Updated 2026-03-18)

```bash
# Scrape CA historical data
node scripts/scrapeCA_Data.js daily3 2000
node scripts/scrapeCA_Data.js daily4 2000

# Scrape multi-state games
node scripts/scrapePowerball.js
node scripts/scrapeMega.js

# Unified ingestion job (with retry logic)
node scripts/ingestionJob.js

# Daily scheduler (runs at 12:00 AM PT)
node scripts/ingestionScheduler.js

# Health monitor
node scripts/ingestionHealth.js

# Alert system check
npm run alerts

# Cross-source validation
npm run validate
```
