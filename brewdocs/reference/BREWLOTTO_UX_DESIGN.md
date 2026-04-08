# BREWLOTTO_V1_UX_DESIGN_SYSTEM

<!--  
/brewdocs/reference/BREWLOTTO_UX_DESIGN.md  
Timestamp: 2026-03-20 ET  
Phase: V1 Reset / Design System  
Purpose: Complete design token and visual specification for BrewLotto V1  
Status: Active V1 Contract - Aligned to Figma  
-->

## 1. Design Philosophy

### 1.1 Core Theme
**"Cosmic Lottery Intelligence"** — A premium, futuristic aesthetic that feels like a high-end casino meets AI-powered analytics dashboard.

- **Brew-Gold cosmic aura** ✨ with deep dark background
- **LED shimmer highlights** and glowing cards
- **Futuristic yet easy to read** — "intelligent but approachable"
- **Explainable, not magical** — transparent about how picks are generated

### 1.2 Visual Principles

| Principle | Description |
|-----------|-------------|
| **Premium First** | Every element should feel high-quality and polished |
| **Dark Mode Native** | Dark backgrounds with gold accents as primary |
| **Glow & Depth** | Layered shadows and glows create depth |
| **Consistent Radii** | Rounded corners throughout (30px cards, 42px container) |
| **Gold Hierarchy** | Gold is the primary accent, used sparingly for impact |

---

## 2. Color System

### 2.1 Primary Colors

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `brew-gold` | `#FFD700` | `255, 215, 0` | CTAs, primary accents |
| `brew-gold-light` | `#ffd364` | `255, 211, 100` | Lighter gold, highlights |
| `brew-gold-dark` | `#ffbe27` | `255, 190, 39` | Darker gold, depth |
| `brew-gold-accent` | `#ffcd52` | `255, 205, 82` | Accent gold |
| `brew-gold-hot` | `#ffc742` | `255, 199, 66` | Primary button gold |

### 2.2 Background Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `brew-black` | `#050505` | Page background (deepest) |
| `brew-black-light` | `#0f0f10` | Secondary background |
| `brew-surface-dark` | `#120e0e` | Surface gradient start |
| `brew-surface-light` | `#08080a` | Surface gradient end |
| `brew-card` | `#181818` | Card background |
| `brew-card-alt` | `#1a1a1c` | Alt card background |
| `brew-elevated` | `#232326` | Elevated surfaces |

### 2.3 Hot Number Colors

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `hot-primary` | `#ffbd39` | `255, 189, 57` | Hot ball gradient start |
| `hot-secondary` | `#ffb84a` | `255, 184, 74` | Hot ball gradient end |
| `hot-glow` | `rgba(255,189,57,0.4)` | - | Hot ball shadow |

### 2.4 Cold Number Colors

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `cold-primary` | `#72caff` | `114, 202, 255` | Cold ball gradient start |
| `cold-secondary` | `#58a9ff` | `88, 169, 255` | Cold ball gradient end |
| `cold-glow` | `rgba(114,202,255,0.4)` | - | Cold ball shadow |

### 2.5 Bonus Ball Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `bonus-hot-bg` | `#d65c5c` | Hot bonus ball background |
| `bonus-hot-text` | `#ffd364` | Hot bonus ball text |
| `bonus-cold-bg` | `#5c7fd6` | Cold bonus ball background |
| `bonus-cold-text` | `#ffffff` | Cold bonus ball text |

### 2.6 Text Colors

| Token | Hex | Opacity | Usage |
|-------|-----|---------|-------|
| `text-primary` | `#ffffff` | 100% | Headlines, important text |
| `text-secondary` | `#ffffff` | 88% | Body text, labels |
| `text-muted` | `#ffffff` | 70% | Hints, secondary info |
| `text-faint` | `#ffffff` | 50% | Placeholder text |
| `text-gold` | `#f0c46b` | 100% | Gold accent text |
| `text-cool` | `#d6d1cf` | 100% | Cool gray text |

### 2.7 Border Colors

| Token | Hex | Opacity | Usage |
|-------|-----|---------|-------|
| `border-subtle` | `#ffffff` | 10% | Default subtle border |
| `border-gold` | `#ffd36f` | 25% | Gold accent border |
| `border-hot` | `#ffbd39` | 30% | Hot number border |
| `border-cold` | `#72caff` | 30% | Cold number border |

---

## 3. Typography System

