# BrewLotto V1 Responsive Layout Checklist

**Last Updated:** 2026-05-16 ET

## Goal
Keep mobile readable while widening desktop/tablet surfaces so the app feels fluid, premium, and less vertically constrained on larger screens.

## Checklist

- [x] Widen shared app shell on desktop/tablet only
- [x] Preserve current mobile stacked-card behavior
- [ ] Verify `/dashboard` on desktop with wider content band
- [ ] Verify `/learn` on desktop with wider content band
- [ ] Verify `/support` on desktop with wider content band
- [ ] Verify `/strategy-locker` on desktop with wider content band
- [ ] Verify `/billing` on desktop with wider content band
- [ ] Verify `/stats` on desktop with wider content band
- [ ] Check card spacing and text rhythm at `sm`, `md`, `lg`, and `xl`
- [ ] Confirm no horizontal overflow on tablet widths
- [ ] Confirm no layout regressions on mobile widths
- [ ] Capture any screenshot diffs that still feel too narrow or too dense

## Notes
- Use the same visual language across breakpoints.
- Increase width and content density on larger screens, not font size.
- Do not break the current mobile tutorial / onboarding flow.
