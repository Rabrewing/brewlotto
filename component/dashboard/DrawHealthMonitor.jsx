/**
 * Component: DrawHealthMonitor
 * Description: Displays current draw counts and latest draw date for each game with freshness indicators
 * Last updated: 2025-06-25T02:56:00-04:00 (EDT)
 */

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const games = [
    { game: 'Pick 3', table: 'pick3_draws' },
    { game: 'Pick 4', table: 'pick4_draws' },
    { game: 'Pick 5', table: 'pick5_draws' },
    { game: 'Powerball', table: 'powerball_draws' },
    { game: 'Mega Millions', table: 'mega_draws' }
];

const today = new Date().toISOString().slice(0, 10);

export default function DrawHealthMonitor() {
    const [status, setStatus] = useState([]);

    useEffect(() => {
        const fetchStatus = async () => {
            const results = [];

            for (const { game, table } of games) {
                const { data: latest, error: dateErr } = await supabase
                    .from(table)
                    .select('draw_date')
                    .order('draw_date', { ascending: false })
                    .limit(1);

                const { count, error: countErr } = await supabase
                    .from(table)
                    .select('*', { count: 'exact', head: true });

                const lastDate = latest?.[0]?.draw_date;
                const isFresh = lastDate === today;
                const flag = count < 10 ? '🔴' : count < 100 ? '🟡' : '🟢';

                results.push({
                    game,
                    count: count || 0,
                    lastDate: lastDate || '—',
                    freshness: isFresh ? '🟢' : '🟡',
                    flag
                });
            }

            setStatus(results);
        };

        fetchStatus();
    }, []);

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-full">
            <h2 className="text-xl font-semibold mb-4">📊 Draw Health Monitor</h2>
            <table className="w-full border">
                <thead className="bg-gray-100 text-left">
                    <tr>
                        <th className="p-2">Game</th>
                        <th className="p-2">Row Count</th>
                        <th className="p-2">Latest Draw Date</th>
                        <th className="p-2">Freshness</th>
                    </tr>
                </thead>
                <tbody>
                    {status.map(({ game, count, lastDate, freshness, flag }) => (
                        <tr key={game} className="border-t hover:bg-gray-50">
                            <td className="p-2">{flag} {game}</td>
                            <td className="p-2">{count}</td>
                            <td className="p-2">{lastDate}</td>
                            <td className="p-2">{freshness}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}