### 3.1 Font Families

| Role | Family | Fallback | Weight Range |
|------|--------|----------|--------------|
| Display | Montserrat | system-ui, sans-serif | 700-900 |
| Body | Inter | system-ui, sans-serif | 400-600 |
| Mono | JetBrains Mono | monospace | 400-700 |

### 3.2 Type Scale

| Element | Size | Weight | Line Height | Letter Spacing | Class |
|---------|------|--------|-------------|----------------|-------|
| `display-lg` | 46px | 900 | 1.1 | 0.05em | `text-[46px] font-black uppercase tracking-wide` |
| `display` | 42px | 900 | 1.1 | 0.05em | `text-[42px] font-black uppercase tracking-wide` |
| `headline` | 24px | 700 | 1.2 | Normal | `text-2xl font-bold` |
| `title` | 20px | 600 | 1.3 | Normal | `text-xl font-semibold` |
| `subtitle` | 16px | 600 | 1.4 | Normal | `text-base font-semibold` |
| `body` | 15px | 400 | 1.6 | Normal | `text-[15px] leading-8` |
| `body-lg` | 18px | 400 | 1.5 | Normal | `text-lg` |
| `caption` | 13px | 400 | 1.4 | Normal | `text-xs` |
| `micro` | 10px | 500 | 1.2 | 0.22em | `text-[10px] font-medium uppercase tracking-[0.22em]` |
| `number` | 28px | 700 | 1 | Normal | `text-[28px] font-bold` |
| `number-lg` | 30px | 700 | 1 | Normal | `text-[30px] font-bold` |
| `percentage` | 52px | 600 | 1 | Normal | `text-[52px] font-semibold leading-none` |

### 3.3 Text Gradients

```css
/* Gold gradient text */
.text-gradient-gold {
  background: linear-gradient(to right, #ffc742, #ffd364, #ffbe27);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Usage */
<h1 className="bg-gradient-to-r from-[#ffc742] via-[#ffd364] to-[#ffbe27] bg-clip-text text-transparent">
  BrewLotto
</h1>
```

---

## 4. Spacing System

### 4.1 Base Units

| Token | Value | Class |
|-------|-------|-------|
| `space-1` | 4px | `p-1` or `gap-1` |
| `space-2` | 8px | `p-2` or `gap-2` |
| `space-3` | 12px | `p-3` or `gap-3` |
| `space-4` | 16px | `p-4` or `gap-4` |
| `space-5` | 20px | `p-5` or `gap-5` |
| `space-6` | 24px | `p-6` or `gap-6` |
| `space-8` | 32px | `p-8` or `gap-8` |

### 4.2 Layout Spacing

| Element | Value | Class |
|---------|-------|-------|
| Container max-width | 430px | `max-w-[430px]` |
| Container padding-x | 20px / 24px | `px-5 sm:px-6` |
| Container padding-y | 24px | `py-6` |
| Section gap (large) | 24px | `mt-6` |
| Section gap (medium) | 16px | `mt-4` |
| Section gap (small) | 12px | `mt-3` |
| Card padding | 20px | `p-5` |
| Ball gap | 8px | `gap-2` |

---

## 5. Border Radius System

### 5.1 Radius Tokens

| Token | Value | Class | Usage |
|-------|-------|-------|-------|
| `radius-full` | 9999px | `rounded-full` | Balls, pills, avatars |
| `radius-lg` | 42px | `rounded-[42px]` | Device container |
| `radius-xl` | 40px | `rounded-[40px]` | Momentum outer |
| `radius-2xl` | 30px | `rounded-[30px]` | Cards |
| `radius-3xl` | 28px | `rounded-[28px]` | Voice card |
| `radius-xl` | 24px | `rounded-2xl` | Modals, panels |
| `radius-lg` | 16px | `rounded-2xl` | Dropdown menus |
| `radius-md` | 12px | `rounded-xl` | Buttons, inputs |
| `radius-sm` | 8px | `rounded-lg` | Small elements |

---

## 6. Shadow & Glow System

### 6.1 Container Shadows

| Name | Value |
|------|-------|
| `shadow-device` | `shadow-[inset_0_0_24px_rgba(255,179,0,0.10),inset_0_0_60px_rgba(255,140,0,0.06)]` |
| `shadow-aura` | `bg-[radial-gradient(circle_at_center,rgba(255,184,28,0.20),transparent_58%)] blur-2xl` |
| `shadow-golden-edge` | `ring-1 ring-[#ffd36f]/25` |

