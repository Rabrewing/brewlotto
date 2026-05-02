# BrewLotto V1 - Shared UI/UX Framework Specification

**Version:** 1.0  
**Date:** 2026-05-01  
**Status:** Canonical Source of Truth  
**Last Updated:** 2026-05-01 ET (NC adapter schema fixed, all 8/8 ingestion scrapers working)
**Purpose:** Define the shared UI/UX framework for all V1 destinations to ensure seamless transitions and consistent experience.

---

## 1. Architecture Overview

### 1.1 Page Structure Pattern

Every V1 destination follows this hierarchy:

```
app/[route]/page.tsx
  └── DashboardContainer (layout wrapper)
       ├── Header (avatar, title, breadcrumb)
       ├── NavigationTabs (game tabs for game-specific pages)
       └── Page Content
            ├── SectionCard (reusable content block)
            │    ├── SectionHeader (title, badge, action)
            │    └── SectionContent
            ├── StatCard (metric display)
            ├── DetailRow (key-value display)
            └── EmptyState (no-data state)
```

### 1.2 Shared Component Library

| Component | Location | Purpose |
|-----------|----------|---------|
| `DashboardContainer` | `@/components/brewlotto/dashboard/` | Page layout wrapper with consistent padding/background |
| `Header` | `@/components/brewlotto/dashboard/` | Avatar, page title, optional action button |
| `NavigationTabs` | `@/components/brewlotto/dashboard/` | Game selection tabs (Pick 3, Pick 4, etc.) |
| `SectionCard` | `@/components/brewlotto/dashboard/` | Reusable content section with title/action |
| `StatCard` | `@/components/brewlotto/dashboard/` | Metric display (number + label) |
| `DetailRow` | `@/components/brewlotto/dashboard/` | Key-value row display |
| `EmptyState` | `@/components/brewlotto/dashboard/` | No-data/placeholder state |
| `LoadingSkeleton` | `@/components/brewlotto/dashboard/` | Loading placeholder (TODO) |
| `ErrorBoundary` | `@/components/brewlotto/dashboard/` | Error display wrapper (TODO) |

---

## 2. Data Fetching Standards

### 2.1 API Route Pattern (Preferred)

For consistency, all pages should fetch data via API routes:

```typescript
// Page component
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch('/api/[route]?param=value')
    .then(res => res.json())
    .then(data => {
      setData(data);
      setLoading(false);
    });
}, []);
```

### 2.2 Direct Supabase Pattern (Alternative)

For simpler pages, direct Supabase calls are acceptable:

```typescript
const supabase = createClient();
const { data, error } = await supabase
  .from('table')
  .select('*');
```

### 2.3 Standardizing Rule

**New pages MUST use API routes.** Existing pages may keep direct Supabase until refactored.

---

## 3. Page Specifications

### 3.1 `/my-picks` - Prediction Management

**Status:** ✅ Live (Real Data)  
**API:** `GET /api/predictions?limit=24&state=&game=`  
**Components:** LotteryBall, PredictionCard (TODO: use SectionCard)

**Spec:**
- [x] State/game filter bar
- [x] Prediction cards with numbers, strategy, confidence
- [x] Save/Unsave functionality
- [x] Delete predictions
- [x] Summary metrics (saved count, visible picks)
- [ ] Migrate to SectionCard layout
- [ ] Add replay/predict again action

### 3.2 `/results` - Latest Draw + Match Recap

**Status:** ✅ Live (Real Data)  
**API:** `GET /api/results?game=`  

**Spec:**
- [x] Latest official draw display
- [x] Closest prediction match tracking
- [x] Insights from hot/cold analysis
- [x] Freshness gating (stale data warning)
- [ ] Display match history (last 5 draws)
- [ ] Add "Request New Prediction" CTA

### 3.3 `/stats` - Account Performance

**Status:** ✅ Live (Real Data)  
**Data Source:** Direct Supabase (`play_logs`, `pick_results`, `user_daily_stats`)

**Spec:**
- [x] Top-level metrics (settled plays, wins, hit rate)
- [x] Game breakdown section
- [x] Streak & hit-rate trends
- [ ] Migrate to API route pattern
- [ ] Add chart visualizations (Chart.js already installed)
- [ ] Add date range filter

### 3.4 `/strategy-locker` - Premium Strategy Surface

**Status:** ✅ Live (Real Data)  
**Data Source:** Direct Supabase (`strategy_registry`, `user_saved_strategies`)

**Spec:**
- [x] Strategy cards with tier-based access
- [x] Save/unsave to locker
- [x] Plan ladder showing tiers
- [x] Usage statistics per strategy
- [ ] Migrate to API route pattern
- [ ] Add strategy comparison view
- [ ] Add "Run Strategy" action

### 3.5 `/profile` - Identity & Preferences

**Status:** ✅ Live (Real Data)  
**Data Source:** Supabase Auth + `user_profiles`, `user_preferences`

**Spec:**
- [x] Profile hero with avatar
- [x] Edit display name
- [x] Default state preference
- [x] Tier badge display
- [ ] Apply theme selection
- [ ] Add avatar upload
- [ ] Add trial expiry countdown

### 3.6 `/notifications` - Delivery + Preferences

**Status:** 🔄 Partial (Preferences Only)  
**Data Source:** `notification_preferences`, `user_notifications`

**Spec:**
- [x] Delivery channel toggles
- [x] Alert type toggles
- [x] Recent alerts list
- [ ] Wire up actual email delivery (SendGrid/Resend)
- [ ] Wire up push notification delivery
- [ ] Add notification history pagination
- [ ] Add mark-all-read functionality

### 3.7 `/settings` - App Preferences + Theme

**Status:** 🔄 Partial (UI Only)  
**Data Source:** `user_settings`

