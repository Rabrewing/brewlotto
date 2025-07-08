// @components/dev/BrewFileUploader.jsx
// Summary: Local file upload → Brew context injector

import { useState } from "react";

export default function BrewFileUploader({ onFileRead }) {
    const [fileName, setFileName] = useState(null);
    const [error, setError] = useState(null);

    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();

        reader.onload = (e) => {
            const fileContent = e.target.result;
            onFileRead?.({ name: file.name, content: fileContent });
        };

        reader.onerror = () => {
            setError("Error reading file. Try again or choose a different one.");
        };

        reader.readAsText(file);
    };

    return (
        <div className="border border-yellow-600 p-4 rounded bg-neutral-900 text-sm text-white">
            <h4 className="font-semibold text-yellow-400 mb-2">📁 Upload Local File</h4>
            <input type="file" accept=".js,.ts,.jsx,.json" onChange={handleFileUpload} className="text-white mb-2" />
            {fileName && <p className="text-green-400">Loaded: {fileName}</p>}
            {error && <p className="text-red-400">{error}</p>}
        </div>
    );
}