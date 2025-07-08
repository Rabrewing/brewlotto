// =============================================
// 📁 File: /components/dev/PatchQueuePanel.jsx
// 🧠 Summary: Displays queue of Brew AI fix suggestions with status + triage control
//
// ▸ Lists pending, applied, and delegated patches
// ▸ Displays file, summary, status, and time since generated
// ▸ Hooks into voice narration with “Read Summary” toggle
//
// 🔁 Used in: BrewIDE.jsx, Dashboard overlay
// 🔗 Dependencies: usePatchQueue(), useBrewBotContext
// ✨ Added: Phase 4.23 — Fix Lifecycle Visibility
// =============================================

import { useEffect, useState } from "react";
import { usePatchQueue } from "@/hooks/usePatchQueue";
import { useBrewBotContext } from "@/components/context/BrewBotContext";

export default function PatchQueuePanel() {
    const { queue = [] } = usePatchQueue();
    const { speak } = useBrewBotContext();
    const [selected, setSelected] = useState(null);

    if (!queue.length) return null;

    return (
        <div className="bg-[#121212] border border-yellow-800 text-yellow-200 p-4 rounded-md shadow space-y-3">
            <h2 className="text-xl font-bold text-yellow-300">🧠 Patch Queue</h2>

            <ul className="space-y-2 text-sm">
                {queue.map((fix, i) => (
                    <li
                        key={i}
                        className={`p-3 rounded border border-yellow-700 bg-[#181818] ${selected === i ? "ring-2 ring-yellow-400" : ""
                            }`}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-mono text-xs text-yellow-400">
                                📁 {fix.file}
                            </span>
                            <span className="text-xs text-gray-400">
                                {new Date(fix.generatedAt || fix.timestamp).toLocaleTimeString()}
                            </span>
                        </div>

                        <div className="mt-1 text-yellow-100">{fix.summary || "No summary provided."}</div>

                        <div className="flex gap-2 mt-2">
                            <button
                                className="text-xs px-2 py-1 bg-green-700 rounded hover:bg-green-800"
                                onClick={() => speak(fix.summary)}
                            >
                                🗣️ Read Summary
                            </button>
                            <button
                                className="text-xs px-2 py-1 bg-yellow-700 rounded hover:bg-yellow-800"
                                onClick={() => setSelected(i)}
                            >
                                🔍 Expand
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}