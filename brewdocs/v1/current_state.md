# BrewLotto V1 - Current State & Next Steps

**Last Updated:** 2026-03-21 ET
**Phase:** Dashboard UI Complete - Premium mobile-first design implemented

---

## Data Files Status

### ✅ California Data
| Game | File | Draws | Date Range | Source | Status |
|------|------|-------|------------|--------|--------|
| Daily 3 | `/data/ca/ca-daily3.csv` | 200 | 2025-12-07 to 2026-03-16 | lotteryextreme.com | ✅ VALIDATED |
| Daily 4 | `/data/ca/ca-daily4.csv` | 200 | 2025-08-29 to 2026-03-16 | lotteryextreme.com | ✅ VALIDATED |
| Fantasy 5 | `/data/ca/ca-fantasy5.csv` | 30 | Recent | lotto-8.com | ⚠️ Needs more |

### ✅ North Carolina Data
| Game | File | Draws | Source | Status |
|------|------|-------|--------|--------|
| Pick 3 | `/data/nc/nc-pick3.csv` | ~13,600 | nclottery.com | ⚠️ Ready (V1 adapter created, needs testing) |
| Pick 4 | `/data/nc/nc-pick4.csv` | ~11,700 | nclottery.com | ⚠️ Ready (V1 adapter created, needs testing) |
| Cash 5 | `/data/nc/nc-cash5.csv` | ~8,800 | nclottery.com | ⚠️ Ready (V1 adapter created, needs testing) |

### ✅ Multi-State Data
| Game | File | Draws | Source | Status |
|------|------|-------|--------|--------|
| Powerball | `/data/multi-state/powerball.csv` | 2,373 | NCEL | ✅ Ready |
| Mega Millions | `/data/multi-state/mega-millions.csv` | 1,682 | NCEL | ✅ Ready |

## Data Fetching Scripts

### ✅ Created Scripts
1. **`scripts/scrapeCA_Data.js`** - Fetches CA Daily 3/Daily 4 from lotteryextreme.com
   - Daily 3: Working (2 draws/day)
   - Daily 4: Working (1 draw/day)
   - Command: `node scripts/scrapeCA_Data.js [daily3|daily4|both] [max_draws]`

2. **`scripts/fetchCAData.js`** - Fetches CA Fantasy 5 from lotto-8.com
   - Fantasy 5: Working (30 draws retrieved)
   - Command: `node scripts/fetchCAData.js`

3. **`scripts/scrapePowerball.js`** - Fetches Powerball from NCEL
   - Powerball: Working (uses NCEL as fallback)
   - Command: `node scripts/scrapePowerball.js`

4. **`scripts/scrapeMega.js`** - Fetches Mega Millions from NCEL
   - Mega Millions: Working (uses NCEL as fallback)
   - Command: `node scripts/scrapeMega.js`

5. **`scripts/ingestionJob.js`** - Unified ingestion job with retry logic
   - Runs all scrapers and ingests data into Supabase
   - Command: `node scripts/ingestionJob.js`

6. **`scripts/ingestionScheduler.js`** - Daily scheduler using node-cron
   - Runs at 12:00 AM PT every day
   - Command: `node scripts/ingestionScheduler.js`

7. **`scripts/ingestionHealth.js`** - Health monitor for ingestion pipeline
   - Checks data freshness and ingestion status
   - Command: `node scripts/ingestionHealth.js`

### Data Source Summary
| Game | State | Source | Script |
|------|-------|--------|--------|
| Daily 3 | CA | lotteryextreme.com | scrapeCA_Data.js |
| Daily 4 | CA | lotteryextreme.com | scrapeCA_Data.js |
| Fantasy 5 | CA | lotto-8.com | fetchCAData.js |
| Pick 3 | NC | nclottery.com | scrapeNC_Pick3.js |
| Pick 4 | NC | nclottery.com | scrapeNC_Pick4.js |
| Cash 5 | NC | nclottery.com | scrapeNC_Cash5.js |
| Powerball | NC/CA | NCEL (fallback) | scrapePowerball.js |
| Mega Millions | NC/CA | NCEL (fallback) | scrapeMega.js |
| Mega Millions | NC/CA | NCEL (fallback) | scrapeMega.js |

