// @file: useRefactorLedger.js
// @summary: Loads and filters refactorLedger.json for fix history, assignments, and status

import { useEffect, useState } from 'react';

export function useRefactorLedger() {
    const [ledger, setLedger] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLedger = async () => {
            try {
                const res = await fetch('/api/ledger');
                const data = await res.json();
                setLedger(data || []);
            } catch (e) {
                console.error('[Brew Da AI Ledger Error]', e);
                setLedger([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLedger();
    }, []);

    const assignedTo = (name) =>
        ledger.filter((entry) => entry.assignedTo === name);

    const forFile = (file) =>
        ledger.filter((entry) => entry.file === file);

    return { ledger, loading, assignedTo, forFile };
}