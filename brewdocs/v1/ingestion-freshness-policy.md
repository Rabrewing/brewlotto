# BrewLotto V1 Ingestion Freshness Policy

**Status:** Canonical V1 operational policy
**Last Updated:** 2026-04-09 ET

## Purpose

This document defines the operational source of truth for draw freshness.

BrewLotto must not present stale lottery data as current. The system must ingest around real draw windows, retry until official results land, and gate user-facing prediction surfaces when freshness is not healthy.

## Hard Rules

1. Draw freshness is a product requirement, not an optional dashboard warning.
2. The app must ingest around each supported draw window, not only on a generic daily schedule.
3. The dashboard and prediction surfaces must not present stale or unverified data as live.
4. Prediction generation must be blocked when source freshness is not `healthy`.
5. `draw_freshness_status` and `v_ingestion_health_summary` are the operational freshness truth for UI gating.
6. If freshness is `delayed`, `stale`, `failed`, or `unknown`, the UI must clearly say so and withhold live prediction output.

## Scheduling Standard

Each supported game must have:

1. Canonical draw windows in `schedule_config`
2. A primary ingestion run scheduled immediately after the official draw time
3. Follow-up retry runs after the primary window until the draw lands or the freshness SLA is missed
4. Freshness monitoring tied to expected next draw time and latest ingested official draw

## Minimum Retry Behavior

Each draw window should trigger:

1. One primary ingestion run just after draw close / official posting time
2. Multiple follow-up retries during the expected source-publication window
3. Alerting if the draw is still missing after the retry window expires

## UI Contract

When freshness is not healthy:

1. Hot/cold/momentum cards must not be presented as live current analysis
2. Prediction commentary must not imply current or trustworthy live output
3. Prediction generation must be disabled or rejected server-side
4. The freshness banner must explain the degraded state truthfully

## Supported V1 Games

This policy applies to:

1. NC Pick 3
2. NC Pick 4
3. NC Cash 5
4. CA Daily 3
5. CA Daily 4
6. CA Fantasy 5
7. Powerball
8. Mega Millions

## Source Of Truth Priority

1. Official draw sources and ingested `official_draws`
2. `draw_freshness_status`
3. `v_ingestion_health_summary`
4. Dashboard messaging derived from the freshness API

Mock, cached, or older derived UI state must never outrank the freshness layer.
