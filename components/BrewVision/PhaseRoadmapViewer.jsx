// @module: PhaseRoadmapViewer.jsx
// @created: 2025-06-25 05:08 EDT
// @description: Renders roadmap.json with collapsible sections, status icons, and CSV export button for BrewVision dashboard.

import React, { useState } from 'react';
import { saveAs } from 'file-saver'; // For CSV download

const statusColors = {
    complete: 'bg-green-600',
    active: 'bg-yellow-500',
    planned: 'bg-gray-500',
    blocked: 'bg-red-600',
    pending: 'bg-orange-500'
};

// 🧮 Simple CSV exporter from roadmap JSON
const exportToCSV = (roadmap) => {
    const rows = [['Phase', 'Category', 'Priority', 'Task', 'Status', 'Created At']];
    roadmap.forEach(({ phase, category, priority, created_at, tasks }) => {
        tasks.forEach((t) => {
            rows.push([phase, category, priority, t.task, t.status, t.timestamp || created_at]);
        });
    });

    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `brewvision_roadmap_export_${Date.now()}.csv`);
};

const PhaseRoadmapViewer = ({ data }) => {
    const [expanded, setExpanded] = useState({});

    // ⏷ Toggle phase visibility
    const toggle = (phase) => {
        setExpanded(prev => ({ ...prev, [phase]: !prev[phase] }));
    };

    return (
        <div className="p-4 bg-slate-800 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-semibold">📅 Phase Roadmap</h2>
                <button
                    onClick={() => exportToCSV(data)}
                    className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-500 text-sm"
                >
                    ⬇️ Export CSV
                </button>
            </div>

            {data.map((phaseBlock, index) => (
                <div key={index} className="mb-4">
                    <button
                        onClick={() => toggle(phaseBlock.phase)}
                        className="w-full text-left text-lg font-medium bg-slate-700 p-2 rounded-md hover:bg-slate-600"
                    >
                        <div className="flex justify-between items-center">
                            <span>{phaseBlock.phase}</span>
                            <span className={`px-2 py-1 text-xs rounded ${statusColors[phaseBlock.status]}`}>
                                {phaseBlock.status}
                            </span>
                        </div>
                        <div className="text-sm text-gray-300 mt-1">
                            🗂 {phaseBlock.category} · ⏳ {phaseBlock.created_at} · {phaseBlock.priority}
                        </div>
                    </button>

                    {expanded[phaseBlock.phase] && (
                        <ul className="pl-4 mt-2 space-y-1">
                            {phaseBlock.tasks.map((t, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <span className="mt-1">•</span>
                                    <div>
                                        <span>{t.task}</span>
                                        <div className="text-xs text-gray-400 ml-2 inline">
                                            [{t.status}] {t.timestamp ? `— ${t.timestamp}` : ''}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
};

export default PhaseRoadmapViewer;