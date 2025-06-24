# BrewLotto AI — Changelog

This changelog tracks all notable changes, features, bug fixes, and refactors to the BrewLotto AI platform.

---

## [2025-06-25] Docs Upgrade & Internal Tools

### Added
- `/docs/dev-manual.md`: internal contributor guide with lifecycle, logic rules, and role assignments.
- `/docs/TODO.md`: master checklist grouped by system area.
- `/docs/init.sh`: CLI tool to scaffold new prediction strategies with auto-logging.
- GitHub badges and project meta added to `README.md`.
- `README.md` rewritten to reflect full onboarding flow, contributor roles, and tooling layout.

### Changed
- Prediction logic overview relocated from `README.md` to `dev-manual.md` for separation of internal vs. public docs.
- File headers standardized across `/utils/` for predictability.
- Public-facing `README.md` now source of truth for onboarding; `/docs/` for active development flow.

---

## [2025-06-23] Early QA & Enhancements

### Added
- Realtime dashboard updates.
- Advanced hot/cold, overdue, and positional analytics.
- README/CHANGELOG process formalized for ChatGPT PM + Co P updates.
- CSV ingestion and import scripts with validation.

### Fixed
- Button navigation and API calls across all frontend routes.
- Unified environment variable loading across scraper scripts.

---

## [2025-06-22] Launch & Core Build

### Added
- Project README with full Dev Workflow, onboarding, and system architecture.
- `/docs/data-pipeline-manual.md` for ETL and operator instructions.
- `/pages` views for Pick 3, 4, 5, Mega Millions, and Powerball.
- `/pages/api/stats/[game].js` and `/pages/api/predict/[game].js` endpoints.
- Supabase integration with full RLS policy setup.
- Prediction engine with Poisson, Multinomial, Exponential, Dirichlet models.
- Smart pick UI with live DB-backed predictions and charting.
- Full ingest pipeline scripts and utilities across all active games.
- Dev roles and documentation model scoped for future scaling.

### Changed
- Migrated all prediction/stats endpoints to `[game].js` dynamic routing pattern.
- Removed all mock/demo data from production pipeline (live DB only).

### Deprecated
- Legacy `/api/predict.js` and `/api/stats.js` replaced by `[game].js` architecture.

---

*For future PRs and features, add updates here with `[YYYY-MM-DD] Feature/Refactor` headings.*