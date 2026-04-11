# REWLOTTO\_V1\_Product\_Overview

\<\!--  
/brewexec/brewdocs/BREWLOTTO\_V1\_Product\_Overview.md  
Timestamp: 2026-03-16 ET  
Phase: V1 Reset / Product Foundation  
Purpose: Canonical BrewDocs product overview for rebuilding BrewLotto into a stable, launch-ready V1.  
\--\>BrewLotto AI — Product Overview (V1 Reset)

1\. Document Purpose

This document resets BrewLotto AI from prior concept-heavy planning into a cleaner, more stable, launch-oriented product foundation.

It establishes:

what BrewLotto V1 is

who it serves

what we are building first

what we are not building yet

which ideas stay, which ideas get cut, and which ideas need to be redesigned

the product rules that all future architecture, API, database, QA, and UI specs must follow

This is the first canon document in the new BrewLotto V1 SDLC stack.

\---

2\. Product Definition

BrewLotto AI is a lottery intelligence and player education platform focused on helping users make more informed plays through:

historical draw analysis

explainable strategy overlays

number pattern tracking

pick logging and outcome tracking

responsible, transparent lottery guidance

V1 Positioning

BrewLotto is not a “guaranteed winning” engine. It is a lottery intelligence platform that aims to improve player decision quality, provide deeper insight into draw behavior, and create a premium game-day experience.

Core Promise

Make every play smarter, more explainable, and more trackable.

\---

3\. Product Mission

Mission

Help lottery players play with more structure, more transparency, and better awareness of odds, trends, and strategy behavior.

Vision

Build the most trusted lottery intelligence application in the market by combining:

strong data pipelines

explainable AI

elegant game UX

gamified learning

honest disclaimers and responsible positioning

V1 Success Principle

V1 succeeds if users say:

“I understand why this pick was suggested.”

“I can track what I played and how I’m doing.”

“The app feels premium, fast, and trustworthy.”

“I want to come back before each draw.”

\---

4\. Product Goals for V1

Primary Goals

1\. Launch a stable, premium-feeling NC \+ CA lottery app.

2\. Replace mock logic with reliable live historical and current draw ingestion.

3\. Make predictions explainable, not magical.

4\. Introduce paid tiers without overbuilding the billing system.

5\. Create a foundation that can expand to additional states without re-architecting core systems.

6\. Prepare the app for mobile distribution and future Google Play readiness.

Secondary Goals

1\. Introduce BrewBot-style coaching in a controlled, cost-effective way.

2\. Add gamification that rewards learning and consistency, not gambling hype.

3\. Build an extensible ML layer without making V1 dependent on costly model inference.

4\. Leave clean API stubs for BrewUniversity integration later.

\---

5\. Product Principles

5.1 Truth Over Hype

No claims of guaranteed wins. No misleading language. No “rigged the odds” or “beat the system” positioning.

5.2 Explainability First

Every premium pick path should eventually support:

strategy used

why the strategy selected the numbers

what supporting signals were found

confidence/risk framing

5.3 Stable Before Clever

If a feature introduces instability, expensive complexity, or unclear user value, it does not belong in V1.

5.4 Education Is a Core Product Feature

BrewLotto should teach users how to interpret odds, patterns, and strategy behavior. The app must not only generate picks; it must improve player literacy.

5.5 Cost Discipline

All AI and ML features must be designed with a low-cost default path. Inference-heavy systems must be gated, cached, or delayed until their business value is proven.

5.6 Premium Feel, Lean Core

The UI should feel world-class, but the backend should remain modular and practical.

5.7 Freshness Is A Product Guarantee

Current draw data is part of product trust, not just infrastructure hygiene.

BrewLotto must ingest around actual draw windows, retry when official results lag, and prevent stale or unverified data from being presented as current live insight.

User-facing prediction and stats surfaces must be gated by the freshness layer whenever source health is delayed, stale, failed, or unknown.

\---

6\. Product Scope

6.1 In Scope for V1

NC and CA game support

historical draw ingestion

live/latest draw fetch

hot/cold and momentum analysis

overdue/gap analysis

sum/spread analysis

explainable pick generation

user accounts

subscription billing

saved picks

outcome logging

win/loss tracking

badges and lightweight gamification

notifications for draw events and tracked number events

BrewBot Lite commentary

admin visibility for ingestion health and model health

6.2 Out of Scope for Initial V1 Launch

full autonomous multi-agent strategy orchestration in production

expensive always-on LLM reasoning for every pick

overly complex social/syndicate mechanics

full enterprise BrewUniversity implementation

broad multi-state rollout beyond NC \+ CA at launch

overbuilt internal dev cockpit unless directly supporting stability/ops

native mobile exclusivity as a launch requirement

6.3 Deferred to Post-V1

broader state expansion

advanced syndicate/group features

richer AI voice persona layers

deeper predictive model experimentation

enterprise learning hub integration

advanced export/report builder

Play Store packaging after the web and PWA surfaces are operationally stable

---

6.4 Launch Surface Model

BrewLotto V1 launches as a web-first product.

That launch model supports:

1. primary website access
2. mobile-responsive browser usage
3. installable PWA capability when enabled safely
4. future Android store packaging without splitting the product into a separate frontend

The canonical launch infrastructure plan lives in `brewdocs/v1/launch-infrastructure-plan.md`.

\---

7\. What We Keep / What We Cut / What We Redesign

7.1 Keep

These concepts are strong and should remain:

BrewLotto branding and premium feel

game-specific tabs and modular configs

hot/cold, momentum, and strategy-based prediction engine

BrewBot guidance layer

draw health monitoring

Supabase-centered data architecture

tier-gated strategy access

dashboard-driven user stats and play tracking

educational positioning

gamification tied to learning and consistency

7.2 Cut or Avoid in V1

These are not wrong, but they hurt launch stability if included too early:

overcomplicated internal module sprawl

unnecessary overlap between BrewCommand, BrewVision, BrewPulse, BrewSentinel for launch scope

high-cost multi-model orchestration on every prediction request

overly branded but underdefined strategy names without operational meaning

too many premium tiers too early

broad voice features before prediction and billing are stable

7.3 Redesign / Enhance

These are good ideas that need better structure:

BrewCommand should be reduced to an internal admin/ops console, not a major dependency for public V1

HRM / Hierarchical Reasoning Model should be used as an orchestration pattern, not a marketing gimmick

multi-tier AI agents should be limited to server-side strategy ranking and commentary generation, not exposed as fragile runtime complexity

BrewUniversity should begin as content hooks, badges, and lesson stubs, not a full subsystem

notifications should start with operationally simple triggers: draw posted, watched numbers hit, tier reminders, streaks

\---

8\. Users

Primary User Segments

1\. Casual Explorer

plays occasionally

wants quick insight

values simplicity

may stay on free tier

2\. Daily Strategist

plays often

wants better tracking

wants advanced analysis and reasons behind picks

strongest candidate for paid conversion

3\. Power User / Data Player

wants premium strategy options

wants logs, history, alerts, and richer overlays

likely candidate for upper tier

Secondary User Segments

lottery hobbyists

analytics-minded gamers

users who enjoy badges, streaks, and educational progression

\---

9\. Game Scope for Launch

States at Launch

North Carolina

California

Launch Game Model

V1 should structure games as configurable records instead of hardcoded page logic.

Each game config must define:

state

game key

display label

draw schedule

number range

number count

bonus ball support

play type variants

odds metadata

payout metadata

scraper source

parser rules

validation rules

Why This Matters

This is the foundation for future state rollout. Once NC \+ CA are stable, new states become a config and ingestion expansion problem rather than a full app rewrite.

\---

10\. Payments Recommendation

Recommendation: Stripe first, Square later if needed

Why Stripe wins for V1

better support for SaaS subscriptions

smoother recurring billing patterns

cleaner developer tooling for tier gating and webhooks

easier handling of trials, upgrades, downgrades, billing portal, and failed payments

more natural fit for app/web subscription products

When Square makes sense

Square is better if BrewLotto later grows into in-person retail tie-ins, event sales, merchandise, or broader BrewVerse commerce.

Decision

V1 should use Stripe as the billing system of record. Square can remain a future optional commerce path for other BrewVerse products.

\---

11\. Pricing Model Recommendation (V1)

Keep pricing simple for launch. Do not over-segment.

Tier 1 — Free / Player

Target: casual users

Includes:

limited daily picks

Pick 3 / Pick 4 access

basic hot/cold and momentum insights

basic draw history

limited BrewBot Lite commentary

basic badges

Tier 2 — Pro / Strategist

Recommended range: low-to-mid single digit monthly price

Includes:

unlimited daily picks within fair-use guardrails

Pick 3 / Pick 4 / Pick 5 / Cash-style games

richer explanations

saved picks and play logging

personal stats dashboard

alerts and streaks

advanced visual insights

BrewBot explainers

Tier 3 — Elite / Power Player

Recommended range: premium monthly price

Includes:

all games including jackpot games

advanced strategy stack

AI commentary upgrades

anomaly/risk overlays

richer exports and deeper logs

premium badge path

early access features

Tier 4 — Founder / VIP (Optional, not required at launch)

Only introduce if there is a clear premium user segment. Otherwise, defer.

Potential includes:

concierge analytics

beta access

voice commentary

higher limits

private roadmap previews

V1 Guidance

Launch with 3 real tiers. Treat Tier 4 as optional post-launch validation.

\---

12\. AI / ML Strategy for V1

12.1 Default Strategy

Use algorithmic/statistical prediction first.

Core strategies should include:

frequency / hot-cold

momentum

overdue / gap

positional analysis

sum/spread analysis

mirror and pair logic where useful

ensemble ranker

12.2 HRM (Hierarchical Reasoning Model) Use

HRM is valuable if it is implemented as an internal reasoning stack:

Layer 1 — Deterministic Data Layer

cleans and validates draw history

computes frequencies, trends, gaps, sums, parity, positions

Layer 2 — Strategy Layer

runs candidate strategies

scores strategy outputs by current conditions

produces ranked candidate picks

Layer 3 — Reasoning Layer

generates explanation text

summarizes why a strategy or combination was selected

converts technical logic into user-readable commentary

Layer 4 — Governance Layer

BrewTruth review

compliance checks

price/tier gating

rate limits

anomaly flags

This is the right use of hierarchical reasoning for BrewLotto. Not constant chain-of-thought style inference.

12.3 Multi-Agent Guidance

A lightweight multi-agent design is useful if each agent has a clear role.

Suggested agents:

Ingest Agent — fetches and validates official draw data

Strategy Agent — computes strategy candidates

Rank Agent — scores and blends outputs

Commentary Agent — writes explanation text

BrewTruth Agent — checks compliance, pricing, and output integrity

Important Rule

These agents should mostly be logical services/modules, not expensive always-on LLMs.

12.4 Machine Learning in V1

ML belongs in V1, but as a controlled subsystem.

Use ML for:

strategy scoring experiments

trend weighting

model calibration

user behavior personalization

anomaly detection

Do not make V1 dependent on deep model inference for every request.

\---

13\. BrewTruth Role

BrewTruth should become the trust and governance layer for BrewLotto.

BrewTruth Responsibilities

validate source freshness

confirm draw completeness

flag missing or inconsistent state/game records

rate strategy confidence and evidence depth

prevent unsupported claims in commentary

log why a pick was generated

support auditability for future QA and compliance

V1 Rule

No premium pick should ship without:

source timestamp

strategy source attribution

audit-friendly metadata

\---

14\. Gamification and Education

14.1 Gamification

Gamification should reward:

consistency

play logging

learning completion

badge milestones

healthy engagement

Examples:

first pick logged

first insight reviewed

7-day streak

strategy learner badge

hot number tracker badge

responsible bankroll badge

14.2 Education

BrewUniversity integration in V1 should be lightweight.

Include:

strategy glossary

odds explainers

“Why this pick?” content

micro-lessons

badge unlocks

API stubs for future BrewUniversity sync

Do not build the full enterprise learning platform into V1.

\---

15\. Notifications

V1 notifications should be practical and high-value.

Launch Notifications

draw results posted

watched number hit

hot number entering threshold

saved pick reminder before draw

streak/badge earned

subscription or usage reminders

Defer for Later

hyper-personalized agentic nudges every few minutes

expensive AI-generated alert spam

\---

16\. Product Architecture Overview

BrewLotto V1 should be organized into clean domains:

16.1 Presentation Layer

Next.js app router UI

responsive dashboard

game tabs and cards

onboarding / pricing / profile / notifications / logs

16.2 Application Layer

prediction APIs

stats APIs

billing webhooks

notification services

user progression services

16.3 Intelligence Layer

strategy engine

ranker/ensemble

commentary service

BrewTruth audit service

ML scoring service

16.4 Data Layer

Supabase/Postgres

draw tables

user profile tables

predictions and play logs

subscription entitlements

badges and progress

audit/event logs

16.5 Operations Layer

ingestion scheduler

parser validators

health monitoring

admin dashboard

release QA

\---

17\. Database Direction

V1 database design must support:

multi-state draws

per-game configuration

user tiers

play history

prediction history

explanation history

badge progress

notifications

ingestion and audit logs

Core table groups

auth/users

profiles/subscriptions

states

lottery\_games

game\_draws

draw\_sources

predictions

prediction\_explanations

play\_logs

watchlists

notifications

badges

badge\_events

ingestion\_runs

ingestion\_failures

audit\_events

model\_runs

feature\_flags

A dedicated DB spec will follow from this document.

\---

18\. Stable V1 Definition

BrewLotto V1 is considered stable when:

live NC and CA draws ingest correctly on schedule

game pages show live data instead of mocks

predictions are generated with reproducible logic

users can subscribe and unlock tiers reliably

pick logging and outcome tracking work end to end

alerts work for core launch scenarios

explanation text is present and compliant

the dashboard reflects real stats

QA coverage is in place for ingestion, prediction, auth, and billing

admin health screens expose failures before users do

\---

19\. Product Risks

Highest Risk Areas

unreliable draw ingestion

overpromising AI value

overbuilding before launch stability

unclear tier boundaries

weak compliance language

expensive inference costs

poor explanation quality

brittle state/game-specific code

Product Response

Every later spec must reduce one or more of these risks.

\---

20\. Final Product Direction

The winning version of BrewLotto V1 is:

beautiful

fast

explainable

data-grounded

premium but disciplined

educational

subscription-ready

architected for expansion

The wrong version of BrewLotto V1 is:

overcomplicated

expensive to run

unstable

hard to explain

too magical in its claims

too scattered across internal modules

\---

21\. Immediate Follow-On Specs

The next BrewDocs to create from this product overview are:

1\. BREWLOTTO\_V1\_SYSTEM\_ARCHITECTURE.md

2\. BREWLOTTO\_V1\_DATABASE\_SCHEMA.md

3\. BREWLOTTO\_V1\_DATA\_INGESTION\_SPEC.md

4\. BREWLOTTO\_V1\_PREDICTION\_ENGINE\_SPEC.md

5\. BREWLOTTO\_V1\_PRICING\_AND\_BILLING\_SPEC.md

6\. BREWLOTTO\_V1\_TESTING\_AND\_SUCCESS\_OUTCOMES.md

7\. BREWLOTTO\_V1\_STATE\_ROLLOUT\_PLAN.md

8\. BREWLOTTO\_V1\_UI\_UX\_ARCHITECTURE.md

9\. BREWLOTTO\_V1\_ADMIN\_AND\_BREWCOMMAND\_SCOPE.md

10\. BREWLOTTO\_V1\_COMPLIANCE\_AND\_TRUST\_SPEC.md

\---

22\. BrewDocs Summary

What this doc does: Defines the product clearly enough that all later technical specs can align to one stable V1 direction.

What it prevents: Feature drift, overbuilding, fuzzy architecture, and hype-driven planning.

What it enables: A real SDLC path from concept to stable public application.

# System Architecture

\<\!--  
/brewexec/brewdocs/BREWLOTTO\_V1\_SYSTEM\_ARCHITECTURE.md  
Timestamp: 2026-03-16 ET  
Phase: V1 Reset / System Architecture  
Purpose: End-to-end technical architecture for BrewLotto V1 aligned to the new UI direction, stable launch requirements, and BrewTruth governance.  
\--\>BrewLotto AI — V1 System Architecture

1\. Document Purpose

This document converts the BrewLotto V1 Product Overview into a working system architecture.

It defines:

the major product surfaces

the core runtime layers

how data flows from official lottery sources into the app

how prediction, commentary, billing, notifications, and gamification connect

where BrewTruth sits in the execution chain

what BrewCommand should be for V1

which services are required for a stable launch

This is the canonical architecture blueprint for the BrewLotto V1 rebuild.

\---

2\. Architecture Goals

The architecture must support the following launch goals:

reliable NC \+ CA draw ingestion

fast responsive app UI based on the new kiosk-style design direction

low-cost but extensible intelligence services

tier-gated features and billing

proper end-to-end testing and observability

future state expansion without a rewrite

lightweight BrewUniversity hooks for education and badges

auditability through BrewTruth

Architecture Rule

Stable, modular, observable, and explainable beats clever but brittle.

\---

3\. High-Level Architecture View

BrewLotto V1 should be organized into 7 major layers:

1\. Experience Layer

2\. Application/API Layer

3\. Prediction & Intelligence Layer

4\. Data Ingestion Layer

5\. Persistence Layer

6\. Operations & Governance Layer

7\. Future Expansion Layer

\---

4\. Experience Layer

The Experience Layer is what the user sees and interacts with.

Core surfaces

marketing / landing pages

auth / onboarding

pricing / billing

main game dashboard

prediction generation flow

my picks / play history

stats \+ streaks \+ badges

notifications center

profile \+ preferences

BrewUniversity Lite lessons

admin / BrewCommand Lite

Frontend framework

Next.js App Router

TypeScript

Tailwind-based design system

modular component architecture

mobile-first responsive layouts

UI direction

The new pasted interface should be treated as the core dashboard shell for draw insights and pick generation.

Key UI modules from the new design

header / identity strip

game tabs

hot number card

cold number card

momentum meter

prediction explanation card

CTA buttons

voice mode toggle area

Frontend architecture rule

The UI must remain config-driven by game definitions rather than branching into separate hardcoded page logic per game or per state.

\---

5\. Application/API Layer

This layer powers the frontend and coordinates data, auth, predictions, and billing.

Primary API domains

1\. Auth \+ User Profile APIs

2\. Game Metadata APIs

3\. Draw Data APIs

4\. Prediction APIs

5\. Play Logging APIs

6\. Gamification APIs

7\. Notifications APIs

8\. Billing / Subscription APIs

9\. Admin / Ops APIs

10\. Education Content APIs

Example route structure

/api/auth/\*

/api/games/\*

/api/draws/\*

/api/predict/\*

/api/picks/\*

/api/stats/\*

/api/badges/\*

/api/notifications/\*

/api/billing/\*

/api/admin/\*

/api/brewu/\*

API style guidance

route handlers for standard web app requests

job/scheduler paths for ingestion execution

internal service modules for shared logic

strong validation on all request payloads

\---

6\. Prediction & Intelligence Layer

This is the heart of the product logic.

The goal is to generate explainable candidate picks based on statistical and rule-based methods first, with ML and AI layered in carefully.

6.1 Prediction Pipeline Overview

The prediction chain should run in this order:

1\. draw data fetch from persistence layer

2\. feature extraction

3\. strategy execution

4\. strategy scoring

5\. ensemble ranking

6\. BrewTruth validation

7\. explanation generation

8\. entitlement/tier enforcement

9\. response payload returned to UI

\---

6.2 HRM Structure (Hierarchical Reasoning Model)

Layer 1 — Data Intelligence Layer

Responsibilities:

validate draw history completeness

compute frequencies

compute hot/cold scores

compute overdue gaps

compute sums / spreads / parity

compute positional and mirror statistics

compute state/game-specific derived features

Layer 2 — Strategy Layer

Responsibilities:

run deterministic strategies

produce candidate number sets

attach feature evidence

attach strategy metadata

Possible strategy modules:

hot/cold strategy

overdue strategy

positional trend strategy

sum-range strategy

low/high balance strategy

odd/even strategy

mirror strategy

combo-filter strategy

jackpot game candidate shaper

Layer 3 — Rank & Commentary Layer

Responsibilities:

compare candidate outputs

compute blended ranking scores

select top results

transform technical evidence into readable explanation text

assign risk/confidence framing

Layer 4 — BrewTruth Governance Layer

Responsibilities:

check source freshness

check inference completeness

verify entitlement access

enforce wording rules

attach audit metadata

reject unsupported outputs

Architecture note

HRM should be implemented as logical service separation, not as always-on LLM recursion.

\---

6.3 Multi-Agent Design

BrewLotto can benefit from multi-agent design if kept lightweight and modular.

Recommended internal agents/services

A. Ingest Agent

fetch official source data

normalize records

compare against previous results

alert on anomalies

B. Strategy Agent

execute all eligible strategies

produce candidate sets

C. Rank Agent

score candidates

combine weighted outputs

prepare top results

D. Commentary Agent

convert structured evidence into user-facing explanation text

produce short/medium/extended commentary variants by tier

E. BrewTruth Agent

validate source and output integrity

log evidence bundle

reject invalid or misleading responses

Cost-control rule

Only the Commentary Agent may call external LLMs, and even then:

cache aggressively

keep tokens small

restrict by tier

default to template-driven explanation where possible

\---

6.4 Model Strategy

Default V1 approach

Use low-cost deterministic/statistical logic as the primary engine.

Optional model tiers

Tier A — No model required

hot/cold

overdue

momentum

parity/sum/spread logic

positional filtering

Tier B — Lightweight ML scoring

score candidate viability

rank strategies under current game conditions

anomaly detection

Tier C — LLM-assisted commentary

user-facing explanation text

strategy tutoring

badge/lesson contextualization

Recommendation

For V1, the product should not depend on expensive foundation models to generate picks. The model layer should enrich, explain, and rank — not replace the base engine.

\---

7\. Data Ingestion Layer