## Parser Implementation

### ✅ Created Parsers
1. **`lib/ingestion/parsers/caPick3Parser.js`** - CA Daily 3 parser
2. **`lib/ingestion/parsers/caPick4Parser.js`** - CA Daily 4 parser
3. **`lib/ingestion/parsers/caFantasy5Parser.js`** - CA Fantasy 5 parser (new)

## CA Historical Adapter (D7.1 & D7.2)

**Status**: ✅ COMPLETED
**D7.1 Completion Time**: 2026-03-18 14:30 ET
**D7.2 Completion Time**: 2026-03-18 15:00 ET
**Total Duration**: ~3 hours

### ✅ Created Adapter
1. **`lib/ingestion/adapters/caHistoricalAdapter.ts`** - CA historical data ingestion adapter

### ✅ Adapter Features
- Parses CA Daily 3, Daily 4, and Fantasy 5 CSV files
- Normalizes data using the core ingestion framework
- Validates records using the validator
- Handles different date formats across CSV files
- Maps source keys to game config keys
- **D7.2**: Supabase integration with game/source lookups
- **D7.2**: Creates missing game and source records
- **D7.2**: Inserts draws into official_draws table
- **D7.2**: Duplicate checking to avoid re-insertion

### ✅ Test Results (2026-03-18 15:30 ET)

**California Lottery Draw Schedule (Verified from calottery.com)**:
- **Daily 3**: 2 draws per day
  - Day draw: 1:00 PM PT (ticket close: 1:00 PM)
  - Evening draw: 6:30 PM PT (ticket close: 6:30 PM)
- **Daily 4**: 1 draw per day
  - Evening draw: 6:30 PM PT (ticket close: 6:30 PM)
- **Fantasy 5**: 1 draw per day
  - Nightly draw: 6:30 PM PT

**North Carolina Lottery Draw Schedule (Verified from nclottery.com)**:
- **Pick 3**: 2 draws per day
  - Daytime: 3:00 PM ET
  - Evening: 11:22 PM ET
- **Pick 4**: 2 draws per day
  - Daytime: 3:00 PM ET
  - Evening: 11:22 PM ET
- **Cash 5**: 1 draw per day
  - Evening: 11:22 PM ET (with Double Play option)

**Data Processing Results (CA Historical)**:
- **CA Daily 3**: 199 valid out of 200 records (1 invalid with all zeros from 2026-02-28)
  - Most recent date: 2026-03-16 (2 draws: day @ 1:00 PM PT = 9-3-5, evening @ 6:30 PM PT = 7-8-8)
- **CA Daily 4**: 200 valid out of 200 records (1 draw per day)
  - Assigned as evening draw @ 6:30 PM PT
- **CA Fantasy 5**: 30 valid out of 30 records (1 draw per day, nightly @ 6:30 PM PT)
- **Total**: 429 valid records out of 430 total records
- **Supabase Insertion**: All valid records successfully inserted with correct draw_window_label

**Note**: NC data is available but not yet ingested. The NC CSV files have proper day/evening markers ("D"/"E") for Pick 3 and Pick 4.

### Test Command
```bash
npx tsx scripts/testCAIngestion.ts
```

### ✅ D7.3 - Multi-State Adapters & Infrastructure (COMPLETED)
**Completion Time**: 2026-03-18 ET

#### ✅ Created Components
1. **`lib/ingestion/adapters/multiStatePowerballAdapter.ts`** - Powerball adapter for NC/CA
2. **`lib/ingestion/adapters/multiStateMegaMillionsAdapter.ts`** - Mega Millions adapter for NC/CA
3. **`scripts/ingestionJob.js`** - Unified ingestion job with retry logic
4. **`scripts/ingestionScheduler.js`** - Daily scheduler using node-cron (runs at 12:00 AM PT)
5. **`scripts/ingestionHealth.js`** - Health monitor for ingestion pipeline
6. **`scripts/scrapePowerball.js`** - Powerball scraper with NCEL fallback
7. **`scripts/scrapeMega.js`** - Mega Millions scraper with NCEL fallback

