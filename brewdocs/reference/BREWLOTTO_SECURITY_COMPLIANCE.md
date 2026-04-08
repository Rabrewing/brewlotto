### Security Framework

* Supabase RLS active on all tables.
* Role tiers: `admin`, `strategist`, `player`.
* Encrypted communication between BrewCommand ↔ BrewPulse.
* OAuth via Supabase Auth (Google, GitHub, Magic Link).

### Compliance

* CCPA + GDPR adherence for user data.
* Age 18+ gate on all prediction access.
* API keys stored via Vercel secrets, not in repo.
