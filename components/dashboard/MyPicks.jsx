// @components/dashboard/MyPicks.jsx
// Upgraded: 2025-06-28T01:47EDT
// Displays recent user predictions scored against actual draws with insight

import { useEffect, useState } from "react";
import { useMatchScan } from "@/hooks/useMatchScan";
import MatchScoreBadge from "@/components/user/MatchScoreBadge";

export default function MyPicks({ picks = [] }) {
    const { scoreMatch } = useMatchScan();
    const [scoredPicks, setScoredPicks] = useState([]);

    useEffect(() => {
        const withScores = picks.map((pick) => {
            const { score, commentary, hits } = scoreMatch(pick.predicted, pick.actual_draw);
            return { ...pick, score, commentary, hits };
        });
        setScoredPicks(withScores);
    }, [picks]);

    return (
        <div className="space-y-4">
            {scoredPicks.map((pick, i) => (
                <div
                    key={i}
                    className="bg-neutral-900 border border-neutral-700 rounded p-3 flex justify-between items-center text-sm text-neutral-200"
                >
                    <div>
                        <div className="font-mono text-yellow-400 tracking-widest">
                            {pick.predicted?.map((n, j) => (
                                <span
                                    key={j}
                                    className={pick.hits?.[j] ? "text-green-400" : ""}
                                >
                                    {String(n).padStart(2, "0")}{" "}
                                </span>
                            ))}
                        </div>
                        <div className="text-neutral-500 text-xs mt-1">
                            Draw: {pick.actual_draw?.join(" ")}
                        </div>
                    </div>

                    <MatchScoreBadge score={pick.score} commentary={pick.commentary} />
                </div>
            ))}
        </div>
    );
}