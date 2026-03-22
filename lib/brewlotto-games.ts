/**
 * BrewLotto V1 - Game Configuration & State-Aware Game Presentation
 * -----------------------------------------------------------------
 * Canonical game keys and state-specific display labels for NC and CA.
 * Multi-state games (Powerball, Mega Millions) are shared across states.
 */

// ─── Canonical Game Keys ────────────────────────────────────────────────────
export type GameKey = 'pick3' | 'pick4' | 'cash5' | 'powerball' | 'mega_millions';

// ─── State Types ────────────────────────────────────────────────────────────
export type StateKey = 'nc' | 'ca';

// ─── Game Configuration ─────────────────────────────────────────────────────
export interface GameConfig {
  label: string;
  primaryCount: number;
  primaryMin: number;
  primaryMax: number;
  hasBonus?: boolean;
  bonusCount?: number;
  bonusMin?: number;
  bonusMax?: number;
  bonusLabel?: string;
}

// ─── State-Game Mapping ─────────────────────────────────────────────────────
export interface StateGameMapping {
  state: StateKey;
  gameKey: GameKey;
  displayLabel: string;
  shortLabel?: string;
  isMultiState?: boolean;
}

// ─── Canonical Game Configs ─────────────────────────────────────────────────
export const GAME_CONFIGS: Record<GameKey, GameConfig> = {
  pick3: {
    label: 'Pick 3',
    primaryCount: 3,
    primaryMin: 0,
    primaryMax: 9,
  },
  pick4: {
    label: 'Pick 4',
    primaryCount: 4,
    primaryMin: 0,
    primaryMax: 9,
  },
  cash5: {
    label: 'Cash 5',
    primaryCount: 5,
    primaryMin: 1,
    primaryMax: 43,
  },
  powerball: {
    label: 'Powerball',
    primaryCount: 5,
    primaryMin: 1,
    primaryMax: 69,
    hasBonus: true,
    bonusCount: 1,
    bonusMin: 1,
    bonusMax: 26,
    bonusLabel: 'Powerball',
  },
  mega_millions: {
    label: 'Mega Millions',
    primaryCount: 5,
    primaryMin: 1,
    primaryMax: 70,
    hasBonus: true,
    bonusCount: 1,
    bonusMin: 1,
    bonusMax: 25,
    bonusLabel: 'Mega Ball',
  },
};

// ─── State-Specific Game Mappings ───────────────────────────────────────────
export const STATE_GAMES: Record<StateKey, StateGameMapping[]> = {
  nc: [
    { state: 'nc', gameKey: 'pick3', displayLabel: 'Pick 3', shortLabel: 'Pick 3' },
    { state: 'nc', gameKey: 'pick4', displayLabel: 'Pick 4', shortLabel: 'Pick 4' },
    { state: 'nc', gameKey: 'cash5', displayLabel: 'Cash 5', shortLabel: 'Cash 5' },
    { state: 'nc', gameKey: 'powerball', displayLabel: 'Powerball', shortLabel: 'PB', isMultiState: true },
    { state: 'nc', gameKey: 'mega_millions', displayLabel: 'Mega', shortLabel: 'Mega', isMultiState: true },
  ],
  ca: [
    { state: 'ca', gameKey: 'pick3', displayLabel: 'Daily 3', shortLabel: 'Daily 3' },
    { state: 'ca', gameKey: 'pick4', displayLabel: 'Daily 4', shortLabel: 'Daily 4' },
    { state: 'ca', gameKey: 'cash5', displayLabel: 'Fantasy 5', shortLabel: 'Fantasy 5' },
    { state: 'ca', gameKey: 'powerball', displayLabel: 'Powerball', shortLabel: 'PB', isMultiState: true },
    { state: 'ca', gameKey: 'mega_millions', displayLabel: 'Mega', shortLabel: 'Mega', isMultiState: true },
  ],
};

// ─── Default Values ─────────────────────────────────────────────────────────
export const DEFAULT_GAME: GameKey = 'powerball';
export const DEFAULT_STATE: StateKey = 'nc';

// ─── Helper Functions ───────────────────────────────────────────────────────

/**
 * Get ordered games for a specific state with display labels.
 */
export function getStateGames(state: StateKey): StateGameMapping[] {
  return STATE_GAMES[state] ?? STATE_GAMES[DEFAULT_STATE];
}

/**
 * Get display label for a game in a specific state.
 */
export function getDisplayLabel(state: StateKey, gameKey: GameKey): string {
  const stateGames = getStateGames(state);
  const mapping = stateGames.find((g) => g.gameKey === gameKey);
  return mapping?.displayLabel ?? GAME_CONFIGS[gameKey]?.label ?? gameKey;
}

/**
 * Get short label for a game in a specific state.
 */
export function getShortLabel(state: StateKey, gameKey: GameKey): string {
  const stateGames = getStateGames(state);
  const mapping = stateGames.find((g) => g.gameKey === gameKey);
  return mapping?.shortLabel ?? mapping?.displayLabel ?? GAME_CONFIGS[gameKey]?.label ?? gameKey;
}

/**
 * Check if a game is multi-state (Powerball, Mega Millions).
 */
export function isMultiStateGame(gameKey: GameKey): boolean {
  return gameKey === 'powerball' || gameKey === 'mega_millions';
}

/**
 * Get default state (for fallback when no profile exists).
 */
export function getDefaultState(): StateKey {
  return DEFAULT_STATE;
}

/**
 * Get ordered games for display in UI (state-aware).
 * Returns { key, label } array compatible with GameTabs.
 */
export function getOrderedGamesForState(state: StateKey): { key: GameKey; label: string }[] {
  return getStateGames(state).map((g) => ({
    key: g.gameKey,
    label: g.displayLabel,
  }));
}

/**
 * Get the canonical ordered games (legacy support).
 * Returns { key, label } array using NC labels.
 */
export function getOrderedGames(): { key: GameKey; label: string }[] {
  return getOrderedGamesForState(DEFAULT_STATE);
}

/**
 * Parse state from string, fallback to default.
 */
export function parseState(state: string | null | undefined): StateKey {
  if (state === 'nc' || state === 'ca') return state;
  return DEFAULT_STATE;
}

/**
 * Get display name for a state.
 */
export function getStateDisplayName(state: StateKey): string {
  return state === 'nc' ? 'North Carolina' : 'California';
}

/**
 * Get short display name for a state.
 */
export function getStateShortName(state: StateKey): string {
  return state === 'nc' ? 'NC' : 'CA';
}
