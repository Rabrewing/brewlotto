// /utils/analyzePick5.js
export function analyzePick5(draws, opts = {}) {
    const freq = Array(5).fill().map(() => Array(10).fill(0));
    for (const row of draws) {
        (row || []).forEach((num, idx) => {
            if (typeof num === "number") freq[idx][num]++;
        });
    }
    return { freq };
}
