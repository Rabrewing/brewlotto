# BREWLOTTO_V1_UI_UX_ARCHITECTURE.md

<!--  
/brewexec/brewdocs/BREWLOTTO_V1_UI_UX_ARCHITECTURE.md  
Updated: 2026-03-18  
Reason: V1 UX correction for dropdown scope and Brew visibility rules  
Purpose: Frontend contract document for V1 implementation  
-->

## 1. Document Purpose

This document defines the frontend architecture and UX contracts for BrewLotto V1. It serves as the source of truth for:
- Page routing and structure
- Component responsibilities
- User interface patterns
- Brew character visibility rules
- Avatar dropdown structure

This document aligns with the V1 specification in `brewdocs/v1/Brewlotto_v01.md` and corrects dropdown scope and Brew visibility rules.

---

## 2. Frontend Framework

### 2.1 Technology Stack
- **Framework**: Next.js App Router (v14+)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v3
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion

### 2.2 Project Structure
```
/app/
  /api/           # API route handlers
  /dashboard/     # Main dashboard page
  /pick3/         # Pick 3 game page
  /pick4/         # Pick 4 game page
  /cash5/         # Cash 5 game page
  /powerball/     # Powerball game page
  /mega-millions/ # Mega Millions game page
  /login/         # Authentication
  /pricing/       # Subscription plans
  /profile/       # User profile
  /settings/      # User settings
  /notifications/ # Notifications center

/components/brewlotto/
  /dashboard/     # Dashboard components
  /prediction/    # Prediction components
  /game/          # Game-specific components
  /ui/            # Reusable UI components

/lib/
  /prediction/    # Strategy engine
  /ingestion/     # Data ingestion
  /brewtruth/     # Governance layer
```

---

## 3. Page Routing & Structure

### 3.1 Core Pages
| Page | Route | Purpose |
|------|-------|---------|
| Dashboard | `/dashboard` | Main hub with game tabs, predictions, insights |
| Pick 3 | `/pick3` | Pick 3 game page with predictions |
| Pick 4 | `/pick4` | Pick 4 game page with predictions |
| Cash 5 | `/cash5` | Cash 5 game page with predictions |
| Powerball | `/powerball` | Powerball game page with predictions |
| Mega Millions | `/mega-millions` | Mega Millions game page with predictions |
| Today's Results | `/results/today` | **Core V1 page** - Today's draw results |
| My Picks | `/picks` | Saved picks and play history |
| Strategy Locker | `/strategies` | Strategy selection and management |
| Stats & Performance | `/stats` | User statistics and performance |
| Notifications | `/notifications` | Notification center |
| Profile | `/profile` | User profile and preferences |
| Settings | `/settings` | Application settings |
| Pricing | `/pricing` | Subscription plans and billing |
| Help / Learn | `/learn` | BrewUniversity Lite content |

### 3.2 API Routes
| Route | Purpose |
|-------|---------|
| `/api/predict/[game]` | Generate predictions for a game |
| `/api/picks` | Manage user picks |
| `/api/results/[game]` | Get draw results |
| `/api/stats/[game]` | Get game statistics |
| `/api/notifications` | Manage notifications |
| `/api/billing` | Handle billing webhooks |

---

## 4. Dashboard Architecture

### 4.1 Dashboard Layout
The dashboard is the primary user interface and follows this structure:

```
┌─────────────────────────────────────────────┐
│  Header / Identity Strip                    │
│  [Logo] [User Avatar] [Notifications]      │
├─────────────────────────────────────────────┤
│  Game Tabs (Pill Style)                     │
│  [Pick 3] [Pick 4] [Cash 5] [Powerball]... │
├─────────────────────────────────────────────┤
│  Main Content Area                          │
│  ┌─────────────┬─────────────┐             │
│  │ Hot Numbers │ Cold Numbers│             │
│  ├─────────────┼─────────────┤             │
│  │ Momentum    │ Prediction  │             │
│  │ Meter       │ Card        │             │
│  └─────────────┴─────────────┘             │
│  [Generate Pick Button - Gold CTA]         │
├─────────────────────────────────────────────┤
│  Footer / Status Bar                        │
└─────────────────────────────────────────────┘
```

### 4.2 Key Dashboard Components

