// @components/predict/PredictionResultPanel.jsx
// Created: 2025-06-28T20:42 EDT
// Summary: Renders predicted numbers with animation, tier-aware match stats, and strategy context

import { motion } from "framer-motion";
import { STRATEGY_EXPLAINERS } from "@/lib/explainers/strategyExplainers";
import { useUserTier } from "@/hooks/useUserTier";
import { hasTierAccess } from "@/utils/tier-utils";
import { useBrewBotContext } from "@/components/context/BrewBotContext";
import toast from "react-hot-toast";

export default function PredictionResultPanel({
    numbers = [],
    matched = 0,
    total = 5,
    strategy = "random",
    onShowCommentary = null,
}) {
    const { currentTier } = useUserTier();
    const { prompt } = useBrewBotContext();

    const unlocked = hasTierAccess(currentTier, "brew");
    const label = STRATEGY_EXPLAINERS?.[strategy]?.label || strategy;

    const handleBlocked = () => {
        toast("Upgrade to Brew Tier to reveal match insights.");
        prompt("Want to see how accurate your predictions are? Brew Tier unlocks win/loss insights.");
    };

    return (
        <div className="bg-neutral-900 border border-yellow-700 rounded p-5 space-y-4">
            <div className="text-sm text-yellow-400 font-medium">
                🎯 Prediction using <strong>{label}</strong>
            </div>

            <div className="flex justify-center gap-3 text-2xl font-mono">
                {numbers.map((num, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="bg-neutral-800 px-3 py-2 rounded border border-neutral-700"
                    >
                        {String(num).padStart(2, "0")}
                    </motion.div>
                ))}
            </div>

            {unlocked ? (
                <div className="text-sm text-green-400">
                    ✅ Matched {matched} of {total}
                </div>
            ) : (
                <div
                    onClick={handleBlocked}
                    className="text-sm text-yellow-300 hover:text-yellow-100 cursor-pointer"
                >
                    🔒 Match details available in Brew Tier
                </div>
            )}
        </div>
    );
}