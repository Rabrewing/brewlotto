// /utils/analyzePick4.js
export function analyzePick4(draws, opts = {}) {
    const freq = Array(4).fill().map(() => Array(10).fill(0));
    for (const row of draws) {
        (row || []).forEach((num, idx) => {
            if (typeof num === "number") freq[idx][num]++;
        });
    }
    return { freq };
}
