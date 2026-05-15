# BrewLotto V1 QA Tester Flow

**Last Updated:** 2026-05-15 ET

This guide is for approved QA tester accounts only. It is separate from BrewCommand superadmin access and separate from customer support.

## Purpose

Use the Test Lab to walk the full app the same way a real customer would, then report what happened versus what should have happened.

## Who Uses It

- Family / QA testers
- Approved tester emails listed in `BREWQA_TESTER_EMAILS`
- Not superadmins

## Recommended Test Flow

1. Sign in and wait for the intro overlay to explain the test flow.
2. Acknowledge the guide, then start at `Onboarding` if you are new.
3. Open the Dashboard and confirm the free-tier showcase looks right.
4. If the page points you to `Pricing`, check that it explains the tier ladder, then use `Billing` to manage a plan if needed.
5. Move to `Starter` and verify Strategy Locker unlocks the expected strategies.
6. Run a strategy in Strategy Locker first, then save it to `My Picks` when the app asks you to.
7. Use the `My Picks` confirm step (`I Played This` / `Played`) so BrewLotto can tell the difference between a generated preview and a real play.
8. For NC Pick 3 / Pick 4, verify the Fireball prompt and Fireball display when relevant.
9. Open `Results` and confirm only the matching draw date is treated as a match.
10. Check `Stats & Performance` and confirm ratios track confirmed plays, not just generated previews.
11. Repeat the flow on `Pro`.
12. Repeat the flow on `Master` and verify TimePulse appears only for Master access.
13. Use `/qa` to submit what you saw.

## What The Form Captures

- Tester identity is auto-captured from the signed-in account, and the page lets the tester confirm a display name before submitting.
- Tester name
- Tier tested
- Journey stage
- Feature area
- Yes / no checks for:
  - Page loaded cleanly
  - Tier matched the account
  - The next step was correct
- Fireball relevance
- TimePulse relevance
- Expected behavior
- Actual behavior
- Optional notes
- Optional screenshots
- Browser / viewport metadata

## Draft Resume

- The Test Lab saves in-progress answers per tester email.
- If a tester closes the page or comes back later, the form should repopulate from the saved draft instead of starting over.
- Use the reset button only if the tester wants to clear the current draft and restart that report from scratch.

## Tester Access

- Approved tester emails are seeded in `BREWQA_TESTER_EMAILS`.
- The current roster includes `rb.brewington@gmail.com` so BrewLotto can be tested from the same signed-in account that owns the feature review.

## How BrewCommand Uses It

- QA reports land in `qa_reports`
- Screenshots land in `qa-screenshots`
- BrewCommand receives the report as an internal alert
- Admin can review and triage reports without mixing them into customer support

## Key Rules

- Approved testers are separate from superadmins.
- QA reports are not customer support requests.
- Use fake Stripe test cards while the billing environment is still in test mode:
  - `4242 4242 4242 4242` for a normal successful checkout
  - `4000 0000 0000 0002` to test a generic decline path
- Keep screenshots and simple notes short and specific.
- Focus on whether the app did what the page promised, not on general opinions.
