// @file: MergeAuditTable.jsx
// @directory: /components/ui
// @timestamp: 2025-07-01T11:28 EDT
// @summary: Displays audit results using shared Card and Badge components
// @route: N/A — used in BrewAuditDashboard and scan result views

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'; // 🔜 If not created yet, I can drop this next

const MergeAuditTable = ({ title, data = [], status = 'default' }) => {
    return (
        <Card className="w-full overflow-x-auto">
            <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
            <table className="w-full text-sm text-white table-auto">
                <thead>
                    <tr className="text-left border-b border-gray-600">
                        <th className="py-2 pr-4 min-w-[180px]">File</th>
                        <th className="py-2 pr-4 min-w-[100px]">Status</th>
                        <th className="py-2 pr-4 min-w-[250px]">Reason</th>
                        <th className="py-2 min-w-[180px]">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, i) => (
                        <tr key={i} className="border-t border-gray-800 align-top">
                            <td className="py-2 pr-4 font-mono text-yellow-300 break-words">{item.file}</td>
                            <td className="py-2 pr-4">
                                <Badge text={item.status || status} type={item.status || status} />
                            </td>
                            <td className="py-2 pr-4 text-gray-300 break-words">{item.reason || '—'}</td>
                            <td className="py-2 flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
                                <button className="bg-yellow-400 text-black rounded-full px-3 py-1 text-xs font-semibold hover:bg-white hover:text-yellow-600 transition">
                                    Mark Reviewed
                                </button>
                                <button className="bg-yellow-400 text-black rounded-full px-3 py-1 text-xs font-semibold hover:bg-white hover:text-yellow-600 transition">
                                    Archive
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
};

export default MergeAuditTable;