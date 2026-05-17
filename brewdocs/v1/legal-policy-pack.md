# BrewLotto V1 Legal Policy Pack

**Status:** Draft / internal spec
**Scope:** BrewLotto NC + CA launch support

This document is the working policy spec for the BrewLotto legal surface. It is not legal advice and should be reviewed by counsel before publication.

## Why this pack exists

BrewLotto is not a ticket seller. It is a prediction, tracking, education, and account surface that also logs saved picks, confirmed plays, notifications, billing state, and AI-assisted guidance.

Because the app serves North Carolina and California users, the policy set needs to cover:
- standard terms of use
- privacy notice and user rights
- a California supplement
- AI usage disclosure
- intellectual property / internet property rules
- responsible play and lottery disclaimer language

## Document set

| Document | Purpose | Launch status |
| --- | --- | --- |
| Terms of Use | Baseline service terms, eligibility, account rules, disclaimers, dispute / enforcement framework | Required |
| Privacy Policy | Data categories, purposes, retention, sharing, security, and request pathways | Required |
| California Privacy Notice | CCPA / CPRA rights notice and California-specific request language | Required for CA support if the business meets applicability thresholds |
| AI Usage Disclosure | Explain Brew AI, commentary, generated suggestions, limitations, and usage logging | Required |
| Intellectual Property / Internet Property Policy | Brand ownership, site content, reuse limits, user submission rights, scraping / copying restrictions | Required |
| Responsible Play / Lottery Disclaimer | Entertainment-only framing, age gating, loss limits, and helpline references | Required |

## 1. Terms of Use draft requirements

The Terms of Use should cover:
- minimum age and eligibility
- account creation and login responsibility
- no guarantee of winnings or outcomes
- saved picks, confirmed plays, and results are informational tools
- the user remains responsible for all lottery play decisions
- service availability may change by state, game, or vendor
- account suspension / termination rules
- acceptable use and anti-abuse rules
- limitation of liability
- dispute resolution and governing law

### NC / CA scope note

The terms should say that the service supports NC and CA game contexts, but the app does not change the underlying lottery operator rules. Official draw data, eligibility rules, and game availability always come from the applicable lottery source.

## 2. Privacy Policy draft requirements

The Privacy Policy should state, in plain language, what BrewLotto collects and why:
- account email and login metadata
- display name / profile details
- default state and gameplay preferences
- saved picks and play confirmations
- support requests and screenshots
- billing and entitlement state
- notification preferences
- AI usage and product telemetry if enabled

It should also explain:
- why the data is collected
- whether any data is shared with vendors
- how long data is retained
- how users request access, deletion, correction, or opt-out
- security controls in place at a high level
- contact path for privacy questions

## 3. California supplement requirements

The California addendum should be explicit that California residents may have rights under the CCPA / CPRA, including rights to:
- know what personal information is collected and how it is used
- delete personal information, subject to exceptions
- correct inaccurate personal information
- opt out of sale or sharing if applicable
- limit use of sensitive personal information if applicable
- non-discrimination for exercising privacy rights

### Implementation note

This supplement now has its own route at `/legal/privacy/california`. The main Privacy Policy should link into it and the Legal hub should also point there. If BrewLotto does not meet the statutory thresholds for a given period, the policy should still preserve the request flow and explain what happens when a request is received.

## 4. AI Usage Disclosure requirements

The AI disclosure should say:
- Brew AI can generate summaries, suggestions, and explainers
- AI output is advisory and may be wrong
- AI output does not change official draw results
- AI should not be represented as guaranteed prediction truth
- saved plays, win/loss, and settlement remain the source of truth
- AI usage may be logged for product, safety, and cost tracking
- tiering may limit AI usage or certain AI features

### Required product language

The product should clearly distinguish:
- deterministic product data
- user-confirmed play history
- official draw results
- AI commentary / explainers

## 5. Intellectual Property / Internet Property requirements

This policy should cover:
- BrewLotto brand names, logos, UI copy, screenshots, and generated content
- ownership of the BrewLotto site and application code
- restrictions on copying, scraping, mirroring, or republishing
- user-submitted content license needed to operate support and QA uploads
- whether AI-generated copy is owned by BrewLotto or licensed to the user
- trademark / service mark notices where needed
- third-party marks owned by their respective owners

### Practical rules

- Users may view and use BrewLotto for its intended purpose
- Users may not scrape, reverse engineer, or republish the service content without permission
- Lottery operator names and marks remain owned by the respective operators
- Official draw data should be attributed to the source operator or data provider

## 6. Responsible Play / Lottery Disclaimer requirements

The disclaimer should keep the app grounded:
- lottery play is for entertainment
- users should set a budget and play within their means
- results are not guaranteed
- the app is not a source of official winnings certification
- users should seek help if play feels harmful or compulsive

### NC and CA support references

The copy should support the NC and CA launch surface by linking to responsible play resources from the relevant lottery / state sources where possible.

## 7. Required supporting docs

These documents should exist before public V1 launch:
- `Terms of Use`
- `Privacy Policy`
- `California Privacy Notice / Supplement`
- `AI Usage Disclosure`
- `Intellectual Property / Content Policy`
- `Responsible Play / Lottery Disclaimer`

Optional but recommended:
- `Cookie / tracking notice` if the app uses non-essential analytics
- `Support / privacy request instructions`
- `Billing terms / subscription terms`

## 8. Open review questions for counsel

- What is the correct governing law / venue for the Terms?
- Do we need a separate consumer privacy request workflow or just a single privacy contact?
- Does BrewLotto meet California thresholds that require a formal CPRA notice right now?
- What exact AI disclosure language is required for generated commentary and strategy suggestions?
- How should user screenshots and support attachments be licensed?
- What retention period should apply to saved picks, play logs, support requests, and uploaded screenshots?

## 9. Implementation checklist

- [ ] Write the final Terms of Use
- [ ] Write the final Privacy Policy
- [ ] Write the California addendum
- [ ] Write the AI Usage Disclosure
- [ ] Write the IP / internet property policy
- [ ] Write the Responsible Play disclaimer
- [ ] Add the legal docs to the app / legal index
- [ ] Link policy requests from Support and Legal
- [ ] Review with counsel before public launch

## 10. Official source notes

Use these official sources as anchors when drafting the final text:
- California Attorney General, CCPA rights and notices: https://www.oag.ca.gov/privacy/ccpa
- California Privacy Protection Agency FAQ / CPRA background: https://cppa.ca.gov/faq
- California Attorney General CCPA regulations: https://www.oag.ca.gov/privacy/ccpa/regs
- North Carolina Education Lottery responsible play: https://nclottery.com/PlaySmart-Our-Commitment
- North Carolina Education Lottery terms and rules: https://nclottery.com/Terms
- North Carolina Education Lottery help and responsible play resources: https://nclottery.com/help
- FTC AI overview / compliance framing: https://www.ftc.gov/ai
