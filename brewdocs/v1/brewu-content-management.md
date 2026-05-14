# BrewU Content Management

## Admin Panel

**URL:** `/admin/brewu`
**Access:** Superadmin only (gated by BrewCommand allowlist)

The BrewU admin panel lets you edit all Learn page content without deploying code.

### What you can edit

| Section | Table Key | What it controls |
|---------|-----------|------------------|
| Lessons | `lesson_*` | Hot/Cold, Momentum, Confidence, Hit vs Win, Strategy Variety cards |
| Fireball context | `fireball_context` | The NC Fireball reference note in BrewU |
| Play styles | `play_style` | Per-game play-style guidance (filtered by state_code + game_key) |

Each row has a title and body (plain text). Changes save immediately to the database and
appear on the Learn page on next load.

### Adding new content

New sections can be added through:
1. The `POST /api/admin/brewu-content` endpoint
2. Or directly via Supabase dashboard → `brewu_content` table

Required fields: `section_key`, `title`, `body`
Optional fields: `state_code`, `game_key`, `sort_order`

### How the Learn page loads content

1. Page loads → queries `brewu_content` for matching `section_key`
2. If rows exist → renders DB content
3. If no rows or DB unavailable → falls back to hardcoded defaults in `FALLBACK_LESSONS`

This means content is always visible — the DB is a layer on top of the static defaults.

### Play style matrix, payout guides, prize tables

These are NOT in the DB editor. They live in TypeScript files:
- `lib/brewwu/playStyleMatrix.ts`
- `lib/brewwu/payoutMatrix.ts`
- `lib/brewwu/prizeTableMatrix.ts`

These are data structures, not editorial content. Changing them requires a code deploy.

### API Routes

```
GET    /api/admin/brewu-content          — List all active content
POST   /api/admin/brewu-content          — Create new content row
PUT    /api/admin/brewu-content/[id]     — Update title, body, state, game, sort, etc.
DELETE /api/admin/brewu-content/[id]     — Soft-delete (sets is_active = false)
```

All routes require `service_role` authentication (admin-only).
