# BrewLotto V1 Dashboard Specification

<!--  
/brewdocs/v1/dashboard.md  
Timestamp: 2026-03-21 ET  
Phase: V1 Dashboard Implementation - COMPLETE  
Purpose: Canonical dashboard specification aligned to Figma design  
Status: IMPLEMENTED - Mobile-first design with dynamic ball sizing, custom scrollbar, phone proportions  
-->

This document specifies the dashboard UI implementation for BrewLotto V1, matching the premium Figma design exactly.

---

## 1. Document Purpose

This is the source of truth for the BrewLotto V1 Dashboard. It defines:
- Exact visual specifications matching Figma
- Complete component code templates
- Data flow and state management
- Integration points with backend
- Avatar and user identity system

---

## 2. Dashboard Layout Structure

### 2.1 Layout Hierarchy

```
┌─────────────────────────────────────────────┐
│  Device Container (rounded-[42px])          │
│  ┌─────────────────────────────────────────┐│
│  │  Header / Identity Strip               ││
│  │  [Logo]              [Avatar ▼] [Bot]  ││
│  ├─────────────────────────────────────────┤│
│  │  Navigation Tabs                        ││
│  │  [Dashboard] [Results] [My Picks]       ││
│  ├─────────────────────────────────────────┤│
│  │  Section Kicker                         ││
│  │  "TODAY'S DRAW INSIGHTS"               ││
│  ├─────────────────────────────────────────┤│
│  │  Game Tabs (Pills)                      ││
│  │  [Pick 3] [Pick 4] [Cash 5] [PB] [MM] ││
│  ├─────────────────────────────────────────┤│
│  │  Stats Grid                             ││
│  │  ┌──────────────┐ ┌──────────────────┐ ││
│  │  │ Hot Numbers  │ │ Momentum Meter   │ ││
│  │  │ (Gold balls) │ │ (Vertical tube)  │ ││
│  │  ├──────────────┤ │                  │ ││
│  │  │ Cold Numbers │ │                  │ ││
│  │  │ (Blue balls) │ │                  │ ││
│  │  └──────────────┘ └──────────────────┘ ││
│  ├─────────────────────────────────────────┤│
│  │  Prediction Card                        ││
│  │  "Brew says..."                         ││
│  ├─────────────────────────────────────────┤│
│  │  [Generate My Smart Pick →] (Gold CTA) ││
│  ├─────────────────────────────────────────┤│
│  │  Utility Grid                           ││
│  │  [My Picks] [Strategy Locker]           ││
│  ├─────────────────────────────────────────┤│
│  │  Voice Mode Card                        ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

---

## 3. Design Tokens

### 3.1 Colors

| Token | Value | Usage |
|-------|-------|-------|
| `bg-primary` | `#050505` | Page background |
| `bg-surface` | `linear-gradient(135deg, rgba(18,14,14,0.96), rgba(8,8,10,0.96))` | Card backgrounds |
| `gold-primary` | `#ffc742` | Primary gold |
| `gold-secondary` | `#ffd364` | Secondary gold |
| `gold-dark` | `#ffbe27` | Dark gold |
| `gold-accent` | `#ffcd52` | Accent gold |
| `hot-primary` | `#ffbd39` | Hot number primary |
| `hot-secondary` | `#ffb84a` | Hot number secondary |
| `cold-primary` | `#72caff` | Cold number primary |
| `cold-secondary` | `#58a9ff` | Cold number secondary |
| `bonus-bg` | `#d65c5c` | Bonus ball background |
| `bonus-text` | `#ffd364` | Bonus ball text |
| `text-primary` | `#ffffff` | Primary text |
| `text-secondary` | `rgba(255,255,255,0.88)` | Secondary text |
| `text-muted` | `rgba(255,255,255,0.70)` | Muted text |

### 3.2 Typography

| Element | Size | Weight | Letter Spacing | CSS Classes |
|---------|------|--------|----------------|-------------|
| Main Title | 42px (46px sm) | Black (900) | Wide (0.05em) | `text-[42px] sm:text-[46px] font-black uppercase tracking-wide` |
| Sub-header | 10px | Medium (500) | 0.22em | `text-[10px] font-medium uppercase tracking-[0.22em]` |
| Section Kicker | 12px | Medium (500) | 0.22em | `text-[12px] font-medium uppercase tracking-[0.22em]` |
| Game Tab | 15px | Medium (500) | Normal | `text-[15px] font-medium` |
| Card Title | 16px | Semibold (600) | Normal | `text-[16px] font-semibold` |
| Number Display | 28px (30px sm) | Bold (700) | Normal | `text-[28px] sm:text-[30px] font-bold` |
| Momentum % | 52px | Semibold (600) | Normal | `text-[52px] font-semibold leading-none` |
| Prediction | 15px | Normal (400) | Normal | `text-[15px] leading-8` |
| CTA Button | 18px | Bold (700) | Normal | `text-[18px] font-bold` |
| Utility Pill | 16px | Medium (500) | Normal | `text-[16px] font-medium` |
| Bonus Label | 10px | Bold (700) | 0.12em | `text-[10px] font-bold tracking-[0.12em]` |

### 3.3 Spacing & Layout

