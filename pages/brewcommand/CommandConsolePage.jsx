// @file: CommandConsolePage.jsx
// @directory: /pages/brewcommand
// @summary: BrewCommand cockpit page using CommandConsoleLayout
// @timestamp: 2025-07-03T21:58 EDT

import CommandConsoleLayout from '@/brew-command/layout/CommandConsoleLayout';
import AuditInsightPanel from '@/brew-command/ide/AuditInsightPanel';
import RefactorPreviewPanel from '@/components/overlays/RefactorPreviewPanel';
import FixSuggestionPanel from '@/components/dev/FixSuggestionPanel';
import BrewDevChat from '@/components/dev/BrewDevChat';
import { useAuditStore } from '@/stores/useAuditStore';
import { getSession } from 'next-auth/react';

export default function CommandConsolePage({ user }) {
    const { selectedFix } = useAuditStore(); // 🔌 Hook into fix selection

    return (
        <CommandConsoleLayout
            user={user}
            bottomBar={<div>🌐 Environment: Dev | 🔁 Last Scan: 2m ago</div>}
            overlayHUD={
                <div className="bg-yellow-500 text-black px-3 py-1 rounded shadow">
                    🧠 BrewCommand Ready
                </div>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-[#1f1f1f] p-4 rounded">📁 FileTree Placeholder</div>
                </div>

                <div className="md:col-span-2 space-y-4">
                    <AuditInsightPanel />
                    <RefactorPreviewPanel />
                    {selectedFix && <FixSuggestionPanel fix={selectedFix} />}
                    <BrewDevChat context={{ name: 'strategy.js', content: '// strategy logic' }} />
                </div>
            </div>
        </CommandConsoleLayout>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);
    return {
        props: {
            user: session?.user || null,
        },
    };
}