export type PayoutTierDetail = {
  name: string;
  odds?: string;
  note: string;
};

export type BrewwuPayoutGuide = {
  id: 'pick3' | 'pick4' | 'cash5' | 'powerball' | 'mega';
  title: string;
  label: string;
  summary: string;
  tiers: PayoutTierDetail[];
  aiHint: string;
  source: string;
};

export type SettlementStyleHint = 'straight' | 'box' | 'straight_box' | 'combo' | 'pair' | 'add_on' | null;

export type SettlementClassification = {
  resultCode: string;
  payoutTier: string | null;
  payoutLabel: string;
  payoutSummary: string;
  isWin: boolean;
  bonusMatch: boolean;
};

function normalizeStrategyHint(value: unknown): SettlementStyleHint {
  const raw = String(value || '').toLowerCase();

  if (raw.includes('straight/box') || raw.includes('straight_box')) {
    return 'straight_box';
  }

  if (raw.includes('straight')) {
    return 'straight';
  }

  if (raw.includes('box')) {
    return 'box';
  }

  if (raw.includes('combo')) {
    return 'combo';
  }

  if (raw.includes('pair')) {
    return 'pair';
  }

  if (raw.includes('fireball') || raw.includes('power play') || raw.includes('double play') || raw.includes('ez match') || raw.includes('megaplier')) {
    return 'add_on';
  }

  return null;
}

function sameMultiset(a: number[], b: number[]) {
  if (a.length !== b.length) {
    return false;
  }

  const sortedA = [...a].sort((left, right) => left - right);
  const sortedB = [...b].sort((left, right) => left - right);
  return sortedA.every((value, index) => value === sortedB[index]);
}

function exactPositions(a: number[], b: number[]) {
  return a.every((value, index) => value === b[index]);
}

function buildPickStyleClassification(
  gameId: 'pick3' | 'pick4',
  playedNumbers: number[],
  officialNumbers: number[],
  strategyHint: SettlementStyleHint,
  bonusMatch: boolean,
  fireballActive: boolean,
): SettlementClassification {
  const positionalExact = exactPositions(playedNumbers, officialNumbers);
  const boxMatch = sameMultiset(playedNumbers, officialNumbers);
  const fireballPrefix = fireballActive ? 'fireball_' : '';
  const fireballLabel = fireballActive ? 'Fireball ' : '';
  const fireballSummary = fireballActive ? ' Fireball was active on this play.' : '';

  if (positionalExact && bonusMatch) {
    return {
      resultCode: `${gameId}_${fireballPrefix}straight_bonus`,
      payoutTier: fireballActive ? 'fireball_straight_bonus' : 'straight_bonus',
      payoutLabel: `${fireballLabel}Straight + bonus`,
      payoutSummary: `Exact-order hit with the game bonus path active.${fireballSummary}`,
      isWin: true,
      bonusMatch,
    };
  }

  if (positionalExact) {
    const isCoverageStyle = strategyHint === 'box' || strategyHint === 'straight_box' || strategyHint === 'combo' || strategyHint === 'pair';
    return {
      resultCode: `${gameId}_${fireballPrefix}${isCoverageStyle ? 'box' : 'straight'}_hit`,
      payoutTier: fireballActive
        ? `fireball_${isCoverageStyle ? 'box_hit' : 'straight_hit'}`
        : isCoverageStyle
          ? 'box_hit'
          : 'straight_hit',
      payoutLabel: `${fireballLabel}${isCoverageStyle ? 'Box / split hit' : 'Straight hit'}`,
      payoutSummary: `${isCoverageStyle ? 'The numbers matched in the expected coverage style.' : 'The numbers matched in exact order.'}${fireballSummary}`,
      isWin: true,
      bonusMatch,
    };
  }

  if (boxMatch) {
    return {
      resultCode: `${gameId}_${fireballPrefix}box_hit`,
      payoutTier: fireballActive ? 'fireball_box_hit' : 'box_hit',
      payoutLabel: `${fireballLabel}Box hit`,
      payoutSummary: `The numbers matched as an any-order box play.${fireballSummary}`,
      isWin: true,
      bonusMatch,
    };
  }

  return {
    resultCode: bonusMatch ? `${gameId}_${fireballPrefix}bonus_only` : `${gameId}_${fireballPrefix}no_match`,
    payoutTier: bonusMatch ? (fireballActive ? 'fireball_bonus_match' : 'bonus_match') : null,
    payoutLabel: bonusMatch ? `${fireballLabel}Bonus match` : fireballActive ? 'Fireball no win' : 'No win',
    payoutSummary: bonusMatch
      ? `The bonus path hit, but the base number set did not fully land.${fireballSummary}`
      : `The pick settled without a winning match.${fireballSummary}`,
    isWin: bonusMatch,
    bonusMatch,
  };
}

