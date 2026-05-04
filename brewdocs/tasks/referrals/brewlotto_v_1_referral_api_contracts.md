<!--
/brewexec/brewdocs/BREWLOTTO_V1_REFERRAL_API_CONTRACTS.md
Timestamp: 2026-03-22 ET
Phase: V1.5 / Referral API Contracts
Purpose: Define the request/response contracts, route responsibilities, validation rules, auth rules, status transitions, and error model for the BrewLotto referral system.
-->

# BrewLotto V1 Referral API Contracts

## 1. Purpose

This document defines the API contract layer for the BrewLotto referral system.

It translates the referral product spec and referral UI spec into implementation-ready backend contracts so frontend, backend, and data logic all stay aligned.

This doc covers:

- route definitions
- request payloads
- response payloads
- auth requirements
- validation rules
- status transition rules
- reward trigger behaviors
- error contracts
- admin contract surfaces

This is the canonical API contract reference for the referral feature.

---

## 2. Design Principles

### 2.1 Product-safe contracts

The contracts must support BrewLotto’s trust-safe referral design.
They should never imply gambling outcomes, wagering-based earnings, or win-dependent referral rewards.

### 2.2 Deterministic status flow

Referral records must move through clear and auditable states.
The API should not allow arbitrary state mutation from the client.

### 2.3 Server-owned eligibility

The server decides:

- whether a referral is valid
- whether activation occurred
- whether rewards should be granted
- whether fraud review is required

The client can request, display, and initiate user actions, but trust decisions stay server-side.

### 2.4 Frontend simplicity

Frontend should receive clean, UI-friendly payloads:

- referral code
- share links
- progress data
- reward summaries
- milestone status

### 2.5 Admin separation

Public user contracts and admin contracts must stay separate.

---

## 3. Referral Status Model

These values should be treated as canonical response states.

- `pending`
- `registered`
- `activated`
- `converted`
- `rejected`
- `expired`
- `review_required`

### 3.1 State ownership

Only server-side services may transition referral status.
No client route should accept raw status updates from the browser.

---

## 4. Route Map Overview

### Public / user-scoped routes

- `POST /api/referrals/capture`
- `GET /api/referrals/me`
- `GET /api/referrals/share`
- `GET /api/referrals/history`
- `POST /api/referrals/claim` (optional, only if claim flow exists)

### Internal / protected system routes

- `POST /api/internal/referrals/evaluate-activation`
- `POST /api/internal/referrals/evaluate-conversion`
- `POST /api/internal/referrals/grant-reward`
- `POST /api/internal/referrals/recompute`

### Admin routes

- `GET /api/admin/referrals/overview`
- `GET /api/admin/referrals/list`
- `GET /api/admin/referrals/:id`
- `POST /api/admin/referrals/:id/recompute`
- `POST /api/admin/referrals/:id/revoke-reward`
- `POST /api/admin/referrals/:id/reject`

---

## 5. Public Route Contracts

## 5.1 POST /api/referrals/capture

### Purpose

Capture referral attribution context before signup or before account creation is completed.
This route stores or validates a referral code and returns whether the code is usable.

### Auth

No auth required.
Usable by anonymous visitors.

### Request Body

```json
{
  "code": "RB4821",
  "campaignKey": "spring_launch",
  "sourceChannel": "share_link"
}
```

### Validation Rules

- `code` required
- `code` trimmed and normalized to uppercase
- `campaignKey` optional
- `sourceChannel` optional but should match allowlist if present

### Success Response

```json
{
  "ok": true,
  "data": {
    "code": "RB4821",
    "isValid": true,
    "campaignKey": "spring_launch",
    "sourceChannel": "share_link",
    "referrerPreview": {
      "displayName": "RB",
      "avatarUrl": null
    },
    "captureTtlMinutes": 1440,
    "message": "Referral applied. Finish signup to unlock rewards."
  }
}
```

### Invalid Code Response

```json
{
  "ok": false,
  "error": {
    "code": "REFERRAL_CODE_INVALID",
    "message": "This referral code is not valid."
  }
}
```

### Notes

This route should not create a full referral record yet if no user account exists.
It may instead create temporary referral context in:

- signed cookie
- secure session store
- temporary referral capture table

---

## 5.2 GET /api/referrals/me

### Purpose

Return current user referral dashboard payload.

### Auth

Required.
Authenticated user only.

### Success Response

