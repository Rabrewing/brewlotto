// @pages/dev/ide.jsx
// Summary: Brew AI Developer Console — IDE view with file context, editor, and Copilot-style assistant

import Head from "next/head";
import { useState } from "react";
import BrewFileTree from "@/brew-command/ide/BrewFileTree";
import BrewEditorPanel from "@/brew-command/ide/BrewEditorPanel";
import BrewDevChat from "@/components/dev/BrewDevChat";
import BrewFileUploader from "@/components/dev/BrewFileUploader"; // if you’ve wired this in already

export default function BrewIDE() {
    const [activeFile, setActiveFile] = useState("/lib/brewCommand/runStrategyEngine.js");
    const [fileCode, setFileCode] = useState("// 🧠 Welcome to Brew AI IDE\n\nfunction runStrategyEngine() {\n  // Strategy logic goes here\n}");

    const handleFileSelect = (file) => {
        setActiveFile(file);
        setFileCode(`// 🧠 Editing: ${file}\n\nfunction placeholder() {\n  return 'Replace this with real code';\n}`);
    };

    const handleFileUpload = ({ name, content }) => {
        setActiveFile(name.includes("/") ? name : `/upload/${name}`);
        setFileCode(content);
    };

    return (
        <>
            <Head>
                <title>Brew AI IDE Console</title>
            </Head>
            <div className="min-h-screen bg-black text-white p-6 space-y-4">
                <h1 className="text-2xl font-bold text-yellow-400">🧠 Brew AI Dev Console</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Left Pane: File Tree + Uploader */}
                    <div className="md:col-span-1 space-y-4">
                        <BrewFileTree onSelect={handleFileSelect} />
                        <BrewFileUploader onFileRead={handleFileUpload} />
                    </div>

                    {/* Center Pane: Editor + Brew Chat */}
                    <div className="md:col-span-2 space-y-4">
                        <BrewEditorPanel
                            fileName={activeFile.split("/").pop()}
                            initialCode={fileCode}
                            onChange={(newCode) => setFileCode(newCode)}
                        />

                        <BrewDevChat
                            context={{
                                name: activeFile,
                                content: fileCode,
                                isLocalUpload: activeFile.includes("/upload/")
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}