### 6.2 Component Shadows

| Component | Shadow |
|-----------|--------|
| Hot Numbers Card | `shadow-[0_4px_24px_rgba(255,189,57,0.15)]` |
| Cold Numbers Card | `shadow-[0_4px_24px_rgba(114,202,255,0.15)]` |
| Hot Ball | `shadow-[0_2px_8px_rgba(255,189,57,0.4)]` |
| Cold Ball | `shadow-[0_2px_8px_rgba(114,202,255,0.4)]` |
| Momentum Glow | `shadow-[0_0_18px_rgba(255,153,0,0.45)]` |
| CTA Button | `shadow-[0_4px_14px_0_rgba(255,199,66,0.39)]` |
| CTA Button Hover | `hover:shadow-[0_6px_20px_rgba(255,199,66,0.23)]` |
| Header Logo | `drop-shadow-[0_0_18px_rgba(255,184,28,0.45)]` |
| Dropdown | `shadow-2xl` |

### 6.3 Inner Glows

| Element | Value |
|---------|-------|
| Container inner | `inset-0 bg-white/10` (on ball elements) |
| Momentum liquid top | `bg-gradient-to-b from-white/40 to-transparent` |
| Button inner | `bg-gradient-to-b from-white/20 via-transparent to-transparent` |

---

## 7. Animation System

### 7.1 Transitions

| Element | Duration | Easing | Property |
|---------|----------|--------|----------|
| Default | 200ms | ease | `transition-all` |
| CTA Hover | 300ms | ease-out | `transition-all hover:scale-[1.02]` |
| CTA Active | 100ms | ease-in | `active:scale-[0.98]` |
| Tab Switch | 150ms | ease | `transition-colors` |
| Dropdown | 200ms | ease | opacity, transform |

### 7.2 Keyframe Animations

| Name | Usage | Keyframes |
|------|-------|-----------|
| `pulse` | BotBadge, Voice active | `opacity: 1 → 0.5 → 1` |
| `ping` | BotBadge ring, Voice ring | `transform: scale(1) → scale(1.5), opacity: 0` |
| `spin` | Loading spinner | `transform: rotate(0deg → 360deg)` |
| `shimmer` | Momentum liquid | `background-position: left → right` |

### 7.3 Motion Classes

```css
/* Pulse ring effect */
.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Shimmer effect for liquid fills */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-shimmer {
  animation: shimmer 2s linear infinite;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%);
  background-size: 200% 100%;
}
```

---

## 8. Component Design Tokens

### 8.1 Device Container

```css
.device-container {
  @apply relative mx-auto max-w-[430px] px-5 pb-6 pt-6 sm:px-6;
  border-radius: 42px;
  background: linear-gradient(135deg, rgba(18,14,14,0.96), rgba(8,8,10,0.96));
  box-shadow: inset 0 0 24px rgba(255,179,0,0.10), inset 0 0 60px rgba(255,140,0,0.06);
  border: 1px solid rgba(255,211,111,0.25);
}
```

### 8.2 Card Component

```css
.card {
  @apply rounded-[30px] p-5;
  background: linear-gradient(135deg, rgba(18,14,14,0.96), rgba(8,8,10,0.96));
}

.card-hot {
  @apply border border-[#ffbd39]/30;
  background: linear-gradient(135deg, rgba(255,189,57,0.15), rgba(255,184,74,0.05));
  box-shadow: 0 4px 24px rgba(255,189,57,0.15);
}

.card-cold {
  @apply border border-[#72caff]/30;
  background: linear-gradient(135deg, rgba(114,202,255,0.15), rgba(88,169,255,0.05));
  box-shadow: 0 4px 24px rgba(114,202,255,0.15);
}
```

### 8.3 Button Components

```css
.btn-primary {
  @apply w-full rounded-[999px] px-6 py-4 text-[18px] font-bold;
  background: linear-gradient(to right, #ffc742, #ffd364, #ffbe27);
  color: black;
  box-shadow: 0 4px 14px 0 rgba(255,199,66,0.39);
  transition: all 300ms ease-out;
}

.btn-primary:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 20px rgba(255,199,66,0.23);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-pill {
  @apply rounded-full px-4 py-2 text-[15px] font-medium;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(26,26,28,0.8);
  color: rgba(255,255,255,0.8);
}

.btn-pill:hover {
  border-color: rgba(255,255,255,0.3);
  color: white;
}

.btn-pill.active {
  background: linear-gradient(to right, #ffc742, #ffd364);
  border-color: #ffd364;
  color: black;
  box-shadow: 0 0 12px rgba(255,199,66,0.4);
}
```

