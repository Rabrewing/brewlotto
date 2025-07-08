// @file: BrewUtils.js
// @summary: Combines className helper and audit export functions

import useAuditStore from '@/stores/useAuditStore';

// 🌈 Tailwind class combiner
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

// 📦 BrewAudit snapshot generator
export function generateAuditSnapshot() {
    const { deprecatedFiles, unusedFiles, activeModules, scanMeta } = useAuditStore.getState();

    return {
        generated_at: new Date().toISOString(),
        meta: scanMeta,
        deprecated_modules: deprecatedFiles,
        unused_files: unusedFiles,
        active_modules: activeModules,
    };
}

// 📁 Trigger browser-side export
export function downloadSnapshot(format = 'json') {
    const snapshot = generateAuditSnapshot();

    let content = '';
    let mime = '';
    let fileExt = '';

    if (format === 'json') {
        content = JSON.stringify(snapshot, null, 2);
        mime = 'application/json';
        fileExt = 'json';
    } else if (format === 'csv') {
        const flatten = (rows, status) =>
            rows.map((item) => `${item.file},${status},${item.reason || 'N/A'}`).join('\n');

        content = 'File,Status,Reason\n' +
            flatten(snapshot.deprecated_modules, 'Deprecated') + '\n' +
            flatten(snapshot.unused_files, 'Unused');
        mime = 'text/csv';
        fileExt = 'csv';
    } else {
        console.error('Unsupported export format');
        return;
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BrewAudit_${Date.now()}.${fileExt}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}