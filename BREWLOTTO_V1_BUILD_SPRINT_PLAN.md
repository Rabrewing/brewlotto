# BrewLotto V1 Build Sprint Plan (Day-by-Day for NemoTron Super)

**Version:** V1 Sprint Plan  
**Date:** 2026-03-16  
**Prepared For:** NemoTron Super (OpenCode Development Agent)  
**Project Root:** `/brewexec/`  

This plan breaks down the V1 implementation into actionable daily sprints following the **strict implementation order** from the NemoTron Super Execution Brief. Each day focuses on completing one phase or a logical subset of work.

---

## 📅 SPRINT OVERVIEW

| Phase | Duration | Goal | Success Criteria |
|-------|----------|------|------------------|
| **Phase 1** | Day 1 | Repository Foundation | Project structure matches V1 specification |
| **Phase 2** | Day 2-3 | Database Schema | Core tables created with proper relationships |
| **Phase 3** | Day 4-7 | Data Ingestion Engine | Historical data loads correctly for NC & CA games |
| **Phase 4** | Day 8-12 | Prediction Engine | Deterministic strategies generate explainable picks |
| **Phase 5** | Day 13 | Prediction Storage | Predictions stored with full audit metadata |
| **Phase 6** | Day 14-15 | API Layer | RESTful endpoints expose predictions with caching |
| **Phase 7** | Day 16-20 | Dashboard UI | Customer dashboard displays game tabs and predictions |
| **Phase 8** | Day 21-22 | BrewCommand Admin | Internal monitoring shows strategy performance |
| **Phase 9** | Day 23-24 | AI Commentary Layer | LLM explanations generated (never for picks) |
| **Phase 10** | Day 25-26 | Billing + Premium Features | Stripe subscriptions and tier-gating functional |

**Total Estimated Time:** 26 days  
**Buffer Time:** +3 days for unexpected issues  
**Hard Deadline:** Day 29 (allows for review, testing, and polish)

---

## 📋 DETAILED DAILY BREAKDOWN

### **Phase 1 — Repository Foundation** (Day 1)
**Goal:** Create the exact project structure as defined in V1 specification

**Tasks:**
1. Create root directory structure:
   ```
   /brewexec/
   ├─ app/
   │   ├─ brewlotto/
   │   ├─ dashboard/
   │   └─ api/
   │
   ├─ components/
   │   └─ brewlotto/
   │
   ├─ lib/
   │   ├─ prediction/
   │   ├─ ingestion/
   │   ├─ probability/
   │   ├─ analytics/
   │   └─ brewtruth/
   │
   ├─ strategies/
   │   ├─ poisson/
   │   ├─ momentum/
   │   ├─ markov/
   │   └─ ensemble/
   │
   ├─ supabase/
   │   ├─ schema/
   │   └─ migrations/
   │
   ├─ brew-command/
   │   ├─ monitoring/
   │   ├─ audit/
   │   └─ strategy-control/
   │
   ├─ tests/
   │
   └─ brewdocs/
   ```

2. Initialize git repository (if not already done)
3. Set up basic Next.js app with TypeScript
4. Configure Tailwind CSS
5. Set up ESLint and Prettier
6. Create basic README pointing to V1 documentation

**Success Criteria:**
- `find /brewexec -type d` shows all required directories
- `npm run dev` starts without errors
- Basic Next.js app loads at http://localhost:3000

---

### **Phase 2 — Database Schema** (Days 2-3)
**Goal:** Create database tables for games, draws, predictions, strategy_metrics, and user_predictions

