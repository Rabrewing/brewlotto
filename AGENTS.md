# AGENTS.md (BrewLotto V1)

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
  │   ├── ca-pick3.csv         # Daily 3 (Pick 3)
  │   ├── ca-pick4.csv         # Daily 4 (Pick 4)
  │   └── ca-fantasy5.csv      # Fantasy 5 (Cash 5 equivalent)
  ├── nc/                      # North Carolina historical data
  │   ├── nc-pick3.csv         # Pick 3
  │   ├── nc-pick4.csv         # Pick 4
  │   └── nc-cash5.csv         # Cash 5
  └── multi-state/
      ├── powerball.csv        # Powerball (multi-state)
      └── mega-millions.csv    # Mega Millions (multi-state)
  ```
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
