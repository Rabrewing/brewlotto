// =============================================
// 📁 File: /components/dev/TeamRefactorStatsPanel.jsx
// 🧠 Summary: Displays team/developer fix attribution from patch queue + ledger
//
// ▸ Shows fix stats by dev and team (applied, delegated, pending)
// ▸ Syncs with usePatchQueue() — reads assignedTo + team fields
// ▸ Voice narration ready: announce leading team or dev
//
// 🔁 Used in: BrewIDE.jsx, Dashboard overlays
// 🔗 Dependencies: usePatchQueue(), useBrewBotContext()
// ✨ Added: Phase 4.23 — Team Contribution Insights
// =============================================

import { usePatchQueue } from "@/hooks/usePatchQueue";
import { useBrewBotContext } from "@/components/context/BrewBotContext";
import { useMemo } from "react";

export default function TeamRefactorStatsPanel() {
    const { queue = [] } = usePatchQueue();
    const { speak } = useBrewBotContext();

    const stats = useMemo(() => {
        const devs = {};
        const teams = {};

        queue.forEach((fix) => {
            const dev = fix.assignedTo;
            const team = fix.team;
            const status = fix.status || "pending";

            if (dev) {
                if (!devs[dev]) devs[dev] = { applied: 0, pending: 0 };
                devs[dev][status] = (devs[dev][status] || 0) + 1;
            }

            if (team) {
                if (!teams[team]) teams[team] = { applied: 0, pending: 0 };
                teams[team][status] = (teams[team][status] || 0) + 1;
            }
        });

        return { devs, teams };
    }, [queue]);

    return (
        <div className="bg-[#101010] border border-yellow-800 text-yellow-200 p-4 rounded-md shadow space-y-4">
            <h2 className="text-xl font-bold text-yellow-300">📊 Team Refactor Stats</h2>

            <div className="space-y-2">
                <h3 className="text-sm text-yellow-400">👤 Developers</h3>
                <ul className="text-sm space-y-1">
                    {Object.entries(stats.devs).map(([dev, counts]) => (
                        <li key={dev}>
                            <span className="font-semibold">{dev}</span> — ✅ {counts.applied || 0} applied, ⏳{" "}
                            {counts.pending || 0} pending
                        </li>
                    ))}
                </ul>
            </div>

            <div className="space-y-2">
                <h3 className="text-sm text-yellow-400">👥 Teams</h3>
                <ul className="text-sm space-y-1">
                    {Object.entries(stats.teams).map(([team, counts]) => (
                        <li key={team}>
                            <span className="font-semibold">{team}</span> — ✅ {counts.applied || 0} applied, ⏳{" "}
                            {counts.pending || 0} pending
                        </li>
                    ))}
                </ul>
            </div>

            <button
                className="mt-3 text-xs px-3 py-1 bg-yellow-800 hover:bg-yellow-700 rounded"
                onClick={() =>
                    speak(
                        `Team scoreboard loaded. ${Object.keys(stats.teams).length} teams tracked. ${Object.keys(stats.devs).length
                        } developers active.`
                    )
                }
            >
                🗣️ Narrate Summary
            </button>
        </div>
    );
}