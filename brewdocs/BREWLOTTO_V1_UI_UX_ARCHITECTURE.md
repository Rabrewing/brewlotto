# BREWLOTTO_V1_UI_UX_ARCHITECTURE.md

<!--  
/brewdocs/BREWLOTTO_V1_UI_UX_ARCHITECTURE.md  
Timestamp: 2026-03-20 ET  
Phase: V1 Reset / UI/UX Architecture  
Purpose: Frontend contract document for V1 implementation - Aligned to Figma Design  
Status: Active V1 Contract  
-->

## 1. Document Purpose

This document defines the frontend architecture and UX contracts for BrewLotto V1. It serves as the source of truth for:
- Page routing and structure
- Component responsibilities
- User interface patterns
- Avatar system specification
- Brew character visibility rules
- Avatar dropdown structure

This document aligns with the V1 specification in `brewdocs/v1/Brewlotto_v01.md` and matches the Figma design exactly.

---

## 2. Frontend Framework

### 2.1 Technology Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | v14+ (App Router) | Framework |
| TypeScript | 5.x (strict mode) | Type safety |
| Tailwind CSS | v3 | Styling |
| React Query | TanStack Query v5 | Server state |
| React Hook Form | v7 | Forms |
| Zod | v3 | Validation |
| Framer Motion | v11 | Animations |
| Lucide React | latest | Icons |

### 2.2 Project Structure
```
/app/
  /api/                    # API route handlers
    /auth/                 # Authentication
    /games/                # Game metadata
    /draws/                # Draw data
    /predict/              # Prediction generation
    /picks/                # User picks
    /stats/                # Statistics
    /badges/               # Gamification
    /notifications/        # Notifications
    /billing/              # Stripe webhooks
    /admin/                # Admin operations
    /avatar/               # Avatar upload/management
  /dashboard/              # Main dashboard page
  /results/
    /today/                # Today's draw results
  /pick3/                  # Pick 3 game page
  /pick4/                  # Pick 4 game page
  /cash5/                  # Cash 5 game page
  /powerball/              # Powerball game page
  /mega-millions/          # Mega Millions game page
  /picks/                  # Saved picks and history
  /strategies/             # Strategy locker
  /stats/                  # User statistics
  /notifications/          # Notifications center
  /profile/                # User profile + avatar settings
  /settings/               # User settings
  /pricing/                # Subscription plans
  /learn/                  # BrewUniversity Lite
  /login/                  # Authentication
  /logout/                 # Sign out

/components/
  /dashboard/              # Dashboard-specific components
    /Header.tsx            # Brand + avatar + bot badge
    /AvatarDropdown.tsx    # Avatar system + dropdown menu
    /BotBadge.tsx          # AI indicator badge
    /GameTabs.tsx          # Game selector pills
    /StatsGrid.tsx         # Hot/Cold + Momentum layout
    /HotNumbersCard.tsx    # Hot numbers display
    /ColdNumbersCard.tsx   # Cold numbers display
    /LotteryBall.tsx       # Individual lottery ball
    /MomentumMeter.tsx     # Win probability tube
    /PredictionCard.tsx    # AI prediction insights
    /GeneratePickButton.tsx # Primary CTA
    /UtilityPills.tsx      # Secondary actions
    /VoiceModeCard.tsx     # Voice feature toggle
  /prediction/             # Prediction components
  /game/                   # Game-specific components
  /ui/                     # Reusable UI components
  /layouts/                # Page layouts
  /auth/                   # Authentication components

/lib/
  /prediction/             # Strategy engine
  /ingestion/              # Data ingestion
  /brewtruth/              # Governance layer
  /billing/                # Stripe integration
  /avatar/                 # Avatar utilities
    /uploadAvatar.ts       # Image upload to Supabase
    /presets.ts            # Built-in avatar presets
    /generateInitials.ts   # Initials generation

/types/
  /avatar.ts               # Avatar type definitions
  /dashboard.ts            # Dashboard types
  /game.ts                 # Game types
  /prediction.ts           # Prediction types

/public/
  /avatars/                # Built-in avatar presets
  /brewlotto-logo.png      # Main logo (user-provided)
```