```json
{
  "ok": true,
  "data": {
    "referralCode": "RB4821",
    "shareLink": "https://brewlotto.app/invite/RB4821",
    "stats": {
      "pending": 2,
      "registered": 5,
      "activated": 3,
      "converted": 1,
      "rejected": 0
    },
    "progress": {
      "currentMilestone": 3,
      "nextMilestone": 5,
      "remainingToNext": 2,
      "progressPercent": 60
    },
    "activeRewards": [
      {
        "rewardId": "rw_123",
        "rewardType": "pro_access_trial",
        "label": "Pro Access Unlocked",
        "status": "active",
        "expiresAt": "2026-03-28T23:59:59Z"
      }
    ],
    "recentReferrals": [
      {
        "referralId": "ref_001",
        "status": "activated",
        "createdAt": "2026-03-20T18:00:00Z",
        "activatedAt": "2026-03-21T01:30:00Z"
      }
    ],
    "copy": {
      "headline": "Invite a friend. Unlock smarter play.",
      "subtext": "Share BrewLotto with friends and both unlock premium insights, strategies, and tools."
    }
  }
}
```

### Error Response

```json
{
  "ok": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "You must be signed in to view referral details."
  }
}
```

---

## 5.3 GET /api/referrals/share

### Purpose

Return normalized share payloads for current user.
Useful for mobile/web share sheet integration.

### Auth

Required.

### Query Params

Optional:

- `channel=sms|email|copy|generic`

### Success Response

```json
{
  "ok": true,
  "data": {
    "referralCode": "RB4821",
    "shareLink": "https://brewlotto.app/invite/RB4821",
    "shareText": "Join me on BrewLotto and unlock smarter play. Use my invite link to get started.",
    "channelTemplates": {
      "sms": "Join me on BrewLotto and unlock smarter play: https://brewlotto.app/invite/RB4821",
      "emailSubject": "Join me on BrewLotto",
      "emailBody": "I’ve been using BrewLotto for smarter picks and tracking. Use my invite link to get started: https://brewlotto.app/invite/RB4821"
    }
  }
}
```

---

## 5.4 GET /api/referrals/history

### Purpose

Return paginated referral history for the current user.

### Auth

Required.

### Query Params

- `page`
- `pageSize`
- `status` optional filter

### Success Response

```json
{
  "ok": true,
  "data": {
    "items": [
      {
        "referralId": "ref_001",
        "status": "activated",
        "createdAt": "2026-03-20T18:00:00Z",
        "registeredAt": "2026-03-20T18:15:00Z",
        "activatedAt": "2026-03-21T01:30:00Z",
        "convertedAt": null,
        "rewardSummary": [
          {
            "rewardType": "pro_access_trial",
            "status": "granted",
            "label": "3-Day Pro Access"
          }
        ]
      }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 1,
    "hasMore": false
  }
}
```

---

## 5.5 POST /api/referrals/claim

### Purpose

Optional manual claim route if the reward flow is not purely auto-grant.
Launch recommendation is to avoid manual claiming, but this route is defined for future compatibility.

### Auth

Required.

### Request Body

```json
{
  "rewardId": "rw_123"
}
```

### Success Response

```json
{
  "ok": true,
  "data": {
    "rewardId": "rw_123",
    "status": "claimed",
    "claimedAt": "2026-03-22T03:00:00Z"
  }
}
```

### Error Response

```json
{
  "ok": false,
  "error": {
    "code": "REWARD_NOT_CLAIMABLE",
    "message": "This reward cannot be claimed."
  }
}
```

---

## 6. Internal Route Contracts

These routes should not be called directly by the public frontend.
They are intended for server-side workflows, jobs, hooks, or event handlers.

## 6.1 POST /api/internal/referrals/evaluate-activation

### Purpose

Evaluate whether a referred user has completed a qualifying activation event.

### Trigger Sources

- first prediction generated
- first pick saved
- first play logged
- onboarding milestone completed

### Auth

Internal-only.
Service token, server action, or trusted job context required.

### Request Body

```json
{
  "userId": "usr_123",
  "eventType": "first_prediction_generated",
  "eventContext": {
    "predictionId": "pred_111",
    "gameKey": "pick3"
  }
}
```

### Success Response

```json
{
  "ok": true,
  "data": {
    "referralId": "ref_001",
    "eligible": true,
    "statusBefore": "registered",
    "statusAfter": "activated",
    "rewardsGranted": [
      {
        "rewardId": "rw_123",
        "beneficiaryUserId": "usr_referrer",
        "rewardType": "pro_access_trial"
      },
      {
        "rewardId": "rw_124",
        "beneficiaryUserId": "usr_123",
        "rewardType": "pro_access_trial"
      }
    ]
  }
}
```

