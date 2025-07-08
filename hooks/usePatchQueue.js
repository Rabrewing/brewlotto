// =============================================
// 📁 File: /hooks/usePatchQueue.js
// 🧠 Summary: Centralized patch queue manager with sync + delegation metadata
//
// ▸ Stores all fix suggestions: status, assignee, approval chain
// ▸ Writes through to localStorage for session resumption
// ▸ Can seed from writeLedgerEntry() or FixSuggestionPanel
//
// 🔁 Used in: PatchQueuePanel, StatsPanel, ProvenanceOverlay
// ✨ Added: Phase 4.24 — Persistent Patch Intelligence
// =============================================

import { useEffect, useState } from "react";

const STORAGE_KEY = "brew_patch_queue";

export function usePatchQueue() {
    const [queue, setQueue] = useState([]);

    // 🧠 Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setQueue(JSON.parse(saved));
    }, []);

    // 💾 Sync on update
    useEffect(() => {
        if (queue.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
        }
    }, [queue]);

    const addFix = (fix) => {
        const exists = queue.some((f) => f.file === fix.file && f.summary === fix.summary);
        if (!exists) {
            setQueue((prev) => [...prev, { ...fix, status: fix.status || "pending" }]);
        }
    };

    const updateStatus = (file, status) => {
        setQueue((prev) =>
            prev.map((f) => (f.file === file ? { ...f, status } : f))
        );
    };

    const assign = (file, assignedTo, team = null) => {
        setQueue((prev) =>
            prev.map((f) =>
                f.file === file
                    ? { ...f, assignedTo, team, status: "delegated" }
                    : f
            )
        );
    };

    return {
        queue,
        addFix,
        updateStatus,
        assign
    };
}