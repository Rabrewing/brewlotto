# BrewLotto Navigation Engine & Game UX
 
//timestamp: 2025-11-13 05:00 UTC
//brief summary: Design + roadmap for BrewLotto game navigation (Pick 3, Pick 4, Cash 5, Powerball, Mega), responsive number layout, and future architectural plans.
 
---
 
## 🎯 Scope
 
Phase: **Frontend Navigation MVP (NC-only)**
Games: **Pick 3, Pick 4, Cash 5, Powerball, Mega** (label `Mega` in UI)
Goal: A single, elegant UI that lets users switch games instantly while keeping:
 
* Consistent **BrewLotto cosmic kiosk** look
* Numbers sized **comfortably** for each game
* A single **Momentum Meter** that adapts per game
 
---
 
## 1. Game Tabs & Labeling
 
### 1.1 Final Tab Labels
 
* `Today’s Draw Insights` (pseudo-tab / heading)
* `Pick 3`
* `Pick 4`
* `Cash 5`
* `Powerball`
* `Mega`  ← (Mega Millions; shorter label for fit)
 
### 1.2 UX Rules
 
* The active tab uses:
 
  * Bright text (`text-white`)
  * Gold underline glow (`bg-brewlotto` + shadow)
* Inactive tabs:
 
  * Muted text (`text-white/70`)
  * No underline
* Hover state:
 
  * Slightly brighter text (`text-white/90`)
 
### 1.3 State Model (React)
 
We define a `selectedGame` state with a **slug**:
 
* `"pick3" | "pick4" | "cash5" | "powerball" | "mega"`
 
Tab clicks simply set the slug and re-render the dashboard with that game’s configuration.
 
Later, we can sync `selectedGame` to the URL (e.g. `?game=powerball` or `/game/powerball`) but MVP can stay client-side only.
 
---
 
## 2. Game Config Architecture
 
We create a single source of truth for game properties:
 
```ts
// pseudo-type
export type GameKey = "pick3" | "pick4" | "cash5" | "powerball" | "mega";
 
export interface GameConfig {
  key: GameKey;
  label: string;        // UI label ("Pick 3", "Mega")
  region: "NC" | "CA";  // future multi-state support
  primaryCount: number; // how many main balls
  primaryDigits?: number; // used for digit games (Pick 3/4)
  poolMax?: number;     // used for pool games (Cash 5, PB, Mega)
  hasBonus: boolean;    // Powerball/Mega
  bonusLabel?: string;  // "Powerball", "Megaball"
}
```
 
Example configs:
 
```ts
const GAME_CONFIGS: Record<GameKey, GameConfig> = {
  pick3: {
    key: "pick3",
    label: "Pick 3",
    region: "NC",
    primaryCount: 3,
    primaryDigits: 1,
    hasBonus: false,
  },
  pick4: {
    key: "pick4",
    label: "Pick 4",
    region: "NC",
    primaryCount: 4,
    primaryDigits: 1,
    hasBonus: false,
  },
  cash5: {
    key: "cash5",
    label: "Cash 5",
    region: "NC",
    primaryCount: 5,
    poolMax: 43,
    hasBonus: false,
  },
  powerball: {
    key: "powerball",
    label: "Powerball",
    region: "NC",
    primaryCount: 5,
    poolMax: 69,
    hasBonus: true,
    bonusLabel: "Powerball",
  },
  mega: {
    key: "mega",
    label: "Mega",
    region: "NC",
    primaryCount: 5,
    poolMax: 70,
    hasBonus: true,
    bonusLabel: "Megaball",
  },
};
```
 
The **UI layer never hardcodes numbers**; it reads from `GAME_CONFIGS[selectedGame]`.
 
---
 
## 3. Number Layout & Sizing Strategy
 
Question we are solving: *"How do we scale numbers to fit comfortably when switching games?"*
 
### 3.1 Design Constraints (NC + Powerball + Mega)
 
Maximum balls on screen:
 
* Pick 3  → 3 numbers
* Pick 4  → 4 numbers
* Cash 5 → 5 numbers
* Powerball → 5 + 1 bonus
* Mega → 5 + 1 bonus
 
So we never exceed **6 total circles**. That means we can:
 
* Keep the **primary balls visually large** (desktop: 64px, mobile: 48px)
* Render bonus ball as same size but with different color or outline
 
### 3.2 Rules for Number Bubbles
 
Desktop target:
 
* Height/Width: **4rem** (`h-16 w-16`)
* Font size: **1.5rem** (`text-2xl`)
* Weight: **extrabold**
 
Mobile target:
 
* Height/Width: **3rem** (`h-12 w-12` via responsive classes)
* Font size: **1.25rem** (`text-xl`)
 
Example layout rule (pseudo-Tailwind):
 
```tsx
<div className="flex flex-wrap gap-3">
  {primaryNumbers.map(n => (
    <Ball key={n} size="lg">{n}</Ball>
  ))}
  {bonusNumber && <Ball variant="bonus">{bonusNumber}</Ball>}
</div>
```
 
