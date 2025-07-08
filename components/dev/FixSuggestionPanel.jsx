// =============================================
// 📁 File: /components/dev/FixSuggestionPanel.jsx
// 🧠 Summary: Displays fix suggestions with diff, delegation, voice narration, and patch memory
//
// ▸ Renders patch preview and BrewBot commentary per fix event
// ▸ Injects tone-based commentary phrase from commentaryMatrix.js
// ▸ Records entries to the refactor ledger and voice layer
//
// 🔁 Used in: BrewIDE.jsx, BrewCommand Cockpit
// ✨ Enhanced: Phase 5.1 — Patch Commentary Matrix Integration
// =============================================

import { useState, useEffect } from "react";
import { useBrewBotContext } from "@/components/context/BrewBotContext";
import { writeLedgerEntry } from "@/hooks/useRefactorLedger";
import { usePatchQueue } from "@/hooks/usePatchQueue";
import PatchDiff from "@/components/ui/PatchDiff";
import teamDirectory from "@/lib/teamDirectory.json";
import { getCommentaryTone, tonePhrases } from "@/lib/commentaryMatrix";

export default function FixSuggestionPanel({ fix, onApply }) {
    const { file, summary, patch, issues = [], category, status = "pending" } = fix || {};
    const [assigned, setAssigned] = useState("");
    const [team, setTeam] = useState("");

    const { speak } = useBrewBotContext();
    const { addFix, updateStatus, assign } = usePatchQueue();

    const tone = getCommentaryTone({
        file,
        category,
        user: "RB",
        status
    });
    const phrase = tonePhrases[tone]?.[Math.floor(Math.random() * tonePhrases[tone].length)];

    useEffect(() => {
        if (fix) {
            addFix({
                ...fix,
                approvedBy: "RB",
                proposedBy: "Brew Da AI",
                timestamp: new Date().toISOString(),
                status: "pending"
            });
        }
    }, [fix]);

    const handleApply = () => {
        onApply?.(patch?.after || "");

        updateStatus(file, "applied");
        writeLedgerEntry({
            file,
            approvedBy: "RB",
            proposedBy: "Brew Da AI",
            summary: "Patch approved and applied",
            timestamp: new Date().toISOString()
        });

        speak(`Refactor applied to ${file}. Strategy updated. ${phrase}`);
    };

    const assignTo = (dev) => {
        setAssigned(dev);
        assign(file, dev);
        speak(`Fix for ${file} delegated to ${dev}. ${phrase}`);

        writeLedgerEntry({
            file,
            assignedTo: dev,
            approvedBy: "RB",
            proposedBy: "Brew Da AI",
            summary: `Fix delegated to ${dev}`,
            timestamp: new Date().toISOString()
        });
    };

    const assignToTeam = (teamName) => {
        setTeam(teamName);
        assign(file, null, teamName);
        speak(`${teamName} assigned to refactor ${file}. ${phrase}`);

        writeLedgerEntry({
            file,
            team: teamName,
            approvedBy: "RB",
            proposedBy: "Brew Da AI",
            summary: `Fix assigned to team ${teamName}`,
            timestamp: new Date().toISOString()
        });
    };

    return (
        <div className="bg-[#111] text-yellow-200 p-4 rounded-lg shadow border border-yellow-600 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                🧠 Brew Da AI Refactor Suggestion
            </h2>

            {summary && <p className="text-sm text-yellow-400 mb-1 italic">{summary}</p>}
            {phrase && <p className="text-xs text-yellow-500 mb-2">💬 {phrase}</p>}

            {!!issues.length && (
                <ul className="list-disc list-inside text-sm mb-3 text-yellow-300">
                    {issues.map((issue, i) => (
                        <li key={i}>{issue}</li>
                    ))}
                </ul>
            )}

            <div className="bg-[#1a1a1a] rounded p-2 mb-3">
                <PatchDiff before={patch?.before || ""} after={patch?.after || ""} />
            </div>

            <div className="flex flex-wrap gap-3">
                <button
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
                    onClick={handleApply}
                >
                    ✅ Approve & Apply
                </button>

                <button
                    className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded text-sm"
                    onClick={() => speak(`Fix rejected for ${file}`)}
                >
                    ❌ Reject
                </button>

                <button
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
                    onClick={() => speak(`Fix for ${file} triaged for later review.`)}
                >
                    ⏳ Review Later
                </button>

                <select
                    className="bg-yellow-900 text-yellow-100 px-2 py-1 rounded text-sm"
                    value={assigned}
                    onChange={(e) => assignTo(e.target.value)}
                >
                    <option value="">👤 Delegate to Dev</option>
                    {Object.entries(teamDirectory)
                        .filter(([_, data]) => data.dev)
                        .map(([name]) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                </select>

                <select
                    className="bg-yellow-800 text-yellow-100 px-2 py-1 rounded text-sm"
                    value={team}
                    onChange={(e) => assignToTeam(e.target.value)}
                >
                    <option value="">👥 Assign to Team</option>
                    <option value="UI Core">UI Core</option>
                    <option value="RefactorOps">RefactorOps</option>
                    <option value="StrategyEngine">StrategyEngine</option>
                </select>
            </div>
        </div>
    );
}