// @file: useAuditStore.js
// @directory: /stores
// @timestamp: 2025-07-01T09:56 EDT
// @summary: Central Zustand store for BrewAudit runtime state and ingestion routines
// @route: N/A — used across admin dashboard modules

import { create } from 'zustand';

const useAuditStore = create((set) => ({
    deprecatedFiles: [],
    unusedFiles: [],
    activeModules: [],
    scanMeta: {
        lastScan: null,
        triggeredBy: 'system',
        status: 'idle',
    },

    // 🧠 Triggered by scanEngine.js after ingestion
    ingestAuditSnapshot: ({ deprecated = [], unused = [], active = [], meta = {} }) =>
        set(() => ({
            deprecatedFiles: deprecated,
            unusedFiles: unused,
            activeModules: active,
            scanMeta: {
                ...meta,
                lastScan: new Date().toISOString(),
                status: 'ready',
            },
        })),

    // 🧪 Simulated manual trigger (can connect to actual scanEngine.js soon)
    runScan: async () => {
        set((state) => ({ scanMeta: { ...state.scanMeta, status: 'scanning' } }));
        const snapshot = await import('@/data/CODE_PRUNE_AUDIT.json');
        useAuditStore.getState().ingestAuditSnapshot({
            deprecated: snapshot.deprecated_modules,
            unused: snapshot.unused_files,
            active: snapshot.active_modules,
            meta: { triggeredBy: 'manual' },
        });
    },

    // ✅ Update file status dynamically
    markReviewed: (filePath) =>
        set((state) => ({
            deprecatedFiles: state.deprecatedFiles.filter((f) => f.file !== filePath),
            unusedFiles: state.unusedFiles.filter((f) => f.file !== filePath),
        })),

    archiveFile: (filePath) =>
        set((state) => ({
            deprecatedFiles: state.deprecatedFiles.filter((f) => f.file !== filePath),
            unusedFiles: state.unusedFiles.filter((f) => f.file !== filePath),
        })),
}));

export default useAuditStore;