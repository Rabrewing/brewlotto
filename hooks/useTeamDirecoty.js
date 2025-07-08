// @file: hooks/useTeamDirectory.js
// @summary: Provides access to the Brew team directory

import teamDirectory from '@/lib/teamDirectory.json';

export default function useTeamDirectory({ onlyDevs = false } = {}) {
    const entries = Object.entries(teamDirectory || {});

    const filtered = onlyDevs
        ? entries.filter(([_, data]) => data.dev)
        : entries;

    return filtered.map(([name, data]) => ({
        name,
        ...data,
    }));
}