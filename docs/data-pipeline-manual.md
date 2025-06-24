Absolutely, Commander! Here’s a **production-grade `/docs/data-pipeline-manual.md`** for BrewLotto AI.
This guide covers **data ingestion, validation, DB health checks, scripts, troubleshooting, and best practices** — tailored to your pipeline and onboarding new devs/ops.

---

## `/docs/data-pipeline-manual.md`

````markdown
# BrewLotto AI — Data Pipeline Manual

**Author:** ChatGPT PM / Randy Brewington  
**Last updated:** 2025-06-23

---

## 📊 Overview

This manual is the **operator’s guide** for managing the end-to-end data pipeline of BrewLotto AI — from scraping and ingesting lottery results, to validating, storing, and using that data for analytics, smart picks, and UI updates.

---

## 📦 Directory Structure

- `/scripts/`: Data ingestion, scraping, upload, and utility scripts.
- `/utils/`: Data analyzers, fetchers, statistical logic.
- `/pages/api/`: API endpoints for frontend and analytics.
- `/db/`: (If present) SQL, migration files, or Supabase seeders.
- `/docs/`: All docs, manuals, and this operator’s guide.

---

## 1. ENV Setup

1. Ensure your `.env.local` contains:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    SUPABASE_SERVICE_ROLE_KEY=...
    ```

2. Always use the correct Supabase *project URL* and keys (see README for examples).

---

## 2. Database Tables

See `/db/schema.sql` or Supabase dashboard for live schemas.

**Core Tables:**

- `pick3_draws`, `pick4_draws`, `pick5_draws`, `mega_draws`, `powerball_draws`
    - Columns: `id`, `draw_date`, `draw_type`, `numbers`, [other fields as needed]
- `game_settings` — odds, payouts, rules per game (optional)
- `play_logs` — user activity, bet logs (optional)

---

## 3. Data Ingestion

### A. Auto-Scraping Historical Draws

For each game, there is a script in `/scripts/` (ex: `scrapeNC_Pick3.js`, `scrapeMega.js`) which:

- Fetches historical draw data (up to 24 months or maximum available)
- Parses draw date, numbers, draw type (day/evening), etc.
- Uploads results to Supabase

#### To run:

```bash
node scripts/scrapeNC_Pick3.js
node scripts/scrapeNC_Pick4.js
node scripts/scrapeNC_Pick5.js
node scripts/scrapeMega.js
node scripts/scrapePowerball.js
````

#### Troubleshooting:

* **No data found?** Check selectors/URLs in the script; sites change HTML.
* **DB upload fails?** Confirm `.env` vars are loaded in the shell and Supabase keys/roles have insert rights.
* **Duplicates?** Use `upsert` with `onConflict` to dedupe by `draw_date` + `draw_type`.

---

### B. Live/Incremental Draws

* **For daily operation:** Set up a CRON job (or Supabase Edge Function) to scrape and upload **new** draws after each drawing (e.g., Pick 3 at 3:00pm & 11:22pm).
* **Recommended:** Monitor results page for updates, then trigger ingest.

---

### C. Manual Import

For bulk/CSV import (e.g., legacy data):

1. Place CSVs in `/data/` (if using).
2. Use a script (or Supabase dashboard) to upload via UI or batch insert.

---

## 4. Data Validation

* Always check that **row counts** and **latest draw dates** match the official lottery website.
* Use `/scripts/dbTest.js` to fetch and print latest rows for *each* game.
* Confirm that numbers arrays and draw types align with source data.

---

## 5. Data Analysis

**Analysis modules in `/utils/`:**

* `poissonHotCold.js`: Frequency-based hot/cold and Poisson outlier detection.
* `analyzePick3.js`, `analyzePick4.js`, etc.: Game-specific analytics.
* `fetchDraws.js`: Standard fetcher for latest X draws by game.

---

## 6. API Endpoints

All stats and prediction endpoints are now unified:

* `/pages/api/stats/[game].js` — Returns stats, history, hot/cold, etc.
* `/pages/api/predict/[game].js` — Runs analytics and returns best picks.

**Usage:**

* Frontend fetches predictions or stats dynamically per game route.
* All API files have header comments: path, purpose, and last updated.

---

## 7. Dashboard & Frontend

* The main dashboard auto-loads stats, odds, spend/wins, and live charts (Recharts).
* Each game page fetches the latest results and generates smart picks based on *actual* DB data (no mock data in production).
* Navigation is uniform for Pick 3, 4, 5, Mega, and Powerball.

---

## 8. Troubleshooting & FAQ

**Q:** My data scripts aren’t uploading!
**A:** Check `.env` vars. Run `echo $NEXT_PUBLIC_SUPABASE_URL` in shell before running the script.

**Q:** Numbers don’t match website?
**A:** Scrape selectors may be outdated. Inspect website HTML for table/class changes.

**Q:** How do I fix “No data found!” in `/scripts/dbTest.js`?
**A:** Either the scrape failed, DB creds are missing, or your upsert logic isn’t matching.

---

## 9. Adding New Games or Fields

1. Create a new table in Supabase (mirror existing draw schema).
2. Add/modify a scrape script and analyzer.
3. Update `/utils/fetchDraws.js` and `/utils/poissonHotCold.js` to handle the new game.
4. Add to dashboard and API routes: `/pages/api/stats/[game].js`, `/pages/api/predict/[game].js`.

---

## 10. Best Practices

* Always document **file path, purpose, and timestamp** at the top of scripts.
* Update `/docs/CHANGELOG.md` for *every* feature or breaking change.
* Only ever push code after **DB health** and **pipeline validation**.
* Use `README.md` as onboarding and `/docs/data-pipeline-manual.md` for all operator logic.

---

## 11. Operator Checklist (Daily/Weekly)

* [ ] Validate all draws up to last 48 hours are present for every game.
* [ ] Confirm no duplicate draws by date+type.
* [ ] Run dashboard and check for live, correct results.
* [ ] If scraping fails, patch scripts ASAP (HTML selectors change!).
* [ ] Log all fixes in `/docs/CHANGELOG.md`.

---

**BrewLotto AI — Data Integrity is Everything.**
*When in doubt, check the logs, check the data, and call for help in the repo.*

---

*End of Manual*

```

---

**Drop this as `/docs/data-pipeline-manual.md` in your repo** and you’re set for any dev or ops onboarding!  
Let me know if you want custom *sections for pipelines, Airflow, or workflow diagrams* — but this will cover everything BrewLotto AI needs for robust, operator-friendly data management.  
**Let’s keep the pipeline clean and your numbers sharp!**
```
