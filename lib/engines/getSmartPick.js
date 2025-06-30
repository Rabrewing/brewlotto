// @status: 🟡 Modernized (Not in use — legacy Brew 1 utility)
// @source: /utils/getSmartPick.js
// @proposedUse: Alternative prediction method based on lightweight analysis
// @lastUpdated: 2025-06-27

import { fetchStats } from "@/utils/fetchStats";
import { poissonHotCold } from "@/lib/analysis/poissonHotCold";
import { marketAnalysis } from "@/lib/analysis/marketAnalysis";

export async function getSmartPick(game, strategy, opts = {}) {
    const stats = await fetchStats(game, opts);

    if (strategy === "momentum") {
        return poissonHotCold(game, stats, opts);
    }

    if (strategy === "filtered") {
        return marketAnalysis(game, stats, opts);
    }

    return marketAnalysis(game, stats, { ...opts, strategy: "random" });
}