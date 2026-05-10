# BrewLotto V1 Changelog

**Last Updated:** 2026-05-10 ET

This changelog records shipped or committed V1 changes in a compact, timestamped format.

## [Unreleased]

### 2026-05-10
- Widened the shared dashboard shell for desktop and tablet while preserving the current mobile layout.
- Reworked Strategy Locker so the entitlement snapshot opens as a compact summary with a collapsible full ladder, keeping the strategy cards visually primary.
- Added a BrewU play-style matrix and payout ladder matrix so help content, AI guidance, and settlement classification share one source of truth.
- Upgraded settlement classification to distinguish exact-order, box-style, and standard match-number outcomes more cleanly.
- Centralized support intake, support tickets, BrewCommand notifications, and customer resolution emails.
- Added a strategy-validation checklist and tightened the live engine spec alignment notes.
- Added a landing-video replacement note so the watermark-free Blob asset can be swapped in through the Vercel CLI update path.
- Tightened the live strategy engine test suite so each deterministic module and the ensemble combiner are validated explicitly.
- Repointed the legacy shared header `Account` button from dead `/account` to the live `/profile` route.

### 2026-05-07
- Added BrewU support intake, support screenshot storage, canonical play-log bridge, settlement sweep, and customer notifications planning.
- Added timestamp discipline to AGENTS and Brewdocs so future AI sessions can read state without guessing.

### 2026-05-05
- Fixed cloud ingestion scheduler routing, AI usage tracking, and state-aware dashboard behavior.
- Verified live NC and CA ingestion paths and updated the shared dashboard game mapping.