**Day 2 Tasks:**
1. Set up Supabase project (if not existing)
2. Create `games` table:
   ```sql
   CREATE TABLE games (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     state VARCHAR(2) NOT NULL, -- NC, CA, etc.
     key VARCHAR(50) NOT NULL UNIQUE, -- pick3, powerball, etc.
     label VARCHAR(100) NOT NULL, -- "Pick 3", "Powerball"
     region VARCHAR(10) DEFAULT 'NC',
     primary_count INTEGER NOT NULL,
     primary_digits INTEGER, -- for Pick 3/4
     pool_max INTEGER, -- for pool games
     has_bonus BOOLEAN DEFAULT FALSE,
     bonus_label VARCHAR(50), -- "Powerball", "Mega Ball"
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

3. Insert initial game data for NC & CA:
   - Pick 3 (NC, CA)
   - Pick 4 (NC, CA)
   - Cash 5 (NC, CA - different pool max)
   - Powerball (NC, CA)
   - Mega Millions (NC, CA)

**Day 3 Tasks:**
1. Create `draws` table:
   ```sql
   CREATE TABLE draws (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     game_id UUID REFERENCES games(id) NOT NULL,
     draw_date DATE NOT NULL,
     draw_type VARCHAR(20) NOT NULL, -- 'day', 'evening'
     numbers INTEGER[] NOT NULL,
     bonus_number INTEGER,
     source VARCHAR(50) DEFAULT 'official',
     created_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE(game_id, draw_date, draw_type)
   );
   ```

2. Create `predictions` table:
   ```sql
   CREATE TABLE predictions (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id),
     game_id UUID REFERENCES games(id) NOT NULL,
     draw_date DATE NOT NULL,
     strategy VARCHAR(50) NOT NULL,
     numbers INTEGER[] NOT NULL,
     bonus_number INTEGER,
     probability_score DECIMAL(5,4),
     explanation TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

3. Create `strategy_metrics` table:
   ```sql
   CREATE TABLE strategy_metrics (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     game_id UUID REFERENCES games(id) NOT NULL,
     strategy VARCHAR(50) NOT NULL,
     period_start DATE NOT NULL,
     period_end DATE NOT NULL,
     total_predictions INTEGER DEFAULT 0,
     correct_predictions INTEGER DEFAULT 0,
     accuracy_rate DECIMAL(5,4),
     avg_probability DECIMAL(5,4),
     last_updated TIMESTAMPTZ DEFAULT NOW()
   );
   ```

