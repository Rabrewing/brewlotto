# BrewLotto V1 — Onboarding Spec

## Overview

The onboarding flow is the first gated experience every new user has after signing in from the public landing page. It ensures legal compliance (disclaimer acknowledgment) and educates the user on BrewLotto's purpose before they access the app.

## Flow

```
Landing Page → Sign in / Magic Link → Auth Callback → Onboarding Check → [Onboarding] → App
                                                                        ↓ skip
                                                                     [Dashboard]
```

## Steps

### Step 1: Acknowledgment (Required)
**Route:** `/onboarding`

User must read and actively check a box acknowledging:

> "BrewLotto provides statistical analysis and predictive modeling for lottery games. It does NOT guarantee wins. All lottery play involves risk. No strategy can overcome the mathematical house edge. Play responsibly."

Recommended V1 language:

> "BrewLotto provides statistical analysis, prediction commentary, and educational context. It does not guarantee wins, improve the odds, or replace the randomness of lottery outcomes. Every game involves financial risk, and no strategy, tier, or model can overcome the house edge. Use BrewLotto as a decision aid, not as a promise of results."

A button "I Understand, Continue" is disabled until the checkbox is checked.

**Database:** Sets `user_preferences.disclaimer_acknowledged = true`, `user_preferences.acknowledged_at = now()`

### Step 2: Skippable Tutorial Video
**Route:** `/onboarding`

After the disclaimer is acknowledged, the user sees a short BrewLotto avatar-led tutorial video.

The tutorial step must:

- be visually branded and easy to replay
- include captions and an optional transcript
- be skippable without penalty
- offer a BrewU replay link for users who want to come back later

Recommended V1 behavior:

- Primary action: `Skip tutorial, start playing`
- Secondary action: `Replay in BrewU`
- Tutorial replay route: `/learn#tutorial`

The landing page already previews the brand and CTA video, so onboarding can stay focused on legal acknowledgment and product orientation.

## Animated Tutorial Plan

Planned follow-up content will use Opus Clip to generate short animated tutorial clips for:

1. the no-guarantee disclaimer
2. the tutorial walkthrough
3. the dashboard introduction

These clips should become the visual companion to onboarding after the landing page and login experience are locked.

### Tutorial Creative Direction

Keep the three clips short, branded, and easy to follow:

1. Disclaimer clip - establish trust, legal clarity, and responsible-use tone.
2. Tutorial clip - show how to choose a state, pick a game, and generate numbers.
3. Dashboard clip - show the first successful post-onboarding landing state and explain where results, stats, and strategy live.

Each clip should use the BrewLotto avatar, the matching mockup for that step, and the same gold-on-dark brand system used by the landing page.

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