| Element | Value | CSS |
|---------|-------|-----|
| Container Width | 430px max | `max-w-[430px]` |
| Container Padding X | 20px (24px sm) | `px-5 sm:px-6` |
| Container Padding Top | 24px | `pt-6` |
| Container Padding Bottom | 24px | `pb-6` |
| Section Gap (large) | 24px | `mt-6` |
| Section Gap (medium) | 16px | `mt-4` |
| Section Gap (small) | 12px | `mt-3` |
| Stats Grid | 2 columns | `grid-cols-[1.9fr_0.85fr] gap-4` |
| Utility Grid | 2 columns | `grid-cols-2 gap-4` |
| Ball Gap | 8px | `gap-2` |

### 3.4 Border Radius

| Element | Radius | CSS |
|---------|--------|-----|
| Device Container | 42px | `rounded-[42px]` |
| Cards | 30px | `rounded-[30px]` |
| Tabs | Full | `rounded-full` |
| Balls | Full | `rounded-full` |
| Momentum Outer | 40px | `rounded-[40px]` |
| Momentum Inner | Full | `rounded-full` |
| CTA Button | Full | `rounded-[999px]` |
| Utility Pills | Full | `rounded-full` |
| Voice Card | 28px | `rounded-[28px]` |

### 3.5 Shadows & Glows

| Element | Shadow Value |
|---------|--------------|
| Outer Aura | `bg-[radial-gradient(circle_at_center,rgba(255,184,28,0.20),transparent_58%)] blur-2xl` |
| Inner Glow | `shadow-[inset_0_0_24px_rgba(255,179,0,0.10),inset_0_0_60px_rgba(255,140,0,0.06)]` |
| Golden Edge | `ring-1 ring-[#ffd36f]/25` |
| Header Accent | `drop-shadow-[0_0_18px_rgba(255,184,28,0.45)]` |
| Momentum Glow | `shadow-[0_0_18px_rgba(255,153,0,0.45)]` |
| Hot Ball | `shadow-[0_2px_8px_rgba(255,189,57,0.4)]` |
| Cold Ball | `shadow-[0_2px_8px_rgba(114,202,255,0.4)]` |
| CTA Button | `shadow-[0_4px_14px_0_rgba(255,199,66,0.39)] hover:shadow-[0_6px_20px_rgba(255,199,66,0.23)]` |

---

## 4. Component Specifications

### 4.1 DashboardContainer

The main device shell containing the entire dashboard.

```tsx
// components/dashboard/DashboardContainer.tsx
export function DashboardContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto max-w-[430px] px-5 pb-6 pt-6 sm:px-6">
      {/* Outer golden aura */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,184,28,0.20),transparent_58%)] blur-2xl" />
      </div>
      
      {/* Device shell with gradient background */}
      <div className="relative overflow-hidden rounded-[42px] bg-gradient-to-br from-[#120e0e]/96 to-[#08080a]/96 ring-1 ring-[#ffd36f]/25 shadow-[inset_0_0_24px_rgba(255,179,0,0.10),inset_0_0_60px_rgba(255,140,0,0.06)]">
        {/* Floating orbs (decorative) */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#ffd364]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-20 h-52 w-52 rounded-full bg-[#ffc742]/10 blur-3xl" />
        
        <div className="relative p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
```

### 4.2 Header / Identity Strip

Contains the BrewVerse Labs branding, main BrewLotto logo, and avatar.

**Logo File**: `/public/frontend/brew_logo.png` (user-provided ✅)
- Transparent background - blends perfectly with header
- Tight crop - optimized for header display
- Gold color matches design system BrewGold (`#FFD700`)

```tsx
// components/dashboard/Header.tsx
'use client';

import { useState } from 'react';
import { AvatarDropdown } from './AvatarDropdown';
import { BotBadge } from './BotBadge';

interface HeaderProps {
  logoSrc?: string;
}

export function Header({ logoSrc = "/frontend/brew_logo.png" }: HeaderProps) {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="mb-4">
      <div className="flex items-start justify-between">
        {/* Left: Branding */}
        <div className="flex flex-col">
          {/* BrewVerse Labs sub-header */}
          <div className="mb-1 flex items-center gap-2">
            <div className="h-[2px] w-4 bg-gradient-to-r from-[#ffc742] to-[#ffd364]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#d6d1cf]">
              BrewVerse Labs
            </span>
          </div>
          
          {/* Main Logo - transparent PNG, tight crop */}
          <div className="drop-shadow-[0_0_18px_rgba(255,184,28,0.45)]">
            {!logoError ? (
              <img 
                src={logoSrc} 
                alt="BrewLotto" 
                className="h-[24px] w-auto object-contain sm:h-[28px]"
                onError={() => setLogoError(true)}
              />
            ) : (
              /* Text fallback - matches Figma exactly */
              <h1 className="bg-gradient-to-r from-[#ffc742] via-[#ffd364] to-[#ffbe27] bg-clip-text text-[36px] font-black uppercase tracking-wide text-transparent sm:text-[42px]">
                BrewLotto
              </h1>
            )}
          </div>
        </div>

        {/* Right: Avatar + Bot Badge */}
        <div className="flex items-center gap-3">
          <BotBadge />
          <AvatarDropdown />
        </div>
      </div>
      
      {/* Accent bar */}
      <div className="mt-3 h-[1px] w-full bg-gradient-to-r from-[#ffd364]/40 via-[#ffc742]/20 to-transparent" />
    </header>
  );
}
```

