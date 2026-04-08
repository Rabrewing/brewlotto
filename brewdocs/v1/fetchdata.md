# BrewLotto V1 Data Fetching Strategy

This document outlines the recommended data fetching strategy for BrewLotto V1, focusing on North Carolina and California lottery data acquisition with multiple fallback layers for reliability and accuracy.

## Overview

BrewLotto V1 employs a multi-layered data acquisition strategy prioritizing:
1. **Accuracy** - Official sources first
2. **Reliability** - Multiple fallback options
3. **Compliance** - Respecting terms of service and rate limits
4. **Maintainability** - Clear separation of concerns

## 1️⃣ Official Lottery Data Sources (Primary)

### North Carolina Education Lottery
- **Website**: https://www.nclottery.com
- **Key Pages**:
  - Pick 3: https://www.nclottery.com/pick3
  - Pick 4: https://www.nclottery.com/pick4
  - Cash 5: https://www.nclottery.com/cash5
  - Mega Millions: https://www.nclottery.com/megamillions
  - Powerball: https://www.nclottery.com/powerball
- **Data Format**: Structured JSON embedded in page payload
- **Available Fields**: drawDate, winningNumbers, bonusBall, jackpot, multiplier
- **Update Frequency**: Real-time after draws

### California State Lottery
- **Website**: https://www.calottery.com
- **Key Pages**:
  - Powerball: https://www.calottery.com/draw-games/powerball
  - Mega Millions: https://www.calottery.com/draw-games/mega-millions
  - Daily 3: https://www.calottery.com/draw-games/daily-3
  - Daily 4: https://www.calottery.com/draw-games/daily-4
  - Fantasy 5: https://www.calottery.com/draw-games/fantasy-5
- **Data Format**: API calls in browser network layer + embedded JSON
- **Update Frequency**: Real-time after draws

## 2️⃣ Public Lottery APIs (Secondary - Development Friendly)

### LotteryAPI.net
- **Endpoint**: https://api.lotteryapi.net
- **Supported Games**: Powerball, Mega Millions, Pick 3/Daily 3, Pick 4, Cash 5 variants
- **Example Request**: `https://api.lotteryapi.net/results?game=powerball`
- **Rate Limits**: Check provider documentation
- **Reliability**: High for development and testing

### RapidAPI Lottery Data
- **Platform**: RapidAPI
- **Typical Endpoint**: `GET /lottery/powerball/results`
- **Advantages**:
  - Quick integration
  - Historical draw results available
  - Multiple providers in one platform
- **Consideration**: May require subscription for high-volume usage

## 3️⃣ Historical Dataset Sources (Model Training & Backtesting)

### Kaggle Datasets
- **Platform**: Kaggle
- **Recommended Datasets**:
  - Powerball historical results
  - Mega Millions history
  - Daily lottery results (Pick 3, Pick 4, Daily 3, Daily 4)
- **Use Cases**:
  - Markov chain model training
  - Poisson distribution analysis
  - Frequency analysis (hot/cold numbers)
  - Entropy and randomness testing
  - Backtesting prediction strategies
- **Update Frequency**: Periodic (manual refresh recommended)

## 4️⃣ Scraping Strategy (Tertiary Fallback)

When official sources and APIs are unavailable, BrewLotto implements a robust scraping fallback:

### Recommended Tools
- **Playwright** - For complex JavaScript-heavy sites
- **Puppeteer** - Alternative to Playwright
- **Cheerio** - For lightweight HTML parsing (when JS not required)

### Scraping Pipeline
```
Lottery Website
      ↓
Scraper (with error handling & retries)
      ↓
Parser (source-specific normalization)
      ↓
Data Validation & Deduplication
      ↓
Supabase Draw Table Storage
```

### Scheduling
- **Cron Job**: Every 10 minutes during active draw windows
- **Adaptive Frequency**: Reduced frequency during off-hours
- **Failure Alerts**: Notification system for consecutive failures

## 5️⃣ BrewLotto Data Pipeline Architecture

### Recommended Stack
```
[Official Lottery APIs]  →  [Ingestion Service]  →  [Normalization Layer]  →  [Supabase PostgreSQL]  →  [Prediction Engine]
                           ↓
                  [Public APIs (Fallback)]
                           ↓
                  [Scraping (Last Resort)]
                           ↓
                  [Historical Datasets (Backfill)]
```

### Core Tables
- `games` - Lottery game definitions (NC Pick 3, CA Powerball, etc.)
- `draws` - Historical draw results with source attribution
- `prediction_requests` - User/API requests for predictions
- `predictions` - Generated predictions with confidence metrics
- `draw_ingestion_runs` - Audit trail of data collection jobs
- `draw_ingestion_errors` - Detailed error logging for troubleshooting

