// @lib/matchPredictionToDraw.js
// @Timestamp 2025-06-27T23:58EDT
// Compares prediction to posted draw, computes match %, flags win/near miss

export function matchPrediction({ predictionNums, actualDraw, game }) {
    if (!predictionNums || !actualDraw) return null;

    const { numbers = [], fireball = null } = actualDraw;
    let matches = 0;

    predictionNums.forEach((num, i) => {
        if (numbers[i] === num) matches++;
    });

    const matchScore = matches / numbers.length;

    const notes = [];
    if (fireball && predictionNums.includes(fireball)) {
        notes.push(`Fireball match → ${fireball}`);
    }
    if (matchScore === 1) notes.push("Perfect match 🏆");
    else if (matchScore >= 0.66) notes.push("Strong alignment 💪");
    else if (matchScore >= 0.33) notes.push("Partial hit 🤏");

    return {
        score: matchScore.toFixed(2),
        matches,
        commentary: notes.join(" • ")
    };
}