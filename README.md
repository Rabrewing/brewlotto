# 🎯 BrewLotto AI V1

**Smart Picks. Sharper Odds.**  
Built on Trust. Driven by Probability.

---

## 📈 Project Overview (V1)

BrewLotto AI V1 is a lottery intelligence and player education platform focused on helping users make more informed plays through:
- historical draw analysis
- explainable strategy overlays
- number pattern tracking
- pick logging and outcome tracking
- responsible, transparent lottery guidance

This document reflects the V1 Reset / Product Foundation as defined in `brewdocs/v1/Brewlotto_v1.md`.

---

## 🚀 Core Features (V1)

- Strategy-based predictions: Poisson, Momentum, Markov, Ensemble
- Real-time dashboard with spend tracking + historical trends
- Supabase DB + RLS policies for secure data access
- API routes for predictions and stats per game
- Node-based scrapers for scheduled ingestion
- Responsive UI built with Next.js, Tailwind CSS, and Recharts
- Annotated prediction logic in `/lib/prediction/` and `/lib/ingestion/` shared across API + UI
- BrewTruth validation and governance layer
- Tiered subscription model (Free, Pro, Elite)
- Notification service for draw events and tracked numbers
- Gamification and BrewUniversity Lite education stubs
- Admin/BrewCommand Lite console for monitoring

---

## 📦 Stack (V1)

BrewLotto is designed with modularity and AI-first strategy in mind — here’s the full stack:

- **Frontend**: Next.js (App Router), Tailwind CSS, Recharts  
- **Backend**: Supabase (PostgreSQL, RLS), Node.js  
- **Prediction Logic**: Poisson, Momentum, Markov, Ensemble (statistical core)  
- **AI/ML**: Used for explanation and commentary only (never for direct pick generation)  
- **Automation**: Node scrapers, Axios, Cheerio, CRON scheduling  
- **Database**: Supabase/PostgreSQL as system of record  
- **Authentication**: Supabase Auth  
- **Payments**: Stripe for subscriptions  

---

## 🧠 Project Roles (V1)

- **Randy** — Architect & Strategist. Sets vision, priorities, approves all final features  
- **ChatGPT (ChatG PM)** — Documentation, task planning, flow logic, reviewer  
- **Copilot (Co P)** — In-editor assistant bridging IDE implementation with strategy  
- **New Devs** — Onboard using this README + `/brewdocs/v1/`, plug in and ship fast  

---

## 🛠️ Developer Setup (V1)

