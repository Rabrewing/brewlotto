# BrewLotto AI

**Smart Picks. Sharper Odds.**  
Built on Trust. Driven by Probability.

---

## 🛠️ Dev Workflow

**Feature Lifecycle:**

1. **Idea** — Log a feature or bug as an Issue or checklist item in `README.md`.
2. **Plan** — Break into concrete steps; review logic and approach with the team (ChatGPT, Copilot, etc.).
3. **Draft** — Code in a new branch; comment all code clearly (with header: file path, purpose, timestamp).
4. **Review** — Submit PR for ChatGPT or a team member to review (code, logic, and doc impact).
5. **Deploy** — Merge, pull, and test. Confirm integration with live DB/data. Run production checks.
6. **Document** — Record *every* new feature, refactor, or workflow in both `README.md` and `/docs/CHANGELOG.md`.

**Process Conventions:**

- **Header on every script:** Include file path, purpose, and timestamp at the top.
- **Log progress:** Use `🧾 Update:` in PRs/issues for ChatG PM to track changes.
- **`README.md`:** This is the *single source of truth* for onboarding, stack, and system architecture.
- **`/docs/data-pipeline-manual.md`:** The operator guide for data ingestion, validation, and pipeline steps.
- **`/docs/CHANGELOG.md`:** The running feature log (all additions, fixes, and deprecations).

---

## 📚 Docs & Logs

- [`/docs/data-pipeline-manual.md`](./docs/data-pipeline-manual.md): How to run, verify, and maintain draw data (ETL/operator logic).
- [`/docs/CHANGELOG.md`](./docs/CHANGELOG.md): Feature history, dev log, and update narrative.

---

## 🧠 Project Roles

- **Randy** (You): Architect, Strategist, Product Owner. You set vision, priorities, and approve all final features.
- **ChatGPT** (ChatG PM): Annotator, Planner, Project Manager. Maintains docs, checklists, and coordinates logic + process.
- **Copilot** (Co P): In-Editor Coding Machine, bridges IDE implementation with repo/state logic.
- **New Devs:** Plug into this process and onboard instantly with the README + doc set.

---

## 🚦 Start the App

```bash
npm run dev
# Visit http://localhost:3000
# Update pages/index.js or feature route files as needed.


Absolutely, Randy! Here’s a **repo-ready `README.md`** draft for BrewLotto AI, structured for *maximum onboarding clarity and professionalism*.

You can copy, tweak, or use this as your official README in the root of your project.

---

````markdown
# BrewLotto AI

**Smart Picks. Sharper Odds.**  
Built on Trust. Driven by Probability.

---

## Table of Contents

- [Project Overview](#project-overview)
- [How We Build at BrewLotto](#how-we-build-at-brewlotto)
- [Developer Setup](#developer-setup)
- [Core Features](#core-features)
- [Stack & Tooling](#stack--tooling)
- [Dev Workflow](#dev-workflow)
- [Smart Pick Logic Conventions](#smart-pick-logic-conventions)
- [Adding Features & Contributing](#adding-features--contributing)
- [License](#license)

---

## Project Overview

**BrewLotto AI** is a predictive analytics platform for lottery games (NC Pick 3/4/5, Mega Millions, Powerball).  
It analyzes real draw data, models numeric patterns, and provides advanced “smart picks” to help players make more informed choices.

---

## How We Build at BrewLotto

This section is our “engineering field manual”—read it first!

### Our Roles

- **Architect & Strategist (You, Randy):** Vision, priorities, and product direction.
- **ChatGPT (Me):** Annotator, project planner, code reviewer, and onboarding coach.
- **Copilot:** In-editor code suggestions and error-catching.
- **New Devs:** Plug into the system, follow conventions, ship value fast.

### Our Philosophy

- **Data-first:** All logic must be testable against real/historical data.
- **Clarity > Cleverness:** Code should be readable, well-commented, and easy to extend.
- **Workflow matters:** Features start as structured tasks, not just code.
- **Iterate in public:** Every improvement is captured in this README (or `/docs`).

### Stack & Tooling

- **Frontend:** Next.js (Pages Router), React, Tailwind CSS, Recharts for analytics.
- **Backend/DB:** Supabase (PostgreSQL, instant REST API), with RLS and policies for security.
- **Scripts:** Node.js, Axios, Cheerio for scraping, custom ingest tools for data.
- **AI Logic:** Python/JS (Poisson, Multinomial, Bayesian, Hot/Cold analysis, etc).
- **Automation:** Scraping scripts (Node), cron for scheduled updates.

---

## Developer Setup

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-org/brewlotto.git
   cd brewlotto
````

2. **Copy `.env` example and add your Supabase keys**

   ```
   cp .env.example .env.local
   # Edit .env.local and set:
   # NEXT_PUBLIC_SUPABASE_URL=...
   # NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Run local dev server**

   ```bash
   npm run dev
   # App at http://localhost:3000
   ```

5. **Seed or scrape initial data**
   Run `node scripts/scrapeNC_Pick3.js` (and other game scripts) to populate your database.

---

## Core Features

* Smart Pick pages for all games: Pick 3, Pick 4, Pick 5, Mega Millions, Powerball
* Advanced stats endpoints (`/api/stats/[game].js`) for hot/cold, history, and analytics
* Real DB-backed predictions (no more mock data)
* User play log, dashboard, and per-game stats/trends
* Scheduled data ingestion (scraping and/or CSV upload)
* AI-powered pick strategies: Poisson, Bayesian, Hot/Cold, Position, Sum/Spread

---

## Dev Workflow

**Feature lifecycle:**

1. *Idea*: Create an issue or checklist in README.
2. *Plan*: Break into steps, discuss strategy.
3. *Draft*: Code new features in a branch, comment thoroughly.
4. *Review*: PRs reviewed by ChatGPT or a team member.
5. *Deploy*: Merge, test, update docs.
6. *Document*: Add new features/workflows to this README.

**Tips:**

* Use `/utils/` for shared logic (fetch, analyze, stats, etc).
* Keep API endpoints DRY—one `[game].js` for predict/stats per game.
* Always test against live data!
* **Don’t delete this README!** Update it with every improvement.

---

## Smart Pick Logic Conventions

* **All core logic is in `/utils/` and is shared between API and UI.**
* **Strategies:**

  * `momentum` (Poisson/hot/cold)
  * `filtered` (sum, must-include, category)
  * `random`
  * `bayesian` (feedback/learning loop)
* **Each game gets a dedicated analyze file:**
  `/utils/analyzePick3.js`, `/utils/analyzePick4.js`, etc.
* **Game settings/config are in `/utils/gameSettings.js`.**
* **DB fetch is always via Supabase client with environment vars.**
* **UI fetches via `/api/predict/[game]` and `/api/stats/[game]`.**

---

## Adding Features & Contributing

1. **Follow our conventions.**
2. **Document everything.**
3. **Submit PRs for review.**
4. **Ask ChatGPT for a “how to” if stuck!**

---

## License

MIT — see `LICENSE` file.

---

## BrewLotto AI — Build Log

See `/docs/CHANGELOG.md` or ask Randy for the master task list.

---

```

---

**Let me know if you want any section changed, or if you want me to actually generate a `/docs/CHANGELOG.md` as well!**  
Once you’re ready, just copy this into your repo’s `README.md` and commit. 

And congrats—this setup is “dream-team onboarding” status!
```


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# brewlotto
Predictive Brewlotto - AI