4. Create `user_predictions` table:
   ```sql
   CREATE TABLE user_predictions (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id) NOT NULL,
     prediction_id UUID REFERENCES predictions(id) NOT NULL,
     numbers_played INTEGER[] NOT NULL,
     amount_spent DECIMAL(10,2) DEFAULT 0.00,
     play_date DATE NOT NULL,
     outcome VARCHAR(20) DEFAULT 'pending', -- pending, win, loss
     prize_amount DECIMAL(10,2) DEFAULT 0.00,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

5. Enable Row Level Security (RLS) on all tables
6. Create basic policies for public read access to games and draws
7. Set up Supabase client libraries in `/lib/supabase/`

**Success Criteria:**
- All tables created successfully in Supabase
- Can insert and query data via Supabase client
- RLS policies active and working
- Database schema matches V1 specification exactly

---

### **Phase 3 — Data Ingestion Engine** (Days 4-7)
**Goal:** Build ingestion pipeline to fetch, normalize, and store historical draw data

**Day 4 Tasks:**
1. Create `/lib/ingestion/` directory structure
2. Build base ingestion service:
   - Scheduler interface (node-cron or similar)
   - State/game-specific adapter pattern
   - Data validation and normalization utilities
   - Deduplication and idempotency checks
   - Persistence write operations to Supabase
3. Create base adapter interface:
   ```javascript
   class BaseAdapter {
     async fetch() {}
     async normalize(rawData) {}
     async validate(normalizedData) {}
     async persist(normalizedData) {}
   }
   ```

**Day 5 Tasks:**
1. Implement NC Pick 3 adapter:
   - Fetch from official NC lottery source
   - Parse draw date, numbers, draw type
   - Normalize to standard format
   - Write to `draws` table via Supabase
2. Implement NC Pick 4 adapter (similar pattern)
3. Create ingestion scheduler that runs adapters on schedule
4. Add health monitoring and freshness status reporting
5. Implement error handling and retry logic

**Day 6 Tasks:**
1. Implement CA Pick 3 and Pick 4 adapters
2. Implement Cash 5 adapters for NC and CA (different pool max)
3. Implement Powerball adapters for NC and CA
4. Implement Mega Millions adapters for NC and CA
5. Add anomaly detection for unusual patterns
6. Create data validation suite (`scripts/validateDrawData.js`)

**Day 7 Tasks:**
1. Test ingestion for all games in both states
2. Verify historical data loads correctly (24 months)
3. Implement late-posting tolerance
4. Create ingestion failure alerts and logging
5. Run data validation suite to ensure integrity
6. Document ingestion pipeline in `/brewdocs/v1/BREWLOTTO_V1_DATA_INGESTION_SPEC.md`

**Success Criteria:**
- Historical draw data loads correctly for all NC and CA games
- Ingestion runs on schedule without manual intervention
- Data validation passes for all ingested records
- Anomaly detection flags unusual patterns
- Ingestion health monitoring shows freshness status
- Can manually trigger ingestion for testing

---

### **Phase 4 — Prediction Engine** (Days 8-12)
**Goal:** Implement statistical core with Poisson, Momentum, Markov, and Ensemble strategies

**Day 8 Tasks:**
1. Create `/lib/prediction/` directory structure
2. Implement base strategy interface:
   ```javascript
   class BaseStrategy {
     constructor(gameConfig) {}
     async extractFeatures(drawData) {}
     async generateNumbers(featureSet) {}
     async getExplanation(numbers, featureSet) {}
     getStrategyName() {}
   }
   ```
3. Create feature extraction module:
   - Hot/cold number analysis
   - Overdue/gap analysis
   - Sum/spread analysis
   - Positional analysis
   - Parity/odd-even analysis
   - Mirror/pair analysis

**Day 9 Tasks:**
1. Implement Poisson strategy:
   - Probability modeling for number frequency
   - Calculate expected frequencies
   - Generate numbers based on probability distribution
   - Provide statistical explanation
2. Test Poisson strategy with historical data
3. Verify deterministic output (same seed = same output)

**Day 10 Tasks:**
1. Implement Momentum strategy:
   - Detect trending numbers
   - Weight recent draws more heavily
   - Generate numbers based on momentum signals
   - Provide trend-based explanation
2. Test Momentum strategy with historical data
3. Verify deterministic output

**Day 11 Tasks:**
1. Implement Markov Chain strategy:
   - Identify sequential number relationships
   - Calculate transition probabilities
   - Generate numbers based on state transitions
   - Provide sequence-based explanation
2. Test Markov strategy with historical data
3. Verify deterministic output

**Day 12 Tasks:**
1. Implement Ensemble Engine:
   - Strategy scoring based on historical performance
   - Weighted ranking of candidate outputs
   - Blend strategies based on current conditions
   - Generate ensemble explanation
2. Test ensemble with all strategies
3. Verify explainable output includes:
   - Strategy used
   - Probability metrics
   - Reasoning summary
   - Evidence trail

**Success Criteria:**
- All strategies generate deterministic predictions
- Each strategy provides explainable reasoning
- Ensemble engine properly ranks and blends strategies
- Predictions are based on actual historical data
- Output format matches specification:
  ```json
  {
    "numbers": [],
    "probability_score": 0.85,
    "strategy_breakdown": { "poisson": 0.3, "momentum": 0.4, ... },
    "explanation": "Based on hot/cold analysis and momentum trends..."
  }
  ```

---

### **Phase 5 — Prediction Storage** (Day 13)
**Goal:** Store generated predictions with full explainability metadata

**Tasks:**
1. Create prediction storage service in `/lib/prediction/storage.js`
2. Implement function to store predictions:
   ```javascript
   async function storePrediction(userId, gameId, predictionData) {
     // Insert into predictions table
     // Include all explainability metadata
     // Return stored prediction ID
   }
   ```
3. Create function to store user plays:
   ```javascript
   async function storeUserPlay(userPredictionData) {
     // Insert into user_predictions table
     // Link to prediction if applicable
     // Track amount spent, play date, etc.
   }
   ```
4. Implement prediction retrieval functions:
   - Get predictions by user/date/game
   - Get prediction history with explanations
   - Get settlement status for plays
5. Add audit logging for all prediction operations
6. Create indexes for performance:
   - `predictions(user_id, game_id, draw_date)`
   - `user_predictions(user_id, play_date)`

**Success Criteria:**
- Predictions stored with full explainability metadata
- User plays linked to predictions when applicable
- Retrieval functions work efficiently
- Audit trail complete for all prediction operations
- Storage service tested with sample data

---

### **Phase 6 — API Layer** (Days 14-15)
**Goal:** Expose predictions through RESTful endpoints with caching and pagination

**Day 14 Tasks:**
1. Set up API route structure in `/app/api/`:
   ```
   /app/api/
   ├─ games/
   │   └─ route.ts
   ├─ draws/
   │   └─ [game]/
   │       └─ route.ts
   ├─ predict/
   │   ├─ route.ts
   │   └─ [game]/
   │       └─ route.ts
   ├─ picks/
   │   └─ route.ts
   └─ stats/
       └─ [game]/
           └─ route.ts
   ```
2. Implement Game Metadata APIs:
   - `GET /api/games` - List all available games
   - `GET /api/games/[game]` - Get specific game config
3. Implement Draw Data APIs:
   - `GET /api/draws/[game]` - Get historical draws for game
   - `GET /api/draws/[game]/recent` - Get recent draws
   - Support pagination and date filtering
4. Implement basic error handling and validation
5. Add caching headers where appropriate

**Day 15 Tasks:**
1. Implement Prediction APIs:
   - `GET /api/predict/[game]?strategy=[name]` - Get prediction for game
   - `POST /api/predict/[game]` - Generate new prediction
   - Support strategy selection and parameters
2. Implement Pick Logging APIs:
   - `POST /api/picks` - Log user play
   - `GET /api/picks/[userId]` - Get user's play history
3. Implement Stats APIs:
   - `GET /api/stats/[game]` - Get statistics for game
   - `GET /api/stats/[game]/hot-cold` - Get hot/cold analysis
4. Add proper HTTP status codes and error responses
5. Implement request validation and sanitization
6. Add rate limiting for prediction endpoints
7. Create API documentation in `/brewdocs/v1/BREWLOTTO_V1_PRICING_AND_BILLING_SPEC.md`

**Success Criteria:**
- All API endpoints functional and tested
- Proper HTTP status codes and responses
- Caching headers set appropriately
- Request validation and sanitization working
- Rate limiting prevents abuse
- API returns data in expected format
- Documentation matches implementation

---

### **Phase 7 — Dashboard UI** (Days 16-20)
**Goal:** Create customer dashboard with game selector, prediction panel, and analysis views

**Day 16 Tasks:**
1. Set up basic layout in `/app/dashboard/page.tsx`
2. Implement game selector component:
   - Tabs for each available game
   - Config-driven (reads from games table)
   - Responsive design
3. Create loading and error states
4. Implement basic styling with Tailwind CSS
5. Set up React Query for data fetching

**Day 17 Tasks:**
1. Implement prediction panel:
   - Display predicted numbers
   - Show probability score
   - Render explanation text
   - "Generate New Pick" button
2. Connect to prediction API endpoints
3. Implement strategy selector dropdown
4. Add loading states for prediction generation
5. Create pick logging flow:
   - User confirms play
   - Records amount spent
   - Links to prediction if applicable

**Day 18 Tasks:**
1. Implement hot/cold analysis cards:
   - Display trending numbers
   - Show overdue numbers
   - Visual indicators (color, size)
2. Implement sum/spread analysis
3. Add positional analysis view
4. Connect to stats API endpoints
5. Make analysis cards interactive (click for details)

**Day 19 Tasks:**
1. Implement My Picks section:
   - Display user's play history
   - Show win/loss tracking
   - Show prize amounts
   - Filter by date range/game
2. Implement Stats section:
   - Overall performance metrics
   - Strategy effectiveness
   - Trends over time
3. Connect to user predictions API
4. Add export functionality (CSV)

**Day 20 Tasks:**
1. Implement responsive design for mobile
2. Add animations and transitions
3. Implement error boundaries and fallbacks
4. Create loading skeletons for better UX
5. Add accessibility features (ARIA labels, keyboard nav)
6. Test dashboard with sample data
7. Polish UI based on V1 UX direction

**Success Criteria:**
- Dashboard loads and displays game tabs correctly
- Prediction panel shows explainable picks
- Hot/cold and analysis cards update with data
- My Picks section tracks user plays accurately
- All UI components responsive and accessible
- Dashboard flows match V1 UX specifications
- Performance optimized for fast loading

---

### **Phase 8 — BrewCommand Admin** (Days 21-22)
**Goal:** Build internal monitoring for strategy performance, prediction logs, and data health

**Day 21 Tasks:**
1. Set up admin layout in `/app/admin/page.tsx`
2. Implement ingestion health monitor:
   - Show last ingestion times per game/state
   - Flag stale data sources
   - Show ingestion success/failure rates
   - Provide manual trigger button
3. Create prediction audit viewer:
   - Show recent predictions with explanations
   - Filter by strategy, game, date range
   - Show accuracy metrics over time
4. Implement data health dashboard:
   - Show record counts per table
   - Display data freshness indicators
   - Show validation results
   - Highlight anomalies

**Day 22 Tasks:**
1. Implement strategy performance monitor:
   - Show accuracy rates per strategy
   - Compare strategy effectiveness
   - Highlight best/worst performing strategies
   - Show confidence intervals
2. Create BrewTruth event viewer:
   - Show governance actions
   - Display compliance checks
   - Show rejected outputs and reasons
3. Implement notification center:
   - Show system alerts
   - Display ingestion failures
   - Show prediction generation issues
4. Add admin authentication and role checking
5. Create basic settings panel for feature flags
6. Test admin interface with sample data

**Success Criteria:**
- Admin dashboard shows ingestion health clearly
- Prediction audit trail visible and searchable
- Strategy performance metrics accurate and up-to-date
- Data health indicators reflect actual database state
- Admin authentication works correctly
- All monitoring panels refresh with new data
- Interface matches V1 admin scope specification

---

### **Phase 9 — AI Commentary Layer** (Days 23-24)
**Goal:** Add LLM-generated explanations (never for direct pick generation)

**Day 23 Tasks:**
1. Set up AI service structure in `/lib/brewtruth/`
2. Implement explanation generation service:
   - Takes prediction data and feature set as input
   - Generates natural language explanation
   - Never modifies or influences number selection
   - Uses templated approach as default, LLM as enhancement
3. Create explanation templates:
   - Base explanations for each strategy
   - Contextual explanations based on data
   - Tier-based explanation complexity
4. Implement LLM integration (OpenAI API):
   - Only used for enhancement, not core logic
   - Strictly controlled prompts
   - Response validation and filtering
   - Caching to minimize API calls
5. Add safety checks:
   - Length limits on explanations
   - Profanity filtering
   - Fact-checking against data
   - Tier-based access control

**Day 24 Tasks:**
1. Implement explanation caching layer:
   - Cache explanations for similar predictions
   - Invalidate cache when data changes significantly
   - TTL-based expiration
2. Create explanation quality scoring:
   - Measure explanation relevance
   - Check for misleading statements
   - Validate against actual data
3. Implement fallback mechanism:
   - Use template explanations when LLM unavailable
   - Graceful degradation to deterministic explanations
4. Add usage monitoring and cost tracking:
   - Track LLM API calls and costs
   - Alert when usage exceeds thresholds
   - Optimize prompts for efficiency
5. Test explanation generation with various inputs
6. Verify that AI never influences number selection
7. Document AI usage policy in `/brewdocs/v1/BREWLOTTO_V1_COMPLIANCE_AND_TRUST_SPEC.md`

**Success Criteria:**
- Explanations generated for all predictions
- AI used only for enhancement, never core logic
- Explanations accurate, relevant, and compliant
- Fallback to template explanations when needed
- Usage monitoring and cost controls in place
- Clear separation between prediction and explanation
- All explanations audit-traceable

---

### **Phase 10 — Billing + Premium Features** (Days 25-26)
**Goal:** Implement Stripe subscriptions and tier-gated feature access

**Day 25 Tasks:**
1. Set up Stripe integration in `/lib/billing/`:
   - Create Stripe client with secret key
   - Implement webhook handlers
   - Create subscription management functions
2. Define subscription tiers:
   - Free Tier: Limited daily picks, basic insights
   - Pro Tier: Unlimited picks, advanced analytics
   - Elite Tier: All games, AI commentary enhancements
3. Create subscription models:
   ```javascript
   const TIERS = {
     free: { price: 0, features: [...] },
     pro: { price: 9.99, features: [...] },
     elite: { price: 19.99, features: [...] }
   };
   ```
4. Implement entitlement system:
   - Check user tier from database
   - Map tier to feature permissions
   - Cache entitlements for performance
5. Create Stripe checkout integration:
   - Create checkout sessions
   - Handle successful payments
   - Handle canceled payments
6. Implement webhook handlers:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`

