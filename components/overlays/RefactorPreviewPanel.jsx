// @file: RefactorPreviewPanel.jsx
// @directory: /components/overlays
// @timestamp: 2025-07-03T09:00 EDT
// @summary: Shows refactor candidates, scores, reasons, and AI summaries from useAuditStore

import { useAuditStore } from '@/stores/useAuditStore';

export default function RefactorPreviewPanel() {
    const refactor = useAuditStore((s) => s.refactorCandidates);
    const summaries = useAuditStore((s) => s.fileSummaries);
    const setCurrentFile = useAuditStore((s) => s.setCurrentFile);

    return (
        <div className="bg-[#111111] text-yellow-200 p-4 rounded-lg shadow border border-yellow-600">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                🧠 Refactor Candidates
                <span className="bg-yellow-700 text-black rounded-full px-2 text-sm">
                    {refactor.length}
                </span>
            </h2>

            {refactor.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No high-entropy files found.</p>
            ) : (
                <ul className="space-y-3">
                    {refactor.map(({ file, score, reason }) => (
                        <li
                            key={file}
                            className="bg-[#1a1a1a] p-3 rounded border-l-4 border-yellow-500 cursor-pointer hover:bg-yellow-800/10"
                            onClick={() => setCurrentFile(file)}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-mono text-sm text-yellow-100">{file}</span>
                                <span
                                    className={`font-bold ${score > 200
                                            ? 'text-red-400'
                                            : score > 150
                                                ? 'text-orange-300'
                                                : 'text-green-300'
                                        }`}
                                >
                                    Score: {score}
                                </span>
                            </div>
                            <p className="text-xs text-yellow-400 italic">{reason}</p>
                            {summaries[file] && (
                                <p className="text-xs text-yellow-500 mt-1">📘 {summaries[file]}</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}