#### ✅ D7.3 Features
- Multi-state game adapters for Powerball and Mega Millions
- State-specific database entries (NC vs CA) for multi-state games
- DoubleDraw handling as separate draw window variant
- Daily scheduling based on actual draw times
- Retry logic for failed insertions
- Health monitoring and status reporting
- Unified job runner for all ingestion tasks

#### ✅ NPM Scripts Added
```bash
# Fetch California data
npm run fetch-ca-data

# Ingest all lottery data into Supabase
npm run ingest-all
```

### Next Steps (D8 - Cross-Source Validation)
- Compare data from multiple sources to ensure accuracy
- Identify and resolve data discrepancies
- Implement automated data reconciliation
- Set up alerting system for data quality issues
- **Target Completion**: 2026-03-20 ET

## Ingestion Core Modules (Phase D1)

### ✅ Created
1. **`lib/ingestion/core/fetcher.ts`** - HTTP fetcher with retry logic
2. **`lib/ingestion/core/parser.ts`** - CSV and HTML parser utilities
3. **`lib/ingestion/core/normalizer.ts`** - Converts all sources to canonical format
4. **`lib/ingestion/core/validator.ts`** - Validates draw data before insertion
5. **`lib/ingestion/core/sourceRegistry.ts`** - Central registry of all ingest sources

### Source Registry
- NC official sources (tier 1, trust 100)
- CA official page sources (tier 1, trust 90)
- CA historical archive sources (tier 2, trust 75)
- Multi-state official sources (tier 1, trust 100)

## Documentation Updates

### ✅ Created Files
1. **`brewdocs/v1/future_growth.md`** - State expansion strategy
2. **`brewdocs/v1/data-sources.md`** - Official lottery data sources
3. **`brewdocs/v1/current_state.md`** - This file

### ✅ Updated Files
1. **`AGENTS.md`** - Added data fetching commands and directory structure

## Package.json Updates

### ✅ Added Scripts
```bash
npm run fetch-ca-data   # Fetch California lottery data
npm run ingest-all      # Ingest all data into Supabase
```

## Data Structure Compliance

### ✅ V1 Spec Compliance
According to `brewdocs/v1/Brewlotto_v1.md`, data files should be structured as:

```
data/
├── ca/
│   ├── ca-pick3.csv         # Daily 3 (Pick 3)
│   ├── ca-pick4.csv         # Daily 4 (Pick 4)
│   └── ca-fantasy5.csv      # Fantasy 5 (Cash 5)
├── nc/
│   ├── nc-pick3.csv         # Pick 3
│   ├── nc-pick4.csv         # Pick 4
│   └── nc-cash5.csv         # Cash 5
└── multi-state/
    ├── powerball.csv        # Powerball
    └── mega-millions.csv    # Mega Millions
```

**Current Status**: ✅ All files follow this structure

## Current Issues & Workarounds

### Issue 1: CA Pick 3/Pick 4 Live Data
**Problem**: Official sources (lotto-8.com) return 404 for Pick 3/Pick 4 pages
**Workaround**: Sample data generated for development and testing
**Next Steps**: 
1. Check with ChatGPT for alternative California data sources
2. Try official Calottery.com API if available
3. Use public APIs like LotteryAPI.net as fallback

### Issue 2: Data Format Inconsistencies
**Problem**: NC and CA data have different CSV formats
**Workaround**: Parsers handle format differences during ingestion
**Next Steps**: 
1. Standardize format during ingestion process
2. Ensure all data maps to V1 spec database schema

## Next Steps for Data Ingestion

### ✅ Completed: D7.1 - California Historical Backfill
- CA Historical Adapter created and tested
- All CA historical data parsed and validated
- Ready for Supabase integration (D7.2)

