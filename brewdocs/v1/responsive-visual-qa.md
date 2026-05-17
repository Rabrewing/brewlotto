# BrewLotto V1 Responsive Visual QA

Use this as the canonical visual pass for the launch shell.

## Order

Run the pages in this sequence at each device size.

### Laptop
1. `/`
2. `/login`
3. `/onboarding`
4. `/dashboard`
5. `/my-picks`
6. `/results`
7. `/strategy-locker`
8. `/stats`
9. `/pricing`
10. `/billing`
11. `/notifications`
12. `/settings`
13. `/profile`
14. `/learn`
15. `/support`
16. `/qa`
17. `/legal`
18. `/logout`
19. `/pick3`
20. `/pick4`
21. `/pick5`
22. `/powerball`
23. `/mega`
24. `/admin`
25. `/admin/brewu`

### Tablet
Repeat the same sequence at tablet width.

### Mobile
1. `/`
2. `/login`
3. `/dashboard`
4. `/my-picks`
5. `/results`
6. `/strategy-locker`
7. `/stats`
8. `/billing`
9. `/notifications`
10. `/settings`
11. `/learn`
12. `/support`

## What to check on every page

- Main content stays centered and readable
- Cards have breathable horizontal spacing
- No horizontal scroll appears
- Dropdowns and tabs fit the viewport
- Mobile-only controls do not overwhelm laptop widths

## Tablet-specific checks

- Shell still feels premium and centered
- Cards do not stack too tightly
- Dropdowns stay inside the viewport
- Tab rows can scroll naturally if needed
- Help and admin surfaces keep the same visual rhythm

## Mobile-specific checks

- The stacked layout still feels correct
- No content leaks off-screen horizontally
- Buttons and tabs remain readable
- Dropdowns remain usable
- The avatar menu does not clip

## Logout check

On laptop and tablet, confirm the avatar dropdown shows a visible Logout action without requiring the page to be dragged or scrolled out of place.

## Stop conditions

Pause and fix if you see:
- horizontal overflow
- clipped dropdowns
- broken tab wrapping
- tablet cards becoming too dense
- any route feeling like a different visual system

## Done when

- All laptop pages look stable
- All tablet pages look stable
- The core mobile pages still match the stacked layout
- No obvious spacing regressions remain
