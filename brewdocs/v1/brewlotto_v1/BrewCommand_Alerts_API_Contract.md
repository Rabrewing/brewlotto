# BrewCommand Alerts API Contract

**Project:** BrewLotto AI
**Phase:** V1 Phase 7
**Timestamp:** 2026-03-19 ET
**Purpose:** Define internal API routes for BrewCommand operational alerts, alert lifecycle, and critical email delivery visibility.

## 1. Scope

This API is **internal-only** and supports:

- BrewCommand Alert Center
- alert list/detail/history
- acknowledge/resolve flows
- critical email delivery tracking
- alert summary widgets for admin health views

This is **not** a public user-facing API.

## 2. Core Alert Sources

These routes must support alerts from:

- ingestion failures
- stale draw windows
- parser validation mismatches
- prediction job failures
- Stripe webhook failures
- notification delivery failures
- provider degradation / fallback activation
- unusual abuse/fraud patterns

## 3. Auth / Access

All routes require:

- authenticated admin session
- internal role check

Suggested roles:

- `admin`
- `analyst`
- `support`

Read-only routes can be available to analyst/support.
Mutating routes like acknowledge/resolve should be limited to admin/support.

## 4. Shared Response Envelope

### Success

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {}
}
```

### Error

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "FORBIDDEN",
    "message": "Admin access required."
  },
  "meta": {}
}
```

---

## 5. Route List

```txt
GET    /api/admin/alerts
GET    /api/admin/alerts/summary
GET    /api/admin/alerts/:id
GET    /api/admin/alerts/:id/events
GET    /api/admin/alerts/:id/deliveries
POST   /api/admin/alerts/:id/acknowledge
POST   /api/admin/alerts/:id/resolve
POST   /api/admin/alerts/:id/reopen
POST   /api/admin/alerts/:id/suppress
POST   /api/admin/alerts/test-email
POST   /api/internal/alerts/raise
```

---

## 6. Route Contracts

### 6.1 GET `/api/admin/alerts`

**Purpose:** List BrewCommand alerts for the Alert Center.

**Query params:**

```
?status=open
?severity=critical
?category=ingestion
?sourceModule=caDaily3History
?page=1
?limit=25
?sort=last_seen_at_desc
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "alertKey": "uuid-or-string",
      "sourceModule": "caDaily3History",
      "category": "ingestion",
      "severity": "critical",
      "status": "open",
      "state": "CA",
      "game": "daily3",
      "title": "California Daily 3 ingestion failed",
      "message": "Adapter failed to parse 3 required rows from source page.",
      "occurrenceCount": 4,
      "firstSeenAt": "2026-03-19T10:00:00Z",
      "lastSeenAt": "2026-03-19T10:35:00Z",
      "emailRequired": true,
      "emailLastSentAt": "2026-03-19T10:02:00Z"
    }
  ],
  "error": null,
  "meta": {
    "page": 1,
    "limit": 25,
    "total": 8
  }
}
```

### 6.2 GET `/api/admin/alerts/summary`

**Purpose:** Return summary counts and top-line alert metrics for BrewCommand dashboard widgets.

**Response:**

```json
{
  "success": true,
  "data": {
    "openCount": 6,
    "criticalOpenCount": 2,
    "warningOpenCount": 3,
    "acknowledgedCount": 4,
    "resolvedTodayCount": 7,
    "byCategory": {
      "ingestion": 3,
      "prediction": 1,
      "billing": 1,
      "provider": 1
    },
    "latestCritical": {
      "id": "uuid",
      "title": "Stripe webhook processing failure",
      "lastSeenAt": "2026-03-19T11:15:00Z"
    }
  },
  "error": null,
  "meta": {}
}
```

### 6.3 GET `/api/admin/alerts/:id`

**Purpose:** Return full alert detail.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "alertKey": "alert-ca-daily3-parse-failure",
    "sourceModule": "caDaily3History",
    "category": "validation",
    "severity": "critical",
    "status": "open",
    "state": "CA",
    "game": "daily3",
    "title": "California Daily 3 parse mismatch",
    "message": "Normalized row count differs from expected parser count.",
    "fingerprint": "ca_daily3|2026-03-19|validation_mismatch",
    "occurrenceCount": 3,
    "firstSeenAt": "2026-03-19T08:10:00Z",
    "lastSeenAt": "2026-03-19T10:10:00Z",
    "acknowledgedAt": null,
    "acknowledgedBy": null,
    "resolvedAt": null,
    "resolvedBy": null,
    "emailRequired": true,
    "emailLastSentAt": "2026-03-19T08:11:00Z",
    "metadata": {
      "expectedRows": 10,
      "actualRows": 7
    },
    "rawPayload": {
      "sourceUrl": "redacted-or-stored-pointer"
    }
  },
  "error": null,
  "meta": {}
}
```

### 6.4 GET `/api/admin/alerts/:id/events`

**Purpose:** Return lifecycle history for one alert.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "eventType": "created",
      "severity": "critical",
      "message": "Alert created from parser failure.",
      "createdBy": null,
      "createdAt": "2026-03-19T08:10:00Z"
    },
    {
      "id": "uuid2",
      "eventType": "occurred_again",
      "severity": "critical",
      "message": "Alert repeated during retry cycle.",
      "createdBy": null,
      "createdAt": "2026-03-19T08:30:00Z"
    }
  ],
  "error": null,
  "meta": {}
}
```

### 6.5 GET `/api/admin/alerts/:id/deliveries`

