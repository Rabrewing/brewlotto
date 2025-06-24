// /utils/analyzePick3.js
export function analyzePick3(draws, opts = {}) {
    // Frequency for each digit (0-9), per position
    const freq = Array(3).fill().map(() => Array(10).fill(0));
    for (const row of draws) {
        (row || []).forEach((num, idx) => {
            if (typeof num === "number") freq[idx][num]++;
        });
    }
    return { freq };
}