## 6️⃣ Critical Draw Times (For Automation Scheduling)

### North Carolina (ET)
- **Pick 3**: 3:00 PM & 11:22 PM ET
- **Pick 4**: 3:00 PM & 11:22 PM ET
- **Cash 5**: 11:22 PM ET
- **Powerball**: Wednesday & Saturday 10:59 PM ET
- **Mega Millions**: Tuesday & Friday 11:00 PM ET

### California (PT)
- **Daily 3**: 1:29 PM & 6:59 PM PT
- **Daily 4**: 1:29 PM & 6:59 PM PT
- **Fantasy 5**: 6:35 PM PT
- **Powerball**: Wednesday & Saturday 7:59 PM PT
- **Mega Millions**: Tuesday & Friday 8:00 PM PT

*Note: All times should be converted to UTC for consistent scheduling*

## 7️⃣ Recommended Production Setup for V1

### Initial Implementation (V1 Launch)
```
Primary Source: LotteryAPI.net (reliable, well-documented)
Fallback: Official lottery website scraping
Historical: Kaggle datasets for model training
```

### Evolution Path (Post-V1)
```
Phase 2: Direct NC lottery ingestion
Phase 3: Direct CA lottery ingestion
Phase 4: Real-time websocket subscriptions (if offered by lotteries)
```

## 8️⃣ Implementation Guidelines

### Error Handling & Resilience
1. **Retry Logic**: Exponential backoff (1s, 2s, 4s, 8s, 16s max)
2. **Circuit Breaker**: Temporarily disable failing sources after 5 consecutive failures
3. **Fallback Chaining**: Official → API → Scrape → Cached (last known good)
4. **Data Validation**: Schema validation, range checks, duplicate prevention
5. **Logging**: Structured JSON logs with correlation IDs for tracing

### Data Quality Measures
1. **Deduplication**: Unique constraint on (game_id, draw_date, draw_window_label, draw_sequence)
2. **Source Attribution**: Track which source provided each data point
3. **Freshness Monitoring**: `draw_freshness_status` table with staleness alerts
4. **Validation Layer**: Cross-check numbers against game rules (e.g., Pick 3 numbers 0-9)
5. **Audit Trail**: Complete history of ingestion runs and transformations

### Performance Considerations
1. **Batch Processing**: Collect multiple draws before DB writes
2. **Connection Pooling**: Efficient Supabase client usage
3. **Caching**: Short-term cache for frequently accessed recent draws
4. **Indexing**: Proper database indexes for query performance
5. **Monitoring**: Metrics on latency, success rates, data volume

## 9️⃣ V1 Specific Implementation Notes

### For North Carolina & California Only (V1 Scope)
- Initial implementation focuses on these two states
- Architecture designed for easy state expansion
- Game configurations stored in `lottery_games` table
- Source configurations in `draw_sources` table

### Data Retention Policy
- **Raw Draw Data**: Indefinite (core historical record)
- **Ingestion Logs**: 90 days (operational troubleshooting)
- **Error Logs**: 30 days (unless escalated to incidents)
- **API Responses**: Not stored (reconstructed from draw data)

## 10️⃣ Compliance & Best Practices

### Rate Limiting & Etiquette
1. **Respect Robots.txt**: Check and follow website crawling policies
2. **Identify Yourself**: Set proper User-Agent string identifying BrewLotto
3. **Reasonable Frequency**: Avoid overwhelming servers (1 request/second max per source)
4. **Official API Preference**: Use sanctioned APIs when available and affordable
5. **Terms of Service Review**: Periodic review of source websites' ToS

### Security Considerations
1. **Input Validation**: All external data treated as untrusted
2. **Output Encoding**: Prevent XSS in any web displays
3. **Secrets Management**: API keys stored in environment variables, not code
4. **Network Security**: Prefer HTTPS, validate SSL certificates
5. **Dependency Scanning**: Regular vulnerability checks on scraping/parsing libraries

## Conclusion

This multi-layered approach ensures BrewLotto V1 maintains:
- **High Accuracy** through primary official sources
- **High Availability** through intelligent fallback chains
- **Operational Simplicity** through clear separation of concerns
- **Future Expandability** for additional states and data types
- **Regulatory Compliance** through respectful data acquisition practices

The initial V1 implementation should prioritize the LotteryAPI.net + Official Website Scrape combination, with pathways to evolve toward direct state lottery integrations as the product matures.