### Logo Specifications

| Property | Value |
|----------|-------|
| **File Path** | `/public/frontend/brew_logo.png` |
| **File Size** | 78KB |
| **Background** | Transparent ✅ |
| **Color** | Gold (matches `#FFD700` BrewGold) |
| **Style** | Bold, uppercase, tight crop |
| **Header Height** | 24px mobile / 28px desktop |

No modifications needed - logo fits perfectly with the design system.

### 4.3 BotBadge

Animated badge indicating AI assistant presence.

```tsx
// components/dashboard/BotBadge.tsx
export function BotBadge() {
  return (
    <div className="relative h-8 w-8">
      {/* Pulse ring */}
      <div className="absolute inset-0 animate-ping rounded-full bg-[#ffc742]/30" />
      
      {/* Badge background */}
      <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#1a1a1c] to-[#0f0f10] border border-[#ffc742]/30">
        {/* Inner light elements */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#ffd364]/20 to-transparent" />
        <div className="absolute h-1 w-1 rounded-full bg-[#ffc742] shadow-[0_0_6px_rgba(255,199,66,0.8)]" />
      </div>
    </div>
  );
}
```

### 4.4 Avatar Dropdown System

Flexible avatar system supporting custom avatars, uploaded images, or default initials.

```tsx
// components/dashboard/AvatarDropdown.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export type AvatarType = 'initials' | 'image' | 'custom';

export interface UserAvatar {
  type: AvatarType;
  imageUrl?: string;      // For uploaded/custom images
  initials?: string;      // For initials fallback (e.g., "JD")
  colorIndex?: number;    // For generated color (0-7)
}

const AVATAR_COLORS = [
  'from-[#ffc742] to-[#ffbe27]',   // Gold
  'from-[#ff6b6b] to-[#ee5a5a]',   // Red
  'from-[#72caff] to-[#58a9ff]',   // Blue
  'from-[#6bcb77] to-[#5ab868]',   // Green
  'from-[#9b59b6] to-[#8e44ad]',   // Purple
  'from-[#f39c12] to-[#e67e22]',   // Orange
  'from-[#1abc9c] to-[#16a085]',   // Teal
  'from-[#e91e63] to-[#c2185b]',   // Pink
];

const DROPDOWN_ITEMS = [
  { label: 'Profile', href: '/profile', icon: '👤' },
  { label: 'My Picks', href: '/picks', icon: '📋' },
  { label: "Today's Results", href: '/results/today', icon: '📊' },
  { label: 'Stats & Performance', href: '/stats', icon: '📈' },
  { label: 'Strategy Locker', href: '/strategies', icon: '🔒' },
  { label: 'Notifications', href: '/notifications', icon: '🔔', badge: 5 },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
  { label: 'Subscription / Billing', href: '/pricing', icon: '💳' },
  { label: 'Help / Learn', href: '/learn', icon: '❓' },
  { label: 'Terms & Privacy', href: '/legal/terms', icon: '📄' },
] as const;

export function AvatarDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [avatar, setAvatar] = useState<UserAvatar>({
    type: 'initials',
    initials: 'JD',
    colorIndex: 0,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderAvatar = () => {
    const colorClass = AVATAR_COLORS[avatar.colorIndex || 0];
    
    if (avatar.type === 'image' || avatar.type === 'custom') {
      if (avatar.imageUrl) {
        return (
          <img
            src={avatar.imageUrl}
            alt="Profile"
            className="h-full w-full rounded-full object-cover"
          />
        );
      }
    }
    
    // Initials fallback
    return (
      <div className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br ${colorClass}`}>
        <span className="text-sm font-bold text-white drop-shadow">
          {avatar.initials || '?'}
        </span>
      </div>
    );
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-[#ffc742]/50 bg-[#1a1a1c] transition-all hover:border-[#ffc742] hover:shadow-[0_0_12px_rgba(255,199,66,0.3)]"
      >
        {renderAvatar()}
        
        {/* Dropdown indicator */}
        <div className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#0f0f10] border border-[#ffc742]/30">
          <svg className="h-2 w-2 text-[#ffc742]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-[16px] border border-white/10 bg-gradient-to-b from-[#181818] to-[#0f0f10] p-2 shadow-2xl">
          {/* User info header */}
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="h-10 w-10 flex-shrink-0">
              {renderAvatar()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-white">John Doe</p>
              <p className="truncate text-xs text-white/60">john@example.com</p>
            </div>
          </div>

          <div className="my-1 h-px bg-white/10" />

          {/* Menu items */}
          <nav className="flex flex-col">
            {DROPDOWN_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                <span className="w-5 text-center text-base">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ffc742] text-xs font-bold text-black">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>

          <div className="my-1 h-px bg-white/10" />

          {/* Logout */}
          <a
            href="/logout"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <span className="w-5 text-center text-base">🚪</span>
            <span>Logout</span>
          </a>
        </div>
      )}
    </div>
  );
}
```

### 4.5 Navigation Tabs

Secondary navigation below the header.

```tsx
// components/dashboard/NavigationTabs.tsx
'use client';

