// =============================================
// 📁 File: /components/ui/BrewCommentaryEngine.jsx
// 🧠 Summary: Animated, voice-enabled commentary module for Brew Da AI
//
// ▸ Displays narration from audit scans, strategies, or fallback phrases
// ▸ Accepts explicit `commentary` prop (from /api/scan or /api/annotate-pick)
// ▸ Invokes useBrewVoice().speak() if `speak` is enabled
// ▸ Compatible with IDE scans, gameplay reveals, audit trails
//
// 🔁 Used in:
//   • Prediction overlays
//   • Draw reveal moments
//   • AuditInsightPanel, FixSuggestionPanel
//
// 🔗 Dependencies:
//   • STRATEGY_EXPLAINERS – for label fallback
//   • BREW_PHRASES – UX-scoped phrase library
//
// ✨ Enhanced: Phase 4.22 — Audit Scan + Commentary Routing
// =============================================

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BREW_PHRASES } from "../../lib/voice/BREW_PHRASES";
import { STRATEGY_EXPLAINERS } from "../../lib/explainers/strategyExplainers";

export default function BrewCommentaryEngine({
    status = "idle",          // "idle" | "loading" | "success" | "error"
    strategy = "poisson",     // strategy key OR audit category (e.g. "scan", "fix")
    mode = "strategist",      // UX voice profile: "casual", "strategist", "admin"
    speak = false,            // if true, calls voiceHook(phrase)
    voiceHook = null,         // useBrewVoice().speak
    commentary = null         // direct override (scan summary, strategy rationale)
}) {
    const [phrase, setPhrase] = useState("");

    useEffect(() => {
        const strategyLabel = STRATEGY_EXPLAINERS?.[strategy]?.label || strategy;

        const fallback =
            BREW_PHRASES?.[mode]?.[status]?.[strategy] ||
            BREW_PHRASES?.[mode]?.[status] ||
            [`🤖 Brew is thinking with ${strategyLabel}…`];

        const resolved = commentary || fallback[Math.floor(Math.random() * fallback.length)];

        setPhrase(resolved);
        if (speak && voiceHook) voiceHook(resolved);
    }, [status, strategy, mode, speak, voiceHook, commentary]);

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