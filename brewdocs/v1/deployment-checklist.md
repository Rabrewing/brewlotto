# BrewLotto V1 Deployment Checklist

**Status:** Working deployment reference
**Last Updated:** 2026-04-10 ET

## Purpose

This document is the step-by-step deployment reference for BrewLotto V1.

Use it to:

1. deploy BrewLotto to Vercel
2. configure required environment variables
3. validate production behavior after deploy
4. prepare the next ingestion and monitoring steps without losing context

## Current Recommended Launch Order

1. Deploy the web app to Vercel
2. Add production environment variables
3. Verify core routes and health checks
4. Add Sentry DSNs
5. Stand up production ingestion scheduling
6. Return to active frontend and product phase work

## Git Branch Strategy

This is the required Git and Vercel branch model for BrewLotto V1.

### Production Source Of Truth

1. `main` is the production source of truth for V1
2. only `main` should drive the live Vercel production deployment
3. `main` should contain approved, production-ready code only

### Development Branches

1. active development happens on non-production branches such as `brew2-overhaul`
2. future work for V1 follow-on releases should also stay on branches such as:
   - `v1.1`
   - `v1.5`
   - `feature/...`
3. unfinished work must not be merged into `main`

### Vercel Behavior Required

1. set the Vercel **Production Branch** to `main`
2. pushes to `main` deploy the live production app
3. pushes to non-`main` branches must not replace production
4. non-`main` branches may use Vercel preview deploys for testing when helpful

### Operational Rule

If work is not ready for public production, it stays off `main`.

### Current Branch Note

- `brew2-overhaul` is the active development branch for landing-page and AI-provider work.
- `main` remains the production source of truth.
- If the live site still shows the old sign-in page, the Vercel production branch is still pointing at `main` or at an older deployment, not at `brew2-overhaul`.

## GitHub + Vercel Setup Instructions

### In GitHub

1. keep `main` as the canonical production branch
2. optionally protect `main` with branch protection rules
3. require review or final validation before merging into `main`

### In Vercel

1. import the GitHub repository
2. open project settings
3. set **Production Branch** to `main`
4. leave preview deployments enabled only for non-production testing if desired
5. do not manually promote unfinished preview builds to production

### Recommended Workflow

1. build locally on `brew2-overhaul` or another dev branch
2. push branch changes to GitHub
3. test locally and optionally with Vercel preview deployments
4. merge into `main` only when the V1 change is approved and stable
5. let Vercel deploy production from `main`

## Phase 1: Prepare For Vercel

### Requirements

1. GitHub repo connected and pushed
2. Vercel account ready
3. Supabase production project ready
4. Production domain decision made, even if domain is added later

### Confirm These Values Before Deploy

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `SUPABASE_SERVICE_ROLE_KEY`
4. `NEXT_PUBLIC_APP_URL`
5. `BREWCOMMAND_ADMIN_EMAILS` (include `command@brewlotto.app` and `michael.brewington@gmail.com`)
6. `BREWCOMMAND_ADMIN_SECRET`
7. `AI_PROVIDER`
8. `OPENAI_API_KEY` or `DEEPSEEK_API_KEY` or `NIM_API_KEY`

If billing is in scope now, also prepare:

1. `STRIPE_SECRET_KEY`
2. `STRIPE_WEBHOOK_SECRET`

If monitoring is being enabled right away, also prepare:

1. `SENTRY_DSN`
2. `NEXT_PUBLIC_SENTRY_DSN`

## Phase 2: Deploy To Vercel

### Recommended Path

1. Go to Vercel
2. Import the GitHub repository
3. Let Vercel detect Next.js automatically
4. Set the root to the repo root if prompted
5. Add all required environment variables before first production deploy if possible
6. Run the first deploy

### Build Expectations

Expected build command:

```bash
npm run build
```

Expected runtime:

1. Next.js App Router app on Vercel
2. Supabase-backed APIs and auth

## Phase 3: Required Environment Variable Checklist

