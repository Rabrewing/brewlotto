// @components/predict/PredictionCard.jsx
// Updated: 2025-06-28T02:48 EDT
// Displays prediction set, match score, and Brew commentary
// Wires strategy obfuscation via strategyExplainers

import { useEffect, useState } from "react";
import { usePredictionEngine } from "@/hooks/usePredictionEngine";
import { useMatchScan } from "@/hooks/useMatchScan";
import MatchScoreBadge from "@/components/user/MatchScoreBadge";
import BrewCommentaryEngine from "@/components/ui/BrewCommentaryEngine";
import { STRATEGY_EXPLAINERS } from "@/lib/explainers/strategyExplainers";

export default function PredictionCard({ game = "pick3", actualDraw = [] }) {
    const { generate, result: predicted, status, lastStrategies } = usePredictionEngine({ game });
    const { scoreMatch } = useMatchScan();
    const [matchResult, setMatchResult] = useState({ score: 0, commentary: "", hits: [] });

    // Auto-generate on mount (sample default: "momentum" + "hotCold")
    useEffect(() => {
        generate(["momentum", "hotCold"]);
    }, []);

    // Score prediction against actual draw once available
    useEffect(() => {
        if (predicted.length && actualDraw.length) {
            const scored = scoreMatch(predicted, actualDraw);
            setMatchResult(scored);
        }
    }, [predicted, actualDraw]);

    // Format friendly strategy label for display
    const formattedStrategies = (lastStrategies || [])
        .map((id) => STRATEGY_EXPLAINERS?.[id]?.label || id)
        .join(", ");

    return (
        <div className="bg-neutral-900 border border-yellow-500 rounded p-4 space-y-3">
            <div className="text-sm text-neutral-400">
                Strategy: {formattedStrategies || "—"}
            </div>

            <div className="text-xl font-bold text-yellow-300 tracking-widest flex gap-2">
                {predicted.map((num, i) => (
                    <span key={i} className={matchResult.hits?.[i] ? "text-green-400" : ""}>
                        {String(num).padStart(2, "0")}
                    </span>
                ))}
            </div>

            {actualDraw.length > 0 && (
                <MatchScoreBadge
                    score={matchResult.score}
                    commentary={matchResult.commentary}
                />
            )}

            <BrewCommentaryEngine
                status={status === "done" ? "success" : status}
                strategy={lastStrategies?.[0] || "random"} // pass the base strategy key
                mode="strategist"
                speak={false}
            />
        </div>
    );
}