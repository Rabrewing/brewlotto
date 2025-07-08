// =============================================
// 📁 File: /components/ui/StrategyCommentary.jsx
// 🧠 Summary: Renders AI-generated strategy pick explanation for draw overlays
//
// ▸ Displays strategy name, pick value, entropy pulse, and explanation
// ▸ Optional voice delivery via `useBrewVoice().speak`
// ▸ UI-tuned for draw screens, result reveals, or post-pick overlays
// ▸ Compatible with BrewDa AI phase commentary flow (4.19)
//
// 🔁 Used in: PredictionRevealView, ResultOverlay
// 🔗 Dependencies: useBrewVoice, BrewCommentaryEngine
// ✨ Added: Phase 4.20 — Strategy Commentary Overlay
// =============================================

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBrewVoice } from "@/hooks/useBrewVoice";

export default function StrategyCommentary({ commentary, pick, strategy, entropy = 0 }) {
    const { speak } = useBrewVoice();

    useEffect(() => {
        if (commentary) speak(commentary);
    }, [commentary]);

    return (
        <AnimatePresence mode="wait">
            {commentary && (
                <motion.div
                    key={commentary}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.45 }}
                    className="bg-black/80 text-yellow-300 border border-yellow-700 rounded px-4 py-2 text-sm max-w-xl mx-auto shadow-lg"
                >
                    <div className="font-mono text-yellow-400 text-xs mb-1 uppercase tracking-wide">
                        🎯 {strategy} | Entropy {entropy}
                    </div>
                    <div className="whitespace-pre-line leading-snug">
                        {commentary}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}