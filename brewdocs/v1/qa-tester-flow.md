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
4. Move to `Starter` and verify Strategy Locker unlocks the expected strategies.
5. Run a strategy, save it to `My Picks`, and confirm the play.
6. For NC Pick 3 / Pick 4, verify the Fireball prompt and Fireball display when relevant.
7. Open `Results` and confirm only the matching draw date is treated as a match.
8. Check `Stats & Performance` and confirm ratios track confirmed plays, not just generated previews.
9. Repeat the flow on `Pro`.
10. Repeat the flow on `Master` and verify TimePulse appears only for Master access.
11. Use `/qa` to submit what you saw.

## What The Form Captures

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

## How BrewCommand Uses It

- QA reports land in `qa_reports`
- Screenshots land in `qa-screenshots`
- BrewCommand receives the report as an internal alert
- Admin can review and triage reports without mixing them into customer support

## Key Rules

- Approved testers are separate from superadmins.
- QA reports are not customer support requests.
- Use fake Stripe test cards while the billing environment is still in test mode.
- Keep screenshots and simple notes short and specific.
- Focus on whether the app did what the page promised, not on general opinions.
