<!--
/brewexec/brewdocs/BREWLOTTO_V1_REFERRAL_SYSTEM_SPEC.md
Timestamp: 2026-03-21 ET
Phase: V1.5 / Growth Loop / Referral System
Purpose: Define the referral system for BrewLotto V1.5, including product goals, reward logic, compliance guardrails, data model, API contracts, fraud controls, UX flows, notifications, admin visibility, rollout plan, and success metrics.
-->

# BrewLotto V1 Referral System Spec

## 1. Purpose

This document defines the referral program for BrewLotto.

The goal is to create a growth loop that:

- increases qualified user acquisition
- improves early activation
- supports subscription conversion
- reinforces BrewLotto’s education-first and analytics-first identity
- avoids gambling-style referral framing

This spec is intentionally designed to fit BrewLotto’s trust model.

Users are not being rewarded for gambling outcomes.
Users are being rewarded for inviting new users into the BrewLotto intelligence platform and helping them activate meaningful product usage.

---

## 2. Product Positioning

### 2.1 What the referral program is

BrewLotto referrals are a product-led growth system that rewards:

- successful user invites
- qualified account activation
- deeper product engagement
- selected paid conversions

### 2.2 What the referral program is not

The referral program is not:

- a cash-for-betting scheme
- a promise of lottery success
- a payout based on winnings
- a gambling incentive engine

### 2.3 Positioning rule

All public referral copy must frame rewards around:

- smarter play
- premium insights
- advanced tools
- education and strategy access

Not around:

- easy money
- guaranteed profit
- “earn from gambling” language

---

## 3. Goals

### 3.1 Primary goals

1. Increase new-user acquisition through trusted invites.
2. Improve activation rate of newly registered users.
3. Encourage users to experience BrewLotto’s premium value before full subscription commitment.
4. Increase paid conversion through referral-linked upgrade paths.
5. Create a measurable, fraud-resistant viral growth loop.

### 3.2 Secondary goals

1. Reinforce gamification and badge systems.
2. Create referral milestones for community identity.
3. Add a future growth surface for campaigns and seasonal promotions.
4. Support future partner or ambassador programs without redesigning the core system.

---

## 4. Guiding Principles

### 4.1 Trust over hype

The referral system must feel premium and exciting without appearing deceptive or predatory.

### 4.2 Activation over vanity signups

A referral does not count as successful merely because an account was created.
A referred user must complete a meaningful activation action.

### 4.3 Product rewards over cash-first rewards

Default BrewLotto rewards should be product-native benefits rather than direct cash payouts.

### 4.4 Tier-aware reward strategy

Free users and paid users may unlock different reward classes.

### 4.5 Fraud resistance from day one

The system must detect low-quality referrals, self-referrals, disposable account abuse, and suspicious reward farming.

---

## 5. Referral Model Recommendation

## 5.1 Core recommendation

BrewLotto should use a two-stage referral model:

### Stage A — Invite and Sign Up

A user shares a referral link or code.
A referred user signs up using that referral source.
This creates a pending referral relationship.

### Stage B — Activation

The referred user must complete a qualifying activation event.
Only then does the referral become reward-eligible.

### Optional Stage C — Paid Conversion

If the referred user upgrades to a paid plan within a defined attribution window, an additional conversion reward may be triggered.

### Why this is the right model

This structure avoids rewarding low-quality signups and ties rewards to real product adoption.

---

## 6. Referral States

Each referral record should move through a clean lifecycle.

### 6.1 Pending

Referral link clicked or code captured, but signup not yet completed.

### 6.2 Registered

User account created and linked to the referrer.

### 6.3 Activated

Referred user completed at least one qualifying activation event.
This is the primary reward trigger.

### 6.4 Converted

Referred user upgraded to a paid tier inside the attribution window.
This may unlock an additional reward.

### 6.5 Rejected

Referral invalidated due to fraud, self-referral, abuse, duplicate household rule, or policy violation.