This layer is responsible for bringing official lottery data into BrewLotto.

V1 source focus

North Carolina official draw sources

California official draw sources

Ingestion requirements

scheduler-based fetches

parser normalization per state/game

dedupe and idempotency

late-posting tolerance

retry logic

anomaly detection

freshness status reporting

Ingestion execution pattern

1\. scheduler triggers job

2\. source fetch module downloads latest data

3\. parser converts source into normalized draw payload

4\. validation checks structure and values

5\. dedupe check compares against stored draws

6\. persistence write occurs

7\. downstream events are triggered

8\. notifications and metrics update

Event outputs after successful ingestion

latest draw cache refresh

game insight refresh

watchlist checks

pick settlement checks

user notification eligibility checks

health log update

Architecture rule

Ingestion must be separated from the public web request path. Never fetch official data synchronously in a user-facing request if it can be avoided.

\---

8\. Persistence Layer

Supabase/Postgres should remain the system of record.

Persistence domains

1\. user and entitlement data

2\. game and state metadata

3\. draw history

4\. prediction requests and results

5\. play logs and settlements

6\. badges and progress

7\. notification state

8\. audit/event logs

9\. ingestion health logs

10\. model run metadata

Data storage philosophy

normalized where it matters

denormalized summary views where performance matters

audit fields on critical records

state/game abstraction at schema level

Required supporting features

Row Level Security

server-only service-role operations for ingestion and admin jobs

materialized or cached summary views where helpful

strong unique keys for dedupe

\---

9\. Operations & Governance Layer

This layer keeps the app healthy, trusted, and supportable.

9.1 BrewTruth Placement

BrewTruth is not a side tool. It is a first-class governance service.

BrewTruth should inspect:

ingestion outputs

prediction evidence

explanation wording

subscription entitlements

admin anomaly events

model execution traces

BrewTruth outputs

audit event rows

confidence bands

validation flags

“insufficient evidence” responses where necessary

support-facing trace summaries

\---

9.2 Observability

Minimum V1 observability should include:

API error logging

ingestion run logs

prediction generation timings

billing webhook logs

notification delivery logs

admin health summaries

Admin visibility should answer

did draw ingestion run?

did it succeed?

are any games stale?

are prediction jobs healthy?

are billing webhooks failing?

are users receiving notifications?

\---

9.3 Feature Flags

Feature flags should control:

game activation

state activation

premium strategy releases

commentary model upgrades

voice mode availability

badge experiments

new notification types

This prevents risky features from requiring immediate public launch exposure.

\---

10\. BrewCommand Scope for V1

BrewCommand should exist, but with reduced ambition.

BrewCommand V1 should be:

a lean internal admin/ops console

visibility-first, not a giant new subsystem

focused on ingestion health, prediction health, and entitlement/notification support

BrewCommand V1 modules

1\. draw ingestion monitor

2\. stale game detector

3\. prediction audit viewer

4\. BrewTruth event viewer

5\. billing / subscription support panel

6\. feature flag manager

7\. content/education stub manager

BrewCommand V1 should not be

a heavy internal IDE

a blocker for public product launch

a separate product requiring months of isolated build work

---

## BrewCommand Alerts & Incident Visibility

### Purpose

BrewLotto V1 must provide internal visibility when critical platform workflows fail, become stale, or degrade.

This alerting system ensures operators can identify and respond to issues before users are impacted.

### Canonical V1 Decision

Operational alerting will be handled through:

1. BrewCommand Alert Center (required)
2. Critical Email Alerts (required for V1)

Deferred:
- SMS escalation
- PagerDuty-style escalation trees
- complex multi-step on-call orchestration

### Why This Fits V1

This aligns with BrewLotto V1's principles of:
- practical, high-value notifications
- operational visibility
- controlled scope
- disciplined launch readiness

### V1 Alert Sources

The following categories must be supported:

- draw ingestion failures
- stale draw windows / missing expected results
- parser validation mismatches
- prediction job failures
- Stripe webhook failures
- notification delivery failures
- provider degradation / fallback activation
- unusual abuse/fraud patterns
- feature-flagged system degradation warnings

### V1 Alert Severity Levels

- `info`
- `warning`
- `critical`

### V1 Alert Statuses

- `open`
- `acknowledged`
- `resolved`
- `suppressed`

### BrewCommand Alert Center (Required)

BrewCommand must include an internal alert view showing:

- severity
- status
- source module
- category
- state/game context
- title
- message
- first seen timestamp
- last seen timestamp
- occurrence count
- linked metadata / raw payload / audit reference
- acknowledged by
- resolved at

### Email Alerts (Required)

Critical issues should send email notifications to the operator mailbox.

V1 email alerts should be sent for:
- ingestion failures
- stale expected results
- repeated parser mismatches
- prediction engine failures
- Stripe webhook failures
- repeated notification delivery failures

### V1 Alert Delivery Model

Alerting should be event-driven:

1. domain event occurs
2. alert rules evaluate severity and dedupe
3. alert row is created or updated
4. email delivery is triggered if threshold requires it
5. delivery result is logged

### V1 Deduping Rule

Repeated failures of the same issue should update the same alert thread where possible, increasing occurrence count and refreshing `last_seen_at`, instead of creating noisy duplicates.

### V1 Non-Goals

Do not build these into launch scope:
- PagerDuty-style escalation
- SMS escalation trees
- hyper-personalized AI incident narration
- full enterprise incident management workflows

### Phase Placement

- schema may be introduced early for readiness
- email + BrewCommand alert center implementation belongs to **Phase 7 — BrewCommand Admin and BrewTruth Ops**

### Success Criteria

The alert system is successful when:
- critical failures are visible in BrewCommand
- critical failures send email
- duplicate alert noise is controlled
- operators can acknowledge and resolve incidents
- admin health screens expose failures before users do

---

11\. Billing & Entitlements Architecture

Billing system of record

Stripe

Billing responsibilities

subscription checkout

customer portal

webhooks for status changes

entitlement updates in app database

tier gating enforcement in prediction responses and UI access

Entitlement flow

1\. user purchases subscription

2\. Stripe webhook fires

3\. backend verifies event

4\. subscription record is updated

5\. entitlement snapshot is refreshed

6\. UI and APIs read entitlement state

7\. premium features unlock or lock accordingly

Architecture note

Billing logic should be isolated from prediction code. Prediction services should consume an entitlement object, not Stripe internals.

\---

12\. Notifications Architecture

V1 notification categories

draw posted

tracked number event

pick reminder before draw

badge unlocked

streak achieved

account/subscription messages

Notification channels for V1

in-app notifications

email

push later if mobile packaging matures

Notification flow

1\. domain event occurs

2\. eligibility rules evaluate targets

3\. notification row is created

4\. delivery worker executes

5\. delivery result logged

Why event-driven matters

Notifications should react to business events, not page loads.

\---

13\. Gamification & BrewUniversity Lite Architecture

Gamification services

streak evaluator

badge rule engine

progression tracker

challenge assignment service

BrewUniversity Lite services

strategy glossary content

odds explainer content

short lessons

badge-linked learning modules

API stubs for future enterprise sync

V1 design rule

Gamification and learning should enrich retention and trust without overpowering the core draw/pick experience.

\---

14\. Frontend-to-Backend Flow Examples

14.1 Dashboard Load Flow

1\. user opens dashboard

2\. app loads selected game config

3\. latest draw insights are fetched from draw summary APIs

4\. hot/cold, momentum, and prediction teaser render

5\. tier entitlements determine which actions are enabled

14.2 Generate Pick Flow

1\. user selects game

2\. UI sends predict request

3\. backend loads entitlement state

4\. feature extractor loads latest draw features

5\. strategy engine runs

6\. ranker selects best candidates

7\. BrewTruth validates output

8\. commentary generated

9\. response saved to prediction history

10\. UI renders prediction \+ explanation \+ save/log options

14.3 Play Log Settlement Flow

1\. draw result is ingested

2\. settlement service finds matching user play logs

3\. results compared to official draw

4\. win/loss and prize metadata updated

5\. stats, streaks, and badges recomputed

6\. user notifications triggered if eligible

\---

15\. State Expansion Architecture

The architecture must support adding more states without major refactor.

Expansion principles

every game belongs to a state config

every source uses a parser adapter

every draw pipeline emits the same normalized shape

UI reads capability metadata from config

prediction engine uses game descriptors, not hardcoded state branches

What changes when a new state is added

state metadata row

lottery game rows

source connector/parser adapter

validation mappings

schedule config

payout/odds config

feature flag activation

What should not change

UI architecture

prediction pipeline structure

billing system

badge system

admin operations model

\---

16\. Security & Access Model

Public users

can browse supported game info and limited insights

Authenticated free users

can save some picks, track some history, access limited features

Paid users

unlock advanced strategy and history capabilities according to tier

Internal admin/users

access BrewCommand V1 and audit tools

Security rules

RLS on all user-owned data

service-role writes for ingestion and admin jobs only

webhook signature verification

rate limiting on prediction endpoints

audit logging on sensitive admin actions

\---

17\. Recommended Repo/Module Shape

Under /brewexec/, BrewLotto should be organized with clean domains.

Suggested structure

/app/ — routes and pages

/components/brewlotto/ — UI components

/lib/brewlotto-games/ — game configs and helpers

/lib/prediction/ — strategy engine modules

/lib/ingestion/ — source adapters and parsers

/lib/brewtruth/ — governance and audit checks

/lib/billing/ — Stripe integration

/lib/notifications/ — notification service

/lib/gamification/ — badges and streaks

/lib/brewu/ — education stubs

/lib/admin/ — BrewCommand V1 services

/types/ — shared contracts

/supabase/ or /db/ — schema and migrations

/tests/ — unit/integration/e2e

/brewdocs/ — canonical project docs

\---

18\. Stable V1 Runtime Checklist

The system architecture is considered V1-ready when the following are true:

draw ingestion is scheduled, isolated, and observable

prediction engine runs without frontend coupling

commentary generation can fall back to deterministic copy

BrewTruth validation blocks bad outputs

billing changes entitlements reliably

play logging and settlement are event-driven

badges and streaks update from settled data

admin health tools expose failures clearly

adding a new state is mostly config \+ parser work

\---

19\. Architecture Decisions Summary

Keep

config-driven game model

Supabase as source of truth

modular strategy engine

BrewTruth governance layer

BrewCommand as internal ops surface

gamification \+ education hooks

Limit

full multi-agent complexity

expensive model usage

oversized internal tooling

hardcoded per-game logic

Launch with confidence

NC \+ CA only

deterministic predictions first

explanation-rich UX

Stripe-based subscriptions

strong admin observability

\---

20\. Immediate Follow-On Specs

The next docs to create after this architecture spec are:

1\. BREWLOTTO\_V1\_DATABASE\_SCHEMA.md

2\. BREWLOTTO\_V1\_DATA\_INGESTION\_SPEC.md

3\. BREWLOTTO\_V1\_PREDICTION\_ENGINE\_SPEC.md

4\. BREWLOTTO\_V1\_PRICING\_AND\_BILLING\_SPEC.md

5\. BREWLOTTO\_V1\_TESTING\_AND\_SUCCESS\_OUTCOMES.md

6\. BREWLOTTO\_V1\_UI\_UX\_ARCHITECTURE.md

7\. BREWLOTTO\_V1\_ADMIN\_AND\_BREWCOMMAND\_SCOPE.md

8\. BREWLOTTO\_V1\_STATE\_ROLLOUT\_PLAN.md

\---

21\. BrewDocs Summary

What this doc does: Defines how BrewLotto V1 should be engineered from the UI down to ingestion, prediction, payments, notifications, and governance.

What it protects against: Architecture drift, overbuilt AI complexity, hidden operational failures, and brittle state/game logic.

What it enables: A practical SDLC path to a stable, testable, expandable BrewLotto launch.

# AI Architecture

\<\!--  
/brewexec/brewdocs/BREWLOTTO\_V1\_AI\_MODEL\_ROUTING\_AND\_FALLBACK\_SPEC.md  
Timestamp: 2026-03-16 ET  
Phase: V1 Reset / AI Routing \+ Fallback  
Purpose: Define the cost-effective AI model chain, routing logic, fallback order, agent responsibilities, and BrewTruth controls for BrewLotto V1.  
\--\>BrewLotto AI — V1 AI Model Routing and Fallback Spec

1\. Document Purpose

This document defines how AI should be used in BrewLotto V1 without making the product fragile, too expensive, or dependent on opaque reasoning.

It establishes:

which models BrewLotto should use first

which models are experimental vs production-ready

what each model is responsible for

how fallback routing should work

how agent roles should be structured

what BrewTruth must validate before AI output is shown to users

how AI usage should be gated by tier, feature, and budget

This document is intentionally conservative. BrewLotto V1 should be engine-first and AI-enhanced, not AI-dependent.

\---

2\. Core AI Philosophy

2.1 Primary Rule

Predictions come from the BrewLotto engine. AI explains, ranks, narrates, and assists.

This means:

draw ingestion, feature extraction, and candidate generation are not delegated to LLMs

statistical and deterministic strategies remain the source of truth for pick generation

AI adds value through summarization, ranking support, explanation, and user experience

2.2 Why This Matters

This protects BrewLotto from:

runaway inference costs

latency spikes

model hallucinations

unstable user-facing pick quality

vendor lock-in

brittle product behavior during outages

2.3 BrewTruth Rule

No AI output should ever imply:

guaranteed wins

unsupported confidence

nonexistent source evidence

fabricated state/game information

\---

3\. V1 Approved Model Stack

3.1 Primary User-Facing Model

Gemini 2.5 Flash-Lite / Gemini 2.5 Flash

Role: default explainer and low-cost user-facing reasoning layer

Use for:

“Why this pick?” explanations

strategy summaries

odds/education copy

support answers

badge/lesson microcopy

concise push/email text drafts for notification templates

Why approved:

cost-effective for a consumer app

strong latency profile

strong ecosystem and hosted reliability

suitable for lightweight explanation tasks

V1 status: Production-approved

\---

3.2 Premium Reasoning / Secondary Fallback Model

NVIDIA Nemotron Super

Role: premium reasoning model, advanced fallback, batch analysis model

Use for:

higher-depth strategy comparison

premium explanation passes

anomaly review summaries

BrewTruth-assisted audit reasoning

internal diagnostics on prediction disagreement

future multi-agent reasoning tasks

Why approved:

stronger reasoning profile

open-weight path available

hosted and self-hostable deployment options

good fit for future provider independence

V1 status: Production-approved, but usage must be gated and cost-controlled

\---

3.3 Internal Development / Coding Model

Grok Code Fast

Role: engineering support model only

Use for:

Opencode workflows

code scaffolding

refactor help

diagnostics

dev assistant tasks

internal documentation support

Why approved:

cost-effective for coding tasks

strong developer utility

V1 status: Internal-only, not part of public user runtime chain

\---

3.4 Experimental / Sandbox Model

MiMo V2 Flash

Role: evaluation model, potential future promotion candidate

Use for:

offline comparison testing

commentary quality benchmarks

latency experiments

selective A/B prompts in non-critical environments

Why approved for sandbox only:

interesting performance potential

aligned with open-weight experimentation philosophy

needs more validation before public-path dependency

V1 status: Sandbox only

\---

3.5 Optional Future Provider

Cohere

Role: future enterprise content / rerank / retrieval support candidate

Use later for:

education content enrichment

rerank flows

knowledge-grounded content experiences

support/search quality improvements

V1 status: Deferred

\---

4\. AI Usage Boundaries

4.1 What AI May Do in V1

explain picks already generated by the engine

summarize strategy evidence

transform structured facts into readable language

support premium educational overlays

help draft notification copy from existing structured events

support internal diagnostics and ops summaries

4.2 What AI Must Not Do in V1

invent picks without the engine

fetch or validate official draw data as source of truth

decide billing entitlements

store source-of-record user outcomes without validation

make unsupported claims about winning probability

substitute for BrewTruth governance

\---

5\. Agent Roles

BrewLotto should use lightweight agent roles implemented as modular services. These are application agents, not freeform autonomous bots.

5.1 Strategy Agent

Purpose: run deterministic/statistical strategies and output candidate picks.

Inputs:

normalized draw history

current game config

derived feature set

user tier and request context

Outputs:

candidate picks

strategy identifiers

evidence package

intermediate scores

Model dependency: none required

\---

5.2 Rank Agent

Purpose: rank and blend strategy outputs.

Inputs:

candidate outputs from Strategy Agent

feature weights

recent strategy performance metadata

Outputs:

ranked pick list

blended confidence bands

strategy weighting snapshot

Model dependency: optional lightweight ML only

\---

5.3 Commentary Agent

Purpose: convert engine evidence into user-readable explanations.

Inputs:

ranked picks

strategy metadata

draw insights

game metadata

user tier

Outputs:

short commentary

medium commentary

premium long-form commentary

education/lesson linkage

Model dependency: Gemini first, Nemotron fallback for deeper premium output

\---

5.4 BrewTruth Agent

Purpose: validate AI and engine output before user delivery.

Inputs:

latest source freshness metadata

structured evidence bundle

proposed commentary output

entitlement state

Outputs:

pass/fail decision

warning flags

allowed wording class

audit record

Model dependency: optional Nemotron-assisted review for premium/internal audit use only

\---

5.5 Support Agent

Purpose: answer user help questions, explain terms, and support education flows.

Inputs:

FAQ content

strategy glossary

odds library

user context

Outputs:

concise support responses

glossary explanations

onboarding guidance

Model dependency: Gemini first

\---

5.6 Dev/Ops Agent

Purpose: assist internal engineering and operational support.

Inputs:

logs

diagnostics

code context

admin prompts

Outputs:

summaries

debug suggestions

internal helper content

Model dependency: Grok Code Fast primarily

\---

6\. Routing Design

6.1 Default Routing Principle

The cheapest safe path should always run first.

Routing order

1\. no-model deterministic template output

2\. Gemini 2.5 Flash-Lite / Flash

3\. Nemotron Super

4\. graceful fallback to deterministic explanation template

Important rule

MiMo is not in the public production chain until promoted from sandbox validation.

\---

6.2 Public User Routing by Use Case

A. Generate Pick

strategy engine runs locally/server-side

no LLM required

optional template-based explanation returned immediately

B. Why This Pick?

first try deterministic explanation template

if richer explanation requested and tier allows, call Gemini

if Gemini fails and user tier supports deeper reasoning, call Nemotron

if both fail, return BrewTruth-safe template explanation

C. Odds / Learning Question

Gemini first

fallback to deterministic glossary response

optional Nemotron for premium long-form learning mode only

D. Premium Strategy Comparison

rank agent prepares structured comparison

Nemotron may summarize premium comparison if tier allows

fallback to Gemini condensed explanation

fallback again to deterministic comparison table

E. Support/Help

Gemini first

deterministic FAQ fallback

\---

6.3 Internal Routing by Use Case

Dev/Coding Tasks

Grok Code Fast primary

no public user dependency

Ops/Audit Summaries

deterministic summary first

Nemotron optional for complex premium/internal audit summaries

Sandbox Evaluation

MiMo used only in isolated benchmark paths

\---

7\. Tier-Based AI Access

Tier 1 — Free / Player

Allowed:

deterministic explanations

limited Gemini micro-explanations

FAQ/help support

Not allowed:

deep premium commentary

advanced strategy comparison narrative

costly multi-pass reasoning

\---

Tier 2 — Pro / Strategist

Allowed:

richer Gemini explanations

more detailed strategy commentary

enhanced education content

more frequent AI support interactions

Not allowed by default:

Nemotron-heavy reasoning on every request

\---

Tier 3 — Elite / Power Player

Allowed:

Gemini default

gated Nemotron premium reasoning for select flows

advanced strategy comparison

richer educational coaching

higher explanation depth

\---

Tier 4 — Founder / VIP (Optional Later)

Allowed:

all Tier 3 AI features

early beta model experiments

optional premium commentary packs

V1 note: do not build special runtime dependencies for Tier 4 unless the business case exists.

\---

8\. Budget and Cost Controls

8.1 Hard Cost Rules

no model call for standard pick generation

cache repeated commentary by prediction hash

cap premium reasoning frequency by tier

throttle support agent requests

pre-render deterministic educational content whenever possible

prefer short prompts and structured JSON inputs

prefer extractive summaries over open-ended generation

8.2 Usage Control Mechanisms

per-tier monthly AI quota counters

per-endpoint token budget ceilings

provider timeout thresholds

feature flags for disabling costly paths

admin kill switch for external providers

8.3 Caching Guidance

Cache by:

game

draw date

prediction hash

commentary mode

user tier if output differs materially

This is critical for keeping user-facing explanation costs low.

\---

9\. Fallback Rules

9.1 Provider Fallback Order

User-facing explanation flows

1\. deterministic template

2\. Gemini

3\. Nemotron

4\. deterministic safe fallback

Premium deep reasoning flows

1\. Nemotron

2\. Gemini compressed explanation

3\. deterministic comparison fallback

Support flows

1\. deterministic FAQ

2\. Gemini

3\. deterministic safe fallback

Dev/Ops flows

1\. Grok Code Fast

2\. deterministic/manual ops summary

\---

9.2 Timeout Guidance

deterministic template path should return immediately

Gemini calls must use a strict timeout budget

Nemotron calls must use an even stricter selective path budget

if timeout occurs, fail closed into deterministic copy

Rule

Never leave the user waiting because a premium reasoning path is slow.

\---

9.3 Failure Modes

On provider failure, BrewLotto should:

log provider error

log fallback event

continue serving safe explanation text

never block base prediction response

never expose raw provider errors to end users

\---

10\. BrewTruth Controls for AI

BrewTruth must review or enforce the following before AI output is shown:

10.1 Content Rules

no guarantee language

no fabricated statistics

no unsupported claims of probability

no stale source framing when data freshness is unclear

no provider-specific hallucinated explanations

10.2 Evidence Rules

Every AI explanation should be anchored to:

strategy identifiers

structured evidence fields

game context

