// /pages/dashboard.js
// BrewLotto AI — Analytics Dashboard
// Last updated: 2025-06-22

import PredictionFeed from '@/component/dashboard/PredictionFeed';
import UploadZone from '@/component/dashboard/UploadZone';
import RefreshTrigger from '@/component/dashboard/RefreshTrigger';
import AuditViewer from '@/component/dashboard/AuditViewer';
import DrawHealthMonitor from '@/component/dashboard/DrawHealthMonitor';
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// --- Helper: Fetch stats for a single game from the API ---
async function fetchGameStats(game, type = "history") {
    try {
        const res = await fetch(`/api/stats/${game}?type=${type}`);
        if (!res.ok) throw new Error("Failed to fetch");
        return await res.json();
    } catch (e) {
        console.error("Fetch error:", e);
        return null;
    }
}

// --- Helper: Fetch user play summary (replace with real DB logic) ---
async function fetchUserStats(userId) {
    // TODO: Replace this with a Supabase query to the play log table.
    // For now, mock summary data.
    return {
        cashSpent: 164, // total $ played
        wins: 12,       // total wins
        winAmount: 512, // total $ won
    };
}

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [spendData, setSpendData] = useState([]);
    const [userStats, setUserStats] = useState(null);

    useEffect(() => {
        async function loadData() {
            const userId = "demo"; // TODO: Replace with real user auth
            const games = ["pick3", "pick4", "pick5", "mega", "powerball"];
            let spendArr = [];
            let statsObj = {};

            for (let game of games) {
                const latest = await fetchGameStats(game);
                statsObj[game] = latest || {};
                spendArr.push({
                    game: game.replace(/pick/i, "Pick "),
                    cashSpent: latest?.cash_spent || 0,
                });
            }
            setStats(statsObj);
            setSpendData(spendArr);

            const uStats = await fetchUserStats(userId);
            setUserStats(uStats);
        }
        loadData();
    }, []);

    if (!stats || !userStats) return <div className="text-white p-8">Loading dashboard…</div>;

    return (
        <div className="min-h-screen bg-[#181818] text-white p-8">
            <h1 className="text-4xl font-extrabold text-[#FFD700] mb-6 text-center">BrewLotto AI — Analytics Dashboard</h1>
            {/* Overall Spend & Win Summary */}
            <div className="bg-[#232323] rounded-2xl p-6 shadow mb-8 max-w-2xl mx-auto flex flex-col items-center">
                <div className="text-2xl mb-2 font-bold text-[#FFD700]">
                    Total Money Spent: <span className="text-white">${userStats.cashSpent}</span>
                </div>
                <div className="text-xl text-gray-300">Wins: <span className="font-bold text-[#FFD700]">{userStats.wins}</span></div>
                <div className="text-xl text-gray-300 mb-2">Total Won: <span className="font-bold text-[#FFD700]">${userStats.winAmount}</span></div>
                <div className="text-gray-400 text-sm">Win rate and spend stats update live as you log plays.</div>
            </div>

            {/* Spending by Game — Chart */}
            <div className="bg-[#232323] rounded-xl p-6 shadow max-w-3xl mx-auto mb-10">
                <div className="text-lg font-bold text-[#FFD700] mb-4">Spending by Game</div>
                <SpendBarChart spendData={spendData} />
            </div>
            {/* Draw Data Health Monitor */}
            <div className="bg-[#232323] rounded-xl p-6 shadow max-w-5xl mx-auto mb-10">
                <DrawHealthMonitor />
            </div>

            {/* Missing Draw Audit Panel */}
            <AuditViewer />
            <RefreshTrigger />

            <PredictionFeed />
            <UploadZone />



            {/* Per-game stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {Object.keys(stats).map((game) => (
                    <div key={game} className="bg-[#232323] rounded-xl p-5 shadow flex flex-col">
                        <div className="text-xl font-bold text-[#FFD700] mb-1 uppercase">{game.replace(/pick/i, "Pick ")}</div>
                        <div className="mb-1">
                            <span className="text-gray-400">Latest:</span>{" "}
                            <span className="font-bold text-white">{stats[game].result || "--"}</span>
                        </div>
                        <div className="mb-1">
                            <span className="text-gray-400">Odds:</span>{" "}
                            <span className="text-white">{stats[game].odds || "--"}</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-gray-400">Cash Spent:</span>{" "}
                            <span className="font-bold text-white">${stats[game].cash_spent || 0}</span>
                        </div>
                    </div>
                ))}
            </div>
            {/* Add more charts and tips here as needed */}
        </div>
    );
}

// --- Helper Chart ---
function SpendBarChart({ spendData }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendData}>
                <XAxis dataKey="game" stroke="#FFD700" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cashSpent" fill="#FFD700" />
            </BarChart>
        </ResponsiveContainer>
    );
}

// --- Add other chart components for win rate, odds, trends, etc. ---

