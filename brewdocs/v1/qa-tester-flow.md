# BrewLotto V1 QA Tester Flow

**Last Updated:** 2026-05-16 ET

This guide is for approved QA tester accounts only. It is separate from BrewCommand superadmin access and separate from customer support.

## Purpose

Use the Test Lab to test the full app the way a real customer would, then report what happened versus what should have happened.

This flow is intentionally hybrid:

- Guided pass to verify the core path and capture reliable defect data
- Free-roam pass to see whether the app gives testers enough cues to navigate on their own

## Who Uses It

- Family / QA testers
- Approved tester emails listed in `BREWQA_TESTER_EMAILS`
- Not superadmins

## Test Lab Rules

- Keep `command@brewlotto.app` and other superadmin accounts out of the QA workflow unless you are explicitly testing BrewCommand itself.
- Use the QA tester account for the customer journey.
- Use fake Stripe test cards while billing is in test mode.
- Complete the guided pass and free-roam pass within 1 week of your Test Lab start date.
- Keep notes short, specific, and tied to one page or one action.
- Treat QA reports as product testing, not customer support.

## Severity Scale

- `S0` - Blocker: flow cannot continue, data loss, or security issue
- `S1` - Major: core feature broken or misleading
- `S2` - Medium: feature works but has a clear defect or confusing behavior
- `S3` - Minor: wording, spacing, or small interaction issue
- `S4` - Polish: nice-to-have improvement or visual refinement

## What The Form Captures

The `/qa` form already mirrors the data we want back from testers:

- Tester identity is auto-captured from the signed-in account, and the page lets the tester confirm a display name before submitting
- Tester name
- Tier tested
- Journey stage
- Feature area
- Priority
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

## Recommended Test Method

### Pass 1: Guided

Follow the route in order so we can verify the core flow without guessing:

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
13. Submit the report in `/qa` with the clearest page and issue you found.

### Pass 2: Free-Roam

After the guided pass, ask the tester to explore without instructions and answer these questions:

- Can they find how to upgrade?
- Can they find where saved picks live?
- Can they find results and stats on their own?
- Can they find notifications?
- Can they find BrewU help?
- Can they find support?
- Can they tell what the current tier is?
- Can they tell what to do next without being coached?

The point of this pass is not just bug hunting. It is to measure whether the app’s labels and cues are strong enough for a first-time user.

## Tab-by-Tab Roadmap

### 1. Login / Auth

- Confirm the magic-link login page loads cleanly.
- Confirm Turnstile appears and does not block normal sign-in.
- Confirm the app routes to the expected destination after login.
- Note any callback, redirect, or email issues.

### 2. Onboarding

- Confirm the disclaimer/tutorial flow is visible and understandable.
- Confirm the replayable tutorial matches the live app behavior.
- Confirm the onboarding path leads into the dashboard cleanly.

### 3. Dashboard

- Confirm the home surface loads cleanly.
- Confirm the app explains the current tier and next step.
- Confirm the generate / browse / resume cues are understandable.
- Confirm the page does not feel like a raw admin screen.

### 4. Strategy Locker

- Confirm the correct game and tier are visible.
- Confirm strategies unlock at the right tier.
- Confirm the run-preview flow works.
- Confirm save / favorite behavior is clear.
- Confirm the app explains what is happening while a strategy runs.

### 5. My Picks

- Confirm saved picks are shown, not random history.
- Confirm the confirmation action (`I Played This` / `Played`) is obvious.
- Confirm the page distinguishes generated previews from confirmed plays.
- For NC Pick 3 / Pick 4, confirm Fireball appears when relevant.

### 6. Results

- Confirm draw history groups by date clearly.
- Confirm the correct draw time / date is visible.
- Confirm the match display is tied to the right draw window.
- Confirm stale or delayed results are communicated clearly.

### 7. Stats & Performance

- Confirm hit / win / performance labels make sense to a normal user.
- Confirm the strategy ratios reflect confirmed plays, not loose predictions.
- Confirm the page feels like a customer stats page, not a database view.

### 8. Billing / Subscription

- Confirm the current plan is visible.
- Confirm upgrade and downgrade paths are understandable.
- Confirm Stripe checkout opens correctly.
- Confirm the portal / return flow lands back in the app.
- Confirm the UI updates after entitlement changes.

Use these test cards in Stripe test mode:

- `4242 4242 4242 4242` for a successful checkout
- `4000 0000 0000 0002` for a generic decline path

### 9. Notifications

- Confirm the inbox loads and the empty state is clear if there are no items.
- Confirm unread / new / all behavior makes sense.
- Confirm support and settlement notifications read clearly.
- Confirm notification settings are understandable.

### 10. Settings

- Confirm profile / gameplay / notification settings are grouped clearly.
- Confirm the save behavior is obvious.
- Confirm the page does not use confusing internal labels.

### 11. Profile

- Confirm the account area shows the right identity and tier.
- Confirm the user can tell where to manage account settings.
- Confirm the route feels like a customer profile, not a hidden system page.

### 12. BrewU

- Confirm the quick index works.
- Confirm the links jump to the right sections.
- Confirm the play-style, Fireball, payouts, freshness, and AI guidance sections are understandable.
- Confirm the system links point to the right app areas.

### 13. Support

- Confirm the category list includes the right areas.
- Confirm issues can be described clearly with a screenshot.
- Confirm the response window is obvious.
- Confirm the issue reaches BrewCommand and does not get lost in customer support.

### 14. Legal / Logout

- Confirm Terms / Privacy are reachable.
- Confirm logout is immediate and obvious.
- Confirm the user can return to login cleanly after sign-out.

## Report Template

Use this when filling out `/qa` or when handing notes to BrewCommand:

- Tester:
- Tier tested:
- Journey stage:
- Feature area:
- Priority:
- Page path:
- Loaded as expected: yes / no
- Tier matched: yes / no
- Next step matched: yes / no
- Fireball relevant: yes / no
- TimePulse relevant: yes / no
- Expected behavior:
- Actual behavior:
- Notes:
- Screenshot(s):

## Draft Resume

- The Test Lab saves in-progress answers per tester email.
- If a tester closes the page or comes back later, the form should repopulate from the saved draft instead of starting over.
- Use the reset button only if the tester wants to clear the current draft and restart that report from scratch.

## Tester Access

- Approved tester emails are seeded in the shared auth helper and can be extended via `BREWQA_TESTER_EMAILS`.
- The current roster includes `rb.brewington@gmail.com` and `latasharorie@hotmail.com` so BrewLotto can be tested from the same signed-in account that owns the feature review.

## How BrewCommand Uses It

- QA reports land in `qa_reports`
- Screenshots land in `qa-screenshots`
- BrewCommand receives the report as an internal alert
- Admin can review and triage reports without mixing them into customer support

## Key Rules

- Approved testers are separate from superadmins.
- QA reports are not customer support requests.
- Keep screenshots and simple notes short and specific.
- Focus on whether the app did what the page promised, not on general opinions.