function buildMatchNumberClassification(
  gameId: 'cash5' | 'powerball' | 'mega',
  matchCount: number,
  bonusMatch: boolean,
): SettlementClassification {
  if (gameId === 'cash5') {
    if (matchCount >= 5) {
      return {
        resultCode: 'cash5_top_prize',
        payoutTier: 'jackpot',
        payoutLabel: 'Top prize',
        payoutSummary: 'All five main numbers matched.',
        isWin: true,
        bonusMatch,
      };
    }

    if (matchCount === 4) {
      return {
        resultCode: 'cash5_match_4',
        payoutTier: 'match_4',
        payoutLabel: 'Match 4',
        payoutSummary: 'Four of the five main numbers matched.',
        isWin: true,
        bonusMatch,
      };
    }

    if (matchCount === 3) {
      return {
        resultCode: 'cash5_match_3',
        payoutTier: 'match_3',
        payoutLabel: 'Match 3',
        payoutSummary: 'Three of the five main numbers matched.',
        isWin: true,
        bonusMatch,
      };
    }

    if (matchCount === 2) {
      return {
        resultCode: 'cash5_match_2',
        payoutTier: 'match_2',
        payoutLabel: 'Match 2',
        payoutSummary: 'Two of the five main numbers matched.',
        isWin: true,
        bonusMatch,
      };
    }
  }

  if (gameId === 'powerball' || gameId === 'mega') {
    if (matchCount >= 5 && bonusMatch) {
      return {
        resultCode: `${gameId}_jackpot`,
        payoutTier: 'jackpot',
        payoutLabel: 'Jackpot',
        payoutSummary: 'All main numbers and the bonus ball matched.',
        isWin: true,
        bonusMatch,
      };
    }

    if (matchCount >= 5) {
      return {
        resultCode: `${gameId}_match_5`,
        payoutTier: 'match_5',
        payoutLabel: 'Match 5',
        payoutSummary: 'All main numbers matched.',
        isWin: true,
        bonusMatch,
      };
    }

    if (matchCount === 4 && bonusMatch) {
      return {
        resultCode: `${gameId}_match_4_bonus`,
        payoutTier: 'match_4_bonus',
        payoutLabel: 'Match 4 + bonus',
        payoutSummary: 'Four main numbers plus the bonus ball matched.',
        isWin: true,
        bonusMatch,
      };
    }

    if (matchCount === 4) {
      return {
        resultCode: `${gameId}_match_4`,
        payoutTier: 'match_4',
        payoutLabel: 'Match 4',
        payoutSummary: 'Four main numbers matched.',
        isWin: true,
        bonusMatch,
      };
    }

    if (matchCount === 3 && bonusMatch) {
      return {
        resultCode: `${gameId}_match_3_bonus`,
        payoutTier: 'match_3_bonus',
        payoutLabel: 'Match 3 + bonus',
        payoutSummary: 'Three main numbers plus the bonus ball matched.',
        isWin: true,
        bonusMatch,
      };
    }
  }

  if (matchCount > 0 || bonusMatch) {
    return {
      resultCode: `${gameId}_partial_${matchCount}${bonusMatch ? '_bonus' : ''}`,
      payoutTier: bonusMatch ? 'bonus_match' : matchCount > 0 ? `match_${matchCount}` : null,
      payoutLabel: bonusMatch ? 'Bonus match' : `Match ${matchCount}`,
      payoutSummary: bonusMatch
        ? 'The bonus path landed.'
        : `The pick settled with ${matchCount} matched number${matchCount === 1 ? '' : 's'}.`,
      isWin: true,
      bonusMatch,
    };
  }

  return {
    resultCode: `${gameId}_no_match`,
    payoutTier: null,
    payoutLabel: 'No win',
    payoutSummary: 'The pick settled without a winning match.',
    isWin: false,
    bonusMatch,
  };
}

