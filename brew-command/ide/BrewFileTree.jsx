// @brew-command/ide/BrewFileTree.jsx
// Summary: Simple file navigator to simulate project context for Brew AI Dev Assistant

import { useState } from "react";

const mockFiles = [
    "/lib/brewCommand/runStrategyEngine.js",
    "/lib/brewVision/analyzeWinRates.js",
    "/lib/brewVision/scanEntropyAnomalies.js",
    "/lib/brewAdmin/uploadProcessor.js",
    "/lib/ai/useBrewAI.js",
    "/components/predict/PredictionResultPanel.jsx",
    "/components/ui/BrewCommentaryEngine.jsx",
];

export default function BrewFileTree({ onSelect }) {
    const [active, setActive] = useState(null);

    const handleSelect = (file) => {
        setActive(file);
        onSelect?.(file);
    };

    return (
        <div className="bg-neutral-900 border border-yellow-600 p-3 rounded w-full sm:w-72">
            <h3 className="text-yellow-400 font-semibold mb-2">📂 Project Files</h3>
            <ul className="space-y-1 text-sm text-neutral-200">
                {mockFiles.map((file) => (
                    <li
                        key={file}
                        onClick={() => handleSelect(file)}
                        className={`cursor-pointer px-2 py-1 rounded hover:bg-neutral-800 ${active === file ? "bg-yellow-700 text-black font-semibold" : ""
                            }`}
                    >
                        {file.replace("/lib/", "").replace("/components/", "")}
                    </li>
                ))}
            </ul>
        </div>
    );
}