// =============================================
// 📁 File: /components/editor/RefactorOverlayHUD.jsx
// 🧠 Summary: Floating HUD that shows patch commentary, risk, and action controls
//
// ▸ Anchors to editor line via patch memory
// ▸ Narrates tone-aware intent when hovered
// ▸ Approve, reject, or delegate from inline context
//
// 🔁 Used in: BrewIDE editor core, via <EditorLineOverlay>
// ✨ Phase 5.2 — Patch Commentary Overlay Activation
// =============================================

import { useBrewBotContext } from "@/components/context/BrewBotContext";
import { usePatchQueue } from "@/hooks/usePatchQueue";
import { getCommentaryTone, tonePhrases } from "@/lib/commentaryMatrix";
import { useState } from "react";

export default function RefactorOverlayHUD({ patch }) {
    const { speak } = useBrewBotContext();
    const { updateStatus } = usePatchQueue();
    const [hovered, setHovered] = useState(false);

    if (!patch) return null;

    const { file, category, status, assignedTo, score, summary = "" } = patch;

    const tone = getCommentaryTone({ file, category, user: "RB", status });
    const phrase = tonePhrases[tone]?.[0] || "Suggested refactor opportunity";

    const handleSpeak = () => {
        speak(`${summary}. ${phrase}`);
    };

    const handleApprove = () => {
        updateStatus(file, "applied");
        speak(`Fix applied to ${file}.`);
    };

    const handleReject = () => {
        updateStatus(file, "rejected");
        speak(`Fix rejected in ${file}.`);
    };

    return (
        <div
            className={`absolute z-50 bg-[#1a1a1a] border border-yellow-600 text-yellow-100 text-xs rounded px-3 py-2 shadow-md max-w-xs transition-transform duration-200 ${hovered ? "scale-105" : "opacity-90"
                }`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                top: patch.y || 0,
                left: patch.x || 0
            }}
        >
            <div className="font-mono text-yellow-400 text-[11px] mb-1">{file}</div>
            <div className="italic text-yellow-200 mb-2">{phrase}</div>
            <div className="flex gap-2">
                <button
                    onClick={handleApprove}
                    className="bg-green-600 text-white rounded px-2 py-0.5 text-xs"
                >
                    ✅ Approve
                </button>
                <button
                    onClick={handleReject}
                    className="bg-red-700 text-white rounded px-2 py-0.5 text-xs"
                >
                    ❌ Reject
                </button>
                <button
                    onClick={handleSpeak}
                    className="bg-yellow-700 text-white rounded px-2 py-0.5 text-xs"
                >
                    🗣️ Hear
                </button>
            </div>
        </div>
    );
}