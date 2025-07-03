// components/tools/CodePruneVisualizer.jsx
// Description: Displays deprecated files with reasoning and actions
import React from 'react';

const deprecatedFiles = [
    {
        file: 'old/predictor-old.js',
        status: 'Deprecated',
        reason: 'Replaced by new Poisson and Markov logic integration',
    },
    {
        file: 'archive/strategy-legacy.js',
        status: 'Deprecated',
        reason: 'Legacy strategy logic, no longer used in current refactor',
    },
];

export default function CodePruneVisualizer() {
    return (
        <div className="bg-[#1C1C1C] text-white p-6 rounded-xl shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Deprecated Files</h2>
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-[#333]">
                    <thead>
                        <tr className="bg-[#232323] text-left">
                            <th className="p-3 border border-[#333]">File</th>
                            <th className="p-3 border border-[#333]">Status</th>
                            <th className="p-3 border border-[#333]">Reason</th>
                            <th className="p-3 border border-[#333]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deprecatedFiles.map((item, idx) => (
                            <tr key={idx} className="hover:bg-[#2a2a2a]">
                                <td className="p-3 border border-[#333] font-mono">{item.file}</td>
                                <td className="p-3 border border-[#333] text-red-400">{item.status}</td>
                                <td className="p-3 border border-[#333] text-sm">{item.reason}</td>
                                <td className="p-3 border border-[#333] space-x-2">
                                    <button className="px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-500 text-sm">Mark Reviewed</button>
                                    <button className="px-2 py-1 bg-red-700 text-white rounded hover:bg-red-600 text-sm">Archive</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
