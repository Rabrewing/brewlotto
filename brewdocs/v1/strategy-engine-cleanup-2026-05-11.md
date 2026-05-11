# BrewLotto V1 — Strategy Engine & Naming Cleanup (2026-05-11)

## Scope

Clean up three interconnected layers that broke strategy prediction and leaked
internal implementation names to users.

---

## 1. Prediction Generator Core Fixes

### File: `lib/prediction/predictionGenerator.js`

| Issue | Before | After |
|-------|--------|-------|
| Multi-state `.single()` crash | `state=MULTI` queried NC+CA rows with `.single()`, throwing 406 | Uses `.select()` + returns first row; for MULTI picks NC explicitly |
| Prediction mislabeling | `predictionData` had no `state`/`game` fields; storage defaulted to `'NC'`/`'pick3'` | `state` and `game` set explicitly before passing to storage |
| Draw window mixing | `getRecentDraws()` ordered by `draw_date` with no window filter | Accepts optional `drawWindow` param; daily games (Pick3/4, Daily3/4) filter by `drawTime` |
| Strategy key | Stored as `'frequency_analysis'` (no matching label map entry) | Stored as `'hotCold'` (maps to `HeatCheck™` in `STRATEGY_EXPLAINERS`) |

### Files: `utils/strategyLabel.js` (rewritten)

Maps all possible DB keys — legacy (`hot_cold`, `poisson_basic`, `frequency_analysis`),
registry (`momentum`, `poisson+`), and future keys — to branded display labels.
Exports `getStrategyLabel(id)`, `getStrategyDesc(id)`, `getStrategyIcon(id)`.
Handles unknown keys with a title-case cleaner as fallback.

---

## 2. Strategy Name Normalization

### UI surfaces switched from raw keys to `getStrategyLabel()`:

| Surface | File | Before (user saw) | After (user sees) |
|---------|------|-------------------|-------------------|
| Dashboard commentary | `app/api/dashboard/commentary/route.ts` | `"using hot_cold"` | `"using HeatCheck™"` |
| Results API | `app/api/results/route.ts` | Raw `source_strategy_key` in response | Branded label in response |
| My Picks | `app/my-picks/page.tsx` | `"Generated using poisson_basic"` | `"Generated using PulseSync™"` |
| Stats & Performance | `app/stats/page.tsx` | Raw key in strategy breakdown | Branded label |
| Strategy Locker cards | `app/strategy-locker/page.tsx` | DB `public_name` ("Poisson", "Momentum") | Branded label ("PulseSync™", "HeatWave™") |
| Strategy Locker run preview | `app/strategy-locker/page.tsx` | `"publicName ran on NC PICK3 using engineKey"` | `"HeatCheck™ ran on NC PICK3"` |
| Strategy Locker performance chips | `app/strategy-locker/page.tsx` | Map key mismatch — chips always empty | Fixed: looks up by display label |
| Strategy Locker run route | `app/api/strategy-locker/run/route.ts` | Stored raw `strategy_key` as `public_label` | Stores branded label |
| Voice layer | `lib/voice/brewVoiceLines.js` | Raw key fallback in voice intros | Uses `getStrategyLabel()` |
| BrewCommentaryEngine | `components/ui/BrewCommentaryEngine.jsx` | Raw key fallback | Uses `getStrategyLabel()` |

### Naming before/after (what users now see in Strategy Locker, Stats, My Picks, Voice):

| Internal Key | Branded Label |
|---|---|
| `hot_cold` / `hotCold` / `frequency_analysis` | **HeatCheck™** |
| `momentum` | **HeatWave™** |
| `poisson+` / `poisson_basic` / `advanced_scoring` | **PulseSync™** |
| `poisson++` / `deep_ai_explanations` | **PulsePrime™** |
| `markov++` / `early_access_strategies` | **SequenceX™** |
| `strategy_explanations` / `prediction_comparisons` / `confidence_bands` | Mapped to appropriate general brand |
| unknown/unrecognized | Title-cased cleanup (e.g. `"my_custom_key"` → `"My Custom Key"`) |

### Tiered Naming Ladder

Each family now displays as a progression across unlock tiers instead of flat unrelated names:

| Family | Free | Starter | Pro | Master |
|--------|------|---------|-----|--------|
| **HeatCheck** | HeatCheck | HeatCheck II | HeatCheck III | HeatCheck IV |
| **HeatWave** | HeatWave | HeatWave II | HeatWave III | — |
| **PulseSync** | PulseSync | — | — | PulseSync II |
| **SequenceX** | — | — | — | SequenceX |

Lucide icons: Flame (amber #f59e0b), TrendingUp (blue #3b82f6), Brain (purple #a855f7), Sparkles (teal #14b8a6).

---

## 3. Files Changed

```
lib/prediction/predictionGenerator.js       — multi-state fix, window filter, state/game labels
utils/strategyLabel.js                       — centralized label mapper for all surfaces
app/strategy-locker/page.tsx                 — branded labels in cards, preview, performance chips
app/api/dashboard/commentary/route.ts       — branded label in API response
app/api/results/route.ts                     — branded label in API response
app/api/strategy-locker/run/route.ts         — branded labels in stored data
app/my-picks/page.tsx                        — branded label in pick display
app/stats/page.tsx                           — branded label in strategy breakdown
lib/stats/strategyPerformance.ts             — branded label in performance map
lib/voice/brewVoiceLines.js                  — branded label in voice intros
components/ui/BrewCommentaryEngine.jsx       — branded label in commentary display
```

---

## 4. Remaining Technical Debt (not in scope for this pass)

- Strategy engine (`lib/strategyEngine.js` + `lib/strategies/*/`) is disconnected from
  `predictionGenerator.js`. The active prediction uses inline frequency/random logic.
  Wiring the full Poisson/Momentum/Markov/Ensemble engine is a separate project.
- Legacy `app/api/annotate-pick/route.ts` and `app/api/predict/route.js` still use raw
  keys internally but are dead/unreferenced routes.
- `components/predict/*` still has hardcoded raw keys but no current page imports them.
