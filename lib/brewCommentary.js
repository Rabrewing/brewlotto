// @lib/brewCommentary.js
// @Timestamp 2025-06-28T01:58EDT
// BrewBot insight engine: analyzes prediction quality, frequency bias, entropy, and match performance

import { getDrawStats } from "./useDrawStats";
import { getEntropyScore } from "./entropyUtils";
import { getGameConfig } from "./gameConfig";

export async function brewAnalyzePick({
    prediction = [],
    lastDraw = {},
    game = "pick3",
    strategy = "",
    tier = "free",
    score = 0,
    hits = []
}) {
    if (!Array.isArray(prediction) || prediction.length === 0) {
        return "No insight available — prediction incomplete.";
    }

    const insights = [];

    // 🎯 Match performance
    const pct = parseFloat(score);
    const totalHits = hits?.filter(Boolean).length || 0;

    if (pct === 1) {
        insights.push("🎯 Full match! Brew calls that a BrewStrike™.");
    } else if (pct >= 0.67) {
        insights.push("🔥 Strong alignment — numbers are entering sync.");
    } else if (pct >= 0.33) {
        if (hits?.[0]) insights.push("🟡 Front digit locked — early signal forming.");
        if (hits?.[hits.length - 1]) insights.push("🟡 Tail matched — end-pattern detected.");
        if (!hits?.includes(true)) insights.push("🟡 Mild overlap detected.");
    } else if (totalHits > 0) {
        insights.push(`⚠️ Tagged ${totalHits} digit${totalHits > 1 ? "s" : ""} — residue or rising trail.`);
    } else {
        insights.push("❌ No alignment. Brew suggests cycle shift or volatility.");
    }

    // 🔁 Overlap with previous draw
    const carry = prediction.filter(n => lastDraw?.numbers?.includes(n));
    if (carry.length >= 2) {
        insights.push("Two numbers rolled over from last draw — heat or echo? ⚡️");
    } else if (carry.length === 1) {
        insights.push("One repeat from previous — Brew flags as neutral.");
    }

    // 🔥 Hot & cold
    const stats = await getDrawStats(game);
    const hotHits = prediction.filter(n => stats?.hot?.includes(n));
    if (hotHits.length) {
        insights.push(`🔥 Fire active on ${hotHits.join(", ")} — trend confirmed.`);
    }

    const coldHits = prediction.filter(n => stats?.cold?.includes(n));
    if (coldHits.length === prediction.length) {
        insights.push("❄️ Full cold pick — iced out.");
    }

    // 🧪 Entropy
    const entropy = getEntropyScore(prediction);
    if (entropy < 0.45) {
        insights.push("🧩 Low entropy — too clean, vulnerable to chaos.");
    } else if (entropy > 0.9) {
        insights.push("🎲 Max entropy — full lottery soup.");
    }

    // 🧠 Strategy logic
    if (tier !== "free" && strategy.includes("poisson")) {
        insights.push("📈 Poisson-tier patterning applied.");
    } else if (strategy === "momentum") {
        insights.push("🚀 Momentum logic active — scanning recent heat.");
    }

    // 🛡️ Tier cap
    if (tier === "free" && insights.length > 3) {
        return `${insights.slice(0, 3).join(" ")} Upgrade for deeper analysis 🟨`;
    }

    return insights.join(" ");
}