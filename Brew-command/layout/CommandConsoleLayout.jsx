// @file: CommandConsoleLayout.jsx
// @directory: /brew-command/layout
// @summary: Global layout wrapper for BrewCommand admin tools with nav, pane slots, HUDs

import React from 'react';
import SidebarMenu from '@/components/dashboard/SidebarMenu';
import { cn } from '@/lib/utils';

export default function CommandConsoleLayout({ children, bottomBar, overlayHUD, user }) {
    return (
        <div className="flex h-screen w-screen bg-black text-white overflow-hidden">
            {/* 🧭 Sidebar Nav */}
            <aside className="w-64 bg-[#111827] border-r border-yellow-500 p-4 hidden md:block">
                <SidebarMenu user={user} />
            </aside>

            {/* 🧠 Main Panel */}
            <main className="flex-1 relative overflow-auto p-4 space-y-4">
                {children}

                {/* 🗂 Optional Bottom Bar */}
                {bottomBar && (
                    <div className="fixed bottom-0 left-64 right-0 bg-[#0f172a] border-t border-yellow-500 p-2 text-xs text-gray-300 z-20">
                        {bottomBar}
                    </div>
                )}

                {/* 🧠 Optional Floating Insight / Voice HUD */}
                {overlayHUD && (
                    <div className={cn("fixed bottom-4 right-4 z-30")}>
                        {overlayHUD}
                    </div>
                )}
            </main>
        </div>
    );
}