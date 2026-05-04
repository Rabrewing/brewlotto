# BrewLotto V1 — Go-to-Market Plan

## Status: Pre-Launch (Ingestion Verifiied, Onboarding Built, PWA Ready)

---

## Phase 1: Web Launch (Current — Live at brewlotto.vercel.app)

### ✅ Already Complete

| Area | Status | Detail |
|------|--------|--------|
| Core ingestion | ✅ Live | All 8 NC + CA games scraping live, 3-round retry, auto-recovery |
| Freshness system | ✅ Live | Healthy/Delayed/Stale status, trust badge, ET/PT timezone display |
| Onboarding flow | ✅ Built | Disclaimer acknowledgment → tutorial → dashboard |
| Route protection | ✅ Live | Middleware blocks un-onboarded users |
| Results API | ✅ Live | All 5 game endpoints returning real draw data |
| Number formatting | ✅ Live | Natural integers (6 not 06), global consistency |
| PWA assets | ✅ Built | `manifest.webmanifest`, icons, offline support |
| BrewCommand admin | ✅ Live | Ingestion health, alert console, freshness monitoring |

### 🔧 Remaining Before Web Launch

- Shared SectionCard component (centralize 6 duplicates)
- Mockup QA — visually align 15 mockup PNGs against rendered pages
- Stripe billing integration
- CA Multi-State (Powerball/Mega Millions — stale for CA)

---

## Phase 2: PWABuilder → Google Play Store

### What It Is
Microsoft's PWABuilder takes your PWA URL and packages it into a standards-compliant Android APK/AAB for the Google Play Store.

### Effort: Low (~1-2 days total)

### Steps

| Step | Detail |
|------|--------|
| 1. Validate PWA | Run Lighthouse PWA audit — score should be ≥90 |
| 2. Fix gaps | Add missing PWA requirements (service worker caching, offline fallback) |
| 3. Package | Use PWABuilder CLI or web tool at https://pwabuilder.com |
| 4. Sign | Generate Android signing key |
| 5. Submit | Upload AAB to Google Play Console ($25 one-time fee) |

### Requirements

| Requirement | Status | Notes |
|-------------|--------|-------|
| HTTPS | ✅ Already on Vercel with SSL |
| manifest.webmanifest | ✅ Already exists at `public/manifest.webmanifest` |
| Icons (192px, 512px) | ✅ In `public/icons/` |
| Service worker | ⚠️ Check — may need registration in `app/layout.tsx` |
| Offline page | ⚠️ `public/offline.html` exists, may need service worker routing |
| Fast first load | ✅ Next.js generates static HTML |

### Timeline

```
Week 1: PWA audit + service worker registration
Week 2: PWABuilder packaging + Play Store submission
Week 3: Review cycle (1-3 days typical)
Week 4: Live on Google Play
```

---

## Phase 3: Capacitor → Apple App Store

### What It Is
Ionic Capacitor wraps your Next.js web app in a native WebView with iOS APIs (push notifications, biometrics, in-app purchases, etc.).

### Effort: Medium (~1-2 weeks)

### Architecture

```
Next.js App (brewlotto.vercel.app)
       ↓
Capacitor Shell (native wrapper)
       ↓
iOS App Store / Google Play (supplementary)
```

### Steps

| Step | Detail |
|------|--------|
| 1. Install Capacitor | `npm install @capacitor/core @capacitor/cli` |
| 2. Build Next.js | `npm run build` — generates `out/` directory |
| 3. Init Capacitor | `npx cap init brewlotto com.brewlotto.app` |
| 4. Add platforms | `npx cap add ios && npx cap add android` |
| 5. Configure | Set server URL, splash screen, permissions in `capacitor.config.ts` |
| 6. Build native | `npx cap sync` then open in Xcode / Android Studio |
| 7. Submit to Apple | Requires Apple Developer Program ($99/year) |

### Key Differences from PWABuilder

| Aspect | PWABuilder | Capacitor |
|--------|------------|-----------|
| App Store | Google Play only | Google Play + Apple App Store |
| Push notifications | Web push API (limited iOS) | Native push (APNs/FCM) |
| In-app purchases | Web Payment API | StoreKit (iOS) |
| Development cost | Free | $99/yr Apple Developer |
| Build complexity | Low (website → APK) | Medium (manages native project) |
| iOS support | PWA works on Safari | Full native iOS app |

### Timeline

```
Week 1: Install Capacitor, configure, build iOS app
Week 2: Test on simulator, fix WebView issues
Week 3: Apple Developer registration + submission
Week 4: App Store review (1-7 days typical)
Week 5: Live on App Store
```

---

## Distribution Strategy

### Launch Order

```
1. Web (brewlotto.vercel.app) — NOW
2. Google Play (PWABuilder) — Week 1-2
3. Apple App Store (Capacitor) — Week 3-6
```

### User Acquisition

| Channel | Method | Cost |
|---------|--------|------|
| Web | SEO, lottery forums, Reddit, Twitter | Free |
| Google Play | Play Store search, ASO | $25 one-time |
| Apple App Store | App Store search, ASO | $99/year |
| Referral | V1.5 referral growth loop (deferred until billing, notifications, and strategy gating are stable) | Free |
| Content | BrewU lessons, Reddit posts | Free |

