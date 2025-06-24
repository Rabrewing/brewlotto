// /utils/fetchStats.js
import { fetchRecentDraws } from "./fetchDraws";
import { analyzePick3 } from "./analyzePick3";
import { analyzePick4 } from "./analyzePick4";
import { analyzePick5 } from "./analyzePick5";
import { analyzeMega } from "./analyzeMega";
import { analyzePowerball } from "./analyzePowerball";

// Dispatch to the right analyzer based on game type
export async function fetchStats(game, opts = {}) {
    let draws = [];
    if (game === "pick3") {
        draws = await fetchRecentDraws("pick3_draws", 200);
        return analyzePick3(draws, opts);
    }
    if (game === "pick4") {
        draws = await fetchRecentDraws("pick4_draws", 200);
        return analyzePick4(draws, opts);
    }
    if (game === "pick5") {
        draws = await fetchRecentDraws("pick5_draws", 200);
        return analyzePick5(draws, opts);
    }
    if (game === "mega") {
        draws = await fetchRecentDraws("mega_draws", 100);
        return analyzeMega(draws, opts);
    }
    if (game === "powerball") {
        draws = await fetchRecentDraws("powerball_draws", 100);
        return analyzePowerball(draws, opts);
    }
    throw new Error("Unsupported game type");
}
