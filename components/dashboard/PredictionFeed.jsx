/**
 * Component: PredictionFeed
 * Description: Displays smart picks per strategy and per game
 * Last updated: 2025-06-25T03:15 EDT
 */

import { useEffect, useState } from 'react';

export default function PredictionFeed() {
    const [picks, setPicks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPicks = async () => {
            try {
                const res = await fetch('/api/predictions');
                if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
                const data = await res.json();
                setPicks(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Prediction fetch failed:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPicks();
    }, []);

    return (
        <div className="bg-[#232323] rounded-xl p-6 shadow max-w-6xl mx-auto mb-10">
            <h2 className="text-lg font-bold text-[#FFD700] mb-4">🎯 Prediction Feed</h2>

            {loading && <div className="text-gray-400">Loading picks...</div>}

            {!loading && error && (
                <div className="text-red-400">⚠️ Error loading predictions. Please try again later.</div>
            )}

            {!loading && !error && picks.length === 0 && (
                <div className="text-yellow-400">⚠️ No predictions found. Try refreshing data.</div>
            )}

            {!loading && !error && picks.length > 0 && (
                <div className="space-y-4">
                    {picks.map(({ game, strategy, numbers, score }, i) => (
                        <div
                            key={i}
                            className="bg-[#181818] rounded p-4 text-white shadow hover:ring-1 hover:ring-[#FFD700] transition-all"
                        >
                            <div className="text-sm text-gray-400 uppercase mb-1">
                                {strategy} Strategy • {game}
                            </div>
                            <div className="text-2xl font-mono text-[#FFD700] tracking-wider">
                                {numbers.join('  ')}
                            </div>
                            {score != null && (
                                <div className="text-xs text-gray-500 mt-1">Score: {score.toFixed(4)}</div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}