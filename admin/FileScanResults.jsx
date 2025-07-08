// @file: FileScanResults.jsx
// @directory: /admin
// @timestamp: 2025-07-01T11:04 EDT
// @summary: Displays all scanned files grouped by directory with audit status tags
// @route: http://localhost:3000/admin/file-scan-results

import React from 'react';
import useAuditStore from '@/stores/useAuditStore';
import { useFileAuditStatus } from '@/hooks/useFileAuditStatus';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'; // Optional if Badge is modularized

const groupByDirectory = (files) => {
    return files.reduce((acc, filePath) => {
        const dir = filePath.split('/').slice(0, -1).join('/') || 'root';
        if (!acc[dir]) acc[dir] = [];
        acc[dir].push(filePath);
        return acc;
    }, {});
};

export default function FileScanResults() {
    const { activeModules, deprecatedFiles, unusedFiles } = useAuditStore();

    const deprecated = deprecatedFiles.map((f) => f.file);
    const unused = unusedFiles.map((f) => f.file);
    const all = [...activeModules, ...deprecated, ...unused];
    const grouped = groupByDirectory(all);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-white">📂 File Scan Results</h1>
            {Object.entries(grouped).map(([dir, files], i) => (
                <Card key={i} className="space-y-2">
                    <h2 className="text-lg font-semibold text-yellow-400">{dir}/</h2>
                    <ul className="space-y-1">
                        {files.map((file, j) => {
                            const status = useFileAuditStatus(file);
                            const color =
                                status === 'deprecated'
                                    ? 'bg-red-600'
                                    : status === 'unused'
                                        ? 'bg-yellow-500'
                                        : status === 'active'
                                            ? 'bg-green-500'
                                            : 'bg-gray-600';
                            return (
                                <li key={j} className="flex items-center justify-between">
                                    <span className="font-mono text-sm text-yellow-300 break-words">{file}</span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold text-white ${color}`}>
                                        {status.toUpperCase()}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </Card>
            ))}
        </div>
    );
}