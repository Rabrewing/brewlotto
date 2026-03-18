# REWLOTTO\_V1\_Product\_Overview

\<\!--  
/brewexec/brewdocs/BREWLOTTO\_V1\_Product\_Overview.md  
Timestamp: 2026-03-16 ET  
Phase: V1 Reset / Product Foundation  
Purpose: Canonical BrewDocs product overview for rebuilding BrewLotto into a stable, launch-ready V1.  
Updated: 2026-03-18  
Reason: V1 UX correction for dropdown scope and Brew visibility rules  
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

6.3 Deferred to Post-V1

broader state expansion

advanced syndicate/group features

richer AI voice persona layers

deeper predictive model experimentation

enterprise learning hub integration

advanced export/report builder

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

\---

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

# Gamification

Done — I created the gamification spec in canvas as BrewLotto\_Gamification\_System\_Spec.md.

It now covers:

XP engine

levels and ranks

streaks

badges

missions

performance scoring

emotional/BrewPulse feedback

DB tables

API routes

frontend widget plan

implementation order

V1 vs deferred scope

PM take: this gives NemoTron a real engagement system blueprint, not just a vague “add badges later” idea.

Next strongest doc to create is the BrewLotto Data Source Matrix so your ingestion layer and gamification layer are both locked before full frontend work.Got you — printing it clean here so you can copy straight into /brewdocs/ 👇

\---

📘 BrewLotto\_Gamification\_System\_Spec.md

\# BrewLotto Gamification System Spec

Project: BrewLotto AI    
Phase: V1 Foundation \+ Engagement Layer    
Status: Build-Ready    
Timestamp: 2026-03-17 (ET)

\---

\#\# 1\. Purpose

Define a structured gamification system to enhance:  
\- retention  
\- engagement  
\- learning  
\- strategy usage  
\- emotional experience

BrewLotto is NOT just a lottery app.    
It is a \*\*lottery intelligence system with user progression\*\*.

\---

\#\# 2\. Core Philosophy

Gamification must:  
\- reward discipline, not gambling  
\- reinforce strategy usage  
\- provide emotional feedback (BrewPulse)  
\- feel premium, not arcade-like

\---

\#\# 3\. Core Modules

/lib/gamification/

\- xpEngine.ts  
\- streakEngine.ts  
\- badgeEngine.ts  
\- missionEngine.ts  
\- performanceEngine.ts  
\- rewardFormatter.ts  
\- progressHooks.ts

\---

\#\# 4\. XP System

\#\#\# XP Rules

| Event | XP |  
|------|----|  
| Daily login | 3 |  
| Generate pick | 5 |  
| Save pick | 10 |  
| Use strategy | 6 |  
| Review insights | 4 |  
| Mission complete (daily) | 20 |  
| Mission complete (weekly) | 60 |  
| Partial hit | 25 |  
| Full hit | 100 |

\---

\#\#\# Example

