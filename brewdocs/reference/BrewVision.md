<!--
BrewLotto AI Project — BrewVision.md
docs/BrewVision.md
Generated: 2025-06-24  08:40 PM EDT
Maintainer: ChatGPT (BrewLotto PM)
-->

# BrewVision: Project Management & Architecture Guide

**Last updated:** 2025-06-24  
**Maintainer:** ChatGPT (acting Project Manager)

---

## 🧭 Purpose

BrewVision is the “living brain” of BrewLotto AI.  
This document orients all devs, PMs, and stakeholders around:
- System architecture and logic flow
- The “why” and “how” behind our prediction core, data ingestion, and analytics
- Coding conventions, new process checklists, and audit principles

---

## 🗂️ Directory Overview

Project root as of June 24, 2025:

├── LICENSE
├── README.md
├── auth/
├── component/
│ ├── AdminHubLayout.jsx
│ ├── NavBar.js
│ └── dashboard/
│ ├── AuditViewer.jsx
│ ├── DrawHealthMonitor.jsx
│ ├── PredictionFeed.jsx
│ ├── RefreshTrigger.jsx
│ └── UploadZone.jsx
├── data/
├── docs/
│ ├── CHANGELOG.md
│ ├── TODO.md
│ ├── data-pipeline-manual.md
│ └── BrewVision.md ⬅️ (this file)
├── hooks/
├── logs/
├── pages/
├── scripts/
├── styles/
├── utils/


---

## 🚦 Project Status & Workflow

- **Latest push**: Auth overhaul, prediction engine refactor, NavBar upgrade, audit log scripting (see `/docs/CHANGELOG.md` for feature-by-feature log)
- **PM process**:  
  - Major features and infra changes logged in this doc and in `/docs/CHANGELOG.md`
  - Use `🧾 Update:` prefix in PRs/issues for ChatG PM tracking
- **File conventions**:  
  - All scripts/components start with header (path, purpose, timestamp)
  - Directory casing is uniform (e.g., `component`, not `components`)
  - Feature code lives with its page or utility, admin tools live under `/component/dashboard`

---

## 🧠 Architectural Notes

- **Supabase** is the single source of truth (auth, data, RLS, logs)
- All draw ingestion, audit, and prediction logging are handled via modular scripts in `/scripts`
- **Prediction core**:  
  - Strategy-based (Poisson, Markov, Momentum, Random, Hybrid/Bayesian)
  - All new draws trigger probability and audit updates (audit via `/pages/api/audit.js`)
- **Backup/restore**:  
  - `brewBackup.js` (scripts) for regular snapshotting of key tables
  - CSV and JSON upload/restore supported for rapid migration
- **Data health**:  
  - Draw validation and audit scripts are part of the ingestion pipeline (see `/scripts/drawHistoryAudit.js` and `/component/dashboard/DrawHealthMonitor.jsx`)
- **Access**:  
  - Admin tools route-guarded via role checks in `/component/NavBar.js` and page logic

---

## 🗒️ Next Steps

- Finish Sidebar/Panel for admin hub
- Plug prediction logger and audit feed into Admin dashboard
- Complete mobile roadmap (Expo/React Native)
- Continue updating docs with every feature/infra push

---

### Brief Write-Up (for commit)

> Adds `docs/BrewVision.md`, the central PM/architecture manual.  
> Includes directory snapshot (as of 2025-06-24), system overview, latest features, file conventions, and next action items.  
> Keeps all devs, Copilot, and ChatGPT PM in sync on project status and best practices.

---

**Let’s push BrewLotto forward — together.**  
*Commit. Ship. Audit. Repeat.*  
— ChatGPT PM



