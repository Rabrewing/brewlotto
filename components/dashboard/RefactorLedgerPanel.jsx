// @file: RefactorLedgerPanel.jsx
// @summary: Timeline of all reports in refactor_ledger.json
import { useRefactorLedger } from '@/hooks/useRefactorLedger';

export default function RefactorLedgerPanel() {
    const { ledger, loading } = useRefactorLedger();

    return (
        <div className="bg-[#1a1a1a] p-4 rounded border border-yellow-700 max-h-[75vh] overflow-auto">
            <h2 className="text-xl font-semibold mb-2 text-yellow-200">📘 Refactor Ledger</h2>
            {loading ? (
                <p className="text-yellow-500 text-sm">Loading audit log...</p>
            ) : (
                <ul className="text-sm space-y-2">
                    {ledger
                        .slice()
                        .reverse()
                        .map((entry, i) => (
                            <li key={i} className="border-l-4 border-yellow-600 pl-3">
                                <div className="text-yellow-300 font-mono text-xs">
                                    {new Date(entry.timestamp).toLocaleString()} ·{' '}
                                    <span className="text-yellow-500">{entry.reportHash}</span>
                                </div>
                                <div className="text-yellow-100">
                                    {entry.filesScanned} files ·{' '}
                                    {entry.untriaged} untriaged ·{' '}
                                    {entry.locked ? '🔒 Merge Lock' : '🟢 Unlocked'}
                                </div>
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
}