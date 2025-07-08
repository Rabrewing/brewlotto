// @components/predict/DailyPickTracker.jsx
// Updated: 2025-06-28T02:51 EDT
// Displays tier-aware prediction quota usage with refill countdown and upgrade nudges

import { useUserTier } from "@/lib/useUserTier";
import { useEffect, useState } from "react";

// 🔐 Tier cap system for daily predictions
const TIER_LIMITS = {
  free: 3,
  brew: 10,
  master: Infinity,
};

export default function DailyPickTracker({ picksUsed = 0 }) {
  const { tier } = useUserTier();
  const limit = TIER_LIMITS[tier] || 3;

  const [refillIn, setRefillIn] = useState(null);

  useEffect(() => {
    // Estimate next refill at local midnight
    const now = new Date();
    const reset = new Date();
    reset.setHours(24, 0, 0, 0);
    const minsLeft = Math.floor((reset - now) / (1000 * 60));
    setRefillIn(minsLeft);
  }, []);

  const percent = Math.min(100, Math.round((picksUsed / limit) * 100));
  const capped = picksUsed >= limit;

  return (
    <div className="w-full bg-neutral-800 p-2 rounded text-sm text-neutral-300 mb-4">

      <div className="mb-1 flex justify-between items-center">
        <span>
          🎯 Picks used: <strong>{picksUsed}</strong> / {limit === Infinity ? "∞" : limit}
        </span>

        {capped && (
          <span className="text-yellow-400 text-xs">
            Brew’s brewed out! ⏳ Reset in {refillIn}m
          </span>
        )}
      </div>

      <div className="w-full h-2 bg-neutral-700 rounded">
        <div
          className={`h-2 ${percent >= 100 ? "bg-red-500" : "bg-yellow-400"} rounded transition-all`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {tier === "free" && picksUsed >= limit && (
        <p className="text-xs text-yellow-500 mt-1">
          🚀 Upgrade to BrewTier or MasterMode for unlimited predictions
        </p>
      )}
    </div>
  );
}