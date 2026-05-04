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
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`relative inline-flex shrink-0 items-center rounded-full border px-4 py-2 text-[14px] font-medium transition-all ${
              pathname === tab.href
                ? 'border-[#ffc742]/28 bg-[#ffc742]/12 text-[#ffe39a] shadow-[0_0_16px_rgba(255,199,66,0.12)]'
                : 'border-white/8 bg-white/[0.03] text-white/70 hover:border-white/14 hover:text-white'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
