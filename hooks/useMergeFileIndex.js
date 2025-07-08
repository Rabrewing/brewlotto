// @file: /hooks/useMergeFileIndex.js
// @summary: Access + filter BrewMergeFileIndex.json for cockpit dashboards
// @timestamp: 2025-07-01T11:35 EDT

import { useState, useEffect } from 'react';

export default function useMergeFileIndex() {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetch('/BrewMergeFileIndex.json')
            .then((res) => res.json())
            .then((data) => setFiles(data))
            .catch((err) => console.error('Merge index load failed:', err));
    }, []);

    const getByTag = (tag) =>
        files.filter((f) => Array.isArray(f.tags) && f.tags.includes(tag));

    const getByRisk = (risk) =>
        files.filter((f) => f.refactorRisk === risk);

    const getUntriaged = () =>
        files.filter((f) => !f.status || f.status === 'untriaged');

    const getStats = () => ({
        total: files.length,
        jsx: getByTag('jsx_component').length,
        js: getByTag('js_module').length,
        strategy: getByTag('strategy_candidate').length,
        highRisk: getByRisk('high')?.length || 0,
        untriaged: getUntriaged().length
    });

    return {
        files,
        getByTag,
        getByRisk,
        getUntriaged,
        getStats
    };
}