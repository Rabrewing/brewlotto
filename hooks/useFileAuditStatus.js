// @file: useFileAuditStatus.js
// @directory: /hooks
// @timestamp: 2025-07-01T10:52 EDT
// @summary: Returns audit status for a given file using live Zustand store
// @route: N/A — used by MergeAuditTable and other file-level components

import useAuditStore from '@/stores/useAuditStore';

export function useFileAuditStatus(fileName) {
    if (!fileName) return 'unknown';

    const { deprecatedFiles, activeModules, unusedFiles } = useAuditStore.getState();

    const isDeprecated = deprecatedFiles.some(mod => mod.file === fileName);
    const isActive = activeModules.includes(fileName);
    const isUnused = unusedFiles.some(mod => mod.file === fileName);

    if (isDeprecated) return 'deprecated';
    if (isUnused) return 'unused';
    if (isActive) return 'active';
    return 'missing';
}