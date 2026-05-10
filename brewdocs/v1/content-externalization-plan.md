# BrewLotto V1 - Content Externalization Plan

**Last Updated:** 2026-05-10 ET

## Decision

BrewU/help copy, support categories, and tutorial transcript content remain static by design for V1.

## Why

- The current content is already truthful and tied to live product surfaces.
- Externalizing it too early would add DB/CMS work before launch-critical polish is done.
- The app currently benefits more from layout and flow refinement than from a content plumbing rewrite.

## When to Revisit

Move this content into DB/CMS-backed tables only if:

- the support team needs to edit copy without deployments
- BrewU lesson content starts changing frequently
- localization or content approval workflows become necessary

## Likely Future Tables

- `brewu_lessons`
- `brewu_topics`
- `support_categories`
- `tutorial_transcripts`

## Current Status

Tracked as a follow-on, not a launch blocker.
