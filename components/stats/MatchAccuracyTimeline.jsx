// @componests/stats/MatchAccuracyTimeline.jsx
// Summary: Displays match accuracy timeline with tier access gating and BrewBot prompt
// @timestamp 2025-06-28T15:30 EDT
import { useUserTier } from "@/hooks/useUserTier";
import { hasTierAccess } from "@/utils/tier-utils";
import { useBrewBotContext } from "@/components/context/BrewBotContext";
import toast from "react-hot-toast";

export default function MatchAccuracyTimeline({ history = [] }) {
    const { currentTier } = useUserTier();
    const { prompt } = useBrewBotContext();

    const unlocked = hasTierAccess(currentTier, "brew");

    const handleClick = () => {
        toast("Match tracking is available with Brew Tier or higher.");
        prompt("Want to track prediction accuracy over time? Brew Tier unlocks match trend analytics.");
    };

    if (!unlocked) {
        return (
            <div
                onClick={handleClick}
                className="opacity-60 hover:opacity-90 cursor-pointer border border-yellow-600 rounded p-4 bg-neutral-900 text-yellow-200 text-sm text-center"
            >
                🔒 Match Accuracy Timeline <br /> Available with Brew Tier or higher
            </div>
        );
    }

    return (
        <div className="bg-neutral-900 border border-yellow-600 rounded p-4 space-y-2">
            <h3 className="text-yellow-400 font-bold text-sm">📉 Match Accuracy Timeline</h3>
            <div className="flex gap-2 overflow-x-auto">
                {history.map((entry, i) => {
                    const percent = entry.matched / entry.total;
                    const color =
                        percent === 1
                            ? "bg-green-500"
                            : percent >= 0.5
                                ? "bg-yellow-400"
                                : percent > 0
                                    ? "bg-orange-500"
                                    : "bg-neutral-700";

                    return (
                        <div
                            key={i}
                            className={`w-12 h-12 flex flex-col items-center justify-center rounded ${color} text-black text-xs font-bold`}
                            title={`Matched ${entry.matched} of ${entry.total}`}
                        >
                            {entry.matched}/{entry.total}
                        </div>
                    );
                })}
            </div>
            <p className="text-xs text-neutral-400">Each box = recent prediction set</p>
        </div>
    );
}