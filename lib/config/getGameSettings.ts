import * as source from "./getGameSettings.js";

export const GAME_SETTINGS: any = source.GAME_SETTINGS as any;
export function getGameSettings(game: string): any {
  return source.getGameSettings(game) as any;
}