### 6.6 Expired

Referral did not activate or convert within the allowed time window.

---

## 7. Qualifying Activation Events

BrewLotto should not make simple signup the success condition.
The activation event should reflect meaningful first value.

## 7.1 Recommended activation events for launch

A referred user qualifies as activated when they complete one or more of the following:

1. Generate their first smart pick.
2. Save a pick.
3. Log their first real play.
4. View at least one strategy explanation or “Why this pick?” explanation.
5. Complete a short onboarding milestone such as selecting a state, selecting favorite games, and generating first prediction.

## 7.2 Activation recommendation for V1.5

Use a composite activation rule:

A referred user is activated when they do both:

- create an account
- generate at least one prediction or save/log one pick

This is strong enough to filter low-quality referrals without introducing too much friction.

---

## 8. Conversion Event

### 8.1 Definition

A converted referral is a referred user who upgrades to a paid subscription within the attribution window.

### 8.2 Recommended attribution window

30 days from registration.

### 8.3 Why conversion matters

This enables a second reward layer without making the entire program dependent on payment.

---

## 9. Reward Strategy

## 9.1 Recommendation

Use product-native rewards first.
Avoid making the default referral economy cash-heavy at launch.

### 9.2 Reward classes

#### Activation rewards

Awarded when referred user activates.

Examples:

- temporary Pro access for 3 to 7 days
- extra premium pick credits
- additional AI explanation credits
- streak protection token
- bonus badge XP
- premium strategy preview unlock

#### Conversion rewards

Awarded when referred user becomes paid.

Examples:

- subscription discount credit
- free premium days
- additional AI quota
- export access preview
- limited Elite strategy trial

#### Milestone rewards

Awarded when a referrer reaches cumulative counts.

Examples:

- 3 successful referrals: “Scout” badge
- 10 successful referrals: “Strategist Ambassador” badge
- 25 successful referrals: special profile frame / founder reward path

---

## 9.3 Launch reward recommendation

### Referrer reward on activation

- 3 days of Pro access or equivalent premium unlock
- plus referral badge XP

### Referred user reward on activation

- 3 days of Pro access or equivalent premium unlock

### Referrer reward on paid conversion

- 7 additional Pro days or discount credit

### Referred user reward on paid conversion

- discounted first paid month or upgrade bonus pack

This creates a balanced “both win” system without resembling a betting referral cash payout scheme.

---

## 10. Eligibility Rules

### 10.1 Referrer eligibility

A user may refer others if:

- account is in good standing
- account is not flagged for abuse
- account has a valid user profile

### 10.2 Referred user eligibility

A referred user qualifies only if:

- they are a new user
- they are not the same person as the referrer
- they are not already attributed to a previous referral
- they are not flagged as abusive or duplicate

### 10.3 Self-referral rule

Self-referrals are not allowed.
Examples of likely self-referral indicators:

- same user identity
- same verified email pattern or linked profile evidence
- same device fingerprint where policy allows
- same payment method in later billing phase
- suspicious IP / session patterns

### 10.4 Single attribution rule

The first valid referral source gets credit.
Subsequent attempts to overwrite attribution should be blocked after registration.

---

## 11. Attribution Model

### 11.1 Referral source types

Support:

- referral code
- referral link with query param
- deep link for mobile-ready future path

### 11.2 Attribution behavior

When a user lands via referral:

- store referral code/campaign in temporary client storage
- preserve during signup flow
- attach to new user on registration

### 11.3 Last-click vs first-click recommendation

Use first valid referral attribution for launch.
This reduces conflict and gaming.

---

## 12. Data Model

### 12.1 New tables recommended

#### referral_codes

Stores shareable codes per user.

Suggested fields:

- id uuid pk
- user_id uuid not null
- code text unique not null
- is_active boolean default true
- created_at timestamptz
- updated_at timestamptz

#### referrals

Canonical referral relationship table.

Suggested fields:

- id uuid pk
- referrer_user_id uuid not null
- referred_user_id uuid null until signup complete
- referral_code_id uuid not null
- status text not null
- source_channel text null
- campaign_key text null
- attributed_at timestamptz null
- registered_at timestamptz null
- activated_at timestamptz null
- converted_at timestamptz null
- rejected_at timestamptz null
- expired_at timestamptz null
- rejection_reason text null
- fraud_score numeric(8,4) null
- created_at timestamptz
- updated_at timestamptz

#### referral_events

Event ledger for referral lifecycle.

Suggested fields:

- id uuid pk
- referral_id uuid not null
- event_type text not null
- event_payload jsonb default '{}'::jsonb
- created_at timestamptz

#### referral_rewards

Tracks reward issuance and status.

Suggested fields:

- id uuid pk
- referral_id uuid not null
- beneficiary_user_id uuid not null
- reward_type text not null
- reward_value jsonb not null
- reward_status text not null default 'pending'
- granted_at timestamptz null
- revoked_at timestamptz null
- revocation_reason text null
- created_at timestamptz

#### referral_campaigns

Optional campaign table for future promotions.

Suggested fields:

- id uuid pk
- campaign_key text unique not null
- name text not null
- start_at timestamptz null
- end_at timestamptz null
- config jsonb not null
- is_active boolean default true
- created_at timestamptz

---

## 12.2 Existing tables that may need extension

### profiles

Add referral summary helpers if needed:

- referral_count_success integer default 0
- referral_count_pending integer default 0

### user_entitlements

May need temporary reward-based entitlement overlays:

- referral_bonus_expires_at timestamptz null
- referral_bonus_flags jsonb null

### notifications

Use for referral reward notifications.

### audit events / BrewTruth tables

Log all reward grants, reversals, and rejections.

---

## 13. API Surface

### 13.1 Public / authenticated routes

#### POST /api/referrals/capture

Purpose:
Capture referral code from link before signup.

Input:
- referral code
- optional campaign info

Output:
- success
- referral context accepted or rejected

#### GET /api/referrals/me

Purpose:
Return referral dashboard data for current user.

Output:
- user referral code
- total pending referrals
- activated referrals
- converted referrals
- available rewards
- milestone progress

#### POST /api/referrals/share

Purpose:
Return share payloads or track share events.

Output:
- referral link
- code
- share templates

#### POST /api/referrals/activate-check

Purpose:
Evaluate whether a referred user has crossed activation threshold.
Likely internal server action or protected route.

#### POST /api/referrals/claim

Only needed if some rewards require manual claim.
Preferred launch mode is automatic granting.

---

### 13.2 Internal/admin routes

#### POST /api/admin/referrals/recompute/:id

Purpose:
Re-run evaluation for a referral.

#### POST /api/admin/referrals/revoke-reward/:id

Purpose:
Revoke fraudulent or erroneous reward.

#### GET /api/admin/referrals/overview

Purpose:
Return referral metrics, flags, abuse signals, and campaign performance.

---

## 14. Event Triggers

### 14.1 Referral registration trigger

When a new user signs up and has a valid captured referral context:

- create referral record
- set status to registered
- write referral event

### 14.2 Activation trigger

When referred user completes qualifying action:

- evaluate activation rule
- set status to activated
- create reward rows
- update entitlements
- send notifications
- write audit events

### 14.3 Conversion trigger

When referred user becomes paid within attribution window:

- set status to converted
- issue conversion rewards if enabled
- write notification and audit events

---

## 15. Reward Fulfillment Logic

### 15.1 Fulfillment mode recommendation

Use automatic reward grants for launch.
Manual claim adds friction and support burden.

### 15.2 Reward delivery mechanism

Product-native rewards should be fulfilled by:

- entitlement overlays
- temporary feature flags
- quota adjustments
- notification confirmations

### 15.3 Expiring rewards

Referral rewards should normally have expiration dates.

Examples:

- Pro unlock expires after 3 or 7 days
- premium explanation credits expire after 30 days

This controls cost and encourages timely engagement.

---

## 16. UX / UI Architecture

### 16.1 Core user surfaces

#### Referral entry point

Recommended placement:

- profile screen
- account/subscription screen
- optional dashboard promotion card

#### Referral dashboard screen

Should show:

- user’s referral code
- invite/share button
- how it works section
- current rewards
- pending invites
- activated invites
- progress toward next milestone

#### Referred-user landing treatment

When arriving via referral:

- welcome banner or light indicator
- explain bonus clearly
- keep signup friction low

---

### 16.2 Recommended screen copy direction

Headline examples:

- Invite a friend. Unlock smarter play.
- Play smarter together.
- Share BrewLotto. Earn premium insights.

How-it-works examples:

1. Invite friends.
2. They join and start using BrewLotto.
3. You both unlock premium rewards.

### 16.3 Visual alignment

The referral screen should match BrewLotto’s premium glow system and dark/gold visual language.
It should feel like a premium growth surface, not a cheap coupon page.

---

## 17. Notification Design

### 17.1 User notifications

Send notifications for:

- referral signup completed
- referral activated
- reward granted
- referral converted
- milestone reached

### 17.2 Channel recommendation for launch

- in-app notifications first
- email optional for major reward moments

### 17.3 Notification tone

Use product/insight framing.
Example:

- Your friend activated BrewLotto. Your Pro reward is now live.
- You unlocked a premium strategy bonus from your latest referral.

---

## 18. Fraud and Abuse Controls

Fraud resistance is mandatory for launch.

### 18.1 Abuse scenarios

- self-referrals
- fake account farms
- disposable email abuse
- same household/device loops
- coordinated reward cycling
- payment method abuse on conversion rewards

### 18.2 Fraud controls

Recommended controls:

1. Limit one rewardable referral per referred user.
2. Prevent referred users from being linked to multiple referrers.
3. Require activation event, not just signup.
4. Delay conversion reward until payment is confirmed and not immediately refunded.
5. Add lightweight risk scoring.
6. Flag suspicious velocity, such as too many referrals from same IP/device cluster.
7. Enable manual review for high-value rewards.

### 18.3 Reward hold recommendation

Conversion rewards may enter a short pending window before final issuance.
Example: 3 to 7 days after payment success to reduce abuse/refund farming.

---

## 19. BrewTruth / Audit Rules

BrewTruth should govern the referral system just as it governs predictions and trust-sensitive actions.

### 19.1 BrewTruth checks

- referrer and referred identities are distinct
- referred user is net-new
- activation event is valid
- reward eligibility is satisfied
- fraud score is below threshold
- copy and reward framing remain compliant

### 19.2 Audit events to log

- referral captured
- referral registered
- referral activated
- reward granted
- reward revoked
- referral rejected
- referral converted
- suspicious referral flagged

### 19.3 Rejection behavior

If BrewTruth flags a referral:

- do not grant reward
- mark referral as rejected or review-required
- create admin-visible audit trail

---

## 20. Metrics and Reporting

### 20.1 Core growth metrics

Track:

- referral link click-through rate
- referral signup rate
- referral activation rate
- referral conversion rate
- reward grant rate
- fraud rejection rate
- average referred user retention
- average referred user paid conversion vs non-referred users

### 20.2 Product quality metrics

Track:

- referred user time to first prediction
- referred user onboarding completion
- referred user 7-day retention
- referred user 30-day retention

### 20.3 Reward economics metrics

Track:

- reward cost per activated referral
- reward cost per converted referral
- net revenue impact by campaign

---

## 21. Admin / BrewCommand Scope

BrewCommand should expose referral oversight in a lightweight growth/ops module.

### 21.1 Required admin views

- referrals overview summary
- pending / activated / converted counts
- suspicious referrals queue
- reward issuance log
- campaign performance dashboard
- manual revoke / recompute tools