\`\`\`ts  
const XP\_RULES \= {  
  generate\_pick: 5,  
  save\_pick: 10,  
  partial\_hit: 25,  
  full\_hit: 100  
};

\---

5\. Leveling System

level \= Math.floor(totalXP / 100\)

Ranks

Bronze Player

Silver Strategist

Gold Predictor

Platinum Analyst

BrewMaster

BrewLegend

\---

6\. Streak System

Types

daily\_streak

save\_streak

insight\_streak

hit\_streak

Logic

if (userPlayedToday) streak++  
else streak \= 0

Milestones

3 days → Warm Up

7 days → Consistent

14 days → Disciplined

30 days → Elite

\---

7\. Badges

Badge	Condition

First Spark	First pick  
Locked In	3-day save streak  
Strategist	Use all strategies  
Hot Hand	3 hits in a row  
Consistent	7-day streak  
BrewMaster	Level milestone

\---

8\. Missions

Daily

Generate 2 picks

Save 1 pick

Review insights

Weekly

Use 3 strategies

Maintain 5-day streak

Check results 4 days

\---

9\. Performance Scoring

accuracy \= hits / total\_predictions

Metrics

hit\_rate

total\_predictions

saved\_picks

strategy\_success

streak\_peak

\---

Composite Score

performanceScore \=  
  (hitRate \* 0.4) \+  
  (consistency \* 0.2) \+  
  (strategyUsage \* 0.2) \+  
  (engagement \* 0.2)

\---

10\. Emotional Gamification (BrewPulse Layer)

Examples:

“You’re heating up 🔥”

“Cold streak detected — adjust strategy”

“Strong consistency — keep going”

“Momentum building”

Triggers:

streak changes

wins/losses

mission completion

badge unlock

\---

11\. Database Schema

user\_stats

user\_id  
total\_xp  
level  
rank  
total\_predictions  
total\_hits  
best\_streak  
current\_streak

\---

user\_achievements

user\_id  
badge\_key  
unlocked\_at

\---

user\_streaks

user\_id  
streak\_type  
current\_count  
best\_count

\---

user\_missions

user\_id  
mission\_key  
progress  
status  
reward\_xp

\---

xp\_events

user\_id  
event\_key  
xp\_awarded  
timestamp

\---

12\. API Endpoints

GET  /api/gamification/profile  
GET  /api/gamification/missions  
GET  /api/gamification/achievements  
POST /api/gamification/event  
POST /api/gamification/claim

\---

13\. Frontend Components

/components/gamification/

XpBar.tsx

StreakCard.tsx

MissionCard.tsx

BadgeShelf.tsx

RankBadge.tsx

PerformanceCard.tsx

\---

14\. UI Integration Points

Dashboard

My Picks

Strategy Locker

Profile

Post-result screen

Brew commentary panel

\---

15\. Implementation Phases

Phase G1

DB \+ event tracking

Phase G2

XP \+ streak engine

Phase G3

Badges \+ missions

Phase G4

UI widgets

Phase G5

Performance scoring

Phase G6

BrewPulse integration

\---

16\. Success Criteria

Gamification is successful when:

XP updates correctly

streaks track properly

badges unlock as expected

missions rotate dynamically

dashboard shows progress clearly

commentary reflects user state

\---

17\. PM Final Note

This is NOT a “points system.”

This is a:

👉 User intelligence progression system

BrewLotto wins when users feel:

smarter

more strategic

more in control

more consistent

Gamification should reinforce that identity.

\---

\# 🚀 Next Move (Recommended)

You now have \*\*3 critical systems defined\*\*:

\- ✅ Data ingestion (NC working)  
\- ✅ Prediction engine (planned)  
\- ✅ Gamification system (now defined)

👉 Next doc to lock in:

\*\*BrewLotto Data Source Matrix (ALL states \+ endpoints \+ ingestion strategy)\*\*

That will make NemoTron unstoppable when building ingestion \+ pipelines.

Say the word and I’ll drop that next.

# Source Matrix

Absolutely — here’s the BrewLotto Data Source Matrix you can hand to NemoTron.

BrewLotto Data Source Matrix

Version: V1  
Date: 2026-03-17 ET  
Scope: North Carolina \+ California \+ multi-state games

Source priority rules

Use this order for ingestion:

Tier 1: official lottery sources  
Tier 2: trusted historical archive for backfill/verification  
Tier 3: custom scraper/parser only when Tier 1 has no stable export/API

For North Carolina, the official past-draw pages are the best primary source because NC explicitly provides downloadable CSVs for multiple games. For California, the official site clearly exposes current and past winning numbers on the game pages, but I did not find a confirmed public CSV/export endpoint comparable to NC’s during this pass, so CA should use official pages for latest results and a trusted archive for historical backfill. 

\---

1\) North Carolina source matrix

NC Pick 3

Primary: NC official Pick 3 past draws page  
Trust: High  
Use: latest \+ historical \+ CSV ingestion  
Notes: official site exposes past draws and NC’s past-draw pages support CSV download patterns. 

NC Pick 4

Primary: NC official Pick 4 past draws page  
Trust: High  
Use: latest \+ historical \+ CSV ingestion  
Notes: treat the same way as Pick 3 in the pipeline; use official past-draw source first. The NC site’s past-draw pattern for these games is the strongest ingestion path. 

NC Cash 5

Primary: NC official Cash 5 past draws page  
Trust: High  
Use: latest \+ historical  
Notes: official Cash 5 pages expose recent/past draw data directly on NC Lottery pages. 

NC Powerball

Primary: NC official Powerball past draws page  
Trust: High  
Use: latest \+ historical \+ CSV ingestion  
Notes: NC explicitly says you may download a CSV file of past draws on the Powerball past page. 

NC Mega Millions

Primary: NC official Mega Millions past draws page  
Trust: High  
Use: latest \+ historical \+ CSV ingestion  
Notes: NC explicitly says you may download a CSV file of past draws on the Mega Millions past page. 

NC implementation recommendation:  
Build the NC ingestors directly against the official past-draw pages and CSV flow. NC is your cleanest source family and should remain the canonical template for the rest of the platform. 

\---

2\) California source matrix

CA Daily 3

Primary: California official Daily 3 page  
Trust: High for current/latest and on-page past results  
Use: latest results validation  
Notes: official page shows current winning numbers and states Daily 3 draws are twice daily. It includes a “Past Winning Numbers” section on the page, but I did not confirm a stable public CSV endpoint. 

Historical fallback: Lottery Post CA Daily 3 results archive  
Trust: Medium-high  
Use: historical backfill \+ verification sampling  
Notes: Lottery Post exposes CA results and historical navigation for Daily 3\. 

CA Daily 4

Primary: California official Daily 4 page  
Trust: High for current/latest and on-page past results  
Use: latest results validation  
Notes: official page shows current winning numbers and includes “Past Winning Numbers.” California draw-games listing confirms Daily 4 runs every day at 6:30 p.m. 

Historical fallback: Lottery Post CA Daily 4 archive  
Trust: Medium-high  
Use: historical backfill \+ verification sampling  
Notes: Lottery Post exposes Daily 4 historical results and stats/search tooling. 

CA Fantasy 5

Primary: California official Fantasy 5 page  
Trust: High for latest/current  
Use: latest results validation  
Notes: official page shows winning numbers and game details; CA draw-games listing confirms Fantasy 5 draws daily at 6:30 p.m. 

Historical fallback: Lottery Post CA Fantasy 5 past archive  
Trust: Medium-high  
Use: historical backfill \+ verification sampling  
Notes: Lottery Post provides deep past-result history for CA Fantasy 5\. 

CA implementation recommendation:  
For California, do not block the project waiting for a hidden CSV. Use the official game pages as the source of truth for latest draws and a trusted archive such as Lottery Post for historical backfill, then cross-check a sample of imported rows against the official pages. 

\---

3\) Normalized ingestion schema

Use one canonical table shape across NC and CA:

state  
game  
draw\_date  
draw\_time  
numbers  
bonus\_number  
multiplier  
source\_name  
source\_url  
source\_tier  
ingested\_at  
raw\_payload

Why this works:

NC and CA have different game naming and draw-time conventions.

Some games have bonus/multiplier fields and some do not.

Keeping source\_name, source\_url, and source\_tier will make audits much easier. The official pages clearly vary by game and state, especially between NC CSV-backed pages and CA page-rendered results. 

\---

4\) Build strategy for NemoTron

Phase D1 — North Carolina official ingestion

Implement:

nc\_pick3\_ingestor

nc\_pick4\_ingestor

nc\_cash5\_ingestor

nc\_powerball\_ingestor

nc\_mega\_ingestor

Use official pages first, and use CSV import where available. NC is already proving stable for you and should be the reference implementation. 

Phase D2 — California latest-results official parsers

Implement:

ca\_daily3\_official\_parser

ca\_daily4\_official\_parser

ca\_fantasy5\_official\_parser

These should parse the official pages for current/latest results and near-term validation. 

Phase D3 — California historical backfill adapters

Implement:

ca\_daily3\_history\_adapter

ca\_daily4\_history\_adapter

ca\_fantasy5\_history\_adapter

Backfill from a trusted archive, then compare spot checks against official results. 

Phase D4 — Verification layer

For each ingest job:

compare parsed row count vs expected row count

checksum normalized number string

store raw payload/html snapshot

mark source tier used

That matters especially for California, where official pages are human-facing and archive sources are serving as historical fallback. 

\---

5\) Trust scoring for BrewLotto

Use this internal trust model:

100 \= official site \+ direct CSV/export

90 \= official site page parse

75 \= trusted archive with cross-check

60 \= community dataset / unsupervised scrape

Applying that here:

NC Powerball / Mega Millions official CSV-backed pages: 100 

NC Cash 5 official pages: 90–100 depending on endpoint/export used 

CA official Daily 3 / Daily 4 / Fantasy 5 pages: 90 

Lottery Post CA historical archives: 75 until cross-checked 

\---

6\) Final PM recommendation

Your V1 ingestion stack should be:

North Carolina: official past-draw / CSV-first  
California latest: official game pages  
California historical: trusted archive \+ official spot-check validation

That gives you the fastest stable route to production without wasting cycles hunting undocumented California exports. 

Next strongest artifact is the NemoTron ingestion task order, broken into exact build tickets for NC \+ CA adapters.

# Ingestion Task Order

Here’s the NemoTron Ingestion Task Order for BrewLotto V1.

\---

BrewLotto — NemoTron Ingestion Task Order

Project: BrewLotto AI  
Phase: V1 Data Ingestion Execution  
Timestamp: 2026-03-17 ET  
Root: /brewexec/

Objective

Build a reliable ingestion system for:

North Carolina Pick 3

North Carolina Pick 4

North Carolina Cash 5

Powerball

Mega Millions

California Daily 3

California Daily 4

California Fantasy 5

The system must support:

historical backfill

scheduled updates

normalized storage

source trust logging

verification and replay

\---

Execution Rule

Build in this order only:

1\. shared ingestion foundation

2\. normalized schema

3\. NC official ingestors

4\. NC scheduler \+ verification

5\. CA official latest parsers

6\. CA historical adapters

7\. cross-source validation

8\. admin monitoring hooks

Do not start with scraping-first chaos.  
NC is the canonical model.

\---

Ticket D1 — Shared Ingestion Foundation

Goal

Create the reusable ingestion framework.

Deliverables

/lib/ingestion/  
  core/  
    fetcher.ts  
    parser.ts  
    normalizer.ts  
    validator.ts  
    checksum.ts  
    trustScore.ts  
    sourceRegistry.ts  
  jobs/  
  adapters/  
  utils/

Required modules

fetcher.ts

Handles:

HTTP fetch

retries

timeout control

user-agent headers

HTML/CSV/JSON handling

parser.ts

Handles:

CSV parsing

HTML table parsing

structured row extraction

normalizer.ts

Converts all source formats into one BrewLotto draw shape.

validator.ts

Checks:

required fields

valid number count

duplicate prevention

invalid date rejection

checksum.ts

Creates a stable row fingerprint.

Example:

checksum \= \`${state}|${game}|${draw\_date}|${draw\_time}|${numbers.join("-")}|${bonus ?? ""}\`;

trustScore.ts

Assign source trust:

100 \= official CSV

90 \= official page parse

75 \= trusted archive

60 \= community backup

sourceRegistry.ts

Central registry of all source configs.

\---

Ticket D2 — Canonical Schema

Goal

Create normalized storage tables.

Core table

create table lottery\_draws (  
  id uuid primary key default gen\_random\_uuid(),  
  state text not null,  
  game text not null,  
  draw\_date date not null,  
  draw\_time text,  
  numbers jsonb not null,  
  bonus\_number integer,  
  multiplier text,  
  source\_name text not null,  
  source\_url text,  
  source\_tier integer,  
  trust\_score integer,  
  checksum text unique not null,  
  raw\_payload jsonb,  
  ingested\_at timestamptz not null default now(),  
  created\_at timestamptz not null default now()  
);

Logging table

create table ingestion\_logs (  
  id uuid primary key default gen\_random\_uuid(),  
  source\_name text not null,  
  game text not null,  
  state text not null,  
  status text not null,  
  records\_fetched integer default 0,  
  records\_inserted integer default 0,  
  records\_skipped integer default 0,  
  error\_message text,  
  started\_at timestamptz not null default now(),  
  completed\_at timestamptz,  
  metadata jsonb default '{}'::jsonb  
);

Source registry table

create table ingestion\_sources (  
  id uuid primary key default gen\_random\_uuid(),  
  source\_key text unique not null,  
  state text not null,  
  game text not null,  
  source\_name text not null,  
  source\_url text,  
  source\_type text not null,  
  source\_tier integer not null,  
  trust\_score integer not null,  
  is\_active boolean not null default true,  
  notes text,  
  created\_at timestamptz not null default now()  
);

\---

Ticket D3 — NC Official Ingestors

Goal

Implement official NC ingestion first.

Build these adapters

/lib/ingestion/adapters/  
  ncPick3Official.ts  
  ncPick4Official.ts  
  ncCash5Official.ts  
  ncPowerballOfficial.ts  
  ncMegaOfficial.ts

Responsibilities

Each adapter must:

fetch official source

parse historical rows

normalize data

compute checksum

upsert into lottery\_draws

log run into ingestion\_logs

Standard output

type NormalizedDraw \= {  
  state: string;  
  game: string;  
  draw\_date: string;  
  draw\_time?: string | null;  
  numbers: number\[\];  
  bonus\_number?: number | null;  
  multiplier?: string | null;  
  source\_name: string;  
  source\_url?: string;  
  source\_tier: number;  
  trust\_score: number;  
  checksum: string;  
  raw\_payload?: unknown;  
};

Game mapping

NC\_PICK3

NC\_PICK4

NC\_CASH5

POWERBALL

MEGA\_MILLIONS

\---

Ticket D4 — NC Historical Backfill Runner

Goal

Create backfill support for all NC games.

Deliverables

/scripts/ingestion/  
  runNcBackfill.ts  
  runNcSingleGame.ts

Requirements

configurable date ranges

dry-run mode

dedupe-safe

resumable

logs inserted counts

writes failure report

CLI examples

pnpm tsx scripts/ingestion/runNcBackfill.ts  
pnpm tsx scripts/ingestion/runNcSingleGame.ts \--game=pick3

\---

Ticket D5 — Scheduler Layer

Goal

Automate recurring ingestion.

Deliverables

/lib/ingestion/jobs/  
  scheduleNcPick3.ts  
  scheduleNcPick4.ts  
  scheduleNcCash5.ts  
  schedulePowerball.ts  
  scheduleMega.ts  
  scheduleCaDaily3.ts  
  scheduleCaDaily4.ts  
  scheduleCaFantasy5.ts

Requirements

Each job must:

call adapter

prevent duplicate overlapping runs

write job result

support manual trigger

Recommended cadence

Pick 3 / Daily 3: twice daily

Pick 4 / Daily 4: twice daily

Cash 5 / Fantasy 5: nightly

Powerball / Mega Millions: draw days \+ nightly verification

\---

Ticket D6 — CA Official Latest Parsers

Goal

Parse official California latest draw surfaces.

Build these adapters

/lib/ingestion/adapters/  
  caDaily3Official.ts  
  caDaily4Official.ts  
  caFantasy5Official.ts

Scope

These adapters are for:

latest draw ingestion

near-term history if exposed on-page

validation source

Requirements

support page HTML parsing

extract draw date

extract draw time

extract numbers

persist raw HTML snapshot or parsed raw block

assign trust score 90

Game mapping

CA\_DAILY3

CA\_DAILY4

CA\_FANTASY5

\---

Ticket D7 — CA Historical Adapters

Goal

Backfill California history from trusted archive source.

Build these adapters

/lib/ingestion/adapters/  
  caDaily3History.ts  
  caDaily4History.ts  
  caFantasy5History.ts

Responsibilities

fetch archive pages

parse date-indexed rows

normalize format

assign trust score 75 by default

mark source tier 2

support batch page crawling

Rules

do not overwrite official rows unless explicitly authorized

if same checksum exists from official source, skip archive row

if archive row conflicts with official row, flag for review

\---

Ticket D8 — Cross-Source Validation Engine

Goal

Compare archive-ingested CA rows against official data samples.

Deliverables

/lib/ingestion/core/  
  compareSources.ts  
  auditDiff.ts

Validation checks

date equality

number equality

bonus equality if applicable

draw time consistency

duplicate row detection

Output

type SourceDiff \= {  
  state: string;  
  game: string;  
  draw\_date: string;  
  official\_numbers?: number\[\];  
  archive\_numbers?: number\[\];  
  status: "match" | "mismatch" | "missing\_official" | "missing\_archive";  
};

Admin behavior

store mismatches

expose review queue in BrewCommand later

\---

Ticket D9 — Source Registry Config

Goal

Centralize all ingest source definitions.

Deliverable

/lib/ingestion/core/sourceRegistry.ts

Example shape

export const INGESTION\_SOURCES \= {  
  nc\_pick3\_official: {  
    state: "NC",  
    game: "pick3",  
    tier: 1,  
    trustScore: 100,  
    sourceType: "official",  
  },  
  ca\_daily3\_official: {  
    state: "CA",  
    game: "daily3",  
    tier: 1,  
    trustScore: 90,  
    sourceType: "official-page",  
  },  
  ca\_daily3\_history: {  
    state: "CA",  
    game: "daily3",  
    tier: 2,  
    trustScore: 75,  
    sourceType: "trusted-archive",  
  },  
};

\---

Ticket D10 — Admin Monitoring Hooks

Goal

Prepare BrewCommand visibility for ingestion health.

Deliverables

/lib/admin/ingestion/  
  getIngestionHealth.ts  
  getRecentIngestionLogs.ts  
  getSourceMismatchQueue.ts

Data to expose

last successful run by source

failed jobs

inserted/skipped counts

mismatch queue

stale source warning

trust score summary

\---

Ticket D11 — Prediction Trigger Integration

Goal

Prepare ingestion to trigger downstream prediction workflows.

Rule

Prediction engine should run only after:

draw successfully inserted

validation passed

no checksum conflict

Deliverables

/lib/ingestion/core/  
  onDrawInserted.ts

Hook behavior

if (inserted && validated) {  
  triggerPredictionPipeline({ state, game, draw\_date });  
}

\---

Ticket D12 — Testing Layer

Goal

Make ingestion reliable before frontend depends on it.

Required test files

/tests/ingestion/  
  ncPick3Official.test.ts  
  ncPick4Official.test.ts  
  ncCash5Official.test.ts  
  ncPowerballOfficial.test.ts  
  ncMegaOfficial.test.ts  
  caDaily3Official.test.ts  
  caDaily4Official.test.ts  
  caFantasy5Official.test.ts  
  caDaily3History.test.ts  
  caDaily4History.test.ts  
  caFantasy5History.test.ts  
  validator.test.ts  
  checksum.test.ts  
  compareSources.test.ts

Test coverage

parser correctness

normalizer correctness

dedupe safety

invalid row rejection

source diff handling

checksum uniqueness

\---

Delivery Order Summary

Sprint 1

D1 Shared ingestion foundation

D2 Canonical schema

D3 NC official ingestors

Sprint 2

D4 NC backfill runner

D5 Scheduler layer

D12 NC tests

Sprint 3

D6 CA official latest parsers

D7 CA historical adapters

Sprint 4

D8 Cross-source validation

D9 Source registry

D10 Admin hooks

Sprint 5

D11 Prediction trigger integration

final hardening

mismatch review support

\---

Hard Rules for NemoTron

1\. NC is the gold-standard ingestion template

2\. California latest and California historical are separate adapters

3\. Never mix raw source formats directly into prediction logic

4\. Everything must normalize into one canonical schema

5\. All rows need checksums

6\. All jobs need logs

7\. No silent failures

8\. Raw payload snapshots must be preserved for audits

9\. Official sources always outrank archive sources

10\. Frontend must never depend on unvalidated source rows

\---

PM Final Directive

Start with:

D1

D2

D3

Do not touch CA history until NC official ingestion, logging, and dedupe are stable.

Once NC is stable, California becomes a controlled adapter problem instead of a moving-target ingestion mess.

If you want, I’ll format this next into a Gemini Execution Protocol / NemoTron handoff prompt so you can paste it directly into OpenCode.

# New Frontend Dashboard Enhancements

Yes — the second screenshot shows the current build is still a scaffold, not the polished mock.

Below is an updated app/page.tsx that gets much closer to the uploaded design:

glowing gold device shell

premium header treatment

pill tabs with active gold state

hot / cold cards with distinct styling

Powerball/Mega bonus ball support

taller glass-style momentum meter

richer prediction card

stronger CTA

better bottom utility rows

bot badge placeholder instead of the emoji orb

Replace your current file with this:

"use client";

import { useState } from "react";  
import {  
  Flame,  
  Snowflake,  
  Sparkles,  
  Mic,  
  Lock,  
  UserRound,  
  ArrowRight,  
} from "lucide-react";  
import {  
  GAME\_CONFIGS,  
  GameConfig,  
  GameKey,  
  getOrderedGames,  
} from "@/lib/brewlotto-games";

/\*\*  
 \* BrewLotto V1 mock UI  
 \* \--------------------------------------------------  
 \* This is intentionally visual-first so the frontend  
 \* matches the premium mock as closely as possible.  
 \* Swap mock data with Supabase/API data later.  
 \*/

const MOCK\_HOT: Record\<GameKey, number\[\]\> \= {  
  pick3: \[3, 1, 7\],  
  pick4: \[1, 2, 4, 9\],  
  cash5: \[3, 14, 29, 31, 40\],  
  powerball: \[3, 14, 29, 41, 52\],  
  mega: \[5, 16, 23, 42, 61\],  
};

const MOCK\_COLD: Record\<GameKey, number\[\]\> \= {  
  pick3: \[8, 9, 0\],  
  pick4: \[0, 8, 6, 5\],  
  cash5: \[2, 9, 33, 37, 43\],  
  powerball: \[1, 7, 22, 54, 69\],  
  mega: \[4, 18, 27, 55, 70\],  
};

const MOCK\_BONUS\_HOT: Partial\<Record\<GameKey, number\>\> \= {  
  powerball: 11,  
  mega: 10,  
};

const MOCK\_BONUS\_COLD: Partial\<Record\<GameKey, number\>\> \= {  
  powerball: 3,  
  mega: 2,  
};

const MOCK\_MOMENTUM: Record\<GameKey, number\> \= {  
  pick3: 72,  
  pick4: 64,  
  cash5: 58,  
  powerball: 49,  
  mega: 53,  
};

const DEFAULT\_GAME: GameKey \= "powerball";

export default function Page() {  
  const \[selectedGame, setSelectedGame\] \= useState\<GameKey\>(DEFAULT\_GAME);

  const config \= GAME\_CONFIGS\[selectedGame\];  
  const hot \= MOCK\_HOT\[selectedGame\] ?? \[\];  
  const cold \= MOCK\_COLD\[selectedGame\] ?? \[\];  
  const bonusHot \= MOCK\_BONUS\_HOT\[selectedGame\];  
  const bonusCold \= MOCK\_BONUS\_COLD\[selectedGame\];  
  const momentum \= MOCK\_MOMENTUM\[selectedGame\] ?? 50;

  return (  
    \<main className="min-h-screen bg-\[\#050505\] px-4 py-10 text-white"\>  
      \<div className="mx-auto flex min-h-\[calc(100vh-5rem)\] max-w-6xl items-center justify-center"\>  
        \<section className="relative w-full max-w-\[430px\]"\>  
          {/\* Outer aura \*/}  
          \<div className="pointer-events-none absolute \-inset-8 rounded-\[44px\] bg-\[radial-gradient(circle\_at\_center,rgba(255,184,28,0.20),transparent\_58%)\] blur-2xl" /\>

          {/\* Device shell \*/}  
          \<div className="relative overflow-hidden rounded-\[42px\] border border-\[\#ffbf3d\]/60 bg-\[\#0a0909\] shadow-\[0\_0\_0\_1px\_rgba(255,210,110,0.35),0\_0\_22px\_rgba(255,170,0,0.18),0\_0\_80px\_rgba(255,140,0,0.14)\]"\>  
            {/\* golden edge glow \*/}  
            \<div className="pointer-events-none absolute inset-0 rounded-\[42px\] ring-1 ring-\[\#ffd36f\]/25" /\>  
            \<div className="pointer-events-none absolute inset-\[1px\] rounded-\[41px\] shadow-\[inset\_0\_0\_24px\_rgba(255,179,0,0.10),inset\_0\_0\_60px\_rgba(255,140,0,0.06)\]" /\>  
            \<div className="pointer-events-none absolute left-0 right-0 top-0 h-40 bg-\[radial-gradient(circle\_at\_top,rgba(255,194,80,0.18),transparent\_65%)\]" /\>  
            \<div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-\[radial-gradient(circle\_at\_bottom,rgba(255,170,0,0.14),transparent\_70%)\]" /\>

            \<div className="relative px-5 pb-6 pt-6 sm:px-6"\>  
              \<Header /\>

              \<div className="mt-6"\>  
                \<SectionKicker /\>  
              \</div\>

              \<div className="mt-3"\>  
                \<GameTabs selected={selectedGame} onChange={setSelectedGame} /\>  
              \</div\>

              \<div className="mt-6 grid grid-cols-\[1.9fr\_0.85fr\] gap-4"\>  
                \<div className="space-y-4"\>  
                  \<StatCard  
                    title="Hot Numbers"  
                    tone="hot"  
                    icon={\<Flame className="h-4 w-4" /\>}  
                  \>  
                    \<NumberPanel  
                      config={config}  
                      primary={hot}  
                      bonus={bonusHot}  
                      tone="hot"  
                    /\>  
                  \</StatCard\>

                  \<StatCard  
                    title="Cold Numbers"  
                    tone="cold"  
                    icon={\<Snowflake className="h-4 w-4" /\>}  
                  \>  
                    \<NumberPanel  
                      config={config}  
                      primary={cold}  
                      bonus={bonusCold}  
                      tone="cold"  
                    /\>  
                  \</StatCard\>  
                \</div\>

                \<MomentumCard value={momentum} /\>  
              \</div\>

              \<div className="mt-4"\>  
                \<PredictionCard config={config} /\>  
              \</div\>

              \<div className="mt-4"\>  
                \<button className="group relative flex h-\[74px\] w-full items-center justify-center rounded-\[999px\] border border-\[\#ffd978\]/80 bg-\[linear-gradient(180deg,\#ffcf4a\_0%,\#ffba19\_55%,\#f6a800\_100%)\] px-6 text-\[18px\] font-bold text-black shadow-\[0\_0\_0\_2px\_rgba(255,200,60,0.12),0\_10px\_35px\_rgba(255,170,0,0.35),inset\_0\_1px\_0\_rgba(255,255,255,0.45)\] transition duration-200 hover:scale-\[1.01\]"\>  
                  \<span className="absolute inset-\[2px\] rounded-\[999px\] bg-\[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.02))\]" /\>  
                  \<span className="relative flex items-center gap-3"\>  
                    Generate My Smart Pick  
                    \<ArrowRight className="h-6 w-6 transition group-hover:translate-x-1" /\>  
                  \</span\>  
                \</button\>  
              \</div\>

              \<div className="mt-5 grid grid-cols-2 gap-4"\>  
                \<UtilityPill icon={\<UserRound className="h-5 w-5" /\>} label="My Picks" /\>  
                \<UtilityPill icon={\<Lock className="h-5 w-5" /\>} label="Strategy Locker" /\>  
              \</div\>

              \<div className="mt-5"\>  
                \<VoiceCard /\>  
              \</div\>  
            \</div\>  
          \</div\>  
        \</section\>  
      \</div\>  
    \</main\>  
  );  
}

function Header() {  
  return (  
    \<header className="flex items-start justify-between gap-4"\>  
      \<div className="min-w-0"\>  
        \<div className="flex items-center gap-2 text-\[11px\] uppercase tracking-\[0.28em\] text-\[\#f0c46b\]"\>  
          \<span className="inline-block h-\[2px\] w-4 rounded-full bg-\[\#f0b63f\]" /\>  
          \<span\>BrewVerse Labs\</span\>  
        \</div\>

        \<h1 className="mt-3 text-\[42px\] font-black uppercase tracking-wide text-\[\#ffc742\] drop-shadow-\[0\_0\_18px\_rgba(255,184,28,0.45)\] sm:text-\[46px\]"\>  
          BREWLOTTO  
        \</h1\>

        \<div className="mt-2 h-\[3px\] w-\[180px\] rounded-full bg-\[linear-gradient(90deg,rgba(255,200,72,0.9),rgba(255,170,0,0.5),transparent)\] shadow-\[0\_0\_14px\_rgba(255,180,0,0.65)\]" /\>  
      \</div\>

      \<BotBadge /\>  
    \</header\>  
  );  
}

function BotBadge() {  
  return (  
    \<div className="relative mt-1 flex h-\[88px\] w-\[88px\] shrink-0 items-center justify-center"\>  
      \<div className="absolute inset-0 rounded-full border-\[5px\] border-\[\#ffd12d\] shadow-\[0\_0\_22px\_rgba(255,195,0,0.45)\]" /\>  
      \<div className="absolute right-0 top-2 h-4 w-4 rotate-12 rounded-sm bg-\[linear-gradient(180deg,\#ffe54f,\#ffb800)\] shadow-\[0\_0\_14px\_rgba(255,208,0,0.5)\]" /\>  
      \<div className="absolute inset-\[10px\] flex items-center justify-center rounded-full bg-\[radial-gradient(circle\_at\_30%\_20%,\#28d2ff,\#0952aa\_60%,\#051833\_100%)\] shadow-\[inset\_0\_1px\_12px\_rgba(255,255,255,0.15),0\_10px\_24px\_rgba(0,0,0,0.45)\]"\>  
        \<div className="relative flex h-\[48px\] w-\[56px\] items-center justify-center rounded-\[18px\] bg-\[linear-gradient(180deg,\#1ba4df,\#0e5dbc)\] shadow-\[inset\_0\_2px\_6px\_rgba(255,255,255,0.18)\]"\>  
          \<div className="absolute \-top-3 h-3 w-3 rounded-full bg-\[\#19a5ff\]" /\>  
          \<div className="absolute \-top-\[8px\] h-6 w-\[2px\] bg-\[\#1ca8ff\]" /\>  
          \<div className="flex gap-3"\>  
            \<span className="h-2.5 w-2.5 rounded-full bg-white shadow-\[0\_0\_8px\_rgba(255,255,255,0.9)\]" /\>  
            \<span className="h-2.5 w-2.5 rounded-full bg-white shadow-\[0\_0\_8px\_rgba(255,255,255,0.9)\]" /\>  
          \</div\>  
        \</div\>  
      \</div\>  
    \</div\>  
  );  
}

function SectionKicker() {  
  return (  
    \<div className="text-\[12px\] font-medium uppercase tracking-\[0.22em\] text-\[\#d6d1cf\]"\>  
      Today\&apos;s Draw Insights  
    \</div\>  
  );  
}

function GameTabs({  
  selected,  
  onChange,  
}: {  
  selected: GameKey;  
  onChange: (key: GameKey) \=\> void;  
}) {  
  const games \= getOrderedGames();

  return (  
    \<nav className="flex flex-wrap gap-3"\>  
      {games.map((game) \=\> {  
        const active \= game.key \=== selected;

        return (  
          \<button  
            key={game.key}  
            onClick={() \=\> onChange(game.key)}  
            className={\[  
              "relative rounded-full px-5 py-3 text-\[15px\] font-medium transition-all duration-200",  
              "border",  
              active  
                ? "border-\[\#ffcd52\] bg-\[linear-gradient(180deg,\#6a4700\_0%,\#c48714\_28%,\#ffb61d\_100%)\] text-\[\#fff4c4\] shadow-\[0\_0\_0\_1px\_rgba(255,205,82,0.15),0\_0\_20px\_rgba(255,182,29,0.35),inset\_0\_1px\_0\_rgba(255,255,255,0.25)\]"  
                : "border-white/10 bg-\[linear-gradient(180deg,rgba(30,27,27,0.96),rgba(14,12,12,0.96))\] text-white/90 shadow-\[inset\_0\_1px\_0\_rgba(255,255,255,0.04)\] hover:border-\[\#f3bc57\]/40 hover:text-white",  
            \].join(" ")}  
          \>  
            {game.label}  
            {active && (  
              \<span className="absolute left-1/2 top-full h-\[4px\] w-10 \-translate-x-1/2 rounded-full bg-\[\#ffbe27\] shadow-\[0\_0\_12px\_rgba(255,190,39,0.95)\]" /\>  
            )}  
          \</button\>  
        );  
      })}  
    \</nav\>  
  );  
}

function StatCard({  
  title,  
  icon,  
  tone,  
  children,  
}: {  
  title: string;  
  icon: React.ReactNode;  
  tone: "hot" | "cold";  
  children: React.ReactNode;  
}) {  
  const titleTone \=  
    tone \=== "hot"  
      ? "text-\[\#ffbd39\] drop-shadow-\[0\_0\_12px\_rgba(255,181,54,0.35)\]"  
      : "text-\[\#72caff\] drop-shadow-\[0\_0\_12px\_rgba(61,170,255,0.28)\]";

  const borderTone \=  
    tone \=== "hot"  
      ? "border-\[\#ffb84a\]/25 shadow-\[inset\_0\_0\_30px\_rgba(255,153,0,0.03)\]"  
      : "border-\[\#58a9ff\]/20 shadow-\[inset\_0\_0\_30px\_rgba(40,110,255,0.03)\]";

  return (  
    \<div  
      className={\[  
        "relative overflow-hidden rounded-\[30px\] border bg-\[linear-gradient(180deg,rgba(18,14,14,0.96),rgba(8,8,10,0.96))\] p-5",  
        borderTone,  
      \].join(" ")}  
    \>  
      \<div className="pointer-events-none absolute inset-0 bg-\[radial-gradient(circle\_at\_top\_left,rgba(255,180,0,0.08),transparent\_36%)\]" /\>  
      \<div className="flex items-center gap-2"\>  
        \<span className={titleTone}\>{icon}\</span\>  
        \<h2 className={\`text-\[16px\] font-semibold ${titleTone}\`}\>{title}\</h2\>  
      \</div\>

      \<div className="mt-5"\>{children}\</div\>  
    \</div\>  
  );  
}

function NumberPanel({  
  config,  
  primary,  
  bonus,  
  tone,  
}: {  
  config: GameConfig;  
  primary: number\[\];  
  bonus?: number;  
  tone: "hot" | "cold";  
}) {  
  const showBonus \= config.hasBonus && typeof bonus \=== "number";

  return (  
    \<div\>  
      \<div className="flex flex-wrap gap-3"\>  
        {primary.slice(0, config.primaryCount).map((n, idx) \=\> (  
          \<LotteryBall key={\`${tone}-${idx}-${n}\`} value={n} tone={tone} /\>  
        ))}  
      \</div\>

      {showBonus && (  
        \<div className="mt-4 flex justify-center"\>  
          \<LotteryBall  
            value={bonus}  
            tone={tone}  
            variant="bonus"  
            label={config.bonusLabel ?? "Bonus"}  
          /\>  
        \</div\>  
      )}  
    \</div\>  
  );  
}

function LotteryBall({  
  value,  
  tone,  
  variant \= "primary",  
  label,  
}: {  
  value: number;  
  tone: "hot" | "cold";  
  variant?: "primary" | "bonus";  
  label?: string;  
}) {  
  const isBonus \= variant \=== "bonus";

  const outerClass \= isBonus  
    ? tone \=== "hot"  
      ? "bg-\[radial-gradient(circle\_at\_30%\_30%,\#ffb978\_0%,\#ff6230\_35%,\#c01600\_100%)\] shadow-\[0\_0\_20px\_rgba(255,87,34,0.45),inset\_0\_2px\_10px\_rgba(255,255,255,0.18)\]"  
      : "bg-\[radial-gradient(circle\_at\_30%\_30%,\#7fe6ff\_0%,\#1ea6ff\_42%,\#0049c6\_100%)\] shadow-\[0\_0\_20px\_rgba(47,156,255,0.42),inset\_0\_2px\_10px\_rgba(255,255,255,0.16)\]"  
    : tone \=== "hot"  
    ? "bg-\[radial-gradient(circle\_at\_30%\_25%,\#fff3a1\_0%,\#ffd449\_35%,\#f0a300\_78%,\#b96d00\_100%)\] shadow-\[0\_0\_18px\_rgba(255,188,44,0.42),inset\_0\_3px\_12px\_rgba(255,255,255,0.24)\]"  
    : "bg-\[radial-gradient(circle\_at\_30%\_25%,\#ffffff\_0%,\#caecff\_30%,\#8fcfff\_62%,\#4a9cdb\_100%)\] shadow-\[0\_0\_18px\_rgba(102,197,255,0.30),inset\_0\_3px\_12px\_rgba(255,255,255,0.22)\]";

  const textTone \= isBonus ? "text-white" : "text-\[\#121212\]";  
  const sizeClass \= isBonus ? "h-\[74px\] w-\[74px\] text-\[30px\]" : "h-\[70px\] w-\[70px\] text-\[28px\]";

  return (  
    \<div className="flex flex-col items-center"\>  
      \<div  
        className={\[  
          "relative flex items-center justify-center rounded-full border border-white/15 font-black tracking-tight",  
          sizeClass,  
          outerClass,  
          textTone,  
        \].join(" ")}  
      \>  
        \<span className="absolute inset-\[3px\] rounded-full bg-\[radial-gradient(circle\_at\_top,rgba(255,255,255,0.22),transparent\_55%)\]" /\>  
        \<span className="relative"\>{value}\</span\>  
      \</div\>

      {label && (  
        \<div  
          className={\[  
            "mt-2 rounded-full px-4 py-1 text-\[11px\] font-semibold uppercase tracking-wide text-white shadow-\[inset\_0\_1px\_0\_rgba(255,255,255,0.18)\]",  
            tone \=== "hot"  
              ? "bg-\[linear-gradient(180deg,\#80331d,\#c75a2d)\]"  
              : "bg-\[linear-gradient(180deg,\#12618b,\#1c9be0)\]",  
          \].join(" ")}  
        \>  
          {label}  
        \</div\>  
      )}  
    \</div\>  
  );  
}

function MomentumCard({ value }: { value: number }) {  
  const clamped \= Math.max(0, Math.min(100, value));

  return (  
    \<div className="relative overflow-hidden rounded-\[30px\] border border-\[\#ffb84a\]/25 bg-\[linear-gradient(180deg,rgba(18,14,14,0.96),rgba(8,8,10,0.96))\] p-5 shadow-\[inset\_0\_0\_30px\_rgba(255,153,0,0.03)\]"\>  
      \<div className="pointer-events-none absolute inset-0 bg-\[radial-gradient(circle\_at\_bottom,rgba(255,180,0,0.08),transparent\_42%)\]" /\>

      \<h2 className="text-\[16px\] font-semibold text-\[\#ffcf67\]"\>Momentum Meter\</h2\>

      \<div className="mt-6 flex flex-col items-center"\>  
        \<div className="relative flex h-\[340px\] w-\[82px\] items-end justify-center rounded-\[40px\] border border-\[\#33281c\] bg-\[linear-gradient(180deg,\#0f0b0a,\#171111\_40%,\#0e0909)\] p-\[10px\] shadow-\[inset\_0\_0\_22px\_rgba(0,0,0,0.75)\]"\>  
          \<div className="absolute inset-y-5 left-3 w-\[1px\] bg-\[linear-gradient(180deg,transparent,rgba(255,170,0,0.15),transparent)\]" /\>  
          \<div className="absolute inset-y-5 right-3 w-\[1px\] bg-\[linear-gradient(180deg,transparent,rgba(255,170,0,0.15),transparent)\]" /\>

          \<div className="relative h-full w-\[26px\] overflow-hidden rounded-full border border-\[\#1b130f\] bg-\[linear-gradient(180deg,\#070606,\#120d0c)\] shadow-\[inset\_0\_0\_12px\_rgba(0,0,0,0.8)\]"\>  
            \<div  
              className="absolute bottom-0 left-0 right-0 rounded-full bg-\[linear-gradient(180deg,\#ffd95a\_0%,\#ffb31f\_30%,\#ff8a00\_70%,\#ff6500\_100%)\] shadow-\[0\_0\_18px\_rgba(255,153,0,0.45)\]"  
              style={{ height: \`${clamped}%\` }}  
            /\>  
            \<div className="absolute inset-x-\[35%\] bottom-0 w-\[30%\] rounded-full bg-\[linear-gradient(180deg,rgba(255,255,255,0.0),rgba(255,244,180,0.75),rgba(255,255,255,0.0))\]" /\>  
            \<div className="absolute inset-0 bg-\[radial-gradient(circle\_at\_center,rgba(255,214,84,0.08),transparent\_60%)\]" /\>  
          \</div\>  
        \</div\>

        \<div className="mt-6 text-center"\>  
          \<div className="text-\[52px\] font-semibold leading-none text-\[\#ffcf68\] drop-shadow-\[0\_0\_12px\_rgba(255,190,39,0.32)\]"\>  
            {clamped}%  
          \</div\>  
          \<div className="mt-1 text-\[16px\] text-white/75"\>Win Probability\</div\>  
        \</div\>  
      \</div\>  
    \</div\>  
  );  
}

function PredictionCard({ config }: { config: GameConfig }) {  
  return (  
    \<div className="relative overflow-hidden rounded-\[30px\] border border-\[\#ffb84a\]/22 bg-\[linear-gradient(180deg,rgba(18,14,14,0.96),rgba(8,8,10,0.96))\] p-5"\>  
      \<div className="pointer-events-none absolute right-0 top-0 h-36 w-36 bg-\[radial-gradient(circle,rgba(255,174,0,0.10),transparent\_55%)\]" /\>  
      \<div className="pointer-events-none absolute bottom-0 right-0 h-28 w-28 bg-\[radial-gradient(circle,rgba(255,174,0,0.08),transparent\_58%)\]" /\>

      \<div className="flex items-center gap-2"\>  
        \<Sparkles className="h-4 w-4 text-\[\#cc83ff\]" /\>  
        \<h2 className="text-\[16px\] font-semibold text-\[\#e2b7ff\]"\>Prediction\</h2\>  
      \</div\>

      \<p className="mt-5 text-\[15px\] leading-8 text-white/88"\>  
        Brew says today\&apos;s pattern for{" "}  
        \<span className="font-bold text-\[\#ffd364\]"\>{config.label}\</span\> favors{" "}  
        \<span className="font-bold text-\[\#ffd364\]"\>low \&amp; even\</span\> numbers,  
        recent \<span className="font-bold text-\[\#ffce5c\]"\>hot streaks\</span\>, and  
        overdue positions.  
      \</p\>  
    \</div\>  
  );  
}

function UtilityPill({  
  icon,  
  label,  
}: {  
  icon: React.ReactNode;  
  label: string;  
}) {  
  return (  
    \<button className="flex h-\[62px\] items-center justify-center gap-3 rounded-full border border-white/10 bg-\[linear-gradient(180deg,rgba(28,23,23,0.96),rgba(10,10,10,0.96))\] px-5 text-\[16px\] font-medium text-\[\#f3dfb0\] shadow-\[inset\_0\_1px\_0\_rgba(255,255,255,0.05)\] transition hover:border-\[\#ffbf47\]/30 hover:text-white"\>  
      \<span className="text-\[\#f3cb69\]"\>{icon}\</span\>  
      \<span\>{label}\</span\>  
    \</button\>  
  );  
}

function VoiceCard() {  
  return (  
    \<div className="flex items-center justify-between gap-4 rounded-\[28px\] border border-\[\#ffb84a\]/20 bg-\[linear-gradient(180deg,rgba(18,14,14,0.96),rgba(8,8,10,0.96))\] px-5 py-4 shadow-\[inset\_0\_0\_25px\_rgba(255,153,0,0.03)\]"\>  
      \<div className="flex min-w-0 items-center gap-3"\>  
        \<div className="flex h-11 w-11 items-center justify-center rounded-full border border-\[\#ffce61\]/25 bg-\[radial-gradient(circle,\#2a2017,\#120f0f)\] text-\[\#ffcb60\]"\>  
          \<Mic className="h-5 w-5" /\>  
        \</div\>

        \<div className="min-w-0"\>  
          \<div className="text-\[16px\] font-semibold text-\[\#ffcf68\]"\>Voice Mode\</div\>  
          \<div className="mt-1 text-\[14px\] text-white/70"\>  
            Tap to let Brew narrate the odds in real time.  
          \</div\>  
        \</div\>  
      \</div\>

      \<button className="relative flex h-\[72px\] w-\[72px\] shrink-0 items-center justify-center rounded-full border border-\[\#ffe08e\]/70 bg-\[radial-gradient(circle\_at\_35%\_30%,\#ffe685\_0%,\#ffc926\_45%,\#eea700\_82%,\#b16e00\_100%)\] text-black shadow-\[0\_0\_0\_2px\_rgba(255,220,120,0.12),0\_0\_28px\_rgba(255,187,0,0.40),inset\_0\_2px\_10px\_rgba(255,255,255,0.28)\]"\>  
        \<Mic className="h-8 w-8" /\>  
        \<span className="absolute \-left-5 top-1/2 h-6 w-6 \-translate-y-1/2 rounded-full border-l-2 border-\[\#ffcb55\]/60 opacity-70" /\>  
        \<span className="absolute \-left-9 top-1/2 h-9 w-9 \-translate-y-1/2 rounded-full border-l-2 border-\[\#ffcb55\]/40 opacity-50" /\>  
      \</button\>  
    \</div\>  
  );  
}

What changed from your current version

This version fixes the biggest visual gaps:

removes the emoji-only orb and uses a bot-style badge

changes tabs from underlined text to real Figma-style pills

makes hot and cold balls actually different

adds centered bonus balls with labels

upgrades the meter into a tall premium tube

gives the CTA the gold hero-button feel

upgrades voice mode and utility pills

strengthens the full device shell and glow

Two small notes before you drop it in

Your current getOrderedGames() may be returning labels in a different order than the mock. If needed, force the tab order inside GameTabs like this:

const orderedKeys: GameKey\[\] \= \["pick3", "pick4", "cash5", "powerball", "mega"\];  
const games \= orderedKeys.map(

# Frontend API

\<\!--  
/brewexec/brewdocs/BREWLOTTO\_V1\_FRONTEND\_API\_MAPPING.md  
Timestamp: 2026-03-18 ET  
Phase: V1 Reset / Frontend API Mapping  
Purpose: Final implementation-facing map of which BrewLotto V1 frontend surfaces call which backend APIs, what each route returns, and what must exist before dashboard/frontend work proceeds.  
\--\>BrewLotto AI — V1 Frontend API Mapping

1\. Purpose

This document is the frontend-to-backend wiring map for BrewLotto V1.

It answers:

which frontend screen calls which API

what payload each API should return

what data is required for the new dashboard design

what can be stubbed temporarily

what is launch-critical vs post-launch

This is the final implementation bridge between the BrewDocs architecture set and active frontend coding.

\---

2\. Short Answer

Yes — this was the last major missing implementation artifact.

The product specs, DB, ingestion, prediction, billing, testing, admin, trust, and UI architecture are already defined.

What was still missing was the exact frontend API contract map so NemoTron or any builder can wire the UI without guessing.

\---

3\. Core Frontend Surfaces

The V1 frontend has these primary surfaces:

1\. Dashboard

2\. Generate Pick flow

3\. My Picks

4\. Today’s Results

5\. Strategy Locker

6\. Notifications

7\. Profile / Settings

8\. Subscription / Billing

9\. BrewCommand Admin

\---

4\. Dashboard API Map

4.1 Dashboard Shell Load

Frontend surface

/dashboard

Needed APIs

GET /api/games

GET /api/stats/{gameKey}

GET /api/profile/me

GET /api/notifications?limit=5 (optional badge/notification preview)

Purpose

Populate:

game tabs

selected game metadata

hot numbers

cold numbers

momentum meter

prediction teaser copy

user tier context

Minimum dashboard response contract from stats endpoint

{  
  "gameKey": "powerball",  
  "label": "Powerball",  
  "stateScope": \["NC", "CA"\],  
  "latestDraw": {  
    "drawDate": "2026-03-18",  
    "primaryNumbers": \[3, 14, 29, 41, 52\],  
    "bonusNumbers": \[11\]  
  },  
  "hotNumbers": \[3, 14, 29, 41, 52\],  
  "coldNumbers": \[1, 7, 22, 54, 69\],  
  "bonusHot": 11,  
  "bonusCold": 3,  
  "momentum": 49,  
  "predictionTeaser": "Brew says today's pattern favors low and even numbers, recent hot streaks, and overdue positions.",  
  "freshness": {  
    "status": "healthy",  
    "lastUpdatedAt": "2026-03-18T18:25:00Z"  
  }  
}

Launch-critical

Yes

\---

5\. Generate Pick API Map

5.1 Generate Smart Pick

Frontend surface

Dashboard CTA

Pick Generator flow

Needed API

POST /api/predict

Request contract

{  
  "gameKey": "powerball",  
  "stateCode": "NC",  
  "count": 1,  
  "explanationDepth": "short",  
  "source": "dashboard"  
}

Response contract

{  
  "predictionId": "pred\_123",  
  "gameKey": "powerball",  
  "targetDrawDate": "2026-03-19",  
  "primaryNumbers": \[6, 18, 27, 44, 61\],  
  "bonusNumbers": \[12\],  
  "confidenceBand": "moderate",  
  "strategyLabel": "Momentum \+ Hot/Cold Blend",  
  "explanation": {  
    "type": "template",  
    "content": "This pick balances recent hot activity with overdue recovery and a moderate spread profile."  
  },  
  "evidence": {  
    "hotSignals": \[18, 44\],  
    "overdueSignals": \[6, 61\],  
    "momentumScore": 0.67  
  },  
  "entitlement": {  
    "tierCode": "pro",  
    "premiumExplanationUsed": false  
  }  
}

Launch-critical

Yes

\---

6\. Save Pick / Log Pick API Map

6.1 Save Pick

Frontend surface

prediction result card

my picks flow

Needed API

POST /api/picks/save

Request

{  
  "predictionId": "pred\_123",  
  "label": "Tonight PB Pick"  
}

Response

{  
  "savedPickId": "sp\_123",  
  "status": "saved"  
}

Launch-critical

Yes

\---

6.2 Log Played Pick

Frontend surface

my picks

today’s results comparison flow

Needed API

POST /api/picks/log

Request

{  
  "gameKey": "powerball",  
  "stateCode": "NC",  
  "targetDrawDate": "2026-03-19",  
  "primaryNumbers": \[6, 18, 27, 44, 61\],  
  "bonusNumbers": \[12\],  
  "wagerAmount": 2.0,  
  "ticketCount": 1,  
  "predictionId": "pred\_123"  
}

Response

{  
  "playLogId": "pl\_123",  
  "status": "logged"  
}

Launch-critical

Yes

\---

7\. My Picks API Map

7.1 My Picks List

Frontend surface

/my-picks

Needed API

GET /api/picks?range=today

GET /api/picks?range=recent

Response contract

{  
  "items": \[  
    {  
      "savedPickId": "sp\_123",  
      "predictionId": "pred\_123",  
      "gameKey": "pick4",  
      "targetDrawDate": "2026-03-18",  
      "numbers": \[1, 2, 4, 9\],  
      "status": "pending"  
    }  
  \]  
}

Launch-critical

Yes

\---

8\. Today’s Results API Map

8.1 Today’s Results / Draw Center

Frontend surface

/results

avatar dropdown → Today’s Results

Needed APIs

GET /api/draws/today?state=NC

GET /api/draws/today?state=CA

GET /api/results/me?date=today

Purpose

Populate:

latest draw cards by game

user pick hit/miss comparison

daily performance strip

Brew insight block

Results response contract

{  
  "date": "2026-03-18",  
  "games": \[  
    {  
      "gameKey": "pick3",  
      "stateCode": "NC",  
      "draws": \[  
        {  
          "window": "midday",  
          "numbers": \[3, 1, 7\]  
        },  
        {  
          "window": "evening",  
          "numbers": \[8, 2, 4\]  
        }  
      \],  
      "userPicks": \[  
        {  
          "numbers": \[3, 1, 7\],  
          "result": "hit"  
        },  
        {  
          "numbers": \[2, 4, 9\],  
          "result": "miss"  
        }  
      \]  
    }  
  \],  
  "performance": {  
    "picksPlayed": 5,  
    "hits": 1,  
    "accuracy": 20,  
    "streakDays": 2  
  },  
  "brewInsight": "Your positional strategy is trending upward."  
}

Launch-critical

Yes

\---

9\. Strategy Locker API Map

9.1 Strategy Glossary / Learning Surface

Frontend surface

/strategy-locker

Needed APIs

GET /api/brewu/strategies

GET /api/brewu/lessons

GET /api/badges/me

Purpose

Populate:

strategy cards

explanations

lesson progress

badge-linked learning hooks

Launch-critical

Medium Can launch lean with static content if needed.

\---

10\. Notifications API Map

10.1 Notifications Center

Frontend surface

/notifications

avatar dropdown → Notifications

Needed APIs

GET /api/notifications

POST /api/notifications/read

Launch-critical

Medium Core in-app notifications should exist, but advanced filtering can wait.

\---

11\. Profile / Settings API Map

11.1 Profile

Frontend surface

avatar dropdown → Profile

/account

Needed APIs

GET /api/profile/me

PATCH /api/profile/me

GET /api/profile/preferences

PATCH /api/profile/preferences

Expected fields

display name

avatar

home state

default game

voice mode enabled

notification preferences

education mode

Launch-critical

Yes

\---

12\. Subscription / Billing API Map

12.1 Pricing and Upgrade Flow

Frontend surface

/pricing

avatar dropdown → Subscription / Billing

Needed APIs

GET /api/billing/plans

POST /api/billing/checkout

GET /api/billing/subscription

POST /api/billing/portal

Launch-critical

Yes

\---

13\. Admin / BrewCommand API Map

13.1 Internal Admin

Frontend surface

/admin

Needed APIs

GET /api/admin/ingestion

GET /api/admin/predictions

GET /api/admin/audits

GET /api/admin/feature-flags

POST /api/admin/ingestion/retry

Launch-critical

Minimal version required before production launch

\---

14\. New Dashboard Design → Exact API Needs

For the new dashboard frontend, the minimum live data needed is:

1\. selected game metadata

2\. hot numbers

3\. cold numbers

4\. bonus hot/cold where applicable

5\. momentum percentage

6\. prediction teaser copy

7\. freshness timestamp/status

8\. entitlement/tier snapshot

That means the frontend should not wait on every subsystem.

A strong first dashboard can launch with:

/api/games

/api/stats/{gameKey}

/api/profile/me

/api/predict

/api/picks/save

That is enough to start the true frontend build.

\---

15\. Temporary Stub Guidance

Allowed temporary stubs while Phase 3 D7 is finishing:

static profile name/avatar

temporary notification count

static strategy locker lesson list

placeholder billing plans in local JSON until Stripe route is wired

Not allowed for dashboard launch path:

fake live draw data once ingestion is available

fake prediction payloads once /api/predict is live

fake results data on the Today’s Results page once settlement/draw endpoints exist

\---

16\. Recommended Immediate Build Order for Frontend Coding

Since you are in Phase 3 around D7 ingestion/CA data, frontend should start in this order:

Batch 1

GET /api/games

GET /api/stats/{gameKey}

dashboard UI shell

Batch 2

POST /api/predict

prediction result render

POST /api/picks/save

Batch 3

GET /api/profile/me

avatar dropdown

profile/settings shell

Batch 4

GET /api/draws/today

GET /api/results/me

Today’s Results page

Batch 5

billing routes

notifications

strategy locker feeds

\---

17\. Final Decision

Yes — the missing piece was the frontend API mapping, not more architecture.

You are covered on:

backend architecture

data design

prediction design

AI routing

trust/compliance

admin scope

What NemoTron needed last was this exact frontend wiring map.

\---

18\. BrewDocs Summary

What this doc does: Defines exactly which APIs feed each BrewLotto V1 frontend surface and what each response contract should look like.

What it prevents: Frontend guesswork, mismatched payloads, and wasted time during active build.

What it enables: Immediate dashboard/frontend execution while Phase 3 ingestion work is still in motion.

Yes — that was the missing last-mile doc.

I created the final canvas: /brewexec/brewdocs/BREWLOTTO\_V1\_FRONTEND\_API\_MAPPING.md

What it gives you:

exact frontend surface → API route mapping

request/response contracts

minimum live data needed for the new dashboard

which endpoints are launch-critical

what can be stubbed temporarily while D7 finishes

the immediate frontend build order from where you are now

Most important point: for the new dashboard frontend, you only really need this first batch to start coding now:

GET /api/games

GET /api/stats/{gameKey}

POST /api/predict

POST /api/picks/save

GET /api/profile/me

That means you do not need to wait for every feature before beginning frontend.

From your current phase, the recommended order is:

Batch 1: games \+ stats \+ dashboard shell

Batch 2: predict \+ save pick

Batch 3: profile/avatar dropdown

Batch 4: today’s results endpoints

Batch 5: billing, notifications, strategy locker

So yes — you were covered on backend architecture, but this frontend API wiring map was the last missing execution artifact before active frontend build.

# Avatar Profile Drop Down (Global Hub)

You’re thinking about exactly the right thing — this is where BrewLotto becomes a real product experience, not just a tool.

Right now:

you have ingestion ✅

you’re building prediction ✅

you defined gamification ✅

👉 What’s missing is the User Control \+ Daily Intelligence Layer (UX surface)

Let’s define this clean so NemoTron can build it without guessing.

\---

🧭 1\. Profile Dropdown (Global User Control Hub)

This is your top-right avatar menu — but it should NOT be basic.

Recommended Structure

\[ Avatar / Username ▼ \]

→ Profile  
→ My Picks (IMPORTANT 🔥)  
→ Today's Results (NEW 🔥🔥🔥)  
→ Stats & Performance  
→ Strategy Locker  
→ Notifications  
→ Settings  
→ Subscription / Billing  
→ Help / Learn  
→ Terms & Privacy  
→ Logout

Note: "Missions & Achievements" has been deferred to V2 and removed from the V1 dropdown structure.

\---

🔥 2\. The Missing Piece You Identified (Critical)

\> “users can see what numbers was played for that day”

👉 This is NOT a profile feature

👉 This is a core product feature

You need a dedicated page:

🎯 “Today’s Results” (or “Draw Center”)

This is where BrewLotto becomes alive daily

\---

📊 Today’s Results Page (Core UX)

Layout

\---------------------------------  
📅 Today’s Results (Auto Date)  
\---------------------------------

🎰 Pick 3 (NC / CA)  
Midday: 3-1-7  
Evening: 8-2-4

🎰 Pick 4  
Midday: 1-2-4-9  
Evening: 7-3-5-1

🎰 Cash 5  
Numbers: 3-14-29-31-40

🎰 Powerball  
Numbers: 3-14-29-41-52  
Powerball: 12

🎰 Mega Millions  
Numbers: 5-16-23-42-61  
Mega Ball: 18  
\---------------------------------

\---

🔥 Enhancements (THIS is BrewLotto magic)

1\. Highlight user picks

Your Pick: 3-1-7 ✔ MATCH  
Your Pick: 2-4-9 ✖ MISS

\---

2\. Brew Commentary

"Brew Insight:  
You hit a positional match on Pick 3\.  
Your sum range strategy is trending upward."

\---

3\. Performance Snapshot

Today’s Performance:  
\- Picks Played: 5  
\- Hits: 1  
\- Accuracy: 20%  
\- Streak: 2 days

\---

4\. Strategy Feedback

“Momentum strategy performed above baseline today.”

\---

🧠 3\. “My Picks” Page (ALSO CRITICAL)

This is where users see what they played.

Layout

📅 Today’s Picks

Pick 3:  
→ 3-1-7 (Saved)  
→ 2-4-9

Pick 4:  
→ 1-2-4-9

Powerball:  
→ 3-14-29-41-52 | 12

\---

Add Status AFTER draw

3-1-7 → ✅ HIT  
2-4-9 → ❌ MISS

\---

🧩 4\. How It All Connects (Architecture)

You now need 3 connected systems:

1\. lottery\_draws (you already have)

→ official results

2\. user\_picks (YOU NEED THIS)

user\_id  
game  
state  
draw\_date  
numbers  
saved  
strategy\_used  
created\_at

\---

3\. prediction\_results (optional enhancement)

Tracks:

generated vs saved

confidence score

strategy used

\---

🎨 5\. UI Flow (Simple)

Step 1

User generates picks → saved to user\_picks

Step 2

Draw ingestion runs → inserts into lottery\_draws

Step 3

System compares:

user\_picks vs lottery\_draws

Step 4

Results page updates automatically

\---

🧠 6\. Where This Lives in Your App

Navbar

Dashboard  
My Picks  
Results 🔥  
Strategies

Avatar Menu (secondary)

Profile  
Stats  
Settings  
Logout

\---

⚠️ Key Product Insight

👉 If users cannot easily see:

what they played

what hit

how they performed

Then BrewLotto loses its core value.

This feature is non-negotiable MVP

\---

🧬 7\. BrewLotto UX Philosophy Here

This page should feel like:

a trading dashboard 📈

a performance tracker 📊

a coach (Brew commentary) 🧠

NOT:

a basic lottery checker

\---

🚀 What You Should Do Next

Priority Order

1\. ✅ Build user\_picks table

2\. ✅ Build “My Picks” page

3\. ✅ Build “Today’s Results” page

4\. ✅ Build comparison logic (hit detection)

5\. ⏳ Then wire into gamification

\---

💡 Final Answer

👉 You were 100% right — that feature is missing  
👉 It is NOT a small UI tweak  
👉 It is a core BrewLotto experience layer

\---

If you want next, I can give you:

👉 Exact UI wireframe (Figma-ready layout)  
👉 API routes for picks \+ results comparison  
👉 Hit detection logic (Pick 3, Pick 4, Cash 5, PB, Mega)

Just say the word — this is the layer that will make BrewLotto feel 🔥

# Recommendations design

My recommendation: keep the same visual language front to back, but do not put full “Brew” assistant presence everywhere on day one.

The V1 docs already support a cleaner split:

the public app is a premium, mobile-first, card-based dashboard with dark UI, gold highlights, glow, minimal clutter, and core screens for Dashboard, Pick Generator, My Picks, Strategy Locker, and Account/Subscription. 

V1 guidance also says to avoid overcomplicated internal module sprawl, keep notifications practical, and keep multi-agent/AI complexity mostly internal rather than exposed everywhere in the runtime UX.  

So the cleanest product decision is:

1\. Frontend vs backend “Brew” presence

Frontend

Yes, Brew should be present, but in a controlled, premium way:

Brew Character Visibility Rules (V1):

1. Always Visible (Primary Contexts):
   - Prediction Pages: Brew provides commentary on generated picks
   - Today's Results / Results Recap: Brew summarizes draw outcomes
   - Strategy Locker: Brew explains strategies and provides educational context

2. Visible in Milestone Notifications:
   - Badge unlocked notifications
   - Streak achievement notifications
   - Strategy mastery notifications

3. Subtle Everywhere Else:
   - Dashboard: Minimal presence, focus on data (light presence in Prediction card)
   - My Picks: Summary voice only, no floating assistant
   - Stats: Data-driven, no character interruption
   - Settings: Functional UI, no character presence
   - Profile: User-focused, no character presence

Note: Brew is NOT globally dominant across every screen. It appears contextually where explanation/education is needed.

Backend / admin

For the internal side, I would not make Brew a visible “character” everywhere. Instead:

use system notifications

status chips

ingestion health

mismatch alerts

strategy audit summaries

That aligns with the V1 admin direction that BrewCommand should be reduced to an internal admin/ops console, not a major public dependency. 

2\. Strategy Locker recommendation

You’re right to think this is where BrewLotto AI belongs most naturally.

Best approach:

Free tier: Strategy Locker Lite

glossary

why this pick

basic hot/cold and momentum explainers

Pro tier: Strategy Locker

richer breakdowns

saved strategy history

comparison cards

“why this number set ranked higher”

Elite tier: Brew AI inside Strategy Locker

deeper reasoning

anomaly/risk overlays

strategy comparison

explanation threads

That is already consistent with your tiering/obfuscation docs, where higher tiers unlock richer strategy surfaces and BrewBot explainers, while V1 keeps launch simpler.   

3\. BrewTruth recommendation

Defer full BrewTruth UX exposure to a later rollout.

Use BrewTruth in V1 mostly as:

governance

source freshness

confidence/evidence checks

audit metadata

claim control in commentary

That is exactly how the V1 plan frames BrewTruth: a trust and governance layer, not something that needs to become a giant user-facing subsystem yet. 

So:

BrewTruth engine: yes in V1

BrewTruth branded surface everywhere: no, later

4\. What the profile dropdown should look like

Your instinct is right. Keep it clean and useful.

Recommended V1 profile dropdown

Profile

My Picks

Today’s Results

Stats & Performance

Strategy Locker

Notifications

Settings

Subscription / Billing

Help / Learn

Terms & Privacy

Logout

Why this set:

“My Picks” and “Today’s Results” are core utility

“Strategy Locker” is your premium education/AI gateway

“Subscription / Billing” is already part of the V1 account surface 

“Terms & Privacy” keeps trust visible

“Help / Learn” is the lightweight BrewUniversity bridge your docs already recommend for V1 

5\. The page you’re missing: Today’s Results / Draw Center

You were absolutely right that users need to see what numbers hit today.

This should be a first-class page, not buried in profile.

V1 nav structure

Top nav:

Dashboard

My Picks

Results

Strategy Locker

Avatar dropdown:

Profile

Stats & Performance

Notifications

Settings

Subscription / Billing

Help / Learn

Terms & Privacy

Logout

That keeps the most-used lottery actions in primary nav and the account controls in the profile menu.

6\. Figma look-and-feel guidance

From your uploaded design, the visual system is:

dark luxury shell

gold glow

glassy premium cards

clear hierarchy

controlled iconography

Brew as a smart guide, not constant clutter

That is already compatible with the UI architecture doc’s design language: dark UI, gold highlights, glowing interactive elements, minimal clutter. 

So the rule should be:

Public UX visual rule

keep the same card/glow language

keep gold/charcoal hierarchy

use Brew in high-value moments

do not overload every screen with assistant chrome

Internal/admin UX visual rule

same token system

less theatrical glow

more monitoring clarity

more tables, logs, and status panels

minimal mascot presence

7\. My strongest V1 recommendation

For launch, define Brew surfaces like this:

V1 surfaces where Brew appears

Prediction Card summary

Voice Mode

Strategy Locker explainers

milestone notifications

results recap summary

V1 surfaces where Brew stays subtle or absent

admin ingestion logs

raw stats tables

billing/settings forms

terms/privacy

backend ops screens

That avoids overscoping while keeping the brand alive.

8\. Build priority

I’d define the next UX package in this order:

1\. Today’s Results / Draw Center

2\. My Picks

3\. Profile dropdown \+ account pages

4\. Strategy Locker Lite / Pro gates

5\. Notifications center

6\. Brew AI richer strategy explanations for higher tiers

That order matches both user value and your V1 caution against too much early complexity. 

PM verdict

Same look and feel across public and internal surfaces: yes

Same level of Brew presence everywhere: no

Brew in Strategy Locker for higher tiers: yes, strong fit

BrewTruth as a major branded user-facing system in V1: no, later

Today’s Results page: must add now

Profile dropdown: define now, but keep lottery actions mostly in main nav

Here’s the clean V1 blueprint:

Main nav

Dashboard

My Picks

Results

Strategy Locker

Avatar menu

Profile

Stats & Performance

Notifications

Settings

Subscription / Billing

Help / Learn

Terms & Privacy

Logout

Brew presence

visible in Prediction, Results Recap, Strategy Locker, Voice, milestone notifications

subtle elsewhere

I can turn this into a Figma-ready UX spec for Header, Profile Menu, Results page, and Strategy Locker tiers.

# Figma wireframe Drop down

Perfect — this is exactly the right move. We’re locking into execution mode and building the layer that turns BrewLotto from “tool” → experience.

I’m going to give you this in build-ready format so NemoTron can execute without interpretation.

\---

🎯 1\. FIGMA-READY UI WIREFRAME (EXACT STRUCTURE)

🧭 Global Layout (All Pages)

App Shell  
├── Top Nav (Fixed)  
│   ├── Logo (BrewGold)  
│   ├── Dashboard  
│   ├── My Picks  
│   ├── Results 🔥  
│   ├── Strategy Locker  
│   ├── \[Avatar ▼\]  
│  
├── Main Content (Dynamic)  
│  
└── Brew Assistant Dock (Bottom Right \- subtle glow)

\---

🧑‍💻 2\. PROFILE DROPDOWN (FINAL V1)

Avatar Dropdown  
├── Profile  
├── My Picks  
├── Today’s Results  
├── Stats & Performance  
├── Strategy Locker  
├── Notifications  
├── Settings  
├── Subscription / Billing  
├── Help / Learn  
├── Terms & Privacy  
└── Logout

👉 Keep this EXACT. No overbuild.

\---

🎰 3\. “TODAY’S RESULTS” PAGE (CORE SCREEN)

Layout

\[ Header \]  
📅 Today’s Results — March 17, 2026

\[ Game Cards Grid \]

┌──────────────────────────────┐  
│ 🎰 Pick 3 (NC)               │  
│ Midday: 3-1-7               │  
│ Evening: 8-2-4              │  
│                             │  
│ Your Picks:                 │  
│ 3-1-7 → ✅ HIT              │  
│ 2-4-9 → ❌ MISS             │  
└──────────────────────────────┘

┌──────────────────────────────┐  
│ 🎰 Pick 4                    │  
│ Midday: 1-2-4-9             │  
│ Evening: 7-3-5-1            │  
│                             │  
│ Your Picks:                 │  
│ 1-2-4-9 → 🎯 FULL MATCH     │  
└──────────────────────────────┘

┌──────────────────────────────┐  
│ 🎰 Cash 5                    │  
│ 3-14-29-31-40               │  
│                             │  
│ Your Picks:                 │  
│ 3-14-22-31-40 → 4/5 MATCH   │  
└──────────────────────────────┘

\---

📊 Performance Strip (Top or Bottom)

Today’s Performance

Picks: 8  
Hits: 2  
Accuracy: 25%  
Best Game: Pick 4  
Streak: 3 Days 🔥

\---

🧠 Brew Commentary Block (SUBTLE)

Brew Insight:

“Your positional strategy is trending upward.  
Pick 4 full match indicates strong alignment with recent frequency shifts.”

👉 This is where Brew lives (NOT everywhere)

\---

🎯 4\. “MY PICKS” PAGE

📅 Today’s Picks

Pick 3  
→ 3-1-7 (Saved)  
→ 2-4-9

Pick 4  
→ 1-2-4-9

Powerball  
→ 3-14-29-41-52 | PB: 12

After draw:

3-1-7 → ✅ HIT  
2-4-9 → ❌ MISS

\---

🧠 5\. STRATEGY LOCKER (TIERED ENTRY POINT)

V1 (Keep SIMPLE)

Strategy Locker

→ Momentum Strategy  
→ Hot / Cold Strategy  
→ Mirror Strategy

\[ Select Strategy \]

Explanation:  
“This strategy favors numbers trending upward over last 10 draws.”

Performance:  
Win Rate: 18%  
Trend: ↑

\---

V2+ (NOT NOW — but structured)

Brew deep explanations

AI comparisons

Strategy vs strategy battles

\---

🔌 6\. API ROUTES (DROP-IN STRUCTURE)

🎯 Picks

POST   /api/picks/create  
GET    /api/picks/user?date=YYYY-MM-DD  
DELETE /api/picks/:id

\---

🎰 Results

GET /api/results/today  
GET /api/results/history?game=pick3

\---

⚔️ Comparison Engine

GET /api/results/compare?date=YYYY-MM-DD

Response:

{  
  "game": "pick3",  
  "draw": \[3,1,7\],  
  "userPicks": \[  
    {  
      "numbers": \[3,1,7\],  
      "result": "HIT",  
      "matchCount": 3  
    },  
    {  
      "numbers": \[2,4,9\],  
      "result": "MISS",  
      "matchCount": 0  
    }  
  \]  
}

\---

🧠 7\. HIT DETECTION LOGIC (CORE ENGINE)

🎰 Pick 3 / Pick 4 (ORDER MATTERS)

function checkExactMatch(pick: number\[\], draw: number\[\]) {  
  return pick.join() \=== draw.join();  
}

\---

🎯 Partial Match (Position-Based)

function positionalMatch(pick: number\[\], draw: number\[\]) {  
  return pick.filter((num, i) \=\> num \=== draw\[i\]).length;  
}

\---

🎰 Cash 5 / Mega / Powerball

function countMatches(pick: number\[\], draw: number\[\]) {  
  return pick.filter(n \=\> draw.includes(n)).length;  
}

\---

🎯 Powerball Special

function checkPowerball(pickPB, drawPB) {  
  return pickPB \=== drawPB;  
}

\---

🎯 Final Result Object

{  
  matchCount: 4,  
  powerballMatch: true,  
  result: "4 \+ PB"  
}

\---

🧩 8\. DATABASE (YOU NEED THIS NOW)

user\_picks

id UUID  
user\_id UUID  
game TEXT  
state TEXT  
draw\_date DATE  
numbers INT\[\]  
powerball INT  
strategy\_used TEXT  
created\_at TIMESTAMP

\---

🧠 9\. PRODUCT RULES (LOCK THESE)

DO:

✔ Keep Brew subtle and high-impact  
✔ Make Results page feel like a dashboard  
✔ Highlight wins visually (glow, gold, animation)  
✔ Make performance addictive

DO NOT:

❌ Put Brew everywhere  
❌ Overload Strategy Locker in V1  
❌ Hide results in profile

\---

🚀 FINAL EXECUTION PLAN (WHAT YOU DO NEXT)

Phase 1 (Immediate)

Build user\_picks table

Build /results page

Build /picks page

Phase 2

Build comparison API

Add hit detection

Phase 3

Add performance tracking

Add Brew commentary

\---

🧠 PM FINAL CALL

You made the right decision sticking to original plan.

This layer: 👉 creates daily engagement 👉 creates addiction loop 👉 creates data for gamification 👉 creates value perception

\---

If you want next: I can give you:

👉 Supabase SQL (ready to paste)  
👉 Next.js API route code  
👉 Figma component tokens (exact BrewGold system)

Say the word — we’re right at the turning point where BrewLotto becomes

# User Picks Result Core Scema

Here’s the Supabase SQL for the core user-facing layer we just defined.

This gives you:

user\_picks

pick\_results

user\_daily\_stats

helpful indexes

updated timestamps

starter RLS policies

You can paste this into Supabase SQL editor.

\-- \=========================================================  
\-- BrewLotto V1 \- User Picks \+ Results Core Schema  
\-- Timestamp: 2026-03-17 ET  
\-- Purpose:  
\--   Core tables for My Picks, Today’s Results, hit detection,  
\--   and daily performance tracking.  
\-- \=========================================================

\-- \---------------------------------------------------------  
\-- Extensions  
\-- \---------------------------------------------------------  
create extension if not exists pgcrypto;

\-- \---------------------------------------------------------  
\-- updated\_at helper  
\-- \---------------------------------------------------------  
create or replace function public.set\_updated\_at()  
returns trigger  
language plpgsql  
as $$  
begin  
  new.updated\_at \= now();  
  return new;  
end;  
$$;

\-- \=========================================================  
\-- 1\) USER PICKS  
\-- Stores what the user chose to play/save for a draw date.  
\-- \=========================================================  
create table if not exists public.user\_picks (  
  id uuid primary key default gen\_random\_uuid(),  
  user\_id uuid not null,  
  state text not null,  
  game text not null,  
  draw\_date date not null,  
  draw\_time text null, \-- midday, evening, nightly, etc.  
  numbers jsonb not null, \-- array of main numbers/digits  
  bonus\_number integer null, \-- powerball / mega ball / similar  
  strategy\_used text null,  
  source text not null default 'manual', \-- manual, smart\_pick, quick\_pick, imported  
  is\_saved boolean not null default true,  
  notes text null,  
  created\_at timestamptz not null default now(),  
  updated\_at timestamptz not null default now(),

  constraint user\_picks\_game\_check  
    check (  
      game in (  
        'pick3',  
        'pick4',  
        'cash5',  
        'daily3',  
        'daily4',  
        'fantasy5',  
        'powerball',  
        'mega\_millions'  
      )  
    ),

  constraint user\_picks\_state\_check  
    check (state in ('NC', 'CA')),

  constraint user\_picks\_draw\_time\_check  
    check (  
      draw\_time is null or  
      draw\_time in ('midday', 'evening', 'nightly', 'draw')  
    ),

  constraint user\_picks\_numbers\_is\_array  
    check (jsonb\_typeof(numbers) \= 'array')  
);

create index if not exists idx\_user\_picks\_user\_id  
  on public.user\_picks (user\_id);

create index if not exists idx\_user\_picks\_user\_date  
  on public.user\_picks (user\_id, draw\_date desc);

create index if not exists idx\_user\_picks\_game\_state\_date  
  on public.user\_picks (game, state, draw\_date desc);

create index if not exists idx\_user\_picks\_draw\_time  
  on public.user\_picks (draw\_time);

drop trigger if exists trg\_user\_picks\_updated\_at on public.user\_picks;  
create trigger trg\_user\_picks\_updated\_at  
before update on public.user\_picks  
for each row  
execute function public.set\_updated\_at();

\-- \=========================================================  
\-- 2\) PICK RESULTS  
\-- Stores evaluated outcome of a user pick against official draw.  
\-- One row per user\_pick after comparison/evaluation.  
\-- \=========================================================  
create table if not exists public.pick\_results (  
  id uuid primary key default gen\_random\_uuid(),  
  user\_pick\_id uuid not null references public.user\_picks(id) on delete cascade,  
  user\_id uuid not null,  
  state text not null,  
  game text not null,  
  draw\_date date not null,  
  draw\_time text null,

  official\_numbers jsonb not null,  
  official\_bonus\_number integer null,

  match\_count integer not null default 0,  
  positional\_match\_count integer not null default 0,  
  bonus\_match boolean not null default false,

  result\_code text not null, \-- MISS, HIT, EXACT, PARTIAL, 3\_OF\_5, 4\_OF\_5, 5\_OF\_5, 4\_PLUS\_PB, etc.  
  is\_win boolean not null default false,

  payout\_tier text null, \-- optional future use  
  comparison\_metadata jsonb not null default '{}'::jsonb,

  created\_at timestamptz not null default now(),  
  updated\_at timestamptz not null default now(),

  constraint pick\_results\_game\_check  
    check (  
      game in (  
        'pick3',  
        'pick4',  
        'cash5',  
        'daily3',  
        'daily4',  
        'fantasy5',  
        'powerball',  
        'mega\_millions'  
      )  
    ),

  constraint pick\_results\_state\_check  
    check (state in ('NC', 'CA')),

  constraint pick\_results\_draw\_time\_check  
    check (  
      draw\_time is null or  
      draw\_time in ('midday', 'evening', 'nightly', 'draw')  
    ),

  constraint pick\_results\_official\_numbers\_is\_array  
    check (jsonb\_typeof(official\_numbers) \= 'array'),

  constraint pick\_results\_match\_count\_nonnegative  
    check (match\_count \>= 0),

  constraint pick\_results\_positional\_match\_count\_nonnegative  
    check (positional\_match\_count \>= 0),

  constraint pick\_results\_user\_pick\_unique  
    unique (user\_pick\_id)  
);

create index if not exists idx\_pick\_results\_user\_id  
  on public.pick\_results (user\_id);

create index if not exists idx\_pick\_results\_user\_date  
  on public.pick\_results (user\_id, draw\_date desc);

create index if not exists idx\_pick\_results\_game\_state\_date  
  on public.pick\_results (game, state, draw\_date desc);

create index if not exists idx\_pick\_results\_result\_code  
  on public.pick\_results (result\_code);

drop trigger if exists trg\_pick\_results\_updated\_at on public.pick\_results;  
create trigger trg\_pick\_results\_updated\_at  
before update on public.pick\_results  
for each row  
execute function public.set\_updated\_at();

\-- \=========================================================  
\-- 3\) USER DAILY STATS  
\-- Aggregate stats for Today’s Results / dashboard performance strip.  
\-- Can be written by jobs or refreshed incrementally.  
\-- \=========================================================  
create table if not exists public.user\_daily\_stats (  
  id uuid primary key default gen\_random\_uuid(),  
  user\_id uuid not null,  
  stat\_date date not null,

  picks\_count integer not null default 0,  
  wins\_count integer not null default 0,  
  partial\_hits\_count integer not null default 0,  
  exact\_hits\_count integer not null default 0,

  accuracy numeric(6,2) not null default 0.00,  
  best\_game text null,  
  current\_streak integer not null default 0,

  metadata jsonb not null default '{}'::jsonb,

  created\_at timestamptz not null default now(),  
  updated\_at timestamptz not null default now(),

  constraint user\_daily\_stats\_unique unique (user\_id, stat\_date),

  constraint user\_daily\_stats\_counts\_nonnegative  
    check (  
      picks\_count \>= 0 and  
      wins\_count \>= 0 and  
      partial\_hits\_count \>= 0 and  
      exact\_hits\_count \>= 0 and  
      current\_streak \>= 0  
    ),

  constraint user\_daily\_stats\_accuracy\_range  
    check (accuracy \>= 0 and accuracy \<= 100\)  
);

create index if not exists idx\_user\_daily\_stats\_user\_date  
  on public.user\_daily\_stats (user\_id, stat\_date desc);

drop trigger if exists trg\_user\_daily\_stats\_updated\_at on public.user\_daily\_stats;  
create trigger trg\_user\_daily\_stats\_updated\_at  
before update on public.user\_daily\_stats  
for each row  
execute function public.set\_updated\_at();

\-- \=========================================================  
\-- 4\) OPTIONAL VIEW  
\-- Quick result view for Today’s Results / My Picks UI  
\-- \=========================================================  
create or replace view public.v\_user\_picks\_with\_results as  
select  
  up.id as user\_pick\_id,  
  up.user\_id,  
  up.state,  
  up.game,  
  up.draw\_date,  
  up.draw\_time,  
  up.numbers as user\_numbers,  
  up.bonus\_number as user\_bonus\_number,  
  up.strategy\_used,  
  up.source,  
  up.is\_saved,  
  up.created\_at as pick\_created\_at,

  pr.id as pick\_result\_id,  
  pr.official\_numbers,  
  pr.official\_bonus\_number,  
  pr.match\_count,  
  pr.positional\_match\_count,  
  pr.bonus\_match,  
  pr.result\_code,  
  pr.is\_win,  
  pr.payout\_tier,  
  pr.comparison\_metadata,  
  pr.created\_at as result\_created\_at  
from public.user\_picks up  
left join public.pick\_results pr  
  on pr.user\_pick\_id \= up.id;

\-- \=========================================================  
\-- 5\) RLS  
\-- Assumes auth.users / auth.uid() is being used.  
\-- \=========================================================  
alter table public.user\_picks enable row level security;  
alter table public.pick\_results enable row level security;  
alter table public.user\_daily\_stats enable row level security;

\-- \---------------------------------------------------------  
\-- user\_picks policies  
\-- \---------------------------------------------------------  
drop policy if exists "user\_picks\_select\_own" on public.user\_picks;  
create policy "user\_picks\_select\_own"  
on public.user\_picks  
for select  
to authenticated  
using (auth.uid() \= user\_id);

drop policy if exists "user\_picks\_insert\_own" on public.user\_picks;  
create policy "user\_picks\_insert\_own"  
on public.user\_picks  
for insert  
to authenticated  
with check (auth.uid() \= user\_id);

drop policy if exists "user\_picks\_update\_own" on public.user\_picks;  
create policy "user\_picks\_update\_own"  
on public.user\_picks  
for update  
to authenticated  
using (auth.uid() \= user\_id)  
with check (auth.uid() \= user\_id);

drop policy if exists "user\_picks\_delete\_own" on public.user\_picks;  
create policy "user\_picks\_delete\_own"  
on public.user\_picks  
for delete  
to authenticated  
using (auth.uid() \= user\_id);

\-- \---------------------------------------------------------  
\-- pick\_results policies  
\-- \---------------------------------------------------------  
drop policy if exists "pick\_results\_select\_own" on public.pick\_results;  
create policy "pick\_results\_select\_own"  
on public.pick\_results  
for select  
to authenticated  
using (auth.uid() \= user\_id);

\-- no direct user insert/update/delete by default  
\-- these should typically be written by backend/service role jobs

\-- \---------------------------------------------------------  
\-- user\_daily\_stats policies  
\-- \---------------------------------------------------------  
drop policy if exists "user\_daily\_stats\_select\_own" on public.user\_daily\_stats;  
create policy "user\_daily\_stats\_select\_own"  
on public.user\_daily\_stats  
for select  
to authenticated  
using (auth.uid() \= user\_id);

\-- no direct user insert/update/delete by default  
\-- these should typically be maintained by backend/service role jobs

\-- \=========================================================  
\-- 6\) COMMENTS  
\-- \=========================================================  
comment on table public.user\_picks is  
'Stores user-created or saved picks by draw date/game/state for BrewLotto My Picks and results comparison.';

comment on table public.pick\_results is  
'Stores evaluated comparison of each user pick against official draw results.';

comment on table public.user\_daily\_stats is  
'Stores aggregate daily performance metrics for dashboard and Today’s Results experience.';

comment on view public.v\_user\_picks\_with\_results is  
'Convenience view joining user picks with computed result outcomes.';

What this gives you

This supports the exact UX we defined:

My Picks

Today’s Results

pick-to-draw comparison

performance strip

future gamification hooks

Recommended next SQL after this

The next strongest addition is a proper profiles table for:

display name

avatar url

subscription tier

preferences

notification settings

That will support the avatar dropdown and account area cleanly.

I can draft that next as BrewLotto Profiles \+ Settings SQL.

# Profiles Settings Performance Schema

Here’s the next Supabase SQL: Profiles \+ Settings \+ Notifications Preferences \+ Subscription Tier support for BrewLotto.

This is designed to support:

avatar dropdown

profile page

account/settings

notification preferences

subscription/billing tier display

future Strategy Locker gating

Paste into Supabase SQL editor.

\-- \=========================================================  
\-- BrewLotto V1 \- Profiles \+ Settings \+ Preferences Schema  
\-- Timestamp: 2026-03-17 ET  
\-- Purpose:  
\--   User profile, avatar, app settings, subscription tier,  
\--   and notification preferences for BrewLotto account UX.  
\-- \=========================================================

create extension if not exists pgcrypto;

\-- \---------------------------------------------------------  
\-- updated\_at helper  
\-- \---------------------------------------------------------  
create or replace function public.set\_updated\_at()  
returns trigger  
language plpgsql  
as $$  
begin  
  new.updated\_at \= now();  
  return new;  
end;  
$$;

\-- \=========================================================  
\-- 1\) PROFILES  
\-- Core user identity table for avatar menu / account area  
\-- \=========================================================  
create table if not exists public.profiles (  
  id uuid primary key references auth.users(id) on delete cascade,  
  email text,  
  username text unique,  
  display\_name text,  
  first\_name text,  
  last\_name text,  
  avatar\_url text,  
  bio text,  
  timezone text default 'America/New\_York',  
  state\_preference text,  
  favorite\_game text,  
  subscription\_tier text not null default 'free',  
  is\_profile\_complete boolean not null default false,  
  onboarding\_completed boolean not null default false,  
  created\_at timestamptz not null default now(),  
  updated\_at timestamptz not null default now(),

  constraint profiles\_subscription\_tier\_check  
    check (subscription\_tier in ('free', 'pro', 'elite')),

  constraint profiles\_state\_preference\_check  
    check (  
      state\_preference is null or  
      state\_preference in ('NC', 'CA')  
    ),

  constraint profiles\_favorite\_game\_check  
    check (  
      favorite\_game is null or  
      favorite\_game in (  
        'pick3',  
        'pick4',  
        'cash5',  
        'daily3',  
        'daily4',  
        'fantasy5',  
        'powerball',  
        'mega\_millions'  
      )  
    )  
);

create index if not exists idx\_profiles\_subscription\_tier  
  on public.profiles (subscription\_tier);

drop trigger if exists trg\_profiles\_updated\_at on public.profiles;  
create trigger trg\_profiles\_updated\_at  
before update on public.profiles  
for each row  
execute function public.set\_updated\_at();

\-- \=========================================================  
\-- 2\) USER SETTINGS  
\-- UI / behavior / experience preferences  
\-- \=========================================================  
create table if not exists public.user\_settings (  
  id uuid primary key default gen\_random\_uuid(),  
  user\_id uuid not null unique references public.profiles(id) on delete cascade,

  theme text not null default 'dark',  
  accent\_mode text not null default 'gold',  
  voice\_enabled boolean not null default true,  
  brew\_commentary\_enabled boolean not null default true,  
  strategy\_explanations\_enabled boolean not null default true,  
  motion\_enabled boolean not null default true,  
  sound\_effects\_enabled boolean not null default false,

  default\_state text default 'NC',  
  default\_game text default 'pick3',  
  auto\_save\_picks boolean not null default true,  
  show\_results\_first boolean not null default false,

  created\_at timestamptz not null default now(),  
  updated\_at timestamptz not null default now(),

  constraint user\_settings\_theme\_check  
    check (theme in ('dark', 'light', 'system')),

  constraint user\_settings\_accent\_mode\_check  
    check (accent\_mode in ('gold', 'blue', 'auto')),

  constraint user\_settings\_default\_state\_check  
    check (  
      default\_state is null or  
      default\_state in ('NC', 'CA')  
    ),

  constraint user\_settings\_default\_game\_check  
    check (  
      default\_game is null or  
      default\_game in (  
        'pick3',  
        'pick4',  
        'cash5',  
        'daily3',  
        'daily4',  
        'fantasy5',  
        'powerball',  
        'mega\_millions'  
      )  
    )  
);

drop trigger if exists trg\_user\_settings\_updated\_at on public.user\_settings;  
create trigger trg\_user\_settings\_updated\_at  
before update on public.user\_settings  
for each row  
execute function public.set\_updated\_at();

\-- \=========================================================  
\-- 3\) NOTIFICATION PREFERENCES  
\-- Controls user comms surfaces  
\-- \=========================================================  
create table if not exists public.notification\_preferences (  
  id uuid primary key default gen\_random\_uuid(),  
  user\_id uuid not null unique references public.profiles(id) on delete cascade,

  email\_enabled boolean not null default true,  
  push\_enabled boolean not null default true,  
  sms\_enabled boolean not null default false,

  draw\_results\_enabled boolean not null default true,  
  pick\_reminders\_enabled boolean not null default true,  
  streak\_alerts\_enabled boolean not null default true,  
  mission\_alerts\_enabled boolean not null default true,  
  promo\_alerts\_enabled boolean not null default false,  
  subscription\_alerts\_enabled boolean not null default true,  
  security\_alerts\_enabled boolean not null default true,

  quiet\_hours\_enabled boolean not null default false,  
  quiet\_hours\_start time,  
  quiet\_hours\_end time,

  created\_at timestamptz not null default now(),  
  updated\_at timestamptz not null default now()  
);

drop trigger if exists trg\_notification\_preferences\_updated\_at on public.notification\_preferences;  
create trigger trg\_notification\_preferences\_updated\_at  
before update on public.notification\_preferences  
for each row  
execute function public.set\_updated\_at();

\-- \=========================================================  
\-- 4\) USER NOTIFICATIONS  
\-- In-app notification center  
\-- \=========================================================  
create table if not exists public.user\_notifications (  
  id uuid primary key default gen\_random\_uuid(),  
  user\_id uuid not null references public.profiles(id) on delete cascade,  
  type text not null,  
  title text not null,  
  body text,  
  cta\_label text,  
  cta\_url text,  
  is\_read boolean not null default false,  
  priority text not null default 'normal',  
  metadata jsonb not null default '{}'::jsonb,  
  created\_at timestamptz not null default now(),  
  read\_at timestamptz,

  constraint user\_notifications\_type\_check  
    check (  
      type in (  
        'draw\_result',  
        'pick\_reminder',  
        'streak',  
        'mission',  
        'achievement',  
        'subscription',  
        'security',  
        'system'  
      )  
    ),

  constraint user\_notifications\_priority\_check  
    check (  
      priority in ('low', 'normal', 'high', 'critical')  
    )  
);

create index if not exists idx\_user\_notifications\_user\_id  
  on public.user\_notifications (user\_id);

create index if not exists idx\_user\_notifications\_user\_read  
  on public.user\_notifications (user\_id, is\_read);

create index if not exists idx\_user\_notifications\_created\_at  
  on public.user\_notifications (created\_at desc);

\-- \=========================================================  
\-- 5\) SUBSCRIPTION SNAPSHOT  
\-- Simple V1 subscription state separate from billing provider  
\-- \=========================================================  
create table if not exists public.user\_subscriptions (  
  id uuid primary key default gen\_random\_uuid(),  
  user\_id uuid not null unique references public.profiles(id) on delete cascade,  
  tier text not null default 'free',  
  status text not null default 'active',  
  provider text default 'stripe',  
  provider\_customer\_id text,  
  provider\_subscription\_id text,  
  current\_period\_start timestamptz,  
  current\_period\_end timestamptz,  
  cancel\_at\_period\_end boolean not null default false,  
  trial\_ends\_at timestamptz,  
  metadata jsonb not null default '{}'::jsonb,  
  created\_at timestamptz not null default now(),  
  updated\_at timestamptz not null default now(),

  constraint user\_subscriptions\_tier\_check  
    check (tier in ('free', 'pro', 'elite')),

  constraint user\_subscriptions\_status\_check  
    check (  
      status in (  
        'active',  
        'trialing',  
        'past\_due',  
        'canceled',  
        'incomplete',  
        'inactive'  
      )  
    )  
);

create index if not exists idx\_user\_subscriptions\_tier  
  on public.user\_subscriptions (tier);

drop trigger if exists trg\_user\_subscriptions\_updated\_at on public.user\_subscriptions;  
create trigger trg\_user\_subscriptions\_updated\_at  
before update on public.user\_subscriptions  
for each row  
execute function public.set\_updated\_at();

\-- \=========================================================  
\-- 6\) HELPER FUNCTION  
\-- Auto-create starter profile/settings rows when needed  
\-- \=========================================================  
create or replace function public.handle\_new\_user()  
returns trigger  
language plpgsql  
security definer  
set search\_path \= public  
as $$  
begin  
  insert into public.profiles (  
    id,  
    email,  
    display\_name  
  )  
  values (  
    new.id,  
    new.email,  
    coalesce(split\_part(new.email, '@', 1), 'Brew Player')  
  )  
  on conflict (id) do nothing;

  insert into public.user\_settings (user\_id)  
  values (new.id)  
  on conflict (user\_id) do nothing;

  insert into public.notification\_preferences (user\_id)  
  values (new.id)  
  on conflict (user\_id) do nothing;

  insert into public.user\_subscriptions (user\_id, tier, status)  
  values (new.id, 'free', 'active')  
  on conflict (user\_id) do nothing;

  return new;  
end;  
$$;

drop trigger if exists on\_auth\_user\_created on auth.users;  
create trigger on\_auth\_user\_created  
after insert on auth.users  
for each row  
execute function public.handle\_new\_user();

\-- \=========================================================  
\-- 7\) PROFILE COMPLETION HELPER VIEW  
\-- Useful for onboarding/profile checks  
\-- \=========================================================  
create or replace view public.v\_profile\_summary as  
select  
  p.id as user\_id,  
  p.email,  
  p.username,  
  p.display\_name,  
  p.avatar\_url,  
  p.subscription\_tier,  
  p.state\_preference,  
  p.favorite\_game,  
  p.is\_profile\_complete,  
  p.onboarding\_completed,

  us.theme,  
  us.accent\_mode,  
  us.voice\_enabled,  
  us.brew\_commentary\_enabled,  
  us.default\_state,  
  us.default\_game,

  np.email\_enabled,  
  np.push\_enabled,  
  np.sms\_enabled,

  sub.status as subscription\_status,  
  sub.current\_period\_end  
from public.profiles p  
left join public.user\_settings us  
  on us.user\_id \= p.id  
left join public.notification\_preferences np  
  on np.user\_id \= p.id  
left join public.user\_subscriptions sub  
  on sub.user\_id \= p.id;

\-- \=========================================================  
\-- 8\) RLS  
\-- \=========================================================  
alter table public.profiles enable row level security;  
alter table public.user\_settings enable row level security;  
alter table public.notification\_preferences enable row level security;  
alter table public.user\_notifications enable row level security;  
alter table public.user\_subscriptions enable row level security;

\-- \---------------------------------------------------------  
\-- profiles  
\-- \---------------------------------------------------------  
drop policy if exists "profiles\_select\_own" on public.profiles;  
create policy "profiles\_select\_own"  
on public.profiles  
for select  
to authenticated  
using (auth.uid() \= id);

drop policy if exists "profiles\_insert\_own" on public.profiles;  
create policy "profiles\_insert\_own"  
on public.profiles  
for insert  
to authenticated  
with check (auth.uid() \= id);

drop policy if exists "profiles\_update\_own" on public.profiles;  
create policy "profiles\_update\_own"  
on public.profiles  
for update  
to authenticated  
using (auth.uid() \= id)  
with check (auth.uid() \= id);

\-- \---------------------------------------------------------  
\-- user\_settings  
\-- \---------------------------------------------------------  
drop policy if exists "user\_settings\_select\_own" on public.user\_settings;  
create policy "user\_settings\_select\_own"  
on public.user\_settings  
for select  
to authenticated  
using (auth.uid() \= user\_id);

drop policy if exists "user\_settings\_insert\_own" on public.user\_settings;  
create policy "user\_settings\_insert\_own"  
on public.user\_settings  
for insert  
to authenticated  
with check (auth.uid() \= user\_id);

drop policy if exists "user\_settings\_update\_own" on public.user\_settings;  
create policy "user\_settings\_update\_own"  
on public.user\_settings  
for update  
to authenticated  
using (auth.uid() \= user\_id)  
with check (auth.uid() \= user\_id);

\-- \---------------------------------------------------------  
\-- notification\_preferences  
\-- \---------------------------------------------------------  
drop policy if exists "notification\_preferences\_select\_own" on public.notification\_preferences;  
create policy "notification\_preferences\_select\_own"  
on public.notification\_preferences  
for select  
to authenticated  
using (auth.uid() \= user\_id);

drop policy if exists "notification\_preferences\_insert\_own" on public.notification\_preferences;  
create policy "notification\_preferences\_insert\_own"  
on public.notification\_preferences  
for insert  
to authenticated  
with check (auth.uid() \= user\_id);

drop policy if exists "notification\_preferences\_update\_own" on public.notification\_preferences;  
create policy "notification\_preferences\_update\_own"  
on public.notification\_preferences  
for update  
to authenticated  
using (auth.uid() \= user\_id)  
with check (auth.uid() \= user\_id);

\-- \---------------------------------------------------------  
\-- user\_notifications  
\-- \---------------------------------------------------------  
drop policy if exists "user\_notifications\_select\_own" on public.user\_notifications;  
create policy "user\_notifications\_select\_own"  
on public.user\_notifications  
for select  
to authenticated  
using (auth.uid() \= user\_id);

drop policy if exists "user\_notifications\_update\_own" on public.user\_notifications;  
create policy "user\_notifications\_update\_own"  
on public.user\_notifications  
for update  
to authenticated  
using (auth.uid() \= user\_id)  
with check (auth.uid() \= user\_id);

\-- no direct user insert/delete by default for notifications  
\-- server/backend should create these

\-- \---------------------------------------------------------  
\-- user\_subscriptions  
\-- \---------------------------------------------------------  
drop policy if exists "user\_subscriptions\_select\_own" on public.user\_subscriptions;  
create policy "user\_subscriptions\_select\_own"  
on public.user\_subscriptions  
for select  
to authenticated  
using (auth.uid() \= user\_id);

\-- no direct user insert/update/delete by default  
\-- backend/billing webhooks should manage subscriptions

\-- \=========================================================  
\-- 9\) COMMENTS  
\-- \=========================================================  
comment on table public.profiles is  
'Core BrewLotto user identity table for avatar, account, preferences, and subscription tier display.';

comment on table public.user\_settings is  
'User-level app settings such as theme, defaults, Brew commentary, and voice preferences.';

comment on table public.notification\_preferences is  
'User notification delivery and category preferences for BrewLotto.';

comment on table public.user\_notifications is  
'In-app notification center items for results, missions, streaks, subscription, and system messages.';

comment on table public.user\_subscriptions is  
'Subscription snapshot table used for account tier, gating, and billing status display.';

comment on view public.v\_profile\_summary is  
'Convenience view for profile/account/settings surfaces in the BrewLotto frontend.';

What this unlocks

This gives you the backend structure for:

Avatar dropdown

Profile

Notifications

Settings

Subscription / Billing

Logout

Account pages

display name

avatar

favorite game

state preference

tier badge

voice/Brew commentary preferences

Tier gating

You can now gate:

Strategy Locker Lite → free

Strategy Locker Pro → pro

AI-enhanced Strategy Locker → elite

Recommended next SQL

The next strongest schema is:

Strategy Locker \+ Saved Strategies \+ User Performance Metrics

That would let you wire:

saved strategies

strategy usage history

best-performing strategies by user

lite/pro/elite access controls

That’s the next natural move.

# Strategy Locker \+ Entitlements \+ Tier Gating

Let’s lock it in. Here’s the Supabase SQL for Strategy Locker \+ Entitlements \+ Tier Gating, aligned to the canonical V1 tier structure:

free

starter

pro

master

This is built to support:

Strategy Locker

feature gating

per-tier unlocks

future billing sync

public UI labels without breaking backend truth

\-- \=========================================================  
\-- BrewLotto V1 \- Strategy Locker \+ Entitlements \+ Tier Gating  
\-- Timestamp: 2026-03-17 ET  
\-- Canonical Tier Model:  
\--   free, starter, pro, master  
\-- Purpose:  
\--   Supports Strategy Locker, feature entitlements, strategy gating,  
\--   user-access checks, and future-safe display labels.  
\-- \=========================================================

create extension if not exists pgcrypto;

\-- \---------------------------------------------------------  
\-- updated\_at helper  
\-- \---------------------------------------------------------  
create or replace function public.set\_updated\_at()  
returns trigger  
language plpgsql  
as $$  
begin  
  new.updated\_at \= now();  
  return new;  
end;  
$$;

\-- \=========================================================  
\-- 1\) STRATEGY REGISTRY  
\-- Canonical list of strategies in the system.  
\-- Internal IDs stay stable even if marketing labels evolve.  
\-- \=========================================================  
create table if not exists public.strategy\_registry (  
  id uuid primary key default gen\_random\_uuid(),  
  strategy\_key text not null unique,           \-- internal stable key  
  internal\_name text not null,                 \-- dev-facing  
  public\_name text not null,                   \-- UI-facing  
  voice\_alias text,                            \-- optional TTS/voice layer  
  description text,  
  category text not null default 'core',       \-- core, advanced, ai, utility  
  min\_tier text not null default 'free',       \-- canonical tier required  
  is\_active boolean not null default true,  
  is\_experimental boolean not null default false,  
  sort\_order integer not null default 100,  
  metadata jsonb not null default '{}'::jsonb,  
  created\_at timestamptz not null default now(),  
  updated\_at timestamptz not null default now(),

  constraint strategy\_registry\_min\_tier\_check  
    check (min\_tier in ('free', 'starter', 'pro', 'master')),

  constraint strategy\_registry\_category\_check  
    check (category in ('core', 'advanced', 'ai', 'utility', 'experimental'))  
);

create index if not exists idx\_strategy\_registry\_min\_tier  
  on public.strategy\_registry (min\_tier);

create index if not exists idx\_strategy\_registry\_is\_active  
  on public.strategy\_registry (is\_active);

drop trigger if exists trg\_strategy\_registry\_updated\_at on public.strategy\_registry;  
create trigger trg\_strategy\_registry\_updated\_at  
before update on public.strategy\_registry  
for each row  
execute function public.set\_updated\_at();

\-- \=========================================================  
\-- 2\) FEATURE ENTITLEMENTS REGISTRY  
\-- Feature-level gates separate from strategies.  
\-- Examples: notifications, exports, deep commentary, etc.  
\-- \=========================================================  
create table if not exists public.feature\_entitlements (  
  id uuid primary key default gen\_random\_uuid(),  
  feature\_key text not null unique,  
  feature\_name text not null,  
  description text,  
  category text not null default 'general',  
  min\_tier text not null default 'free',  
  is\_active boolean not null default true,  
  sort\_order integer not null default 100,  
  metadata jsonb not null default '{}'::jsonb,  
  created\_at timestamptz not null default now(),  
  updated\_at timestamptz not null default now(),

  constraint feature\_entitlements\_min\_tier\_check  
    check (min\_tier in ('free', 'starter', 'pro', 'master')),

  constraint feature\_entitlements\_category\_check  
    check (  
      category in (  
        'general',  
        'strategy',  
        'history',  
        'alerts',  
        'commentary',  
        'analytics',  
        'export',  
        'admin'  
      )  
    )  
);

create index if not exists idx\_feature\_entitlements\_min\_tier  
  on public.feature\_entitlements (min\_tier);

drop trigger if exists trg\_feature\_entitlements\_updated\_at on public.feature\_entitlements;  
create trigger trg\_feature\_entitlements\_updated\_at  
before update on public.feature\_entitlements  
for each row  
execute function public.set\_updated\_at();

\-- \=========================================================  
\-- 3\) TIER CATALOG  
\-- Canonical tier truth with display labels.  
\-- DB logic uses tier\_key; UI can use display\_name.  
\-- \=========================================================  
create table if not exists public.subscription\_tiers (  
  id uuid primary key default gen\_random\_uuid(),  
  tier\_key text not null unique,               \-- free, starter, pro, master  
  display\_name text not null,                  \-- Free Explorer, BrewStarter...  
  marketing\_label text,                        \-- optional later  
  price\_monthly numeric(10,2),  
  price\_annual numeric(10,2),  
  sort\_order integer not null,  
  is\_active boolean not null default true,  
  metadata jsonb not null default '{}'::jsonb,  
  created\_at timestamptz not null default now(),  
  updated\_at timestamptz not null default now(),

  constraint subscription\_tiers\_tier\_key\_check  
    check (tier\_key in ('free', 'starter', 'pro', 'master'))  
);

create unique index if not exists idx\_subscription\_tiers\_sort\_order  
  on public.subscription\_tiers (sort\_order);

drop trigger if exists trg\_subscription\_tiers\_updated\_at on public.subscription\_tiers;  
create trigger trg\_subscription\_tiers\_updated\_at  
before update on public.subscription\_tiers  
for each row  
execute function public.set\_updated\_at();

\-- \=========================================================  
\-- 4\) USER STRATEGY SAVES  
\-- Supports Strategy Locker favorites/saved strategies per user.  
\-- \=========================================================  
create table if not exists public.user\_saved\_strategies (  
  id uuid primary key default gen\_random\_uuid(),  
  user\_id uuid not null references public.profiles(id) on delete cascade,  
  strategy\_id uuid not null references public.strategy\_registry(id) on delete cascade,  
  nickname text,  
  notes text,  
  is\_favorite boolean not null default false,  
  created\_at timestamptz not null default now(),  
  updated\_at timestamptz not null default now(),

  constraint user\_saved\_strategies\_unique  
    unique (user\_id, strategy\_id)  
);

create index if not exists idx\_user\_saved\_strategies\_user\_id  
  on public.user\_saved\_strategies (user\_id);

create index if not exists idx\_user\_saved\_strategies\_strategy\_id  
  on public.user\_saved\_strategies (strategy\_id);

drop trigger if exists trg\_user\_saved\_strategies\_updated\_at on public.user\_saved\_strategies;  
create trigger trg\_user\_saved\_strategies\_updated\_at  
before update on public.user\_saved\_strategies  
for each row  
execute function public.set\_updated\_at();

\-- \=========================================================  
\-- 5\) USER STRATEGY ACTIVITY  
\-- Tracks strategy usage for stats, gamification, and performance.  
\-- \=========================================================  
create table if not exists public.user\_strategy\_activity (  
  id uuid primary key default gen\_random\_uuid(),  
  user\_id uuid not null references public.profiles(id) on delete cascade,  
  strategy\_id uuid not null references public.strategy\_registry(id) on delete cascade,  
  game text,  
  state text,  
  context text not null default 'prediction', \-- prediction, locker\_view, comparison, explanation  
  prediction\_id uuid,  
  metadata jsonb not null default '{}'::jsonb,  
  occurred\_at timestamptz not null default now(),

  constraint user\_strategy\_activity\_game\_check  
    check (  
      game is null or game in (  
        'pick3',  
        'pick4',  
        'cash5',  
        'daily3',  
        'daily4',  
        'fantasy5',  
        'powerball',  
        'mega\_millions'  
      )  
    ),

  constraint user\_strategy\_activity\_state\_check  
    check (state is null or state in ('NC', 'CA')),

  constraint user\_strategy\_activity\_context\_check  
    check (context in ('prediction', 'locker\_view', 'comparison', 'explanation', 'favorite'))  
);

create index if not exists idx\_user\_strategy\_activity\_user\_id  
  on public.user\_strategy\_activity (user\_id);

create index if not exists idx\_user\_strategy\_activity\_strategy\_id  
  on public.user\_strategy\_activity (strategy\_id);

create index if not exists idx\_user\_strategy\_activity\_occurred\_at  
  on public.user\_strategy\_activity (occurred\_at desc);

\-- \=========================================================  
\-- 6\) USER ENTITLEMENT OVERRIDES  
\-- Optional future-proof table for promos/manual grants/trials.  
\-- \=========================================================  
create table if not exists public.user\_entitlement\_overrides (  
  id uuid primary key default gen\_random\_uuid(),  
  user\_id uuid not null references public.profiles(id) on delete cascade,  
  feature\_key text,  
  strategy\_key text,  
  access\_granted boolean not null default true,  
  reason text,  
  starts\_at timestamptz,  
  ends\_at timestamptz,  
  metadata jsonb not null default '{}'::jsonb,  
  created\_at timestamptz not null default now(),

  constraint user\_entitlement\_overrides\_target\_check  
    check (  
      (feature\_key is not null and strategy\_key is null) or  
      (feature\_key is null and strategy\_key is not null)  
    )  
);

create index if not exists idx\_user\_entitlement\_overrides\_user\_id  
  on public.user\_entitlement\_overrides (user\_id);

\-- \=========================================================  
\-- 7\) TIER RANKING FUNCTION  
\-- Used for comparisons in entitlement checks.  
\-- \=========================================================  
create or replace function public.tier\_rank(tier text)  
returns integer  
language sql  
immutable  
as $$  
  select case tier  
    when 'free' then 0  
    when 'starter' then 1  
    when 'pro' then 2  
    when 'master' then 3  
    else \-1  
  end;  
$$;

\-- \=========================================================  
\-- 8\) USER CURRENT TIER VIEW  
\-- Resolves current active tier from user\_subscriptions.  
\-- Falls back to profiles.subscription\_tier if needed.  
\-- \=========================================================  
create or replace view public.v\_user\_current\_tier as  
select  
  p.id as user\_id,  
  coalesce(us.tier, p.subscription\_tier) as tier\_key  
from public.profiles p  
left join public.user\_subscriptions us  
  on us.user\_id \= p.id  
 and us.status in ('active', 'trialing');

\-- \=========================================================  
\-- 9\) STRATEGY ACCESS VIEW  
\-- Shows what strategies a user can access based on tier.  
\-- \=========================================================  
create or replace view public.v\_user\_strategy\_access as  
select  
  uct.user\_id,  
  sr.id as strategy\_id,  
  sr.strategy\_key,  
  sr.internal\_name,  
  sr.public\_name,  
  sr.voice\_alias,  
  sr.description,  
  sr.category,  
  sr.min\_tier,  
  sr.is\_active,  
  uct.tier\_key as user\_tier,  
  case  
    when public.tier\_rank(uct.tier\_key) \>= public.tier\_rank(sr.min\_tier) then true  
    else false  
  end as has\_access  
from public.v\_user\_current\_tier uct  
cross join public.strategy\_registry sr  
where sr.is\_active \= true;

\-- \=========================================================  
\-- 10\) FEATURE ACCESS VIEW  
\-- Same concept for general feature entitlements.  
\-- \=========================================================  
create or replace view public.v\_user\_feature\_access as  
select  
  uct.user\_id,  
  fe.feature\_key,  
  fe.feature\_name,  
  fe.description,  
  fe.category,  
  fe.min\_tier,  
  fe.is\_active,  
  uct.tier\_key as user\_tier,  
  case  
    when public.tier\_rank(uct.tier\_key) \>= public.tier\_rank(fe.min\_tier) then true  
    else false  
  end as has\_access  
from public.v\_user\_current\_tier uct  
cross join public.feature\_entitlements fe  
where fe.is\_active \= true;

\-- \=========================================================  
\-- 11\) USER-LEVEL CHECK FUNCTIONS  
\-- Handy for RPC or server-side access checks.  
\-- \=========================================================  
create or replace function public.user\_has\_strategy\_access(  
  p\_user\_id uuid,  
  p\_strategy\_key text  
)  
returns boolean  
language plpgsql  
stable  
as $$  
declare  
  v\_user\_tier text;  
  v\_min\_tier text;  
  v\_override boolean;  
begin  
  \-- override check first  
  select ueo.access\_granted  
    into v\_override  
  from public.user\_entitlement\_overrides ueo  
  where ueo.user\_id \= p\_user\_id  
    and ueo.strategy\_key \= p\_strategy\_key  
    and (ueo.starts\_at is null or ueo.starts\_at \<= now())  
    and (ueo.ends\_at is null or ueo.ends\_at \>= now())  
  order by ueo.created\_at desc  
  limit 1;

  if v\_override is not null then  
    return v\_override;  
  end if;

  select tier\_key  
    into v\_user\_tier  
  from public.v\_user\_current\_tier  
  where user\_id \= p\_user\_id;

  select min\_tier  
    into v\_min\_tier  
  from public.strategy\_registry  
  where strategy\_key \= p\_strategy\_key  
    and is\_active \= true;

  if v\_user\_tier is null or v\_min\_tier is null then  
    return false;  
  end if;

  return public.tier\_rank(v\_user\_tier) \>= public.tier\_rank(v\_min\_tier);  
end;  
$$;

create or replace function public.user\_has\_feature\_access(  
  p\_user\_id uuid,  
  p\_feature\_key text  
)  
returns boolean  
language plpgsql  
stable  
as $$  
declare  
  v\_user\_tier text;  
  v\_min\_tier text;  
  v\_override boolean;  
begin  
  select ueo.access\_granted  
    into v\_override  
  from public.user\_entitlement\_overrides ueo  
  where ueo.user\_id \= p\_user\_id  
    and ueo.feature\_key \= p\_feature\_key  
    and (ueo.starts\_at is null or ueo.starts\_at \<= now())  
    and (ueo.ends\_at is null or ueo.ends\_at \>= now())  
  order by ueo.created\_at desc  
  limit 1;

  if v\_override is not null then  
    return v\_override;  
  end if;

  select tier\_key  
    into v\_user\_tier  
  from public.v\_user\_current\_tier  
  where user\_id \= p\_user\_id;

  select min\_tier  
    into v\_min\_tier  
  from public.feature\_entitlements  
  where feature\_key \= p\_feature\_key  
    and is\_active \= true;

  if v\_user\_tier is null or v\_min\_tier is null then  
    return false;  
  end if;

  return public.tier\_rank(v\_user\_tier) \>= public.tier\_rank(v\_min\_tier);  
end;  
$$;

\-- \=========================================================  
\-- 12\) SEED CANONICAL TIERS  
\-- Safe upserts for V1 truth.  
\-- \=========================================================  
insert into public.subscription\_tiers (  
  tier\_key, display\_name, marketing\_label, price\_monthly, price\_annual, sort\_order  
)  
values  
  ('free',    'Free Explorer', 'Free Explorer', 0.00, 0.00, 0),  
  ('starter', 'BrewStarter',   'BrewStarter',   4.99, null, 1),  
  ('pro',     'BrewPro',       'BrewPro',       9.99, null, 2),  
  ('master',  'BrewMaster',    'BrewMaster',   19.99, null, 3\)  
on conflict (tier\_key) do update  
set  
  display\_name   \= excluded.display\_name,  
  marketing\_label= excluded.marketing\_label,  
  price\_monthly  \= excluded.price\_monthly,  
  price\_annual   \= excluded.price\_annual,  
  sort\_order     \= excluded.sort\_order;

\-- \=========================================================  
\-- 13\) SEED V1 STRATEGIES  
\-- Aligned to current launch discipline.  
\-- \=========================================================  
insert into public.strategy\_registry (  
  strategy\_key,  
  internal\_name,  
  public\_name,  
  voice\_alias,  
  description,  
  category,  
  min\_tier,  
  sort\_order,  
  metadata  
)  
values  
  (  
    'hot\_cold',  
    'hotCold',  
    'Hot / Cold',  
    'Heat Check',  
    'Basic hot and cold number analysis.',  
    'core',  
    'free',  
    10,  
    '{"ui\_group":"starter"}'::jsonb  
  ),  
  (  
    'momentum',  
    'momentum',  
    'Momentum',  
    'Momentum Pulse',  
    'Tracks trend acceleration and recent number movement.',  
    'core',  
    'free',  
    20,  
    '{"ui\_group":"starter"}'::jsonb  
  ),  
  (  
    'poisson\_basic',  
    'poissonBasic',  
    'Poisson',  
    'Classic Flow',  
    'Basic statistical probability modeling.',  
    'advanced',  
    'starter',  
    30,  
    '{"ui\_group":"starter"}'::jsonb  
  ),  
  (  
    'strategy\_explanations',  
    'strategyExplanations',  
    'Strategy Explanations',  
    'Why This Pick',  
    'Expanded reasoning and pick explanation layer.',  
    'utility',  
    'starter',  
    40,  
    '{"ui\_group":"locker"}'::jsonb  
  ),  
  (  
    'advanced\_scoring',  
    'advancedScoring',  
    'Advanced Strategy Scoring',  
    'Scoring Matrix',  
    'Ranks candidate picks with richer weighted scoring.',  
    'advanced',  
    'pro',  
    50,  
    '{"ui\_group":"pro"}'::jsonb  
  ),  
  (  
    'confidence\_bands',  
    'confidenceBands',  
    'Confidence Bands',  
    'Confidence View',  
    'Adds confidence ranges and comparison bands to picks.',  
    'advanced',  
    'pro',  
    60,  
    '{"ui\_group":"pro"}'::jsonb  
  ),  
  (  
    'prediction\_comparisons',  
    'predictionComparisons',  
    'Prediction Comparisons',  
    'Compare Paths',  
    'Compare multiple ranked picks and strategy outputs.',  
    'advanced',  
    'pro',  
    70,  
    '{"ui\_group":"pro"}'::jsonb  
  ),  
  (  
    'deep\_ai\_explanations',  
    'deepAiExplanations',  
    'Deep AI Explanations',  
    'Deep Brew Insight',  
    'Richer AI commentary and advanced explanation threads.',  
    'ai',  
    'master',  
    80,  
    '{"ui\_group":"master"}'::jsonb  
  ),  
  (  
    'early\_access\_strategies',  
    'earlyAccessStrategies',  
    'Early Access Strategies',  
    'Beta Lab',  
    'Preview upcoming models and strategies before broad release.',  
    'experimental',  
    'master',  
    90,  
    '{"ui\_group":"master"}'::jsonb  
  )  
on conflict (strategy\_key) do update  
set  
  internal\_name \= excluded.internal\_name,  
  public\_name   \= excluded.public\_name,  
  voice\_alias   \= excluded.voice\_alias,  
  description   \= excluded.description,  
  category      \= excluded.category,  
  min\_tier      \= excluded.min\_tier,  
  sort\_order    \= excluded.sort\_order,  
  metadata      \= excluded.metadata;

\-- \=========================================================  
\-- 14\) SEED V1 FEATURE ENTITLEMENTS  
\-- Backing for UI gating outside direct strategy keys.  
\-- \=========================================================  
insert into public.feature\_entitlements (  
  feature\_key,  
  feature\_name,  
  description,  
  category,  
  min\_tier,  
  sort\_order  
)  
values  
  ('basic\_predictions',        'Basic Predictions',         'Core prediction generation.',                       'general',    'free',    10),  
  ('prediction\_history\_basic', 'Prediction History',        'Limited prediction history.',                       'history',    'free',    20),  
  ('saved\_pick\_tracking',      'Saved Pick Tracking',       'Save and track picks over time.',                  'general',    'starter', 30),  
  ('strategy\_locker',          'Strategy Locker',           'Access Strategy Locker core experience.',           'strategy',   'starter', 40),  
  ('notifications\_hot',        'Hot Number Notifications',  'Notifications when hot numbers or watched events appear.', 'alerts', 'pro', 50),  
  ('advanced\_visual\_insights', 'Advanced Visual Insights',  'Enhanced overlays and comparisons.',               'analytics',  'pro',     60),  
  ('advanced\_analytics\_dash',  'Advanced Analytics',        'Extended analytics dashboard and deeper trends.',   'analytics',  'master',  70),  
  ('deep\_history\_analysis',    'Deep History Analysis',     'Extended draw history and deeper comparisons.',     'history',    'master',  80),  
  ('early\_access\_features',    'Early Access Features',     'Access beta strategies and experimental features.', 'general',    'master',  90\)  
on conflict (feature\_key) do update  
set  
  feature\_name \= excluded.feature\_name,  
  description  \= excluded.description,  
  category     \= excluded.category,  
  min\_tier     \= excluded.min\_tier,  
  sort\_order   \= excluded.sort\_order;

\-- \=========================================================  
\-- 15\) RLS  
\-- \=========================================================  
alter table public.user\_saved\_strategies enable row level security;  
alter table public.user\_strategy\_activity enable row level security;  
alter table public.user\_entitlement\_overrides enable row level security;

\-- public read for active registry/tiers/entitlements can be done through views or server.  
\-- If you want direct client reads later, we can add explicit select policies.

\-- \---------------------------------------------------------  
\-- user\_saved\_strategies  
\-- \----------------------------

# Official Tier Break Down

🔥 Great call asking this BEFORE we move forward — this is exactly how you avoid drift and tech debt.

I dug through your uploaded BrewLotto V1 docs, and here’s the truth \+ recommendation:

\---

🧠 What You Actually Have (Important)

You currently have TWO tier models defined:

\---

✅ Model A — Official V1 (Clean \+ Launch Ready)

From your core V1 spec:

Free Explorer

BrewStarter

BrewPro

BrewMaster

👉 This is your canonical V1 pricing structure 

\---

⚠️ Model B — Expanded / Experimental / Marketing Model

From other docs:

Free / Player

Pro / Strategist

Elite / Power Player

AND another variant:

Freemium

BrewLite

BrewElite

BrewMaster

👉 These are evolved / alternative / extended models  

\---

🚨 Key Insight (This is critical)

Your own V1 doc literally warns against:

\> “too many premium tiers too early” 

\---

🧭 PM DECISION (Lock This In)

❌ DO NOT blindly match every historical tier doc

That will:

confuse users

complicate gating logic

slow down launch

create UI inconsistency

\---

✅ DO THIS INSTEAD (Best Move)

👉 Use V1 Core Pricing Model as Source of Truth

Tier 0 → Free Explorer  
Tier 1 → BrewStarter  
Tier 2 → BrewPro  
Tier 3 → BrewMaster

\---

🔥 Why This Is the Right Call

Because this version is:

already aligned with Stripe billing spec

simpler to explain

scalable later

matches your “don’t overbuild V1” principle

\---

🧩 How to Handle the Other Tier Models

Don’t throw them away — they become:

👉 V2 Naming / Marketing Layer

Later you can:

Internal Tier	Public Branding

BrewStarter	“Starter”  
BrewPro	“Strategist”  
BrewMaster	“Power Player”

\---

🧠 Database Strategy (THIS IS IMPORTANT)

We should design DB like this:

✅ Store canonical tier

subscription\_tier text  
\-- values:  
'free'  
'starter'  
'pro'  
'master'

\---

🚫 DO NOT store:

BrewLite

Elite

Strategist

etc

Those become: 👉 display labels only

\---

🎯 Final Tier Mapping (LOCK THIS)

Database (truth)

free  
starter  
pro  
master

\---

UI (display)

Free Explorer  
BrewStarter  
BrewPro  
BrewMaster

\---

💡 Future-Proofing (you’ll thank yourself later)

Add optional column:

tier\_label text

So you can later rebrand without DB migration.

\---

🚀 FINAL ANSWER

Your question:

\> should it be identical to pricing tier?

👉 Answer:

✅ YES — use V1 pricing tier as single source of truth

BUT

❌ NO — do NOT mix in all historical tier variations

\---

🧭 What We Do Next

Now that we locked this:

👉 I will build the next SQL with:

proper tier enum alignment (free, starter, pro, master)

entitlement-ready structure

strategy gating compatibility

future-safe design

\---

🧠 PM Note

This was a high-impact decision point.

If we didn’t clean this now:

your UI

your billing

your gating logic

your analytics

…would all drift apart.

\---

🚀 Next Drop (ready when you are)

👉 Strategy Locker \+ Entitlements \+ Tier Gating SQL

This will connect:

subscription tier

strategy access

feature unlocks

UI gating

Say “drop it” and we lock in the final core system 🔥

# Core Loop Schema

\-- \=========================================================  
\-- BrewLotto V1 \- Core Loop Schema  
\-- Timestamp: 2026-03-17 ET  
\-- Purpose:  
\--   Prediction records, explanation records, user play logs,  
\--   watchlists, and alert-ready tracking to complete the  
\--   BrewLotto core product loop.  
\-- \=========================================================

create extension if not exists pgcrypto;

\-- \---------------------------------------------------------  
\-- updated\_at helper  
\-- \---------------------------------------------------------  
create or replace function public.set\_updated\_at()  
returns trigger  
language plpgsql  
as $$  
begin  
  new.updated\_at \= now();  
  return new;  
end;  
$$;

\-- \=========================================================  
\-- 1\) PREDICTIONS  
\-- Stores generated prediction sets from the engine.  
\-- Can be system-generated, user-requested, or scheduled.  
\-- \=========================================================  
create table if not exists public.predictions (  
  id uuid primary key default gen\_random\_uuid(),  
  user\_id uuid null references public.profiles(id) on delete set null,  
  state text not null,  
  game text not null,  
  draw\_date date,  
  draw\_time text,  
  prediction\_type text not null default 'on\_demand', \-- on\_demand, scheduled, daily\_featured, comparison  
  source\_strategy\_key text,  
  strategy\_bundle jsonb not null default '\[\]'::jsonb,  
  predicted\_numbers jsonb not null,  
  bonus\_number integer,  
  confidence\_score numeric(6,2),  
  rank\_score numeric(10,4),  
  risk\_level text default 'medium',  
  is\_saved boolean not null default false,  
  is\_featured boolean not null default false,  
  generation\_context jsonb not null default '{}'::jsonb,  
  created\_at timestamptz not null default now(),  
  updated\_at timestamptz not null default now(),

  constraint predictions\_state\_check  
    check (state in ('NC', 'CA')),

  constraint predictions\_game\_check  
    check (  
      game in (  
        'pick3',  
        'pick4',  
        'cash5',  
        'daily3',  
        'daily4',  
        'fantasy5',  
        'powerball',  
        'mega\_millions'  
      )  
    ),

  constraint predictions\_draw\_time\_check  
    check (  
      draw\_time is null or  
      draw\_time in ('midday', 'evening', 'nightly', 'draw')  
    ),

  constraint predictions\_type\_check  
    check (  
      prediction\_type in (  
        'on\_demand',  
        'scheduled',  
        'daily\_featured',  
        'comparison',  
        'simulation'  
      )  
    ),

  constraint predictions\_risk\_level\_check  
    check (  
      risk\_level in ('low', 'medium', 'high')  
    ),

  constraint predictions\_numbers\_is\_array  
    check (jsonb\_typeof(predicted\_numbers) \= 'array'),

  constraint predictions\_strategy\_bundle\_is\_array  
    check (jsonb\_typeof(strategy\_bundle) \= 'array'),

  constraint predictions\_confidence\_score\_range  
    check (  
      confidence\_score is null or  
      (confidence\_score \>= 0 and confidence\_score \<= 100\)  
    )  
);

create index if not exists idx\_predictions\_user\_id  
  on public.predictions (user\_id);

create index if not exists idx\_predictions\_state\_game\_date  
  on public.predictions (state, game, draw\_date desc);

create index if not exists idx\_predictions\_created\_at  
  on public.predictions (created\_at desc);

create index if not exists idx\_predictions\_source\_strategy\_key  
  on public.predictions (source\_strategy\_key);

drop trigger if exists trg\_predictions\_updated\_at on public.predictions;  
create trigger trg\_predictions\_updated\_at  
before update on public.predictions  
for each row  
execute function public.set\_updated\_at();

\-- \=========================================================  
\-- 2\) PREDICTION EXPLANATIONS  
\-- Explanation layer for each prediction.  
\-- Brew commentary and trust-aware explanation surface.  
\-- \=========================================================  
create table if not exists public.prediction\_explanations (  
  id uuid primary key default gen\_random\_uuid(),  
  prediction\_id uuid not null references public.predictions(id) on delete cascade,  
  user\_id uuid null references public.profiles(id) on delete set null,  
  explanation\_type text not null default 'summary', \-- summary, detailed, ai\_enhanced, locker  
  title text,  
  summary\_text text,  
  detail\_text text,  
  commentary\_payload jsonb not null default '{}'::jsonb,  
  evidence\_payload jsonb not null default '{}'::jsonb,  
  provider text, \-- internal, openai, hybrid, rules  
  provider\_model text,  
  trust\_score integer,  
  is\_compliant boolean not null default true,  
  created\_at timestamptz not null default now(),

  constraint prediction\_explanations\_unique\_prediction\_type  
    unique (prediction\_id, explanation\_type),

  constraint prediction\_explanations\_type\_check  
    check (  
      explanation\_type in (  
        'summary',  
        'detailed',  
        'ai\_enhanced',  
        'locker',  
        'results\_recap'  
      )  
    ),

  constraint prediction\_explanations\_trust\_score\_range  
    check (  
      trust\_score is null or  
      (trust\_score \>= 0 and trust\_score \<= 100\)  
    )  
);

create index if not exists idx\_prediction\_explanations\_prediction\_id  
  on public.prediction\_explanations (prediction\_id);

create index if not exists idx\_prediction\_explanations\_user\_id  
  on public.prediction\_explanations (user\_id);

\-- \=========================================================  
\-- 3\) PLAY LOGS  
\-- Logs user actions when they choose to play or track a prediction.  
\-- Separate from user\_picks so we preserve prediction lineage.  
\-- \=========================================================  
create table if not exists public.play\_logs (  
  id uuid primary key default gen\_random\_uuid(),  
  user\_id uuid not null references public.profiles(id) on delete cascade,  
  prediction\_id uuid null references public.predictions(id) on delete set null,  
  user\_pick\_id uuid null references public.user\_picks(id) on delete set null,  
  state text not null,  
  game text not null,  
  draw\_date date not null,  
  draw\_time text,  
  played\_numbers jsonb not null,  
  played\_bonus\_number integer,  
  play\_source text not null default 'saved\_prediction', \-- saved\_prediction, manual\_entry, quick\_pick, import  
  amount\_spent numeric(10,2),  
  was\_played boolean not null default true,  
  is\_settled boolean not null default false,  
  settled\_at timestamptz,  
  outcome\_result\_code text,  
  outcome\_match\_count integer,  
  outcome\_bonus\_match boolean,  
  outcome\_payout\_amount numeric(10,2),  
  metadata jsonb not null default '{}'::jsonb,  
  created\_at timestamptz not null default now(),  
  updated\_at timestamptz not null default now(),

  constraint play\_logs\_state\_check  
    check (state in ('NC', 'CA')),

  constraint play\_logs\_game\_check  
    check (  
      game in (  
        'pick3',  
        'pick4',  
        'cash5',  
        'daily3',  
        'daily4',  
        'fantasy5',  
        'powerball',  
        'mega\_millions'  
      )  
    ),

  constraint play\_logs\_draw\_time\_check  
    check (  
      draw\_time is null or  
      draw\_time in ('midday', 'evening', 'nightly', 'draw')  
    ),

  constraint play\_logs\_source\_check  
    check (  
      play\_source in (  
        'saved\_prediction',  
        'manual\_entry',  
        'quick\_pick',  
        'import'  
      )  
    ),

  constraint play\_logs\_numbers\_is\_array  
    check (jsonb\_typeof(played\_numbers) \= 'array'),

  constraint play\_logs\_amount\_spent\_nonnegative  
    check (amount\_spent is null or amount\_spent \>= 0),

  constraint play\_logs\_payout\_nonnegative  
    check (outcome\_payout\_amount is null or outcome\_payout\_amount \>= 0),

  constraint play\_logs\_match\_count\_nonnegative  
    check (outcome\_match\_count is null or outcome\_match\_count \>= 0\)  
);

create index if not exists idx\_play\_logs\_user\_id  
  on public.play\_logs (user\_id);

create index if not exists idx\_play\_logs\_user\_date  
  on public.play\_logs (user\_id, draw\_date desc);

create index if not exists idx\_play\_logs\_prediction\_id  
  on public.play\_logs (prediction\_id);

create index if not exists idx\_play\_logs\_user\_pick\_id  
  on public.play\_logs (user\_pick\_id);

drop trigger if exists trg\_play\_logs\_updated\_at on public.play\_logs;  
create trigger trg\_play\_logs\_updated\_at  
before update on public.play\_logs  
for each row  
execute function public.set\_updated\_at();

\-- \=========================================================  
\-- 4\) WATCHLISTS  
\-- User-created number watchlists for alerts and monitoring.  
\-- \=========================================================  
create table if not exists public.watchlists (  
  id uuid primary key default gen\_random\_uuid(),  
  user\_id uuid not null references public.profiles(id) on delete cascade,  
  name text not null,  
  description text,  
  state text,  
  game text,  
  is\_active boolean not null default true,  
  alert\_on\_hit boolean not null default true,  
  alert\_on\_hot boolean not null default true,  
  alert\_on\_draw\_posted boolean not null default false,  
  created\_at timestamptz not null default now(),  
  updated\_at timestamptz not null default now(),

  constraint watchlists\_state\_check  
    check (  
      state is null or state in ('NC', 'CA')  
    ),

  constraint watchlists\_game\_check  
    check (  
      game is null or game in (  
        'pick3',  
        'pick4',  
        'cash5',  
        'daily3',  
        'daily4',  
        'fantasy5',  
        'powerball',  
        'mega\_millions'  
      )  
    )  
);

create index if not exists idx\_watchlists\_user\_id  
  on public.watchlists (user\_id);

drop trigger if exists trg\_watchlists\_updated\_at on public.watchlists;  
create trigger trg\_watchlists\_updated\_at  
before update on public.watchlists  
for each row  
execute function public.set\_updated\_at();

\-- \=========================================================  
\-- 5\) WATCHLIST NUMBERS  
\-- Supports exact watched numbers and optional bonus number.  
\-- \=========================================================  
create table if not exists public.watchlist\_numbers (  
  id uuid primary key default gen\_random\_uuid(),  
  watchlist\_id uuid not null references public.watchlists(id) on delete cascade,  
  numbers jsonb not null,  
  bonus\_number integer,  
  label text,  
  created\_at timestamptz not null default now(),

  constraint watchlist\_numbers\_is\_array  
    check (jsonb\_typeof(numbers) \= 'array')  
);

create index if not exists idx\_watchlist\_numbers\_watchlist\_id  
  on public.watchlist\_numbers (watchlist\_id);

\-- \=========================================================  
\-- 6\) PREDICTION \-\> USER PICK HELPER VIEW  
\-- Useful for My Picks / Results / Locker context.  
\-- \=========================================================  
create or replace view public.v\_predictions\_with\_explanations as  
select  
  p.id as prediction\_id,  
  p.user\_id,  
  p.state,  
  p.game,  
  p.draw\_date,  
  p.draw\_time,  
  p.prediction\_type,  
  p.source\_strategy\_key,  
  p.strategy\_bundle,  
  p.predicted\_numbers,  
  p.bonus\_number,  
  p.confidence\_score,  
  p.rank\_score,  
  p.risk\_level,  
  p.is\_saved,  
  p.is\_featured,  
  p.generation\_context,  
  p.created\_at as prediction\_created\_at,

  pe.id as explanation\_id,  
  pe.explanation\_type,  
  pe.title,  
  pe.summary\_text,  
  pe.detail\_text,  
  pe.commentary\_payload,  
  pe.evidence\_payload,  
  pe.provider,  
  pe.provider\_model,  
  pe.trust\_score,  
  pe.is\_compliant,  
  pe.created\_at as explanation\_created\_at  
from public.predictions p  
left join public.prediction\_explanations pe  
  on pe.prediction\_id \= p.id;

\-- \=========================================================  
\-- 7\) USER WATCHLIST SNAPSHOT VIEW  
\-- Quick frontend-friendly view for watchlists.  
\-- \=========================================================  
create or replace view public.v\_user\_watchlists as  
select  
  w.id as watchlist\_id,  
  w.user\_id,  
  w.name,  
  w.description,  
  w.state,  
  w.game,  
  w.is\_active,  
  w.alert\_on\_hit,  
  w.alert\_on\_hot,  
  w.alert\_on\_draw\_posted,  
  w.created\_at,  
  jsonb\_agg(  
    jsonb\_build\_object(  
      'id', wn.id,  
      'numbers', wn.numbers,  
      'bonus\_number', wn.bonus\_number,  
      'label', wn.label  
    )  
    order by wn.created\_at  
  ) filter (where wn.id is not null) as watched\_entries  
from public.watchlists w  
left join public.watchlist\_numbers wn  
  on wn.watchlist\_id \= w.id  
group by  
  w.id, w.user\_id, w.name, w.description, w.state, w.game,  
  w.is\_active, w.alert\_on\_hit, w.alert\_on\_hot, w.alert\_on\_draw\_posted, w.created\_at;

\-- \=========================================================  
\-- 8\) AUTO-SETTLE PLAY LOG HELPER  
\-- Optional utility function to settle a play log from a result payload.  
\-- Useful for jobs later.  
\-- \=========================================================  
create or replace function public.settle\_play\_log(  
  p\_play\_log\_id uuid,  
  p\_result\_code text,  
  p\_match\_count integer,  
  p\_bonus\_match boolean,  
  p\_payout\_amount numeric  
)  
returns void  
language plpgsql  
as $$  
begin  
  update public.play\_logs  
  set  
    is\_settled \= true,  
    settled\_at \= now(),  
    outcome\_result\_code \= p\_result\_code,  
    outcome\_match\_count \= p\_match\_count,  
    outcome\_bonus\_match \= coalesce(p\_bonus\_match, false),  
    outcome\_payout\_amount \= p\_payout\_amount,  
    updated\_at \= now()  
  where id \= p\_play\_log\_id;  
end;  
$$;

\-- \=========================================================  
\-- 9\) RLS  
\-- \=========================================================  
alter table public.predictions enable row level security;  
alter table public.prediction\_explanations enable row level security;  
alter table public.play\_logs enable row level security;  
alter table public.watchlists enable row level security;  
alter table public.watchlist\_numbers enable row level security;

\-- \---------------------------------------------------------  
\-- predictions  
\-- Users can see their own predictions \+ featured/system predictions  
\-- \---------------------------------------------------------  
drop policy if exists "predictions\_select\_own\_or\_featured" on public.predictions;  
create policy "predictions\_select\_own\_or\_featured"  
on public.predictions  
for select  
to authenticated  
using (  
  auth.uid() \= user\_id  
  or is\_featured \= true  
);

drop policy if exists "predictions\_insert\_own" on public.predictions;  
create policy "predictions\_insert\_own"  
on public.predictions  
for insert  
to authenticated  
with check (  
  user\_id is null or auth.uid() \= user\_id  
);

drop policy if exists "predictions\_update\_own" on public.predictions;  
create policy "predictions\_update\_own"  
on public.predictions  
for update  
to authenticated  
using (auth.uid() \= user\_id)  
with check (auth.uid() \= user\_id);

\-- \---------------------------------------------------------  
\-- prediction\_explanations  
\-- Access follows prediction ownership  
\-- \---------------------------------------------------------  
drop policy if exists "prediction\_explanations\_select\_related" on public.prediction\_explanations;  
create policy "prediction\_explanations\_select\_related"  
on public.prediction\_explanations  
for select  
to authenticated  
using (  
  user\_id \= auth.uid()  
  or exists (  
    select 1  
    from public.predictions p  
    where p.id \= prediction\_id  
      and (p.user\_id \= auth.uid() or p.is\_featured \= true)  
  )  
);

\-- backend/service role should write most explanations

\-- \---------------------------------------------------------  
\-- play\_logs  
\-- \---------------------------------------------------------  
drop policy if exists "play\_logs\_select\_own" on public.play\_logs;  
create policy "play\_logs\_select\_own"  
on public.play\_logs  
for select  
to authenticated  
using (auth.uid() \= user\_id);

drop policy if exists "play\_logs\_insert\_own" on public.play\_logs;  
create policy "play\_logs\_insert\_own"  
on public.play\_logs  
for insert  
to authenticated  
with check (auth.uid() \= user\_id);

drop policy if exists "play\_logs\_update\_own" on public.play\_logs;  
create policy "play\_logs\_update\_own"  
on public.play\_logs  
for update  
to authenticated  
using (auth.uid() \= user\_id)  
with check (auth.uid() \= user\_id);

drop policy if exists "play\_logs\_delete\_own" on public.play\_logs;  
create policy "play\_logs\_delete\_own"  
on public.play\_logs  
for delete  
to authenticated  
using (auth.uid() \= user\_id);

\-- \---------------------------------------------------------  
\-- watchlists  
\-- \---------------------------------------------------------  
drop policy if exists "watchlists\_select\_own" on public.watchlists;  
create policy "watchlists\_select\_own"  
on public.watchlists  
for select  
to authenticated  
using (auth.uid() \= user\_id);

drop policy if exists "watchlists\_insert\_own" on public.watchlists;  
create policy "watchlists\_insert\_own"  
on public.watchlists  
for insert  
to authenticated  
with check (auth.uid() \= user\_id);

drop policy if exists "watchlists\_update\_own" on public.watchlists;  
create policy "watchlists\_update\_own"  
on public.watchlists  
for update  
to authenticated  
using (auth.uid() \= user\_id)  
with check (auth.uid() \= user\_id);

drop policy if exists "watchlists\_delete\_own" on public.watchlists;  
create policy "watchlists\_delete\_own"  
on public.watchlists  
for delete  
to authenticated  
using (auth.uid() \= user\_id);

\-- \---------------------------------------------------------  
\-- watchlist\_numbers  
\-- Access through parent watchlist ownership  
\-- \---------------------------------------------------------  
drop policy if exists "watchlist\_numbers\_select\_own" on public.watchlist\_numbers;  
create policy "watchlist\_numbers\_select\_own"  
on public.watchlist\_numbers  
for select  
to authenticated  
using (  
  exists (  
    select 1  
    from public.watchlists w  
    where w.id \= watchlist\_id  
      and w.user\_id \= auth.uid()  
  )  
);

drop policy if exists "watchlist\_numbers\_insert\_own" on public.watchlist\_numbers;  
create policy "watchlist\_numbers\_insert\_own"  
on public.watchlist\_numbers  
for insert  
to authenticated  
with check (  
  exists (  
    select 1  
    from public.watchlists w  
    where w.id \= watchlist\_id  
      and w.user\_id \= auth.uid()  
  )  
);

drop policy if exists "watchlist\_numbers\_update\_own" on public.watchlist\_numbers;  
create policy "watchlist\_numbers\_update\_own"  
on public.watchlist\_numbers  
for update  
to authenticated  
using (  
  exists (  
    select 1  
    from public.watchlists w  
    where w.id \= watchlist\_id  
      and w.user\_id \= auth.uid()  
  )  
)  
with check (  
  exists (  
    select 1  
    from public.watchlists w  
    where w.id \= watchlist\_id  
      and w.user\_id \= auth.uid()  
  )  
);

drop policy if exists "watchlist\_numbers\_delete\_own" on public.watchlist\_numbers;  
create policy "watchlist\_numbers\_delete\_own"  
on public.watchlist\_numbers  
for delete  
to authenticated  
using (  
  exists (  
    select 1  
    from public.watchlists w  
    where w.id \= watchlist\_id  
      and w.user\_id \= auth.uid()  
  )  
);

\-- \=========================================================  
\-- 10\) COMMENTS  
\-- \=========================================================  
comment on table public.predictions is  
'Stores prediction outputs from the BrewLotto engine for users, featured surfaces, and future comparisons.';

comment on table public.prediction\_explanations is  
'Stores explanation text and commentary payloads linked to predictions.';

comment on table public.play\_logs is  
'Tracks what the user actually chose to play or log, including settlement/outcome details.';

comment on table public.watchlists is  
'User-created watchlists for favorite numbers, sets, and monitored games.';

comment on table public.watchlist\_numbers is  
'Number entries contained within a watchlist.';

comment on view public.v\_predictions\_with\_explanations is  
'Convenience view joining predictions with their explanation payloads.';

comment on view public.v\_user\_watchlists is  
'Frontend-friendly watchlist view with aggregated watched number entries.';

# Next.ts implementation

My recommendation

Treat the Next.js Route Implementation Order as:

the final pre-dashboard backend handoff artifact

Not the final document overall, but the final one needed before Public Product Experience / dashboard build accelerates.

\---

Recommended Next.js Route Implementation Order

This is the order I’d give Mimo so the dashboard phase lands on stable APIs.

Route Sprint 0 — Foundation / Metadata

Build these first:

/api/profile  
/api/settings  
/api/subscription  
/api/subscription/tiers  
/api/games  
/api/states

Why first:

profile/account/subscription are needed for avatar menu, tier display, and gating

game/state config must exist before dashboard tabs and per-game surfaces

\---

Route Sprint 1 — Draw Data / Results Core

Build next:

/api/results/today  
/api/results/history  
/api/results/compare

Why:

your Results page and Draw Center are core UX

official results are a hard dependency for outcome tracking

comparison endpoint powers “what I played vs what hit”

This supports the product goal that users can track what they played and how they’re doing 

\---

Route Sprint 2 — Prediction Core

Then:

/api/predictions  
/api/predictions/:id  
/api/prediction-explanations/:predictionId

Why:

this is the bridge between the prediction engine and public UX

the docs explicitly place prediction APIs in the application layer and explanation generation after BrewTruth validation in the prediction chain 

\---

Route Sprint 3 — Picks / Play Logging Core

Then:

/api/picks  
/api/picks/from-prediction  
/api/picks/:id

Why:

V1 requires saved picks, play logging, and outcome tracking end to end 

this is required before My Picks becomes real

\---

Route Sprint 4 — Strategy Locker / Tier Gating

Then:

/api/strategy-locker  
/api/strategy-locker/:strategyKey  
/api/strategy-locker/save

Why:

V1 keeps tier-gated strategy access

Strategy Locker is part of the public product experience, but it should land after prediction \+ pick core is stable 

\---

Route Sprint 5 — Watchlists \+ Notifications

Then:

/api/watchlists  
/api/watchlists/:id/numbers  
/api/notifications  
/api/notifications/preferences

Why:

V1 notifications should start simple: draw posted, watched number hit, tier reminders, streaks 

these are valuable, but not blockers for first dashboard render

\---

Route Sprint 6 — Gamification / Progression

Then:

/api/gamification/profile  
/api/gamification/missions  
/api/gamification/achievements  
/api/gamification/event

Why:

user progression services are in the application layer

but gamification should not block stable results/picks/predictions 

\---

Route Sprint 7 — Billing Webhooks \+ Admin/Ops

Then:

/api/webhooks/stripe  
/api/admin/health  
/api/admin/ingestion/logs  
/api/admin/predictions/logs  
/api/admin/feature-flags

Why:

canonical roadmap places billing/entitlements/notifications after public experience, and BrewCommand admin later still

BrewCommand should stay internal and reduced for V1, not block dashboard progress 

\---

What should be considered “dashboard-ready”

Before Mimo starts heavy dashboard implementation, these should be done:

/api/profile  
/api/subscription  
/api/games  
/api/results/today  
/api/results/compare  
/api/predictions  
/api/picks

That is the minimum stable contract set for:

header/profile state

game tabs

prediction card

My Picks

Results page

account tier awareness

\---

PM verdict

So to answer your question directly:

No, this is not the final overall BrewLotto artifact.  
But yes, this should be the final backend/API ordering artifact you upload before the dashboard phase.

If you want the cleanest handoff to Mimo, the package to upload now should be:

1\. Supabase schema set

2\. tier/entitlement model

3\. core loop schema

4\. API contract spec

5\. Next.js route implementation order

That gives him everything needed to enter Phase 4 / Public Product Experience without guessing.