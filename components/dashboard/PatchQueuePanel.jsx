// =============================================
// 📁 File: /components/dev/PatchQueuePanel.jsx
// 🧠 Summary: Displays patch-eligible files from BrewMergeFileIndex.json
//
// ▸ Filters for strategy-eligible, untriaged, medium+ risk files
// ▸ Displays category, line count, strategy tags
// ▸ Future: triggers suggest action or opens provenance view
//
// 🔁 Used in: Dashboard, MergeReviewPanel
// ✨ Enhanced: Phase 5.1 — Domain Tagging + Risk Sorting
// =============================================

import { useEffect, useState } from "react";

export default function PatchQueuePanel({ maxItems = 5 }) {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetch("/public/BrewMergeFileIndex.json")
            .then((res) => res.json())
            .then((data) => setFiles(data || []))
            .catch((e) => console.error("🔴 Failed to load index:", e));
    }, []);

    const patchable = files
        .filter(
            (f) =>
                f.tags?.includes("strategy_candidate") &&
                (!f.status || f.status === "untriaged") &&
                (f.refactorRisk === "high" || f.refactorRisk === "medium")
        )
        .sort((a, b) => {
            const riskLevel = { high: 2, medium: 1, low: 0 };
            return riskLevel[b.refactorRisk] - riskLevel[a.refactorRisk];
        })
        .slice(0, maxItems);

    return (
        <div className="bg-[#1a1a1a] p-4 rounded border border-yellow-700 max-h-[75vh] overflow-auto">
            <h2 className="text-xl font-semibold mb-2 text-yellow-200">📦 Patch Queue Candidates</h2>

            {patchable.length === 0 ? (
                <p className="text-yellow-400 text-sm italic">No eligible patch candidates found.</p>
            ) : (
                <ul className="space-y-3">
                    {patchable.map((f, i) => (
                        <li key={i} className="border-l-4 border-yellow-500 pl-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-yellow-300 font-mono text-sm">{f.path}</p>
                                    <p className="text-yellow-100 text-xs italic">{f.description}</p>
                                    <p className="text-xs text-yellow-500 mt-1">
                                        📁 Domain: <strong>{f.category || "Uncategorized"}</strong>
                                    </p>
                                </div>
                                <button
                                    onClick={() => console.log(`🧠 Suggest fix for ${f.path}`)}
                                    className="bg-yellow-500 text-black px-3 py-0.5 rounded text-xs hover:bg-yellow-400 transition whitespace-nowrap"
                                >
                                    💡 Suggest Fix
                                </button>
                            </div>

                            <div className="text-yellow-200 text-xs mt-1 flex flex-wrap gap-2">
                                <span>{f.lines} lines</span>
                                <span>• Risk: {f.refactorRisk}</span>
                                {f.tags?.length > 0 && (
                                    <span title={`Tags: ${f.tags.join(", ")}`}>• {f.tags.length} strategy tags</span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}