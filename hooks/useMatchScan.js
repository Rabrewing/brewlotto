// @hooks/useMatchScan.js
// @Timestamp 2025-06-28T01:31EDT
// Compares predicted numbers to actual draw and returns match score, commentary, and hit map

export function useMatchScan() {
    const scoreMatch = (predicted = [], actual = []) => {
        if (!predicted.length || !actual.length) return { score: 0, commentary: "No data", hits: [] };

        const hits = predicted.map((num, i) => num === actual[i]);
        const numHits = hits.filter(Boolean).length;
        const score = parseFloat((numHits / actual.length).toFixed(2));

        let commentary = "No match";
        if (score === 1) commentary = "🎯 Perfect match!";
        else if (score >= 0.66) commentary = "🔥 Close — strong alignment";
        else if (score >= 0.33) commentary = "🟡 Partial hit — check positioning";
        else commentary = "❌ Miss — but insight still counts";

        return { score, commentary, hits };
    };

    return { scoreMatch };
}