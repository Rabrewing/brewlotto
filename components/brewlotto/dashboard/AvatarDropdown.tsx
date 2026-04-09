'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export type AvatarType = 'initials' | 'image' | 'custom';

export interface UserAvatar {
  type: AvatarType;
  imageUrl?: string;
  initials?: string;
  colorIndex?: number;
}

const AVATAR_COLORS = [
  'from-[#ffc742] to-[#ffbe27]',
  'from-[#ff6b6b] to-[#ee5a5a]',
  'from-[#72caff] to-[#58a9ff]',
  'from-[#6bcb77] to-[#5ab868]',
  'from-[#9b59b6] to-[#8e44ad]',
  'from-[#f39c12] to-[#e67e22]',
  'from-[#1abc9c] to-[#16a085]',
  'from-[#e91e63] to-[#c2185b]',
];

type MenuIconKey =
  | 'profile'
  | 'picks'
  | 'results'
  | 'stats'
  | 'locker'
  | 'notifications'
  | 'settings'
  | 'billing'
  | 'learn'
  | 'legal'
  | 'logout';

interface MenuItem {
  label: string;
  icon: MenuIconKey;
  href?: string;
  enabled: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const MENU_SECTIONS: MenuSection[] = [
  {
    title: 'Gameplay',
    items: [
      { label: 'My Picks', icon: 'picks', href: '/my-picks', enabled: true },
      { label: "Today's Results", icon: 'results', href: '/results', enabled: true },
      { label: 'Stats & Performance', icon: 'stats', href: '/stats', enabled: true },
      { label: 'Strategy Locker', icon: 'locker', href: '/strategy-locker', enabled: true },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Profile', icon: 'profile', href: '/profile', enabled: true },
      { label: 'Notifications', icon: 'notifications', href: '/notifications', enabled: true },
      { label: 'Settings', icon: 'settings', href: '/settings', enabled: true },
      { label: 'Subscription / Billing', icon: 'billing', href: '/billing', enabled: true },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'BrewU', icon: 'learn', href: '/learn', enabled: true },
      { label: 'Terms & Privacy', icon: 'legal', href: '/legal', enabled: true },
      { label: 'Logout', icon: 'logout', href: '/logout', enabled: true },
    ],
  },
];

function MenuIcon({ icon }: { icon: MenuIconKey }) {
  const common = 'h-[19px] w-[19px]';

  switch (icon) {
    case 'profile':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path d="M20 21a8 8 0 10-16 0" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="8" r="4" />
        </svg>
      );
    case 'picks':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path d="M8 6h11" strokeLinecap="round" />
          <path d="M8 12h11" strokeLinecap="round" />
          <path d="M8 18h11" strokeLinecap="round" />
          <path d="M4 6h.01M4 12h.01M4 18h.01" strokeLinecap="round" />
        </svg>
      );
    case 'results':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path d="M5 4h14v16H5z" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
        </svg>
      );
    case 'stats':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path d="M5 18V9" strokeLinecap="round" />
          <path d="M12 18V5" strokeLinecap="round" />
          <path d="M19 18v-7" strokeLinecap="round" />
        </svg>
      );
    case 'locker':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <rect x="4" y="11" width="16" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 118 0v3" strokeLinecap="round" />
        </svg>
      );
    case 'notifications':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path d="M6 9a6 6 0 1112 0c0 7 3 7 3 9H3c0-2 3-2 3-9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 21a2 2 0 004 0" strokeLinecap="round" />
        </svg>
      );
    case 'settings':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1.04 1.56V22a2 2 0 11-4 0v-.09A1.7 1.7 0 008.96 20.35a1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.7 1.7 0 004.61 15a1.7 1.7 0 00-1.56-1.04H3a2 2 0 110-4h.09A1.7 1.7 0 004.65 8.96a1.7 1.7 0 00-.34-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06A1.7 1.7 0 008.96 4.61 1.7 1.7 0 0010 3.05V3a2 2 0 114 0v.09A1.7 1.7 0 0015.04 4.65a1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06A1.7 1.7 0 0019.39 8.96c.12.38.63 1.04 1.56 1.04H21a2 2 0 110 4h-.09A1.7 1.7 0 0019.4 15z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'billing':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 10h18" strokeLinecap="round" />
          <path d="M7 15h3" strokeLinecap="round" />
        </svg>
      );
    case 'learn':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <circle cx="12" cy="12" r="9" />
          <path d="M9.25 9a2.75 2.75 0 115.1 1.42c-.55.95-1.65 1.42-2.35 2.08V14" strokeLinecap="round" />
          <path d="M12 17h.01" strokeLinecap="round" />
        </svg>
      );
    case 'legal':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path d="M12 3a9 9 0 100 18 9 9 0 000-18z" />
          <path d="M12 7v5" strokeLinecap="round" />
          <path d="M12 17h.01" strokeLinecap="round" />
        </svg>
      );
    case 'logout':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path d="M10 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 12H4" strokeLinecap="round" />
          <path d="M20 19v-2a2 2 0 00-2-2h-3" strokeLinecap="round" />
          <path d="M20 5v2a2 2 0 01-2 2h-3" strokeLinecap="round" />
        </svg>
      );
  }
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pb-2 pt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
      {children}
    </div>
  );
}

