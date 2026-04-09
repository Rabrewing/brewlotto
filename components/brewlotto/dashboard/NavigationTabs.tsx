'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type TabId = 'dashboard' | 'results' | 'picks';

interface Tab {
  id: TabId;
  label: string;
  href: string;
}

const TABS: Tab[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { id: 'results', label: 'Results', href: '/results' },
  { id: 'picks', label: 'My Picks', href: '/my-picks' },
];

export function NavigationTabs() {
  const pathname = usePathname();

  return (
    <nav className="mb-4">
      <div className="flex items-center gap-6">
        {TABS.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`relative pb-2 text-[15px] font-medium transition-colors ${
              pathname === tab.href
                ? 'text-[#ffc742]'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {tab.label}
            
            {/* Active indicator */}
            {pathname === tab.href && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ffc742] to-[#ffd364]" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
