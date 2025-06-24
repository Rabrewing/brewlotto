// /utils/getGameSettings.js
import { GAME_SETTINGS } from "./gameSettings";

/**
 * Returns the settings object for a given game key (e.g., 'pick3', 'mega', etc.)
 * @param {string} game
 * @returns {object|null}
 */
export function getGameSettings(game) {
    return GAME_SETTINGS[game] || null;
}
