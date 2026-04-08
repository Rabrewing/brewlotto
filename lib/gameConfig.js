// @lib/gameConfig.js
// Summary: Game metadata and configuration

export function getGameMeta(game) {
    const gameConfigs = {
        pick3: {
            name: "Pick 3",
            odds: "1 in 1,000",
            jackpot: 500,
            description: "Pick 3 numbers (0-9)",
        },
        pick4: {
            name: "Pick 4",
            odds: "1 in 10,000",
            jackpot: 5000,
            description: "Pick 4 numbers (0-9)",
        },
        cash5: {
            name: "Cash 5",
            odds: "1 in 962,598",
            jackpot: "100,000+",
            description: "Pick 5 numbers (1-43)",
        },
        powerball: {
            name: "Powerball",
            odds: "1 in 292,201,338",
            jackpot: "Rolling jackpot",
            description: "5 numbers + Powerball",
        },
        mega: {
            name: "Mega Millions",
            odds: "1 in 302,575,350",
            jackpot: "Rolling jackpot",
            description: "5 numbers + Mega Ball",
        },
    };

    return gameConfigs[game] || gameConfigs.pick3;
}