### Pricing Model (V1)

| Tier | Price | Features |
|------|-------|----------|
| Trial | 3 days, capped | Full product preview with limited AI usage |
| Brew | TBD | Explainable picks, commentary, match tracking |
| Master | TBD | Advanced analytics, deeper premium surfaces |

*Note: Stripe integration is not yet wired, so `/pricing` is the public comparison surface and `/billing` remains the authenticated account summary.*

### Trial Recommendation

- Default launch trial: 3 days
- Cap AI-heavy usage during the trial
- Avoid an unlimited free period for cost control
- Convert users after they have seen the landing page, onboarding, and dashboard value loop

---

## Auth & Email Setup

### Current State

| Component | Detail |
|-----------|--------|
| Auth method | Supabase Magic Link (`signInWithOtp`) |
| Account creation | `shouldCreateUser: true` — auto-creates on first sign-in |
| Post-login flow | `/auth/callback` → `/onboarding` → `/dashboard` |
| Public entry | `/` landing page with autoplay CTA video |
| Email delivery | Supabase built-in (rate-limited, ~2-3/hr on free plan) |
| Custom SMTP | Not configured |
| Admin emails | `BREWCOMMAND_ADMIN_EMAILS=command@brewlotto.app` |

### Recommended: Resend for Email Delivery

Supabase's built-in email is fine for development but unreliable for production. Resend fixes deliverability and lets you send from your own domain.

#### Setup Steps

| Step | Detail |
|------|--------|
| 1. Create Resend account | https://resend.com — free tier includes 3000 emails/mo |
| 2. Verify domain | Add `brewlotto.app` DNS records (MX + TXT) in your DNS provider |
| 3. Get SMTP credentials | Resend Dashboard → SMTP → Create API key |
| 4. Configure Supabase | Project Settings → Auth → Custom SMTP → paste Resend SMTP values |
| 5. Test | Sign up at `brewlotto.vercel.app` with `command@brewlotto.app` — confirm magic link arrives |

#### Resend SMTP Settings

| Field | Value |
|-------|-------|
| Host | `smtp.resend.com` |
| Port | `587` |
| Username | `smtp` (literal, not your email) |
| Password | Your Resend SMTP API key |
| Sender email | `noreply@brewlotto.app` |

#### Why Resend Over Alternatives

| Service | Free Tier | Deliverability | Setup |
|---------|-----------|---------------|-------|
| **Resend** | 3000/mo | High | 5 min |
| SendGrid | 100/day | Medium | 10 min |
| Supabase built-in | ~2/hr | Low | None (default) |
| AWS SES | 62000/mo | High | 30 min (domain verify) |

### Admin Access

- **Superadmin email:** `command@brewlotto.app` — sign up via magic link, middleware auto-detects admin role
- **Route:** `/admin` — ingestion health, alert console, freshness monitoring
- **Auth check:** `BREWCOMMAND_ADMIN_EMAILS` env var + `lib/auth/brewcommand.ts`

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Apple rejects WebView app | Medium | High | Ensure app provides unique value beyond browser; add native features |
| PWA audit fails | Low | Medium | Fix service worker caching before PWABuilder step |
| Google Play policy changes | Low | Medium | Monitor Play Store developer policies for PWA/Trusted Web Activity rules |
| Lottery data source changes | Medium | High | Scraper monitoring + BrewCommand alerts already in place |
| Stripe integration delays | Medium | Medium | Launch with free-only tier, add billing post-launch |

---

## Success Metrics

| Metric | Web | Google Play | App Store |
|--------|-----|-------------|-----------|
| Daily active users | 100 | 50 | 50 |
| Weekly active users | 500 | 250 | 250 |
| Prediction generations/day | 200 | 100 | 100 |
| Premium conversion rate | 5% | 5% | 5% |
| Crash-free rate | 99.5% | 99.9% | 99.9% |
| PWA Lighthouse score | ≥90 | — | — |
| App Store rating | — | ≥4.0 | ≥4.0 |

---

## Reference Files

- `public/manifest.webmanifest` — PWA manifest
- `public/icons/` — App icons (192px, 512px)
- `brewdocs/reference/case-study_brewlotto_frontend_pwa.md` — Existing PWA migration case study
- `brewdocs/v1/onboarding-spec.md` — User onboarding flow
- `brewdocs/v1/shared-ui-ux-framework.md` — Shared UI framework
- `brewdocs/v1/onboarding-spec.md` — User onboarding + disclaimer flow
- `lib/auth/brewcommand.ts` — Admin authorization logic
- `app/login/page.tsx` — Magic link auth entry point
- `app/auth/callback/route.ts` — Post-login code exchange

---

## Email Template

The magic link email template uses BrewLotto dark/gold branding (`#050509` background, `#FFD700` gold, `#f7d6ab` warm text, gradient gold CTA button). Template is configured in Supabase Dashboard → Auth → Email Templates → Magic Link. Variables: `{{ .ConfirmationURL }}`, `{{ .ExpirationHours }}`.

---

**Last Updated:** 2026-05-02  
**Author:** BrewLotto PM / BrewExec