### 8.4 Ball Component

```css
.ball {
  @apply flex items-center justify-center rounded-full font-bold;
  position: relative;
}

.ball::before {
  content: '';
  @apply absolute inset-1 rounded-full;
  background: rgba(255,255,255,0.1);
}

.ball-hot {
  background: linear-gradient(135deg, #ffbd39, #ffb84a);
  color: black;
  box-shadow: 0 2px 8px rgba(255,189,57,0.4);
}

.ball-cold {
  background: linear-gradient(135deg, #e8eef5, #c3cfd9);
  color: #1e3a5f;
  box-shadow: 0 2px 8px rgba(114,202,255,0.4);
}

.ball-bonus-hot {
  background: linear-gradient(135deg, #d65c5c, #b94a4a);
  color: #ffd364;
}

.ball-bonus-cold {
  background: linear-gradient(135deg, #5c7fd6, #4a68b9);
  color: white;
}
```

### 8.5 Momentum Meter

```css
.momentum-container {
  @apply flex flex-col items-center rounded-[30px] border border-white/10 p-4;
  background: linear-gradient(to bottom, rgba(18,14,14,0.8), rgba(10,10,12,0.8));
}

.momentum-tube {
  @apply relative h-[180px] w-[52px] overflow-hidden;
  border-radius: 40px;
  border: 1px solid rgba(255,211,100,0.3);
  background: linear-gradient(to bottom, #0a0a0c, #120e0e);
  box-shadow: inset 0 0 12px rgba(255,179,0,0.08);
}

.momentum-liquid {
  @apply absolute bottom-0 left-0 right-0;
  background: linear-gradient(to top, #ffc742, #ffd364, #ffbe27);
  box-shadow: 0 0 18px rgba(255,153,0,0.45);
}

.momentum-liquid::before {
  content: '';
  @apply absolute top-0 left-0 right-0 h-2;
  background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent);
}
```

---

## 9. Responsive Breakpoints

### 9.1 Breakpoint Values

| Name | Width | Usage |
|------|-------|-------|
| `sm` | 640px | Small phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |

### 9.2 Responsive Adjustments

| Element | Mobile (<640px) | Tablet+ (≥640px) |
|---------|-----------------|-------------------|
| Container padding | `px-5` (20px) | `px-6` (24px) |
| Main title | `text-[42px]` | `text-[46px]` |
| Number balls | `h-[52px] w-[52px] text-[22px]` | `h-[58px] w-[58px] text-[24px]` |
| Stats grid | `grid-cols-1` | `grid-cols-[1.9fr_0.85fr]` |

---

## 10. Dark Mode (Default)

BrewLotto V1 is dark mode native. Light mode is not supported in V1.

### 10.1 CSS Variables

```css
:root {
  /* Backgrounds */
  --bg-primary: #050505;
  --bg-surface: linear-gradient(135deg, #120e0e, #08080a);
  --bg-card: #181818;
  --bg-elevated: #232326;
  
  /* Golds */
  --gold-primary: #ffc742;
  --gold-secondary: #ffd364;
  --gold-dark: #ffbe27;
  --gold-accent: #ffcd52;
  
  /* Hot Colors */
  --hot-primary: #ffbd39;
  --hot-secondary: #ffb84a;
  
  /* Cold Colors */
  --cold-primary: #72caff;
  --cold-secondary: #58a9ff;
  
  /* Text */
  --text-primary: #ffffff;
  --text-secondary: rgba(255,255,255,0.88);
  --text-muted: rgba(255,255,255,0.70);
  
  /* Borders */
  --border-subtle: rgba(255,255,255,0.1);
  --border-gold: rgba(255,211,111,0.25);
}
```

---

## 11. Design Reference Images

### 11.1 Main Dashboard

**File**: `brewdocs/v1/frontend_design/brewlotto_design.png`