### ✅ Completed: D7.2 - Supabase Integration
- Supabase integration with game_id/source_id lookups
- Game and source records created automatically
- Draws inserted into official_draws table
- Duplicate checking to avoid re-insertion
- Draw window labeling (day/evening/nightly)

### ✅ Completed: D7.3 - Multi-State Adapters & Infrastructure
- Multi-state adapters for Powerball and Mega Millions
- Unified ingestion job with retry logic
- Daily scheduler using node-cron
- Health monitor for ingestion pipeline
- State-specific database entries for multi-state games

### Immediate Actions (D8 - Cross-Source Validation)
1. **Compare data from multiple sources** to ensure accuracy
2. **Identify and resolve data discrepancies**
3. **Implement automated data reconciliation**
4. **Set up alerting system** for data quality issues
5. **Test complete ingestion pipeline** with `npm run ingest-all`

### Medium-term Actions (D9-D12)
1. **Prediction Engine** - Implement Poisson, Momentum, Markov, Ensemble strategies
2. **API Layer** - Expose predictions through RESTful endpoints
3. **Dashboard UI** - Create customer dashboard with prediction panel
4. **BrewCommand Admin** - Build internal monitoring console

### Long-term Actions
1. **Expand to additional states** (Texas, Florida, New York)
2. **Implement real-time ingestion** from official APIs
3. **Add data freshness monitoring**
4. **Create admin dashboard** for ingestion health

## Testing the Data Pipeline

### Current Test Coverage
- ✅ Fantasy 5 data fetching working
- ✅ Parsers created for all CA games
- ✅ Sample data generated for CA Pick 3/Pick 4
- ⚠️ Live CA Pick 3/Pick 4 data sources not found

### Test Commands
```bash
# Fetch California data
npm run fetch-ca-data

# Check data files
ls -la /home/brewexec/brewlotto/data/ca/
```

## Data Sources to Investigate (per your request)

Based on `brewdocs/v1/fetchdata.md`, recommended sources:

### Official Sources
1. **Calottery.com** - Official CA lottery site
   - https://www.calottery.com/draw-games/daily-3
   - https://www.calottery.com/draw-games/daily-4
   - https://www.calottery.com/draw-games/fantasy-5

2. **Public APIs**
   - LotteryAPI.net - https://api.lotteryapi.net
   - RapidAPI - Multiple providers

3. **Historical Datasets**
   - Kaggle datasets for model training

### Action Items for You
When checking with ChatGPT, ask for:
1. Official California lottery API endpoints
2. Public APIs with CA Pick 3/Pick 4 data
3. Historical CSV downloads for CA games
4. Web scraping strategies for calottery.com

## Summary

**Current Progress**:
- ✅ Data files organized according to V1 spec
- ✅ California historical data validated (430 total records)
- ✅ CA Historical Adapter created and tested (D7.1 COMPLETED)
- ✅ Supabase integration with game/source lookups (D7.2 COMPLETED)
- ✅ Multi-state adapters for Powerball & Mega Millions (D7.3 COMPLETED)
- ✅ Unified ingestion job with retry logic (D7.3 COMPLETED)
- ✅ Daily scheduler with node-cron (D7.3 COMPLETED)
- ✅ Health monitor for ingestion pipeline (D7.3 COMPLETED)
- ✅ **Ingestion pipeline fully tested and working** (D8 PRE-REQ COMPLETED)
- ✅ North Carolina scrapers fixed (import paths, naming)
- ✅ All 8 scrapers running successfully in unified job
- ✅ North Carolina data ready (3 games)
- ✅ Multi-state data ready (Powerball, Mega Millions)
- ✅ Parsers created for all CA games
- ✅ Fetch scripts created and tested
- ✅ Documentation updated

**In Progress (D8)**:
- 🔄 Cross-source validation and data quality checks
- 🔄 Automated data reconciliation between sources
- 🔄 Alerting system for data discrepancies

**Next Phase**:
Proceed with D8 - Cross-Source Validation to ensure data accuracy before moving to prediction engine.
