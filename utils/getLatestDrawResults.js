import { getLatestDrawResults as getPick3LatestDrawResults } from "../lib/data/getLatestDrawResults.js";

const EMPTY_PICK_DRAWS = {
  draws: {
    day: null,
    evening: null,
  },
};

const EMPTY_JACKPOT_DRAWS = {
  lastDraw: null,
  nextDraw: null,
};

export async function getLatestDrawResults(game) {
  switch (game) {
    case "pick3":
      return getPick3LatestDrawResults(game);
    case "pick4":
    case "pick5":
      return EMPTY_PICK_DRAWS;
    case "mega":
    case "powerball":
      return EMPTY_JACKPOT_DRAWS;
    default:
      return { draws: {} };
  }
}
