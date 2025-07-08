// @file: useAuditStore.js
// @directory: /stores
// @timestamp: 2025-07-03T08:00 EDT
// @summary: Central Zustand store for BrewAudit runtime state, file triage, and editor sync
// @route: N/A — used across BrewCommand, Monaco, and admin dashboards

import { create } from 'zustand';

const useAuditStore = create((set) => ({
    deprecatedFiles: [],
    unusedFiles: [],
    activeModules: [],
    refactorCandidates: [],
    currentFile: null,
    fileSummaries: {},
    scanMeta: {
        lastScan: null,
        triggeredBy: 'system',
        status: 'idle',
    },

    // 🧠 Triggered by scanEngine.js after ingestion
    ingestAuditSnapshot: ({
        deprecated = [],
        unused = [],
        active = [],
        refactor = [],
        summaries = {},
        meta = {},
    }) =>
        set(() => ({
            deprecatedFiles: deprecated,
            unusedFiles: unused,
            activeModules: active,
            refactorCandidates: refactor,
            fileSummaries: summaries,
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
            refactor: snapshot.refactor_candidates,
            summaries: snapshot.file_summaries || {},
            meta: { triggeredBy: 'manual' },
        });
    },

    // ✅ Update file status dynamically
    markReviewed: (filePath) =>
        set((state) => ({
            deprecatedFiles: state.deprecatedFiles.filter((f) => f.file !== filePath),
            unusedFiles: state.unusedFiles.filter((f) => f.file !== filePath),
            refactorCandidates: state.refactorCandidates.filter((f) => f.file !== filePath),
        })),

    archiveFile: (filePath) =>
        set((state) => ({
            deprecatedFiles: state.deprecatedFiles.filter((f) => f.file !== filePath),
            unusedFiles: state.unusedFiles.filter((f) => f.file !== filePath),
            refactorCandidates: state.refactorCandidates.filter((f) => f.file !== filePath),
        })),

    // 🧠 Direct setters
    setRefactorCandidates: (data) => set({ refactorCandidates: data }),
    setCurrentFile: (path) => set({ currentFile: path }),
    setFileSummaries: (map) => set({ fileSummaries: map }),
}));

export default useAuditStore;