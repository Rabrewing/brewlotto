# BrewLotto V1 - Landing Page Spec

## Purpose

The landing page is the public entry surface for BrewLotto. It should immediately communicate brand, trust, and product energy without forcing the visitor into a plain sign-in wall.

## Route

- `/`

## Primary Goal

Convert a new visitor into a sign-in click while establishing the premium look, motion language, and responsible tone of the product.

## Required Sections

1. Hero headline
2. Short supporting copy
3. Autoplay CTA video
4. Small sound/replay affordance
5. Sign in CTA
6. Trust strip
7. Footer-level reminder that the app is informational only

## Visual Direction

- Dark premium shell
- Gold-forward accent palette
- Subtle glow and motion
- Mobile-first layout that still reads cleanly on desktop
- One strong video focal point, not a cluttered homepage

## Video Rules

- Prefer the Blob-backed reel URL from Vercel env vars when available
- Fall back to `/landing/brewlotto-cta.mp4` only when Blob is unavailable
- Autoplay must be muted, looped, and inline for browser compatibility
- Do not show default controls
- Keep the video framed as a product reveal, not a raw media embed
- Provide a tiny replay action and a small sound-on action so the user can hear the reel on demand

## Copy Rules

- Use clear, confident language
- Avoid guarantees or win-language
- Keep the first CTA short and direct
- Mention onboarding only as a truthful next step, not a sales trick

## Recommended Hero Copy

- Headline: `Watch BrewLotto come alive.`
- Subhead: `A premium lottery intelligence experience with a branded video hook, explainable picks, and a clean path into sign-in and onboarding.`

## CTA Strategy

- Primary: `Enter BrewLotto`
- Secondary: `Pricing`

## Trust Strip

The landing page should remind the visitor that BrewLotto is:

- source-aware
- explanatory
- responsible-use oriented
- not a guaranteed-win product

## User Flow

`Landing → Login → Onboarding Acknowledgment → Tutorial → Dashboard`

## Success Criteria

- Video autoplay works on mobile and desktop
- Sign-in CTA is obvious and above the fold
- The page feels premium instead of generic
- The disclaimer posture is visible before the user signs in
- The page can later be paired with pricing and trial messaging without redesigning the shell

## Future Creative

After the landing page is stable, short Opus Clip tutorial animations can be created for the onboarding sequence so the disclaimer, tutorial, and dashboard introduction feel connected instead of static.