export const BREWU_PAYOUT_GUIDES: BrewwuPayoutGuide[] = [
  {
    id: 'pick3',
    title: 'Pick 3 / Daily 3',
    label: 'Straight and box ladder',
    summary:
      'Teach the user the difference between exact-order and any-order coverage, then layer NC-only add-ons as optional educational paths.',
    tiers: [
      { name: 'Straight', odds: '1 in 1,000', note: 'Exact order prize path.' },
      { name: 'Box (2 like numbers)', odds: '1 in 333', note: 'Any order with repeated digits.' },
      { name: 'Box (3 different numbers)', odds: '1 in 167', note: 'Any order with three unique digits.' },
    ],
    aiHint:
      'Brew AI should explain whether exact-order precision or any-order box coverage better fits the player’s risk comfort.',
    source: 'NC Pick 3 and CA Daily 3 official game pages.',
  },
  {
    id: 'pick4',
    title: 'Pick 4 / Daily 4',
    label: 'Four-digit coverage ladder',
    summary:
      'Teach the user the smaller, middle, and broader box structures, plus NC-only Fireball / 50-50 style choices where applicable.',
    tiers: [
      { name: 'Exact order', odds: '1 in 10,000', note: 'Precision play.' },
      { name: '4-way box', odds: '1 in 2,500', note: 'Three like digits and one unique digit.' },
      { name: '6-way box', odds: '1 in 1,666.7', note: 'Two pairs.' },
      { name: '12-way box', odds: '1 in 833.3', note: 'Two like digits and two uniques.' },
      { name: '24-way box', odds: '1 in 416.7', note: 'Four unique digits.' },
    ],
    aiHint:
      'Brew AI should explain how the box size changes the coverage path without promising a better result.',
    source: 'NC Pick 4 and CA Daily 4 official game pages.',
  },
  {
    id: 'cash5',
    title: 'Cash 5 / Fantasy 5',
    label: 'Number-match ladder',
    summary:
      'Standard number-match games should be taught as straight match tiers, not box games, with add-ons called out separately.',
    tiers: [
      { name: 'Match 5', odds: 'NC 1 in 962,598 · CA 1 in 575,757', note: 'Top-prize match.' },
      { name: 'Match 4', odds: 'NC 1 in 5,066 · CA 1 in 3,387', note: 'Strong mid-tier hit.' },
      { name: 'Match 3', odds: 'NC 1 in 136.9 · CA 1 in 103', note: 'Common hit tier.' },
      { name: 'Match 2', odds: 'NC 1 in 11.4 · CA 1 in 10', note: 'Small hit tier.' },
    ],
    aiHint:
      'Brew AI should keep the teaching focused on simple number matching and only mention Double Play / EZ Match when the state supports it.',
    source: 'NC Cash 5 and CA Fantasy 5 official game pages.',
  },
  {
    id: 'powerball',
    title: 'Powerball',
    label: 'Bonus-ball ladder',
    summary:
      'Powerball is best explained as a standard match-number game with a bonus ball and optional Power Play / Double Play style add-ons.',
    tiers: [
      { name: 'Jackpot', odds: '1 in 292,201,338', note: 'All main numbers plus Powerball.' },
      { name: 'Any prize', odds: '1 in 24.9', note: 'Overall prize odds across the full ladder.' },
    ],
    aiHint:
      'Brew AI should explain the prize shape and add-on impact rather than presenting a box-style framing.',
    source: 'Powerball official how-to-play and prize table pages.',
  },
  {
    id: 'mega',
    title: 'Mega Millions',
    label: 'Multiplier ladder',
    summary:
      'Mega Millions is a standard match-number game with a built-in multiplier structure in the current format.',
    tiers: [
      { name: 'Jackpot', odds: '1 in 290,472,336', note: 'All main numbers plus Mega Ball.' },
      { name: 'Any prize', odds: '1 in 23', note: 'Overall prize odds across the current ladder.' },
    ],
    aiHint:
      'Brew AI should explain the current multiplier structure and cost tradeoff in simple language.',
    source: 'Mega Millions official how-to-play and FAQ pages.',
  },
];

export function getBrewwuPayoutGuide(gameId: BrewwuPayoutGuide['id']) {
  return BREWU_PAYOUT_GUIDES.find((guide) => guide.id === gameId) ?? null;
}

export function classifySettlementOutcome(params: {
  gameId: 'pick3' | 'pick4' | 'cash5' | 'powerball' | 'mega';
  playedNumbers: number[];
  officialNumbers: number[];
  strategyHint?: unknown;
  fireballActive?: boolean;
  bonusMatch?: boolean;
  playedBonusNumber?: number | null;
  officialBonusNumbers?: number[];
}): SettlementClassification {
  const strategyHint = normalizeStrategyHint(params.strategyHint);
  const fireballActive = Boolean(params.fireballActive);
  const bonusMatch = Boolean(params.bonusMatch);

  if (params.gameId === 'pick3' || params.gameId === 'pick4') {
    return buildPickStyleClassification(
      params.gameId,
      params.playedNumbers,
      params.officialNumbers,
      strategyHint,
      bonusMatch,
      fireballActive,
    );
  }

  return buildMatchNumberClassification(
    params.gameId,
    params.officialNumbers.length === params.playedNumbers.length
      ? params.playedNumbers.filter((value) => params.officialNumbers.includes(value)).length
      : params.playedNumbers.filter((value) => params.officialNumbers.includes(value)).length,
    bonusMatch || Boolean(
      params.playedBonusNumber != null &&
        (params.officialBonusNumbers || []).includes(params.playedBonusNumber),
    ),
  );
}