### Core App

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_APP_URL`

### BrewCommand Admin

- [ ] `BREWCOMMAND_ADMIN_EMAILS` (`command@brewlotto.app`, `michael.brewington@gmail.com`)
- [ ] `BREWCOMMAND_ADMIN_SECRET`

### Session Retention

- [ ] Configure Supabase auth session inactivity to 14 days for trusted device reuse

### Monitoring

- [ ] `SENTRY_DSN`
- [ ] `NEXT_PUBLIC_SENTRY_DSN`

### Billing If Active

- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`

### AI Provider

- [ ] `AI_PROVIDER`
- [ ] `OPENAI_API_KEY`
- [ ] `OPENAI_MODEL`
- [ ] `DEEPSEEK_API_KEY`
- [ ] `DEEPSEEK_MODEL`
- [ ] `NIM_API_KEY`
- [ ] `NIM_MODEL`
- [ ] `NIM_BASE_URL`

### Landing Video

- [ ] `NEXT_PUBLIC_LANDING_VIDEO_MP4_URL`
- [ ] `NEXT_PUBLIC_LANDING_VIDEO_WEBM_URL`
- [ ] `BLOB_READ_WRITE_TOKEN` if uploading the reel to Vercel Blob

Use `scripts/uploadLandingVideoToBlob.mjs` to upload the landing reel, then copy the returned public URL into the landing video env vars.

## Phase 4: Post-Deploy Validation

After the first live deploy, verify these routes manually:

1. `/`
2. `/dashboard`
3. `/results`
4. `/admin`
5. `/api/health`

### Expected Results

1. `/` loads the dashboard shell
2. `/dashboard` loads without server errors
3. `/results` loads and truthfully gates stale data if freshness is not healthy
4. `/admin` requires authorized admin access
5. `/api/health` returns JSON and reflects database/freshness state

## Phase 5: Immediate Production Follow-Up

### Sentry

1. Create a Sentry account
2. Create a Next.js project
3. Copy the DSN
4. Set `SENTRY_DSN`
5. Set `NEXT_PUBLIC_SENTRY_DSN`
6. Redeploy if needed

### Uptime Monitoring

Create uptime checks for:

1. `GET /api/health`
2. `GET /`
3. `GET /dashboard`
4. `GET /results`

### Ingestion

Production ingestion must not depend on local development.

Next decision:

1. use `Vercel Cron` first for a simpler initial production scheduler
2. or move straight to `Google Cloud Run + Cloud Scheduler`

## Phase 6: Ingestion Hosting Decision

### Option A: Vercel Cron First

Best when:

1. you want the fastest path to a hosted scheduler
2. you want to reduce moving parts initially
3. job duration is short enough for Vercel execution limits

Tradeoffs:

1. less flexible for long-running or retry-heavy ingestion
2. may be weaker for complex operational scheduling over time

### Option B: Google Cloud Run + Cloud Scheduler

Best when:

1. you want stronger ingestion reliability
2. you want dedicated scheduled workers
3. you expect retries, growth, or more operational control

Tradeoffs:

1. more setup overhead now
2. separate cloud billing and configuration

## Production Truthfulness Checklist

These must remain true after deploy:

- [ ] stale draw data is never presented as current
- [ ] admin routes are not public
- [ ] prediction generation is blocked when freshness is not healthy
- [ ] `/results` withholds stale official results
- [ ] `/api/health` reflects degraded freshness
- [ ] ingestion does not depend on a developer laptop

## What The BrewCommand Secret Means

`BREWCOMMAND_ADMIN_SECRET` is a private environment variable.

It is used for secure server-to-server calls to protected admin job endpoints.

It is:

1. not a user password
2. not shown in the frontend
3. not something regular users should ever know

## Recommended Next Actions After This Checklist Exists

1. deploy to Vercel
2. validate live routes
3. wire Sentry DSNs
4. choose ingestion hosting path
5. resume the paused product phase work
