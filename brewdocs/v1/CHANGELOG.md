# BrewLotto V1 Changelog

**Last Updated:** 2026-05-10 ET

This changelog records shipped or committed V1 changes in a compact, timestamped format.

## [Unreleased]

### 2026-05-10
- Widened the shared dashboard shell for desktop and tablet while preserving the current mobile layout.
- Reworked Strategy Locker so the entitlement snapshot opens as a compact summary with a collapsible full ladder, keeping the strategy cards visually primary.
- Tuned BrewU so the page opens with an intelligence-center style coverage overview before the tutorial replay and lesson cards, and tracked content externalization as a later V1 follow-on.
- Added a BrewCommand Strategy Signals section so ingestion-driven alerts can be audited by recipient, reason, momentum context, and eligible strategy keys.
- Grouped `/results` draw history by date with explicit time chips so each day reads as a dated history instead of a flat feed.
- Added a near-hit play confirmation nudge so settled draws can prompt the user to confirm a real play without turning late close matches into confirmed wins.
- Added a My Picks confirm-play action and made notification cards more compact on mobile while keeping desktop spacing roomy.
- Expanded `My Picks` to pull a broader roughly 30-day history window so users can confirm older plays without leaving BrewLotto.
- Tracked Strategy Locker hit / win ratio chips as a follow-on so confirmed-play signals can eventually show per-strategy trust.
- Tightened Settings with a centered account-style hero and clearer Gameplay / Notifications / Account section rhythm to better match the mockup flow.
- Polished Billing with a centered account-style hero, clearer benefits / billing / quick-link flow, and polished Notifications with New / All tabs so both routes better match their mockups.
- Documented the decision to keep the momentum meter as a single gauge, while tracking Brew AI strategy-detection alerts as event-driven, deduplicated notifications that can email a BrewLotto return link when the user is away.
- Wired an ingestion-driven strategy signal sweep that uses a branded Brew AI email template, writes `user_notifications` for eligible users, and keeps the momentum meter as the single visible gauge.
- Added a results-history and win-ratio plan so confirmed wins are tied to the correct play date/time, longer NC/CA histories can surface in the product, and same-day wins do not get confused with retroactive close matches.
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