draw freshness metadata

entitlement context if premium feature used

10.3 Output Classes

BrewTruth should label output as:

safe-template

safe-ai-short

safe-ai-premium

restricted

rejected

10.4 Rejection Cases

Reject AI output when:

source data is stale or missing

evidence bundle is incomplete

model introduces unsupported certainty

tier does not allow the explanation depth

provider response format is malformed

\---

11\. Provider Registry Design

The application should maintain a provider registry abstraction so runtime code is not tightly bound to one vendor.

Provider registry responsibilities

provider name

supported models

auth pattern

timeout settings

retry policy

feature compatibility

cost class

environment variable mapping

allowed usage domains

Example domains

commentary.light

commentary.premium

support.basic

audit.deep

dev.code

sandbox.experimental

Why this matters

This makes provider swaps, pricing changes, and model promotions easier without rewriting core app logic.

\---

12\. Self-Hosted Path (Future)

Nemotron is the strongest future self-host path from the approved stack.

Future self-host goals

reduce vendor dependence

support premium reasoning at lower marginal cost

enable fallback when hosted APIs fail

maintain open-weight alignment

V1 note

Do not block launch on self-hosting. Hosted APIs first, self-host later when revenue and ops maturity improve.

\---

13\. Sandbox Evaluation Program

MiMo V2 Flash and any future candidate models should be tested through a formal sandbox path.

Evaluation dimensions

latency

reliability

output consistency

adherence to structured prompts

cost efficiency

explanation clarity

failure behavior

Promotion criteria

A sandbox model may enter production only if it:

passes reliability thresholds

behaves safely under BrewTruth checks

beats or complements an existing provider materially

fits cost targets

\---

14\. Logging and Observability

Log the following for every AI request:

request domain

provider selected

model selected

fallback step reached

latency

token/cost estimate if available

BrewTruth output class

success/failure

cache hit/miss

Admin needs visibility into

provider health

timeout rates

fallback frequency

cost by model/domain

most expensive routes

rejected output counts

\---

15\. V1 Runtime Decision Matrix

Use deterministic only when:

generating base picks

free-tier quick insights

cached explanation exists

provider budget is exhausted

source evidence is thin

Use Gemini when:

user requests explanation

support/help content needs dynamic phrasing

educational overlays need concise narration

premium depth is not required

Use Nemotron when:

premium strategy comparison is requested

internal audit reasoning is needed

Gemini fails on a premium reasoning task

a deeper structured narrative is worth the cost

Use Grok Code Fast when:

the task is purely internal development/coding

Use MiMo when:

running sandbox benchmarks only

\---

16\. Architecture Summary

Approved V1 model stack

Gemini 2.5 Flash-Lite / Flash

NVIDIA Nemotron Super

Grok Code Fast

MiMo V2 Flash (sandbox only)

Product posture

engine-first

AI-enhanced

cost-aware

provider-agnostic

BrewTruth-governed

Public runtime rule

The app must remain fully functional even if every external AI provider is unavailable.

That is the key stability principle for BrewLotto V1.

\---

17\. Follow-On Spec Dependencies

This spec should directly inform:

BREWLOTTO\_V1\_DATABASE\_SCHEMA.md

BREWLOTTO\_V1\_PREDICTION\_ENGINE\_SPEC.md

BREWLOTTO\_V1\_PRICING\_AND\_BILLING\_SPEC.md

BREWLOTTO\_V1\_TESTING\_AND\_SUCCESS\_OUTCOMES.md

BREWLOTTO\_V1\_ADMIN\_AND\_BREWCOMMAND\_SCOPE.md

\---

18\. BrewDocs Summary

What this doc does: Defines the approved AI model stack, routing logic, cost controls, and fallback behavior for BrewLotto V1.

What it prevents: AI overreach, fragile runtime dependencies, runaway cost, and unsupported claims.

What it enables: A clean provider registry, resilient explanation layer, premium reasoning path, and future open-weight expansion.

# Database Schema

\<\!--  
/brewexec/brewdocs/BREWLOTTO\_V1\_DATABASE\_SCHEMA.md  
Timestamp: 2026-03-16 ET  
Phase: V1 Reset / Database Foundation  
Purpose: Canonical database schema specification for BrewLotto V1 supporting NC \+ CA launch, prediction history, billing entitlements, BrewTruth audits, and future state expansion.  
\--\>BrewLotto AI — V1 Database Schema

1\. Document Purpose

This document defines the canonical database design for BrewLotto V1.

It translates the product overview, system architecture, AI routing spec, and earlier BrewLotto planning into a practical persistence model that supports:

NC \+ CA launch

multi-game expansion

official draw ingestion

prediction history

user play logging and settlement

subscription entitlements

notifications

badges and streaks

BrewTruth auditability

AI/provider routing logs

future state rollout without schema rewrite

This schema replaces the older game-per-table approach with a cleaner, scalable model.

\---

2\. Design Principles

2.1 State/Game Abstraction First

Older BrewLotto work included per-game draw tables for NC games, which was useful for early velocity, but V1 needs a normalized structure that supports NC and CA cleanly and prepares for future states. The earlier docs already stressed adding new games via config and DB/API hydration rather than stale hardcoding. fileciteturn2file0turn2file4

2.2 One Source of Truth for Draws

Official draw data must be stored in a unified draw model with:

source provenance

schedule awareness

dedupe keys

ingestion status

settlement support

2.3 Predictions Are Audit Records

Every generated pick must be traceable back to:

game

draw context

strategy evidence

entitlement tier

AI routing path if explanation used AI

BrewTruth decision metadata

2.4 The App Must Work Without AI

The database must support fully functional gameplay, insights, history, notifications, and settlement even if AI providers are unavailable.

2.5 RLS by Default

All user-owned records must be protected with Row Level Security. System jobs use service-role or controlled server-side access.

\---

3\. Schema Domains

The schema is organized into 12 domains:

1\. identity and user profile

2\. subscription and entitlements

3\. state and game catalog

4\. draw schedules and source registry

5\. official draw history

6\. feature snapshots and prediction records

7\. user play logging and settlement

8\. watchlists and notifications

9\. badges, streaks, and BrewUniversity Lite progress

10\. BrewTruth audit and governance

11\. AI/provider routing telemetry

12\. admin / feature flags / operations

\---

4\. Identity and User Profile Tables

4.1 profiles

Extends auth users with app-specific user data.

Purpose

public app profile

preferences

state preference

timezone

current tier snapshot helpers

Key columns

id uuid primary key — references auth.users.id

display\_name text

username text unique null

avatar\_url text null

home\_state\_code text null

timezone text default 'America/New\_York'

preferred\_locale text default 'en-US'

marketing\_opt\_in boolean default false

notifications\_opt\_in boolean default true

voice\_mode\_enabled boolean default false

onboarding\_completed boolean default false

created\_at timestamptz default now()

updated\_at timestamptz default now()

Notes

do not duplicate auth-sensitive email/password data here

keep this lightweight and user-owned

\---

4.2 user\_preferences

Stores UI and gameplay preferences.

Key columns

user\_id uuid primary key

default\_state\_code text null

default\_game\_id uuid null

favorite\_games jsonb default '\[\]'::jsonb

favorite\_strategy\_labels jsonb default '\[\]'::jsonb

budget\_guardrails jsonb null

education\_mode boolean default true

show\_advanced\_explanations boolean default false

notification\_channels jsonb default '{"in\_app": true, "email": false}'::jsonb

updated\_at timestamptz default now()

\---

5\. Subscription and Entitlement Tables

5.1 subscription\_products

Catalog of plans exposed by billing.

Key columns

id uuid primary key

provider text not null default 'stripe'

provider\_product\_id text

provider\_price\_id text

code text unique not null — e.g. free, pro, elite, founder

name text not null

billing\_interval text check (billing\_interval in ('month','year','lifetime'))

is\_active boolean default true

rank smallint not null

feature\_matrix jsonb not null

created\_at timestamptz default now()

Why needed

Keeps pricing/business logic out of hardcoded app files.

\---

5.2 user\_subscriptions

Tracks external billing lifecycle.

Key columns

id uuid primary key

user\_id uuid not null

provider text not null default 'stripe'

provider\_customer\_id text

provider\_subscription\_id text unique

subscription\_product\_id uuid not null

status text not null — active, trialing, past\_due, canceled, incomplete, expired

current\_period\_start timestamptz null

current\_period\_end timestamptz null

cancel\_at\_period\_end boolean default false

trial\_end timestamptz null

metadata jsonb default '{}'::jsonb

created\_at timestamptz default now()

updated\_at timestamptz default now()

Rules

one active paid subscription per user per product line

allow historical rows for audit

\---

5.3 user\_entitlements

Fast-access entitlement snapshot used by app runtime.

Key columns

user\_id uuid primary key

tier\_code text not null default 'free'

tier\_rank smallint not null default 1

ai\_quota\_monthly integer default 0

ai\_quota\_used integer default 0

pick\_generation\_limit\_daily integer null

advanced\_strategy\_access boolean default false

premium\_explanations\_access boolean default false

premium\_comparison\_access boolean default false

export\_access boolean default false

voice\_commentary\_access boolean default false

notifications\_premium\_access boolean default false

effective\_from timestamptz default now()

effective\_to timestamptz null

updated\_at timestamptz default now()

Why needed

Prediction and UI layers read a clean entitlement object, not Stripe internals.

\---

5.4 billing\_webhook\_events

Records inbound billing events.

Key columns

id uuid primary key

provider text not null

provider\_event\_id text unique not null

event\_type text not null

payload jsonb not null

processed boolean default false

processed\_at timestamptz null

error\_message text null

created\_at timestamptz default now()

\---

6\. State and Game Catalog Tables

The older docs included NC-specific configs and notes about hydrating schedules, odds, and payout data from DB/API instead of stale hardcoding. That is exactly the right direction for V1. fileciteturn2file0turn2file1

6.1 states

Key columns

code text primary key — NC, CA

name text not null

lottery\_code text unique null

timezone text not null

is\_active boolean default true

launch\_wave smallint default 1

created\_at timestamptz default now()

\---

6.2 lottery\_games

Master game catalog across states.

Key columns

id uuid primary key

state\_code text not null references states(code)

game\_key text not null — internal stable key

display\_name text not null

game\_family text not null — pick3, pick4, pick5, cash5, mega\_millions, powerball, etc.

primary\_count smallint not null

primary\_min smallint not null

primary\_max smallint not null

has\_bonus boolean default false

bonus\_count smallint default 0

bonus\_min smallint null

bonus\_max smallint null

bonus\_label text null

draw\_style text not null — day\_evening, daily, weekly, jackpot

supports\_multiplier boolean default false

supports\_fireball boolean default false

supports\_double\_play boolean default false

supports\_ez\_match boolean default false

schedule\_config jsonb not null

odds\_config jsonb null

payout\_config jsonb null

ui\_config jsonb default '{}'::jsonb

is\_active boolean default true

created\_at timestamptz default now()

updated\_at timestamptz default now()

Constraints

unique (state\_code, game\_key)

Why needed

Allows NC \+ CA launch and future state expansion without per-game table sprawl.

\---

6.3 game\_variants

Optional play-type variants under a base game.

Examples

Pick 3 day vs evening windows

Fireball option

Power Play / Megaplier

EZ Match

Key columns

id uuid primary key

game\_id uuid not null

variant\_key text not null

display\_name text not null

variant\_type text not null

config jsonb not null

is\_active boolean default true

created\_at timestamptz default now()

Constraints

unique (game\_id, variant\_key)

\---

7\. Draw Schedules and Source Registry

7.1 draw\_sources

Registry of official or approved source connectors.

Key columns

id uuid primary key

state\_code text not null

game\_id uuid null

source\_key text not null

source\_type text not null — api, html, csv, rss, manual

base\_url text not null

auth\_config jsonb null

parser\_key text not null

priority smallint not null default 1

is\_official boolean default true

is\_active boolean default true

created\_at timestamptz default now()

updated\_at timestamptz default now()

Constraints

unique (state\_code, source\_key)

\---

7.2 draw\_schedule\_windows

Canonical windows per game to support next-draw logic and freshness checks.

Key columns

id uuid primary key

game\_id uuid not null

window\_label text not null — day, evening, nightly, monday, etc.

schedule\_type text not null — daily, twice\_daily, weekly

day\_of\_week smallint null

local\_draw\_time time not null

cutoff\_minutes\_before integer null

is\_active boolean default true

created\_at timestamptz default now()

Why needed

Supports next draw countdowns and stale-data detection.

\---

8\. Official Draw History Tables

The older BrewLotto docs proposed individual draw tables for each NC game. That helped early ingestion, but V1 should unify draw storage and let new states/games be added with config and parser updates. fileciteturn2file0turn2file4

8.1 official\_draws

This is the canonical draw table.

Key columns

id uuid primary key

game\_id uuid not null

draw\_date date not null

draw\_window\_label text null — day, evening, nightly, etc.

draw\_datetime\_local timestamptz not null

draw\_sequence integer null — optional when multiple same-day windows

primary\_numbers smallint\[\] not null

bonus\_numbers smallint\[\] default '{}'::smallint\[\]

multiplier\_value smallint null

fireball\_value smallint null

special\_values jsonb default '{}'::jsonb

jackpot\_amount numeric(14,2) null

cash\_value numeric(14,2) null

annuity\_value numeric(14,2) null

source\_id uuid not null

source\_draw\_id text null

source\_payload jsonb null

result\_status text not null default 'official'

is\_latest\_snapshot boolean default false

ingested\_at timestamptz default now()

created\_at timestamptz default now()

Constraints

unique (game\_id, draw\_date, draw\_window\_label, draw\_sequence)

Notes

supports day/evening games and jackpot games in one structure

is\_latest\_snapshot can be maintained by job for fast UI reads

\---

8.2 official\_draw\_number\_facts

Optional exploded per-number facts table for analytics and ML convenience.

Key columns

id uuid primary key

draw\_id uuid not null

game\_id uuid not null

number\_value smallint not null

number\_type text not null — primary, bonus, fireball, multiplier

position\_index smallint null

created\_at timestamptz default now()

Why needed

Supports frequency, position, and feature engineering efficiently.

\---

8.3 draw\_ingestion\_runs

Tracks each ingestion job execution.

Key columns

id uuid primary key

state\_code text not null

game\_id uuid null

source\_id uuid not null

run\_type text not null — scheduled, manual, backfill, retry

started\_at timestamptz default now()

finished\_at timestamptz null

status text not null — running, succeeded, partial, failed

draws\_seen integer default 0

draws\_inserted integer default 0

draws\_updated integer default 0

draws\_skipped integer default 0

error\_count integer default 0

warning\_count integer default 0

freshness\_observed\_at timestamptz null

log\_summary text null

metadata jsonb default '{}'::jsonb

\---

8.4 draw\_ingestion\_errors

Detailed errors associated with an ingestion run.

Key columns

id uuid primary key

run\_id uuid not null

severity text not null — info, warning, error, critical

error\_code text null

message text not null

raw\_context jsonb null

created\_at timestamptz default now()

\---

8.5 draw\_freshness\_status

Fast health table for app and admin usage.

Key columns

game\_id uuid primary key

latest\_draw\_id uuid null

latest\_draw\_datetime\_local timestamptz null

latest\_ingestion\_run\_id uuid null

expected\_next\_draw\_at timestamptz null

staleness\_minutes integer null

status text not null — healthy, delayed, stale, failed

updated\_at timestamptz default now()

\---

9\. Feature Snapshots and Prediction Tables

The previous docs already anticipated a strategy engine, prediction history, and hit-rate analytics. V1 formalizes that into auditable prediction records rather than transient UI events. fileciteturn2file2turn2file3

9.1 draw\_feature\_snapshots

Stores computed features for a game at a point in time.

Key columns

id uuid primary key

game\_id uuid not null

as\_of\_draw\_id uuid null

as\_of\_datetime timestamptz not null

feature\_version text not null

lookback\_window integer not null

feature\_payload jsonb not null

created\_at timestamptz default now()

Why needed

Allows reproducible strategy runs and ML experimentation.

\---

9.2 prediction\_requests

Tracks each prediction generation request.

Key columns

id uuid primary key

user\_id uuid null

game\_id uuid not null

request\_source text not null — dashboard, api, cron, admin, experiment

entitlement\_tier\_code text not null default 'free'

variant\_context jsonb default '{}'::jsonb

requested\_count smallint default 1

requested\_explanation\_depth text default 'short'

request\_hash text unique null

feature\_snapshot\_id uuid null

status text not null default 'completed'

created\_at timestamptz default now()

Why needed

Separates request event from result payloads and supports caching/auditing.

\---

9.3 predictions

Stores generated prediction results.

Key columns

id uuid primary key

prediction\_request\_id uuid not null

game\_id uuid not null

user\_id uuid null

target\_draw\_id uuid null

target\_draw\_date date null

target\_draw\_window\_label text null

primary\_numbers smallint\[\] not null

bonus\_numbers smallint\[\] default '{}'::smallint\[\]

special\_values jsonb default '{}'::jsonb

composite\_score numeric(8,4) null

confidence\_band text null — low, medium, elevated, experimental

strategy\_public\_label text null

strategy\_internal\_bundle jsonb not null

evidence\_bundle jsonb not null

prediction\_hash text not null

is\_saved\_by\_default boolean default false

created\_at timestamptz default now()

Constraints

unique (prediction\_hash)

\---

9.4 prediction\_explanations

Stores commentary and explanation payloads.

Key columns

id uuid primary key

prediction\_id uuid not null

explanation\_type text not null — template, ai\_short, ai\_premium, comparison

provider\_name text null

model\_name text null

content text not null

content\_json jsonb null

brewtruth\_output\_class text not null

cached boolean default false

created\_at timestamptz default now()

Why needed

Keeps prediction math separate from natural-language explanation.

\---

9.5 prediction\_strategy\_scores

Exploded scores per strategy module.

Key columns

id uuid primary key

prediction\_id uuid not null

strategy\_key text not null

public\_label text not null

weight numeric(8,4) not null

score numeric(8,4) not null

notes jsonb default '\[\]'::jsonb

created\_at timestamptz default now()

Why needed

Supports BrewCommand visibility and future performance analysis.

\---

10\. User Play Logging and Settlement Tables

10.1 saved\_picks

Stores user-saved predictions or manually entered favorite picks.

Key columns

id uuid primary key

user\_id uuid not null

game\_id uuid not null

prediction\_id uuid null

label text null

primary\_numbers smallint\[\] not null

bonus\_numbers smallint\[\] default '{}'::smallint\[\]

special\_values jsonb default '{}'::jsonb

is\_quick\_save boolean default false

created\_at timestamptz default now()

\---

10.2 play\_logs

Canonical record of what the user actually played.

Key columns

id uuid primary key

user\_id uuid not null

game\_id uuid not null

prediction\_id uuid null

saved\_pick\_id uuid null

target\_draw\_id uuid null

target\_draw\_date date not null

target\_draw\_window\_label text null

primary\_numbers smallint\[\] not null

bonus\_numbers smallint\[\] default '{}'::smallint\[\]

special\_values jsonb default '{}'::jsonb

ticket\_count integer default 1

wager\_amount numeric(10,2) default 0

purchase\_source text null

notes text null

status text not null default 'pending' — pending, settled, missed, canceled

created\_at timestamptz default now()

updated\_at timestamptz default now()

Why needed

This is the key user gameplay ledger.

\---

10.3 play\_settlements

Stores result of matching a play log against the official draw.

Key columns

id uuid primary key

play\_log\_id uuid not null unique

official\_draw\_id uuid not null

match\_summary jsonb not null

match\_count\_primary smallint default 0

match\_count\_bonus smallint default 0

won boolean default false

prize\_amount numeric(12,2) default 0

roi\_amount numeric(12,2) default 0

settled\_at timestamptz default now()

Why needed

Separates mutable log entry from settlement result.

\---

10.4 user\_play\_stats\_daily

Optional aggregated stats table.

Key columns

id uuid primary key

user\_id uuid not null

stat\_date date not null

state\_code text null

game\_id uuid null

plays\_count integer default 0

wager\_total numeric(12,2) default 0

wins\_count integer default 0

winnings\_total numeric(12,2) default 0

roi\_total numeric(12,2) default 0

updated\_at timestamptz default now()

Constraints

unique (user\_id, stat\_date, state\_code, game\_id)

\---

11\. Watchlists and Notifications

11.1 number\_watchlists

Tracks numbers or patterns users care about.

Key columns

id uuid primary key

user\_id uuid not null

game\_id uuid not null

watch\_type text not null — number, combo, hot\_threshold, overdue\_threshold

watch\_payload jsonb not null

is\_active boolean default true

created\_at timestamptz default now()

\---

11.2 notifications

Canonical notification ledger.

Key columns

id uuid primary key

user\_id uuid not null

category text not null

channel text not null — in\_app, email, push

title text not null

body text not null

payload jsonb default '{}'::jsonb

status text not null default 'pending' — pending, queued, delivered, failed, read, dismissed

scheduled\_for timestamptz null

delivered\_at timestamptz null

read\_at timestamptz null

created\_at timestamptz default now()

\---

11.3 notification\_events

Detailed delivery attempts and outcomes.

Key columns

id uuid primary key

notification\_id uuid not null

event\_type text not null — queued, delivered, failed, opened, clicked

provider text null

provider\_message\_id text null

metadata jsonb default '{}'::jsonb

created\_at timestamptz default now()

\---

12\. Badges, Streaks, and BrewUniversity Lite

12.1 badge\_definitions

Key columns

id uuid primary key

badge\_key text unique not null

name text not null

description text not null

category text not null — learning, streak, performance, engagement

criteria\_config jsonb not null

xp\_value integer default 0

is\_active boolean default true

created\_at timestamptz default now()

\---

12.2 user\_badges

Key columns

id uuid primary key

user\_id uuid not null

badge\_id uuid not null

earned\_at timestamptz default now()

source\_event jsonb default '{}'::jsonb

Constraints

