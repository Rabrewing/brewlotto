// @file: BrewAuditHistory.jsx
// @directory: /admin
// @timestamp: 2025-07-01T12:28 EDT
// @summary: Lists previous audit snapshots with scan metadata and delta summaries
// @route: http://localhost:3000/admin/audit-history-timeline

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function BrewAuditHistory() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('brew_audit_history') || '[]');
        setHistory(stored.reverse()); // Newest first
    }, []);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-white">📜 Audit History Timeline</h1>
            {history.length === 0 && (
                <p className="text-gray-400">No previous audit snapshots found.</p>
            )}

            {history.map((entry, idx) => (
                <Card key={idx} className="space-y-2">
                    <h2 className="text-lg font-semibold text-yellow-300">
                        Scan #{history.length - idx} — {new Date(entry.generated_at).toLocaleString()}
                    </h2>
                    <div className="flex space-x-4 text-sm">
                        <Badge text={`${entry.deprecated_modules.length} Deprecated`} type="deprecated" />
                        <Badge text={`${entry.unused_files.length} Unused`} type="unused" />
                        <Badge text={`${entry.active_modules.length} Active`} type="active" />
                    </div>
                    <p className="text-xs text-gray-500">
                        Triggered by: {entry.meta?.triggeredBy || 'unknown'} | Status: {entry.meta?.status || '—'}
                    </p>
                </Card>
            ))}
        </div>
    );
}