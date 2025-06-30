// =============================================
// 📁 /components/ui/BrewCommentaryEngine.jsx
// Updated: 2025-06-28T03:03 EDT
// Summary: Injects branded, strategy-aware Brew commentary lines
// Sources labels from STRATEGY_EXPLAINERS for obfuscated display
// Compatible with useBrewVoice, tooltip hover, and phased UX modes
// =============================================

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BREW_PHRASES } from "@/lib/voice/BREW_PHRASES";
import { STRATEGY_EXPLAINERS } from "@/lib/explainers/strategyExplainers";

export default function BrewCommentaryEngine({
    status = "idle",        // "idle" | "loading" | "success" | "error"
    strategy = "poisson",   // internal strategy key
    mode = "strategist",    // UX style: "casual", "strategist", "admin"
    speak = false,          // toggle speech
    voiceHook = null        // useBrewVoice() speak() function
}) {
    const [phrase, setPhrase] = useState("");

    useEffect(() => {
        const strategyLabel = STRATEGY_EXPLAINERS?.[strategy]?.label || strategy;

        const lines =
            BREW_PHRASES?.[mode]?.[status]?.[strategy] ||
            BREW_PHRASES?.[mode]?.[status] ||
            [`🤖 Brew is thinking with ${strategyLabel}…`];

        const next = lines[Math.floor(Math.random() * lines.length)];
        setPhrase(next);

        if (speak && voiceHook) voiceHook(next);
    }, [status, strategy, mode, speak, voiceHook]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={phrase}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
                className="text-yellow-400 font-medium px-4 text-sm"
                aria-live="polite"
            >
                {phrase}
            </motion.div>
        </AnimatePresence>
    );
}