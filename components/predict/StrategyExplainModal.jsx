// @components/predict/StrategyExplainModal.jsx
// Updated: 2025-06-28T02:58 EDT
// Modal explainer using Brew-branded strategy labels, tier-aware logic, and centralized explainers

import { useUserTier } from "@/lib/useUserTier";
import { Dialog } from "@headlessui/react";
import { Fragment } from "react";
import { STRATEGY_EXPLAINERS } from "@/lib/explainers/strategyExplainers";

export default function StrategyExplainModal({ open, onClose, strategyId }) {
  const info = STRATEGY_EXPLAINERS[strategyId] || {};
  const { tier } = useUserTier();

  const unlocked =
    info.tier <= (tier === "master" ? 3 : tier === "brew" ? 2 : 1);

  return (
    <Dialog as={Fragment} open={open} onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-70 z-40" />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-neutral-950 border border-yellow-500 rounded p-6 w-full max-w-md shadow-xl text-neutral-200">

          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{info.icon}</span>
            <h3 className="text-lg font-bold">{info.label || strategyId}</h3>
            {!unlocked && (
              <span className="ml-auto text-yellow-400 text-sm">
                🔒 Tier {info.tier}+
              </span>
            )}
          </div>

          <p className="text-sm text-neutral-300">
            {unlocked
              ? info.desc
              : "This strategy is exclusive to higher Brew tiers. Upgrade to unlock this insight engine."}
          </p>

          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 rounded bg-yellow-500 text-black font-semibold text-sm hover:bg-yellow-400"
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
}