// /utils/analyzeMega.js
export function analyzeMega(draws, opts = {}) {
    // Main numbers (1-70), Mega Ball (1-25)
    const freq = Array(70).fill(0);
    const megaFreq = Array(25).fill(0);
    for (const row of draws) {
        if (!row) continue;
        const main = (row.numbers || row[0]) || [];
        main.forEach((num) => {
            if (typeof num === "number") freq[num - 1]++;
        });
        const mb = row.megaBall || (Array.isArray(row) && row[5]);
        if (typeof mb === "number") megaFreq[mb - 1]++;
    }
    return { freq, megaFreq };
}
