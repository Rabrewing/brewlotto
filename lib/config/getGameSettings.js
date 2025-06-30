// @status: ✅ Refactored (fully merged, all metadata preserved)
// @lastUpdated: 2025-06-27
// @purpose: Centralized game configuration for digits, odds, costs, draw times, and ranges

export const GAME_SETTINGS = {
    pick3: {
        label: "Pick 3",
        odds: "1 in 1,000",
        digits: 3,
        min: 0,
        max: 9,
        cost: 1,
        drawsPerDay: 2,
        drawTimes: ["3:00 p.m.", "11:22 p.m."]
    },
    pick4: {
        label: "Pick 4",
        odds: "1 in 10,000",
        digits: 4,
        min: 0,
        max: 9,
        cost: 1,
        drawsPerDay: 2,
        drawTimes: ["3:00 p.m.", "11:22 p.m."]
    },
    pick5: {
        label: "Pick 5",
        odds: "1 in 100,000",
        digits: 5,
        min: 0,
        max: 9,
        cost: 1,
        drawsPerDay: 2,
        drawTimes: ["3:00 p.m.", "11:22 p.m."]
    },
    mega: {
        label: "Mega Millions",
        odds: "1 in 302,575,350",
        digits: 5,
        min: 1,
        max: 70,
        megaBallMin: 1,
        megaBallMax: 25,
        cost: 2,
        drawsPerWeek: 2,
        drawTimes: ["Tuesday", "Friday 11:00 p.m."]
    },
    powerball: {
        label: "Powerball",
        odds: "1 in 292,201,338",
        digits: 5,
        min: 1,
        max: 69,
        powerBallMin: 1,
        powerBallMax: 26,
        cost: 2,
        drawsPerWeek: 3,
        drawTimes: ["Monday", "Wednesday", "Saturday 11:00 p.m."]
    }
};

/**
 * Returns the game settings object by game key (e.g., 'pick3', 'mega', etc.)
 * @param {string} game
 * @returns {object|null}
 */
export function getGameSettings(game) {
    return GAME_SETTINGS[game] || null;
}