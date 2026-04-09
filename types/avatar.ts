/**
 * Avatar System Types for BrewLotto V1
 *
 * This file defines the type contracts for the flexible avatar system.
 * Users are NOT required to use their real face photo.
 *
 * Avatar Options:
 * 1. Initials (Default) - Auto-generated with colored background
 * 2. Built-in Presets - Pre-designed lottery-themed avatars
 * 3. Custom Upload - Any image (not just faces) via Supabase Storage
 */

// =============================================================================
// Avatar Types
// =============================================================================

/**
 * The type of avatar a user has selected.
 * - 'initials': Auto-generated initials with colored background
 * - 'preset': One of the built-in avatar images
 * - 'custom': User-uploaded image
 */
export type AvatarType = 'initials' | 'preset' | 'custom';

/**
 * User's avatar configuration.
 * Stored in the user_preferences table.
 */
export interface UserAvatar {
  /** The type of avatar */
  type: AvatarType;

  /** For initials: the displayed initials (e.g., "JD" for John Doe) */
  initials?: string;

  /** For initials: the color index (0-7) mapping to AVATAR_COLORS */
  colorIndex?: number;

  /** For preset/custom: the URL to the avatar image */
  imageUrl?: string;

  /** For custom uploads: the Supabase storage path */
  storagePath?: string;
}

/**
 * Pre-defined avatar preset available for selection.
 * Stored in /public/avatars/ directory.
 */
export interface AvatarPreset {
  /** Unique identifier (e.g., "lottery-ball-gold") */
  id: string;

  /** Display name (e.g., "Lucky Gold Ball") */
  name: string;

  /** URL to the avatar image */
  imageUrl: string;

  /** Category for grouping in the UI */
  category: AvatarCategory;
}

/**
 * Categories for avatar presets.
 */
export type AvatarCategory = 'lottery' | 'abstract' | 'characters' | 'badges';

// =============================================================================
// Avatar Color Presets (for initials-based avatars)
// =============================================================================

/**
 * Gradient color pairs for initials-based avatars.
 * Each entry is a Tailwind gradient class string.
 */
export const AVATAR_COLORS = [
  'from-[#ffc742] to-[#ffbe27]',   // 0: Gold (default)
  'from-[#ff6b6b] to-[#ee5a5a]',   // 1: Red
  'from-[#72caff] to-[#58a9ff]',   // 2: Blue
  'from-[#6bcb77] to-[#5ab868]',   // 3: Green
  'from-[#9b59b6] to-[#8e44ad]',   // 4: Purple
  'from-[#f39c12] to-[#e67e22]',   // 5: Orange
  'from-[#1abc9c] to-[#16a085]',   // 6: Teal
  'from-[#e91e63] to-[#c2185b]',   // 7: Pink
] as const;

/**
 * Number of available avatar colors.
 */
export const AVATAR_COLORS_COUNT = AVATAR_COLORS.length;

// =============================================================================
// Avatar Upload Constraints
// =============================================================================

/**
 * Maximum file size for avatar uploads (5MB).
 */
export const AVATAR_MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Allowed MIME types for avatar uploads.
 */
export const AVATAR_ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
] as const;

/**
 * Minimum dimensions for avatar images (100x100px).
 */
export const AVATAR_MIN_DIMENSIONS = {
  width: 100,
  height: 100,
} as const;

/**
 * Maximum dimensions for avatar images (500x500px).
 */
export const AVATAR_MAX_DIMENSIONS = {
  width: 500,
  height: 500,
} as const;

/**
 * Supabase storage bucket name for avatars.
 */
export const AVATAR_STORAGE_BUCKET = 'user-avatars';

// =============================================================================
// Built-in Avatar Presets
// =============================================================================

/**
 * Built-in avatar presets available for selection.
 * These images should be placed in /public/avatars/
 */