Key elements to match:
- Device container with golden edge glow
- "BREWVERSE LABS" sub-header
- "BREWLOTTO" main title with gold gradient
- Avatar with dropdown in top-right
- Navigation tabs (Dashboard, Results, My Picks)
- Game tabs (Pick 3, Pick 4, Cash 5, Powerball, Mega)
- Hot Numbers card with gold balls
- Cold Numbers card with blue/silver balls
- Bonus balls with "BONUS" label
- Momentum Meter with 49% display
- Prediction card with "Brew says..."
- Golden "Generate My Smart Pick →" button
- Utility pills (My Picks, Strategy Locker)
- Voice Mode card

### 11.2 Avatar Dropdown

**File**: `brewdocs/v1/frontend_design/brewlotto_dropdown.png`

Key elements to match:
- Avatar button with dropdown arrow
- User info header (avatar + name + email)
- 11 menu items with icons
- Notification badge (5)
- Logout at bottom
- Gold accent on hover states

---

## 12. Tailwind Configuration

### 12.1 Extended Theme

```javascript
// tailwind.config.ts
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brew': {
          'gold': '#FFD700',
          'gold-light': '#ffd364',
          'gold-dark': '#ffbe27',
          'gold-accent': '#ffcd52',
          'gold-hot': '#ffc742',
          'black': '#050505',
          'black-light': '#0f0f10',
          'surface-dark': '#120e0e',
          'surface-light': '#08080a',
          'card': '#181818',
          'card-alt': '#1a1a1c',
          'elevated': '#232326',
        },
        'hot': {
          'primary': '#ffbd39',
          'secondary': '#ffb84a',
        },
        'cold': {
          'primary': '#72caff',
          'secondary': '#58a9ff',
        },
      },
      borderRadius: {
        'brew-lg': '42px',
        'brew-xl': '30px',
        'brew-2xl': '28px',
      },
      boxShadow: {
        'brew-gold': '0 4px 14px 0 rgba(255,199,66,0.39)',
        'brew-gold-hover': '0 6px 20px rgba(255,199,66,0.23)',
        'brew-hot': '0 2px 8px rgba(255,189,57,0.4)',
        'brew-cold': '0 2px 8px rgba(114,202,255,0.4)',
        'brew-momentum': '0 0 18px rgba(255,153,0,0.45)',
        'brew-inner': 'inset 0 0 24px rgba(255,179,0,0.10), inset 0 0 60px rgba(255,140,0,0.06)',
      },
      maxWidth: {
        'brew': '430px',
      },
      fontSize: {
        'brew-display': ['42px', { lineHeight: '1.1', fontWeight: '900' }],
        'brew-display-lg': ['46px', { lineHeight: '1.1', fontWeight: '900' }],
        'brew-number': ['28px', { lineHeight: '1', fontWeight: '700' }],
        'brew-number-lg': ['30px', { lineHeight: '1', fontWeight: '700' }],
        'brew-percentage': ['52px', { lineHeight: '1', fontWeight: '600' }],
      },
      letterSpacing: {
        'brew-wide': '0.05em',
        'brew-wider': '0.22em',
      },
    },
  },
  plugins: [],
};
```

---

## 13. Design Checklist

### 13.1 Pre-Coding Checklist

- [ ] All design tokens defined in tailwind.config.ts
- [ ] Color palette implemented as CSS variables
- [ ] Typography scale configured
- [ ] Border radius tokens configured
- [ ] Shadow/glow tokens configured
- [ ] Animation keyframes defined
- [ ] Responsive breakpoints configured

### 13.2 Component Checklist

- [ ] Device container with golden aura
- [ ] Header with logo + avatar + bot badge
- [ ] Navigation tabs with active state
- [ ] Game tabs with pill style
- [ ] Hot Numbers card with gold balls
- [ ] Cold Numbers card with blue balls
- [ ] Bonus balls with labels
- [ ] Momentum Meter with liquid fill
- [ ] Prediction card with commentary
- [ ] CTA button with golden gradient
- [ ] Utility pills with icons
- [ ] Voice Mode card with toggle
- [ ] Avatar dropdown with 11 items

### 13.3 Visual Fidelity Checklist

- [ ] Gold gradient matches Figma exactly
- [ ] Border radii match (42px container, 30px cards)
- [ ] Shadow/glow effects present
- [ ] Text sizes match specification
- [ ] Spacing matches specification
- [ ] Colors match design tokens
- [ ] Animations smooth and subtle

---

**Document Version**: 2.0  
**Last Updated**: 2026-03-20  
**Status**: Active V1 Contract  
**Aligned to Figma**: Yes (100%)
