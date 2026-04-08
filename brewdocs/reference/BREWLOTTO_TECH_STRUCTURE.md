### Directory Overview

```
/brewgold/
 ├── brewlotto/            # Core app
 │   ├── api/              # Prediction endpoints
 │   ├── components/       # UI modules (Dashboard, MomentumTracker, etc.)
 │   ├── hooks/            # Logic hooks (useBrewVoice, useFixSuggestion)
 │   ├── lib/              # Supabase + helper functions
 │   └── app/              # Next.js App Router routes
 ├── brew-command/         # Developer cockpit (internal tools)
 ├── brew-pulse/           # Emotional audit + commentary engine
 ├── brew-vision/          # Explainable AI overlays
 ├── brewdocs/             # Documentation and MD files
 └── lib/                  # Shared libraries (supabase, utils)
```

### Supabase Schema Highlights

* `draw_history` (Game, numbers, date)
* `predictions` (User, numbers, confidence, strategy)
* `strategies` (Model name, weight, parameters)
* `audit_logs` (Event, timestamp, subsystem)
* `commentary_streams` (Emotion, text, confidence)

### Core Dependencies

* Next.js 15 / React 19
* Supabase (Postgres + RLS)
* Tailwind CSS + Framer Motion
* OpenAI (GPT-5 API)
* NVIDIA NIM (Inference)
* Google TTS (Voice synthesis)
