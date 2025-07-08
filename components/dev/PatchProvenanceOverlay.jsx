// =============================================
// 📁 File: /components/dev/PatchProvenanceOverlay.jsx
// 🧠 Summary: Visual timeline of patch lifecycle — proposal → approval → assignment → status
//
// ▸ Accepts `patch` object or patch ID
// ▸ Pulls metadata from usePatchQueue() or ledger
// ▸ Visual timeline + status animation
// ▸ Narrates the patch origin story: Proposed by, Approved by, Assigned to, Status trail
//
// 🔁 Used in: PatchQueuePanel, BrewIDE, MergeConflictResolver
// ✨ Enhanced: Phase 4.24 — Provenance + Timeline + Export Trail
// =============================================

import { usePatchQueue } from "@/hooks/usePatchQueue";
import { useBrewBotContext } from "@/components/context/BrewBotContext";
import { useEffect } from "react";

export default function PatchProvenanceOverlay({ patch }) {
    const { queue = [] } = usePatchQueue();
    const { speak } = useBrewBotContext();

    const full = queue.find(
        (f) => f.file === patch?.file && f.summary === patch?.summary
    );

    if (!full) return null;

    const {
        file,
        summary,
        proposedBy,
        approvedBy,
        assignedTo,
        team,
        status,
        timestamp
    } = full;

    const timelineSteps = [
        { label: "Proposed", icon: "📝", active: !!proposedBy },
        { label: "Approved", icon: "✅", active: !!approvedBy },
        { label: "Assigned", icon: "👤", active: !!assignedTo || !!team },
        { label: "Applied", icon: "📦", active: status === "applied" }
    ];

    // 📤 Export lineage to audit history
    useEffect(() => {
        const history = JSON.parse(localStorage.getItem("brew_audit_history") || "[]");
        const entry = {
            file,
            summary,
            proposedBy,
            approvedBy,
            assignedTo,
            team,
            status,
            timestamp,
            timeline: timelineSteps
                .filter((step) => step.active)
                .map((step) => ({
                    event: step.label.toLowerCase(),
                    timestamp,
                    by:
                        step.label === "Proposed"
                            ? proposedBy
                            : step.label === "Approved"
                                ? approvedBy
                                : step.label === "Assigned"
                                    ? assignedTo || team
                                    : "system"
                }))
        };

        const augmented = [...history, { ...entry }];
        localStorage.setItem("brew_audit_history", JSON.stringify(augmented));
    }, []);

    return (
        <div className="bg-[#111] border border-yellow-700 rounded p-4 text-sm text-yellow-200 shadow-xl max-w-md">
            <h3 className="text-lg font-bold text-yellow-300">🧾 Patch Provenance</h3>
            <p className="mt-2 font-mono text-yellow-400 text-xs">{file}</p>
            <p className="italic text-yellow-100">{summary}</p>

            <div className="mt-4 space-y-1 text-yellow-500">
                <p>📤 Proposed by: {proposedBy || "Unknown"}</p>
                <p>✅ Approved by: {approvedBy || "Not yet approved"}</p>
                <p>👤 Assigned to: {assignedTo || team || "Unassigned"}</p>
                <p>📌 Status: {status || "Pending"}</p>
                <p className="text-xs text-gray-400">
                    🕒 Timestamp: {timestamp ? new Date(timestamp).toLocaleString() : "—"}
                </p>
            </div>

            <div className="mt-4 space-y-2">
                {timelineSteps.map((step, i) => (
                    <div
                        key={i}
                        className={`flex items-center gap-2 text-sm ${step.active ? "text-yellow-300 font-semibold animate-pulse" : "text-yellow-600"
                            }`}
                    >
                        <span className="text-lg">{step.icon}</span>
                        <span>{step.label}</span>
                    </div>
                ))}
            </div>

            <button
                className="mt-5 text-xs bg-yellow-700 px-3 py-1 rounded hover:bg-yellow-600"
                onClick={() =>
                    speak(
                        `Patch for ${file}. Proposed by ${proposedBy || "unknown"}, approved by ${approvedBy || "nobody yet"
                        }, assigned to ${assignedTo || team || "unassigned"}.`
                    )
                }
            >
                🗣️ Narrate Provenance
            </button>
        </div>
    );
}