// @status: ✅ Refactored (live-ready)
// @lastUpdated: 2025-06-27
// @purpose: Analyze Powerball draw frequency (main numbers + Powerball)

export function analyzePowerball(draws, opts = {}) {
    const freq = Array(69).fill(0);     // Main numbers: 1–69
    const pbFreq = Array(26).fill(0);   // Powerball: 1–26

    for (const row of draws) {
        if (!row) continue;

        const main = row.numbers || row[0] || [];
        main.forEach((num) => {
            if (typeof num === 'number') freq[num - 1]++;
        });

        const pb = row.powerball || (Array.isArray(row) && row[5]);
        if (typeof pb === 'number') pbFreq[pb - 1]++;
    }

    return { freq, pbFreq };
}