**Spec:**
- [x] Default state/game selection
- [x] Experience preferences (voice, commentary, etc.)
- [x] Theme selection (dark/light/system)
- [ ] Apply theme selection to actual UI
- [ ] Implement sound effects toggle
- [ ] Add data export/deletion (GDPR)

### 3.8 `/billing` - Stripe Integration + Entitlements

**Status:** 🔄 Partial (Entitlements Only)  
**Data Source:** `user_entitlements`, `subscription_tiers`, `feature_entitlements`

**Spec:**
- [x] Current plan display
- [x] Entitlement summary
- [x] Plan ladder with pricing
- [ ] Integrate Stripe Checkout
- [ ] Add Stripe Customer Portal link
- [ ] Add billing history table
- [ ] Add usage quota display (AI picks remaining)

### 3.9 `/learn` (BrewU) - Real Content from CMS

**Status:** ❌ Static Shell  
**Data Source:** Hardcoded array (needs CMS or markdown files)

**Spec:**
- [ ] Create `brewu_lessons` table in Supabase
- [ ] Add lesson categories (Hot/Cold Numbers, Momentum, Confidence, etc.)
- [ ] Create lesson content (markdown or rich text)
- [ ] Add progress tracking per lesson
- [ ] Add video embedding support
- [ ] Link from dashboard contextual help icons

### 3.10 `/legal` - Real Policy Documents

**Status:** ❌ Static Shell  
**Data Source:** Hardcoded summaries (needs real policy pages)

**Spec:**
- [ ] Create `legal_documents` table or use markdown files
- [ ] Add full Terms of Service
- [ ] Add full Privacy Policy
- [ ] Add Responsible Use Policy
- [ ] Link from footer/settings
- [ ] Add cookie consent banner (GDPR)

### 3.11 `/logout` - Confirm Action

**Status:** ✅ Live (Minimal)  
**Action:** Calls `supabase.auth.signOut()` then redirects to `/login`

**Spec:**
- [x] Auto-triggers on page load
- [x] Redirects to /login
- [ ] Add confirm modal before logout (per dropdown spec)

---

## 4. Navigation & Transitions

### 4.1 Dropdown Menu (AvatarDropdown)

**Location:** `@/components/brewlotto/dashboard/AvatarDropdown.tsx`  
**Spec:**
- [x] Grouped sections (Gameplay, Account, System)
- [x] Profile header with avatar + name
- [x] State selector pill
- [x] Route links match normalized IA
- [ ] Add hover preview for each destination
- [ ] Add keyboard navigation (arrow keys)

### 4.2 Page Transitions

**Goal:** Seamless transitions between all destinations.

**Rules:**
1. **Loading State:** Show `LoadingSkeleton` immediately on route change
2. **Error State:** Show `ErrorBoundary` if data fetch fails
3. **Empty State:** Show `EmptyState` if no data exists
4. **Success State:** Render full content with animations (framer-motion optional)

---

## 5. Success Criteria (Greenlight Per Phase)

### Phase 9C: High-Value Destinations ✅ COMPLETE
- [x] `/my-picks` loads real predictions
- [x] `/results` shows latest draw + matches
- [x] `/profile` displays identity + preferences

### Phase 9D: Analysis & Premium ✅ COMPLETE
- [x] `/stats` shows performance metrics
- [x] `/strategy-locker` shows saved strategies

### Phase 9E: Account & Support 🔄 IN PROGRESS
- [x] `/notifications` preferences work
- [x] `/settings` preferences work
- [x] `/billing` shows entitlements
- [ ] `/learn` has real content
- [ ] `/legal` has real policies

### Phase 10: Billing Integration ❌ NOT STARTED
- [ ] Stripe Checkout integration
- [ ] Subscription management
- [ ] Billing history

---

## 6. Next Actions (Priority Order)

1. **Wire Stripe** to `/billing` (unlocks premium tiers)
2. **Add real content** to `/learn` (BrewU lessons)
3. **Add real policies** to `/legal`
4. **Migrate direct Supabase pages** to API routes
5. **Create LoadingSkeleton + ErrorBoundary** shared components
6. **Add charts** to `/stats` (Chart.js ready)
7. **Add avatar upload** to `/profile`

---

## 7. File Locations (Source of Truth)

| Document | Location |
|-----------|----------|
| This Spec | `brewdocs/v1/shared-ui-ux-framework.md` |
| Dropdown IA | `brewdocs/v1/navigation/dropdown-menu-normalized.md` |
| Screen Map | `brewdocs/v1/navigation/dropdown-screen-map.md` |
| Execution Plan | `brewdocs/v1/navigation/dropdown-execution-plan.md` |
| Current State | `brewdocs/v1/current_state.md` |
| AGENTS.md | `AGENTS.md` (root) |

---

**Maintainer:** @brewexec  
**Last Updated:** 2026-05-02  
**Next Review:** After Stripe integration complete

---

## Appendix D: Onboarding Flow (2026-05-02)

V1 onboarding was implemented per `brewdocs/v1/onboarding-spec.md`.

### Flow
```
Sign up / Magic Link → /auth/callback → Middleware checks onboarding_completed → /onboarding → /dashboard
```

### Middleware route protection
- `middleware.ts` checks Supabase session + `user_preferences.onboarding_completed`
- Exempt paths: `/login`, `/onboarding`, `/auth/callback`, `/api/*`

### Onboarding steps
1. Disclaimer acknowledgment (required checkbox + save to `user_preferences`)
2. Tutorial (4 slides) with option to skip

### Database
- `user_preferences.onboarding_completed` (boolean)
- `user_preferences.disclaimer_acknowledged` (boolean)  
- `user_preferences.acknowledged_at` (timestamptz)
