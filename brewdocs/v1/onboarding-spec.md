# BrewLotto V1 — Onboarding Spec

## Overview

The onboarding flow is the first experience every new user has after signing up. It ensures legal compliance (disclaimer acknowledgment) and educates the user on BrewLotto's purpose before they access the app.

## Flow

```
Sign up / Magic Link → Auth Callback → Onboarding Check → [Onboarding] → App
                                                              ↓ skip
                                                           [Dashboard]
```

## Steps

### Step 1: Acknowledgment (Required)
**Route:** `/onboarding`

User must read and actively check a box acknowledging:

> "BrewLotto provides statistical analysis and predictive modeling for lottery games. It does NOT guarantee wins. All lottery play involves risk. No strategy can overcome the mathematical house edge. Play responsibly."

A button "I Understand, Continue" is disabled until the checkbox is checked.

**Database:** Sets `user_preferences.disclaimer_acknowledged = true`, `user_preferences.acknowledged_at = now()`

### Step 2: Tutorial or Skip
**Route:** `/onboarding?step=2`

Two options presented side by side (or stacked on mobile):

- **"Take the Tour"** → Launches guided tutorial (3-4 slides)
- **"Skip Tutorial, Start Playing"** → Sets `onboarding_completed = true`, redirects to `/dashboard`

### Tutorial Slides

| Slide | Title | Content |
|-------|-------|---------|
| 1 | Welcome to BrewLotto | "Smart picks, sharper odds. Choose a game, generate predictions, track results." |
| 2 | Pick a Game | "Select from Pick 3, Pick 4, Cash 5, Powerball, or Mega Millions. Each game has unique odds and draw schedules." |
| 3 | Generate a Pick | "Brew analyzes historical draws using multiple strategies — Poisson, Momentum, Markov, and Ensemble — to generate explainable predictions." |
| 4 | Track & Learn | "Save your picks, compare against official results, and learn from BrewU lessons to improve your strategy over time." |

Each slide has a "Next" button. Last slide has "Done" which sets `onboarding_completed = true` and redirects to `/dashboard`.

## Route Protection

All app routes except `/login`, `/onboarding`, and `/auth/callback` require:
1. Authenticated user
2. `onboarding_completed = true`

If a user tries to access any app route without completing onboarding, they are redirected to `/onboarding`.

### Middleware Implementation

`middleware.ts` checks Supabase session and queries `user_preferences.onboarding_completed`. If not completed, redirect to `/onboarding`.

**Exempt paths:** `/login`, `/onboarding`, `/auth/callback`, `/api/*`, `/_next/*`, `/favicon.ico`

## Database Changes

**Table:** `public.user_preferences`

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `onboarding_completed` | boolean | false | Whether user completed the full onboarding flow |
| `disclaimer_acknowledged` | boolean | false | Whether user acknowledged the no-guarantee disclaimer |
| `acknowledged_at` | timestamptz | null | When user acknowledged the disclaimer |

## Edge Cases

| Case | Handling |
|------|----------|
| Returning user, already onboarded | Redirect straight to `/dashboard` |
| User refreshes during onboarding | State persisted in DB, resume from step they completed |
| User navigates away mid-tour | `onboarding_completed` still false, redirected back |
| Direct URL access to `/onboarding` | If already onboarded, redirect to `/dashboard` |
| New user, magic link | Auth callback handles first-time check |