**Day 26 Tasks:**
1. Implement tier-gating in prediction APIs:
   - Check user entitlement before generating predictions
   - Restrict advanced strategies to higher tiers
   - Limit pick volume based on tier
2. Implement tier-gating in UI:
   - Hide/show features based on entitlement
   - Show upgrade prompts for locked features
   - Disable actions for insufficient tier
3. Create billing portal integration:
   - Link to Stripe customer portal
   - Show subscription status
   - Allow plan changes
4. Implement trial period handling:
   - Free trial for Pro/Elite tiers
   - Automatic conversion after trial
5. Add usage tracking and fair-use policies:
   - Monitor for abuse
   - Implement soft limits with warnings
   - Hard limits for system protection
6. Test entire billing flow:
   - Create subscription
   - Access premium features
   - Change/downgrade plan
   - Cancel subscription
7. Document billing system in `/brewdocs/v1/BREWLOTTO_V1_PRICING_AND_BILLING_SPEC.md`

**Success Criteria:**
- Stripe integration functional and secure
- All three tiers (Free, Pro, Elite) work correctly
- Tier-gating prevents unauthorized feature access
- Subscription lifecycle handled properly
- Webhook processing reliable and secure
- Billing portal accessible and functional
- Usage tracking and limits working
- Clear upgrade paths and pricing displayed
- No revenue leakage or security vulnerabilities

