// @module: BrewAlertPanel.jsx
// @created: 2025-06-25 05:51 EDT
// @description: Displays high-priority tasks, open threats, and time-sensitive warnings pulled from roadmap + BrewSentinel logs.

import React from 'react';

const BrewAlertPanel = ({ alerts = [] }) => {
    const hasAlerts = alerts && alerts.length > 0;

    return (
        <div className="bg-rose-900 p-4 rounded-lg shadow-lg min-h-[200px]">
            <h2 className="text-xl font-bold mb-2">🚨 Brew Alerts <span className="ml-2 inline-block bg-rose-700 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {alerts.length}
            </span>
            </h2>


            {hasAlerts ? (
                <ul className="space-y-2">
                    {alerts.map((alert, idx) => (
                        <li key={idx} className="bg-rose-800 p-2 rounded text-sm">
                            <span className="font-semibold text-white">⚠️ {alert.type}</span>
                            <div className="text-rose-200">
                                {alert.message}
                            </div>
                            <div className="text-xs text-gray-300 mt-1">
                                📅 {alert.timestamp} · {alert.source}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-sm text-rose-200 italic">✅ All systems normal — no critical alerts at this time.</div>
            )}
        </div>
    );
};

export default BrewAlertPanel;