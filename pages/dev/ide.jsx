// =============================================
// 📁 File: /pages/dev/ide.jsx
// 🧠 Summary: Brew AI Developer IDE — cockpit with source intelligence + fix suggestion AI
//
// ▸ Hosts FileTree, DevChat, Editor, and Audit HUD in a modular grid
// ▸ Scans active file content and fetches patch suggestions via Brew Fix Engine
// ▸ Integrates with AuditInsightPanel and FixSuggestionPanel for visual & voice commentary
// ▸ Narrates commentary via BrewBotContext.speak() based on file activity
//
// 🔁 Used in: DevTools route (/dev/ide)
// 🔗 Dependencies: useFixSuggestion, AuditInsightPanel, BrewBotContext
// ✨ Enhanced: Phase 5.2 — RefactorOverlayHUD + Inline Patch Narration
// =============================================

import Head from "next/head";
import { useState, useEffect } from "react";
import BrewFileTree from "@/brew-command/ide/BrewFileTree";
import BrewEditorPanel from "@/brew-command/ide/BrewEditorPanel";
import BrewDevChat from "@/components/dev/BrewDevChat";
import BrewFileUploader from "@/components/dev/BrewFileUploader";
import AuditInsightPanel from "@/brew-command/ide/AuditInsightPanel";
import FixSuggestionPanel from "@/components/dev/FixSuggestionPanel";
import RefactorOverlayHUD from "@/components/editor/RefactorOverlayHUD"; // 🆕 ADDED
import useFixSuggestion from "@/hooks/useFixSuggestion";

export default function BrewIDE() {
    const [activeFile, setActiveFile] = useState(null);
    const [fileCode, setFileCode] = useState("");

    const { fix, fetchFix, loading } = useFixSuggestion();

    const handleFileSelect = (file) => {
        setActiveFile(file);
        setFileCode(`// 🧠 Editing: ${file}\n\nfunction placeholder() {\n  return 'Start coding!';\n}`);
    };

    const handleFileUpload = ({ name, content }) => {
        const safePath = name.includes("/") ? name : `/upload/${name}`;
        setActiveFile(safePath);
        setFileCode(content);
    };

    useEffect(() => {
        if (activeFile && fileCode) {
            fetchFix({ path: activeFile, code: fileCode });
        }
    }, [activeFile]);

    return (
        <>
            <Head>
                <title>BrewCommand IDE • Strategy Console</title>
            </Head>

            <div className="min-h-screen bg-black text-white p-4 md:p-6 space-y-4">
                <h1 className="text-2xl font-bold text-yellow-400">🧠 BrewCommand IDE</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 📁 Left: FileTree + Upload */}
                    <div className="md:col-span-1 space-y-4">
                        <BrewFileTree onSelect={handleFileSelect} />
                        <BrewFileUploader onFileRead={handleFileUpload} />
                    </div>

                    {/* 💻 Right: Editor, Audit HUD, Fix Panel, DevBot */}
                    <div className="md:col-span-2 flex flex-col space-y-4 relative">
                        <BrewEditorPanel
                            fileName={activeFile ? activeFile.split("/").pop() : "No file selected"}
                            initialCode={fileCode}
                            onChange={(newCode) => setFileCode(newCode)}
                        />

                        <AuditInsightPanel />

                        {fix && (
                            <>
                                <FixSuggestionPanel fix={fix} onApply={(newCode) => setFileCode(newCode)} />
                                <RefactorOverlayHUD
                                    patch={{
                                        ...fix,
                                        file: activeFile,
                                        x: 620, // Placeholder positioning; to be dynamically computed
                                        y: 240
                                    }}
                                />
                            </>
                        )}

                        {/* 🧍 BrewBot — Docked bottom-left */}
                        <div className="absolute bottom-0 left-0 w-full md:w-auto">
                            <BrewDevChat
                                context={{
                                    name: activeFile,
                                    content: fileCode,
                                    isLocalUpload: activeFile?.includes("/upload/")
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}