#### 4.2.1 Header / Identity Strip
- **Responsibility**: Global navigation and user access
- **Components**:
  - Logo/Brand
  - User avatar (click opens dropdown)
  - Notifications bell
  - Settings icon

#### 4.2.2 Game Tabs
- **Responsibility**: Switch between lottery games
- **Style**: Pill-shaped tabs with active state highlighting
- **Behavior**: Instant game switch without full page reload

#### 4.2.3 Hot/Cold Number Cards
- **Responsibility**: Display frequency analysis
- **Visual Treatment**:
  - Hot numbers: Warm colors (gold/orange)
  - Cold numbers: Cool colors (blue/gray)
  - Distinct visual separation

#### 4.2.4 Momentum Meter
- **Responsibility**: Show number momentum/trend indicator
- **Style**: Premium visual treatment with gradient

#### 4.2.5 Prediction Card
- **Responsibility**: Display generated picks with explanations
- **Components**:
  - Number display
  - Strategy attribution
  - Confidence indicator
  - Explanation text

#### 4.2.6 Generate Pick Button
- **Responsibility**: Trigger prediction generation
- **Style**: Gold CTA with glow effect
- **State**: Disabled when no game selected

---

## 5. Avatar Dropdown Structure (V1 Final)

### 5.1 Dropdown Menu Items
The top-right avatar dropdown must contain exactly these items:

```
[Avatar / Username ▼]
├─ Profile
├─ My Picks
├─ Today's Results
├─ Stats & Performance
├─ Strategy Locker
├─ Notifications
├─ Settings
├─ Subscription / Billing
├─ Help / Learn
├─ Terms & Privacy
└─ Logout
```

### 5.2 Item Descriptions
| Item | Route | Purpose |
|------|-------|---------|
| Profile | `/profile` | User profile and preferences |
| My Picks | `/picks` | Saved picks and play history |
| **Today's Results** | `/results/today` | **Core V1 page** - Today's draw results |
| Stats & Performance | `/stats` | User statistics and performance |
| Strategy Locker | `/strategies` | Strategy selection and management |
| Notifications | `/notifications` | Notification center |
| Settings | `/settings` | Application settings |
| Subscription / Billing | `/pricing` | Subscription plans and billing management |
| Help / Learn | `/learn` | BrewUniversity Lite content and help |
| Terms & Privacy | `/legal/terms` | Legal documents |
| Logout | `/logout` | Sign out of account |

### 5.3 Deferred to V2
- **Missions & Achievements**: Removed from V1 dropdown (deferred to V2)
- **Full gamification dashboard**: Deferred to V2

---

## 6. Brew Character Visibility Rules

### 6.1 Visibility Priority
The Brew character (BrewBot/BrewLotto AI persona) should be strategically visible:

#### 6.1.1 Always Visible (Primary Contexts)
1. **Prediction Pages**: Brew provides commentary on generated picks
2. **Today's Results / Results Recap**: Brew summarizes draw outcomes
3. **Strategy Locker**: Brew explains strategies and provides educational context

#### 6.1.2 Visible in Milestone Notifications
- Badge unlocked notifications
- Streak achievement notifications
- Strategy mastery notifications

#### 6.1.3 Subtle Everywhere Else
- Dashboard: Minimal presence, focus on data
- My Picks: Summary voice only, no floating assistant
- Stats: Data-driven, no character interruption
- Settings: Functional UI, no character presence
- Profile: User-focused, no character presence

### 6.2 Implementation Guidelines
- **No global floating assistant**: Brew does not float across every screen
- **Contextual presence**: Brew appears where explanation/education is needed
- **Tier-based features**: Advanced Brew commentary reserved for paid tiers
- **Voice mode toggle**: Optional Brew voice interface (deferred to V2)

---

## 7. Component Responsibilities

### 7.1 Dashboard Components
| Component | Responsibility | Props |
|-----------|----------------|-------|
| `DashboardLayout` | Shell layout with header and tabs | - |
| `GameTabs` | Render pill-style game selector | `games: Game[]`, `onSelect` |
| `HotColdCards` | Display frequency analysis | `hotNumbers: number[]`, `coldNumbers: number[]` |
| `MomentumMeter` | Show trend indicator | `score: number`, `trend: 'up' \| 'down'` |
| `PredictionCard` | Display generated picks | `prediction: Prediction` |
| `GeneratePickButton` | Trigger prediction generation | `onClick`, `disabled` |

