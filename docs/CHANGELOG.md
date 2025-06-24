
---

## `/docs/CHANGELOG.md` *(Initial Version Example)*

```markdown
# BrewLotto AI — Changelog

This changelog tracks all notable changes, features, bug fixes, and refactors to the BrewLotto AI platform.

---

## [2025-06-22] Launch & Core Build

### Added
- Project README with full Dev Workflow, onboarding, and architecture.
- `/docs/data-pipeline-manual.md` for ETL and operator instructions.
- `/pages` for Pick 3, Pick 4, Pick 5, Mega Millions, Powerball (with smart pick logic).
- `/pages/api/stats/[game].js` and `/pages/api/predict/[game].js` endpoints for all games.
- Supabase DB connection, scripts for draw ingestion, and hot/cold analytics.
- Unified dashboard UI with live spend/wins tracking and charts.
- Advanced statistical models (Poisson, Multinomial, Exponential, Dirichlet).
- Ingest scripts and utils for all games (Pick 3, 4, 5, Mega, Powerball).
- PM and Operator documentation for future team scaling.

### Changed
- Migrated all API endpoints to dynamic `[game].js` routing for maintainability.
- Removed all mock/demo data from production pipeline; live DB only.

### Deprecated
- Old standalone `stats` and `predict` endpoints replaced by `[game].js` files.

---

## [2025-06-23] Early QA & Enhancements

### Added
- Realtime dashboard updates.
- Advanced hot/cold, overdue, and positional analytics.
- README/CHANGELOG process for ChatG PM and Co P logging.
- CSV ingestion and import scripts with validation.

### Fixed
- Button navigation and API calls for all frontend routes.
- Unified environment variable loading for scripts.

---

*For future PRs and features, add updates here with `[YYYY-MM-DD] Feature/Refactor` headings.*
