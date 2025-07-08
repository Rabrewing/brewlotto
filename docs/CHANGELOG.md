# BrewLotto AI — Changelog

This changelog tracks all notable changes, features, bug fixes, and refactors to the BrewLotto AI platform.

---

## [2025-06-25] 📚 Docs Upgrade & Internal Tools

### Added
- `/docs/dev-manual.md`: Contributor guide with lifecycle, logic rules, and role assignments.
- `/docs/TODO.md`: Master checklist grouped by system area.
- `/docs/init.sh`: CLI scaffolder for new prediction strategies with auto-logging.
- GitHub badges and project metadata added to `README.md`.
- `README.md` rewritten to reflect full onboarding flow, contributor roles, and tooling layout.

### Changed
- Prediction logic overview moved from `README.md` to `dev-manual.md` to separate public vs. internal docs.
- File headers standardized across `/utils/` for consistency.
- `README.md` now serves as the public onboarding source; `/docs/` is the internal dev flow hub.

---

## [2025-06-23] 🔍 QA Enhancements & Analytics

### Added
- Realtime dashboard updates with live draw sync.
- Advanced hot/cold, overdue, and positional analytics modules.
- Formalized README/CHANGELOG process for ChatGPT PM + Co P updates.
- CSV ingestion and import scripts with validation logic.

### Fixed
- Button navigation and API calls across all frontend routes.
- Unified `.env` loading across all scraper scripts.

---

## [2025-06-22] 🚀 Launch & Core Build

### Added
- Project `README.md` with Dev Workflow, onboarding, and system architecture.
- `/docs/data-pipeline-manual.md` for ETL and operator instructions.
- `/pages` views for Pick 3, 4, 5, Mega Millions, and Powerball.
- `/pages/api/stats/[game].js` and `/pages/api/predict/[game].js` endpoints.
- Supabase integration with full RLS policy setup.
- Prediction engine with Poisson, Multinomial, Exponential, and Dirichlet models.
- Smart pick UI with live DB-backed predictions and charting.
- Full ingest pipeline scripts and utilities for all active games.
- Dev roles and documentation model scoped for future scaling.

### Changed
- Migrated all prediction/stats endpoints to `[game].js` dynamic routing pattern.
- Removed all mock/demo data from production pipeline — live DB only.

### Deprecated
- Legacy `/api/predict.js` and `/api/stats.js` replaced by `[game].js` architecture.

---

*For future PRs and features, add updates here using `[YYYY-MM-DD] Feature/Refactor` headings.*

// =============================================
// 📁 File: /full/path/to/file.jsx
// 🧠 Summary: One-liner describing core role
//
// ▸ Bullet callouts explaining purpose, behavior, or key logic
// ▸ Integration notes — e.g. “Triggered by XYZ UI”
// ▸ Input/output expectations (props, context, hooks)
// ▸ UX or system context: strategy, audit, pick, voice
//
// 🔁 Used in: [list files or routes if known]
// 🔗 Dependencies: [context, hooks, libraries, etc]
// ✨ Added: Phase X.Y — Brief phase milestone title
// =============================================