unique (user\_id, badge\_id)

\---

12.3 user\_streaks

Tracks current and best streaks.

Key columns

user\_id uuid primary key

current\_login\_streak integer default 0

best\_login\_streak integer default 0

current\_play\_streak integer default 0

best\_play\_streak integer default 0

current\_learning\_streak integer default 0

best\_learning\_streak integer default 0

last\_activity\_date date null

updated\_at timestamptz default now()

# Data Ingestion

\<\!--  
/brewexec/brewdocs/BREWLOTTO\_V1\_DATA\_INGESTION\_SPEC.md  
Timestamp: 2026-03-16 ET  
Phase: V1 Reset / Data Ingestion  
Purpose: Canonical ingestion specification for BrewLotto V1 covering NC \+ CA official draw acquisition, normalization, validation, freshness, retries, BrewTruth checks, and future state rollout readiness.  
\--\>BrewLotto AI — V1 Data Ingestion Spec

1\. Document Purpose

This document defines how BrewLotto V1 acquires, validates, stores, and operationalizes official lottery data.

It covers:

source strategy for North Carolina and California

ingestion job architecture

parser adapter design

normalization rules

dedupe and idempotency

freshness and stale-data detection

retries and failure handling

downstream event triggers

BrewTruth checks

ingestion testing requirements

future state expansion readiness

This document is the canonical data-entry blueprint for BrewLotto V1.

\---

2\. Why Ingestion Is a First-Class System

The product lives or dies on source trust.

If draw data is stale, malformed, duplicated, late, or inconsistent:

predictions become suspect

user trust drops immediately

notifications misfire

play settlement becomes unreliable

BrewTruth has to reject too many outputs

Core Principle

BrewLotto is only as strong as its official draw pipeline.

That means ingestion is not a side utility. It is core product infrastructure.

\---

3\. Ingestion Goals for V1

Primary goals

1\. Ingest NC and CA official results reliably.

2\. Normalize all supported games into one canonical draw shape.

3\. Detect and reject malformed or duplicate records.

4\. Tolerate delayed posting and partial source failures.

5\. Trigger prediction refresh, watchlists, notifications, and settlement only after validated persistence.

6\. Expose clear health status to BrewCommand/admin.

7\. Support future state rollout with adapter-based expansion instead of rewrites.

Non-goals for V1

scraping dozens of states at once

fully autonomous self-healing parser generation

broad unofficial source dependency

user-facing live scraping in request paths

\---

4\. Supported Launch Scope

4.1 Launch states

North Carolina

California

4.2 Launch game classes

Pick 3 style games

Pick 4 style games

Pick 5 / Cash-style games

Powerball

Mega Millions

V1 guidance

NC \+ CA should be enough to prove the architecture, ops model, and monetization path before broad state rollout.

\---

5\. Source Strategy

5.1 Source Hierarchy

Use a tiered source model.

Tier A — Official source of record

The primary target should always be the official state lottery source or official multi-state game source.

Tier B — Approved backup source

Only use if:

official source is down

official source format changes temporarily

backup source has high trust and matching structure

Tier C — Manual admin backfill

Used only when both automated source paths fail or when historical repair is required.

Rule

Public product features should not rely on unofficial low-trust sources without explicit admin controls and BrewTruth warnings.

\---

5.2 Source Registry Model

Every source must be registered in draw\_sources and define:

state scope

game scope (if specific)

source type

parser key

priority

official vs backup designation

active/inactive state

Why this matters

No parser or fetch flow should be hidden in random code paths. Everything should be cataloged and inspectable.

\---

6\. Ingestion Architecture

The ingestion system should be built as a scheduled background pipeline, not a frontend dependency.

6.1 Major components

1\. Scheduler

2\. Fetcher

3\. Parser Adapter

4\. Normalizer

5\. Validator

6\. Deduper

7\. Persistence Writer

8\. Event Dispatcher

9\. Health Reporter

10\. BrewTruth Ingestion Guard

\---

6.2 Runtime sequence

1\. scheduler selects eligible state/game/source jobs

2\. fetcher retrieves raw payload

3\. parser adapter transforms source-specific structure into normalized candidate draw records

4\. validator enforces structural and semantic checks

5\. deduper compares against existing draw keys

6\. writer inserts or updates canonical records

7\. freshness status is recalculated

8\. downstream domain events are emitted

9\. BrewTruth logs audit event

10\. admin health surfaces refresh

\---

7\. Scheduler Design

7.1 Scheduler responsibilities

run jobs on defined cadence

support per-state/per-game windows

support catch-up and retry jobs

avoid duplicate concurrent runs for same source/game window

prioritize expected draw windows

7.2 Scheduler modes

scheduled

retry

backfill

manual admin run

repair/reconciliation run

7.3 Cadence guidance

Ingestion should run more frequently around expected draw windows and less aggressively otherwise.

Example cadence pattern

pre-draw monitoring windows

expected-post window checks

delayed-post retry window

low-frequency overnight reconciliation

Rule

Do not rely on one single daily scrape for time-sensitive games.

\---

8\. Fetcher Layer

The fetcher is responsible only for retrieval, not interpretation.

8.1 Fetcher responsibilities

make source request

capture status code / headers / metadata

return raw body

record source timing

enforce timeout policy

8.2 Fetcher rules

no normalization logic here

no direct DB writes here

strict timeout and retry policy

preserve raw payload for failure diagnostics where safe

8.3 Supported fetch types

JSON/API

HTML page fetch

CSV download

feed or text payload

manual upload/backfill payload

\---

9\. Parser Adapter Pattern

This is one of the most important design choices.

Each state/game/source combination should use a parser adapter that converts raw source content into a canonical draw candidate shape.

9.1 Parser adapter contract

Every parser should return:

source metadata

one or more normalized draw candidates

parse warnings

parse confidence

parser version

9.2 Parser output shape

Each normalized draw candidate should include:

game\_id

draw\_date

draw\_window\_label

draw\_datetime\_local

primary\_numbers\[\]

bonus\_numbers\[\]

special\_values

jackpot\_amount where applicable

source\_draw\_id if present

raw\_ref or payload pointer

9.3 Why adapters matter

This keeps source-specific fragility out of the rest of the system. Adding a new state later should primarily mean:

new source record

new parser adapter

updated schedule config

Not a rewrite of the whole pipeline.

\---

10\. Canonical Normalization Rules

All parsed data must be normalized before persistence.

10.1 Number normalization

convert values to integers

preserve draw order for positional games

validate within configured min/max ranges

store bonus and special values in correct columns

10.2 Date/time normalization

convert all source dates into canonical local draw datetime

preserve state timezone context

distinguish draw date from ingestion time

10.3 Window normalization

Map source-specific labels into canonical draw\_window\_label values, such as:

day

evening

nightly

midday

monday/tuesday/etc. where needed

10.4 Jackpot normalization

Where applicable normalize:

jackpot amount

cash value

annuity value

multiplier indicators

Rule

Source formatting noise must be removed before records reach validation.

\---

11\. Validation Rules

Validation occurs after normalization and before write.

11.1 Structural validation

Ensure required fields exist:

game\_id

draw\_date

draw\_datetime\_local

primary\_numbers

source\_id

11.2 Number validation

count matches game config

values are within configured ranges

bonus counts and ranges match game rules

duplicate handling follows game-specific rules

11.3 Semantic validation

draw datetime is plausible

draw is not impossible relative to schedule window

parsed game matches expected game family

jackpot fields only appear where supported

11.4 Source consistency validation

source\_draw\_id reuse does not conflict unexpectedly

new record does not contradict recent official record unless explicitly marked correction

11.5 Validation outcomes

pass

warn and continue

reject and log

Important rule

Validation warnings may allow persistence only if the record remains safe and materially usable.

\---

12\. Dedupe and Idempotency

The ingestion system must tolerate re-runs.

12.1 Canonical dedupe key

Use:

game\_id

draw\_date

draw\_window\_label

draw\_sequence

Supporting checks

Also compare:

source\_draw\_id

parsed numbers

source timestamps if available

12.2 Idempotency goals

Repeated ingestion runs should:

not create duplicate draws

safely skip identical records

update records only when authoritative corrections are detected

12.3 Correction handling

If official source changes a result or jackpot field:

log the correction

update the draw

emit correction event

rerun affected settlement and summaries where necessary

\---

13\. Persistence Rules

13.1 Write targets

Primary write target:

official\_draws

Secondary derived writes:

official\_draw\_number\_facts

draw\_ingestion\_runs

draw\_ingestion\_errors

draw\_freshness\_status

optional feature refresh queue or event

13.2 Write pattern

1\. begin ingestion run row

2\. parse/validate candidate records

3\. upsert or insert canonical draw rows

4\. refresh number facts where needed

5\. update run summary

6\. update freshness status

7\. dispatch downstream events

8\. write BrewTruth ingestion audit row

13.3 Transaction guidance

Use transaction boundaries per job or per draw batch depending on source volume. Failures should not leave partially inconsistent draw records and derived facts out of sync.

\---

14\. Freshness and Stale-Data Detection

Freshness is critical to trust.

14.1 Freshness table usage

draw\_freshness\_status should be updated after each successful or failed job.

14.2 Freshness dimensions

latest official draw observed

latest ingestion run outcome

expected next draw time

staleness duration

health status

14.3 Status classes

healthy

delayed

stale

failed

14.4 Product behavior tied to freshness

Healthy

Normal predictions and notifications allowed.

Delayed

Predictions may proceed but with softer language if latest draw window may not be posted yet.

Stale

BrewTruth should restrict certain premium claims/explanations. Admin alert should surface.

Failed

Prediction UX should degrade gracefully and avoid implying fresh analysis.

\---

15\. Retry Strategy

15.1 Retry triggers

Retry on:

timeout

transient network errors

rate limits

temporary source parse failures

delayed official posting windows

15.2 Retry policy design

short retry burst for transient fetch issues

longer spaced retries for delayed postings

admin/manual escalation path after repeated failures

15.3 Retry guardrail

Do not hammer official sources aggressively. Protect the platform and respect rate limits.

\---

16\. Failure Handling

16.1 Failure types

fetch failure

parse failure

validation rejection

persistence failure

downstream event failure

16.2 Failure response principles

fail visibly in admin, not silently

preserve enough raw context for debugging

do not corrupt existing draw history

do not block unrelated games/states if one source fails

16.3 User-facing behavior

If a game is stale or failed:

show the latest trusted data available

avoid fake freshness language

keep base app usable

let BrewTruth constrain premium commentary

\---

17\. Downstream Event Triggers

Only validated and persisted draws may trigger downstream updates.

17.1 Event types after successful draw write

latest draw updated

draw insights refresh requested

hot/cold snapshot refresh requested

watchlist evaluation requested

play settlement requested

notification candidate generation requested

dashboard cache invalidation requested

17.2 Event types after correction

draw correction detected

settlement recompute requested

strategy performance refresh requested

admin anomaly notice created

Rule

Downstream systems consume events from persisted truth, not raw parser output.

\---

18\. BrewTruth Ingestion Controls

BrewTruth must evaluate ingestion before the data is treated as trustworthy for premium product flows.

18.1 BrewTruth ingestion checks

source is approved

parser version is known

required fields are complete

draw is within plausible schedule expectations

duplicate/correction status is understood

freshness state is updated

18.2 BrewTruth outcomes

passed

warned

rejected

18.3 Example rejection triggers

numbers out of legal range

source record mapped to wrong game

malformed or ambiguous draw window

stale backup source conflicting with fresher official source

incomplete jackpot record where required fields are critical

18.4 Logging target

All BrewTruth ingestion decisions should create rows in brewtruth\_audit\_events.

\---

19\. Settlement Coupling Rules

The draw pipeline and settlement pipeline must be connected but loosely coupled.

19.1 Settlement trigger rule

Settlement starts only after:

draw row is validated

draw row is persisted

correction status is known

19.2 Settlement scope

Affected play logs should be located by:

game\_id

target\_draw\_date

target\_draw\_window\_label

19.3 Correction handling

If a draw is corrected later:

affected settlements must be recomputed

user stats and streaks may need refresh

notification logic must avoid duplicate “you won” mistakes

\---

20\. Backfill and Repair Mode

20.1 Why backfill matters

Historical completeness is required for:

hot/cold calculations

overdue logic

strategy benchmarking

ML training data

confidence summaries

20.2 Backfill modes

historical state/game bootstrap

missing-date repair

source correction replay

manual file import reconciliation

20.3 Backfill safety rules

isolate backfill jobs from normal user latency paths

tag runs as backfill

allow partial progress tracking

avoid accidentally triggering user-facing notifications for historical inserts

\---

21\. Admin / BrewCommand Ingestion Visibility

BrewCommand V1 should expose ingestion in a simple, visibility-first way.

21.1 Required admin views

latest run per state/game/source

current freshness status per game

failed jobs and top errors

correction events

stale-game panel

manual retry trigger

manual backfill trigger

21.2 Useful admin details

parser version used

rows inserted/updated/skipped

last successful ingestion timestamp

source priority resolution

BrewTruth pass/warn/reject result

\---

22\. Observability and Metrics

Track operational metrics for ingestion health.

22.1 Core metrics

job success rate

median fetch latency

parse failure rate

validation rejection count

average staleness by game

time from official posting to app persistence

correction frequency

downstream event success rate

22.2 Why these matter

They tell us whether the product is actually trustworthy, not just whether cron jobs fired.

\---

23\. Testing Strategy for Ingestion

Ingestion testing must start early, not after launch.

23.1 Unit tests

Test:

parser adapters

normalization helpers

validation rules

dedupe logic

correction detection

23.2 Integration tests

Test:

fetch \+ parse \+ validate \+ persist path

state/game source registry resolution

ingestion run log creation

freshness table updates

event dispatch calls

23.3 E2E / staging tests

Test:

scheduled ingestion against staging fixtures

delayed posting simulation

correction replay

stale source fallback behavior

settlement trigger behavior

23.4 Fixture strategy

Store representative NC and CA raw payload fixtures for:

valid responses

malformed responses

delayed/no-result responses

corrected result responses

jackpot and non-jackpot games

\---

24\. Success Outcomes for Ingestion

The ingestion layer is successful when:

NC and CA official draws are acquired reliably

duplicate draw rows are not created during reruns

corrections are handled cleanly

freshness status reflects reality

stale or failed conditions are visible quickly

downstream settlement and notification flows only trigger from validated data

BrewTruth can confidently pass most normal runs and flag the bad ones

adding a new state mostly requires source \+ parser \+ schedule setup

\---

25\. Future State Rollout Design

This ingestion design must scale beyond NC \+ CA.

25.1 What adding a new state should require

new states row

new lottery\_games rows

new draw\_sources rows

parser adapter(s)

schedule config

validation mappings

feature flag activation

25.2 What adding a new state should not require

new core draw tables

rewritten prediction pipeline

rewritten settlement model

custom notification architecture

This is the payoff of the normalized DB and adapter-based ingestion strategy.

\---

26\. Recommended Implementation Phases

Phase A — Source Foundation

seed NC \+ CA state rows

seed launch game rows

seed draw source registry

build parser interface

build ingestion run logging

Phase B — Core Ingestion Path

implement fetchers

implement NC adapters

implement CA adapters

implement normalization \+ validation

persist canonical draws

update freshness status

Phase C — Operational Readiness

retries

correction handling

admin health screens

alerting

backfill mode

Phase D — Downstream Activation

settlement triggers

watchlist triggers

notification triggers

feature snapshot refresh triggers

\---

27\. Key Decisions Summary

Keep

official-source-first posture

config-driven game/state design

separated ingestion and public app runtime

admin visibility via BrewCommand

strong data pipeline discipline

Avoid

frontend-triggered live source scraping

hidden parser logic

unofficial-source dependency for core trust

game-specific table sprawl

notification triggers from unvalidated payloads

Enhance

parser adapter design

freshness model

correction handling

BrewTruth ingestion governance

staging fixture coverage

\---

28\. Follow-On Spec Dependencies

This ingestion spec directly informs:

BREWLOTTO\_V1\_PREDICTION\_ENGINE\_SPEC.md

BREWLOTTO\_V1\_TESTING\_AND\_SUCCESS\_OUTCOMES.md

BREWLOTTO\_V1\_ADMIN\_AND\_BREWCOMMAND\_SCOPE.md

BREWLOTTO\_V1\_UI\_UX\_ARCHITECTURE.md

\---

29\. BrewDocs Summary

What this doc does: Defines how BrewLotto V1 should acquire, normalize, validate, store, monitor, and operationalize official lottery draw data for NC \+ CA.

What it prevents: Stale-data trust failures, parser sprawl, duplicate draws, fragile retries, and downstream systems acting on unverified data.

What it enables: A trustworthy data foundation for predictions, settlement, notifications, BrewTruth audits, and future multi-state expansion.

# Prediction Engine

\<\!--  
/brewexec/brewdocs/BREWLOTTO\_V1\_PREDICTION\_ENGINE\_SPEC.md  
Timestamp: 2026-03-16 ET  
Phase: V1 Reset / Prediction Engine  
Purpose: Defines the deterministic prediction engine, strategy library, scoring system, HRM reasoning layer, BrewTruth validation, and pick generation flow for BrewLotto V1.  
\--\>

\# BrewLotto AI — V1 Prediction Engine Spec

\#\# 1\. Document Purpose

This document defines how BrewLotto generates lottery insights and recommended picks using deterministic statistical strategies combined with optional AI-assisted explanation layers.

It covers:

\* deterministic strategy engine  
\* strategy library for V1  
\* ensemble scoring  
\* pick generation  
\* HRM reasoning layer  
\* premium vs free feature gating  
\* explanation pipeline  
\* BrewTruth validation  
\* model logging  
\* performance benchmarking

The goal is to produce \*\*consistent, explainable, and auditable pick recommendations\*\*.

\---

\# 2\. Core Philosophy

BrewLotto predictions follow three principles.

\#\#\# Deterministic First

Statistical strategies generate picks.

\#\#\# AI Assisted

AI explains or summarizes insights.

\#\#\# BrewTruth Governed

Every pick passes validation rules before delivery.

This ensures stability even if AI providers fail.

\---

\# 3\. Prediction Engine Architecture

Prediction flow occurs after a new draw ingestion or when a user requests picks.

\#\# Pipeline Overview

1\. draw data loaded  
2\. historical window prepared  
3\. strategy modules executed  
4\. feature vectors created  
5\. ensemble scoring calculated  
6\. candidate picks generated  
7\. BrewTruth validation  
8\. explanations generated  
9\. results stored  
10\. results delivered to UI

\---

\# 4\. Strategy Library (V1)

Strategies are modular and executed independently.

\#\# 4.1 Frequency (Hot Numbers)

Measures frequency of numbers over a rolling window.

Typical windows:

\* last 30 draws  
\* last 50 draws  
\* last 100 draws

Output:

hotness\_score per number.

\---

\#\# 4.2 Cold Number Tracker

Identifies numbers not drawn recently.

Metrics:

\* draw gap length  
\* overdue index

Purpose:

Highlight numbers statistically underrepresented.

\---

\#\# 4.3 Momentum Tracker

Measures rising frequency across recent windows.

Example:

\* 5 draw window  
\* 10 draw window

Momentum numbers receive positive weighting.

\---

\#\# 4.4 Sum Range Analysis

Tracks typical sum ranges for draws.

Example Pick 3:

Sum range: 9–19

Predictions should favor historically common ranges.

\---

\#\# 4.5 Mirror Numbers

Digit reflection strategy.

Example mapping:

0 ↔ 5  
1 ↔ 6  
2 ↔ 7  
3 ↔ 8  
4 ↔ 9

If number appears frequently, its mirror receives a small probability boost.

\---

\#\# 4.6 Positional Frequency (Pick Games)

Tracks number frequency by position.

Example Pick 3:

Position 1 frequency  
Position 2 frequency  
Position 3 frequency

Used for structured pick generation.

\---

\#\# 4.7 Entropy / Randomness Index

Measures distribution randomness.

Helps avoid picks that are overly clustered or repetitive.

\---

\# 5\. Feature Vector Construction

Strategy outputs are converted into a numeric feature vector.

Example features:

\* hot\_score  
\* cold\_gap  
\* momentum\_score  
\* mirror\_weight  
\* position\_frequency  
\* entropy\_penalty

These features become inputs for the ensemble scoring layer.

\---

\# 6\. Ensemble Scoring System

Each strategy contributes weighted signals.

Example scoring model:

Final Score \=

0.30 hot frequency

\* 0.20 momentum

\* 0.20 positional strength

\* 0.15 cold recovery

\* 0.10 mirror influence

\- 0.05 entropy penalty

Weights may be tuned later through benchmarking.

\---

\# 7\. Candidate Pick Generation

After scoring numbers, picks are assembled.

\#\# Pick 3 / Pick 4

Steps:

1\. rank numbers by score  
2\. apply positional constraints  
3\. generate top combinations  
4\. remove duplicates

Output example:

5 candidate picks.

\---

\#\# Cash 5 / Pick 5

Steps:

1\. select top weighted numbers  
2\. enforce spread diversity  
3\. generate combinations

\---

\#\# Mega Millions / Powerball

Separate selection pools:

\* main numbers  
\* bonus ball

Bonus ball uses separate frequency/momentum analysis.

\---

\# 8\. Confidence Score

Each pick receives a confidence band.

Example bands:

\* Low  
\* Moderate  
\* Strong

Confidence uses:

\* ensemble score  
\* historical backtest hit rate  
\* entropy distribution

\---

\# 9\. HRM Reasoning Layer

HRM (Hierarchical Reasoning Model) provides interpretation.

Roles:

\#\#\# Analyst

Summarizes strategy signals.

\#\#\# Critic

Checks picks for anomalies.

\#\#\# Narrator

Creates user-facing explanations.

These roles are lightweight reasoning passes.

\---

\# 10\. BrewTruth Validation

Before any pick is delivered:

Validation checks include:

\* numbers within allowed range  
\* no invalid duplication  
\* correct digit counts  
\* sum range plausibility

