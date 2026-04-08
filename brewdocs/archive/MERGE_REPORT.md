# 🧠 BrewMerge: Integration Log

## Date: 2025-06-29

### ✅ Confirmed Canonical Modules (Brew 2 Active)
- `BrewCommentaryEngine.jsx`
- `PredictionFeed.jsx`
- `DrawHealthMonitor.jsx`
- `AdminHubLayout.jsx`
- `WinRateChart.jsx`

### ♻️ Legacy Files Marked for Refactor
- `smartPick.js` → smartPick() in Brew 2 with tier awareness
- `strategyEngine.js` → merge core loop into `usePredictionEngine()`
- `brewNarrator.js` → port phrasing to `BREW_PHRASES`

### 🗃️ Files Archived (Redundant or Obsolete)
- `brewDataMap.js` → replaced by `STRATEGY_EXPLAINERS`
- `legacyDrawHeatmap.jsx` → UX overhaul completed
- `oldUploadZone.jsx` → backend-only now

### 🔁 Next Merge Targets
- `brewBotMemory.js` → wire into BrewVoiceContext
- `MatchScoreUtils.js` → convert to composable utility
- `OldAdminShell.jsx` → deprecated by `AdminHubLayout`