### No-op Response

```json
{
  "ok": true,
  "data": {
    "eligible": false,
    "reason": "ACTIVATION_THRESHOLD_NOT_MET"
  }
}
```

---

## 6.2 POST /api/internal/referrals/evaluate-conversion

### Purpose

Evaluate whether a referred user has converted to a paid plan within the attribution window.

### Trigger Sources

- Stripe webhook processed
- entitlement upgraded
- subscription status changed to active

### Request Body

```json
{
  "userId": "usr_123",
  "subscriptionId": "sub_789",
  "tierCode": "pro",
  "effectiveAt": "2026-03-22T03:05:00Z"
}
```

### Success Response

```json
{
  "ok": true,
  "data": {
    "referralId": "ref_001",
    "eligible": true,
    "statusBefore": "activated",
    "statusAfter": "converted",
    "conversionRewardGranted": true,
    "rewardsGranted": [
      {
        "rewardId": "rw_200",
        "beneficiaryUserId": "usr_referrer",
        "rewardType": "bonus_pro_days"
      }
    ]
  }
}
```

---

## 6.3 POST /api/internal/referrals/grant-reward

### Purpose

Grant a reward after eligibility is already determined.
Normally called by internal services, not users.

### Request Body

```json
{
  "referralId": "ref_001",
  "beneficiaryUserId": "usr_referrer",
  "rewardType": "pro_access_trial",
  "rewardConfig": {
    "days": 3
  }
}
```

### Success Response

```json
{
  "ok": true,
  "data": {
    "rewardId": "rw_123",
    "rewardStatus": "granted",
    "grantedAt": "2026-03-22T03:10:00Z",
    "entitlementOverlay": {
      "tierCode": "pro_trial",
      "expiresAt": "2026-03-25T03:10:00Z"
    }
  }
}
```

---

## 6.4 POST /api/internal/referrals/recompute

### Purpose

Recompute referral state and rewards for one referral or one user after data repair, fraud review, or event replay.

### Request Body

```json
{
  "referralId": "ref_001",
  "reason": "admin_repair"
}
```

### Success Response

```json
{
  "ok": true,
  "data": {
    "referralId": "ref_001",
    "status": "activated",
    "recomputed": true,
    "changes": [
      "reward_revalidated"
    ]
  }
}
```

---

## 7. Admin Route Contracts

## 7.1 GET /api/admin/referrals/overview

### Purpose

Return top-level referral metrics for BrewCommand/admin.

### Auth

Admin role required.

### Success Response

```json
{
  "ok": true,
  "data": {
    "summary": {
      "pending": 21,
      "registered": 55,
      "activated": 29,
      "converted": 7,
      "rejected": 4,
      "reviewRequired": 3
    },
    "conversionRates": {
      "registrationToActivation": 52.73,
      "activationToConversion": 24.14
    },
    "rewardEconomics": {
      "grantedCount": 38,
      "revokedCount": 2
    },
    "fraudSignals": {
      "flaggedCount": 3,
      "highRiskCount": 1
    }
  }
}
```

---

## 7.2 GET /api/admin/referrals/list

### Purpose

Return paginated referral records for admin review.

### Query Params

- `page`
- `pageSize`
- `status`
- `campaignKey`
- `riskBand`
- `rewardStatus`

### Success Response

```json
{
  "ok": true,
  "data": {
    "items": [
      {
        "referralId": "ref_001",
        "referrerUserId": "usr_referrer",
        "referredUserId": "usr_123",
        "status": "review_required",
        "fraudScore": 0.82,
        "campaignKey": "spring_launch",
        "createdAt": "2026-03-20T18:00:00Z"
      }
    ],
    "page": 1,
    "pageSize": 50,
    "total": 1,
    "hasMore": false
  }
}
```

---

## 7.3 GET /api/admin/referrals/:id

### Purpose

Return full detail for a single referral including events and rewards.

### Success Response

```json
{
  "ok": true,
  "data": {
    "referral": {
      "referralId": "ref_001",
      "status": "activated",
      "fraudScore": 0.12,
      "createdAt": "2026-03-20T18:00:00Z",
      "registeredAt": "2026-03-20T18:15:00Z",
      "activatedAt": "2026-03-21T01:30:00Z"
    },
    "events": [
      {
        "eventType": "registered",
        "createdAt": "2026-03-20T18:15:00Z"
      },
      {
        "eventType": "activated",
        "createdAt": "2026-03-21T01:30:00Z"
      }
    ],
    "rewards": [
      {
        "rewardId": "rw_123",
        "beneficiaryUserId": "usr_referrer",
        "rewardType": "pro_access_trial",
        "rewardStatus": "granted"
      }
    ],
    "audit": {
      "brewTruthStatus": "passed",
      "lastCheckedAt": "2026-03-21T01:31:00Z"
    }
  }
}
```