If a pick fails validation:

It is discarded.

\---

\# 11\. Explanation Pipeline

Explanation generation is optional.

Steps:

1\. structured explanation created  
2\. AI model converts to readable summary

Example explanation:

"This pick favors numbers with rising momentum over the last 10 draws and balances hot and cold signals."

\---

\# 12\. Free vs Premium Logic

\#\# Free Tier

\* limited picks  
\* basic explanation

\#\# Premium Tier

\* more picks  
\* deeper strategy commentary  
\* confidence bands  
\* trend insights

\---

\# 13\. Prediction Logging

Every prediction run is stored.

Logged data includes:

\* strategies used  
\* weights  
\* candidate picks  
\* final picks  
\* explanation text

This allows performance tracking.

\---

\# 14\. Benchmarking

Engine performance must be measured.

Metrics:

\* hit rate  
\* partial match rate  
\* average confidence accuracy

Benchmark windows:

\* 30 draws  
\* 90 draws  
\* 1 year

\---

\# 15\. Future ML Integration

Machine learning may later assist with:

\* weight optimization  
\* anomaly detection  
\* pick diversity

ML will not replace deterministic strategies in V1.

\---

\# 16\. Success Criteria

Prediction engine is successful if:

\* picks are reproducible  
\* strategies are explainable  
\* confidence scores correlate with outcomes  
\* BrewTruth validations pass consistently

\---

\# 17\. Next Dependencies

Next documents:

BREWLOTTO\_V1\_TESTING\_AND\_SUCCESS\_OUTCOMES.md

BREWLOTTO\_V1\_UI\_UX\_ARCHITECTURE.md

BREWLOTTO\_V1\_ADMIN\_AND\_BREWCOMMAND\_SCOPE.md

These will define testing frameworks, frontend structure, and admin visibility.

\---

\# 18\. BrewDocs Summary

This document defines how BrewLotto V1 generates, scores, validates, and explains pick recommendations using deterministic strategies combined with AI-assisted commentary.

# Compliance & Trust

\<\!--  
/brewexec/brewdocs/BREWLOTTO\_V1\_COMPLIANCE\_AND\_TRUST.md  
Timestamp: 2026-03-16 ET  
Phase: V1 Reset / Compliance & Trust Layer  
Purpose: Define legal, ethical, platform integrity, and responsible‑use policies for BrewLotto V1 to ensure regulatory safety, transparency, and user trust.  
\--\>

\# BrewLotto AI — V1 Compliance & Trust Framework

\#\# 1\. Purpose

This document defines the compliance, transparency, and responsible‑gaming framework for BrewLotto.

BrewLotto must operate as a \*\*lottery intelligence and education platform\*\*, not as a gambling operator.

The trust framework ensures:

• regulatory safety  
• responsible user messaging  
• transparent prediction behavior  
• user data protection  
• platform integrity

This layer is referred to internally as \*\*BrewTrust\*\*.

\---

\# 2\. Core Compliance Principles

BrewLotto follows five platform principles.

\#\#\# Transparency

Predictions must be explainable and clearly labeled as statistical insights.

\#\#\# Responsibility

The platform must discourage excessive or harmful play.

\#\#\# Accuracy

Official draw data must be sourced and verified before use.

\#\#\# Privacy

User data must be protected and minimized.

\#\#\# Integrity

The system must avoid deceptive or misleading claims.

\---

\# 3\. Platform Positioning

BrewLotto is:

• a \*\*lottery data analytics platform\*\*  
• a \*\*probability education tool\*\*  
• a \*\*prediction research engine\*\*

BrewLotto is \*\*not\*\*:

• a lottery operator  
• a betting intermediary  
• a gambling service

Users purchase \*\*data insights and prediction analytics\*\*, not lottery tickets.

\---

\# 4\. Responsible Gaming Framework

\#\# 4.1 Responsible Messaging

The UI must periodically remind users:

• lottery outcomes are random  
• predictions are not guarantees  
• users should play responsibly

Example message:

"BrewLotto provides statistical insights based on historical data. Lottery outcomes remain random. Please play responsibly."

\---

\#\# 4.2 Spending Awareness

Future features may include:

• user play tracking  
• voluntary spending caps  
• reminder notifications

\---

\#\# 4.3 Self‑Control Tools

Potential V2 additions:

• cooldown timers  
• play‑frequency reminders  
• optional self‑limits

\---

\# 5\. Prediction Transparency

All predictions must clearly indicate:

• they are algorithmic  
• they rely on historical patterns  
• they cannot guarantee results

Each prediction explanation should state:

"Generated using BrewLotto statistical strategy models."

\---

\# 6\. BrewTruth Verification Layer

BrewTruth governs platform trust.

Responsibilities:

• verify ingestion data  
• validate prediction outputs  
• log decision traces  
• prevent misleading claims

All major operations generate \*\*BrewTruth audit logs\*\*.

\---

\# 7\. Data Integrity

Draw results must come from trusted sources.

Sources include:

• official state lottery sites  
• verified lottery APIs

Backups may be used only if the official source is unavailable.

All ingested draws pass validation rules before persistence.

\---

\# 8\. AI Usage Policy

AI models may be used only for:

• explanation generation  
• summarization  
• commentary

AI must \*\*not\*\* fabricate draw data or outcomes.

Predictions must originate from deterministic statistical models.

\---

\# 9\. Privacy & Data Protection

User data should be minimal and protected.

\#\#\# Stored data

• account email  
• subscription status  
• saved picks  
• preferences

Sensitive data should never include:

• banking credentials  
• government identification

Authentication should follow modern security practices.

\---

\# 10\. Fraud Prevention

The system should monitor:

• abnormal prediction request patterns  
• API abuse  
• scraping attempts

Admin dashboards should surface anomalies.

\---

\# 11\. Platform Disclaimers

The product must display disclaimers clearly.

Required disclaimer example:

"BrewLotto provides statistical analysis of lottery data for entertainment and educational purposes only. Lottery games are random and no prediction can guarantee winning numbers."

\---

\# 12\. User Education

BrewLotto should educate users about:

• probability  
• expected value  
• randomness  
• lottery myths

This can be delivered through \*\*BrewUniversity Lite\*\*.

\---

\# 13\. Audit & Logging

All critical operations generate audit logs.

Logged events include:

• draw ingestion  
• prediction generation  
• strategy scoring  
• BrewTruth validation  
• AI explanation generation

These logs support transparency and debugging.

\---

\# 14\. Compliance Expansion

Future regulatory considerations may include:

• jurisdiction review  
• advertising restrictions  
• age‑related usage policies

The system should remain flexible to accommodate evolving regulations.

\---

\# 15\. Success Criteria

The trust framework is successful when:

• users understand prediction limitations  
• draw data remains reliable  
• system behavior is explainable  
• audit logs support transparency

\---

\# 16\. BrewDocs Summary

This document defines the ethical, legal, and trust foundation of BrewLotto.

It ensures the platform delivers lottery analytics responsibly while protecting user trust and platform integrity.

# Pricing & Billing

# **BrewLotto V1 Pricing & Billing Specification**

## **1\. Objective**

Define a sustainable monetization model that:

• keeps the app accessible for casual users  
• funds AI compute and infrastructure  
• rewards power users with deeper analytics

The pricing system must be simple for launch and scalable for later expansion.

Primary payment provider for V1:

**Stripe Billing**

Reasons:

• subscription-first platform  
• strong API ecosystem  
• webhook-based lifecycle events  
• easy mobile and web support

---

# **2\. Pricing Philosophy**

BrewLotto monetizes **analytics and insights**, not gambling.

Users pay for:

• prediction intelligence  
• statistical analysis tools  
• advanced strategies  
• deeper historical insights

Not for:

• lottery tickets  
• betting access

---

# **3\. Subscription Tiers**

## **Tier 0 — Free Explorer**

Purpose:

Allow users to experience BrewLotto before upgrading.

Features:

• limited daily predictions  
• basic hot/cold analysis  
• limited explanation text  
• limited prediction history

Limits:

• 2 prediction runs per day

---

## **Tier 1 — BrewStarter**

Suggested price:

$4.99 / month

Features:

• unlimited basic predictions  
• strategy explanations  
• expanded prediction history  
• saved pick tracking

---

## **Tier 2 — BrewPro**

Suggested price:

$9.99 / month

Features:

• advanced strategy scoring  
• momentum insights  
• confidence bands  
• prediction comparisons  
• notifications for hot numbers

---

## **Tier 3 — BrewMaster**

Suggested price:

$19.99 / month

Features:

• advanced analytics dashboard  
• extended draw history analysis  
• early access to new strategies  
• deeper AI explanations

---

# **4\. Entitlements Model**

Each tier unlocks specific capabilities.

Example entitlement flags:

can\_generate\_predictions  
can\_view\_advanced\_strategies  
can\_access\_prediction\_history  
can\_receive\_notifications

Entitlements should be cached locally for performance.

---

# **5\. Stripe Integration**

Stripe will manage:

• subscriptions  
• billing cycles  
• payment methods  
• failed payment recovery

Important events handled by webhooks:

• subscription\_created  
• subscription\_updated  
• invoice\_paid  
• invoice\_failed

---

# **6\. Subscription Lifecycle**

Typical flow:

1. user selects plan  
2. Stripe checkout opens  
3. subscription created  
4. webhook confirms payment  
5. entitlements activated

Cancellation flow:

• user cancels  
• access remains until billing cycle end

---

# **7\. Trial Strategy**

Optional launch feature:

• 7-day free trial

Trial converts automatically unless cancelled.

---

# **8\. Payment Security**

BrewLotto should **never store card data**.

Stripe handles all sensitive payment information.

---

# **9\. Revenue Metrics**

Important KPIs:

• monthly recurring revenue (MRR)  
• conversion rate  
• churn rate  
• lifetime value

These metrics should be tracked internally.

---

# **10\. BrewDocs Summary**

This document defines the subscription structure, payment integration, and monetization strategy for BrewLotto V1.

# Testing & Success Outcomes

\<\!--  
/brewexec/brewdocs/BREWLOTTO\_V1\_TESTING\_AND\_SUCCESS\_OUTCOMES.md  
Timestamp: 2026-03-16 ET  
Purpose: Define the testing framework, QA strategy, performance validation, and measurable success metrics for BrewLotto V1.  
\--\>BrewLotto V1 Testing & Success Outcomes

1\. Purpose

This document defines how BrewLotto V1 will be tested, validated, and measured for success before and after launch.

Testing ensures:

• platform stability  
• accurate data ingestion  
• reliable prediction generation  
• secure billing  
• strong user experience

The testing framework covers unit testing, integration testing, simulation testing, and production monitoring.

\---

2\. Testing Philosophy

BrewLotto follows three testing principles.

Deterministic Validation

Prediction engine outputs must be reproducible.

Data Integrity

Lottery draw data must always match official sources.

System Resilience

The platform must remain operational even if AI providers fail.

\---

3\. Unit Testing

Unit tests validate individual components.

Areas tested:

• strategy modules  
• scoring functions  
• prediction generators  
• API endpoints  
• entitlement checks

Example test cases:

Hot number scoring produces correct ranking.

Mirror number mapping behaves correctly.

Prediction generator produces valid combinations.

\---

4\. Integration Testing

Integration tests validate interaction between systems.

Components tested together:

• ingestion pipeline  
• database persistence  
• prediction engine  
• API responses  
• billing lifecycle

Example scenario:

1\. draw data ingested

2\. stored in database

3\. prediction engine runs

4\. results returned to API

\---

5\. Simulation Testing

Simulation testing replays historical draws.

Purpose:

Measure prediction performance against known outcomes.

Testing windows:

• last 30 draws  
• last 90 draws  
• last 1 year

Metrics measured:

• hit rate  
• partial matches  
• prediction diversity

\---

6\. Ingestion Reliability Testing

The ingestion pipeline must be tested for:

• source availability  
• parser reliability  
• duplicate prevention  
• correction handling

Expected result:

Ingestion success rate above 99%.

\---

7\. Billing Testing

Stripe integration must be tested using sandbox mode.

Test cases:

• subscription creation  
• trial activation  
• payment success  
• payment failure  
• cancellation handling

\---

8\. Performance Testing

System must handle concurrent users.

Key targets:

Prediction request response time under 500ms.

Dashboard loading under 2 seconds.

API uptime target:

99.9% availability.

\---

9\. Security Testing

Security testing should validate:

• authentication protection  
• API rate limiting  
• SQL injection prevention  
• webhook verification

\---

10\. BrewTruth Verification

All critical system outputs must pass BrewTruth checks.

Validation areas:

• prediction structure  
• draw accuracy  
• AI explanation integrity

Failures must generate audit logs.

\---

11\. Launch Readiness Checklist

Before V1 launch:

• ingestion stable for 30 days  
• prediction engine benchmarked  
• billing tested  
• AI fallback verified  
• UI performance validated

\---

12\. Post‑Launch Monitoring

After launch, the system will track:

• system uptime  
• prediction request volume  
• conversion rates  
• churn rates

Alerts should trigger when anomalies occur.

\---

13\. Success Metrics

Success will be measured through key indicators.

Product success:

• prediction usage growth  
• subscription conversions  
• positive user feedback

Technical success:

• ingestion accuracy above 99%  
• stable API performance  
• low error rates

\---

14\. Continuous Improvement

Testing must continue after launch.

Future improvements may include:

• strategy tuning  
• ML-assisted optimization  
• additional state integrations

\---

15\. BrewDocs Summary

This document defines how BrewLotto V1 will be tested, validated, and monitored to ensure the platform operates reliably and delivers a high‑quality user experience.

# State Rollout Plan

\<\!--  
/brewexec/brewdocs/BREWLOTTO\_V1\_STATE\_ROLLOUT\_PLAN.md  
Timestamp: 2026-03-16 ET  
Purpose: Define the phased rollout plan for BrewLotto across U.S. lottery jurisdictions, beginning with NC and CA and expanding to additional states once V1 stability is achieved.  
\--\>

\# BrewLotto V1 State Rollout Plan

\#\# 1\. Objective

This document defines how BrewLotto expands from the initial launch states to full national coverage.

Goals:

• launch quickly with a limited set of states  
• validate ingestion reliability  
• verify prediction engine performance  
• ensure compliance and data accuracy  
• scale to additional states using a standardized adapter architecture

\---

\# 2\. Phase 1 — Initial Launch States

The first release of BrewLotto will support:

\*\*North Carolina Lottery\*\*  
\*\*California Lottery\*\*

Reasons:

• reliable public draw data  
• high player volume  
• manageable game catalogs

Supported games for V1:

North Carolina:

• Pick 3  
• Pick 4  
• Cash 5  
• Powerball  
• Mega Millions

California:

• Daily 3  
• Daily 4  
• Fantasy 5  
• Powerball  
• Mega Millions

\---

\# 3\. Data Adapter Architecture

Each state is integrated through a \*\*state adapter module\*\*.

Responsibilities:

• source endpoint configuration  
• parsing logic  
• draw normalization  
• game mapping

Adapter example:

\`\`\`  
state\_adapter\_nc.ts  
state\_adapter\_ca.ts  
\`\`\`

This architecture ensures new states can be added without modifying the core system.

\---

\# 4\. Draw Normalization

Lottery draw formats vary between states.

Normalization converts all draws into the BrewLotto schema.

Example normalized format:

\`\`\`  
{  
  state: "NC",  
  game: "Pick3",  
  draw\_date: "2026-03-16",  
  numbers: \[3,1,7\],  
  bonus: null  
}  
\`\`\`

This ensures the prediction engine operates on consistent data.

\---

\# 5\. Phase 2 — Expansion States

After launch stability is confirmed, additional states will be integrated.

Target expansion group:

• Texas  
• Florida  
• New York  
• Georgia

These states were selected due to:

• large lottery markets  
• accessible draw data

\---

\# 6\. Phase 3 — National Coverage

Once the ingestion framework is proven stable, BrewLotto can expand nationwide.

Remaining states will be integrated using the same adapter architecture.

Estimated timeline:

Phase 3 rollout within \*\*12 months of V1 launch\*\*.

\---

\# 7\. Multi-State Games

Certain games exist across multiple states.

Examples:

• Powerball  
• Mega Millions

These games use national draw results but must still map to each state's game catalog.

\---

\# 8\. Data Quality Assurance

Before enabling a new state:

Required checks include:

• ingestion reliability test  
• parser validation  
• draw comparison against official site

A state should only go live once accuracy exceeds \*\*99%\*\*.

\---

\# 9\. Compliance Considerations

Each state has unique regulatory environments.

BrewLotto must ensure:

• correct platform disclaimers  
• no ticket sales  
• analytics-only positioning

\---

\# 10\. Feature Rollout Strategy

New states may launch with limited features initially.

Example rollout stages:

Stage 1:

• draw history  
• basic prediction insights

Stage 2:

• advanced strategies  
• notifications

\---

\# 11\. Monitoring

After adding a new state, the system should monitor:

• ingestion errors  
• API request patterns  
• prediction engine load

\---

\# 12\. Success Criteria

The rollout strategy is successful if:

• ingestion reliability remains above 99%  
• prediction engine scales without degradation  
• new states integrate with minimal code changes

\---

\# 13\. BrewDocs Summary

This document defines the phased expansion plan that allows BrewLotto to grow from a two-state launch into a nationwide lottery analytics platform using a modular adapter architecture.

# UI Architecture w/ New Design

\<\!--  
/brewexec/brewdocs/BREWLOTTO\_V1\_UI\_UX\_ARCHITECTURE.md  
Timestamp: 2026-03-16 ET  
Purpose: Define the UI/UX structure, component hierarchy, interaction patterns, and design system for BrewLotto V1 based on the BrewVerse visual style and the new React frontend foundation.  
\--\>

\# BrewLotto V1 UI / UX Architecture

\#\# 1\. Purpose

This document defines the interface architecture for BrewLotto V1.

The goal is to create:

• a clean, premium lottery analytics dashboard  
• a mobile‑first experience  
• fast prediction access  
• strong visual clarity for statistical insights

The design language follows the \*\*BrewVerse aesthetic\*\*:

• dark UI  
• gold highlights  
• glowing interactive elements  
• minimal clutter

\---

\# 2\. Design Principles

\#\#\# Clarity

Users should instantly understand the most important numbers and insights.

\#\#\# Speed

Predictions must be accessible within one or two interactions.

\#\#\# Visual Hierarchy

Important insights (hot numbers, picks) should stand out visually.

\#\#\# Delight

Subtle animations and glow effects enhance the BrewVerse experience.

\---

\# 3\. Core Screens

BrewLotto V1 contains five main user screens.

\#\#\# 1\. Home Dashboard

Primary analytics screen.

Displays:

• hot numbers  
• cold numbers  
• momentum meter  
• prediction insights

\---

\#\#\# 2\. Pick Generator

Allows users to generate prediction sets.

Displays:

• generated picks  
• confidence rating  
• explanation text

\---

\#\#\# 3\. My Picks

Users can store and track picks.

Displays:

• saved predictions  
• historical outcomes

\---

\#\#\# 4\. Strategy Locker

Educational and advanced analysis screen.

Displays:

• strategy breakdowns  
• statistical explanations

\---

\#\#\# 5\. Account / Subscription

Displays:

• subscription status  
• billing settings  
• preferences

\---

\# 4\. Dashboard Layout

The home dashboard follows a \*\*card‑based layout\*\*.

Primary sections:

Header  
Game Tabs  
Insight Panels  
Prediction Card  
Voice Mode

\---

\# 5\. Header

Displays:

• BrewLotto logo  
• BrewVerse branding  
• user avatar

Optional future element:

• notification icon

\---

\# 6\. Game Tabs

Users can switch between games.

Example tabs:

• Pick 3  
• Pick 4  
• Cash 5  
• Powerball  
• Mega Millions

Tab switching updates dashboard insights instantly.

\---

\# 7\. Insight Panels

Two primary panels appear on the dashboard.

\#\#\# Hot Numbers Panel

Displays:

• frequently drawn numbers  
• glowing gold balls

\#\#\# Cold Numbers Panel

Displays:

• overdue numbers

\---

\# 8\. Momentum Meter

Vertical meter showing statistical trend strength.

Displayed as:

• glowing gradient bar

Represents \*\*prediction confidence momentum\*\*.

\---

\# 9\. Prediction Card

Displays BrewLotto analysis summary.

Includes:

• insight explanation  
• "Generate Smart Pick" button

When clicked:

Prediction results appear below.

\---

\# 10\. Ball Components

Lottery numbers are displayed as circular balls.

Visual properties:

• bold numbers  
• glowing borders  
• gradient backgrounds

Bonus balls use a different gradient.

\---

\# 11\. Voice Mode

Voice assistant button located in dashboard footer.

Future capability:

• BrewBot narrates insights  
• read predictions aloud

\---

\# 12\. Notification System

Users may receive alerts when:

• hot numbers appear  
• new draws are posted  
• predictions update

Notifications may appear:

• in‑app  
• push notifications

\---

\# 13\. Gamification

Gamification encourages engagement.

Users can earn:

• learning badges  
• prediction streaks  
• BrewUniversity progress

\---

\# 14\. Mobile Responsiveness

The UI must work across devices.

Layouts supported:

• mobile (primary)  
• tablet  
• desktop

Card stacking adapts automatically.

\---

\# 15\. Performance Goals

UI must feel fast.

Targets:

Dashboard load under \*\*2 seconds\*\*.

Prediction generation under \*\*500ms\*\*.

\---

\# 16\. Accessibility

UI should support:

• readable contrast  
• large touch targets  
• clear number displays

\---

\# 17\. Future UI Extensions

Potential V2 features:

• deeper analytics charts  
• advanced trend graphs  
• social sharing

\---

\# 18\. BrewDocs Summary

This document defines the visual and interaction architecture of BrewLotto V1, ensuring the application delivers a fast, elegant, and engaging analytics experience aligned with the BrewVerse design philosophy.

# Admin & BrewCommand

\<\!--  
/brewexec/brewdocs/BREWLOTTO\_V1\_ADMIN\_AND\_BREWCOMMAND\_SCOPE.md  
Timestamp: 2026-03-16 ET  
Purpose: Define the internal administration interface (BrewCommand) used to monitor, manage, and operate BrewLotto V1.  
\--\>BrewLotto V1 — Admin & BrewCommand Scope

1\. Purpose

BrewCommand is the internal operations console for BrewLotto.

It provides visibility into:

• system health  
• data ingestion pipelines  
• prediction engine activity  
• user subscriptions  
• BrewTruth audit events

BrewCommand is not part of the public user interface.

It is restricted to platform operators.

\---

2\. Admin Goals

BrewCommand must allow operators to:

• monitor ingestion pipelines  
• view draw history integrity  
• inspect prediction engine runs  
• monitor AI provider usage  
• manage feature flags

\---

3\. Admin Access

Access requires:

• authenticated admin account • role-based permissions

Roles may include:

Admin Analyst Support

\---

4\. Core Admin Modules

BrewCommand contains several internal dashboards.

\---

4.1 System Health Dashboard

Displays platform status.

Metrics include:

• API uptime  
• ingestion success rate  
• prediction engine throughput  
• AI provider latency

\---

4.2 Ingestion Monitor

Displays recent draw ingestion events.

Operators can view:

• latest draw records  
• ingestion timestamps  
• source endpoints  
• validation status

Failed ingestion events are highlighted.

\---

4.3 Prediction Engine Logs

Displays prediction activity.

Information includes:

• prediction requests  
• strategy scores  
• candidate picks  
• final picks

This allows debugging and auditing.

\---

4.4 BrewTruth Audit Logs

Displays platform trust logs.

Tracked events include:

• ingestion validation • prediction validation • AI explanation generation

Audit logs help maintain transparency.

\---

4.5 User & Subscription Management

Admins can view:

• active users  
• subscription tiers  
• billing status

This module is read-focused for V1.

\---

4.6 Feature Flags

Operators can toggle experimental features.

Example flags:

• enable\_new\_strategy • enable\_ai\_explanations • enable\_notifications

Feature flags allow safe experimentation.

\---

5\. Fraud & Abuse Monitoring

BrewCommand should surface unusual activity.

Examples:

• excessive prediction requests • scraping patterns • suspicious login attempts

\---

6\. Strategy Performance Monitoring

Operators can view strategy metrics.

Example insights:

• strategy hit rate • prediction diversity • scoring weight impact

This helps improve the engine.

\---

7\. AI Usage Monitoring

Tracks usage of AI providers.

Metrics include:

• token usage • request counts • latency • error rates

This ensures cost control.

\---

8\. Manual Controls

Admins may perform controlled operations.

Examples:

• rerun ingestion • trigger prediction recalculation • refresh strategy weights

These controls must generate audit logs.

\---

9\. Security Requirements

BrewCommand must include:

• secure authentication • audit logging • rate limiting

Access should be restricted to internal IP ranges where possible.

\---

10\. Future Admin Features

Potential V2 features:

• advanced analytics dashboards • automated anomaly detection • state onboarding tools

\---

11\. BrewDocs Summary

This document defines the operational console used to manage BrewLotto V1, providing visibility into system activity, ingestion pipelines, prediction logic, and platform trust auditing.

# Execution Build Phase

\<\!--  
/brewexec/brewdocs/BREWLOTTO\_V1\_EXECUTION\_BUILD\_PHASES.md  
Timestamp: 2026-03-16 ET  
Phase: V1 Reset / Execution Build Phases  
Purpose: Define the phased execution plan for BrewLotto V1 from code triage through launch stabilization, including explicit defer/deprecate decisions for non-V1 functionality.  
\--\>BrewLotto AI — V1 Execution Build Phases

1\. Document Purpose

This document converts the BrewLotto V1 architecture set into an execution plan.

It defines:

the order of build phases

what gets built in each phase

what must be deferred, deprecated, or archived

how to reduce V1 scope before implementation accelerates

what success looks like per phase

what should block the next phase and what should not

This is the operational roadmap for shipping BrewLotto V1.

\---

2\. Why a Code Reduction Phase Is Required

The uploaded BrewLotto materials show a codebase with public dashboard pieces, admin/ops-style dashboard pieces, AI-related endpoints, merge-report functionality, and multiple future-facing premium concepts. That means the current codebase likely contains useful foundations, but also some surface area that is too broad for a disciplined V1. fileciteturn3file2turn3file3

Because of that, V1 should begin with a deliberate reduction phase.

Decision

The defer/deprecate/remove analysis should be its own explicit execution phase, not just a side note.

That is the safest way to protect schedule, reduce architectural confusion, and avoid shipping half-supported features.

\---

3\. Execution Model Overview

BrewLotto V1 should be built in 9 phases:

1\. V1 Code Triage and Surface Reduction

2\. Foundation and Repo Alignment

3\. Data and Ingestion Core

4\. Prediction Engine Core

5\. Public Product Experience

6\. Billing, Entitlements, and Notifications

7\. BrewCommand Admin and BrewTruth Ops

8\. Full QA, Replay Testing, and Stabilization

9\. Launch Readiness and Post-Launch Hardening

\---

4\. Phase 0 — V1 Code Triage and Surface Reduction

Objective

Inventory the existing BrewLotto codebase, classify modules by V1 value, and remove non-essential surface area from the active launch path.

Why first

The uploaded tree shows both public and internal/dashboard-heavy modules mixed together, plus experimental API routes and future-facing concepts. fileciteturn3file2

Required tasks

inspect current routes, components, hooks, lib modules, and scripts

create CODE\_PRUNE\_BREWLOTTO\_V1.md

classify each major file/module as:

active-v1

move-to-admin

defer-v1\_5

deprecated

archive-experiment

identify duplicate routes or stale patterns

isolate admin-only modules from public dashboard code

identify any mock/demo logic that must not survive into live V1

tag non-V1 features for archive or defer

Strong recommendations from uploaded materials

The following should default to defer/archive unless already near-complete and clearly required:

Syndicate Mode fileciteturn3file3

VIP BrewBot voice-heavy experiences fileciteturn3file3

export tools and broader integrations unless needed immediately fileciteturn3file3

experimental routes like merge-report style tooling in the public app path fileciteturn3file2

admin diagnostics inside the customer dashboard path fileciteturn3file2

Deliverables

CODE\_PRUNE\_BREWLOTTO\_V1.md

route inventory

component inventory

keep/move/defer/archive decision log

Exit criteria

V1 scope is visibly smaller and clearer

admin/internal features are separated conceptually

no critical build work is still depending on ambiguous experimental modules

\---

5\. Phase 1 — Foundation and Repo Alignment

Objective

Reshape the repo toward the canonical V1 structure before feature work deepens.

Tasks

align folders to the repository structure spec

create public vs admin component separation

establish lib/ingestion, lib/prediction, lib/brewtruth, lib/billing, lib/notifications

ensure /brewexec/brewlotto/ is the active project root

clean README and root docs references

wire shared config and environment loading cleanly

Deliverables

clean repo skeleton

shared utility patterns

consistent route organization

basic CI/lint/test baseline

Exit criteria

folder structure matches intended ownership model

devs can find the right home for each module

no major ambiguity around public app vs admin app

\---

6\. Phase 2 — Data and Ingestion Core

Objective

Build the official-source-backed data pipeline for NC \+ CA.

Tasks

create states and lottery game catalog seed data

build source registry

build fetcher layer

implement NC adapters

implement CA adapters

implement parser normalization

implement validation rules

implement dedupe/idempotency

persist canonical draws

update freshness status

expose ingestion logs

Deliverables

live official draw ingestion for NC \+ CA

ingestion run logs

draw freshness tracking

backfill and retry flows

Exit criteria

draw history is reliably populating

duplicate rows are prevented

delayed or stale sources are visible in admin

\---

7\. Phase 3 — Prediction Engine Core

Objective

Implement the deterministic-first prediction engine and attach BrewTruth-safe explanation support.

Tasks

implement hot/cold strategy

implement overdue strategy

implement momentum strategy

implement positional analysis for pick games

implement sum/spread logic

implement mirror logic where applicable

implement ensemble scoring

implement candidate pick generation by game type

implement confidence bands

persist prediction requests and results

attach template explanation generation first

integrate AI explanation routing later in this phase or next phase

Deliverables

stable prediction engine for launch games

reproducible pick generation

stored prediction history

strategy scoring logs

Exit criteria

predictions are deterministic and valid

BrewTruth can validate output structures

engine can run without any external AI provider

\---

8\. Phase 4 — Public Product Experience

Objective

Build the customer-facing BrewLotto V1 experience around the new kiosk-style dashboard.

Tasks

implement dashboard shell from the new design direction

implement game tabs

implement hot/cold cards

implement momentum meter

implement prediction card and CTA flow

implement my picks

implement strategy locker / learning surfaces

implement account/settings pages

wire real APIs into the UI

remove any mock/demo production dependencies

Deliverables

functioning dashboard

per-game insight switching

user prediction flow

saved picks and play logging flows

Exit criteria

UI reflects real data

dashboard is responsive and stable

core value loop feels complete: view insights → generate pick → save/log → revisit

\---

9\. Phase 5 — Billing, Entitlements, and Notifications

Objective

Monetize the product cleanly and unlock feature gating.

Tasks

integrate Stripe checkout

implement webhook handlers

populate subscription tables

create entitlement snapshot updates

gate premium strategies and explanation depth by tier

implement in-app notifications

implement email notifications for key flows

implement usage and AI quota counters where required

Deliverables

pricing page connected to billing

subscription lifecycle support

feature gating in UI and APIs

launch notification categories

Exit criteria

paid tier upgrade path works end to end

premium features unlock correctly

free tier guardrails work cleanly

\---

10\. Phase 6 — BrewCommand Admin and BrewTruth Ops

Objective

Give operators enough visibility and control to keep V1 healthy.

Tasks

implement admin auth/RBAC

build system health dashboard

build ingestion monitor

build prediction audit viewer

build BrewTruth audit viewer

build feature flag manager

build AI usage monitoring

expose safe manual rerun controls

Deliverables

internal BrewCommand V1 console

operator-facing diagnostics

trust/audit visibility

Exit criteria

ops team can diagnose ingestion, prediction, and billing issues quickly

high-risk failures are visible before users report them

\---

11\. Phase 7 — Full QA, Replay Testing, and Stabilization

Objective

Harden the product through structured testing.

Tasks

unit tests for strategy and validation modules

integration tests for ingestion → prediction → persistence flows

replay testing against historical draws

billing sandbox testing

AI fallback testing

stale-data simulation

correction replay testing

notification trigger testing

load/performance checks

Deliverables

passing critical test suite

benchmark reports

launch risk register

Exit criteria

ingestion reliability and app performance meet thresholds

fallbacks work

no unresolved critical blockers remain for launch scope

\---

12\. Phase 8 — Launch Readiness and Post-Launch Hardening

Objective

Prepare the product for public release and controlled growth.

Tasks

final launch checklist

production secrets/config validation

monitoring/alert thresholds

support runbook

post-launch bug triage protocol

churn/conversion instrumentation

first-wave state expansion prep

Deliverables

launch checklist signoff

support and rollback procedures

first post-launch improvement queue

Exit criteria

product is operable, supportable, and measurable in production

\---

13\. Recommended V1 Defer List

These ideas are not bad. They are simply not launch-critical.

Defer to V1.5 or V2

Syndicate Mode fileciteturn3file3

daily autopick monetization add-on until the base engine is stable fileciteturn3file3

export-heavy reporting features (PDF/CSV) unless business-critical now fileciteturn3file3

deeper BrewVision dashboards for end users fileciteturn3file3

rich TTS/voice concierge paths beyond minimal voice placeholder support fileciteturn3file3

broad external integrations beyond the essentials fileciteturn3file3

Why defer them

They increase scope, QA burden, and user-path complexity without being necessary to prove V1 value.

\---

14\. Recommended V1 Keep List

These are the features that prove BrewLotto’s value fastest:

NC \+ CA draw ingestion

clean dashboard and game tabs

hot/cold/momentum insights

deterministic smart pick generation

basic and premium explanations

saved picks and play logging

pricing \+ Stripe checkout

notifications for launch scenarios

BrewTruth auditability

BrewCommand ops visibility

\---

15\. Recommended V1 Kill-Switch Logic

Certain features should be behind flags from day one:

AI premium explanations

premium comparison mode

voice mode

new strategy modules

state activation

notification categories

This lets the team launch without treating every feature as irreversible.

\---

16\. Phase Success Markers

Phase 0 success

Scope is reduced and codebase confusion drops.

Phase 1 success

Repo structure is clean and implementation-ready.

Phase 2 success

Official draw data is reliable.

Phase 3 success

Predictions are reproducible and valid.

Phase 4 success

Users can meaningfully use the product end to end.

Phase 5 success

Users can pay and unlock premium value.

Phase 6 success

Ops can see and control the system.

Phase 7 success

The system survives realistic test pressure.

Phase 8 success

The team can launch and support confidently.

\---

17\. What Should Be a Defined Phase?

You asked whether the defer/deprecate/remove work should live inside execution or be its own defined phase.

Recommendation

It should be its own defined phase.

Call it: Phase 0 — V1 Code Triage and Surface Reduction

That is the cleanest, safest, and most honest way to move forward.

\---

18\. BrewDocs Summary

What this doc does: Turns BrewLotto V1 architecture into an execution roadmap with explicit scope control.

What it prevents: Feature creep, wasted implementation effort, and trying to stabilize too many non-essential systems at once.

What it enables: A disciplined launch path from code triage through stable public release.

# Code Prune Ledger

# **BrewLotto AI — V1 Code Prune Ledger**

## **1\. Document Purpose**

This document is the working triage ledger for the current BrewLotto codebase.

It exists to:

* inventory routes, components, modules, and scripts  
* decide what stays in active V1 scope  
* identify what should move to admin-only scope  
* defer underdeveloped or non-essential features  
* deprecate or archive experiments that create noise  
* reduce plan and implementation weight before heavy build work continues

This is not a punishment document. It is a focus document.

---

## **2\. Triage Status Labels**

Every reviewed item should be assigned one primary status.

### **`active-v1`**

Required for NC \+ CA launch and clearly aligned to the approved V1 blueprint.

### **`move-to-admin`**

Useful, but belongs in BrewCommand/internal operations, not the public user experience.

### **`defer-v1_5`**

Good idea, but not required for launch stability.

### **`deprecated`**

Legacy, duplicated, misleading, or superseded by the new V1 architecture.

### **`archive-experiment`**

Interesting experimental work that should be preserved but removed from the active build path.

---

## **3\. Decision Rules**

### **Keep in active V1 only if the item directly supports:**

* NC \+ CA draw ingestion  
* canonical draw storage  
* deterministic prediction generation  
* dashboard insight rendering  
* saved picks / play logs  
* pricing / Stripe billing  
* notifications  
* BrewTruth auditing  
* BrewCommand V1 internal ops

### **Default to defer or archive when the item is:**

* underdefined  
* highly experimental  
* expensive to QA  
* not required for the first public launch  
* mixing internal diagnostics into the customer experience

### **Important rule**

Do not delete first. Classify first. Move or archive second. Remove only after replacement path is clear.

---

## **4\. Current Codebase Signals from Uploaded Materials**

The uploaded BrewLotto docs show a tree with App Router routes, prediction APIs, play-log APIs, audit-related endpoints, dashboard/admin-oriented components, and BrewBot/BrewCommentary style surfaces. It also shows early plans for keeping strategy logic compact at first and modularizing later. fileciteturn3file2turn3file4

The same uploaded notes also include future-facing premium concepts such as Syndicate Mode, VIP BrewBot voice experiences, export/reporting ideas, and external integrations. Those should not crowd the launch path unless already very mature and clearly required. fileciteturn3file3

This ledger is therefore built to support **deliberate reduction, not accidental loss**.

---

## **5\. Triage Ledger Template**

Use this template for each reviewed file/module/group.

\#\#\# Item  
\- Path:  
\- Type: route / api / component / hook / lib / script / page / admin  
\- Current purpose:  
\- Observed dependency risk:  
\- Recommended status:  
\- Recommended action:  
\- Target location (if moving):  
\- Notes:

---

## **6\. Initial Triage Recommendations from Uploaded Tree**

These are first-pass recommendations based on the uploaded code tree and spec direction. They should be confirmed during file-by-file review.

---

### **Item 001**

* Path: `/app/api/predict/*`  
* Type: api  
* Current purpose: prediction generation endpoints  
* Observed dependency risk: moderate if multiple fragmented endpoints exist  
* Recommended status: `active-v1`  
* Recommended action: consolidate toward one clear V1 prediction contract  
* Target location (if moving): remain under public API domain  
* Notes: keep, but reduce route fragmentation if older variants exist. fileciteturn4file2

### **Item 002**

* Path: `/app/api/stats/[game]/route.ts`  
* Type: api  
* Current purpose: serve game-level stats and insight data  
* Observed dependency risk: low to moderate depending on response contract quality  
* Recommended status: `active-v1`  
* Recommended action: align to dashboard insight model for hot/cold/momentum  
* Target location (if moving): remain under public API domain  
* Notes: this is already central to the older live-data design. fileciteturn4file0turn4file2

### **Item 003**

* Path: `/app/api/play/log/route.ts`  
* Type: api  
* Current purpose: user play logging  
* Observed dependency risk: low  
* Recommended status: `active-v1`  
* Recommended action: keep and align to canonical `play_logs` schema  
* Target location (if moving): remain under public API domain  
* Notes: directly supports V1 user value and was part of the original data flow. fileciteturn4file0turn4file2

### **Item 004**

* Path: `/app/api/audit/route.ts`  
* Type: api  
* Current purpose: audit visibility or data verification endpoint  
* Observed dependency risk: moderate if exposed in public path without admin controls  
* Recommended status: `move-to-admin`  
* Recommended action: keep only as internal BrewCommand/BrewTruth support route  
* Target location (if moving): `/app/api/admin/audit/route.ts`  
* Notes: operationally useful, but not part of the public customer value loop. fileciteturn4file2

### **Item 005**

* Path: `/app/api/brew-ai/route.ts`  
* Type: api  
* Current purpose: broad or experimental AI runtime endpoint  
* Observed dependency risk: high if loosely defined or over-scoped  
* Recommended status: `archive-experiment`  
* Recommended action: isolate unless a V1-approved responsibility is proven  
* Target location (if moving): `archive/experiments/api-brew-ai/`  
* Notes: V1 AI routing should follow the approved routing spec, not a vague umbrella route. fileciteturn4file2

### **Item 006**

* Path: `/app/api/generate-merge-report/route.ts`  
* Type: api  
* Current purpose: experimental/ops/reporting functionality  
* Observed dependency risk: high relative to public V1 value  
* Recommended status: `archive-experiment`  
* Recommended action: remove from the active public path  
* Target location (if moving): `archive/experiments/generate-merge-report/`  
* Notes: not part of the V1 product contract. fileciteturn4file2

### **Item 007**

* Path: `/app/pick3/page.tsx`, `/app/pick4/page.tsx`, `/app/pick5/page.tsx`, `/app/powerball/page.tsx`, `/app/mega/page.tsx`  
* Type: pages  
* Current purpose: per-game product views  
* Observed dependency risk: moderate if each page duplicates logic instead of using shared config  
* Recommended status: `active-v1`  
* Recommended action: keep game access, but refactor toward shared dashboard/game config architecture  
* Target location (if moving): potentially consolidate into config-driven dashboard/game routes  
* Notes: aligned to launch scope, but avoid duplicated page logic. fileciteturn4file2turn4file3

### **Item 008**

* Path: `/app/dashboard/page.tsx`  
* Type: page  
* Current purpose: main user dashboard  
* Observed dependency risk: high if mixed with admin diagnostics  
* Recommended status: `active-v1`  
* Recommended action: keep as customer dashboard only  
* Target location (if moving): remain public dashboard surface  
* Notes: this should become the kiosk-style V1 hub. fileciteturn4file2

### **Item 009**

* Path: `/components/predict/PredictionCard.jsx`  
* Type: component  
* Current purpose: display prediction output  
* Observed dependency risk: low  
* Recommended status: `active-v1`  
* Recommended action: preserve and refactor into the new design system if needed  
* Target location (if moving): `components/brewlotto/prediction/PredictionCard.tsx`  
* Notes: core user value component. fileciteturn4file2turn4file3

### **Item 010**

* Path: `/components/predict/PredictionInsights.jsx`  
* Type: component  
* Current purpose: Brew commentary / prediction explanation display  
* Observed dependency risk: low to moderate depending on AI coupling  
* Recommended status: `active-v1`  
* Recommended action: keep, but anchor explanations to deterministic evidence first  
* Target location (if moving): `components/brewlotto/prediction/PredictionInsights.tsx`  
* Notes: matches V1 explanation goals. fileciteturn4file2turn4file3

### **Item 011**

* Path: `/components/predict/GameIntroCard.jsx`  
* Type: component  
* Current purpose: show odds, variants, or game intro details  
* Observed dependency risk: low  
* Recommended status: `active-v1`  
* Recommended action: keep as part of education \+ onboarding per game  
* Target location (if moving): `components/brewlotto/dashboard/GameIntroCard.tsx`  
* Notes: supports trust and education positioning. fileciteturn4file2turn4file3

### **Item 012**

* Path: `/components/predict/PredictionStrategyToggle.jsx`  
* Type: component  
* Current purpose: tier-aware or mode-aware strategy switching  
* Observed dependency risk: moderate if tied to too many unfinished strategies  
* Recommended status: `active-v1`  
* Recommended action: keep only if options are mapped to approved launch strategies  
* Target location (if moving): `components/brewlotto/prediction/PredictionStrategyToggle.tsx`  
* Notes: good V1 fit if simplified. fileciteturn4file2turn4file3

### **Item 013**

* Path: `/components/predict/StrategyExplainModal.jsx`  
* Type: component  
* Current purpose: explain strategy choices to user  
* Observed dependency risk: low  
* Recommended status: `active-v1`  
* Recommended action: keep and align to BrewUniversity Lite / strategy glossary  
* Target location (if moving): `components/brewlotto/prediction/StrategyExplainModal.tsx`  
* Notes: this is a trust-positive feature. fileciteturn4file2

### **Item 014**

* Path: `/components/dashboard/PredictionFeed.jsx`  
* Type: component  
* Current purpose: dashboard stream of prediction results  
* Observed dependency risk: low to moderate  
* Recommended status: `active-v1`  
* Recommended action: keep if tied to user picks or recent predictions  
* Target location (if moving): `components/brewlotto/dashboard/PredictionFeed.tsx`  
* Notes: useful if user-centric, not admin-centric. fileciteturn4file2

### **Item 015**

* Path: `/components/dashboard/UploadZone.jsx`  
* Type: component  
* Current purpose: upload/import/admin utility  
* Observed dependency risk: moderate  
* Recommended status: `move-to-admin`  
* Recommended action: keep only for manual backfill or diagnostics  
* Target location (if moving): `components/admin/UploadZone.tsx`  
* Notes: not public V1 value. fileciteturn4file2

### **Item 016**

* Path: `/components/dashboard/RefreshTrigger.jsx`  
* Type: component  
* Current purpose: trigger refresh or internal update jobs  
* Observed dependency risk: moderate if used as manual operational control in public UI  
* Recommended status: `move-to-admin`  
* Recommended action: convert into internal admin control or eliminate if redundant  
* Target location (if moving): `components/admin/RefreshTrigger.tsx`  
* Notes: customer dashboard should not expose ops-style controls. fileciteturn4file2

### **Item 017**

* Path: `/components/dashboard/AuditViewer.jsx`  
* Type: component  
* Current purpose: audit or internal diagnostics viewer  
* Observed dependency risk: moderate if leaked into public UI path  
* Recommended status: `move-to-admin`  
* Recommended action: move under BrewCommand scope  
* Target location (if moving): `components/admin/BrewTruthAuditViewer.tsx`  
* Notes: useful, but internal. fileciteturn4file0turn4file2

### **Item 018**

* Path: `/components/dashboard/DrawHealthMonitor.jsx`  
* Type: component  
* Current purpose: ingestion/draw system health visibility  
* Observed dependency risk: low if isolated to admin  
* Recommended status: `move-to-admin`  
* Recommended action: move into admin ingestion monitor suite  
* Target location (if moving): `components/admin/IngestionMonitor.tsx`  
* Notes: not a public dashboard component for V1. fileciteturn4file0turn4file2

### **Item 019**

* Path: `/components/dashboard/AdminHubLayout.jsx`  
* Type: component/layout  
* Current purpose: internal operations layout  
* Observed dependency risk: low  
* Recommended status: `move-to-admin`  
* Recommended action: keep only if aligned to BrewCommand V1 shell  
* Target location (if moving): `/app/admin/*`  
* Notes: useful if simplified. fileciteturn4file0turn4file2

### **Item 020**

* Path: `/components/dashboard/GameStrategySelector.jsx`  
* Type: component  
* Current purpose: game/strategy selection UX  
* Observed dependency risk: moderate if overloaded with too many strategy choices  
* Recommended status: `active-v1`  
* Recommended action: keep if mapped to approved strategy set and dashboard flow  
* Target location (if moving): `components/brewlotto/dashboard/GameStrategySelector.tsx`  
* Notes: good if simplified to launch-approved options only. fileciteturn4file2

### **Item 021**

* Path: `/components/context/BrewBotContext.jsx`  
* Type: context  
* Current purpose: bot/voice/commentary shared state  
* Observed dependency risk: moderate if it becomes a hidden app dependency  
* Recommended status: `defer-v1_5`  
* Recommended action: reduce to a minimal voice placeholder context only if needed  
* Target location (if moving): `archive/deferred-v2/` or slimmed public context  
* Notes: keep voice minimal in V1. fileciteturn4file2

### **Item 022**

* Path: `/components/ui/BrewLottoBot.jsx`, `/components/ui/BrewAvatar.jsx`, `/components/ui/BrewCommentaryEngine.*`  
* Type: UI/AI component group  
* Current purpose: conversational or commentary-driven UX  
* Observed dependency risk: high if public V1 depends on voice/chat depth  
* Recommended status: split  
* Recommended action: keep only lightweight commentary hooks; defer richer voice/chat flows  
* Target location (if moving): public lightweight explanation UI \+ `archive/deferred-v2/voice/`  
* Notes: useful brand layer, but should not delay launch. fileciteturn4file2turn4file3

### **Item 023**

* Path: older per-game draw tables like `pick3_draws`, `pick4_draws`, `pick5_draws`, `mega_draws`, `powerball_draws`  
* Type: data model / schema concept  
* Current purpose: early storage for draw history  
* Observed dependency risk: high if it blocks multi-state normalization  
* Recommended status: `deprecated`  
* Recommended action: migrate conceptually to unified `official_draws` model  
* Target location (if moving): legacy migration reference only  
* Notes: useful for MVP velocity, not for the new V1 DB architecture. fileciteturn4file4

### **Item 024**

* Path: scripts like `/scripts/saveNC.js`, `/scripts/upload/csvUtils.js`, `/scripts/auditTables.js`, `/scripts/drawHistoryAudit.js`  
* Type: scripts  
* Current purpose: ingestion, upload, and audit operations  
* Observed dependency risk: low to moderate depending on quality and coupling  
* Recommended status: `active-v1` (selectively)  
* Recommended action: preserve the useful ingestion/audit logic, but refactor into the new ingestion domain where practical  
* Target location (if moving): `/scripts/` \+ `lib/ingestion/`  
* Notes: these are valuable bridges during Phase 2\. fileciteturn4file0turn4file4

### **Item 025**

* Path: Syndicate Mode concept  
* Type: feature concept  
* Current purpose: group/shared play experience  
* Observed dependency risk: high scope \+ QA burden  
* Recommended status: `defer-v1_5`  
* Recommended action: move to post-launch roadmap  
* Target location (if moving): deferred backlog  
* Notes: good future feature, not launch-critical. fileciteturn3file3

### **Item 026**

* Path: VIP BrewBot voice experiences  
* Type: feature concept  
* Current purpose: premium voice/narration/chat experience  
* Observed dependency risk: high runtime complexity \+ support burden  
* Recommended status: `defer-v1_5`  
* Recommended action: keep voice placeholder only in V1  
* Target location (if moving): deferred backlog  
* Notes: do not let this delay core product value. fileciteturn3file3

### **Item 027**

* Path: export/reporting suite (PDF/CSV style concepts)  
* Type: feature concept  
* Current purpose: export user insights/reports  
* Observed dependency risk: moderate  
* Recommended status: `defer-v1_5`  
* Recommended action: postpone unless urgently required by monetization or support  
* Target location (if moving): deferred backlog  
* Notes: nice-to-have, not required for stable launch. fileciteturn3file3

### **Item 028**

* Path: deeper BrewVision-style end-user analytics dashboards  
* Type: feature concept  
* Current purpose: advanced visual analytics  
* Observed dependency risk: high UX \+ data complexity  
* Recommended status: `defer-v1_5`  
* Recommended action: keep public dashboard lean in V1  
* Target location (if moving): deferred backlog  
* Notes: avoid overbuilding the public surface. fileciteturn3file3

### **Item 029**

* Path: daily autopick monetization add-on  
* Type: feature concept  
* Current purpose: recurring automated pick delivery  
* Observed dependency risk: high trust/compliance/product complexity  
* Recommended status: `defer-v1_5`  
* Recommended action: revisit after base engine, billing, and trust layer prove stable  
* Target location (if moving): deferred backlog  
* Notes: do not add before core V1 maturity. fileciteturn3file3

## **7\. Route-Level Triage Checklist**

For every route under `/app/` or `/app/api/`, verify:

* is it part of the approved V1 user journey?  
* is it internal/admin only?  
* does it rely on mocks or unofficial data?  
* does it duplicate another endpoint?  
* does it belong in public product, admin, or archive?

---

## **8\. Component-Level Triage Checklist**

For every component group, verify:

* is it public UI or admin UI?  
* is it used by the new kiosk-style experience?  
* does it reflect the current V1 visual direction?  
* is it tied to deferred features?  
* should it move, stay, or be archived?

---

## **9\. Library-Level Triage Checklist**

For every lib module, verify:

* does it support ingestion, prediction, billing, notifications, BrewTruth, or admin?  
* is it deterministic-first?  
* is it coupled to old route structures?  
* can it remain transitional, or must it be refactored now?

---

## **10\. Archive Rules**

When moving something out of active V1:

* preserve filename history where possible  
* place into a clear archive folder  
* add a small note explaining why it moved  
* link replacement or future phase if known

### **Suggested archive buckets**

* `archive/deferred-v2/`  
* `archive/deprecated/`  
* `archive/experiments/`

---

## **11\. Live Inventory Pass — Additional Legacy Audit from Uploaded Docs**

The uploaded documentation also preserves an older Pages Router-era audit with `/pages`, `/utils`, and `/scripts` inventory. Even though the V1 reset is now App Router-based, that older inventory is still useful for identifying transitional assets, missing logic, and legacy paths that should not quietly remain in production. fileciteturn5file3turn5file4

### **Legacy Item 030**

* Path: `/pages/api/stats/[game].js`  
* Type: legacy api  
* Current purpose: all-in-one stats endpoint per game in older structure  
* Observed dependency risk: moderate if still partially powering production  
* Recommended status: `deprecated`  
* Recommended action: replace with App Router stats route contracts and retire the old path  
* Target location (if moving): replacement is `/app/api/stats/[game]/route.ts`  
* Notes: older audit marked this as missing and required, but V1 should not revive Pages Router structure. fileciteturn5file3turn5file4

### **Legacy Item 031**

* Path: `/pages/api/predict/[game].js`  
* Type: legacy api  
* Current purpose: all-in-one prediction endpoint per game in older structure  
* Observed dependency risk: moderate if old code survives beside App Router predict routes  
* Recommended status: `deprecated`  
* Recommended action: keep one canonical App Router prediction contract only  
* Target location (if moving): replacement is `/app/api/predict/*`  
* Notes: do not maintain both routing paradigms for V1. fileciteturn5file3turn5file4

### **Legacy Item 032**

* Path: `/utils/predictNumbers.js`  
* Type: util  
* Current purpose: unified smartPick helper across games  
* Observed dependency risk: low to moderate depending on implementation quality  
* Recommended status: `active-v1` (transitional)  
* Recommended action: preserve concept, but move into `lib/prediction/engine.ts` or `lib/prediction/generators/`  
* Target location (if moving): `lib/prediction/`  
* Notes: older audit flagged this as missing, which reinforces the need for a single canonical prediction engine entry point. fileciteturn5file3

### **Legacy Item 033**

* Path: `/utils/poissonHotCold.js`  
* Type: util  
* Current purpose: Poisson-based hot/cold support  
* Observed dependency risk: low  
* Recommended status: `active-v1`  
* Recommended action: keep as a strategy helper if still relevant and testable  
* Target location (if moving): `lib/prediction/strategies/poissonHotCold.ts`  
* Notes: this aligns with your earlier BrewLotto strategy direction. fileciteturn5file2turn5file3

### **Legacy Item 034**

* Path: `/utils/analyzePick3.js`, `/utils/analyzePick4.js`, `/utils/analyzePick5.js`, `/utils/analyzeMega.js`, `/utils/analyzePowerball.js`  
* Type: util group  
* Current purpose: game-specific analysis helpers  
* Observed dependency risk: low to moderate depending on duplication and style drift  
* Recommended status: `active-v1` (selectively)  
* Recommended action: preserve useful game-specific logic, but normalize naming and move into modular strategy/feature builders  
* Target location (if moving): `lib/prediction/strategies/` and `lib/prediction/generators/`  
* Notes: these are likely strong raw materials for Phase 3\. fileciteturn5file2turn5file3

### **Legacy Item 035**

* Path: `/utils/fetchDraws.js`  
* Type: util  
* Current purpose: DB draw retrieval helper  
* Observed dependency risk: low  
* Recommended status: `active-v1`  
* Recommended action: keep concept, but align to new DB query layer and game catalog model  
* Target location (if moving): `lib/db/queries/` or `lib/ingestion/` depending on usage  
* Notes: older audit explicitly called this out as important and easy to overlook. fileciteturn5file2turn5file4

### **Legacy Item 036**

* Path: `/utils/gameSettings.js` or `/utils/game_settings.js`  
* Type: util/config  
* Current purpose: central game rules/config  
* Observed dependency risk: low  
* Recommended status: `active-v1`  
* Recommended action: migrate into canonical `lib/brewlotto-games/` domain  
* Target location (if moving): `lib/brewlotto-games/games.ts`  
* Notes: absolutely keep the concept, but centralize it in the new config system. fileciteturn5file2turn5file3

### **Legacy Item 037**

* Path: `/scripts/scrapeNC_Pick3.js`, `/scripts/scrapeNC_Pick4.js`, `/scripts/scrapeNC_Pick5.js`  
* Type: script group  
* Current purpose: historical scrape/bootstrap for NC games  
* Observed dependency risk: low to moderate  
* Recommended status: `active-v1` (transitional)  
* Recommended action: keep for backfill/bootstrap if still working; gradually replace with source-registry-based ingestion jobs  
* Target location (if moving): `/scripts/backfill/` and `lib/ingestion/`  
* Notes: good bridge tools during ingestion build-out. fileciteturn5file2turn5file3

### **Legacy Item 038**

* Path: `/scripts/scrapeMega.js`, `/scripts/scrapePowerball.js`  
* Type: script group  
* Current purpose: multi-state jackpot draw history scrape/bootstrap  
* Observed dependency risk: moderate if one is incomplete or missing  
* Recommended status: split  
* Recommended action: keep the working one as transitional if valid; treat missing/incomplete one as Phase 2 build item  
* Target location (if moving): `/scripts/backfill/` and `lib/ingestion/`  
* Notes: older audit explicitly flagged Powerball scraper as missing and Mega as needing review. fileciteturn5file3

### **Legacy Item 039**

* Path: `/pages/dashboard.js`  
* Type: legacy page  
* Current purpose: analytics dashboard in older structure  
* Observed dependency risk: high if old dashboard concepts bleed into the new public dashboard without review  
* Recommended status: `deprecated`  
* Recommended action: do not carry forward blindly; rebuild against the new V1 dashboard architecture  
* Target location (if moving): replacement is `/app/dashboard/page.tsx`  
* Notes: older audit itself said “needs review.” fileciteturn5file3

### **Legacy Item 040**

* Path: unused/old mock files  
* Type: mixed legacy debris  
* Current purpose: demo or placeholder logic from earlier builds  
* Observed dependency risk: high because mock logic can silently pollute V1 trust  
* Recommended status: `deprecated`  
* Recommended action: identify and purge from the active runtime path  
* Target location (if moving): `archive/deprecated/`  
* Notes: the uploaded docs explicitly warned against old mock files lingering. fileciteturn5file2turn5file4

---

## **12\. Recommended Immediate Actions**

### **Action 1**

Run a real file-by-file pass through:

* `/app/`  
* `/app/api/`  
* `/components/`  
* `/lib/`  
* `/scripts/`  
* any lingering `/pages/` and `/utils/` legacy folders

### **Action 2**

Populate this ledger with actual entries for all major modules.

### **Action 3**

Move admin/internal modules out of the public dashboard path first.

### **Action 4**

Archive experimental AI and non-V1 routes before deeper implementation continues.

### **Action 5**

Keep a minimal transitional strategy engine only as long as needed before modular split.

### **Action 6**

Explicitly search for legacy Pages Router leftovers and mock/demo code so App Router V1 does not accidentally ship with split architecture.

---

## **13\. Success Criteria**

The code prune phase is successful when:

* the active codebase clearly reflects the approved V1 blueprint  
* public product and admin surfaces are no longer mixed  
* deferred and experimental features are visibly isolated  
* dev effort is no longer diluted by non-launch-critical modules  
* the next implementation phases can proceed with less ambiguity

---

## **13\. BrewDocs Summary**

**What this doc does:** Provides the working ledger for deciding what stays, moves, defers, deprecates, or archives in the BrewLotto V1 codebase.

**What it prevents:** Feature sprawl, mixed surfaces, wasted build effort, and accidental loss of good ideas.

**What it enables:** A deliberate reduction pass that protects schedule, clarity, and launch quality.

# Code Prune Brewlotto v1

\<\!--  
/brewexec/brewdocs/CODE\_PRUNE\_BREWLOTTO\_V1.md  
Timestamp: 2026-03-16 ET  
Phase: V1 Reset / Code Triage and Surface Reduction  
Purpose: Working ledger for reviewing the existing BrewLotto codebase, classifying modules by V1 value, and reducing non-essential scope before implementation accelerates.  
\--\>BrewLotto AI — V1 Code Prune Ledger

1\. Document Purpose

This document is the working triage ledger for the current BrewLotto codebase.

It exists to:

inventory routes, components, modules, and scripts

decide what stays in active V1 scope

identify what should move to admin-only scope

defer underdeveloped or non-essential features

deprecate or archive experiments that create noise

reduce plan and implementation weight before heavy build work continues

This is not a punishment document. It is a focus document.

\---

2\. Triage Status Labels

Every reviewed item should be assigned one primary status.

active-v1

Required for NC \+ CA launch and clearly aligned to the approved V1 blueprint.

move-to-admin

Useful, but belongs in BrewCommand/internal operations, not the public user experience.

defer-v1\_5

Good idea, but not required for launch stability.

deprecated

Legacy, duplicated, misleading, or superseded by the new V1 architecture.

archive-experiment

Interesting experimental work that should be preserved but removed from the active build path.

\---

3\. Decision Rules

Keep in active V1 only if the item directly supports:

NC \+ CA draw ingestion

canonical draw storage

deterministic prediction generation

dashboard insight rendering

saved picks / play logs

pricing / Stripe billing

notifications

BrewTruth auditing

BrewCommand V1 internal ops

Default to defer or archive when the item is:

underdefined

highly experimental

expensive to QA

not required for the first public launch

mixing internal diagnostics into the customer experience

Important rule

Do not delete first. Classify first. Move or archive second. Remove only after replacement path is clear.

\---

4\. Current Codebase Signals from Uploaded Materials

The uploaded BrewLotto docs show a tree with App Router routes, prediction APIs, play-log APIs, audit-related endpoints, dashboard/admin-oriented components, and BrewBot/BrewCommentary style surfaces. It also shows early plans for keeping strategy logic compact at first and modularizing later. fileciteturn3file2turn3file4

The same uploaded notes also include future-facing premium concepts such as Syndicate Mode, VIP BrewBot voice experiences, export/reporting ideas, and external integrations. Those should not crowd the launch path unless already very mature and clearly required. fileciteturn3file3

This ledger is therefore built to support deliberate reduction, not accidental loss.

\---

5\. Triage Ledger Template

Use this template for each reviewed file/module/group.

\#\#\# Item  
\- Path:  
\- Type: route / api / component / hook / lib / script / page / admin  
\- Current purpose:  
\- Observed dependency risk:  
\- Recommended status:  
\- Recommended action:  
\- Target location (if moving):  
\- Notes:

\---

6\. Initial Triage Recommendations from Uploaded Tree

These are first-pass recommendations based on the uploaded code tree and spec direction. They should be confirmed during file-by-file review.

\---

Item 001

Path: /app/api/predict/\*

Type: api

Current purpose: prediction generation endpoints

Observed dependency risk: moderate if multiple fragmented endpoints exist

Recommended status: active-v1

Recommended action: consolidate toward one clear V1 prediction contract

Target location (if moving): remain under public API domain

Notes: keep, but reduce route fragmentation if older variants exist. fileciteturn4file2

Item 002

Path: /app/api/stats/\[game\]/route.ts

Type: api

Current purpose: serve game-level stats and insight data

Observed dependency risk: low to moderate depending on response contract quality

Recommended status: active-v1

Recommended action: align to dashboard insight model for hot/cold/momentum

Target location (if moving): remain under public API domain

Notes: this is already central to the older live-data design. fileciteturn4file0turn4file2

Item 003

Path: /app/api/play/log/route.ts

Type: api

Current purpose: user play logging

Observed dependency risk: low

Recommended status: active-v1

Recommended action: keep and align to canonical play\_logs schema

Target location (if moving): remain under public API domain

Notes: directly supports V1 user value and was part of the original data flow. fileciteturn4file0turn4file2

Item 004

Path: /app/api/audit/route.ts

Type: api

Current purpose: audit visibility or data verification endpoint

Observed dependency risk: moderate if exposed in public path without admin controls

Recommended status: move-to-admin

Recommended action: keep only as internal BrewCommand/BrewTruth support route

Target location (if moving): /app/api/admin/audit/route.ts

Notes: operationally useful, but not part of the public customer value loop. fileciteturn4file2

Item 005

Path: /app/api/brew-ai/route.ts

Type: api

Current purpose: broad or experimental AI runtime endpoint

Observed dependency risk: high if loosely defined or over-scoped

Recommended status: archive-experiment

Recommended action: isolate unless a V1-approved responsibility is proven

Target location (if moving): archive/experiments/api-brew-ai/

Notes: V1 AI routing should follow the approved routing spec, not a vague umbrella route. fileciteturn4file2

Item 006

Path: /app/api/generate-merge-report/route.ts

Type: api

Current purpose: experimental/ops/reporting functionality

Observed dependency risk: high relative to public V1 value

Recommended status: archive-experiment

Recommended action: remove from the active public path

Target location (if moving): archive/experiments/generate-merge-report/

Notes: not part of the V1 product contract. fileciteturn4file2

Item 007

Path: /app/pick3/page.tsx, /app/pick4/page.tsx, /app/pick5/page.tsx, /app/powerball/page.tsx, /app/mega/page.tsx

Type: pages

Current purpose: per-game product views

Observed dependency risk: moderate if each page duplicates logic instead of using shared config

Recommended status: active-v1

Recommended action: keep game access, but refactor toward shared dashboard/game config architecture

Target location (if moving): potentially consolidate into config-driven dashboard/game routes

Notes: aligned to launch scope, but avoid duplicated page logic. fileciteturn4file2turn4file3

Item 008

Path: /app/dashboard/page.tsx

Type: page

Current purpose: main user dashboard

Observed dependency risk: high if mixed with admin diagnostics

Recommended status: active-v1

Recommended action: keep as customer dashboard only

Target location (if moving): remain public dashboard surface

Notes: this should become the kiosk-style V1 hub. fileciteturn4file2

Item 009

Path: /components/predict/PredictionCard.jsx

Type: component

Current purpose: display prediction output

Observed dependency risk: low

Recommended status: active-v1

Recommended action: preserve and refactor into the new design system if needed

Target location (if moving): components/brewlotto/prediction/PredictionCard.tsx

Notes: core user value component. fileciteturn4file2turn4file3

Item 010

Path: /components/predict/PredictionInsights.jsx

Type: component

Current purpose: Brew commentary / prediction explanation display

Observed dependency risk: low to moderate depending on AI coupling

Recommended status: active-v1

Recommended action: keep, but anchor explanations to deterministic evidence first

Target location (if moving): components/brewlotto/prediction/PredictionInsights.tsx

Notes: matches V1 explanation goals. fileciteturn4file2turn4file3

Item 011

Path: /components/predict/GameIntroCard.jsx

Type: component

Current purpose: show odds, variants, or game intro details

Observed dependency risk: low

Recommended status: active-v1

Recommended action: keep as part of education \+ onboarding per game

Target location (if moving): components/brewlotto/dashboard/GameIntroCard.tsx

Notes: supports trust and education positioning. fileciteturn4file2turn4file3

Item 012

Path: /components/predict/PredictionStrategyToggle.jsx

Type: component

Current purpose: tier-aware or mode-aware strategy switching

Observed dependency risk: moderate if tied to too many unfinished strategies

Recommended status: active-v1

Recommended action: keep only if options are mapped to approved launch strategies

Target location (if moving): components/brewlotto/prediction/PredictionStrategyToggle.tsx

Notes: good V1 fit if simplified. fileciteturn4file2turn4file3

Item 013

Path: /components/predict/StrategyExplainModal.jsx

Type: component

Current purpose: explain strategy choices to user

Observed dependency risk: low

Recommended status: active-v1

Recommended action: keep and align to BrewUniversity Lite / strategy glossary

Target location (if moving): components/brewlotto/prediction/StrategyExplainModal.tsx

Notes: this is a trust-positive feature. fileciteturn4file2

Item 014

Path: /components/dashboard/PredictionFeed.jsx

Type: component

Current purpose: dashboard stream of prediction results

Observed dependency risk: low to moderate

Recommended status: active-v1

Recommended action: keep if tied to user picks or recent predictions

Target location (if moving): components/brewlotto/dashboard/PredictionFeed.tsx

Notes: useful if user-centric, not admin-centric. fileciteturn4file2

Item 015

Path: /components/dashboard/UploadZone.jsx

Type: component

Current purpose: upload/import/admin utility

Observed dependency risk: moderate

Recommended status: move-to-admin

Recommended action: keep only for manual backfill or diagnostics

Target location (if moving): components/admin/UploadZone.tsx

Notes: not public V1 value. fileciteturn4file2

Item 016

Path: /components/dashboard/RefreshTrigger.jsx

Type: component

Current purpose: trigger refresh or internal update jobs

Observed dependency risk: moderate if used as manual operational control in public UI

Recommended status: move-to-admin

Recommended action: convert into internal admin control or eliminate if redundant

Target location (if moving): components/admin/RefreshTrigger.tsx

Notes: customer dashboard should not expose ops-style controls. fileciteturn4file2

Item 017

Path: /components/dashboard/AuditViewer.jsx

Type: component

Current purpose: audit or internal diagnostics viewer

Observed dependency risk: moderate if leaked into public UI path

Recommended status: move-to-admin

Recommended action: move under BrewCommand scope

Target location (if moving): components/admin/BrewTruthAuditViewer.tsx

Notes: useful, but internal. fileciteturn4file0turn4file2

Item 018

Path: /components/dashboard/DrawHealthMonitor.jsx

Type: component

Current purpose: ingestion/draw system health visibility

Observed dependency risk: low if isolated to admin

Recommended status: move-to-admin

Recommended action: move into admin ingestion monitor suite

Target location (if moving): components/admin/IngestionMonitor.tsx

Notes: not a public dashboard component for V1. fileciteturn4file0turn4file2

Item 019

Path: /components/dashboard/AdminHubLayout.jsx

Type: component/layout

Current purpose: internal operations layout

Observed dependency risk: low

Recommended status: move-to-admin

Recommended action: keep only if aligned to BrewCommand V1 shell

Target location (if moving): /app/admin/\*

Notes: useful if simplified. fileciteturn4file0turn4file2

Item 020

Path: /components/dashboard/GameStrategySelector.jsx

Type: component

Current purpose: game/strategy selection UX

Observed dependency risk: moderate if overloaded with too many strategy choices

Recommended status: active-v1

Recommended action: keep if mapped to approved strategy set and dashboard flow

Target location (if moving): components/brewlotto/dashboard/GameStrategySelector.tsx

Notes: good if simplified to launch-approved options only. fileciteturn4file2

Item 021

Path: /components/context/BrewBotContext.jsx

Type: context

Current purpose: bot/voice/commentary shared state

Observed dependency risk: moderate if it becomes a hidden app dependency

Recommended status: defer-v1\_5

Recommended action: reduce to a minimal voice placeholder context only if needed

Target location (if moving): archive/deferred-v2/ or slimmed public context

Notes: keep voice minimal in V1. fileciteturn4file2

Item 022

Path: /components/ui/BrewLottoBot.jsx, /components/ui/BrewAvatar.jsx, /components/ui/BrewCommentaryEngine.\*

Type: UI/AI component group

Current purpose: conversational or commentary-driven UX

Observed dependency risk: high if public V1 depends on voice/chat depth

Recommended status: split

Recommended action: keep only lightweight commentary hooks; defer richer voice/chat flows

Target location (if moving): public lightweight explanation UI \+ archive/deferred-v2/voice/

Notes: useful brand layer, but should not delay launch. fileciteturn4file2turn4file3

Item 023

Path: older per-game draw tables like pick3\_draws, pick4\_draws, pick5\_draws, mega\_draws, powerball\_draws

Type: data model / schema concept

Current purpose: early storage for draw history

Observed dependency risk: high if it blocks multi-state normalization

Recommended status: deprecated

Recommended action: migrate conceptually to unified official\_draws model

Target location (if moving): legacy migration reference only

Notes: useful for MVP velocity, not for the new V1 DB architecture. fileciteturn4file4

Item 024

Path: scripts like /scripts/saveNC.js, /scripts/upload/csvUtils.js, /scripts/auditTables.js, /scripts/drawHistoryAudit.js

Type: scripts

Current purpose: ingestion, upload, and audit operations

Observed dependency risk: low to moderate depending on quality and coupling

Recommended status: active-v1 (selectively)

Recommended action: preserve the useful ingestion/audit logic, but refactor into the new ingestion domain where practical

Target location (if moving): /scripts/ \+ lib/ingestion/

Notes: these are valuable bridges during Phase 2\. fileciteturn4file0turn4file4

Item 025

Path: Syndicate Mode concept

Type: feature concept

Current purpose: group/shared play experience

Observed dependency risk: high scope \+ QA burden

Recommended status: defer-v1\_5

Recommended action: move to post-launch roadmap

Target location (if moving): deferred backlog

Notes: good future feature, not launch-critical. fileciteturn3file3

Item 026

Path: VIP BrewBot voice experiences

Type: feature concept

Current purpose: premium voice/narration/chat experience

Observed dependency risk: high runtime complexity \+ support burden

Recommended status: defer-v1\_5

Recommended action: keep voice placeholder only in V1

Target location (if moving): deferred backlog

Notes: do not let this delay core product value. fileciteturn3file3

Item 027

Path: export/reporting suite (PDF/CSV style concepts)

Type: feature concept

Current purpose: export user insights/reports

Observed dependency risk: moderate

Recommended status: defer-v1\_5

Recommended action: postpone unless urgently required by monetization or support

Target location (if moving): deferred backlog

Notes: nice-to-have, not required for stable launch. fileciteturn3file3

Item 028

Path: deeper BrewVision-style end-user analytics dashboards

Type: feature concept

Current purpose: advanced visual analytics

Observed dependency risk: high UX \+ data complexity

Recommended status: defer-v1\_5

Recommended action: keep public dashboard lean in V1

Target location (if moving): deferred backlog

Notes: avoid overbuilding the public surface. fileciteturn3file3

Item 029

Path: daily autopick monetization add-on

Type: feature concept

Current purpose: recurring automated pick delivery

Observed dependency risk: high trust/compliance/product complexity

Recommended status: defer-v1\_5

Recommended action: revisit after base engine, billing, and trust layer prove stable

Target location (if moving): deferred backlog

Notes: do not add before core V1 maturity. fileciteturn3file3

7\. Route-Level Triage Checklist

For every route under /app/ or /app/api/, verify:

is it part of the approved V1 user journey?

is it internal/admin only?

does it rely on mocks or unofficial data?

does it duplicate another endpoint?

does it belong in public product, admin, or archive?

\---

8\. Component-Level Triage Checklist

For every component group, verify:

is it public UI or admin UI?

is it used by the new kiosk-style experience?

does it reflect the current V1 visual direction?

is it tied to deferred features?

should it move, stay, or be archived?

\---

9\. Library-Level Triage Checklist

For every lib module, verify:

does it support ingestion, prediction, billing, notifications, BrewTruth, or admin?

is it deterministic-first?

is it coupled to old route structures?

can it remain transitional, or must it be refactored now?

\---

10\. Archive Rules

When moving something out of active V1:

preserve filename history where possible

place into a clear archive folder

add a small note explaining why it moved

link replacement or future phase if known

Suggested archive buckets

archive/deferred-v2/

archive/deprecated/

archive/experiments/

\---

11\. Recommended Immediate Actions

Action 1

Run a real file-by-file pass through:

/app/

/app/api/

/components/

/lib/

Action 2

Populate this ledger with actual entries for all major modules.

Action 3

Move admin/internal modules out of the public dashboard path first.

Action 4

Archive experimental AI and non-V1 routes before deeper implementation continues.

Action 5

Keep a minimal transitional strategy engine only as long as needed before modular split.

\---

12\. Success Criteria

The code prune phase is successful when:

the active codebase clearly reflects the approved V1 blueprint

public product and admin surfaces are no longer mixed

deferred and experimental features are visibly isolated

dev effort is no longer diluted by non-launch-critical modules

the next implementation phases can proceed with less ambiguity

\---

13\. BrewDocs Summary

What this doc does: Provides the working ledger for deciding what stays, moves, defers, deprecates, or archives in the BrewLotto V1 codebase.

What it prevents: Feature sprawl, mixed surfaces, wasted build effort, and accidental loss of good ideas.

What it enables: A deliberate reduction pass that protects schedule, clarity, and launch quality.

# SYSTEM\_DEPENDENCY\_MAP

\<\!--  
/brewexec/brewdocs/BREWLOTTO\_V1\_SYSTEM\_DEPENDENCY\_MAP.md  
Timestamp: 2026-03-16 ET  
Phase: V1 Reset / Dependency Map  
Purpose: Define the dependency relationships across BrewLotto V1 systems so implementation happens in the correct order and downstream work does not begin before its prerequisites are stable.  
\--\>BrewLotto AI — V1 System Dependency Map

1\. Document Purpose

This document translates the BrewLotto V1 architecture and build order into a dependency map.

It defines:

which systems must exist before others can be built reliably

which modules can be developed in parallel

which items are blockers vs non-blockers

where temporary stubs are acceptable

what must stabilize before public launch

This is the engineering coordination map for BrewLotto V1.

\---

2\. Core Dependency Principle

BrewLotto should be built from the inside out.

That means:

1\. data and persistence before analytics

2\. analytics before explanations

3\. entitlements before premium gating

4\. admin visibility before launch

5\. trust controls before broad rollout

Rule

A beautiful UI on top of unstable ingestion or broken prediction logic is not progress.

\---

3\. Dependency Tiers

BrewLotto V1 systems fall into five dependency tiers.

Tier 0 — Foundation

repository structure

environment configuration

Supabase connection

shared game config

base route scaffolding

Tier 1 — Core Data Layer

database schema

seed data

draw source registry

canonical draw persistence

ingestion logging

Tier 2 — Core Intelligence Layer

feature extraction

strategy modules

prediction engine

BrewTruth validation

prediction persistence

Tier 3 — Product Experience Layer

dashboard UI

game tabs

prediction cards

my picks

play logging

pricing page

account page

Tier 4 — Expansion and Operations Layer

AI commentary routing

notifications

BrewCommand admin

feature flags

billing lifecycle visibility

state expansion readiness

\---

4\. System Dependency Overview

Repository / Env Setup  
        ↓  
Database Schema \+ Game Config  
        ↓  
Data Ingestion \+ Freshness Tracking  
        ↓  
Feature Extraction \+ Prediction Engine  
        ↓  
Prediction API \+ Persistence  
        ↓  
Dashboard UI \+ Pick Logging  
        ↓  
Billing / Entitlements \+ Notifications  
        ↓  
AI Commentary \+ BrewCommand Admin  
        ↓  
Launch Readiness \+ State Expansion

\---

5\. Phase-by-Phase Dependency Map

5.1 Phase 0 — Repository Stabilization

Depends on

approved V1 architecture set

Enables

clean implementation paths

shared ownership model

removal of legacy routing ambiguity

Blockers if incomplete

mixed App Router / Pages Router architecture

public/admin component confusion

unresolved archive/deprecate decisions

Can run in parallel with

DB migration planning

seed data preparation

\---

5.2 Phase 1 — Infrastructure Foundation

Depends on

repo stabilization

Requires

environment variable strategy

Supabase project access

shared lib structure

auth direction

Enables

schema deployment

DB access from APIs

route handler implementation

Blockers if incomplete

no stable DB connection

no central config source

no shared service-layer structure

\---

5.3 Phase 2 — Database and Catalog Foundation

Depends on

infrastructure foundation

Requires

schema migrations

state catalog

game catalog

source registry

base RLS direction

Enables

draw ingestion

prediction persistence

billing entitlements

notifications

admin health visibility

Blockers if incomplete

ingestion has nowhere canonical to write

prediction engine lacks target schema

UI cannot rely on stable metadata

\---

5.4 Phase 3 — Data Ingestion System

Depends on

database and catalog foundation

source registry

Requires

fetchers

parsers

normalizers

validators

dedupe rules

ingestion run logging

Enables

real draw history

freshness status

stats generation

settlement triggers

reliable dashboard insights

Blockers if incomplete

prediction engine forced to use mock or stale data

dashboard cannot be trusted

BrewTruth must reject too many flows

Can run in parallel with

basic public UI scaffolding using mocked contracts only temporarily

\---

5.5 Phase 4 — Prediction Engine

Depends on

real historical draw data

game config

feature extraction inputs

prediction persistence tables

Requires

strategy modules

scoring engine

candidate generators

confidence logic

BrewTruth prediction checks

Enables

smart pick generation

insight summaries

premium strategy gating

backtesting and replay evaluation

Blockers if incomplete

no real product value loop

commentary layer has nothing trustworthy to explain

pricing tiers have weak differentiation

Can run in parallel with

dashboard shell build

pricing page build

account/settings UI

\---

5.6 Phase 5 — Public Dashboard and User Flows

Depends on

stable game config

stats APIs

prediction API

play log schema

Requires

dashboard layout

tabs

hot/cold views

momentum meter

prediction card

save/log flow

account/prefs pages

Enables

end-user product experience

feedback on core UX loop

early internal demo and staging review

Blockers if incomplete

product cannot be evaluated as a real experience

prediction engine remains hidden behind raw APIs

Can run in parallel with

Stripe integration

BrewUniversity Lite content seeding

\---

5.7 Phase 6 — Billing and Entitlements

Depends on

user auth/profile system

pricing definition

entitlement tables

Requires

Stripe checkout

webhook handlers

subscription sync

entitlement refresh logic

UI premium gates

Enables

monetization

premium strategy access

premium explanation depth

quota control

Blockers if incomplete

no paid conversion path

no reliable premium gating

Can run in parallel with

notification system build

AI routing integration

\---

5.8 Phase 7 — Notifications and Play Settlement

Depends on

draw ingestion

play logs

official draw matching

notification tables

Requires

settlement logic

event triggers

in-app notification service

optional email delivery

Enables

retention loop

tracked play outcomes

hot number alerts

badge/streak triggers

Blockers if incomplete

weak retention

users cannot track results meaningfully

\---

5.9 Phase 8 — AI Commentary Routing

Depends on

prediction engine

explanation templates

entitlement gating

provider registry

BrewTruth controls

Requires

AI routing layer

fallback logic

provider health handling

prompt templates

commentary persistence

Enables

richer “why this pick?” experience

premium explanation upsell

educational overlays

Blockers if incomplete

none for core product function

Important note

This is not a blocker for base prediction launch, as long as deterministic explanation templates exist.

\---

5.10 Phase 9 — BrewCommand Admin and Ops Visibility

Depends on

ingestion logs

prediction logs

BrewTruth audit logs

billing events

feature flags

Requires

admin auth/RBAC

health dashboards

ingestion monitor

audit viewer

strategy visibility

manual retry controls

Enables

supportability

faster debugging

safer launch

cleaner incident response

Blockers if incomplete

launch risk increases substantially because issues become harder to detect quickly

Important note

A minimal BrewCommand should exist before launch, even if not fully polished.

\---

5.11 Phase 10 — Compliance, Trust, and Launch Controls

Depends on

BrewTruth integration

UI messaging

AI output constraints

billing and entitlement behavior

Requires

responsible play messaging

disclaimer placement

source freshness transparency

confidence wording rules

auditability

Enables

safer public positioning

stronger user trust

better investor confidence

Blockers if incomplete

legal/trust posture becomes weak

messaging can drift into unsupported claims

\---

6\. Parallel Work Matrix

The following workstreams can happen in parallel once their shared prerequisites exist.

Parallel Group A

After Phase 1:

DB migration authoring

game catalog seeding

route scaffolding

public UI shell scaffolding

Parallel Group B

After Phase 2:

ingestion implementation

strategy module implementation

dashboard component construction against stable contracts

Parallel Group C

After Phase 4:

billing implementation

account page work

commentary template authoring

notification trigger work

Parallel Group D

After Phase 6:

AI commentary routing

BrewCommand health panels

premium UX refinement

\---

7\. Non-Blockers vs Blockers

Hard launch blockers

unstable ingestion

broken prediction generation

broken auth or entitlement sync

invalid pricing/billing behavior

absent BrewTruth safeguards

no admin health visibility

Soft blockers / non-blockers for initial V1

advanced voice mode

rich AI commentary depth

export/reporting suite

syndicate mode

deep end-user analytics dashboards

broad multi-state rollout

These can ship later without invalidating V1.

\---

8\. Temporary Stub Guidance

Temporary stubs are acceptable only when they unblock downstream UI work without creating false production assumptions.

Acceptable temporary stubs

dashboard stat contract mocks during early UI build

deterministic placeholder explanations before AI commentary is ready

local feature flags before admin UI exists

Unacceptable temporary stubs

fake official draw data presented as live production data

mock billing logic in production paths

fake entitlement states not tied to real subscription sync

\---

9\. Developer Handoff Guidance

When handing work to NemoTron Super or other builders, task prompts should explicitly state:

which phase the task belongs to

what dependencies are already complete

what assumptions are allowed

what files are in scope

what is intentionally deferred

Example dependency-aware framing

“Build the NC ingestion parser adapter for the existing source registry and official\_draws schema. Do not modify billing, dashboard UI, or AI commentary modules.”

This reduces cross-phase drift.

\---

10\. MVP-Critical Path

If the goal is the fastest stable V1, the strict MVP critical path is:

1\. repo cleanup

2\. infra setup

3\. DB schema \+ game config

4\. NC \+ CA ingestion

5\. prediction engine

6\. dashboard UI

7\. play logs

8\. Stripe billing \+ entitlements

9\. minimal BrewCommand

10\. compliance/trust pass

Commentary AI

Commentary AI is valuable, but not on the strictest MVP critical path if deterministic explanations are already available.

\---

11\. Dependency Summary by System

Database depends on

infra setup

Ingestion depends on

DB schema

source registry

game config

Prediction engine depends on

ingestion output

feature extraction

prediction tables

Dashboard depends on

game config

stats API

predict API

Billing depends on

auth

subscription tables

entitlement logic

Notifications depend on

play logs

draws

trigger rules

AI commentary depends on

prediction outputs

explanation templates

provider routing

BrewTruth controls

BrewCommand depends on

logs from ingestion, prediction, billing, and BrewTruth

\---

12\. Final Recommendation

The best way to begin implementation is:

First

Run Phase 0 cleanup and repo alignment.

Second

Stand up the DB/catalog/ingestion core.

Third

Build prediction engine and dashboard together against real contracts.

Fourth

Add monetization, notifications, admin visibility, and commentary.

That order gives BrewLotto the best chance of becoming a stable, premium-feeling V1 instead of a fragile feature pile.

\---

13\. BrewDocs Summary

What this doc does: Shows the dependency relationships across BrewLotto V1 systems and defines what must happen first versus what can wait.

What it prevents: Out-of-order development, hidden blockers, and teams building downstream features on unstable upstream systems.

What it enables: Cleaner handoff to engineering agents, better phase coordination, and faster progress toward a stable V1 launch.
