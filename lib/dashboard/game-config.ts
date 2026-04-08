export type DashboardGameId = 'pick3' | 'pick4' | 'cash5' | 'powerball' | 'mega';

interface DashboardGameConfigEntry {
  requestGameKey: string;
  requestState: string;
  statsStateCode: string;
  statsGameKey: string;
  predictionGame: string;
  predictionStates: string[];
  displayLabel: string;
  bonusLabel: string;
}

export const DASHBOARD_GAME_CONFIG: Record<DashboardGameId, DashboardGameConfigEntry> = {
  pick3: {
    requestGameKey: 'pick3',
    requestState: 'NC',
    statsStateCode: 'NC',
    statsGameKey: 'pick3',
    predictionGame: 'pick3',
    predictionStates: ['NC'],
    displayLabel: 'Pick 3',
    bonusLabel: 'Bonus',
  },
  pick4: {
    requestGameKey: 'pick4',
    requestState: 'NC',
    statsStateCode: 'NC',
    statsGameKey: 'pick4',
    predictionGame: 'pick4',
    predictionStates: ['NC'],
    displayLabel: 'Pick 4',
    bonusLabel: 'Bonus',
  },
  cash5: {
    requestGameKey: 'cash5',
    requestState: 'NC',
    statsStateCode: 'NC',
    statsGameKey: 'cash5',
    predictionGame: 'cash5',
    predictionStates: ['NC'],
    displayLabel: 'Cash 5',
    bonusLabel: 'Bonus',
  },
  powerball: {
    requestGameKey: 'powerball',
    requestState: 'MULTI',
    statsStateCode: 'NC',
    statsGameKey: 'powerball',
    predictionGame: 'powerball',
    predictionStates: ['MULTI', 'NC'],
    displayLabel: 'Powerball',
    bonusLabel: 'Powerball',
  },
  mega: {
    requestGameKey: 'megamillions',
    requestState: 'MULTI',
    statsStateCode: 'NC',
    statsGameKey: 'mega_millions',
    predictionGame: 'mega_millions',
    predictionStates: ['MULTI', 'NC'],
    displayLabel: 'Mega Millions',
    bonusLabel: 'Mega Ball',
  },
};
