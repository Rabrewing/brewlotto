<!--
/brewexec/brewdocs/BREWLOTTO_V1_REFERRAL_UI_COPY_AND_WIREFRAME.md
Timestamp: 2026-03-21 ET
Phase: V1.5 / Referral UX Layer
Purpose: Define UI structure, screen layouts, component hierarchy, and production-ready copy for the BrewLotto referral system aligned with BrewVerse design language.
-->

# BrewLotto V1 Referral UI / UX Copy & Wireframe Spec

## 1. Purpose

This document defines the full UI/UX layer for the BrewLotto referral system.

It includes:

- screen structure
- layout hierarchy
- component breakdown
- production-ready copy
- user flows
- state handling
- visual direction aligned to BrewVerse (dark + gold + glow)

This is a **build-ready frontend spec**.

---

## 2. UX Goals

The referral experience must:

- feel premium (not promotional spammy)
- be simple (1–2 taps to share)
- clearly communicate value
- show progress and rewards
- reinforce “smarter play” positioning

---

## 3. Entry Points

Referral feature should be accessible from:

1. Profile / Account screen
2. Subscription / Upgrade screen
3. Dashboard promotional card (controlled via feature flag)

---

## 4. Core Screens

### 4.1 Referral Dashboard (Primary Screen)

#### Layout Structure

[Header]
[Hero Section]
[Share Section]
[How It Works]
[Progress + Stats]
[Rewards Section]

---

### 4.2 Screen Wireframe (Textual)

#### Header

- Back arrow
- Title: “Invite Friends”

---

#### Hero Section

Headline:
👉 Invite a friend. Unlock smarter play.

Subtext:
Share BrewLotto with friends and both unlock premium insights, strategies, and tools.

Visual:
- glowing BrewLotto 3D logo
- subtle gold aura background

---

#### Share Section

Primary Button:
👉 Invite a Friend

Secondary Elements:
- referral code display
- copy button

Example:

Your Code: RB-4821

Buttons:
[Copy Link]
[Share]

---

#### How It Works Section

Step 1:
Invite friends
Share your BrewLotto link

Step 2:
They start playing
Generate picks or track plays

Step 3:
You both unlock rewards
Premium insights, AI tools, and more

---

#### Progress Section

Cards:

Referrals Activated: 3
Next Reward: 5 referrals

Progress bar:
██████░░░░

---

#### Rewards Section

Active Reward:

“Pro Access Unlocked – 2 days remaining”

Future Reward:

“Invite 2 more friends to unlock 7-day Pro access”

---

## 5. Copy System (Production Ready)

### 5.1 Headlines

- Invite a friend. Unlock smarter play.
- Play smarter together.
- Share BrewLotto. Unlock premium insights.

---

### 5.2 Button Copy

Primary:
- Invite a Friend

Secondary:
- Copy Link
- Share Now

---

### 5.3 Notification Copy

Activation:
“Your friend started using BrewLotto. Your reward is now live.”

Reward:
“You unlocked Pro access from your referral.”

---

## 6. Interaction Flow

### 6.1 Share Flow

User taps Invite →
System opens native share sheet →
Link copied/shared →
Referral tracked

---

### 6.2 Activation Flow (Backend Triggered)

Referred user completes first pick →
System triggers activation →
Reward granted →
User notified

---

## 7. UI Component Breakdown

### Components

- ReferralHeroCard
- ReferralCodeCard
- ReferralStepsList
- ReferralProgressBar
- ReferralRewardCard
- ReferralStatsGrid

---

## 8. Visual Design Rules

### Colors

- Background: Soft Black (#1C1C1C)
- Accent: BrewGold (#FFD700)
- Glow: rgba(255,215,0,0.25)

### Effects

- glassmorphism cards
- soft gold glow
- subtle motion hover states

---

## 9. Mobile UX Considerations

- one-thumb interaction
- large CTA buttons
- stacked layout

---

## 10. Empty States

If no referrals yet:

Headline:
“No invites yet.”

Subtext:
“Start sharing BrewLotto and unlock rewards.”

---

## 11. Error States

- invalid referral
- expired reward
- duplicate referral

Message example:
“This referral is not eligible for rewards.”

---

## 12. Future Enhancements

- leaderboard
- referral streaks
- social badges

---

## 13. BrewDocs Summary

This document defines the full UI/UX and copy system for BrewLotto’s referral feature.

It ensures:

- premium experience
- clear messaging
- easy sharing
- high engagement

This is ready for Figma and frontend build.

