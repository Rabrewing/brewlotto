# BrewLotto Data Source Matrix

**Version:** V1
**Date:** 2026-03-17 ET
**Scope:** North Carolina + California + multi-state games

## Source priority rules

Use this order for ingestion:

**Tier 1:** official lottery sources
**Tier 2:** trusted historical archive for backfill/verification
**Tier 3:** custom scraper/parser only when Tier 1 has no stable export/API

For **North Carolina**, the official past-draw pages are the best primary source because NC explicitly provides downloadable CSVs for multiple games. For **California**, the official site clearly exposes current and past winning numbers on the game pages, but I did not find a confirmed public CSV/export endpoint comparable to NC’s during this pass, so CA should use official pages for latest results and a trusted archive for historical backfill. ([North Carolina Lottery][1])

---

## 1) North Carolina source matrix

### NC Pick 3

**Primary:** NC official Pick 3 past draws page
**Trust:** High
**Use:** latest + historical + CSV ingestion
**Notes:** official site exposes past draws and NC’s past-draw pages support CSV download patterns. ([North Carolina Lottery][2])

### NC Pick 4

**Primary:** NC official Pick 4 past draws page
**Trust:** High
**Use:** latest + historical + CSV ingestion
**Notes:** treat the same way as Pick 3 in the pipeline; use official past-draw source first. The NC site’s past-draw pattern for these games is the strongest ingestion path. ([North Carolina Lottery][1])

### NC Cash 5

**Primary:** NC official Cash 5 past draws page
**Trust:** High
**Use:** latest + historical
**Notes:** official Cash 5 pages expose recent/past draw data directly on NC Lottery pages. ([North Carolina Lottery][3])

### NC Powerball

**Primary:** NC official Powerball past draws page
**Trust:** High
**Use:** latest + historical + CSV ingestion
**Notes:** NC explicitly says you may download a CSV file of past draws on the Powerball past page. ([North Carolina Lottery][4])

### NC Mega Millions

**Primary:** NC official Mega Millions past draws page
**Trust:** High
**Use:** latest + historical + CSV ingestion
**Notes:** NC explicitly says you may download a CSV file of past draws on the Mega Millions past page. ([North Carolina Lottery][1])

**NC implementation recommendation:**
Build the NC ingestors directly against the official past-draw pages and CSV flow. NC is your cleanest source family and should remain the canonical template for the rest of the platform. ([North Carolina Lottery][1])

---

## 2) California source matrix

### CA Daily 3

**Primary:** California official Daily 3 page
**Trust:** High for current/latest and on-page past results
**Use:** latest results validation
**Notes:** official page shows current winning numbers and states Daily 3 draws are twice daily. It includes a “Past Winning Numbers” section on the page, but I did not confirm a stable public CSV endpoint. ([California State Lottery][5])

**Historical fallback:** Lottery Post CA Daily 3 results archive
**Trust:** Medium-high
**Use:** historical backfill + verification sampling
**Notes:** Lottery Post exposes CA results and historical navigation for Daily 3. ([Lottery Post][6])

### CA Daily 4

**Primary:** California official Daily 4 page
**Trust:** High for current/latest and on-page past results
**Use:** latest results validation
**Notes:** official page shows current winning numbers and includes “Past Winning Numbers.” California draw-games listing confirms Daily 4 runs every day at 6:30 p.m. ([California State Lottery][7])

**Historical fallback:** Lottery Post CA Daily 4 archive
**Trust:** Medium-high
**Use:** historical backfill + verification sampling
**Notes:** Lottery Post exposes Daily 4 historical results and stats/search tooling. ([Lottery Post][8])

### CA Fantasy 5

**Primary:** California official Fantasy 5 page
**Trust:** High for latest/current
**Use:** latest results validation
**Notes:** official page shows winning numbers and game details; CA draw-games listing confirms Fantasy 5 draws daily at 6:30 p.m. ([California State Lottery][9])

**Historical fallback:** Lottery Post CA Fantasy 5 past archive
**Trust:** Medium-high
**Use:** historical backfill + verification sampling
**Notes:** Lottery Post provides deep past-result history for CA Fantasy 5. ([Lottery Post][10])

**CA implementation recommendation:**
For California, do **not** block the project waiting for a hidden CSV. Use the official game pages as the source of truth for latest draws and a trusted archive such as Lottery Post for historical backfill, then cross-check a sample of imported rows against the official pages. ([California State Lottery][5])

