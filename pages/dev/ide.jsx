// @file: ide.jsx
// @directory: /pages/dev
// @summary: Brew AI Developer Console — IDE view with file context, scan intelligence, and Dev AI assistant

import Head from "next/head";
import { useState } from "react";
import BrewFileTree from "@/brew-command/ide/BrewFileTree";
import BrewEditorPanel from "@/brew-command/ide/BrewEditorPanel";
import BrewDevChat from "@/components/dev/BrewDevChat";
import BrewFileUploader from "@/components/dev/BrewFileUploader";
import AuditInsightPanel from "@/brew-command/ide/AuditInsightPanel";

export default function BrewIDE() {
    const [activeFile, setActiveFile] = useState(null);
    const [fileCode, setFileCode] = useState("");

    const handleFileSelect = (file) => {
        setActiveFile(file);
        setFileCode(`// 🧠 Editing: ${file}\n\nfunction placeholder() {\n  return 'Start coding!';\n}`);
    };

    const handleFileUpload = ({ name, content }) => {
        setActiveFile(name.includes("/") ? name : `/upload/${name}`);
        setFileCode(content);
    };

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

                    {/* 💻 Right: Editor, Audit HUD, DevBot */}
                    <div className="md:col-span-2 flex flex-col space-y-4 relative">
                        <BrewEditorPanel
                            fileName={activeFile ? activeFile.split("/").pop() : "No file selected"}
                            initialCode={fileCode}
                            onChange={(newCode) => setFileCode(newCode)}
                        />

                        <AuditInsightPanel />

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