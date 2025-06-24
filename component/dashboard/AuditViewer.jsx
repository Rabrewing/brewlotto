/**
 * Component: AuditViewer
 * Description: Pulls and displays missing draw dates per game from backend audit API
 * Last updated: 2025-06-25T03:00:00-04:00 (EDT)
 */

import { useEffect, useState } from 'react';

export default function AuditViewer() {
    const [auditData, setAuditData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/audit')
            .then((res) => res.json())
            .then((data) => {
                setAuditData(data || []);
                setLoading(false);
            });
    }, []);

    return (
        <div className="bg-[#232323] rounded-xl p-6 shadow max-w-5xl mx-auto mb-10">
            <h2 className="text-lg font-bold text-[#FFD700] mb-4">📉 Missing Draw Dates (Audit)</h2>

            {loading ? (
                <div className="text-gray-400">Loading audit results…</div>
            ) : auditData.length === 0 ? (
                <div className="text-green-400">✅ No missing dates detected for Pick 3, 4, or 5.</div>
            ) : (
                <div className="space-y-4">
                    {auditData.map(({ game, missing }) => (
                        <div key={game}>
                            <div className="text-white font-semibold uppercase mb-1">{game}</div>
                            <ul className="text-gray-300 text-sm list-disc pl-6">
                                {missing.map((date) => (
                                    <li key={date}>{date}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}