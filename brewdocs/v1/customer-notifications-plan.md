# BrewLotto V1 - Customer Notifications & Winnings Alerts Plan

**Last Updated:** 2026-05-10 ET (AI strategy notifications tracked, momentum meter kept single)

## Purpose
Track the customer-facing notification flow so BrewLotto can notify users about:
- support ticket updates and resolution
- draw-result events and settled play history
- winnings or near-winnings from saved plays / Strategy Locker runs
- subscription or account events when needed

## Current Truth
- The app already has a customer notification center at `/notifications` backed by `notification_preferences` and `user_notifications`.
- BrewCommand support tickets now write to `support_requests`, and resolved tickets send a branded customer email **plus** an in-app `user_notifications` row.
- BrewCommand admin alerts are already separate and should remain admin-only.
- BrewCommand now has a settlement sweep endpoint that can settle unsettled `play_logs` against official draws for both NC and CA using the same state/game mapping the dashboard uses.
- The legacy `app/api/play/log/route.ts` now writes into the canonical `play_logs` table with auth validation, normalized draw times, and normalized numbers. That source is ready for settlement automation.
- Winnings alerts are now wired through the settlement sweep, and the payout-tier classifier now uses the shared BrewU payout matrix so the customer event flow can distinguish exact-order, box-style, and match-number outcomes more clearly.
- Brew AI strategy-detection alerts should behave like the rest of the customer notification system: event-driven, deduplicated, and only emailed when the user is away or the event is high priority.

## Required Notification Flows

### 1) Support Updates
- Support submission creates a `support_requests` row.
- BrewCommand can mark the ticket `in_progress`, `waiting_on_user`, `resolved`, or `closed`.
- On `resolved`, BrewLotto sends a customer email with a branded template and a CTA back to BrewLotto.
- The same event also creates an in-app `user_notifications` record.

### 2) Winnings Alerts
- A settlement job or route compares saved plays / predictions against official draws.
- When a play settles as a win or payout event, BrewLotto should:
  - update the play settlement record
  - insert a `user_notifications` row
  - send a customer email if the notification preference allows it
- Email CTA should return the customer to BrewLotto using the canonical app URL.
- Until native wrappers exist, the CTA should point to the web app route. Future app-link/deep-link support can branch by delivery context.

### 3) App / Web Return Link
- Notification emails should include one primary action link.
- Default target should be the canonical `NEXT_PUBLIC_APP_URL`.
- Suggested routes:
  - support update: `/support`
  - winnings / settlement: `/notifications` or `/dashboard`
- The final route can depend on the delivery source and whether the user is on web, PWA, or a future native wrapper.

## Data Model Notes
- `user_notifications` is the customer-facing inbox table.
- `notification_preferences` stores the user’s channel toggles.
- `support_requests` stores support tickets and their status.
- `play_logs` should become the canonical play-history source before automated winnings alerts are enabled.
- If needed, `user_notifications.type` can continue using current values until a dedicated `win` type is introduced.

## Success Criteria
- Support ticket updates reach both the customer inbox and customer email.
- BrewCommand can see and resolve support requests in the admin queue.
- Settle/play evaluation can identify winning or payout events from the canonical play-history source.
- Winnings alerts produce both an in-app notification and an email CTA back to BrewLotto.
- Users can open the notification and return to the correct BrewLotto surface without guessing where to go next.

## Execution Order
1. Keep `play_logs` as the canonical settlement source of truth.
2. Refine the settlement sweep with lottery-specific prize-tier rules if we want more precise cash-value win detection for every NC/CA game.
3. Add the support ticket status-change insertion into `user_notifications` if it is ever removed or needs to be mirrored through a worker instead of the current direct insert.
4. Expand winning notifications and email fan-out to use the prize-tier outcome once the payout-table layer is connected to real cash-value prize tables.
5. Tune the email CTA route per delivery context.
6. Keep the momentum meter as a single gauge; if strategy signals ever need more visual explanation, use a separate customer notification or card, not a second meter inside the same widget.