### 21.2 Useful filters

- date range
- campaign
- source channel
- tier of referrer
- fraud risk score
- reward status

---

## 22. Rollout Plan

### 22.1 Phase recommendation

This feature belongs in V1.5, after:

- billing is stable
- entitlement updates are stable
- notifications are stable
- activation events are clearly defined

### 22.2 Suggested rollout phases

#### Phase A — Foundation

- referral code generation
- referral capture
- referral registration
- internal logging only

#### Phase B — Activation rewards

- activation tracking
- automatic product-native rewards
- referral dashboard UI

#### Phase C — Conversion rewards

- paid conversion attribution
- conversion reward issuance
- milestone badge logic

#### Phase D — Campaign expansion

- seasonal campaigns
- ambassador programs
- channel-based experiments

---

## 23. Compliance and Messaging Guardrails

### 23.1 Required framing

Public messaging must position rewards as product benefits tied to platform participation.

### 23.2 Avoid language such as

- make money inviting players
- earn from lottery play
- guaranteed bonus for gambling
- win more by referring others

### 23.3 Preferred language

- unlock premium insights
- get advanced tools
- invite a friend and both unlock rewards
- unlock smarter play together

### 23.4 Platform trust alignment

Referral rewards must not imply that lottery outcomes become more predictable because someone referred a friend.

---

## 24. Testing Requirements

### 24.1 Unit tests

Test:

- referral code generation
- attribution logic
- activation evaluation logic
- reward eligibility logic
- fraud flag thresholds

### 24.2 Integration tests

Test:

- referral captured before signup
- referral attached at signup
- activation event moves status correctly
- reward fulfillment updates entitlements
- conversion event grants reward correctly

### 24.3 E2E tests

Test:

- invite → signup → activation journey
- invite → signup → upgrade journey
- rejected self-referral flow
- duplicate attribution prevention

### 24.4 Admin tests

Test:

- flagged referral appears in admin
- reward revocation updates state cleanly
- recompute path works without duplication

---

## 25. Success Criteria

The referral system is successful when:

1. It drives net-new users, not low-quality signups.
2. Activation rate from referred users is meaningfully above baseline organic signup behavior.
3. Rewards are easy to understand and low-friction to redeem.
4. Fraud remains controlled and visible.
5. The system improves retention and conversion without introducing trust concerns.
6. The feature feels premium and native to BrewLotto.

---

## 26. Final Recommendation

For launch of the referral system, BrewLotto should:

- use product-native rewards rather than cash-first incentives
- require a meaningful activation event before granting rewards
- optionally add a second reward tier for paid conversion
- keep messaging centered on smarter play, premium tools, and insight unlocks
- treat fraud controls and BrewTruth validation as part of the core feature, not an afterthought

This creates a referral program that is:

- growth-friendly
- compliant in tone
- aligned with BrewLotto’s product identity
- extensible for future campaign and ambassador programs

---

## 27. Immediate Follow-On Docs

The next useful companion specs after this one are:

1. BREWLOTTO_V1_REFERRAL_DB_ADDENDUM.md
2. BREWLOTTO_V1_REFERRAL_API_CONTRACTS.md
3. BREWLOTTO_V1_REFERRAL_UI_COPY_AND_WIREFRAME.md
4. BREWLOTTO_V1_REFERRAL_FRAUD_AND_REVIEW_RULES.md
5. BREWLOTTO_V1_REFERRAL_ANALYTICS_DASHBOARD_SPEC.md

---

## 28. BrewDocs Summary

What this doc does:
Defines BrewLotto’s referral system as a trust-safe, product-native growth loop built around invites, activation, conversion, and premium reward unlocks.

What it prevents:
Cash-heavy gambling-style referral framing, low-quality signup farming, unclear reward logic, and fraud-blind growth experimentation.

What it enables:
A scalable referral engine that supports acquisition, activation, retention, paid conversion, milestone rewards, and future campaign expansion.

