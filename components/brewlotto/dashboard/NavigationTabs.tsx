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