---

## 🎯 V1 SUCCESS CRITERIA CHECKPOINT

Before considering V1 complete, verify all success criteria from the NemoTron Super Execution Brief:

✔ **Historical draw data loads correctly for NC and CA games**
- Ingestion pipeline tested with 24 months of historical data
- All game types (Pick 3, Pick 4, Cash 5, Powerball, Mega Millions) working
- Data validation passes for all ingested records

✔ **Prediction engine generates picks with reproducible statistical logic**
- All strategies (Poisson, Momentum, Markov, Ensemble) deterministic
- Same input produces same output
- Statistical validity verified against historical data

✔ **Dashboard displays predictions with explainable reasoning**
- Prediction panel shows numbers, probability, and explanation
- Explanation includes strategy used and reasoning summary
- UI matches V1 UX specifications

✔ **Strategies produce auditable reasoning and evidence trails**
- Each prediction stored with full metadata
- Strategy breakdown shows contribution of each approach
- Evidence trail connects numbers to specific data points

✔ **Admin panel shows ingestion health, prediction metrics, and audit logs**
- Admin dashboard displays clear health indicators
- Prediction accuracy tracking functional
- Audit logs complete and searchable
- Anomaly detection working

✔ **Billing system processes subscriptions and updates entitlements correctly**
- Stripe integration tested end-to-end
- Tier-gating prevents unauthorized access
- Subscription lifecycle (create, update, cancel) works
- Entitlement updates reflected in UI and API access