export const BUILT_IN_PRESETS: AvatarPreset[] = [
  // Lottery themed
  {
    id: 'lottery-ball-gold',
    name: 'Lucky Gold Ball',
    imageUrl: '/avatars/lottery-ball-gold.png',
    category: 'lottery',
  },
  {
    id: 'lottery-ball-blue',
    name: 'Cool Blue Ball',
    imageUrl: '/avatars/lottery-ball-blue.png',
    category: 'lottery',
  },
  {
    id: 'lottery-ball-red',
    name: 'Hot Red Ball',
    imageUrl: '/avatars/lottery-ball-red.png',
    category: 'lottery',
  },
  {
    id: 'lottery-ball-multi',
    name: 'Rainbow Ball',
    imageUrl: '/avatars/lottery-ball-multi.png',
    category: 'lottery',
  },
  {
    id: 'dice-gold',
    name: 'Golden Dice',
    imageUrl: '/avatars/dice-gold.png',
    category: 'lottery',
  },
  {
    id: 'chip-gold',
    name: 'Golden Chip',
    imageUrl: '/avatars/chip-gold.png',
    category: 'lottery',
  },
  // Character themed
  {
    id: 'brewbot-happy',
    name: 'BrewBot Happy',
    imageUrl: '/avatars/brewbot-happy.png',
    category: 'characters',
  },
  {
    id: 'brewbot-thinking',
    name: 'BrewBot Thinking',
    imageUrl: '/avatars/brewbot-thinking.png',
    category: 'characters',
  },
  // Badge themed
  {
    id: 'trophy-gold',
    name: 'Golden Trophy',
    imageUrl: '/avatars/trophy-gold.png',
    category: 'badges',
  },
  {
    id: 'star-gold',
    name: 'Golden Star',
    imageUrl: '/avatars/star-gold.png',
    category: 'badges',
  },
  // Abstract themed
  {
    id: 'abstract-wave',
    name: 'Wave',
    imageUrl: '/avatars/abstract-wave.png',
    category: 'abstract',
  },
  {
    id: 'abstract-cosmic',
    name: 'Cosmic',
    imageUrl: '/avatars/abstract-cosmic.png',
    category: 'abstract',
  },
  {
    id: 'abstract-energy',
    name: 'Energy',
    imageUrl: '/avatars/abstract-energy.png',
    category: 'abstract',
  },
];

// =============================================================================
// Dropdown Menu Types
// =============================================================================

/**
 * Items in the avatar dropdown menu.
 */
export interface DropdownItem {
  /** Display label */
  label: string;

  /** Route/path to navigate to */
  href: string;

  /** Icon to display (emoji or component) */
  icon: string;

  /** Optional badge count (e.g., for notifications) */
  badge?: number;

  /** Whether this item is the logout action */
  isLogout?: boolean;
}

/**
 * The 11 dropdown items for V1 (matching Figma exactly).
 */
export const V1_DROPDOWN_ITEMS: DropdownItem[] = [
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
  { label: 'Logout', href: '/logout', icon: '🚪', isLogout: true },
];

// =============================================================================
// API Types
// =============================================================================

/**
 * Request body for uploading a new avatar.
 */
export interface AvatarUploadRequest {
  /** The file to upload */
  file: File;
}

/**
 * Response from avatar upload.
 */
export interface AvatarUploadResponse {
  /** Public URL of the uploaded avatar */
  url: string;

  /** Supabase storage path */
  path: string;
}

/**
 * Request body for updating user avatar preference.
 */
export interface UpdateAvatarRequest {
  /** The new avatar configuration */
  avatar: UserAvatar;
}

/**
 * Response from getting user avatar.
 */
export interface GetAvatarResponse {
  /** Current avatar configuration */
  avatar: UserAvatar;
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Generate initials from a user's name.
 * @param name - Full name (e.g., "John Doe")
 * @returns Initials (e.g., "JD")
 */
export function generateInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Get the Tailwind gradient class for a color index.
 * @param index - Color index (0-7)
 * @returns Tailwind gradient class string
 */
export function getAvatarColorClass(index: number): string {
  const safeIndex = Math.max(0, Math.min(index, AVATAR_COLORS_COUNT - 1));
  return AVATAR_COLORS[safeIndex];
}

/**
 * Get the preset by ID.
 * @param id - Preset ID
 * @returns The preset or undefined if not found
 */
export function getPresetById(id: string): AvatarPreset | undefined {
  return BUILT_IN_PRESETS.find(preset => preset.id === id);
}

/**
 * Get all presets for a given category.
 * @param category - Avatar category
 * @returns Array of presets in that category
 */
export function getPresetsByCategory(category: AvatarCategory): AvatarPreset[] {
  return BUILT_IN_PRESETS.filter(preset => preset.category === category);
}

/**
 * Create a default avatar for new users.
 * @param name - User's name for initials
 * @param colorIndex - Optional color index (defaults to 0 = gold)
 * @returns Default UserAvatar configuration
 */
export function createDefaultAvatar(name: string, colorIndex: number = 0): UserAvatar {
  return {
    type: 'initials',
    initials: generateInitials(name),
    colorIndex: Math.max(0, Math.min(colorIndex, AVATAR_COLORS_COUNT - 1)),
  };
}