### 7.2 Prediction Components
| Component | Responsibility | Props |
|-----------|----------------|-------|
| `PredictionForm` | Game selection and options | `onSubmit` |
| `NumberDisplay` | Render lottery numbers | `numbers: number[]`, `bonus?: number` |
| `StrategyBadge` | Show strategy attribution | `strategy: string` |
| `ConfidenceIndicator` | Visual confidence meter | `score: number` |
| `ExplanationText` | Render Brew commentary | `text: string`, `tier: string` |

### 7.3 Game Components
| Component | Responsibility | Props |
|-----------|----------------|-------|
| `GamePage` | Game-specific page shell | `gameKey: string` |
| `DrawHistory` | Historical draw display | `draws: Draw[]` |
| `PlayLogger` | Log user plays | `onLogPlay` |

---

## 8. State Management

### 8.1 React Query Keys
```typescript
// Game data
['games']
['draws', { game, state }]
['predictions', { game, date }]
['stats', { game, user }]

// User data
['user', 'profile']
['user', 'picks']
['user', 'notifications']
['user', 'subscription']

// Gamification
['badges', { user }]
['streaks', { user }]
```

### 8.2 Local State
- **Game selection**: URL-based routing
- **Form state**: React Hook Form
- **UI state**: Context providers for theme, notifications

---

## 9. Visual Design System

### 9.1 Colors
| Token | Value | Usage |
|-------|-------|-------|
| `brew-gold` | `#FFD700` | CTAs, accents, highlights |
| `brew-black` | `#1C1C1C` | Background, dark surfaces |
| `brew-white` | `#FFFFFF` | Text, light surfaces |
| `hot-color` | `#FF6B35` | Hot numbers |
| `cold-color` | `#4A90E2` | Cold numbers |

### 9.2 Typography
- **Headers**: Montserrat (600/700 weight)
- **Body**: Inter (400/500 weight)
- **Monospace**: JetBrains Mono (numbers)

### 9.3 Spacing
- Base unit: 8px
- Scale: 4px increments

### 9.4 Motion
- **Transitions**: Framer Motion
- **Micro-interactions**: Hover states, button presses
- **Page transitions**: Fade/slide combinations

---

## 10. Accessibility

### 10.1 Standards
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatible
- Color contrast minimum 4.5:1

### 10.2 Key Requirements
- All interactive elements focusable
- ARIA labels for icons
- Alt text for images
- Skip navigation links

---

## 11. Performance

### 11.1 Optimization Strategies
- **Code splitting**: Dynamic imports for non-critical components
- **Image optimization**: Next.js Image component
- **Data fetching**: React Query with stale-time caching
- **Bundle analysis**: Regular monitoring and optimization

### 11.2 Core Web Vitals Targets
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

---

## 12. Testing Strategy

### 12.1 Unit Tests
- Component rendering and props
- User interactions
- State management
- Utility functions

### 12.2 Integration Tests
- Page navigation
- Form submissions
- API mocking
- Error handling

### 12.3 E2E Tests
- User flows (prediction generation, pick saving)
- Authentication flows
- Billing flows
- Cross-browser compatibility

---

## 13. Success Criteria

### 13.1 V1 UI/UX Completion
- ✅ Dashboard loads with game tabs and predictions
- ✅ Avatar dropdown contains correct V1 items
- ✅ "Missions & Achievements" removed from dropdown
- ✅ Brew visibility rules implemented
- ✅ "Today's Results" accessible as core page
- ✅ Premium visual direction applied
- ✅ All pages responsive and accessible

### 13.2 Deferred to V2
- Missions & Achievements dashboard
- Full gamification UI
- Voice mode interface
- Advanced Brew character interactions

---

## 14. References

- `brewdocs/v1/Brewlotto_v01.md` - V1 Product Overview and System Architecture
- `brewdocs/v1/frontend_design/` - Design mockups and images
- `AGENTS.md` - Project guidelines and build commands

---

**Updated**: 2026-03-18  
**Reason**: V1 UX correction for dropdown scope and Brew visibility rules  
**Status**: Active V1 Contract