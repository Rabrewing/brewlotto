import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import useFileAuditStatus from '@/hooks/useFileAuditStatus';

const BrewMergeUI = () => {
    const { auditData, loading, error, refresh } = useFileAuditStatus();

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">🧠 BrewMerge Integration Panel</h1>
            {loading && <p>Loading audit summary...</p>}
            {error && <p className="text-red-500">Error loading audit data</p>}

            {!loading && auditData && (
                <Card className="p-4 space-y-2">
                    <p>🔍 <strong>Active Modules:</strong> {auditData.active_modules.length}</p>
                    <p>🟡 <strong>Unused Files:</strong> {auditData.unused_files.length}</p>
                    <p>❌ <strong>Deprecated:</strong> {auditData.deprecated_modules.length}</p>
                </Card>
            )}

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