---

## 3. Page Routing & Structure

### 3.1 Core Pages
| Page | Route | Priority | Purpose |
|------|-------|----------|---------|
| Dashboard | `/dashboard` | P0 | Main hub with game tabs, predictions, insights |
| Today's Results | `/results/today` | P0 | Today's draw results (core V1 page) |
| Pick 3 | `/pick3` | P0 | Pick 3 game page with predictions |
| Pick 4 | `/pick4` | P0 | Pick 4 game page with predictions |
| Cash 5 | `/cash5` | P0 | Cash 5 game page with predictions |
| Powerball | `/powerball` | P0 | Powerball game page with predictions |
| Mega Millions | `/mega-millions` | P0 | Mega Millions game page with predictions |
| My Picks | `/picks` | P0 | Saved picks and play history |
| Strategy Locker | `/strategies` | P0 | Strategy selection and management |
| Stats & Performance | `/stats` | P1 | User statistics and performance |
| Notifications | `/notifications` | P1 | Notification center |
| Profile | `/profile` | P1 | User profile and preferences |
| Settings | `/settings` | P1 | Application settings |
| Pricing | `/pricing` | P0 | Subscription plans and billing |
| Help / Learn | `/learn` | P1 | BrewUniversity Lite content |
| Terms & Privacy | `/legal/terms` | P1 | Legal documents |

### 3.2 API Routes
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/predict/[game]` | POST | Generate predictions for a game |
| `/api/picks` | GET, POST | Manage user picks |
| `/api/draws/[game]` | GET | Get draw results |
| `/api/stats/[game]` | GET | Get game statistics |
| `/api/games` | GET | Get available games |
| `/api/notifications` | GET, PATCH | Manage notifications |
| `/api/billing/webhook` | POST | Handle Stripe webhooks |
| `/api/avatar/upload` | POST | Upload custom avatar |
| `/api/avatar/presets` | GET | Get built-in avatar options |
| `/api/avatar` | GET, PATCH | Get/update user avatar |

---

## 4. Dashboard Architecture

### 4.1 Dashboard Layout
The dashboard is the primary user interface and matches the Figma design exactly:

```
┌─────────────────────────────────────────────┐
│  Device Container (430px max)               │
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

### 4.2 Key Dashboard Components

#### 4.2.1 Header / Identity Strip
- **Responsibility**: Brand identity and user access
- **Components**:
  - "BREWVERSE LABS" sub-header (10px, uppercase, tracking 0.22em)
  - Logo/Brand image (user-provided, e.g., `brewlotto-logo.png`)
  - Gradient accent bar below title
  - BotBadge (top-right, animated AI indicator)
  - Avatar with dropdown (top-right)
- **Visual**: Golden drop-shadow on logo, accent bar gradient

#### 4.2.2 Navigation Tabs
- **Responsibility**: Primary page navigation
- **Items**: Dashboard, Results, My Picks
- **Style**: Text-based tabs with gold underline on active
- **Behavior**: URL-based navigation

#### 4.2.3 Game Tabs
- **Responsibility**: Switch between lottery games
- **Style**: Pill-shaped tabs with active state highlighting
- **Games**: Pick 3, Pick 4, Cash 5, Powerball, Mega
- **Active State**: Gold gradient background with glow shadow
- **Behavior**: Instant data switch without page reload

#### 4.2.4 Hot/Cold Number Cards
- **Responsibility**: Display frequency analysis
- **Visual Treatment**:
  - Hot numbers: Warm colors (gold/orange gradient balls)
  - Cold numbers: Cool colors (silver/blue gradient balls)
  - Bonus balls: Red for hot bonus, blue for cold bonus
  - "BONUS" label below bonus balls
- **Border**: Tone-specific borders (orange for hot, blue for cold)

