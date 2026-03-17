# BrewLotto — NemoTron Ingestion Task Order

**Project:** BrewLotto AI
**Phase:** V1 Data Ingestion Execution
**Timestamp:** 2026-03-17 ET
**Root:** `/brewexec/`

## Objective

Build a reliable ingestion system for:

* North Carolina Pick 3
* North Carolina Pick 4
* North Carolina Cash 5
* Powerball
* Mega Millions
* California Daily 3
* California Daily 4
* California Fantasy 5

The system must support:

* historical backfill
* scheduled updates
* normalized storage
* source trust logging
* verification and replay

---

## Execution Rule

Build in this order only:

1. shared ingestion foundation
2. normalized schema
3. NC official ingestors
4. NC scheduler + verification
5. CA official latest parsers
6. CA historical adapters
7. cross-source validation
8. admin monitoring hooks

Do **not** start with scraping-first chaos.
NC is the canonical model.

---

# Ticket D1 — Shared Ingestion Foundation

## Goal

Create the reusable ingestion framework.

## Deliverables

```txt
/lib/ingestion/
  core/
    fetcher.ts
    parser.ts
    normalizer.ts
    validator.ts
    checksum.ts
    trustScore.ts
    sourceRegistry.ts
  jobs/
  adapters/
  utils/
```

## Required modules

### `fetcher.ts`

Handles:

* HTTP fetch
* retries
* timeout control
* user-agent headers
* HTML/CSV/JSON handling

### `parser.ts`

Handles:

* CSV parsing
* HTML table parsing
* structured row extraction

### `normalizer.ts`

Converts all source formats into one BrewLotto draw shape.

### `validator.ts`

Checks:

* required fields
* valid number count
* duplicate prevention
* invalid date rejection

### `checksum.ts`

Creates a stable row fingerprint.

Example:

```ts
checksum = `${state}|${game}|${draw_date}|${draw_time}|${numbers.join("-")}|${bonus ?? ""}`;
```

### `trustScore.ts`

Assign source trust:

* 100 = official CSV
* 90 = official page parse
* 75 = trusted archive
* 60 = community backup

### `sourceRegistry.ts`

Central registry of all source configs.

---

# Ticket D2 — Canonical Schema

## Goal

Create normalized storage tables.

## Core table

```sql
create table lottery_draws (
  id uuid primary key default gen_random_uuid(),
  state text not null,
  game text not null,
  draw_date date not null,
  draw_time text,
  numbers jsonb not null,
  bonus_number integer,
  multiplier text,
  source_name text not null,
  source_url text,
  source_tier integer,
  trust_score integer,
  checksum text unique not null,
  raw_payload jsonb,
  ingested_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
```

## Logging table

```sql
create table ingestion_logs (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  game text not null,
  state text not null,
  status text not null,
  records_fetched integer default 0,
  records_inserted integer default 0,
  records_skipped integer default 0,
  error_message text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  metadata jsonb default '{}'::jsonb
);
```

## Source registry table

```sql
create table ingestion_sources (
  id uuid primary key default gen_random_uuid(),
  source_key text unique not null,
  state text not null,
  game text not null,
  source_name text not null,
  source_url text,
  source_type text not null,
  source_tier integer not null,
  trust_score integer not null,
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now()
);
```

---

# Ticket D3 — NC Official Ingestors

## Goal

Implement official NC ingestion first.

## Build these adapters

```txt
/lib/ingestion/adapters/
  ncPick3Official.ts
  ncPick4Official.ts
  ncCash5Official.ts
  ncPowerballOfficial.ts
  ncMegaOfficial.ts
```

## Responsibilities

Each adapter must:

* fetch official source
* parse historical rows
* normalize data
* compute checksum
* upsert into `lottery_draws`
* log run into `ingestion_logs`

## Standard output

```ts
type NormalizedDraw = {
  state: string;
  game: string;
  draw_date: string;
  draw_time?: string | null;
  numbers: number[];
  bonus_number?: number | null;
  multiplier?: string | null;
  source_name: string;
  source_url?: string;
  source_tier: number;
  trust_score: number;
  checksum: string;
  raw_payload?: unknown;
};
```

## Game mapping

* `NC_PICK3`
* `NC_PICK4`
* `NC_CASH5`
* `POWERBALL`
* `MEGA_MILLIONS`

---

# Ticket D4 — NC Historical Backfill Runner

## Goal

Create backfill support for all NC games.

## Deliverables

```txt
/scripts/ingestion/
  runNcBackfill.ts
  runNcSingleGame.ts
```

## Requirements

* configurable date ranges
* dry-run mode
* dedupe-safe
* resumable
* logs inserted counts
* writes failure report

## CLI examples

```bash
pnpm tsx scripts/ingestion/runNcBackfill.ts
pnpm tsx scripts/ingestion/runNcSingleGame.ts --game=pick3
```

---

# Ticket D5 — Scheduler Layer

## Goal

Automate recurring ingestion.

## Deliverables

```txt
/lib/ingestion/jobs/
  scheduleNcPick3.ts
  scheduleNcPick4.ts
  scheduleNcCash5.ts
  schedulePowerball.ts
  scheduleMega.ts
  scheduleCaDaily3.ts
  scheduleCaDaily4.ts
  scheduleCaFantasy5.ts
```

## Requirements

Each job must:

* call adapter
* prevent duplicate overlapping runs
* write job result
* support manual trigger

## Recommended cadence

* Pick 3 / Daily 3: twice daily
* Pick 4 / Daily 4: twice daily
* Cash 5 / Fantasy 5: nightly
* Powerball / Mega Millions: draw days + nightly verification

---

