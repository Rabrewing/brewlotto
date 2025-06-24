// /utils/getSmartPick.js
import { fetchStats } from "@/utils/fetchStats"; // if using path alias
import { poissonHotCold } from "./poissonHotCold";
import { marketAnalysis } from "./marketAnalysis";

export async function getSmartPick(game, strategy, opts = {}) {
    const stats = await fetchStats(game, opts);
    if (strategy === "momentum") {
        // Use Poisson hot/cold or similar
        return poissonHotCold(game, stats, opts);
    }
    if (strategy === "filtered") {
        // Use filtered random or hybrid logic
        return marketAnalysis(game, stats, opts);
    }
    // Fallback: Random pick
    return marketAnalysis(game, stats, { ...opts, strategy: "random" });
}
