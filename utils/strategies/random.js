export async function runRandom(game) {
    const poolSize = {
        'Pick 3': 10,
        'Pick 4': 10,
        'Pick 5': 43,
        'Mega Millions': 70,
        'Powerball': 69
    };

    const count = parseInt(game.match(/\d+/)?.[0] || 5);
    const pool = poolSize[game] || 50;

    const picks = new Set();
    while (picks.size < count) {
        picks.add(Math.floor(Math.random() * pool));
    }

    return {
        numbers: Array.from(picks).sort((a, b) => a - b),
        score: Math.random()
    };
}