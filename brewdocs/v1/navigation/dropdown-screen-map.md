# BrewLotto V1 Dropdown Screen Map

**Purpose:** Define each normalized dropdown destination in implementation terms so UI, API, and data work stay aligned.

## 1. Profile

- Route: `/profile`
- Purpose: identity, account details, state preference, security entrypoints
- Core sections:
  - hero profile card
  - account details
  - preferences
  - security actions
- Notes:
  - `Edit Profile` is a modal/action inside the route, not a separate route

## 2. My Picks

- Route: `/my-picks`
- Purpose: saved/generated picks and current statuses
- Core sections:
  - filter bar
  - active picks list
  - result state chips (`pending`, `won`, `lost`)
  - replay/save/delete actions
- V1 dependency:
  - predictions + play log / outcome state

## 3. Today's Results

- Route: `/results`
- Purpose: latest draw outcomes and user match context
- Core sections:
  - latest official draw card
  - your closest matches
  - short insight recap
- V1 dependency:
  - official draws
  - user pick matching

## 4. Stats & Performance

- Route: `/stats`
- Purpose: user habit/performance tracking and breakdowns
- Core sections:
  - top-level metrics
  - game breakdown
  - streak / hit-rate trends
  - strategy performance summary
- V1 dependency:
  - user predictions
  - outcome logging

## 5. Strategy Locker

- Route: `/strategy-locker`
- Purpose: premium strategy insights, saved methods, explainability surface
- Core sections:
  - strategy cards
  - lock/entitlement state
  - last used / win-rate summary
  - premium upgrade messaging when locked
- V1 dependency:
  - prediction strategies
  - entitlements / billing tiers

## 6. Notifications

- Route: `/notifications`
- Purpose: notification preferences and recent events
- Core sections:
  - preference toggles
  - inbox/history list
  - alert categories
- V1 dependency:
  - notification preferences
  - alert delivery history

## 7. Settings

- Route: `/settings`
- Purpose: app configuration controls that are not profile-specific
- Core sections:
  - default state
  - app preferences
  - notification behavior shortcuts
  - future feature toggles when needed

## 8. Subscription & Billing

- Route: `/billing`
- Purpose: authenticated billing/account-management surface
- Core sections:
  - current plan
  - entitlement summary
  - upgrade/manage CTA
  - billing history / invoice placeholder area
- Relationship to pricing:
  - `/pricing` remains external-facing upgrade/marketing
  - `/billing` becomes the authenticated account destination

## 9. Help / Learn

- Route: `/learn`
- Purpose: education, FAQs, BrewUniversity Lite, explainers
- Core sections:
  - common explanations (`hot`, `cold`, momentum, confidence)
  - onboarding/help articles
  - support links

## 10. Terms & Privacy

- Route: `/legal`
- Purpose: legal document index
- Core sections:
  - terms of use
  - privacy policy
  - responsible-use/trust references if added

## 11. Logout

- UI model: menu action with confirm dialog
- Execution:
  - user taps `Logout`
  - confirm modal appears
  - confirmed action uses `/logout`

## 12. Build-Safety Rules

- Do not add a destination until route intent and data dependencies are defined here
- Do not mix account, gameplay, and legal concerns into a single catch-all page
- Prefer thin V1 surfaces first; deeper feature expansion can happen inside each route later