#### 4.2.5 Momentum Meter
- **Responsibility**: Show number momentum/trend indicator
- **Style**: Vertical tube with liquid fill animation
- **Display**: Large percentage (52px) at bottom
- **Label**: "Win Probability" below percentage
- **Glow**: Orange shadow on liquid

#### 4.2.6 Prediction Card
- **Responsibility**: Display generated picks with explanations
- **Content**: "Brew says..." commentary
- **Style**: Subtle border, dark gradient background
- **Typography**: 15px, leading-8, gold highlights for key terms

#### 4.2.7 Generate Pick Button
- **Responsibility**: Trigger prediction generation
- **Style**: Full-width gold gradient CTA
- **Text**: "Generate My Smart Pick →"
- **Effects**: Hover scale, inner glow, multi-layer shadow
- **States**: Loading spinner when generating

#### 4.2.8 Utility Pills
- **Responsibility**: Secondary navigation
- **Items**: My Picks, Strategy Locker
- **Style**: Pill-shaped buttons with icons

#### 4.2.9 Voice Mode Card
- **Responsibility**: Voice narration feature toggle
- **Style**: Compact card with mic button
- **Behavior**: Toggle animation with pulse ring when active

---

## 5. Avatar System Specification (V1 Final)

### 5.1 Avatar Requirements

Users should NOT be required to use their real face photo. The avatar system provides flexibility:

| Option | Description | Default |
|--------|-------------|---------|
| **Initials** | Auto-generated from name, colored background | ✅ Default |
| **Built-in Presets** | Pre-designed lottery-themed avatars | Available |
| **Custom Upload** | User-uploaded image (any image, not just faces) | Available |

### 5.2 Avatar Types

```typescript
// types/avatar.ts
export type AvatarType = 'initials' | 'preset' | 'custom';

export interface UserAvatar {
  type: AvatarType;
  // For initials
  initials?: string;        // e.g., "JD" for John Doe
  colorIndex?: number;      // 0-7, maps to preset colors
  // For preset/custom
  imageUrl?: string;        // URL to the image
  // For custom upload
  storagePath?: string;     // Supabase storage path
}

export interface AvatarPreset {
  id: string;               // e.g., "lottery-ball-gold"
  name: string;             // e.g., "Lucky Gold Ball"
  imageUrl: string;         // /avatars/lottery-ball-gold.png
  category: AvatarCategory;
}

export type AvatarCategory = 'lottery' | 'abstract' | 'characters' | 'badges';
```

### 5.3 Avatar Color Presets

For initials-based avatars, 8 color options:

```typescript
// components/dashboard/AvatarDropdown.tsx
const AVATAR_COLORS = [
  'from-[#ffc742] to-[#ffbe27]',   // 0: Gold (default)
  'from-[#ff6b6b] to-[#ee5a5a]',   // 1: Red
  'from-[#72caff] to-[#58a9ff]',   // 2: Blue
  'from-[#6bcb77] to-[#5ab868]',   // 3: Green
  'from-[#9b59b6] to-[#8e44ad]',   // 4: Purple
  'from-[#f39c12] to-[#e67e22]',   // 5: Orange
  'from-[#1abc9c] to-[#16a085]',   // 6: Teal
  'from-[#e91e63] to-[#c2185b]',   // 7: Pink
];
```

### 5.4 Built-in Avatar Presets

Located in `/public/avatars/`:

```
public/avatars/
├── lottery-ball-gold.png
├── lottery-ball-blue.png
├── lottery-ball-red.png
├── lottery-ball-multi.png
├── brewbot-happy.png
├── brewbot-thinking.png
├── trophy-gold.png
├── star-gold.png
├── dice-gold.png
├── chip-gold.png
├── abstract-wave.png
├── abstract-cosmic.png
└── abstract-energy.png
```

### 5.5 Avatar Upload Specifications