# Ticket D6 — CA Official Latest Parsers

## Goal

Parse official California latest draw surfaces.

## Build these adapters

```txt
/lib/ingestion/adapters/
  caDaily3Official.ts
  caDaily4Official.ts
  caFantasy5Official.ts
```

## Scope

These adapters are for:

* latest draw ingestion
* near-term history if exposed on-page
* validation source

## Requirements

* support page HTML parsing
* extract draw date
* extract draw time
* extract numbers
* persist raw HTML snapshot or parsed raw block
* assign trust score 90

## Game mapping

* `CA_DAILY3`
* `CA_DAILY4`
* `CA_FANTASY5`

---

# Ticket D7 — CA Historical Adapters

## Goal

Backfill California history from trusted archive source.

## Build these adapters

```txt
/lib/ingestion/adapters/
  caDaily3History.ts
  caDaily4History.ts
  caFantasy5History.ts
```

## Responsibilities

* fetch archive pages
* parse date-indexed rows
* normalize format
* assign trust score 75 by default
* mark source tier 2
* support batch page crawling

## Rules

* do not overwrite official rows unless explicitly authorized
* if same checksum exists from official source, skip archive row
* if archive row conflicts with official row, flag for review

---

# Ticket D8 — Cross-Source Validation Engine

## Goal

Compare archive-ingested CA rows against official data samples.

## Deliverables

```txt
/lib/ingestion/core/
  compareSources.ts
  auditDiff.ts
```

## Validation checks

* date equality
* number equality
* bonus equality if applicable
* draw time consistency
* duplicate row detection

## Output

```ts
type SourceDiff = {
  state: string;
  game: string;
  draw_date: string;
  official_numbers?: number[];
  archive_numbers?: number[];
  status: "match" | "mismatch" | "missing_official" | "missing_archive";
};
```

## Admin behavior

* store mismatches
* expose review queue in BrewCommand later

---

# Ticket D9 — Source Registry Config

## Goal

Centralize all ingest source definitions.

## Deliverable

```txt
/lib/ingestion/core/sourceRegistry.ts
```

## Example shape

```ts
export const INGESTION_SOURCES = {
  nc_pick3_official: {
    state: "NC",
    game: "pick3",
    tier: 1,
    trustScore: 100,
    sourceType: "official",
  },
  ca_daily3_official: {
    state: "CA",
    game: "daily3",
    tier: 1,
    trustScore: 90,
    sourceType: "official-page",
  },
  ca_daily3_history: {
    state: "CA",
    game: "daily3",
    tier: 2,
    trustScore: 75,
    sourceType: "trusted-archive",
  },
};
```

---

# Ticket D10 — Admin Monitoring Hooks

## Goal

Prepare BrewCommand visibility for ingestion health.

## Deliverables

```txt
/lib/admin/ingestion/
  getIngestionHealth.ts
  getRecentIngestionLogs.ts
  getSourceMismatchQueue.ts
```

## Data to expose

* last successful run by source
* failed jobs
* inserted/skipped counts
* mismatch queue
* stale source warning
* trust score summary

---

# Ticket D11 — Prediction Trigger Integration

## Goal

Prepare ingestion to trigger downstream prediction workflows.

## Rule

Prediction engine should run only after:

* draw successfully inserted
* validation passed
* no checksum conflict

## Deliverables

```txt
/lib/ingestion/core/
  onDrawInserted.ts
```

## Hook behavior

```ts
if (inserted && validated) {
  triggerPredictionPipeline({ state, game, draw_date });
}
```

---

# Ticket D12 — Testing Layer

## Goal

Make ingestion reliable before frontend depends on it.

## Required test files

```txt
/tests/ingestion/
  ncPick3Official.test.ts
  ncPick4Official.test.ts
  ncCash5Official.test.ts
  ncPowerballOfficial.test.ts
  ncMegaOfficial.test.ts
  caDaily3Official.test.ts
  caDaily4Official.test.ts
  caFantasy5Official.test.ts
  caDaily3History.test.ts
  caDaily4History.test.ts
  caFantasy5History.test.ts
  validator.test.ts
  checksum.test.ts
  compareSources.test.ts
```

## Test coverage

* parser correctness
* normalizer correctness
* dedupe safety
* invalid row rejection
* source diff handling
* checksum uniqueness

---

# Delivery Order Summary

## Sprint 1

* D1 Shared ingestion foundation
* D2 Canonical schema
* D3 NC official ingestors

## Sprint 2

* D4 NC backfill runner
* D5 Scheduler layer
* D12 NC tests

## Sprint 3

* D6 CA official latest parsers
* D7 CA historical adapters

## Sprint 4

* D8 Cross-source validation
* D9 Source registry
* D10 Admin hooks

## Sprint 5

* D11 Prediction trigger integration
* final hardening
* mismatch review support

---

# Hard Rules for NemoTron

1. **NC is the gold-standard ingestion template**
2. **California latest and California historical are separate adapters**
3. **Never mix raw source formats directly into prediction logic**
4. **Everything must normalize into one canonical schema**
5. **All rows need checksums**
6. **All jobs need logs**
7. **No silent failures**
8. **Raw payload snapshots must be preserved for audits**
9. **Official sources always outrank archive sources**
10. **Frontend must never depend on unvalidated source rows**

---

# PM Final Directive

Start with:

* D1
* D2
* D3

Do not touch CA history until NC official ingestion, logging, and dedupe are stable.

Once NC is stable, California becomes a controlled adapter problem instead of a moving-target ingestion mess.

If you want, I’ll format this next into a **Gemini Execution Protocol / NemoTron handoff prompt** so you can paste it directly into OpenCode.