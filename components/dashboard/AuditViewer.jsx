// File: component/dashboard/AuditViewer.jsx
// Timestamp: 2025-06-25T04:42 EDT
// Description: Displays per-game missing draw dates grouped and formatted, with error guards and audit clarity

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { showToast } from '@/utils/toastservice';
import { format } from 'date-fns';

export default function AuditViewer() {
    const [auditMap, setAuditMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchAuditGaps();
    }, []);

    const fetchAuditGaps = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('draw_audit').select('game, missing_dates');

            if (error) throw error;

            const map = {};
            for (const row of data || []) {
                const game = row.game || 'Unknown';
                const missing = Array.isArray(row.missing_dates) ? row.missing_dates : [];

                map[game] = missing.sort((a, b) => new Date(a) - new Date(b));
            }

            setAuditMap(map);
            showToast.success(`🕵️‍♂️ Audit gaps loaded for ${Object.keys(map).length} games`);
        } catch (err) {
            console.error('❌ AuditViewer Error:', err);
            showToast.error('Failed to load audit gaps.');
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 rounded-xl shadow p-6 mb-10">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">🛠️ Audit Feed</h2>

            {loading && <div className="text-gray-400">Loading audit data...</div>}
            {error && <div className="text-red-500">Something went wrong loading audit history.</div>}

            {!loading && !error && Object.keys(auditMap).length === 0 && (
                <div className="text-yellow-400">✅ All draws accounted for. No gaps detected!</div>
            )}

            {!loading && !error && Object.entries(auditMap).map(([game, missing]) => (
                <div key={game} className="mb-6">
                    <div className="text-white font-semibold uppercase mb-1 tracking-wide border-b border-gray-700 pb-1">
                        🎯 {game}
                    </div>
                    <ul className="text-sm text-gray-300 list-disc pl-6">
                        {Array.isArray(missing) && missing.map((dateStr) => {
                            const parsed = new Date(dateStr);
                            const formatted = isNaN(parsed) ? dateStr : format(parsed, 'MMM dd, yyyy');
                            return <li key={dateStr}>{formatted}</li>;
                        })}
                    </ul>
                </div>
            ))}
        </div>
    );
}