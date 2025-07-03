// @file: MergebarMenu.jsx
// @directory: /components/ui
// @timestamp: 2025-07-01T11:55 EDT
// @summary: Sidebar menu for BrewMerge tools using shared Button component with active tab highlighting
// @route: N/A — imported into BrewAuditDashboard and admin views

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';

const navItems = [
    { label: '🧩 Merge Panel', path: '/admin/brew-merge-ui' },
    { label: '📊 Audit Dashboard', path: '/admin/brew-audit-dashboard' },
    { label: '📂 File Scan Results', path: '/admin/merge-scan-results' },
    { label: '🗑️ Prune Visualizer', path: '/admin/code-prune-visualizer' },
    { label: '🔀 Merge Panel', path: '/admin/merge-panel' },
    { label: '🧬 Strategy Footprint Map', path: '/admin/strategy-footprint-map' },
    { label: '📜 Audit History Timeline', path: '/admin/audit-history-timeline' },
];

const MergebarMenu = ({ active, onChange }) => {
    const router = useRouter();

    return (
        <div className="h-full w-64 bg-[#111827] text-white p-4 space-y-4 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">🧠 BrewMerge Tools</h2>

            <nav className="space-y-3">
                {navItems.map(({ label, path }) => (
                    <Link key={path} href={path}>
                        <Button
                            variant="ghost"
                            className={`w-full justify-start text-left ${active === label ? 'bg-yellow-500 text-black' : ''
                                }`}
                            onClick={() => onChange?.(label)}
                        >
                            {label}
                        </Button>
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default MergebarMenu;