✔ **All custom tools function as specified**
- BrewScan audit tool runs and reports correctly
- Init script scaffolds new modules properly
- Database migration tool handles schema updates
- Data validation suite verifies pipeline integrity

---

## 📦 DELIVERABLES

Upon completion of this sprint plan, you will have:

1. **Fully Functional V1 Application**
   - Next.js app running with all features
   - Supabase database with complete schema
   - Working ingestion pipeline for NC & CA lottery data
   - Deterministic prediction engine with explainable outputs
   - Tiered subscription model with Stripe integration
   - Admin monitoring and governance tools

2. **Complete Documentation**
   - Updated README.md reflecting V1 direction
   - All V1 specification documents in `/brewdocs/v1/`
   - API documentation
   - Database schema documentation
   - Ingestion pipeline specification
   - Prediction engine specification
   - Billing and pricing specification
   - Testing and success criteria documentation

3. **Quality Assurance**
   - >80% test coverage across all layers
   - Validation tests for data integrity
   - Accuracy tests for prediction strategies
   - API endpoint tests
   - UI component tests
   - Audit tests for BrewTruth compliance

4. **Operational Readiness**
   - Deployment scripts and configuration
   - Monitoring and alerting setup
   - Backup and recovery procedures
   - Performance benchmarks
   - Security audit completion

---

## ⚠️ CRITICAL REMINDERS

1. **STRICT ORDER FOLLOWING**: Do not advance to the next phase until the current phase is fully complete and tested.

2. **PREDICTION FIRST**: No UI work should begin until the prediction engine (Phase 4) is functioning and generating explainable predictions.

3. **EXPLANATION OVER GENERATION**: AI/ML is only for explanation and commentary - never for direct number generation or prediction influence.

4. **DATA GROUNDED**: All predictions must be traceable to actual historical data and statistical analysis.

5. **COST DISCIPLINE**: AI/ML features must be gated, cached, and optimized - never rely on expensive always-on inference.

6. **TRUST AND TRANSPARENCY**: Every premium pick must include clear strategy attribution, reasoning summary, and evidence trail.

7. **V1 SCOPE DISCIPLINE**: Resist the temptation to add "just one more feature" - stick strictly to the V1 specification.

---

**Remember**: V1 succeeds when users say:  
*"I understand why this pick was suggested."*  
*"I can track what I played and how I'm doing."*  
*"The app feels premium, fast, and trustworthy."*  
*"I want to come back before each draw."*

Let's build BrewLotto V1 - one solid phase at a time. 🚀