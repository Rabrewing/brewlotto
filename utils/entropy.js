// @utils/entropy.js
// Summary: Calculates normalized entropy (0–100 scale) of number frequency in draw history

export function calculateEntropy(drawHistory = []) {
    if (!Array.isArray(drawHistory) || drawHistory.length === 0) return 0;

    const freqMap = {};

    for (const draw of drawHistory) {
        for (const num of draw) {
            freqMap[num] = (freqMap[num] || 0) + 1;
        }
    }

    const totalNumbers = Object.values(freqMap).reduce((sum, count) => sum + count, 0);
    const probabilities = Object.values(freqMap).map((count) => count / totalNumbers);

    // Shannon entropy formula: -Σ(p * log2(p))
    const rawEntropy = -probabilities.reduce((acc, p) => acc + p * Math.log2(p), 0);

    // Normalize between 0 and 100 based on possible max entropy
    const maxEntropy = Math.log2(Object.keys(freqMap).length || 1);
    const normalized = (rawEntropy / maxEntropy) * 100;

    return Number(normalized.toFixed(2));
}