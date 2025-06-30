/**
 * Component: RefreshTrigger
 * Description: Button to trigger backend draw refresh from the dashboard
 * Last updated: 2025-06-25T03:10:00-04:00 (EDT)
 */

import { useState } from 'react';

export default function RefreshTrigger() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRefresh = async () => {
        setLoading(true);
        setStatus(null);

        const res = await fetch('/api/refresh', { method: 'POST' });
        const result = await res.json();

        setStatus(result?.message || 'Unknown status');
        setLoading(false);
    };

    return (
        <div className="bg-[#232323] rounded-xl p-6 shadow max-w-3xl mx-auto mb-10 text-center">
            <h2 className="text-lg font-bold text-[#FFD700] mb-4">🔁 Manual Draw Refresh</h2>
            <button
                onClick={handleRefresh}
                className="bg-[#FFD700] text-black px-6 py-2 font-semibold rounded hover:bg-yellow-400 disabled:opacity-50"
                disabled={loading}
            >
                {loading ? 'Refreshing...' : 'Trigger refreshDraws.js'}
            </button>
            {status && <p className="text-sm text-green-400 mt-3">{status}</p>}
        </div>
    );
}