function MenuRow({
  item,
  onClick,
}: {
  item: MenuItem;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-[#ffd27e]">
        <MenuIcon icon={item.icon} />
      </span>
      <span className="flex-1 text-left">{item.label}</span>
      {item.enabled ? (
        <svg className="h-4 w-4 text-[#d39b46]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <span className="rounded-full border border-white/8 bg-white/[0.03] px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-white/30">
          queued
        </span>
      )}
    </>
  );

  const className = `flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-[15px] transition-all ${
    item.enabled
      ? 'text-[#f6ddb2] hover:bg-[#ffc742]/8 hover:text-white hover:shadow-[0_0_12px_rgba(255,199,66,0.12)]'
      : 'cursor-default text-white/48'
  }`;

  if (!item.enabled || !item.href) {
    return <div className={className}>{content}</div>;
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return (
    <Link href={item.href} className={className} onClick={onClick}>
      {content}
    </Link>
  );
}

export function AvatarDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const [avatar] = useState<UserAvatar>({
    type: 'initials',
    initials: 'JD',
    colorIndex: 0,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setConfirmingLogout(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setConfirmingLogout(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const colorClass = AVATAR_COLORS[avatar.colorIndex || 0];

  const renderAvatar = (size: 'small' | 'large' = 'small') => {
    const dimensions = size === 'large' ? 'h-12 w-12' : 'h-full w-full';
    const textSize = size === 'large' ? 'text-base' : 'text-sm';

    if ((avatar.type === 'image' || avatar.type === 'custom') && avatar.imageUrl) {
      return (
        <img
          src={avatar.imageUrl}
          alt="Profile"
          className={`${dimensions} rounded-full object-cover`}
        />
      );
    }

    return (
      <div className={`flex ${dimensions} items-center justify-center rounded-full bg-gradient-to-br ${colorClass}`}>
        <span className={`${textSize} font-bold text-white drop-shadow`}>{avatar.initials || '?'}</span>
      </div>
    );
  };

  return (
    <div ref={dropdownRef} className="relative z-30">
      <button
        type="button"
        onClick={() => {
          setIsOpen((value) => !value);
          setConfirmingLogout(false);
        }}
        className="group relative flex items-center gap-2 rounded-[16px] border border-[#ffc742]/20 bg-[#151112]/92 px-2 py-1.5 shadow-[0_0_18px_rgba(255,199,66,0.08)] transition-all hover:border-[#ffc742]/45 hover:shadow-[0_0_18px_rgba(255,199,66,0.16)]"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <div className="flex h-11 w-11 overflow-hidden rounded-full border-2 border-[#ffc742]/65 bg-[#1a1a1c] shadow-[0_0_12px_rgba(255,199,66,0.35)]">
          {renderAvatar()}
        </div>
        <div className="hidden pr-1 text-left sm:block">
          <div className="text-[11px] uppercase tracking-[0.16em] text-white/35">Account</div>
          <div className="text-[13px] font-medium text-[#f7ddb3]">John Doe</div>
        </div>
        <svg
          className={`h-4 w-4 text-[#ffc742] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 7.5L10 12.5L15 7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen ? (
        <>
          <div className="fixed inset-0 z-20 bg-black/10" aria-hidden="true" />
          <div className="absolute right-0 top-[calc(100%+14px)] z-30 w-[332px] max-w-[calc(100vw-2rem)]">
            <div className="absolute right-8 top-[-7px] h-4 w-4 rotate-45 rounded-[4px] border-l border-t border-[#ffc742]/28 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(6,4,4,0.92))] shadow-[0_0_18px_rgba(255,199,66,0.18)]" />

            <div className="overflow-hidden rounded-[22px] border border-[#ffc742]/28 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(9,6,6,0.95))] p-2 shadow-[0_0_40px_rgba(255,200,0,0.20)] backdrop-blur-xl">
              <div className="rounded-[18px] border border-white/6 bg-black/15 px-3 py-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 overflow-hidden rounded-full border-2 border-[#ffc742]/70 bg-[#1a1a1c] shadow-[0_0_10px_rgba(255,200,0,0.4)]">
                    {renderAvatar('large')}
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="truncate text-[17px] font-semibold text-[#f7ddb3]">John Doe</div>
                    <div className="truncate text-[12px] text-white/55">john@example.com</div>
                  </div>
                  <button
                    type="button"
                    disabled
                    className="rounded-full border border-[#ffc742]/35 bg-[#ffc742]/12 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#ffd988] opacity-90"
                    title="State selection will be connected in a later V1 slice"
                  >
                    NC ▼
                  </button>
                </div>
              </div>

              <div className="px-3 pb-2 pt-3 text-[11px] uppercase tracking-[0.14em] text-white/28">
                V1 destination rollout in progress
              </div>

              {MENU_SECTIONS.map((section, sectionIndex) => (
                <div key={section.title} className={sectionIndex > 0 ? 'mt-2' : ''}>
                  <SectionLabel>{section.title}</SectionLabel>
                  <div className="space-y-0.5">
                    {section.items.map((item) => (
                        <MenuRow
                          key={item.label}
                          item={item}
                          onClick={
                            item.icon === 'logout'
                              ? () => setConfirmingLogout(true)
                              : item.enabled
                                ? () => setIsOpen(false)
                                : undefined
                          }
                        />
                    ))}
                  </div>
                  {sectionIndex < MENU_SECTIONS.length - 1 ? (
                    <div className="mx-3 mt-2 h-px bg-white/6" />
                  ) : null}
                </div>
              ))}

              {confirmingLogout ? (
                <div className="mt-3 rounded-[16px] border border-[#ffc742]/18 bg-[#140f0e]/90 p-3">
                  <div className="text-[13px] font-medium text-[#f6ddb2]">Logout now?</div>
                  <div className="mt-1 text-[12px] leading-5 text-white/52">
                    You will be returned through the existing logout flow.
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmingLogout(false)}
                      className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      Cancel
                    </button>
                    <Link
                      href="/logout"
                      className="flex-1 rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-4 py-2 text-center text-[13px] font-semibold text-black shadow-[0_0_16px_rgba(255,199,66,0.2)]"
                    >
                      Logout
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
