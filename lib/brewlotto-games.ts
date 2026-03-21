// Stub for brewlotto-games - to be replaced with actual implementation from database or config
export type GameKey = 'pick3' | 'pick4' | 'cash5' | 'powerball' | 'mega-millions';
export type GameConfig = {
  label: string;
  primaryCount: number;
  primaryMin: number;
  primaryMax: number;
  hasBonus?: boolean;
  bonusCount?: number;
  bonusMin?: number;
  bonusMax?: number;
  bonusLabel?: string;
};

export const GAME_CONFIGS: Record<GameKey, GameConfig> = {
  pick3: { label: 'Pick 3', primaryCount: 3, primaryMin: 0, primaryMax: 9 },
  pick4: { label: 'Pick 4', primaryCount: 4, primaryMin: 0, primaryMax: 9 },
  cash5: { label: 'Cash 5', primaryCount: 5, primaryMin: 1, primaryMax: 43 },
  powerball: { 
    label: 'Powerball', 
    primaryCount: 5, 
    primaryMin: 1, 
    primaryMax: 69, 
    hasBonus: true, 
    bonusCount: 1, 
    bonusMin: 1, 
    bonusMax: 26 
  },
  'mega-millions': { 
    label: 'Mega', 
    primaryCount: 5, 
    primaryMin: 1, 
    primaryMax: 70, 
    hasBonus: true, 
    bonusCount: 1, 
    bonusMin: 1, 
    bonusMax: 25 
  }
};

export const DEFAULT_GAME: GameKey = 'powerball';

export function getOrderedGames(): { key: GameKey; label: string }[] {
  return [
    { key: 'pick3', label: 'Pick 3' },
    { key: 'pick4', label: 'Pick 4' },
    { key: 'cash5', label: 'Cash 5' },
    { key: 'powerball', label: 'Powerball' },
    { key: 'mega-millions', label: 'Mega' }
  ];
}