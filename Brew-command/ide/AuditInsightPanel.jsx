// @file: AuditInsightPanel.jsx
// @directory: /brew-command/ide
// @summary: Visual summary of scan stats + export + manual trigger
// @route: Local insert into BrewCommand IDE

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuditStore } from '@/stores/useAuditStore';
import { runAuditScan } from '@/lib/scanEngine';
import { downloadSnapshot } from '@/lib/AuditExportUtils';

export default function AuditInsightPanel() {
    const {
        ingestAuditSnapshot,
        deprecatedFiles,
        unusedFiles,
        activeModules,
        scanMeta,
        setScanMeta,
    } = useAuditStore();

    const triggerScan = () => {
        const snapshot = runAuditScan('src');
        ingestAuditSnapshot({
            deprecated: snapshot.deprecated_modules,
            unused: snapshot.unused_files,
            active: snapshot.active_modules,
            meta: {
                triggeredBy: 'BrewCommand',
                status: 'completed',
                lastScan: new Date().toISOString(),
            },
        });
        setScanMeta({
            triggeredBy: 'BrewCommand',
            status: 'completed',
            lastScan: new Date().toISOString(),
        });

        // Add to timeline
        const history = JSON.parse(localStorage.getItem('brew_audit_history') || '[]');
        history.push({
            generated_at: new Date().toISOString(),
            ...snapshot,
            meta: { triggeredBy: 'BrewCommand', status: 'completed' },
        });
        localStorage.setItem('brew_audit_history', JSON.stringify(history));
    };

    return (
        <Card className="bg-[#1F1F1F] border border-yellow-500 p-4 space-y-3 text-white shadow-md">
            <h2 className="text-lg font-semibold text-yellow-300">🔍 Audit Insight</h2>
            <div className="text-sm space-y-1">
                <p>🟡 Deprecated Files: {deprecatedFiles.length}</p>
                <p>🪵 Unused Files: {unusedFiles.length}</p>
                <p>🔥 Active Modules: {activeModules.length}</p>
                <p className="text-xs text-gray-400">
                    Last Scan: {scanMeta.lastScan ? new Date(scanMeta.lastScan).toLocaleString() : '—'}
                </p>
            </div>

            <div className="flex space-x-3 pt-2">
                <Button size="sm" onClick={triggerScan}>🔁 Rescan</Button>
                <Button size="sm" variant="outline" onClick={() => downloadSnapshot('json')}>📤 Export JSON</Button>
            </div>
        </Card>
    );
}