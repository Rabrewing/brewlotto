// @file: BrewMergeOverviewCard.jsx
// @summary: Displays scan stats, audit readiness, and patch opportunity tracking

import useMergeFileIndex from '@/hooks/useMergeFileIndex';

export default function BrewMergeOverviewCard() {
    const { getStats } = useMergeFileIndex();
    const stats = getStats();

    return (
        <div className="bg-[#1a1a1a] border border-yellow-600 p-4 rounded-lg max-w-xl mx-auto text-yellow-200">
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                🧩 Merge Audit Overview
            </h2>

            <ul className="text-sm space-y-1">
                <li>📁 <strong>Total Files:</strong> {stats.total}</li>
                <li>🧠 <strong>Strategy Candidates:</strong> {stats.strategy}</li>
                <li>🧩 <strong>JS Modules:</strong> {stats.js}</li>
                <li>🎨 <strong>JSX Components:</strong> {stats.jsx}</li>
                <li>⚠️ <strong>High-Risk Zones:</strong> {stats.highRisk}</li>
                <li>🧪 <strong>Untriaged Files:</strong> {stats.untriaged}</li>
            </ul>

            <div className="mt-3 text-sm text-yellow-400 italic">
                {stats.untriaged === 0
                    ? '✅ All files accounted for — ready for Patch Assessment'
                    : `🛠️ ${stats.untriaged} files still need triage before audit.`}
            </div>
        </div>
    );
}