`Ball` component uses `size` and `variant` to pick the right Tailwind classes.
 
### 3.3 Bonus Ball Styling
 
* Main balls: `bg-brew-button` (gold gradient)
* Bonus ball: `bg-gradient-to-br from-[#FF4B2B] to-[#FF9800]` with small label chip under row saying `Powerball` or `Megaball`.
 
### 3.4 Responsive Behavior
 
* On small screens (<640px):
 
  * `flex-wrap` kicks in
  * If needed, second row appears (e.g. 4–6 balls)
* On larger screens: all balls sit on a single row.
 
We **do not** gradually shrink balls beyond the two size tiers; the layout wraps instead. This keeps readability high and preserves the luxury feel.
 
---
 
## 4. Momentum Meter Behavior
 
The **Momentum Meter UI** stays visually consistent across games:
 
* Same height (e.g. `h-32`)
* Same gradient (gold → orange → red)
* Same label: `Win Probability`
 
Internally, the **value** will be driven by a game-specific score:
 
* For Pick 3/4: hit-rate momentum on **digit patterns**
* For Cash 5 / PB / Mega: pattern momentum on **sum ranges, repeats, overdue index**
 
But the UI just needs a normalized **0–100% value** for the fill level.
 
Later we can:
 
* Color-shift (more gold at high confidence, more red at low)
* Add micro-animations when switching games (fill animates to new level).
 
---
 
## 5. Navigation Engine Architecture (Frontend)
 
### 5.1 Component Map
 
* `GameTabs`
 
  * Renders the tab row (`Pick 3`, `Pick 4`, `Cash 5`, `Powerball`, `Mega`)
  * Accepts `selectedGame` + `onChange(gameKey)`
 
* `GameDashboard`
 
  * Receives `config: GameConfig`
  * Renders:
 
    * Hot/Cold number cards
    * Momentum Meter
    * Prediction text
    * CTA button (`Generate My Smart Pick`)
    * My Picks / Strategy Locker buttons
  * Uses `config` to adjust **labels & number layout**.
 
* `NumberPanel`
 
  * Given `{config, hotNumbers, coldNumbers, bonusHot?, bonusCold?}`
  * Encapsulates the ball rendering logic so we tweak sizing in one place.
 
### 5.2 App Router Integration
 
MVP: Single route `/` with in-memory state.
 
Future: add URL syncing:
 
* Option A: search param `/?game=mega`
* Option B: nested routes `/game/[slug]`
 
For now, we prefer **Option A** (faster, fewer files). Once the engine stabilizes, we can promote to `[slug]` routes.
 
---
 
## 6. Roadmap & Tasks (Markdown-Ready)
 
### Phase 1 — Navigation UX MVP (Current Focus)
 
* [ ] Add `Mega` tab to existing tabs.
* [ ] Implement `GameKey` and `GAME_CONFIGS` constant.
* [ ] Create `GameTabs` component that reads from `GAME_CONFIGS` and toggles `selectedGame`.
* [ ] Refactor `page.tsx` to pass `config` into the dashboard instead of hardcoding Powerball.
* [ ] Implement `NumberPanel` + `Ball` components with size tiers (desktop vs mobile).
* [ ] Implement `bonus` ball styling for Powerball & Mega.
* [ ] Keep Momentum Meter UI static but ready for per-game values.
 
### Phase 2 — Data & Prediction Wiring
 
* [ ] Connect each game to the correct **NC draw history** tables in Supabase.
* [ ] Implement per-game `computeHotCold(config)` helpers.
* [ ] Implement per-game `computeMomentum(config)` that returns 0–100.
* [ ] Wire `Generate My Smart Pick` to per-game strategy engine (Poisson/Markov/etc.).
* [ ] Add **loading** states when switching games (tiny shimmer overlay).
 
### Phase 3 — Advanced UX & Story Layer
 
* [ ] Add micro-animations with Framer Motion (tabs, balls, meter fill, orb breathing).
* [ ] Add short explanation under prediction: `Why Brew picked these numbers`.
* [ ] Add tooltips / info icons for each game describing odds + rules.
* [ ] Add **per-game voice scripts** for Voice Mode.
 
### Phase 4 — Scale Beyond NC
 
* [ ] Extend `GameConfig` with `jurisdiction` and `gameCode` for different states.
* [ ] Add CA as a second region for selected games.
* [ ] Introduce a region selector (NC / CA) with safe defaults.
 
---
 
## 7. Notes & Open Questions
 
* For now, we **only support NC**, but the architecture is ready for multi-state.
* We intentionally keep the **ball size generous** to preserve the luxury, cinematic feel; if we ever add games with >6 balls, we will:
 
  * Introduce a `size="md"` tier
  * Allow vertical stacking/wrap inside the card
* All new work should be logged into BrewLotto-specific markdowns (`BREWLOTTO_NAV_ENGINE.md`, `BREWLOTTO_HANDOFF.md`, etc.) so Co P can see the reasoning trail.
 
//end