---

## 7.4 POST /api/admin/referrals/:id/recompute

### Purpose

Force recomputation of referral state, rewards, and audit evaluation.

### Request Body

```json
{
  "reason": "manual_review"
}
```

### Success Response

```json
{
  "ok": true,
  "data": {
    "referralId": "ref_001",
    "recomputed": true,
    "status": "activated"
  }
}
```

---

## 7.5 POST /api/admin/referrals/:id/revoke-reward

### Purpose

Revoke a reward tied to a fraudulent or invalid referral.

### Request Body

```json
{
  "rewardId": "rw_123",
  "reason": "fraud_confirmed"
}
```

### Success Response

```json
{
  "ok": true,
  "data": {
    "rewardId": "rw_123",
    "rewardStatus": "revoked",
    "revokedAt": "2026-03-22T04:00:00Z"
  }
}
```

---

## 7.6 POST /api/admin/referrals/:id/reject

### Purpose

Reject a referral after manual review.

### Request Body

```json
{
  "reason": "self_referral"
}
```

### Success Response

```json
{
  "ok": true,
  "data": {
    "referralId": "ref_001",
    "status": "rejected",
    "rejectedAt": "2026-03-22T04:02:00Z"
  }
}
```

---

## 8. Validation Rules by Domain

## 8.1 Referral code validation

- required
- normalized uppercase
- max length enforced
- must map to active code
- must not belong to blocked or suspended user

## 8.2 Referred user validation

- must be net-new user
- must not already have locked referral attribution
- must not equal referrer
- must not violate duplicate household or abuse rules where enforced

## 8.3 Activation validation

- server checks qualifying event types only
- activation only once per referral
- no duplicate reward grants for same activation milestone

## 8.4 Conversion validation

- must occur inside allowed attribution window
- must be tied to valid paid plan
- must survive payment verification and any hold period rules

---

## 9. Error Contract Standard

All referral endpoints should use a consistent error shape.

### Error Shape

```json
{
  "ok": false,
  "error": {
    "code": "REFERRAL_NOT_FOUND",
    "message": "Referral record not found.",
    "details": null
  }
}
```

### Recommended Error Codes

- `UNAUTHORIZED`
- `FORBIDDEN`
- `REFERRAL_CODE_INVALID`
- `REFERRAL_NOT_FOUND`
- `REFERRAL_ALREADY_ATTRIBUTED`
- `SELF_REFERRAL_BLOCKED`
- `ACTIVATION_THRESHOLD_NOT_MET`
- `REWARD_NOT_CLAIMABLE`
- `REWARD_ALREADY_GRANTED`
- `REFERRAL_REVIEW_REQUIRED`
- `REFERRAL_REJECTED`
- `INVALID_REQUEST`
- `RATE_LIMITED`
- `INTERNAL_ERROR`

---

## 10. Frontend Consumption Notes

Frontend should treat the following as UI-ready fields whenever possible:

- `headline`
- `subtext`
- `reward label`
- `progressPercent`
- `remainingToNext`
- `status`
- `expiresAt`

### Frontend should not compute:

- final reward eligibility
- activation validity
- fraud decisions
- referral state transitions

---

## 11. Auth and Security Rules

### Public capture route

Anonymous allowed.
Must be rate limited.

### User routes

Authenticated only.
User may only access their own referral dashboard/history.

### Internal routes

Protected by service auth, server-only invocation, or internal secret.
Never exposed to browser clients directly.

### Admin routes

Require admin role and audit logging.

---

## 12. Rate Limiting Guidance

Apply rate limits to:

- `POST /api/referrals/capture`
- `GET /api/referrals/share`
- all admin mutation routes

Recommended goals:

- prevent code brute forcing
- reduce abuse scanning
- limit spammy share endpoint access

---

## 13. Idempotency Rules

### Activation evaluation

Must be idempotent.
Repeated evaluation for the same qualifying event must not double-grant rewards.

### Conversion evaluation

Must be idempotent.
Repeated billing webhook events must not double-grant conversion rewards.

### Reward grant route

