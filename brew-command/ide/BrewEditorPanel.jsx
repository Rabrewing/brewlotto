// @brew-command/ide/BrewEditorPanel.jsx
// Summary: Monaco editor panel with contextual awareness and AI-ready hooks

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamically import Monaco to prevent SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function BrewEditorPanel({ fileName = "runStrategyEngine.js", initialCode = "", onChange = () => { } }) {
    const [code, setCode] = useState(initialCode);

    useEffect(() => {
        setCode(initialCode); // reset editor if file changes
    }, [initialCode]);

    const handleChange = (value) => {
        setCode(value);
        onChange(value, fileName);
    };

    return (
        <div className="flex flex-col bg-neutral-900 border border-yellow-600 rounded overflow-hidden">
            <div className="bg-yellow-400 text-black px-4 py-2 text-sm font-semibold">
                ✏️ Editing: {fileName}
            </div>
            <MonacoEditor
                height="400px"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={code}
                onChange={handleChange}
                options={{
                    fontSize: 14,
                    fontFamily: "Fira Code, monospace",
                    minimap: { enabled: false },
                    wordWrap: "on",
                }}
            />
        </div>
    );
}