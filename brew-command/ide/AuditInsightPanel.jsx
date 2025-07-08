// =============================================
// 📁 File: /brew-command/ide/AuditInsightPanel.jsx
// 🧠 Summary: Visual panel for scan results, export, and commentary feedback
//
// ▸ Triggers /api/scan and updates audit store + snapshot history
// ▸ Narrates scan summary using BrewBotContext.speak()
// ▸ Now tags and speaks category breakdowns (e.g. BrewVision, Dashboard)
// ▸ Enables JSON export of scan state
//
// 🔁 Used in: BrewIDE.jsx
// 🔗 Dependencies: useAuditStore, BrewBotContext, /api/scan
// ✨ Enhanced: Phase 5.1 — App-Level Tagging & Summary Breakdown
// =============================================

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuditStore } from "@/stores/useAuditStore";
import { downloadSnapshot } from "@/lib/AuditExportUtils";
import { useBrewBotContext } from "@/components/context/BrewBotContext";

export default function AuditInsightPanel() {
    const {
        ingestAuditSnapshot,
        deprecatedFiles,
        unusedFiles,
        activeModules,
        refactorCandidates,
        scanMeta,
        setScanMeta,
        setRefactorCandidates
    } = useAuditStore();

    const { speak } = useBrewBotContext();

    const summarizeByCategory = (arr) => {
        const counts = {};
        arr.forEach((item) => {
            const category = item.category || "Uncategorized";
            counts[category] = (counts[category] || 0) + 1;
        });
        return counts;
    };

    const triggerScan = async () => {
        const res = await fetch("/api/scan");
        const data = await res.json();

        if (!data.success) return alert("⚠️ Scan failed.");

        const snapshot = data.snapshot;

        ingestAuditSnapshot({
            deprecated: snapshot.deprecated_modules,
            unused: snapshot.unused_files,
            active: snapshot.active_modules,
            refactor: snapshot.refactor_candidates,
            meta: {
                triggeredBy: "BrewCommand",
                status: "completed",
                lastScan: new Date().toISOString()
            }
        });

        setRefactorCandidates(snapshot.refactor_candidates);
        setScanMeta({
            triggeredBy: "BrewCommand",
            status: "completed",
            lastScan: new Date().toISOString()
        });

        // 🧠 Narrate category-based summary
        const refactorCounts = summarizeByCategory(snapshot.refactor_candidates || []);
        const top = Object.entries(refactorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([cat, count]) => `${count} in ${cat}`)
            .join(", ");

        const voiceSummary = data.summary
            ? `${data.summary} Domain focus: ${top || "no category skew found"}.`
            : `Scan complete. ${top ? "Top domains: " + top : "No refactor targets tagged."}`;

        speak(voiceSummary);

        // 💾 Save snapshot to local history
        const history = JSON.parse(localStorage.getItem("brew_audit_history") || "[]");
        history.push({
            generated_at: new Date().toISOString(),
            ...snapshot,
            meta: { triggeredBy: "BrewCommand", status: "completed" }
        });
        localStorage.setItem("brew_audit_history", JSON.stringify(history));
    };

    return (
        <Card className="bg-[#1F1F1F] border border-yellow-500 p-4 space-y-3 text-white shadow-md">
            <h2 className="text-lg font-semibold text-yellow-300">🔍 Audit Insight</h2>
            <div className="text-sm space-y-1">
                <p>🟡 Deprecated Files: {deprecatedFiles.length}</p>
                <p>🪵 Unused Files: {unusedFiles.length}</p>
                <p>🔥 Active Modules: {activeMocomponents / devdules.length}</p>
                <p>🔧 Refactor Candidates: {refactorCandidates.length}</p>
                <p className="text-xs text-gray-400">
                    Last Scan: {scanMeta.lastScan ? new Date(scanMeta.lastScan).toLocaleString() : "—"}
                </p>
            </div>

            <div className="flex space-x-3 pt-2">
                <Button size="sm" onClick={triggerScan}>🔁 Rescan</Button>
                <Button size="sm" variant="outline" onClick={() => downloadSnapshot("json")}>📤 Export JSON</Button>
            </div>
        </Card>
    );
}