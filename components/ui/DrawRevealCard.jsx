// =============================================
// 📁 File: /components/ui/DrawRevealCard.jsx
// 🧠 Summary: Reveals pick result with AI strategy commentary overlay
//
// ▸ Combines draw results, strategy metadata, entropy pulse
// ▸ Hosts StrategyCommentary module with voice narration
// ▸ Tailored for use in gameplay reveal, post-pick screen, or result highlights
//
// 🔁 Used in: DrawResultPanel, Dashboard reveal stream
// 🔗 Dependencies: StrategyCommentary, useBrewVoice
// ✨ Added: Phase 4.20 — Draw Strategy Reveal Overlay
// =============================================

import StrategyCommentary from "./StrategyCommentary";
import { motion } from "framer-motion";

export default function DrawRevealCard({ result, strategy, entropy, commentary }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-[#111] border border-yellow-800 p-6 rounded-lg shadow-md text-yellow-200 space-y-2"
        >
            <div className="text-xs font-mono tracking-wide uppercase text-yellow-500">
                Strategy: {strategy} • Entropy: {entropy}
            </div>

            <div className="text-2xl md:text-3xl font-bold text-yellow-300 tracking-wider">
                🎰 Draw: {result}
            </div>

            <StrategyCommentary
                pick={result}
                strategy={strategy}
                entropy={entropy}
                commentary={commentary}
            />
        </motion.div>
    );
}