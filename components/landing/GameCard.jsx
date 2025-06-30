// @components/landing/GameCard.jsx
// Updated: 2025-06-28T02:49 EDT
// Description: Landing page game card with obfuscated strategies and tier-safe label display

import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { showToast } from "@/utils/toastservice"; // Swap alert to toast later
import { STRATEGY_EXPLAINERS } from "@/lib/explainers/strategyExplainers";

export default function GameCard({ game, user }) {
  const router = useRouter();

  const handleClick = () => {
    if (!user) {
      alert("Sign in to unlock predictions."); // 🔄 TODO: replace with `showToast()`
      return;
    }
    router.push(game.route);
  };

  // Demo strategy preview: show 3 tier-safe, obfuscated strategies
  const sampleStrategyIds = ["poisson+", "markov++", "momentum"];

  return (
    <motion.div
      whileHover={{ scale: 1.04, rotate: -0.5 }}
      whileTap={{ scale: 0.98 }}
      className="bg-[#232323] p-6 rounded-xl shadow-lg transition cursor-pointer border border-transparent hover:border-yellow-400"
      onClick={handleClick}
    >
      <h3 className="text-2xl font-bold text-yellow-300 mb-2">{game.name}</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {sampleStrategyIds.map((id) => (
          <span
            key={id}
            className="bg-slate-700 px-2 py-1 rounded-full text-sm text-white"
          >
            {STRATEGY_EXPLAINERS[id]?.label || id}
          </span>
        ))}
      </div>

      <button className="w-full bg-yellow-400 hover:bg-white hover:text-yellow-600 text-[#181818] font-bold py-2 rounded transition">
        {user ? "Generate Numbers" : "Sign in to Unlock"}
      </button>
    </motion.div>
  );
}