**Purpose:** Return critical email delivery attempts for an alert.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "channel": "email",
      "destination": "ops@brewlotto.ai",
      "deliveryStatus": "sent",
      "provider": "resend",
      "providerMessageId": "msg_123",
      "errorMessage": null,
      "attemptedAt": "2026-03-19T08:11:00Z"
    }
  ],
  "error": null,
  "meta": {}
}
```

### 6.6 POST `/api/admin/alerts/:id/acknowledge`

**Purpose:** Acknowledge an alert.

**Request:**

```json
{
  "note": "Investigating parser source change."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "acknowledged",
    "acknowledgedAt": "2026-03-19T11:25:00Z",
    "acknowledgedBy": "admin-user-uuid"
  },
  "error": null,
  "meta": {}
}
```

**Behavior:**

- updates `alert_events.status`
- writes `alert_events` row
- optional note can be stored in event metadata

### 6.7 POST `/api/admin/alerts/:id/resolve`

**Purpose:** Resolve an alert.

**Request:**

```json
{
  "note": "Source parser updated and validation passed on retry."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "resolved",
    "resolvedAt": "2026-03-19T11:40:00Z",
    "resolvedBy": "admin-user-uuid"
  },
  "error": null,
  "meta": {}
}
```

### 6.8 POST `/api/admin/alerts/:id/reopen`

**Purpose:** Reopen a previously resolved or suppressed alert.

**Request:**

```json
{
  "note": "Issue reoccurred after temporary fix."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "open"
  },
  "error": null,
  "meta": {}
}
```

### 6.9 POST `/api/admin/alerts/:id/suppress`

**Purpose:** Temporarily suppress noisy alerts during controlled maintenance or known incidents.

**Request:**

```json
{
  "suppressUntil": "2026-03-19T18:00:00Z",
  "note": "Known issue during source migration."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "suppressed",
    "suppressedUntil": "2026-03-19T18:00:00Z"
  },
  "error": null,
  "meta": {}
}
```

**Guardrail:** Suppression should be limited to admins.

### 6.10 POST `/api/admin/alerts/test-email`

**Purpose:** Send a test critical email to verify operator mail delivery.

**Request:**

```json
{
  "destination": "ops@brewlotto.ai"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "deliveryStatus": "sent",
    "destination": "ops@brewlotto.ai"
  },
  "error": null,
  "meta": {}
}
```

### 6.11 POST `/api/internal/alerts/raise`

**Purpose:** Internal service endpoint for ingestion jobs, prediction jobs, webhook handlers, and provider monitors to raise/update an alert.

**Access:** Service role / internal secret only.

**Request:**

```json
{
  "sourceModule": "ncPowerballOfficial",
  "category": "ingestion",
  "severity": "critical",
  "title": "NC Powerball ingestion failed",
  "message": "CSV fetch returned 500 from source.",
  "fingerprint": "nc_powerball|2026-03-19|fetch_500",
  "state": "NC",
  "game": "powerball",
  "emailRequired": true,
  "metadata": {
    "httpStatus": 500
  },
  "rawPayload": {
    "url": "https://..."
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "alertId": "uuid",
    "status": "open",
    "createdOrUpdated": "updated"
  },
  "error": null,
  "meta": {}
}
```

---

## 7. Email Delivery Rules

### V1 Required Email Triggers

Send email when:

- severity = `critical`
- `email_required = true`
- alert is newly created or crosses retry threshold
- alert is not currently suppressed

### V1 Deduping

Do not send email every single occurrence.
Recommended:

- send on first critical creation
- resend only after threshold or time interval
- update `email_last_sent_at`

### V1 Email Template Fields

- severity
- category
- title
- message
- source module
- state/game if present
- first seen / last seen
- occurrence count
- direct BrewCommand link to alert detail

---

## 8. Suggested Next.js Route File Order

Use this exact order when Phase 7 begins:

```txt
app/api/admin/alerts/summary/route.ts
app/api/admin/alerts/route.ts
app/api/admin/alerts/[id]/route.ts
app/api/admin/alerts/[id]/events/route.ts
app/api/admin/alerts/[id]/deliveries/route.ts
app/api/admin/alerts/[id]/acknowledge/route.ts
app/api/admin/alerts/[id]/resolve/route.ts
app/api/admin/alerts/[id]/reopen/route.ts
app/api/admin/alerts/[id]/suppress/route.ts
app/api/admin/alerts/test-email/route.ts
app/api/internal/alerts/raise/route.ts
```

### Build order

1. summary
2. list
3. detail
4. acknowledge / resolve
5. events / deliveries
6. test-email
7. internal raise endpoint

---

## 9. BrewCommand UI Mapping

### Alert Center page

Uses:

- `GET /api/admin/alerts`
- `GET /api/admin/alerts/summary`

### Alert detail drawer/page

Uses:

- `GET /api/admin/alerts/:id`
- `GET /api/admin/alerts/:id/events`
- `GET /api/admin/alerts/:id/deliveries`

### Alert actions

Uses:

- `POST /api/admin/alerts/:id/acknowledge`
- `POST /api/admin/alerts/:id/resolve`
- `POST /api/admin/alerts/:id/reopen`
- `POST /api/admin/alerts/:id/suppress`

### Email verification utility

Uses:

- `POST /api/admin/alerts/test-email`

### Internal job integration

Uses:

- `POST /api/internal/alerts/raise`

---

## 10. Database Tables

Alert system uses these tables:

- `system_alerts` - Alert configuration and thresholds
- `alert_events` - Individual alert occurrences
- `alert_deliveries` - Notification delivery tracking

See migration: `supabase/migrations/20251111073621_alert_system.sql`