Should support idempotency keys or dedupe by referral + beneficiary + reward type + milestone.

---

## 14. Status Transition Rules

Allowed transitions:

- `pending -> registered`
- `registered -> activated`
- `activated -> converted`
- `registered -> rejected`
- `activated -> rejected`
- `registered -> expired`
- `pending -> expired`
- `registered -> review_required`
- `activated -> review_required`
- `review_required -> activated`
- `review_required -> rejected`

Disallowed examples:

- `converted -> registered`
- `rejected -> activated` without explicit admin recompute and audit

---

## 15. Event Emission Rules

Routes that change state should emit referral events.

### Required events

- `referral_captured`
- `referral_registered`
- `referral_activated`
- `referral_converted`
- `reward_granted`
- `reward_revoked`
- `referral_rejected`
- `referral_review_required`
- `referral_recomputed`

These should feed:

- notifications
- admin history
- BrewTruth audit logs
- analytics pipeline

---

## 16. Analytics Payload Guidance

For analytics consistency, each route should optionally produce structured event payloads containing:

- referral id
- referrer user id
- referred user id
- status before / after
- reward ids affected
- campaign key
- source channel
- timestamp

Do not expose sensitive fraud logic to client analytics payloads.

---

## 17. Suggested Type Shapes

These are logical response entities for backend/frontend alignment.

### ReferralSummary

```ts
interface ReferralSummary {
  referralId: string;
  status: 'pending' | 'registered' | 'activated' | 'converted' | 'rejected' | 'expired' | 'review_required';
  createdAt: string;
  registeredAt?: string | null;
  activatedAt?: string | null;
  convertedAt?: string | null;
}
```

### RewardSummary

```ts
interface RewardSummary {
  rewardId: string;
  rewardType: string;
  label: string;
  status: 'pending' | 'granted' | 'active' | 'expired' | 'revoked' | 'claimed';
  expiresAt?: string | null;
}
```

### ReferralDashboardPayload

```ts
interface ReferralDashboardPayload {
  referralCode: string;
  shareLink: string;
  stats: {
    pending: number;
    registered: number;
    activated: number;
    converted: number;
    rejected: number;
  };
  progress: {
    currentMilestone: number;
    nextMilestone: number;
    remainingToNext: number;
    progressPercent: number;
  };
  activeRewards: RewardSummary[];
  recentReferrals: ReferralSummary[];
}
```

---

## 18. Testing Expectations from API Layer

The API implementation should support tests for:

- referral capture with valid code
- capture rejection with invalid code
- authenticated dashboard payload retrieval
- activation evaluation with valid event
- duplicate activation no-op behavior
- conversion reward idempotency
- admin revoke reward path
- admin reject referral path
- unauthorized access rejection

---

## 19. Recommended Build Order

### Phase 1

- `POST /api/referrals/capture`
- `GET /api/referrals/me`
- `GET /api/referrals/share`

### Phase 2

- `POST /api/internal/referrals/evaluate-activation`
- reward grant internal service
- notification hooks

### Phase 3

- `GET /api/referrals/history`
- admin overview/list/detail routes

### Phase 4

- conversion evaluation routes
- reward revoke/recompute admin actions
- optional claim route if needed

---

## 20. Final Contract Recommendations

For launch-quality referral implementation, BrewLotto should:

- keep user routes clean and minimal
- centralize trust logic in internal services
- make activation and conversion evaluation idempotent
- keep reward grants server-owned
- expose UI-friendly referral summaries to frontend
- separate admin mutation routes from public product routes

This keeps the API:

- predictable
- safe
- auditable
- frontend-friendly
- extensible for V1.5 and later campaign growth

---

## 21. Immediate Follow-On Docs

Best next companion docs after this one:

1. BREWLOTTO_V1_REFERRAL_DB_ADDENDUM.md
2. BREWLOTTO_V1_REFERRAL_FRAUD_AND_REVIEW_RULES.md
3. BREWLOTTO_V1_REFERRAL_ANALYTICS_DASHBOARD_SPEC.md

---

## 22. BrewDocs Summary

What this doc does:
Defines the exact API contract surface for BrewLotto’s referral system, covering public routes, internal evaluation routes, admin routes, validation rules, response shapes, and error models.

What it prevents:
Frontend/backend drift, unsafe client-owned eligibility logic, double reward grants, unclear status mutations, and admin workflow ambiguity.

What it enables:
A clean implementation path for referral capture, dashboard rendering, activation evaluation, conversion rewards, admin oversight, and future growth experimentation.