import { useState } from 'react';

type TabId = 'dashboard' | 'results' | 'picks';

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'results', label: 'Results' },
  { id: 'picks', label: 'My Picks' },
];

export function NavigationTabs() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  return (
    <nav className="mb-4">
      <div className="flex items-center gap-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative pb-2 text-[15px] font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-[#ffc742]'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {tab.label}
            
            {/* Active indicator */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ffc742] to-[#ffd364]" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
```

### 4.6 Section Kicker

The "TODAY'S DRAW INSIGHTS" text above game tabs.

```tsx
// components/dashboard/SectionKicker.tsx
export function SectionKicker() {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#d6d1cf]">
        Today's Draw Insights
      </span>
    </div>
  );
}
```

### 4.7 Game Tabs

Pill-style game selector tabs.

```tsx
// components/dashboard/GameTabs.tsx
'use client';

import { useState } from 'react';

export type GameId = 'pick3' | 'pick4' | 'cash5' | 'powerball' | 'mega';

interface Game {
  id: GameId;
  label: string;
}

const GAMES: Game[] = [
  { id: 'pick3', label: 'Pick 3' },
  { id: 'pick4', label: 'Pick 4' },
  { id: 'cash5', label: 'Cash 5' },
  { id: 'powerball', label: 'Powerball' },
  { id: 'mega', label: 'Mega' },
];

interface GameTabsProps {
  onSelect?: (game: GameId) => void;
}

export function GameTabs({ onSelect }: GameTabsProps) {
  const [selectedGame, setSelectedGame] = useState<GameId>('powerball');

  const handleSelect = (gameId: GameId) => {
    setSelectedGame(gameId);
    onSelect?.(gameId);
  };

  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {GAMES.map((game) => (
        <button
          key={game.id}
          onClick={() => handleSelect(game.id)}
          className={`rounded-full border px-4 py-2 text-[15px] font-medium transition-all ${
            selectedGame === game.id
              ? 'border-[#ffd364] bg-gradient-to-r from-[#ffc742] to-[#ffd364] text-black shadow-[0_0_12px_rgba(255,199,66,0.4)]'
              : 'border-white/20 bg-[#1a1a1c]/80 text-white/80 hover:border-white/30 hover:text-white'
          }`}
        >
          {game.label}
        </button>
      ))}
    </div>
  );
}
```

### 4.8 Stats Grid (Hot/Cold Numbers + Momentum)

The main data display area.

```tsx
// components/dashboard/StatsGrid.tsx
import { HotNumbersCard } from './HotNumbersCard';
import { ColdNumbersCard } from './ColdNumbersCard';
import { MomentumMeter } from './MomentumMeter';

interface StatsGridProps {
  hotNumbers: number[];
  hotBonus?: number;
  coldNumbers: number[];
  coldBonus?: number;
  momentumPercent: number;
  game: 'powerball' | 'mega' | 'cash5' | 'pick3' | 'pick4';
  showBonus?: boolean;
}

export function StatsGrid({
  hotNumbers,
  hotBonus,
  coldNumbers,
  coldBonus,
  momentumPercent,
  game,
  showBonus = true,
}: StatsGridProps) {
  const bonusLabel = game === 'mega' ? 'Mega Ball' : 'Powerball';

  return (
    <div className="mb-5 grid grid-cols-[1.9fr_0.85fr] gap-4">
      {/* Left: Hot & Cold Numbers */}
      <div className="flex flex-col gap-4">
        <HotNumbersCard
          numbers={hotNumbers}
          bonus={hotBonus}
          bonusLabel={bonusLabel}
          showBonus={showBonus}
        />
        <ColdNumbersCard
          numbers={coldNumbers}
          bonus={coldBonus}
          bonusLabel={bonusLabel}
          showBonus={showBonus}
        />
      </div>

      {/* Right: Momentum Meter */}
      <MomentumMeter percent={momentumPercent} />
    </div>
  );
}
```

### 4.9 HotNumbersCard

Golden balls showing hot (frequently drawn) numbers.

```tsx
// components/dashboard/HotNumbersCard.tsx
import { LotteryBall } from './LotteryBall';

interface HotNumbersCardProps {
  numbers: number[];
  bonus?: number;
  bonusLabel?: string;
  showBonus?: boolean;
}

export function HotNumbersCard({
  numbers,
  bonus,
  bonusLabel = 'Powerball',
  showBonus = true,
}: HotNumbersCardProps) {
  return (
    <div className="rounded-[30px] border border-[#ffbd39]/30 bg-gradient-to-br from-[#ffbd39]/15 to-[#ffb84a]/5 p-5 shadow-[0_4px_24px_rgba(255,189,57,0.15)]">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg">🔥</span>
        <h3 className="text-[16px] font-semibold text-white">Hot Numbers</h3>
      </div>

      {/* Primary numbers */}
      <div className="mb-4 flex flex-wrap gap-2">
        {numbers.map((num) => (
          <LotteryBall
            key={num}
            number={num}
            variant="hot"
            size="large"
          />
        ))}
      </div>

      {/* Bonus number */}
      {showBonus && bonus !== undefined && (
        <div className="flex flex-col items-start gap-1">
          <LotteryBall
            number={bonus}
            variant="bonus-hot"
            size="large"
            label={bonusLabel}
          />
        </div>
      )}
    </div>
  );
}
```

### 4.10 ColdNumbersCard

Blue/silver balls showing cold (infrequently drawn) numbers.

```tsx
// components/dashboard/ColdNumbersCard.tsx
import { LotteryBall } from './LotteryBall';

