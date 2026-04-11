# BrewLotto V1 Monitoring Runbook

**Status:** Canonical production monitoring guide
**Last Updated:** 2026-04-10 ET

## Purpose

This document defines the minimum production monitoring setup for BrewLotto V1.

## Required Services

1. **Sentry** for application and API error tracking
2. **Better Stack** or **UptimeRobot** for uptime checks

## Required Environment Variables

1. `SENTRY_DSN`
2. `NEXT_PUBLIC_SENTRY_DSN`

Optional later:

1. `SENTRY_ORG`
2. `SENTRY_PROJECT`
3. `SENTRY_AUTH_TOKEN`

## Uptime Checks To Create

Create public uptime monitors for:

1. `GET /api/health`
2. `GET /`
3. `GET /dashboard`
4. `GET /results`

If you add a dedicated secured ingestion trigger endpoint later, monitor the worker service itself instead of probing protected admin endpoints from a public uptime tool.

## Alert Expectations

Alert immediately when:

1. `GET /api/health` returns non-200
2. homepage or dashboard stops responding
3. Sentry reports new production exceptions in dashboard, results, admin, or predictions APIs
4. ingestion freshness drifts into `stale` or `failed`

## Notes

1. Public uptime tools should not probe protected BrewCommand mutation routes.
2. Sentry should be enabled in production only.
3. Freshness alerts remain operationally separate from generic uptime checks.
