// ✅ BrewAuditDashboard.jsx
// Purpose: Visual UI to review CODE_PRUNE_AUDIT.json with color-coded module audit states

import React, { useEffect, useState } from 'react';
import useFileAuditStatus from '@/hooks/useFileAuditStatus';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const statusColor = {
    active: 'bg-green-600 text-white',
    deprecated: 'bg-red-600 text-white',
    unused: 'bg-yellow-500 text-black'
};

const BrewAuditDashboard = () => {
    const { auditData, loading, error } = useFileAuditStatus();

    if (loading) return <div className="p-4">Loading audit...</div>;
    if (error) return <div className="p-4 text-red-500">Error loading audit.</div>;

    const renderFiles = (files, status) => (
        files.map((file, idx) => (
            <Card key={`${status}-${idx}`} className="mb-2">
                <CardContent className="flex justify-between items-center">
                    <div>
                        <p className="font-mono text-sm">{typeof file === 'string' ? file : file.file}</p>
                        {file.reason && <p className="text-xs text-muted-foreground">{file.reason}</p>}
                    </div>
                    <Badge className={statusColor[status]}>{status.toUpperCase()}</Badge>
                </CardContent>
            </Card>
        ))
    );

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-xl font-bold mb-4">📊 BrewMerge Audit Dashboard</h1>

            <section className="mb-6">
                <h2 className="font-semibold mb-2">✅ Active Modules</h2>
                {renderFiles(auditData.active_modules || [], 'active')}
            </section>

            <section className="mb-6">
                <h2 className="font-semibold mb-2">❌ Deprecated Modules</h2>
                {renderFiles(auditData.deprecated_modules || [], 'deprecated')}
            </section>

            <section>
                <h2 className="font-semibold mb-2">🟡 Unused Files</h2>
                {renderFiles(auditData.unused_files || [], 'unused')}
            </section>
        </div>
    );
};

export default BrewAuditDashboard;
