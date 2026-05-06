export type DashboardStateCode = 'NC' | 'CA';
export type DashboardGameId = 'pick3' | 'pick4' | 'cash5' | 'powerball' | 'mega';

interface DashboardGameConfigEntry {
  requestGameKey: string;
  statsGameKey: Record<DashboardStateCode, string>;
  predictionGame: string;
  primaryCount: number;
  hasBonus: boolean;
  bonusLabel: string;
  tabLabelByState: Record<DashboardStateCode, string>;
  displayLabelByState: Record<DashboardStateCode, string>;
}

interface ResolvedDashboardGameConfig extends Omit<DashboardGameConfigEntry, 'statsGameKey'> {
  requestState: DashboardStateCode | 'MULTI';
  statsStateCode: DashboardStateCode;
  statsGameKey: string;
  predictionStates: string[];
  tabLabel: string;
  displayLabel: string;
}

const DASHBOARD_GAME_CONFIG_BASE: Record<DashboardGameId, DashboardGameConfigEntry> = {
  pick3: {
    requestGameKey: 'pick3',
    statsGameKey: { NC: 'pick3', CA: 'daily3' },
    predictionGame: 'pick3',
    primaryCount: 3,
    hasBonus: false,
    bonusLabel: 'Bonus',
    tabLabelByState: {
      NC: 'Pick 3',
      CA: 'Daily 3',
    },
    displayLabelByState: {
      NC: 'Pick 3',
      CA: 'Daily 3',
    },
  },
  pick4: {
    requestGameKey: 'pick4',
    statsGameKey: { NC: 'pick4', CA: 'daily4' },
    predictionGame: 'pick4',
    primaryCount: 4,
    hasBonus: false,
    bonusLabel: 'Bonus',
    tabLabelByState: {
      NC: 'Pick 4',
      CA: 'Daily 4',
    },
    displayLabelByState: {
      NC: 'Pick 4',
      CA: 'Daily 4',
    },
  },
  cash5: {
    requestGameKey: 'cash5',
    statsGameKey: { NC: 'cash5', CA: 'fantasy5' },
    predictionGame: 'cash5',
    primaryCount: 5,
    hasBonus: false,
    bonusLabel: 'Bonus',
    tabLabelByState: {
      NC: 'Cash 5',
      CA: 'Fantasy 5',
    },
    displayLabelByState: {
      NC: 'Cash 5',
      CA: 'Fantasy 5',
    },
  },
  powerball: {
    requestGameKey: 'powerball',
    statsGameKey: { NC: 'powerball', CA: 'powerball' },
    predictionGame: 'powerball',
    primaryCount: 5,
    hasBonus: true,
    bonusLabel: 'Powerball',
    tabLabelByState: {
      NC: 'Powerball',
      CA: 'Powerball',
    },
    displayLabelByState: {
      NC: 'Powerball',
      CA: 'Powerball',
    },
  },
  mega: {
    requestGameKey: 'megamillions',
    statsGameKey: { NC: 'mega_millions', CA: 'mega_millions' },
    predictionGame: 'mega_millions',
    primaryCount: 5,
    hasBonus: true,
    bonusLabel: 'Mega Ball',
    tabLabelByState: {
      NC: 'Mega',
      CA: 'Mega',
    },
    displayLabelByState: {
      NC: 'Mega Millions',
      CA: 'Mega Millions',
    },
  },
};

const MULTI_STATE_PREDICTION_STATES = ['MULTI', 'NC', 'CA'];

export function resolveDashboardGameConfig(
  game: DashboardGameId,
  state: DashboardStateCode,
): ResolvedDashboardGameConfig | null {
  const base = DASHBOARD_GAME_CONFIG_BASE[game];

  if (!base) {
    return null;
  }

  const { statsGameKey: _statsGameKey, ...baseConfig } = base;

  return {
    ...baseConfig,
    requestState: state === 'CA' || state === 'NC' ? state : 'NC',
    statsStateCode: state,
    statsGameKey: base.statsGameKey[state],
    predictionStates: base.hasBonus
      ? MULTI_STATE_PREDICTION_STATES
      : [state],
    tabLabel: base.tabLabelByState[state],
    displayLabel: base.displayLabelByState[state],
  };
}

export function getDashboardGameTabs(state: DashboardStateCode) {
  return (Object.keys(DASHBOARD_GAME_CONFIG_BASE) as DashboardGameId[]).map((game) => {
    const config = resolveDashboardGameConfig(game, state);
    if (!config) {
      return null;
    }

    return {
      id: game,
      label: config.tabLabel,
    };
  }).filter(Boolean) as { id: DashboardGameId; label: string }[];
}

export function getDashboardDefaultGame(state: DashboardStateCode): DashboardGameId {
  return state === 'CA' ? 'pick3' : 'pick3';
}

export const DASHBOARD_GAME_CONFIG = DASHBOARD_GAME_CONFIG_BASE;
