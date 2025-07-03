// @file: AuditVoiceOverlay.jsx
// @directory: /components/overlays
// @timestamp: 2025-07-01T12:08 EDT
// @summary: Narrates audit insights using real-time Zustand state
// @route: N/A — mounts over dashboard panels or scan pages

import React from 'react';
import useAuditStore from '@/stores/useAuditStore';

const AuditVoiceOverlay = () => {
    const { deprecatedFiles, unusedFiles, activeModules, scanMeta } = useAuditStore();

    const deprecatedCount = deprecatedFiles.length;
    const unusedCount = unusedFiles.length;
    const activeCount = activeModules.length;
    const lastScan = scanMeta.lastScan
        ? new Date(scanMeta.lastScan).toLocaleString()
        : 'No scan yet';

    const summary = `As of ${lastScan}, Brew found ${deprecatedCount} deprecated files, ${unusedCount} unused files, and ${activeCount} active modules.`;

    return (
        <div className="fixed bottom-4 right-4 max-w-sm bg-[#1F1F1F] border border-yellow-400 rounded-xl p-4 shadow-lg text-sm text-yellow-200 z-50">
            <p className="font-semibold text-yellow-300 mb-1">🧠 Audit Insight</p>
            <p className="text-yellow-100">{summary}</p>
        </div>
    );
};

export default AuditVoiceOverlay;