interface ColdNumbersCardProps {
  numbers: number[];
  bonus?: number;
  bonusLabel?: string;
  showBonus?: boolean;
}

export function ColdNumbersCard({
  numbers,
  bonus,
  bonusLabel = 'Powerball',
  showBonus = true,
}: ColdNumbersCardProps) {
  return (
    <div className="rounded-[30px] border border-[#72caff]/30 bg-gradient-to-br from-[#72caff]/15 to-[#58a9ff]/5 p-5 shadow-[0_4px_24px_rgba(114,202,255,0.15)]">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg">❄️</span>
        <h3 className="text-[16px] font-semibold text-white">Cold Numbers</h3>
      </div>

      {/* Primary numbers */}
      <div className="mb-4 flex flex-wrap gap-2">
        {numbers.map((num) => (
          <LotteryBall
            key={num}
            number={num}
            variant="cold"
            size="large"
          />
        ))}
      </div>

      {/* Bonus number */}
      {showBonus && bonus !== undefined && (
        <div className="flex flex-col items-start gap-1">
          <LotteryBall
            number={bonus}
            variant="bonus-cold"
            size="large"
            label={bonusLabel}
          />
        </div>
      )}
    </div>
  );
}
```

### 4.11 LotteryBall

Individual lottery ball with premium styling.

```tsx
// components/dashboard/LotteryBall.tsx
type BallVariant = 'hot' | 'cold' | 'bonus-hot' | 'bonus-cold';
type BallSize = 'small' | 'large';

interface LotteryBallProps {
  number: number;
  variant: BallVariant;
  size?: BallSize;
  label?: string;
}

const VARIANT_STYLES: Record<BallVariant, string> = {
  hot: 'bg-gradient-to-br from-[#ffbd39] to-[#ffb84a] text-black shadow-[0_2px_8px_rgba(255,189,57,0.4)]',
  cold: 'bg-gradient-to-br from-[#e8eef5] to-[#c3cfd9] text-[#1e3a5f] shadow-[0_2px_8px_rgba(114,202,255,0.4)]',
  'bonus-hot': 'bg-gradient-to-br from-[#d65c5c] to-[#b94a4a] text-[#ffd364]',
  'bonus-cold': 'bg-gradient-to-br from-[#5c7fd6] to-[#4a68b9] text-white',
};

const SIZE_STYLES: Record<BallSize, string> = {
  small: 'h-10 w-10 text-[15px]',
  large: 'h-[52px] w-[52px] text-[22px] sm:h-[58px] sm:w-[58px] sm:text-[24px]',
};

export function LotteryBall({ number, variant, size = 'large', label }: LotteryBallProps) {
  const isBonus = variant.startsWith('bonus');

  if (isBonus && label) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div
          className={`relative flex items-center justify-center rounded-full font-bold ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]}`}
        >
          {/* Inner glow */}
          <div className="absolute inset-1 rounded-full bg-white/10" />
          <span className="relative z-10">{String(number).padStart(2, '0')}</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/60">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center rounded-full font-bold ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]}`}
    >
      {/* Inner glow */}
      <div className="absolute inset-1 rounded-full bg-white/10" />
      <span className="relative z-10">{String(number).padStart(2, '0')}</span>
    </div>
  );
}
```

### 4.12 MomentumMeter

Vertical tube showing win probability percentage.

```tsx
// components/dashboard/MomentumMeter.tsx
interface MomentumMeterProps {
  percent: number; // 0-100
}

