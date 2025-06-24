// /utils/analyzePowerball.js
export function analyzePowerball(draws, opts = {}) {
    // Main numbers (1-69), Powerball (1-26)
    const freq = Array(69).fill(0);
    const pbFreq = Array(26).fill(0);
    for (const row of draws) {
        if (!row) continue;
        const main = (row.numbers || row[0]) || [];
        main.forEach((num) => {
            if (typeof num === "number") freq[num - 1]++;
        });
        const pb = row.powerball || (Array.isArray(row) && row[5]);
        if (typeof pb === "number") pbFreq[pb - 1]++;
    }
    return { freq, pbFreq };
}
