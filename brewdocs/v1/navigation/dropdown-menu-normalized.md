# BrewLotto V1 Dropdown Menu Normalized Spec

**Status:** Canonical V1 navigation normalization
**Source Input:** `brewdocs/v1/dropdown-menu-v1.md`, `brewdocs/v1/mockups/brewlotto_dropdown.png`, related screen mockups under `brewdocs/v1/mockups/`
**Purpose:** Convert the oversized ideation doc into a stable V1-ready information architecture and menu behavior spec.

## 1. V1 Intent

The profile dropdown is not just a floating menu. In V1 it should act as the user identity and control hub for the current app shell.

Design goals:
- feel connected to the avatar identity system
- group destinations by purpose instead of a flat list
- link only to real V1 surfaces or explicitly planned V1 surfaces
- avoid adding a second navigation system that conflicts with the dashboard shell

## 2. Canonical Grouping

### Identity Header
- Avatar
- Display name
- Optional secondary handle/email
- State selector pill (`NC`, later `CA`)

### Gameplay
- `My Picks`
- `Today's Results`
- `Stats & Performance`
- `Strategy Locker`

### Account
- `Profile`
- `Notifications`
- `Settings`
- `Subscription & Billing`

### System
- `Help / Learn`
- `Terms & Privacy`
- `Logout`

## 3. V1 Normalized Destinations

| Menu Item | Normalized V1 Surface | Type | Notes |
|---|---|---|---|
| Profile | `/profile` | route | Main identity/preferences surface |
| My Picks | `/my-picks` | route | High-priority retained-value surface |
| Today's Results | `/results` | route | Draw outcomes plus user match summary |
| Stats & Performance | `/stats` | route | Personal trends, performance, breakdowns |
| Strategy Locker | `/strategy-locker` | route | Premium explainability and saved strategy surface |
| Notifications | `/notifications` | route | Preference toggles plus notification history |
| Settings | `/settings` | route | App-level preferences, state default, controls |
| Subscription & Billing | `/billing` | route | Plan, upgrade, invoices, entitlement messaging |
| Help / Learn | `/learn` | route | BrewUniversity Lite / explainers / help |
| Terms & Privacy | `/legal` | route | Legal index page linking policy docs |
| Logout | `/logout` | action route + confirm modal | Confirm in UI, then use existing logout route |

## 4. Explicit V1 Consolidation Rules

- `Profile` and `Settings` remain separate.
  `Profile` owns identity/account editing. `Settings` owns app preferences and controls.
- `Subscription & Billing` does not reuse `/pricing` as the final information architecture.
  `Pricing` remains a marketing/upgrade entrypoint. `Billing` becomes the authenticated account surface.
- `Help / Learn` is the normalized V1 destination for BrewUniversity Lite, FAQs, and explainer content.
- `Terms & Privacy` should be a legal index route rather than separate top-level menu rows for each legal document.
- `Logout` is not a full destination page in the menu model; it is a destructive action with confirm affordance.

## 5. Current V1 Priority

High-value first:
1. `My Picks`
2. `Today's Results`
3. `Profile`
4. `Stats & Performance`
5. `Strategy Locker`

Foundational account/system after that:
1. `Notifications`
2. `Settings`
3. `Subscription & Billing`
4. `Help / Learn`
5. `Terms & Privacy`

## 5.1 Deferred Referral Engine Note

- The raw source material and mockups include referral-engine concepts.
- Referral is intentionally not part of the canonical V1 dropdown IA yet.
- Do not add it to the live menu until its placement is explicitly decided.
- Open decision points:
  - whether it belongs under profile, billing, gamification, or as a standalone route
  - whether it is V1 or deferred post-V1
  - what reward/accounting model owns it
  - whether it should surface in navigation or only in a targeted growth flow

## 6. Dropdown Component Rules

- Width target: `320px` to `340px`
- Glass + gold glow styling should match dashboard shell language
- Include a visible anchor triangle connecting dropdown to avatar
- Use grouped sections with subtle dividers
- State selector must look interactive, not decorative
- Hover/press affordances should suggest depth but not overwhelm the shell
- Badge usage is reserved for states that matter now, such as unread counts or premium lock counts

## 7. Source-of-Truth Rule

`brewdocs/v1/dropdown-menu-v1.md` is now treated as ideation/reference material.

For V1 implementation, use:
- this file for information architecture and normalization
- `brewdocs/v1/navigation/dropdown-screen-map.md` for destination definitions
- `brewdocs/v1/navigation/dropdown-execution-plan.md` for build order
