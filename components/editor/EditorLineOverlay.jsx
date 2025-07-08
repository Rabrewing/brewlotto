// =============================================
// 📁 File: /components/editor/EditorLineOverlay.jsx
// 🧠 Summary: Renders RefactorOverlayHUDs for each patch in current file
//
// ▸ Anchors overlays using mock vertical offset (lineNumber × lineHeight)
// ▸ Filters patch memory from usePatchQueue()
// ▸ Optionally accepts custom overlay renderer
//
// 🔁 Used in: BrewEditorPanel (above MonacoEditor, relative positioned)
// ✨ Phase 5.2.1 — Overlay Infrastructure
// =============================================

import { usePatchQueue } from "@/hooks/usePatchQueue";
import RefactorOverlayHUD from "./RefactorOverlayHUD";

export default function EditorLineOverlay({ fileName }) {
    const { queue = [] } = usePatchQueue();
    const activePatches = queue.filter((p) => p.file === fileName);

    const lineHeight = 22; // 🧪 Tune per font size / Monaco config

    return (
        <div className="absolute top-0 left-0 w-full z-40 pointer-events-none">
            {activePatches.map((patch, i) => {
                const line = patch.line || patch.lineNumber || i * 5 + 1;
                const y = line * lineHeight;

                return (
                    <div key={i} style={{ position: "absolute", top: y, left: "600px" }}>
                        <RefactorOverlayHUD patch={{ ...patch, y, x: 600 }} />
                    </div>
                );
            })}
        </div>
    );
}