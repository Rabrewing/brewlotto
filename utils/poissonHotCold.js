// /utils/poissonHotCold.js
// Applies Poisson stats for hot/cold detection
export function poissonHotCold(game, stats, opts = {}) {
    // Accepts stats from analyzePickX/mega/powerball
    let freq = [];
    let msg = "";
    if (game.startsWith("pick")) {
        // For pick3, pick4, pick5 — avg over positions
        const positions = stats.freq || [];
        freq = positions.reduce((a, b) => a.map((v, i) => v + b[i]), Array(10).fill(0))
            .map(f => Math.round(f / positions.length));
        msg = `Top digits by Poisson frequency: ${freq
            .map((v, i) => ({ d: i, c: v }))
            .sort((a, b) => b.c - a.c)
            .slice(0, 3)
            .map(x => x.d)
            .join(", ")}`;
        return { numbers: freq.slice(0, 3), strategy: "poisson-hot", explanation: msg };
    }
    // For mega: freq, megaFreq; for powerball: freq, pbFreq
    // Just show top 5/1 for demo
    if (game === "mega" && stats.freq && stats.megaFreq) {
        const main = stats.freq.map((c, n) => ({ n: n + 1, c }))
            .sort((a, b) => b.c - a.c)
            .slice(0, 5)
            .map(x => x.n);
        const mb = stats.megaFreq.map((c, n) => ({ n: n + 1, c }))
            .sort((a, b) => b.c - a.c)
            .slice(0, 1)
            .map(x => x.n);
        return {
            numbers: main,
            megaBall: mb[0],
            strategy: "poisson-hot",
            explanation: `Top 5: ${main.join(", ")} | MB: ${mb[0]}`
        };
    }
    if (game === "powerball" && stats.freq && stats.pbFreq) {
        const main = stats.freq.map((c, n) => ({ n: n + 1, c }))
            .sort((a, b) => b.c - a.c)
            .slice(0, 5)
            .map(x => x.n);
        const pb = stats.pbFreq.map((c, n) => ({ n: n + 1, c }))
            .sort((a, b) => b.c - a.c)
            .slice(0, 1)
            .map(x => x.n);
        return {
            numbers: main,
            powerball: pb[0],
            strategy: "poisson-hot",
            explanation: `Top 5: ${main.join(", ")} | PB: ${pb[0]}`
        };
    }
    return { error: "Poisson analysis not implemented for game." };
}
