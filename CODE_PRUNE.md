# 🧹 CODE_PRUNE.md — BrewMerge Tracker

This document logs triage results for all code files across BrewLotto 1 (legacy) and BrewLotto 2 (overhaul).

| File                          | Status       | Action        | Notes |
|-------------------------------|--------------|---------------|-------|
| smartPick.js                  | ♻️ Refactor   | Merge core logic into Brew 2 `smartPick()` | Add tier-awareness |
| brewDataMap.js                | 🗃️ Archive    | Fully replaced by `STRATEGY_EXPLAINERS` | No longer needed |
| BrewCommentaryEngine.jsx      | ✅ Canonical  | Use as-is     | Already live in Brew 2 |
| legacyDrawHeatmap.jsx         | 🗃️ Archive    | Obsolete UX   | Replaced by `WinRateChart` |
| BrewLottoBot.jsx              | ✅ Canonical  | Use as-is     | Toast messaging engine |
| PredictionFeed.jsx            | ✅ Canonical  | Use as-is     | Prediction list UI |
| MatchAccuracyTimeline.jsx     | ♻️ Refactor   | Extend with legacy scoring logic | Merge with new UX |
