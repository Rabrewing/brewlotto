// @hooks/usePredictionEngine.js
// @Timestamp 2025-06-28T01:23EDT
// Central hook to generate predictions based on selected strategies + game context + tier
// Routes to matching logic from /lib/strategyEngine.js

import { useState } from "react";
import { useUserTier } from "@/lib/useUserTier";
import {
    runPoisson,
    runPoissonPlus,
    runMarkovPlus,
    hotCold,
    momentum,
    random,
} from "@/lib/strategyEngine";

export function usePredictionEngine({ game }) {
    const { tier } = useUserTier();
    const [status, setStatus] = useState("idle"); // idle | running | done | error
    const [lastStrategies, setLastStrategies] = useState([]);
    const [result, setResult] = useState([]);

    const STRATEGY_MAP = {
        random,
        hotCold,
        momentum,
        poisson: runPoisson,
        "poisson++": runPoissonPlus,
        "markov++": runMarkovPlus,
    };

    const canUseStrategy = (id) => {
        if (["poisson++", "markov++"].includes(id)) return tier === "master";
        if (id === "poisson") return tier !== "free";
        return true;
    };

    const generate = async (strategies = ["random"]) => {
        setStatus("running");
        try {
            const valid = strategies.filter(canUseStrategy);
            setLastStrategies(valid);

            const allSets = await Promise.all(
                valid.map(async (s) => {
                    const runner = STRATEGY_MAP[s];
                    return runner ? await runner(game) : [];
                })
            );

            // For now, ensemble logic = flatten + pick first valid
            const merged = [...new Set(allSets.flat())].slice(0, game === "pick3" ? 3 : game === "pick4" ? 4 : 5);
            setResult(merged);
            setStatus("done");
            return merged;
        } catch (err) {
            console.error("Prediction error:", err);
            setStatus("error");
            return [];
        }
    };

    return {
        generate,
        result,
        status,
        lastStrategies,
    };
}