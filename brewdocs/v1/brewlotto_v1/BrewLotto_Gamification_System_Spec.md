# BrewLotto Gamification System Spec

Project: BrewLotto AI  
Phase: V1 Foundation + Engagement Layer  
Status: Build-Ready  
Timestamp: 2026-03-17 (ET)

---

## 1. Purpose

Define a structured gamification system to enhance:
- retention
- engagement
- learning
- strategy usage
- emotional experience

BrewLotto is NOT just a lottery app.  
It is a **lottery intelligence system with user progression**.

---

## 2. Core Philosophy

Gamification must:
- reward discipline, not gambling
- reinforce strategy usage
- provide emotional feedback (BrewPulse)
- feel premium, not arcade-like

---

## 3. Core Modules

/lib/gamification/

- xpEngine.ts
- streakEngine.ts
- badgeEngine.ts
- missionEngine.ts
- performanceEngine.ts
- rewardFormatter.ts
- progressHooks.ts

---

## 4. XP System

### XP Rules

| Event | XP |
|------|----|
| Daily login | 3 |
| Generate pick | 5 |
| Save pick | 10 |
| Use strategy | 6 |
| Review insights | 4 |
| Mission complete (daily) | 20 |
| Mission complete (weekly) | 60 |
| Partial hit | 25 |
| Full hit | 100 |

---

### Example

```ts
const XP_RULES = {
  generate_pick: 5,
  save_pick: 10,
  partial_hit: 25,
  full_hit: 100
};
```

---

## 5. Leveling System

```ts
level = Math.floor(totalXP / 100)
```

### Ranks

* Bronze Player
* Silver Strategist
* Gold Predictor
* Platinum Analyst
* BrewMaster
* BrewLegend

---

## 6. Streak System

### Types

* daily_streak
* save_streak
* insight_streak
* hit_streak

### Logic

```ts
if (userPlayedToday) streak++
else streak = 0
```

### Milestones

* 3 days → Warm Up
* 7 days → Consistent
* 14 days → Disciplined
* 30 days → Elite

---

## 7. Badges

| Badge       | Condition          |
| ----------- | ------------------ |
| First Spark | First pick         |
| Locked In   | 3-day save streak  |
| Strategist  | Use all strategies |
| Hot Hand    | 3 hits in a row    |
| Consistent  | 7-day streak       |
| BrewMaster  | Level milestone    |

---

## 8. Missions

### Daily

* Generate 2 picks
* Save 1 pick
* Review insights

### Weekly

* Use 3 strategies
* Maintain 5-day streak
* Check results 4 days

---

## 9. Performance Scoring

```ts
accuracy = hits / total_predictions
```

### Metrics

* hit_rate
* total_predictions
* saved_picks
* strategy_success
* streak_peak

---

### Composite Score

```ts
performanceScore =
  (hitRate * 0.4) +
  (consistency * 0.2) +
  (strategyUsage * 0.2) +
  (engagement * 0.2)
```

---

## 10. Emotional Gamification (BrewPulse Layer)

Examples:

* “You’re heating up 🔥”
* “Cold streak detected — adjust strategy”
* “Strong consistency — keep going”
* “Momentum building”

Triggers:

* streak changes
* wins/losses
* mission completion
* badge unlock

---

## 11. Database Schema

### user_stats

```sql
user_id
total_xp
level
rank
total_predictions
total_hits
best_streak
current_streak
```

---

### user_achievements

```sql
user_id
badge_key
unlocked_at
```

---

### user_streaks

```sql
user_id
streak_type
current_count
best_count
```

---

### user_missions

```sql
user_id
mission_key
progress
status
reward_xp
```

---

### xp_events

```sql
user_id
event_key
xp_awarded
timestamp
```

---

## 12. API Endpoints

```
GET  /api/gamification/profile
GET  /api/gamification/missions
GET  /api/gamification/achievements
POST /api/gamification/event
POST /api/gamification/claim
```

---

## 13. Frontend Components

/components/gamification/

* XpBar.tsx
* StreakCard.tsx
* MissionCard.tsx
* BadgeShelf.tsx
* RankBadge.tsx
* PerformanceCard.tsx

---

## 14. UI Integration Points

* Dashboard
* My Picks
* Strategy Locker
* Profile
* Post-result screen
* Brew commentary panel

---

## 15. Implementation Phases

### Phase G1

DB + event tracking

### Phase G2

XP + streak engine

### Phase G3

Badges + missions

### Phase G4

UI widgets

### Phase G5

Performance scoring

### Phase G6

BrewPulse integration

---

## 16. Success Criteria

Gamification is successful when:

* XP updates correctly
* streaks track properly
* badges unlock as expected
* missions rotate dynamically
* dashboard shows progress clearly
* commentary reflects user state

---

## 17. PM Final Note

This is NOT a “points system.”

This is a:

👉 **User intelligence progression system**

BrewLotto wins when users feel:

* smarter
* more strategic
* more in control
* more consistent

Gamification should reinforce that identity.