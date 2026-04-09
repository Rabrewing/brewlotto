# BrewLotto V1 Dropdown Execution Plan

**Purpose:** Sequence dropdown destination implementation from the current dashboard phase without disrupting the existing V1 shell.

## 1. Current Baseline

Already stable now:
- canonical App Router dashboard shell
- live dashboard commentary/stats/freshness integration
- dashboard navigation cleaned up to real routes only
- build and test baseline restored

This means the next execution phase can move from dashboard-shell cleanup into destination-surface buildout.

## 2. Recommended Phase Sequence

### Phase 9A: Dashboard Shell Truthfulness

Status: in progress / mostly complete

Includes:
- live commentary states
- truthful no-data states
- route-safe dashboard utility links
- meter/design alignment

### Phase 9B: Dropdown Identity System

Build next:
- upgraded avatar dropdown container
- grouped sections
- profile header depth
- state selector pill styling
- real menu routing model

Output:
- dropdown component finalized against `brewlotto_dropdown.png`

### Phase 9C: High-Value Destination Surfaces

Build order:
1. `/my-picks`
2. `/results`
3. `/profile`

Reason:
- highest user value
- strongest retention surfaces
- closest to data already present in V1

### Phase 9D: Analysis and Premium Utility Surfaces

Build order:
1. `/stats`
2. `/strategy-locker`

Reason:
- depend on prediction history and tier framing
- should follow once the user-facing retained-value screens are in place

### Phase 9E: Account and Support Surfaces

Build order:
1. `/notifications`
2. `/settings`
3. `/billing`
4. `/learn`
5. `/legal`

Reason:
- lower urgency for game-loop value
- cleaner once route/account patterns are established

## 3. Implementation Rules

- Do not build all dropdown routes at once
- Land routes in coherent slices with docs and verification
- Keep each new route thin and real rather than broad and partially fake
- Reuse the dashboard shell language but do not clone the dashboard blindly
- Maintain V1 route clarity over speculative future extensibility

## 4. Suggested Commit Grouping

1. `feat(nav): upgrade avatar dropdown information architecture`
2. `feat(my-picks): add V1 picks tracking surface`
3. `feat(results): add V1 results and match recap surface`
4. `feat(profile): add V1 identity and preferences surface`
5. `feat(stats): add V1 performance overview surface`
6. `feat(strategy-locker): add V1 premium strategy surface`
7. `feat(account): add notifications settings and billing surfaces`
8. `docs(v1): record dropdown IA and route rollout`

## 5. Exit Criteria For This Phase

This dropdown execution phase is considered structurally complete when:
- avatar dropdown is canonical and grouped
- each menu item points to either a real route or a documented deferred surface
- the first three high-value destination screens are live
- no menu item leads to a dead or placeholder route
