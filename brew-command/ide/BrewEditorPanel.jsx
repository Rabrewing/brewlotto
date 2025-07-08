// =============================================
// 📁 File: /brew-command/ide/BrewEditorPanel.jsx
// 🧠 Summary: Monaco editor with summary banner, entropy markers, save-to-disk,
//             and inline commentary overlay (RefactorOverlayHUD)
// =============================================

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import useAuditStore from "@/stores/useAuditStore";
import RefactorOverlayHUD from "@/components/editor/RefactorOverlayHUD";
import EditorLineOverlay from "@/components/editor/EditorLineOverlay"; // 🆕 overlay anchor layer

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function BrewEditorPanel({ onChange = () => { }, patchOverlay = null }) {
    const filePath = useAuditStore((s) => s.currentFile);
    const fileSummaries = useAuditStore((s) => s.fileSummaries);
    const [code, setCode] = useState("");
    const [fileName, setFileName] = useState("");
    const [summary, setSummary] = useState("");
    const editorRef = useRef(null);
    const [decorations, setDecorations] = useState([]);

    useEffect(() => {
        if (!filePath) return;
        setFileName(filePath.split("/").pop());
        setSummary(fileSummaries[filePath] || "");

        fetch(`/api/load-file?path=${filePath}`)
            .then((res) => (res.ok ? res.text() : "// File not found"))
            .then(setCode);
    }, [filePath, fileSummaries]);

    const handleChange = (value) => {
        setCode(value);
        onChange(value, fileName);
    };

    const handleEditorMount = (editor, monaco) => {
        editorRef.current = editor;
        highlightEntropy(editor, monaco);
    };

    const highlightEntropy = (editor, monaco) => {
        const lines = editor.getModel().getLinesContent();
        const risky = [];

        lines.forEach((line, i) => {
            const nesting = (line.match(/[\{\(]/g) || []).length;
            if (line.length > 100 || nesting >= 3) {
                risky.push({
                    range: new monaco.Range(i + 1, 1, i + 1, 1),
                    options: {
                        isWholeLine: true,
                        className: "bg-red-900/30",
                        glyphMarginClassName: "text-red-400",
                        hoverMessage: { value: "**High entropy line**" }
                    }
                });
            }
        });

        const newDecorations = editor.deltaDecorations([], risky);
        setDecorations(newDecorations);
    };

    const handleSave = async () => {
        if (!filePath) return;
        await fetch("/api/save-file", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: filePath, content: code })
        });
        alert(`✅ Saved ${fileName}`);
    };

    return (
        <div className="relative flex flex-col bg-neutral-900 border border-yellow-600 rounded overflow-hidden">
            <div className="bg-yellow-400 text-black px-4 py-2 text-sm font-semibold flex justify-between items-center">
                <span>✏️ Editing: {fileName || "No file selected"}</span>
                <button
                    onClick={handleSave}
                    className="bg-black text-yellow-300 px-3 py-1 rounded text-xs hover:bg-yellow-700 hover:text-black"
                >
                    💾 Save
                </button>
            </div>

            {summary && (
                <div className="bg-yellow-100 text-black px-4 py-2 text-xs italic border-b border-yellow-400">
                    📘 Summary: {summary}
                </div>
            )}

            <div className="relative">
                <MonacoEditor
                    height="400px"
                    defaultLanguage="javascript"
                    theme="vs-dark"
                    value={code}
                    onChange={handleChange}
                    onMount={handleEditorMount}
                    options={{
                        fontSize: 14,
                        fontFamily: "Fira Code, monospace",
                        minimap: { enabled: false },
                        wordWrap: "on",
                        glyphMargin: true
                    }}
                />

                {/* 🧠 Patch Commentary Overlays */}
                <EditorLineOverlay fileName={fileName} />

                {/* Optional single HUD injected from parent */}
                {patchOverlay && (
                    <RefactorOverlayHUD patch={{ ...patchOverlay, x: 580, y: 160 }} />
                )}
            </div>
        </div>
    );
}