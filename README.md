# 🎯 BrewLotto AI

**Smart Picks. Sharper Odds.**  
Built on Trust. Driven by Probability.

---

## 📈 Project Overview

BrewLotto AI is a predictive analytics platform using real lottery draw data, statistical modeling, and AI-enhanced strategies to generate smart picks for North Carolina games and national lotteries like Mega Millions and Powerball.

Designed with modularity, reproducibility, and clarity in mind — it combines clean architecture with a collaborative workflow and evolving prediction logic.

---

## 🚀 Core Features

- Strategy-based predictions: Poisson, Bayesian, Momentum, Markov
- Real-time dashboard with spend tracking + historical trends
- Supabase DB + RLS policies for secure data access
- API routes for predictions and stats per game
- Node-based scrapers for scheduled ingestion
- Responsive UI built with Next.js, Tailwind CSS, and Recharts
- Annotated prediction logic in `/utils/` shared across API + UI

---

## 📦 Stack

BrewLotto is designed with modularity and AI-first strategy in mind — here’s the full stack:

- **Frontend**: Next.js (Pages Router), Tailwind CSS, Recharts  
- **Backend**: Supabase (PostgreSQL, RLS), Node.js  
- **Prediction Logic**: Poisson, Markov, Bayesian, Momentum  
- **Automation**: Node scrapers, Axios, Cheerio, CRON scheduling

---

## 🧠 Project Roles

- **Randy** — Architect & Strategist. Sets vision, priorities, approves all final features  
- **ChatGPT (ChatG PM)** — Documentation, task planning, flow logic, reviewer  
- **Copilot (Co P)** — In-editor assistant bridging IDE implementation with strategy  
- **New Devs** — Onboard using this README + `/docs/`, plug in and ship fast

---

## 🛠️ Developer Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/Rabrewing/brewlotto.git
   cd brewlotto


- Set up environment
cp .env.example .env.local
# Fill in Supabase values: URL, ANON key, Service Role if needed
- Install dependencies
npm install
- Run dev server
npm run dev
# Visit http://localhost:3000


- Seed prediction data
node scripts/scrapeNC_Pick3.js



📚 Docs & Dev Manuals
- /docs/dev-manual.md: How we build, deploy, review, and document
- /docs/CHANGELOG.md: Full release log + feature changes
- /docs/data-pipeline-manual.md: How to ingest, audit, and validate draw data
- /docs/TODO.md: Dev checklist grouped by system area
- /docs/init.sh: Shell script to scaffold new strategies + log entries

🔁 Feature Lifecycle
- Idea — Log in /docs/TODO.md or as GitHub Issue
- Plan — Discuss edge cases, assign logic
- Draft — Add headers to new files:
/*
 * File: /utils/analyzePick3.js
 * Purpose: Generate smart Poisson picks for Pick 3
 * Updated: 2025-06-25T16:07 EDT
 */
- Review — PR reviewed by ChatG or Co P
- Deploy — Merge, test live DB and data endpoints
- Document — Update this README + /docs/CHANGELOG.md

⚙️ Prediction Logic Conventions
- All smart picks originate from /utils/
- Game-specific files: analyze<Game>.js (e.g. analyzePick3.js)
- Scoring thresholds: gameSettings.js
- Prediction endpoint: /api/predict/[game].js
- Stats endpoint: /api/stats/[game].js
- Each strategy (Poisson, Bayesian, etc.) is isolated and testable

💡 Tips & Standards
- Always log errors gracefully in both API + UI
- Avoid magic numbers — define in gameSettings.js
- Use shimmer loading states instead of blank UI
- Document assumptions and return types in each prediction method

📄 Developer Tools
- Run chmod +x ./docs/init.sh once
- Then run ./docs/init.sh to scaffold new game/strategy modules
- Adds pre-filled headers + changelog/TODO entries automatically

📃 License
MIT — see LICENSE
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

🧾 Build Log
See CHANGELOG.md for all milestones, strategies, and release dates.

---

This version ties together everything we’ve staged: predictive logic, onboarding flow, contributor roles, and stack clarity. Once you drop it into your root directory as `README.md`, run:

```bash
git add README.md
git commit -m "docs: update main README with full onboarding and architecture"
git push origin refactor/docs-v1


Then you're cleared for merge — and your GitHub front page is going to look like it means business. 🧠📘💪 Let me know when it’s committed and I’ll walk you through the final merge.