---

## 3) Normalized ingestion schema

Use one canonical table shape across NC and CA:

```txt
state
game
draw_date
draw_time
numbers
bonus_number
multiplier
source_name
source_url
source_tier
ingested_at
raw_payload
```

Why this works:

* NC and CA have different game naming and draw-time conventions.
* Some games have bonus/multiplier fields and some do not.
* Keeping `source_name`, `source_url`, and `source_tier` will make audits much easier. The official pages clearly vary by game and state, especially between NC CSV-backed pages and CA page-rendered results. ([North Carolina Lottery][1])

---

## 4) Build strategy for NemoTron

### Phase D1 — North Carolina official ingestion

Implement:

* `nc_pick3_ingestor`
* `nc_pick4_ingestor`
* `nc_cash5_ingestor`
* `nc_powerball_ingestor`
* `nc_mega_ingestor`

Use official pages first, and use CSV import where available. NC is already proving stable for you and should be the reference implementation. ([North Carolina Lottery][1])

### Phase D2 — California latest-results official parsers

Implement:

* `ca_daily3_official_parser`
* `ca_daily4_official_parser`
* `ca_fantasy5_official_parser`

These should parse the official pages for current/latest results and near-term validation. ([California State Lottery][5])

### Phase D3 — California historical backfill adapters

Implement:

* `ca_daily3_history_adapter`
* `ca_daily4_history_adapter`
* `ca_fantasy5_history_adapter`

Backfill from a trusted archive, then compare spot checks against official results. ([Lottery Post][6])

### Phase D4 — Verification layer

For each ingest job:

* compare parsed row count vs expected row count
* checksum normalized number string
* store raw payload/html snapshot
* mark source tier used

That matters especially for California, where official pages are human-facing and archive sources are serving as historical fallback. ([California State Lottery][5])

---

## 5) Trust scoring for BrewLotto

Use this internal trust model:

* **100** = official site + direct CSV/export
* **90** = official site page parse
* **75** = trusted archive with cross-check
* **60** = community dataset / unsupervised scrape

Applying that here:

* NC Powerball / Mega Millions official CSV-backed pages: **100** ([North Carolina Lottery][1])
* NC Cash 5 official pages: **90–100** depending on endpoint/export used ([North Carolina Lottery][3])
* CA official Daily 3 / Daily 4 / Fantasy 5 pages: **90** ([California State Lottery][5])
* Lottery Post CA historical archives: **75** until cross-checked ([Lottery Post][6])

---

## 6) Final PM recommendation

Your V1 ingestion stack should be:

**North Carolina:** official past-draw / CSV-first
**California latest:** official game pages
**California historical:** trusted archive + official spot-check validation

That gives you the fastest stable route to production without wasting cycles hunting undocumented California exports. ([North Carolina Lottery][1])

Next strongest artifact is the **NemoTron ingestion task order**, broken into exact build tickets for NC + CA adapters.

[1]: https://nclottery.com/mega-millions-past-draws?utm_source=chatgpt.com "Mega Millions - Past Draws"
[2]: https://nclottery.com/pick3-past-draws?utm_source=chatgpt.com "Pick 3 - Past Draws"
[3]: https://nclottery.com/cash5-past-draws?utm_source=chatgpt.com "Cash 5 - Past Draws"
[4]: https://nclottery.com/powerball-past-draws?utm_source=chatgpt.com "Powerball - Past Draws"
[5]: https://www.calottery.com/en/draw-games/daily-3?utm_source=chatgpt.com "Daily 3 | California State Lottery"
[6]: https://www.lotterypost.com/results/ca?utm_source=chatgpt.com "California (CA) Lottery Results"
[7]: https://www.calottery.com/en/draw-games/daily-4?utm_source=chatgpt.com "Daily 4 | California State Lottery"
[8]: https://www.lotterypost.com/results/ca/daily4?utm_source=chatgpt.com "California (CA) Daily 4 Lottery Results and Game Details"
[9]: https://www.calottery.com/en/draw-games/fantasy-5?utm_source=chatgpt.com "Fantasy 5 | California State Lottery"
[10]: https://www.lotterypost.com/results/ca/fantasy5/past?utm_source=chatgpt.com "California (CA) Fantasy 5 Lottery Results"