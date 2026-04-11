# BrewLotto V1 Launch Infrastructure Plan

**Status:** Canonical launch plan
**Last Updated:** 2026-04-09 ET

## Purpose

This document is the source of truth for BrewLotto V1 launch infrastructure.

It defines:

1. what BrewLotto must run in production
2. which services are required now versus later
3. how web, PWA, and future Play Store delivery fit together
4. the recommended hosted stack for a first production launch

## Product Delivery Model

BrewLotto V1 is not a mobile-only app.

The same product should support:

1. web app access through a normal browser
2. mobile web access on phones and tablets
3. installable PWA behavior
4. future Android Play Store packaging after the web app is stable

The website and PWA are the same application surface. A separate website project is not required.

## Source Control And Deployment Rule

For BrewLotto V1:

1. `main` is the production source-of-truth branch
2. Vercel production must deploy from `main` only
3. active development must continue on non-production branches until changes are approved
4. preview deployments may be used for non-production branch testing, but they must not replace the live V1 deployment

## Recommended V1 Production Stack

### Core Stack

1. **Vercel**
   - hosts the Next.js app and API routes
   - serves the web app and mobile web app
2. **Supabase**
   - system-of-record database
   - authentication
   - RLS-backed data access
3. **Google Cloud Run + Google Cloud Scheduler**
   - production ingestion runner
   - scheduled draw-window jobs
   - retry windows after official draw times
4. **Custom Domain**
   - production user-facing domain
   - admin / API routes under the same trusted surface
5. **Monitoring / Alerts**
   - Sentry for runtime errors
   - uptime alerting for public routes and ingestion endpoints
6. **Transactional Email Provider**
   - auth emails
   - account notifications
   - recommended: Resend or Postmark

### Why This Stack

1. Vercel is strong for the app itself
2. Supabase is already the data and auth foundation
3. long-running or scheduled ingestion is not a good fit for Vercel alone
4. Cloud Scheduler and Cloud Run provide reliable timed execution around draw windows
5. this keeps the launch architecture simple enough for a first production release

## What Must Exist Before Public Launch

### Required Now

1. production Vercel project
2. production Supabase project with live schema and secrets
3. draw-window ingestion worker running outside local development
4. freshness monitoring and stale-data gating
5. error monitoring
6. custom domain
7. basic email provider for auth

### Production Secrets / Environment Variables

At minimum, production should define:

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `SUPABASE_SERVICE_ROLE_KEY`
4. `BREWCOMMAND_ADMIN_EMAILS`
   - comma-separated allowlist for BrewCommand admins
5. `BREWCOMMAND_ADMIN_SECRET`
   - optional server-to-server secret for protected admin job triggers
6. auth / billing / app URL values already required elsewhere in V1

`BREWCOMMAND_ADMIN_SECRET` is not a user password. It is an environment secret used by trusted server-side callers to access sensitive admin job endpoints.

### Strongly Recommended Before Launch

1. manual admin refresh endpoint for ingestion
2. uptime checks for dashboard, predictions API, and ingestion trigger endpoints
3. backups / export discipline for production data
4. production environment documentation for secrets and scheduled jobs

### Can Wait Until After Launch

1. Play Store packaging
2. native Android wrapper via Capacitor
3. push notifications beyond core web/PWA capability
4. advanced analytics
5. self-hosting or multi-region optimization

## Web, PWA, And Play Store Path

### Stage 1: Web First

Ship BrewLotto as a production website with strong mobile responsiveness.

### Stage 2: PWA Enablement

Enable installability once the web app, freshness handling, and caching behavior are trustworthy.

PWA requirements:

1. valid manifest
2. service worker strategy
3. install prompt support
4. icons and splash assets
5. safe cache rules that do not misrepresent stale lottery data as current

### Stage 3: Play Store Packaging

After the web app is stable, package it for Android using Capacitor.

Important:

1. Play Store distribution does not replace web hosting
2. Play Store packaging does not solve ingestion or freshness
3. the server-side production stack remains required

## Immediate Setup Order

### Phase A: Production Readiness

1. keep Vercel as the primary app host
2. keep Supabase as the system of record
3. create secured ingestion endpoints or worker entrypoints
4. move scheduled ingestion out of local-only execution
5. verify stale-data blocking and admin visibility

### Phase B: Observability

1. add Sentry to app and API routes
2. add uptime monitoring to main routes and ingestion triggers
3. connect alerting to email or Slack-equivalent destination

The canonical monitoring setup lives in `brewdocs/v1/monitoring-runbook.md`.

### Phase C: PWA Readiness

1. re-enable PWA support in production-safe form
2. verify installability on Android and iPhone browsers
3. ensure no stale official draw data is cached as fresh

### Phase D: Store Prep

1. add Capacitor
2. create Android project shell
3. configure icons, splash, package id, and signing
4. publish to Google Play Console

## Recommended Service Choices

### Hosting

1. **Vercel** for the app
2. **Google Cloud Run** for ingestion worker jobs

### Database / Auth

1. **Supabase**

### Monitoring

1. **Sentry** for runtime errors
2. **Better Stack** or **UptimeRobot** for uptime checks

### Email

1. **Resend** recommended for simplicity
2. **Postmark** if you want a more traditional transactional-email setup

### Mobile Packaging Later

1. **Capacitor**

## Monthly Cost Guidance

Approximate early-stage cost targets:

1. **Vercel**: hobby or pro depending on traffic and team needs
2. **Supabase**: paid production tier once launch data and auth matter
3. **Cloud Run / Scheduler**: low cost early if traffic and jobs are modest
4. **Sentry**: free or low starter tier initially
5. **Email**: low early cost unless auth / notification volume spikes

Do not optimize for lowest possible cost if it compromises data freshness or trust.

## BrewLotto V1 Launch Recommendation

The recommended launch path is:

1. **Website first** on Vercel
2. **Reliable ingestion worker** on Google Cloud
3. **PWA enablement** after freshness and caching rules are safe
4. **Play Store packaging** after web/PWA behavior is stable

## Operational Non-Negotiables

1. stale draw data must never be presented as current
2. ingestion cannot depend on a developer laptop being online
3. the production scheduler must run independently of user traffic
4. freshness gating must remain active across live surfaces
5. PWA caching must not weaken draw-data truthfulness
