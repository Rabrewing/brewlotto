// pages/dashboard.js
// BrewLotto AI — Analytics Dashboard
// Last updated: 2025-06-26

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
    RequireAuth,
    PredictionFeed,
    UploadZone,
    RefreshTrigger,
    AuditViewer,
    DrawHealthMonitor,
    DrawResultCard
} from "@/components";

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
    return {
        cashSpent: 164,
        wins: 12,
        winAmount: 512,
    };
}

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [spendData, setSpendData] = useState([]);
    const [userStats, setUserStats] = useState(null);

    useEffect(() => {
        async function loadData() {
            const userId = "demo"; // TODO: Replace with real user ID
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
        <RequireAuth>
            <div className="min-h-screen bg-[#181818] text-white p-8">
                <h1 className="text-4xl font-extrabold text-[#FFD700] mb-6 text-center">
                    BrewLotto AI — Analytics Dashboard
                </h1>

                {/* Overall Spend & Win Summary */}
                <div className="bg-[#232323] rounded-2xl p-6 shadow mb-8 max-w-2xl mx-auto flex flex-col items-center">
                    <div className="text-2xl mb-2 font-bold text-[#FFD700]">
                        Total Money Spent: <span className="text-white">${userStats.cashSpent}</span>
                    </div>
                    <div className="text-xl text-gray-300">
                        Wins: <span className="font-bold text-[#FFD700]">{userStats.wins}</span>
                    </div>
                    <div className="text-xl text-gray-300 mb-2">
                        Total Won: <span className="font-bold text-[#FFD700]">${userStats.winAmount}</span>
                    </div>
                    <div className="text-gray-400 text-sm">
                        Win rate and spend stats update live as you log plays.
                    </div>
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

                {/* Per-game DrawResultCard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
                    {Object.keys(stats).map((gameKey) => (
                        <DrawResultCard
                            key={gameKey}
                            label={gameKey.replace(/pick/i, "Pick ").toUpperCase()}
                            result={stats[gameKey].result || "--"}
                            bonus={stats[gameKey].bonus || null}
                            extra={stats[gameKey].odds ? `Odds: ${stats[gameKey].odds}` : null}
                            date={stats[gameKey].date || "—"}
                        />
                    ))}
                </div>
            </div>
        </RequireAuth>
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