'use client';

import { useState, useRef, useEffect } from 'react';

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

interface DropdownItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

const DROPDOWN_ITEMS: DropdownItem[] = [
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
];

export function AvatarDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [avatar] = useState<UserAvatar>({
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