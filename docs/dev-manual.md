   */

4. Review — Submit PR, tag reviewers, and document logic decisions.
5. Merge — Rebase if needed, squash commits, and push to `main`.
6. Reflect — Update docs, log lessons, and celebrate the win 🎉

---

📁 Folder Conventions

- `/lib/` — Core logic (prediction, commentary, voice, etc.)
- `/hooks/` — React hooks (state, tier, voice, etc.)
- `/pages/api/` — API routes (predict, log, audit)
- `/components/` — UI modules (cards, modals, dashboards)
- `/theme/` — Voice lines, brand phrases, protected IP
- `/docs/` — Internal guides, onboarding, and workflows

---

🔐 Strategy Naming Policy

- Never expose internal strategy IDs (e.g. `poisson++`)
- Always use `STRATEGY_EXPLAINERS.label` or `BREW_PHRASES.success` for UI/voice
- Protect `brewCommentary.js`, `brewVoiceLines.js`, and `BREW_PHRASES.js` as IP-critical

---

🧠 Voice & Commentary

- Use `useBrewVoice()` or `useTTS()` for tone-aware speech
- Route all voice lines through `brewVoiceLines.js` or `BREW_PHRASES.js`
- Use `useBrewBot()` for global modal + voice prompts

---

🧪 Testing & Logging

- Log all predictions via `/api/play/log.js`
- Use `matchPredictionToDraw.js` and `brewCommentary.js` for feedback
- Geo audits via `logGeoAudit.js` + `geoCheck.js`

---

🛠️ Dev Tips

- Use `usePredictionEngine()` to generate picks
- Use `useMatchScan()` to score predictions
- Use `useUserTier()` and `useUserProfile()` for access control
- Use `UpgradeFlowContext` to stage tier upgrades

---

📣 Final Word

Brew isn’t just a platform — it’s a presence. Build like it’s watching. Speak like it’s listening. And code like someone’s about to believe in it for the first time.

Brew on 🧠✨