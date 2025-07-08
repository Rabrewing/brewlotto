// File: components/admin/CodePruneVisualizer.jsx
// Created: 2025-06-30
// Purpose: Visual summary of deprecated files from CODE_PRUNE_AUDIT.json

import React, { useEffect, useState } from "react";
import { AlertCircle, Trash2 } from "lucide-react";
import pruneData from "@/data/CODE_PRUNE_AUDIT.json"; // Update this path if needed

const CodePruneVisualizer = () => {
    const [deprecatedFiles, setDeprecatedFiles] = useState([]);

    useEffect(() => {
        // Simulate fetch from audit source
        setDeprecatedFiles(pruneData.deprecated || []);
    }, []);

    return (
        <div className="p-6 text-white">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Trash2 className="text-red-400" />
                Code Prune Visualizer
            </h1>

            <div className="bg-[#1C1C1C] p-4 rounded-xl shadow-inner border border-[#FFD700]/30">
                <table className="w-full table-auto text-sm">
                    <thead className="text-[#FFD700] border-b border-[#FFD700]/40">
                        <tr>
                            <th className="text-left py-2 px-4">File</th>
                            <th className="text-left py-2 px-4">Status</th>
                            <th className="text-left py-2 px-4">Reason</th>
                            <th className="text-left py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deprecatedFiles.map((file, i) => (
                            <tr key={i} className="hover:bg-[#232323] border-b border-[#FFD700]/10">
                                <td className="py-2 px-4">{file.name}</td>
                                <td className="py-2 px-4 text-red-400">{file.status}</td>
                                <td className="py-2 px-4">{file.reason}</td>
                                <td className="py-2 px-4 space-x-2">
                                    <button className="px-3 py-1 bg-green-700 rounded text-white">Review</button>
                                    <button className="px-3 py-1 bg-red-600 rounded text-white">Archive</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {deprecatedFiles.length === 0 && (
                <div className="mt-6 text-sm flex items-center gap-2 text-red-300">
                    <AlertCircle size={16} /> No deprecated files found in CODE_PRUNE_AUDIT.json.
                </div>
            )}
        </div>
    );
};

export default CodePruneVisualizer;
