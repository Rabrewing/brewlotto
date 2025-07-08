// @file: BrewMergeUI.jsx
// @directory: /src/admin
// @timestamp: 2025-07-01T13:00 EDT
// @summary: Admin panel wired into live BrewAudit scan engine and Zustand store with scanMeta + history
// @route: http://localhost:3000/admin/brew-merge-ui

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import useAuditStore from '@/stores/useAuditStore'; // ✅ Runtime audit state
import { runAuditScan } from '@/lib/server/scanEngine';    // ✅ Live scanner engine

const BrewMergeUI = () => {
    const {
        ingestAuditSnapshot,
        deprecatedFiles,
        unusedFiles,
        activeModules,
        scanMeta,
        setScanMeta,
    } = useAuditStore();

    const refresh = () => {
        const snapshot = runAuditScan('src');

        // 1. Inject runtime state
        ingestAuditSnapshot({
            deprecated: snapshot.deprecated_modules,
            unused: snapshot.unused_files,
            active: snapshot.active_modules,
            meta: {
                triggeredBy: 'manual',
                status: 'completed',
                lastScan: new Date().toISOString(),
            },
        });

        // 2. Set scanMeta (for AuditVoiceOverlay, timeline, export)
        setScanMeta({
            triggeredBy: 'manual',
            status: 'completed',
            lastScan: new Date().toISOString(),
        });

        // 3. Push to local audit history
        const history = JSON.parse(localStorage.getItem('brew_audit_history') || '[]');
        history.push({
            generated_at: new Date().toISOString(),
            ...snapshot,
            meta: {
                triggeredBy: 'manual',
                status: 'completed',
            },
        });
        localStorage.setItem('brew_audit_history', JSON.stringify(history));
    };

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">🧠 BrewMerge Integration Panel</h1>

            <Card className="p-4 space-y-2">
                <p>🔍 <strong>Active Modules:</strong> {activeModules.length}</p>
                <p>🟡 <strong>Unused Files:</strong> {unusedFiles.length}</p>
                <p>❌ <strong>Deprecated:</strong> {deprecatedFiles.length}</p>
                <p className="text-sm text-gray-400">
                    🕓 Last Scan: <code>{scanMeta.lastScan?.slice(0, 19) || '—'}</code>
                </p>
            </Card>

            <div className="flex space-x-4">
                <Button onClick={refresh}>🔁 Refresh Audit</Button>
                <Link href="/admin/brew-audit-dashboard">
                    <Button variant="outline">📊 Open Audit Dashboard</Button>
                </Link>
            </div>
        </div>
    );
};

export default BrewMergeUI;