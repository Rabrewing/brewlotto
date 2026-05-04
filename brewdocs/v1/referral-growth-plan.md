<!--
/brewexec/brewdocs/v1/referral-growth-plan.md
Timestamp: 2026-05-04 ET
Purpose: Canonical referral growth plan for BrewLotto V1.5. Consolidates the referral task docs into a deferred, execution-ready plan with scope, rollout phases, success outcomes, and guardrails.
-->

# BrewLotto Referral Growth Plan

## Decision

Referrals are a good idea for BrewLotto, but not as part of the current V1 launch-critical surface.

Use referrals as a V1.5 growth loop after the following are stable:

- billing and entitlements
- notifications
- onboarding
- launch menu / destination QA
- tier gating and strategy behavior

This keeps the core product focused and avoids introducing a growth mechanic before the trust and payout plumbing is ready.

---

## What We Are Building

The referral system is a premium, product-native invite flow that rewards:

- qualified invites
- real activation
- paid conversion
- milestone-based community participation

It is not a cash-for-betting mechanic and must never be framed that way.

---

## Canonical Product Scope

### In scope

- referral code generation
- referral link sharing
- referral capture before signup
- activation tracking after signup
- automatic reward issuance
- milestone rewards
- lightweight referral dashboard
- admin oversight and fraud review

### Out of scope for V1

- cash payouts
- gambling-win framing
- public leaderboard spam
- ambassador campaign tooling
- deep social graph features
- heavy personalization based on referral behavior

---

## Recommended Reward Model

Keep the default reward classes product-native:

- temporary Pro access
- premium strategy preview access
- AI explanation credits
- badge XP
- small entitlement boosts

Keep conversion rewards modest and time-boxed so the feature stays cost-disciplined.

---

## Execution Phases

### Phase A - Foundation

Goal: create the referral identity and attribution layer.

Deliverables:

- referral code generation per user
- referral capture route or session context
- referral relationship records
- event ledger for capture and registration
- fraud checks for self-referral and duplicate attribution

Success outcomes:

- every user can share a stable referral link or code
- a referral can be captured before signup and survive registration
- referral records move through a deterministic lifecycle
- invalid or duplicate referrals are rejected cleanly

### Phase B - Activation Rewards

Goal: grant rewards when a referred user does something meaningful in-product.

Deliverables:

- activation evaluation
- automatic reward issuance on qualifying action
- referral dashboard showing pending, activated, and converted counts
- notification event for reward live status

Success outcomes:

- signup alone does not unlock rewards
- activation is tied to real BrewLotto usage
- the referrer and referred user both get a clear product benefit
- rewards expire cleanly when time-boxed

### Phase C - Conversion Rewards

Goal: reward paid conversions without making the system dependent on payment.

Deliverables:

- paid conversion attribution window
- conversion reward logic
- milestone badge logic
- admin revoke/recompute tools

Success outcomes:

- paid conversion is recognized inside the attribution window
- conversion rewards are auditable and reversible
- reward issuance does not conflict with billing or entitlements

### Phase D - Campaign Expansion

Goal: add growth campaigns only after the base loop is stable.

Deliverables:

- campaign keys
- seasonal promotions
- ambassador-style experiments
- campaign performance reporting

Success outcomes:

- campaigns can run without changing the core referral model
- campaign results are measurable
- abuse controls still hold under higher usage

---

## UI Placement

The referral surface should be accessible from:

- profile/account
- subscription / upgrade
- optional dashboard card behind a feature flag

Keep it premium, minimal, and one-thumb friendly.

Do not surface referrals too early in the journey.

---

## API Shape

The task docs already define the canonical route ideas.
The current implementation should stay aligned with these concepts:

- capture
- me
- share
- history
- internal activation evaluation
- internal conversion evaluation
- admin overview and moderation

No client route should be allowed to mutate referral state directly.

---

## Guardrails

- no gambling-success language
- no self-referral
- no multi-attribution overrides
- no reward without activation
- no reward without audit logging
- no reward leakage through UI copy

---

## Metrics For Success

Track the referral loop with the following outcomes:

- click-through rate
- signup rate
- activation rate
- conversion rate
- reward grant rate
- fraud rejection rate
- referred-user retention
- reward cost per activated referral
- reward cost per converted referral

The feature is successful when it produces real product adoption, not vanity signups.