1. **Clone the repo**
   ```bash
   git clone https://github.com/Rabrewing/brewlotto.git
   cd brewlotto
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Fill in Supabase values: URL, ANON key, Service Role if needed
   # Fill in Stripe values: SECRET_KEY, WEBHOOK_SECRET
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run dev server**
   ```bash
   npm run dev
   # Visit http://localhost:3000
   ```

5. **Seed prediction data (initial ingestion)**
   ```bash
   node scripts/scrapeNC_Pick3.js
   node scripts/scrapeNC_Pick4.js
   node scripts/scrapeMega.js
   node scripts/scrapePowerball.js
   ```

---

## 📚 Docs & Dev Manuals (V1)

- `/brewdocs/v1/Brewlotto_v1.md` — Product Overview (V1 Reset)  
- `/brewdocs/v1/BREWLOTTO_V1_SYSTEM_ARCHITECTURE.md` — Technical architecture  
- `/brewdocs/v1/BREWLOTTO_V1_DATABASE_SCHEMA.md` — Database design  
- `/brewdocs/v1/BREWLOTTO_V1_DATA_INGESTION_SPEC.md` — Ingestion pipeline  
- `/brewdocs/v1/BREWLOTTO_V1_PREDICTION_ENGINE_SPEC.md` — Prediction engine  
- `/brewdocs/v1/BREWLOTTO_V1_PRICING_AND_BILLING_SPEC.md` — Pricing and billing  
- `/brewdocs/v1/BREWLOTTO_V1_TESTING_AND_SUCCESS_OUTCOMES.md` — Testing criteria  
- `/brewdocs/v1/BREWLOTTO_V1_STATE_ROLLOUT_PLAN.md` — State expansion plan  
- `/brewdocs/v1/BREWLOTTO_V1_UX_UX_ARCHITECTURE.md` — UI/UX design  
- `/brewdocs/v1/BREWLOTTO_V1_ADMIN_AND_BREWCOMMAND_SCOPE.md` — Admin scope  
- `/brewdocs/v1/BREWLOTTO_V1_COMPLIANCE_AND_TRUST_SPEC.md` — Compliance and trust  
- `/docs/dev-manual.md`: How we build, deploy, review, and document  
- `/docs/CHANGELOG.md`: Full release log + feature changes  
- `/docs/data-pipeline-manual.md`: How to ingest, audit, and validate draw data  
- `/docs/TODO.md`: Dev checklist grouped by system area  
- `/docs/init.sh`: Shell script to scaffold new strategies + log entries  

---

## 🔁 Feature Lifecycle (V1)

- **Idea** — Log in `/docs/TODO.md` or as GitHub Issue  
- **Plan** — Discuss edge cases, assign logic  
- **Draft** — Add headers to new files:
  ```
  /*
   * File: /lib/prediction/poisson.js
   * Purpose: Poisson strategy for Pick 3/Pick 4
   * Updated: 2026-03-16T10:00 EDT
   */
  ```
- **Review** — PR reviewed by ChatG or Co P  
- **Deploy** — Merge, test live DB and data endpoints  
- **Document** — Update this README + `/brewdocs/v1/CHANGELOG.md`  

---

## ⚙️ V1 Implementation Order (STRICT)

Following the NemoTron Super Execution Brief, development must proceed in this exact order:

**Phase 1 — Repository Foundation**
Create the project structure as defined in the V1 specification

**Phase 2 — Database Schema**
Create database tables for games, draws, predictions, strategy_metrics, and user_predictions

**Phase 3 — Data Ingestion Engine**
Build the ingestion pipeline to fetch, normalize, and store historical draw data

**Phase 4 — Prediction Engine**
Implement the statistical core with Poisson, Momentum, Markov, and Ensemble strategies

**Phase 5 — Prediction Storage**
Store generated predictions with full explainability metadata

**Phase 6 — API Layer**
Expose predictions through RESTful endpoints with caching and pagination

**Phase 7 — Dashboard UI**
Create the customer dashboard with game selector, prediction panel, and analysis views

**Phase 8 — BrewCommand Admin**
Build internal monitoring for strategy performance, prediction logs, and data health

**Phase 9 — AI Commentary Layer**
Add LLM-generated explanations (never for direct pick generation)

**Phase 10 — Billing + Premium Features**
Implement Stripe subscriptions and tier-gated feature access

---

## 🎲 Supported Lottery Games (V1 Launch)
Initial implementation must support:
- **Pick 3** (3 digits, 0-9)
- **Pick 4** (4 digits, 0-9)
- **Cash 5** (5 numbers, 1-39/43 depending on state)
- **Powerball** (5 numbers + Powerball, 1-69 + 1-26)
- **MegaMillions** (5 numbers + MegaBall, 1-70 + 1-25)

Launch states: North Carolina (NC) and California (CA) only.

---

## ✅ V1 Success Criteria
The system is considered complete when:
✔ Historical draw data loads correctly for NC and CA games  
✔ Prediction engine generates picks with reproducible statistical logic  
✔ Dashboard displays predictions with explainable reasoning  
✔ Strategies produce auditable reasoning and evidence trails  
✔ Admin panel shows ingestion health, prediction metrics, and audit logs  
✔ Billing system processes subscriptions and updates entitlements correctly  
✔ All custom tools (brew-scan, init script, migrations) function as specified  

---

## 🧪 Testing Requirements (V1)
Required test coverage:
- **Prediction Accuracy Tests** - Validate strategy outputs against historical data  
- **Data Integrity Tests** - Ensure ingestion accuracy and completeness  
- **API Tests** - Validate endpoints, authentication, and error handling  
- **UI Tests** - Ensure dashboard stability and component functionality  
- **Audit Tests** - Verify BrewTruth validation and compliance checks  

All tests must be written alongside features and maintain >80% coverage.

---

## 🛡️ V1 Success Principles
1. **Truth Over Hype** - No guaranteed win claims, transparent about odds  
2. **Explainability First** - Every premium pick includes strategy, reasoning, and evidence  
3. **Stable Before Clever** - Reject features that introduce instability or unclear value  
4. **Education Is Core** - Improve player literacy, not just generate picks  
5. **Cost Discipline** - AI/ML features gated, cached, or delayed until proven value  
6. **Premium Feel, Lean Core** - World-class UI with modular, practical backend  

---

## 📃 License
MIT — see LICENSE  
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 🧾 Build Log
See `/brewdocs/v1/CHANGELOG.md` for all milestones, strategies, and release dates.

---
*This README.md reflects the V1 direction. For the most current technical specifications, refer to the documents in `/brewdocs/v1/`.*