| Specification | Value |
|---------------|-------|
| Max File Size | 5MB |
| Accepted Formats | PNG, JPG, JPEG, WebP |
| Min Dimensions | 100x100px |
| Max Dimensions | 500x500px |
| Storage | Supabase Storage bucket: `user-avatars` |
| Public URL | Generated via Supabase |

### 5.6 Avatar Upload Implementation

```typescript
// lib/avatar/uploadAvatar.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export async function uploadAvatar(
  userId: string,
  file: File
): Promise<{ url: string; path: string }> {
  // Validate file
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 5MB limit');
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('File type not allowed. Use PNG, JPG, or WebP');
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  // Upload to Supabase
  const { error: uploadError } = await supabase.storage
    .from('user-avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    throw uploadError;
  }

  // Get public URL
  const { data } = supabase.storage
    .from('user-avatars')
    .getPublicUrl(filePath);

  return {
    url: data.publicUrl,
    path: filePath,
  };
}

export async function deleteAvatar(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from('user-avatars')
    .remove([path]);

  if (error) {
    throw error;
  }
}
```

### 5.7 Avatar Selection Modal

```tsx
// components/avatar/AvatarSelector.tsx
'use client';

import { useState } from 'react';
import { AvatarType, UserAvatar, AVATAR_COLORS } from '@/types/avatar';

interface AvatarSelectorProps {
  currentAvatar: UserAvatar;
  presets: AvatarPreset[];
  onSave: (avatar: UserAvatar) => void;
  onClose: () => void;
}

export function AvatarSelector({
  currentAvatar,
  presets,
  onSave,
  onClose,
}: AvatarSelectorProps) {
  const [selectedType, setSelectedType] = useState<AvatarType>(currentAvatar.type);
  const [selectedColor, setSelectedColor] = useState(currentAvatar.colorIndex ?? 0);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleSave = () => {
    let newAvatar: UserAvatar;

    if (selectedType === 'initials') {
      newAvatar = {
        type: 'initials',
        initials: currentAvatar.initials,
        colorIndex: selectedColor,
      };
    } else if (selectedType === 'preset' && selectedPreset) {
      const preset = presets.find(p => p.id === selectedPreset);
      newAvatar = {
        type: 'preset',
        imageUrl: preset?.imageUrl,
      };
    } else {
      newAvatar = {
        type: 'custom',
        imageUrl: uploadedImage ?? currentAvatar.imageUrl,
      };
    }

    onSave(newAvatar);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-[24px] border border-white/10 bg-[#181818] p-6">
        {/* Preview */}
        <div className="mb-6 flex justify-center">
          <div className="h-24 w-24">
            {/* Avatar preview component */}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          {(['initials', 'preset', 'custom'] as AvatarType[]).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`flex-1 rounded-full py-2 text-sm font-medium ${
                selectedType === type
                  ? 'bg-[#ffc742] text-black'
                  : 'bg-white/10 text-white/70'
              }`}
            >
              {type === 'initials' ? 'Initials' : type === 'preset' ? 'Presets' : 'Upload'}
            </button>
          ))}
        </div>

        {/* Content based on type */}
        {selectedType === 'initials' && (
          <div className="grid grid-cols-4 gap-3">
            {AVATAR_COLORS.map((color, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedColor(idx)}
                className={`aspect-square rounded-full bg-gradient-to-br ${color} ${
                  selectedColor === idx ? 'ring-2 ring-white' : ''
                }`}
              />
            ))}
          </div>
        )}

        {selectedType === 'preset' && (
          <div className="grid grid-cols-4 gap-3">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedPreset(preset.id)}
                className={`aspect-square overflow-hidden rounded-full ${
                  selectedPreset === preset.id ? 'ring-2 ring-[#ffc742]' : ''
                }`}
              >
                <img src={preset.imageUrl} alt={preset.name} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {selectedType === 'custom' && (
          <div className="rounded-xl border-2 border-dashed border-white/20 p-8 text-center">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Handle file upload
                }
              }}
              className="hidden"
              id="avatar-upload"
            />
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <span className="text-4xl">📷</span>
              <p className="mt-2 text-sm text-white/60">Click to upload</p>
              <p className="text-xs text-white/40">PNG, JPG, or WebP (max 5MB)</p>
            </label>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-white/20 py-3 text-sm font-medium text-white/70"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 rounded-full bg-[#ffc742] py-3 text-sm font-bold text-black"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 5.8 Avatar in Header (Figma Match)

The avatar in the header matches the Figma design:
- Circular, 40x40px
- Gold border (2px, 50% opacity)
- Hover effect: border brightens, gold glow
- Dropdown indicator at bottom-right corner

```tsx
// Header avatar display
<button className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-[#ffc742]/50 bg-[#1a1a1c] transition-all hover:border-[#ffc742] hover:shadow-[0_0_12px_rgba(255,199,66,0.3)]">
  {/* Avatar content (initials, preset, or custom image) */}
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br ${AVATAR_COLORS[colorIndex]}`}>
    <span className="text-sm font-bold text-white">{initials}</span>
  </div>
  
  {/* Dropdown indicator */}
  <div className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#0f0f10] border border-[#ffc742]/30">
    <ChevronDown className="h-2 w-2 text-[#ffc742]" />
  </div>
</button>
```

---

## 6. Avatar Dropdown Structure (V1 Final)

### 6.1 Dropdown Menu Items

The top-right avatar dropdown must contain exactly these items (matching Figma):

```
[Avatar / Username ▼]
├─ Profile
├─ My Picks
├─ Today's Results
├─ Stats & Performance
├─ Strategy Locker
├─ Notifications [5]
├─ Settings
├─ Subscription / Billing
├─ Help / Learn
├─ Terms & Privacy
─────────────────
└─ Logout
```

### 6.2 Item Descriptions

| # | Item | Route | Icon | Purpose |
|---|------|-------|------|---------|
| 1 | Profile | `/profile` | 👤 | User profile and preferences |
| 2 | My Picks | `/picks` | 📋 | Saved picks and play history |
| 3 | **Today's Results** | `/results/today` | 📊 | **Core V1 page** - Today's draw results |
| 4 | Stats & Performance | `/stats` | 📈 | User statistics and performance |
| 5 | Strategy Locker | `/strategies` | 🔒 | Strategy selection and management |
| 6 | Notifications | `/notifications` | 🔔 | Notification center (shows badge count) |
| 7 | Settings | `/settings` | ⚙️ | Application settings |
| 8 | Subscription / Billing | `/pricing` | 💳 | Subscription plans and billing management |
| 9 | Help / Learn | `/learn` | ❓ | BrewUniversity Lite content and help |
| 10 | Terms & Privacy | `/legal/terms` | 📄 | Legal documents |
| 11 | Logout | `/logout` | 🚪 | Sign out of account |

### 6.3 Dropdown Visual Design

| Element | Specification |
|---------|---------------|
| Width | 256px (w-64) |
| Border Radius | 16px (rounded-[16px]) |
| Background | Gradient from `#181818` to `#0f0f10` |
| Border | `border-white/10` |
| Header Section | User info with avatar preview |
| Dividers | `h-px bg-white/10` between sections |
| Item Hover | `hover:bg-white/5` |
| Badge Style | Gold circle with black text |

### 6.4 Deferred to V2

| Feature | Status |
|---------|--------|
| Missions & Achievements | **Removed from V1 dropdown** |
| Full gamification dashboard | Deferred to V2 |
| Voice mode settings | Deferred to V2 |
| Advanced Brew character settings | Deferred to V2 |

---

## 7. Brew Character Visibility Rules

### 7.1 Visibility Priority

The Brew character (BrewBot/BrewLotto AI persona) should be strategically visible:

#### 7.1.1 Always Visible (Primary Contexts)
1. **Prediction Pages**: Brew provides commentary on generated picks
2. **Today's Results / Results Recap**: Brew summarizes draw outcomes
3. **Strategy Locker**: Brew explains strategies and provides educational context

#### 7.1.2 Visible in Milestone Notifications
- Badge unlocked notifications
- Streak achievement notifications
- Strategy mastery notifications

#### 7.1.3 Subtle Everywhere Else
- Dashboard: BotBadge in header only (pulsing indicator)
- My Picks: Summary voice only, no floating assistant
- Stats: Data-driven, no character interruption
- Settings: Functional UI, no character presence
- Profile: User-focused, no character presence

### 7.2 Implementation Guidelines
- **No global floating assistant**: Brew does not float across every screen
- **Contextual presence**: Brew appears where explanation/education is needed
- **Tier-based features**: Advanced Brew commentary reserved for paid tiers
- **Voice mode toggle**: Optional Brew voice interface (V1 basic, V2 advanced)

---

## 8. Component Responsibilities

### 8.1 Dashboard Components

| Component | Responsibility | Props | File |
|-----------|----------------|-------|------|
| `DashboardContainer` | Shell layout with golden aura | `children: ReactNode` | `/components/dashboard/DashboardContainer.tsx` |
| `Header` | Brand identity + avatar + bot badge | `logoSrc?: string` | `/components/dashboard/Header.tsx` |
| `BotBadge` | Animated AI indicator | - | `/components/dashboard/BotBadge.tsx` |
| `AvatarDropdown` | Avatar + dropdown menu | - | `/components/dashboard/AvatarDropdown.tsx` |
| `NavigationTabs` | Dashboard/Results/My Picks tabs | - | `/components/dashboard/NavigationTabs.tsx` |
| `SectionKicker` | "Today's Draw Insights" label | - | `/components/dashboard/SectionKicker.tsx` |
| `GameTabs` | Pill-style game selector | `onSelect: (game) => void` | `/components/dashboard/GameTabs.tsx` |
| `StatsGrid` | Hot/Cold + Momentum layout | Game stats props | `/components/dashboard/StatsGrid.tsx` |
| `HotNumbersCard` | Hot numbers display | `numbers, bonus, bonusLabel` | `/components/dashboard/HotNumbersCard.tsx` |
| `ColdNumbersCard` | Cold numbers display | `numbers, bonus, bonusLabel` | `/components/dashboard/ColdNumbersCard.tsx` |
| `LotteryBall` | Individual lottery ball | `number, variant, size, label` | `/components/dashboard/LotteryBall.tsx` |
| `MomentumMeter` | Win probability tube | `percent: number` | `/components/dashboard/MomentumMeter.tsx` |
| `PredictionCard` | AI prediction insights | `game, insights` | `/components/dashboard/PredictionCard.tsx` |
| `GeneratePickButton` | Primary CTA | `onClick, disabled, loading` | `/components/dashboard/GeneratePickButton.tsx` |
| `UtilityPills` | My Picks + Strategy Locker | - | `/components/dashboard/UtilityPills.tsx` |
| `VoiceModeCard` | Voice feature toggle | `enabled, onToggle` | `/components/dashboard/VoiceModeCard.tsx` |

### 8.2 Prediction Components

| Component | Responsibility | Props |
|-----------|----------------|-------|
| `PredictionForm` | Game selection and options | `onSubmit` |
| `NumberDisplay` | Render lottery numbers | `numbers: number[], bonus?: number` |
| `StrategyBadge` | Show strategy attribution | `strategy: string` |
| `ConfidenceIndicator` | Visual confidence meter | `score: number` |
| `ExplanationText` | Render Brew commentary | `text: string, tier: string` |

### 8.3 Game Components

| Component | Responsibility | Props |
|-----------|----------------|-------|
| `GamePage` | Game-specific page shell | `gameKey: string` |
| `DrawHistory` | Historical draw display | `draws: Draw[]` |
| `PlayLogger` | Log user plays | `onLogPlay` |

---

## 9. State Management

### 9.1 React Query Keys

```typescript
// hooks/queryKeys.ts
export const queryKeys = {
  // Game data
  games: ['games'] as const,
  game: (gameId: string) => ['games', gameId] as const,
  draws: (game: string, state: string) => ['draws', { game, state }] as const,
  predictions: (game: string, date: string) => ['predictions', { game, date }] as const,
  stats: (game: string, user: string) => ['stats', { game, user }] as const,

  // Dashboard
  dashboard: {
    all: ['dashboard'] as const,
    game: (game: string) => ['dashboard', 'game', game] as const,
    hotNumbers: (game: string) => ['dashboard', 'hot', game] as const,
    coldNumbers: (game: string) => ['dashboard', 'cold', game] as const,
    momentum: (game: string) => ['dashboard', 'momentum', game] as const,
  },

  // User data
  user: {
    profile: ['user', 'profile'] as const,
    picks: ['user', 'picks'] as const,
    notifications: ['user', 'notifications'] as const,
    subscription: ['user', 'subscription'] as const,
    avatar: ['user', 'avatar'] as const,
  },

  // Gamification
  badges: (user: string) => ['badges', { user }] as const,
  streaks: (user: string) => ['streaks', { user }] as const,
} as const;
```

### 9.2 Local State
- **Game selection**: React Query + URL-based routing
- **Form state**: React Hook Form
- **UI state**: Context providers for theme, notifications
- **Avatar state**: React Query + local optimistic updates

---

## 10. Visual Design System

### 10.1 Colors

| Token | Value | Usage |
|-------|-------|-------|
| `brew-gold` | `#FFD700` | CTAs, accents, highlights |
| `brew-gold-light` | `#ffd364` | Lighter gold variant |
| `brew-gold-dark` | `#ffbe27` | Darker gold variant |
| `brew-gold-accent` | `#ffcd52` | Accent gold |
| `brew-black` | `#050505` | Page background |
| `brew-black-light` | `#1C1C1C` | Card backgrounds |
| `brew-surface` | `#120e0e → #08080a` | Gradient surface |
| `brew-white` | `#FFFFFF` | Text, light surfaces |
| `brew-white-muted` | `rgba(255,255,255,0.88)` | Secondary text |
| `hot-color` | `#FF6B35` | Hot numbers (alt) |
| `hot-primary` | `#ffbd39` | Hot number primary |
| `hot-secondary` | `#ffb84a` | Hot number secondary |
| `cold-color` | `#4A90E2` | Cold numbers (alt) |
| `cold-primary` | `#72caff` | Cold number primary |
| `cold-secondary` | `#58a9ff` | Cold number secondary |

### 10.2 Typography

| Element | Font | Weight | Size | Tracking |
|---------|------|--------|------|----------|
| Main Title | System (fallback Montserrat) | 900 | 42px/46px | Wide (0.05em) |
| Sub-header | System | 500 | 10px | 0.22em |
| Section Kicker | System | 500 | 12px | 0.22em |
| Game Tab | System | 500 | 15px | Normal |
| Card Title | System | 600 | 16px | Normal |
| Number Display | System (fallback JetBrains Mono) | 700 | 28px/30px | Normal |
| Momentum % | System | 600 | 52px | Normal |
| Prediction | System | 400 | 15px | Normal |
| CTA Button | System | 700 | 18px | Normal |
| Utility Pill | System | 500 | 16px | Normal |

### 10.3 Spacing
- Base unit: 8px
- Scale: 4px increments
- Container max-width: 430px
- Container padding: 20px (24px on sm)

### 10.4 Motion
- **Transitions**: 200ms ease for most interactions
- **Hover scale**: 1.02 for CTA button
- **Active scale**: 0.98 for button press
- **Pulse animation**: BotBadge and VoiceMode active states
- **Shimmer**: Momentum meter liquid fill

---

## 11. Accessibility

### 11.1 Standards
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatible
- Color contrast minimum 4.5:1

### 11.2 Key Requirements
- All interactive elements focusable
- ARIA labels for icons
- Alt text for images
- Skip navigation links
- Focus ring on all interactive elements

---

## 12. Performance

### 12.1 Optimization Strategies
- **Code splitting**: Dynamic imports for non-critical components
- **Image optimization**: Next.js Image component
- **Data fetching**: React Query with stale-time caching
- **Bundle analysis**: Regular monitoring and optimization

### 12.2 Core Web Vitals Targets
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

---

## 13. Testing Strategy

### 13.1 Unit Tests
- Component rendering and props
- User interactions
- State management
- Utility functions

### 13.2 Integration Tests
- Page navigation
- Form submissions
- API mocking
- Error handling

### 13.3 E2E Tests
- User flows (prediction generation, pick saving)
- Authentication flows
- Billing flows
- Cross-browser compatibility

---

## 14. Success Criteria

### 14.1 V1 UI/UX Completion
- ✅ Dashboard loads with game tabs and predictions matching Figma
- ✅ Header shows "BREWVERSE LABS" + logo + avatar + bot badge
- ✅ Avatar dropdown contains all 11 items
- ✅ Avatar system supports initials, presets, and custom uploads
- ✅ "Missions & Achievements" removed from dropdown
- ✅ Brew visibility rules implemented
- ✅ "Today's Results" accessible as core page
- ✅ Premium visual direction applied (gold glow, gradients)
- ✅ All pages responsive and accessible

### 14.2 Deferred to V2
- Missions & Achievements dashboard
- Full gamification UI
- Advanced voice mode interface
- Advanced Brew character interactions
- Multi-language support
- Offline mode

---

## 15. References

- `brewdocs/v1/Brewlotto_v01.md` - V1 Product Overview and System Architecture
- `brewdocs/v1/dashboard.md` - Dashboard component specifications with code
- `brewdocs/v1/frontend_design/brewlotto_design.png` - Main dashboard Figma
- `brewdocs/v1/frontend_design/brewlotto_dropdown.png` - Dropdown Figma
- `AGENTS.md` - Project guidelines and build commands

---

## 16. Logo Integration

### 16.1 Logo File (✅ Provided)

User-provided logo file is ready for use.

| Specification | Value |
|---------------|-------|
| **File Location** | `/public/frontend/brew_logo.png` |
| **Format** | PNG with transparent background |
| **File Size** | 78KB |
| **Color** | Gold (matches BrewGold `#FFD700`) |
| **Style** | Bold uppercase "BREWLOTTO", tight crop |
| **Header Height** | 24px mobile / 28px desktop |

### 16.2 Logo Integration Code

```tsx
// In Header.tsx
'use client';

import { useState } from 'react';

export function Logo() {
  const [logoError, setLogoError] = useState(false);

  if (logoError) {
    // Text fallback - matches Figma exactly
    return (
      <h1 className="bg-gradient-to-r from-[#ffc742] via-[#ffd364] to-[#ffbe27] bg-clip-text text-[36px] font-black uppercase tracking-wide text-transparent sm:text-[42px]">
        BrewLotto
      </h1>
    );
  }

  return (
    <img 
      src="/frontend/brew_logo.png" 
      alt="BrewLotto" 
      className="h-[24px] w-auto object-contain sm:h-[28px]"
      onError={() => setLogoError(true)}
    />
  );
}
```

### 16.3 Logo Container Styling

```tsx
// Wrapper with golden drop shadow effect from Figma
<div className="drop-shadow-[0_0_18px_rgba(255,184,28,0.45)]">
  <Logo />
</div>
```

### 16.4 Fallback

Text fallback is automatically used if logo fails to load. The fallback matches the Figma design exactly with gold gradient text.

---

**Document Version**: 2.0  
**Last Updated**: 2026-03-20  
**Status**: Active V1 Contract  
**Aligned to Figma**: Yes (100%)  
**Avatar System**: Complete specification included
