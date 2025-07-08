// @components/predict/GameIntroCard.jsx
// Updated: 2025-06-28T02:54 EDT
// Dynamic game header card with odds, jackpot, draw countdown, and feature tags

import { useEffect, useState } from "react";
import { getGameMeta } from "@/lib/gameConfig";
import { getNextDrawTime } from "@/lib/drawDataUtils";

export default function GameIntroCard({ game }) {
  const [meta, setMeta] = useState({});
  const [nextDraw, setNextDraw] = useState(null);

  useEffect(() => {
    const load = async () => {
      const conf = getGameMeta(game);
      setMeta(conf);
      const next = await getNextDrawTime(game);
      setNextDraw(next);
    };
    load();
  }, [game]);

  const drawIn = nextDraw
    ? Math.max(0, Math.floor((new Date(nextDraw) - Date.now()) / 1000 / 60))
    : null;

  return (
    <div className="bg-neutral-950 border border-yellow-500 p-4 mb-4 rounded text-sm text-neutral-300 flex flex-col gap-1">

      <div className="flex justify-between items-center">
        <h2 className="text-yellow-300 font-bold text-base uppercase">
          {meta.name || game}
        </h2>
        {meta.jackpot && (
          <p className="text-green-400 font-mono text-lg">
            💰 ${meta.jackpot.toLocaleString()}
          </p>
        )}
      </div>

      {/* Optional variant flags */}
      {meta.variants?.includes("fireball") && (
        <p>🔥 Fireball active • Win more ways</p>
      )}
      {meta.variants?.includes("double") && (
        <p>🎯 Double Play enabled • Bonus draw in play</p>
      )}

      <p>🎰 Odds: {meta.odds || "Varies by combo"}</p>

      {drawIn !== null && (
        <p className="italic text-yellow-500">
          Next draw in ~{drawIn} min
        </p>
      )}
    </div>
  );
}