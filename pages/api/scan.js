// =============================================
// 📁 File: /pages/api/scan.js
// 🧠 Summary: Server-side wrapper for runAuditScan w/ Brew commentary output
//
// ▸ Triggers source audit scan, returns file metadata + refactor stats
// ▸ Activates narration trigger if refactor count > threshold
// ▸ Used by AuditInsightPanel, FixFeed HUD, BrewBotContext
//
// 🔁 Used in: IDE route (/dev/ide), DevBot chat, post-upload audits
// 🔗 Dependencies: runAuditScan(), summarizeUtils
// ✨ Added: Phase 4.22 — Scan Commentary + Refactor Hook
// =============================================

import { runAuditScan } from "@/lib/server/scanEngine";

export default function handler(req, res) {
    try {
        const { dir = "src" } = req.query;
        const scan = runAuditScan(dir);

        const flagged = scan.refactor_candidates.length;
        const deprecated = scan.deprecated_modules.length;
        const unused = scan.unused_files.length;

        const summary = `🧠 Scan complete. ${flagged} refactor candidates, ${deprecated} deprecated, ${unused} unused.`;

        return res.status(200).json({
            success: true,
            summary,
            metrics: {
                refactor: flagged,
                deprecated,
                unused
            },
            snapshot: scan
        });
    } catch (e) {
        return res.status(500).json({ error: "Scan failed", details: e.message });
    }
}