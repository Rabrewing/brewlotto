### Dev → Stage → Prod Pipeline

* Local: `pnpm dev`
* Staging: Vercel Preview Branches
* Prod: GitHub main branch → Vercel auto-deploy
* Database: Supabase migration via CLI

### Testing Checklist

* ✅ API endpoints respond (predict, audit, comment)
* ✅ Supabase auth (magic link + OAuth)
* ✅ Dashboard renders all widgets
* ✅ Voice commentary triggers correctly
* ✅ Prediction audit logs written successfully

### PWA & UX Checklist (BrewPulse)

*   [ ] Manifest valid; icons load (192/512/maskable)
*   [ ] Service worker registers in production
*   [ ] App is Installable (Chrome → Install App, iOS Add to Home)
*   [ ] Offline: offline.html shows when network drops
*   [ ] Lighthouse PWA score ≥ 90
*   [ ] Header sticky; dropdown closes on selection/blur
*   [ ] Install button only appears when beforeinstallprompt fires
*   [ ] Touch targets ≥ 44px; text contrast meets WCAG AA

### PWA Troubleshooting

*   SW doesn’t register locally → disable is true in dev. Build a prod build: `pnpm build && pnpm start`.
*   Icons not maskable → ensure 512x512 PNG with safe padding and `purpose: "maskable"`.
*   Install button not showing → Clear app data, ensure HTTPS, check `beforeinstallprompt` firing.

### PWA Deployment

*   Vercel production URL will enable service worker.
*   Re-test Install and offline behaviors post-deploy.