# BrewLotto AI — Data Pipeline Manual

**Author:** ChatGPT PM / Randy Brewington  
**Last updated:** 2025-06-28

---

## 📊 Overview

This manual is the **operator’s guide** for managing the end-to-end data pipeline of BrewLotto AI — from scraping and ingesting lottery results, to validating, storing, and using that data for analytics, smart picks, and UI updates.

---

## 📦 Directory Structure

- `/scripts/` — Data ingestion, scraping, upload, and utility scripts  
- `/utils/` — Data analyzers, fetchers, statistical logic  
- `/pages/api/` — API endpoints for frontend and analytics  
- `/db/` — SQL, migration files, or Supabase seeders (if present)  
- `/docs/` — All docs, manuals, and this operator’s guide  

---

## 1. ENV Setup

Ensure your `.env.local` contains:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

> Always use the correct Supabase project URL and keys. See `README.md` for examples.

---

## 2. Database Tables

See `/db/schema.sql` or Supabase dashboard for live schemas.

**Core Tables:**

- `pick3_draws`, `pick4_draws`, `pick5_draws`, `mega_draws`, `powerball_draws`  
  - Columns: `id`, `draw_date`, `draw_type`, `numbers`, etc.  
- `game_settings` — odds, payouts, rules per game (optional)  
- `play_logs` — user activity, bet logs (optional)  

---

## 3. Data Ingestion

### A. Auto-Scraping Historical Draws

Each game has a script in `/scripts/` (e.g. `scrapeNC_Pick3.js`) that:

- Fetches historical draw data (up to 24 months)  
- Parses draw date, numbers, draw type (day/evening)  
- Uploads results to Supabase  

**To run:**

```bash
node scripts/scrapeNC_Pick3.js
node scripts/scrapeNC_Pick4.js
node scripts/scrapeNC_Pick5.js
node scripts/scrapeMega.js
node scripts/scrapePowerball.js
```

**Troubleshooting:**

- **No data found?** Check selectors/URLs — source sites may have changed.  
- **Upload fails?** Confirm `.env` is loaded and Supabase keys have insert rights.  
- **Duplicates?** Use `upsert` with `onConflict` on `draw_date` + `draw_type`.  

---

### B. Live/Incremental Draws

- Set up a CRON job or Supabase Edge Function to scrape and upload new draws after each drawing.  
- Monitor results pages for updates before triggering ingest.  

---

### C. Manual Import

For legacy or bulk data:

1. Place CSVs in `/data/` (if used)  
2. Upload via Supabase dashboard or batch insert script  

---

## 4. Data Validation

- Confirm row counts and latest draw dates match official lottery sources  
- Use `/scripts/dbTest.js` to fetch and print latest rows per game  
- Ensure number arrays and draw types align with source data  

---

## 5. Data Analysis

Modules in `/utils/`:

- `poissonHotCold.js` — Frequency-based hot/cold + Poisson outlier detection  
- `analyzePick3.js`, `analyzePick4.js`, etc. — Game-specific analytics  
- `fetchDraws.js` — Fetches latest X draws by game  

---

## 6. API Endpoints

Unified endpoints:

- `/pages/api/stats/[game].js` — Returns stats, history, hot/cold  
- `/pages/api/predict/[game].js` — Runs analytics and returns smart picks  

**Usage:**

- Frontend fetches predictions/stats dynamically per game  
- All API files include header comments with path, purpose, and timestamp  

---

## 7. Dashboard & Frontend

- Dashboard auto-loads stats, odds, spend/wins, and live charts (Recharts)  
- Game pages fetch latest results and generate picks from real DB data  
- Navigation is consistent across Pick 3, 4, 5, Mega, and Powerball  

---

## 8. Troubleshooting & FAQ

**Q:** Scripts aren’t uploading?  
**A:** Check `.env` vars. Run `echo $NEXT_PUBLIC_SUPABASE_URL` before executing.

**Q:** Numbers don’t match the website?  
**A:** Scrape selectors may be outdated — inspect HTML for changes.

**Q:** “No data found!” in `dbTest.js`?  
**A:** Scrape failed, DB creds missing, or upsert logic isn’t matching.

---

## 9. Adding New Games or Fields

1. Create a new table in Supabase (mirror existing schema)  
2. Add or modify scrape script and analyzer  
3. Update `fetchDraws.js` and `poissonHotCold.js`  
4. Add new API routes: `/api/stats/[game].js`, `/api/predict/[game].js`  

---

## 10. Best Practices

- Always document file path, purpose, and timestamp at the top of scripts  
- Update `/docs/CHANGELOG.md` for every feature or breaking change  
- Only push code after DB health and pipeline validation  
- Use `README.md` for onboarding and this manual for operator logic  

---

## 11. Operator Checklist (Daily/Weekly)

- [ ] Validate all draws up to last 48 hours are present  
- [ ] Confirm no duplicate draws by date + type  
- [ ] Run dashboard and verify live results  
- [ ] Patch scrape scripts if source HTML changes  
- [ ] Log all fixes in `/docs/CHANGELOG.md`  

---

**BrewLotto AI — Data Integrity is Everything.**  
*When in doubt, check the logs, check the data, and call for help in the repo.*

---

*End of Manual*