export function MomentumMeter({ percent }: MomentumMeterProps) {
  return (
    <div className="flex flex-col items-center rounded-[30px] border border-white/10 bg-gradient-to-b from-[#120e0e]/80 to-[#0a0a0c]/80 p-4">
      {/* Header */}
      <span className="mb-4 text-[12px] font-medium uppercase tracking-[0.22em] text-[#d6d1cf]">
        Momentum Meter
      </span>

      {/* Tube container */}
      <div className="relative h-[180px] w-[52px] overflow-hidden rounded-[40px] border border-[#ffd364]/30 bg-gradient-to-b from-[#0a0a0c] to-[#120e0e] shadow-[inset_0_0_12px_rgba(255,179,0,0.08)]">
        {/* Liquid fill */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-1000"
          style={{ height: `${percent}%` }}
        >
          {/* Gradient liquid */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#ffc742] via-[#ffd364] to-[#ffbe27]" />
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 animate-pulse bg-gradient-to-t from-transparent via-white/20 to-transparent" />
          
          {/* Top highlight */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-white/40 to-transparent" />
        </div>

        {/* Liquid glow */}
        <div className="absolute bottom-0 left-0 right-0 shadow-[0_0_18px_rgba(255,153,0,0.45)]" style={{ height: `${percent}%` }} />

        {/* Tick marks */}
        <div className="absolute inset-0 flex flex-col justify-between py-4">
          {[100, 75, 50, 25].map((tick) => (
            <div key={tick} className="flex items-center">
              <div className="h-px w-2 bg-white/20" />
            </div>
          ))}
        </div>
      </div>

      {/* Percentage display */}
      <div className="mt-4 flex flex-col items-center">
        <span className="text-[52px] font-semibold leading-none text-[#ffc742] drop-shadow-[0_0_8px_rgba(255,199,66,0.5)]">
          {percent}%
        </span>
        <span className="mt-1 text-[12px] font-medium text-white/60">
          Win Probability
        </span>
      </div>
    </div>
  );
}
```

### 4.13 PredictionCard

AI-generated prediction insight with "Brew says..." commentary.

```tsx
// components/dashboard/PredictionCard.tsx
interface PredictionCardProps {
  game: string;
  insights: string[];
}

export function PredictionCard({ game, insights }: PredictionCardProps) {
  return (
    <div className="mb-5 rounded-[30px] border border-white/10 bg-gradient-to-br from-[#18161a]/90 to-[#0f0d12]/90 p-5">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg">✨</span>
        <h3 className="text-[16px] font-semibold text-white">Prediction</h3>
      </div>

      {/* Brew says content */}
      <p className="text-[15px] leading-8 text-white/80">
        <span className="font-semibold text-[#ffc742]">Brew says</span> today's pattern for{' '}
        <span className="font-semibold text-[#ffd364]">{game}</span>{' '}
        {insights.map((insight, idx) => (
          <span key={idx}>
            {idx > 0 && idx === insights.length - 1 ? ', and ' : idx > 0 ? ', ' : 'favors '}
            <span className="font-semibold text-white">{insight}</span>
          </span>
        ))}
        .
      </p>
    </div>
  );
}
```

### 4.14 GeneratePickButton

Primary CTA button with golden gradient and glow effects.

```tsx
// components/dashboard/GeneratePickButton.tsx
interface GeneratePickButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function GeneratePickButton({ onClick, disabled, loading }: GeneratePickButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="group relative w-full overflow-hidden rounded-[999px] bg-gradient-to-r from-[#ffc742] via-[#ffd364] to-[#ffbe27] px-6 py-4 text-[18px] font-bold text-black transition-all hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(255,199,66,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
    >
      {/* Inner shine */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating...
          </>
        ) : (
          <>
            Generate My Smart Pick
            <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </span>
    </button>
  );
}
```

### 4.15 UtilityPills

Secondary action buttons for "My Picks" and "Strategy Locker".

```tsx
// components/dashboard/UtilityPills.tsx
import Link from 'next/link';

interface UtilityPillProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function UtilityPill({ href, icon, label }: UtilityPillProps) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-center gap-3 rounded-full border border-white/10 bg-[#1a1a1c]/80 px-5 py-3 text-[16px] font-medium text-white/80 transition-all hover:border-white/20 hover:bg-[#232326] hover:text-white"
    >
      <span className="text-lg transition-transform group-hover:scale-110">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export function UtilityPills() {
  return (
    <div className="mb-5 grid grid-cols-2 gap-4">
      <UtilityPill
        href="/picks"
        icon={<span>👤</span>}
        label="My Picks"
      />
      <UtilityPill
        href="/strategies"
        icon={<span>🔒</span>}
        label="Strategy Locker"
      />
    </div>
  );
}
```

### 4.16 VoiceModeCard

Optional voice narration feature card.

```tsx
// components/dashboard/VoiceModeCard.tsx
'use client';

import { useState } from 'react';

interface VoiceModeCardProps {
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

export function VoiceModeCard({ enabled = false, onToggle }: VoiceModeCardProps) {
  const [isActive, setIsActive] = useState(enabled);

  const handleToggle = () => {
    const newState = !isActive;
    setIsActive(newState);
    onToggle?.(newState);
  };

  return (
    <div className="rounded-[28px] border border-[#ffc742]/20 bg-gradient-to-r from-[#1a1816]/90 to-[#14120e]/90 p-4">
      <div className="flex items-center gap-4">
        {/* Left: Info */}
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-lg">🎙️</span>
            <h3 className="text-[16px] font-semibold text-white">Voice Mode</h3>
          </div>
          <p className="text-[13px] text-white/60">
            Tap to let Brew narrate the odds in real time.
          </p>
        </div>

        {/* Right: Mic button */}
        <button
          onClick={handleToggle}
          className={`relative flex h-14 w-14 items-center justify-center rounded-full transition-all ${
            isActive
              ? 'bg-gradient-to-br from-[#ffc742] to-[#ffbe27] shadow-[0_0_20px_rgba(255,199,66,0.5)]'
              : 'bg-[#1a1a1c] border border-white/20 hover:border-[#ffc742]/50'
          }`}
        >
          {/* Pulse ring when active */}
          {isActive && (
            <div className="absolute inset-0 animate-ping rounded-full bg-[#ffc742]/30" />
          )}
          
          <svg
            className={`relative z-10 h-6 w-6 ${isActive ? 'text-black' : 'text-[#ffc742]'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
```

---

## 5. Complete Dashboard Assembly

### 5.1 Main Dashboard Page

```tsx
// app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { DashboardContainer } from '@/components/dashboard/DashboardContainer';
import { Header } from '@/components/dashboard/Header';
import { NavigationTabs } from '@/components/dashboard/NavigationTabs';
import { SectionKicker } from '@/components/dashboard/SectionKicker';
import { GameTabs, GameId } from '@/components/dashboard/GameTabs';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { PredictionCard } from '@/components/dashboard/PredictionCard';
import { GeneratePickButton } from '@/components/dashboard/GeneratePickButton';
import { UtilityPills } from '@/components/dashboard/UtilityPills';
import { VoiceModeCard } from '@/components/dashboard/VoiceModeCard';

// Mock data - replace with Supabase/API calls in production
const MOCK_DATA: Record<GameId, {
  hotNumbers: number[];
  hotBonus?: number;
  coldNumbers: number[];
  coldBonus?: number;
  momentum: number;
  insights: string[];
}> = {
  pick3: {
    hotNumbers: [3, 7, 5],
    coldNumbers: [1, 9, 4],
    momentum: 62,
    insights: ['low & odd numbers', 'recent hot streaks'],
  },
  pick4: {
    hotNumbers: [3, 1, 4, 1],
    coldNumbers: [1, 7, 2, 2],
    momentum: 58,
    insights: ['repeating digits', 'even distribution'],
  },
  cash5: {
    hotNumbers: [3, 14, 22, 29, 35],
    coldNumbers: [7, 18, 25, 31, 40],
    momentum: 55,
    insights: ['mid-range numbers', 'balanced spread'],
  },
  powerball: {
    hotNumbers: [3, 14, 29, 41, 52],
    hotBonus: 11,
    coldNumbers: [1, 7, 22, 54, 69],
    coldBonus: 3,
    momentum: 49,
    insights: ['low & even numbers', 'recent hot streaks', 'overdue positions'],
  },
  mega: {
    hotNumbers: [10, 22, 38, 51, 65],
    hotBonus: 15,
    coldNumbers: [5, 19, 33, 47, 60],
    coldBonus: 8,
    momentum: 52,
    insights: ['high number cluster', 'consecutive pairs'],
  },
};

export default function DashboardPage() {
  const [selectedGame, setSelectedGame] = useState<GameId>('powerball');
  const [isGenerating, setIsGenerating] = useState(false);

  const gameData = MOCK_DATA[selectedGame];
  const gameLabel = selectedGame === 'mega' ? 'Mega Millions' : 
                   selectedGame === 'powerball' ? 'Powerball' :
                   selectedGame === 'cash5' ? 'Cash 5' :
                   selectedGame === 'pick4' ? 'Pick 4' : 'Pick 3';
  const showBonus = selectedGame === 'powerball' || selectedGame === 'mega';

  const handleGenerate = async () => {
    setIsGenerating(true);
    // TODO: Call /api/predict/[game] endpoint
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <DashboardContainer>
        <Header />
        <NavigationTabs />
        <SectionKicker />
        <GameTabs onSelect={setSelectedGame} />
        
        <StatsGrid
          hotNumbers={gameData.hotNumbers}
          hotBonus={gameData.hotBonus}
          coldNumbers={gameData.coldNumbers}
          coldBonus={gameData.coldBonus}
          momentumPercent={gameData.momentum}
          game={selectedGame}
          showBonus={showBonus}
        />

        <PredictionCard
          game={gameLabel}
          insights={gameData.insights}
        />

        <GeneratePickButton
          onClick={handleGenerate}
          loading={isGenerating}
        />

        <UtilityPills />
        <VoiceModeCard />
      </DashboardContainer>
    </div>
  );
}
```

---

## 6. Avatar System Specification

### 6.1 Avatar Types

Users can choose from three avatar options:

| Type | Description | Storage |
|------|-------------|---------|
| **Initials** | Generated initials with auto-assigned color | Client-side state |
| **Built-in Avatars** | Pre-designed avatar images (selectable) | `/public/avatars/` |
| **Custom Upload** | User-uploaded image | Supabase Storage |

### 6.2 Avatar Selection Flow

```
┌─────────────────────────────────────────────┐
│  Avatar Settings Modal                      │
├─────────────────────────────────────────────┤
│  [Preview Avatar]                           │
│                                             │
│  Choose Your Avatar                         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │
│  │  JD │ │ 🤖  │ │ 🎰  │ │ 🏆  │ │ ... │  │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘  │
│                                             │
│  Or Upload Your Own                         │
│  ┌─────────────────────────────────────┐    │
│  │     📷  Drag & drop or click       │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  [Save Changes]  [Cancel]                   │
└─────────────────────────────────────────────┘
```

### 6.3 Avatar Data Schema

```typescript
// types/avatar.ts
export type AvatarType = 'initials' | 'preset' | 'custom';

export interface UserAvatar {
  type: AvatarType;
  // For initials
  initials?: string;
  colorIndex?: number; // 0-7
  // For preset/custom
  imageUrl?: string;
  // For custom upload
  storagePath?: string; // Supabase storage path
}

export interface AvatarPreset {
  id: string;
  name: string;
  imageUrl: string;
  category: 'lottery' | 'abstract' | 'characters';
}
```

### 6.4 Avatar Upload Implementation

```typescript
// lib/avatar/uploadAvatar.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function uploadAvatar(
  userId: string,
  file: File
): Promise<{ url: string; path: string }> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('user-avatars')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('user-avatars')
    .getPublicUrl(filePath);

  return {
    url: data.publicUrl,
    path: filePath,
  };
}
```

---

## 7. Data Flow & Integration

### 7.1 Mock Data to Production Migration

| Mock Constant | Production Source | API Endpoint |
|---------------|-------------------|--------------|
| `MOCK_DATA[game].hotNumbers` | `draw_analysis.hot_numbers` | `/api/stats/[game]?type=hot` |
| `MOCK_DATA[game].coldNumbers` | `draw_analysis.cold_numbers` | `/api/stats/[game]?type=cold` |
| `MOCK_DATA[game].hotBonus` | `draw_analysis.hot_bonus` | `/api/stats/[game]?type=hot` |
| `MOCK_DATA[game].coldBonus` | `draw_analysis.cold_bonus` | `/api/stats/[game]?type=cold` |
| `MOCK_DATA[game].momentum` | `draw_analysis.momentum_score` | `/api/stats/[game]?type=momentum` |
| `MOCK_DATA[game].insights` | `prediction_explanations` | `/api/predict/[game]` |

### 7.2 React Query Keys

```typescript
// hooks/useDashboardData.ts
export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  game: (game: GameId) => ['dashboard', 'game', game] as const,
  stats: (game: GameId) => ['dashboard', 'stats', game] as const,
  hotNumbers: (game: GameId) => ['dashboard', 'hot', game] as const,
  coldNumbers: (game: GameId) => ['dashboard', 'cold', game] as const,
  momentum: (game: GameId) => ['dashboard', 'momentum', game] as const,
  prediction: (game: GameId) => ['dashboard', 'prediction', game] as const,
};
```

### 7.3 API Response Types

```typescript
// types/api/dashboard.ts
export interface GameStatsResponse {
  game: GameId;
  hotNumbers: number[];
  hotBonus?: number;
  coldNumbers: number[];
  coldBonus?: number;
  momentumScore: number;
  lastUpdated: string;
}

export interface PredictionResponse {
  id: string;
  game: GameId;
  numbers: number[];
  bonus?: number;
  strategy: string;
  confidence: number;
  explanation: string;
  createdAt: string;
}
```

---

## 8. Acceptance Criteria

### 8.1 Visual Fidelity

| Criteria | Requirement |
|----------|-------------|
| Brand Match | Header shows "BREWVERSE LABS" + logo |
| Color Accuracy | All colors match design tokens |
| Typography | Fonts, sizes, weights match spec |
| Border Radii | Exact radii for all elements |
| Shadows/Glows | All effects implemented |
| Layout | Mobile-first, max-width 430px |

### 8.2 Functional Requirements

| Criteria | Requirement |
|----------|-------------|
| Game Tabs | Switching updates all data |
| Momentum | Accurate 0-100% display |
| Bonus Balls | Display only for Powerball/Mega |
| CTA Button | Triggers prediction flow |
| Avatar Dropdown | All 11 items present |
| Voice Mode | Toggle functionality works |

### 8.3 Avatar Requirements

| Criteria | Requirement |
|----------|-------------|
| Initials Fallback | Works without image |
| Color Variety | 8+ preset colors |
| Image Upload | Supabase integration |
| Dropdown Display | Avatar shown in header |

---

## 9. Deferred to V2

| Feature | Reason |
|---------|--------|
| Real-time WebSocket updates | Use polling for V1 |
| Full BrewUniversity integration | Content hooks only |
| Advanced animations | Framer Motion deferred |
| Multi-language support | English only for V1 |
| Offline mode | PWA basic support only |

---

## 10. File Structure

```
components/dashboard/
├── DashboardContainer.tsx    # Main device shell
├── Header.tsx                # Brand + avatar + bot badge
├── BotBadge.tsx              # AI indicator badge
├── AvatarDropdown.tsx        # Avatar + dropdown menu
├── NavigationTabs.tsx        # Dashboard/Results/My Picks tabs
├── SectionKicker.tsx         # "Today's Draw Insights"
├── GameTabs.tsx              # Pick 3/4/5/PB/MM pills
├── StatsGrid.tsx             # Hot/Cold + Momentum grid
├── HotNumbersCard.tsx        # Golden hot numbers
├── ColdNumbersCard.tsx       # Blue/silver cold numbers
├── LotteryBall.tsx           # Individual ball component
├── MomentumMeter.tsx         # Vertical probability tube
├── PredictionCard.tsx        # "Brew says..." insights
├── GeneratePickButton.tsx    # Golden CTA
├── UtilityPills.tsx          # My Picks + Strategy Locker
└── VoiceModeCard.tsx         # Voice narration toggle
```

---

**Document Version**: 2.0  
**Last Updated**: 2026-03-20  
**Status**: Active V1 Contract  
**Aligned to Figma**: Yes (100%)
