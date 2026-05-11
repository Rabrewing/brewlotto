export type PlayStyleDetail = {
  name: string;
  odds?: string;
  note: string;
};

export type BrewwuGameGuide = {
  id: 'pick3' | 'pick4' | 'cash5' | 'powerball' | 'mega';
  title: string;
  label: string;
  odds: string;
  summary: string;
  playStyles: PlayStyleDetail[];
  aiHint: string;
  source: string;
};

export const BREWU_PLAY_STYLE_GUIDES: BrewwuGameGuide[] = [
  {
    id: 'pick3',
    title: 'Pick 3 / Daily 3',
    label: 'Order matters',
    odds: 'Straight odds: 1 in 1,000',
    summary:
      'Pick 3 is the cleanest place to teach exact-order play, broader box coverage, and split-style wagers. NC adds Fireball, 50/50, Combo, and Pair. Fireball is an NC-only modifier that affects settlement for the draw it was actually played on, not a separate trend signal. CA Daily 3 centers on Straight, Box, and Straight/Box.',
    playStyles: [
      { name: 'Straight', odds: '1 in 1,000', note: 'Exact order. Highest payout shape, narrowest coverage.' },
      { name: 'Box (2 like numbers)', odds: '1 in 333', note: 'Any order with repeated digits.' },
      { name: 'Box (3 different numbers)', odds: '1 in 167', note: 'Any order with three unique digits.' },
      { name: 'Straight/Box', note: 'Split wager between exact order and any order coverage.' },
      { name: 'NC extras', note: '50/50, Combo, Pair, and Fireball are NC-specific educational options.' },
    ],
    aiHint:
      'Brew AI should explain when a tighter exact-order play is more focused and when a broader box or split wager is better for the user’s comfort level, while also clarifying that Fireball only matters on NC Pick 3 and only for the draw date it was actually played.',
    source:
      'North Carolina Education Lottery Pick 3 payout pages and California Lottery Daily 3 odds pages.',
  },
  {
    id: 'pick4',
    title: 'Pick 4 / Daily 4',
    label: 'More combinations',
    odds: 'Exact order odds: 1 in 10,000',
    summary:
      'Pick 4 / Daily 4 expands the same education pattern to more digits, more ways to box, and more ways to split coverage. NC includes Fireball and 50/50 style play; Fireball is a settlement modifier for the draw it was actually played on, not a dashboard trend metric. CA Daily 4 centers on Straight, Box, and Straight/Box.',
    playStyles: [
      { name: 'Exact order', odds: '1 in 10,000', note: 'The strongest precision play, but the narrowest path.' },
      { name: '4-Way', odds: '1 in 2,500', note: 'Any order with three like digits and one unique digit.' },
      { name: '6-Way', odds: '1 in 1,666.7', note: 'Any order with two pairs.' },
      { name: '12-Way', odds: '1 in 833.3', note: 'Any order with two like digits and two uniques.' },
      { name: '24-Way', odds: '1 in 416.7', note: 'Any order with four unique digits.' },
      { name: 'NC extras', note: '50/50 and Fireball add teaching depth for NC-only players.' },
    ],
    aiHint:
      'Brew AI should help users choose between precision and coverage by explaining how each box style changes the path to a hit, while clearly stating that Fireball only applies to NC Pick 4 plays on the exact draw date the user confirmed.',
    source:
      'North Carolina Education Lottery Pick 4 prizes and odds page plus California Lottery Daily 4 play-style guidance.',
  },
  {
    id: 'cash5',
    title: 'Cash 5 / Fantasy 5',
    label: 'Number-match play',
    odds: 'Top prize odds: NC 1 in 962,598 · CA 1 in 575,757',
    summary:
      'Cash 5 and Fantasy 5 are standard number-match games, not box games. NC adds Double Play and EZ Match; CA Fantasy 5 is a daily match-five game with a cleaner prize ladder.',
    playStyles: [
      { name: 'Match 5', odds: 'NC 1 in 962,598 · CA 1 in 575,757', note: 'Top-prize match across the full number pool.' },
      { name: 'Match 4', odds: 'NC 1 in 5,066 · CA 1 in 3,387', note: 'Mid-tier hit that is easier to land than the jackpot.' },
      { name: 'Match 3', odds: 'NC 1 in 136.9 · CA 1 in 103', note: 'Smaller hit tier that still matters for education.' },
      { name: 'Match 2', odds: 'NC 1 in 11.4 · CA 1 in 10', note: 'Lowest hit tier in the standard game ladder.' },
      { name: 'NC Double Play / EZ Match', note: 'Add-on options that change the experience without turning the game into a box-style play.' },
    ],
    aiHint:
      'Brew AI should explain that these games are about number matching and add-ons, not box structures, and help users decide whether to keep the base game simple or add the state-specific extras.',
    source:
      'North Carolina Education Lottery Cash 5 how-to-play page and California Lottery Fantasy 5 odds page.',
  },
  {
    id: 'powerball',
    title: 'Powerball',
    label: 'Standard + add-ons',
    odds: 'Overall prize odds: 1 in 24.9 · jackpot: 1 in 292,201,338',
    summary:
      'Powerball is a standard five-number-plus-Powerball game. The educational angle is how add-ons like Power Play and Double Play change the cost and prize shape, not how to box the play.',
    playStyles: [
      { name: 'Base game', odds: 'Overall prize odds: 1 in 24.9', note: 'Match the white balls plus the Powerball to win across the prize ladder.' },
      { name: 'Jackpot', odds: '1 in 292,201,338', note: 'The top prize remains the main headline, but the overall game has many smaller win paths.' },
      { name: 'Power Play', note: 'Multiplier add-on that changes non-jackpot prize value.' },
      { name: 'Double Play', note: 'Second-draw add-on where available.' },
    ],
    aiHint:
      'Brew AI should explain the add-on tradeoff in plain English and help the user understand cost versus payout shape, not promise a better outcome.',
    source: 'Powerball official FAQ and prize table pages.',
  },
  {
    id: 'mega',
    title: 'Mega Millions',
    label: 'Standard + multiplier',
    odds: 'Overall prize odds: 1 in 23 · jackpot: 1 in 290,472,336',
    summary:
      'Mega Millions is a standard six-number game with a built-in multiplier in the current format. The education layer should focus on the normal match-number logic and the multiplier tradeoff.',
    playStyles: [
      { name: 'Base game', odds: 'Overall prize odds: 1 in 23', note: 'The built-in multiplier is already part of the current ticket price.' },
      { name: 'Jackpot', odds: '1 in 290,472,336', note: 'Top prize odds changed with the April 2025 format update.' },
      { name: 'Multiplier', note: 'Built into the current play format instead of sold separately.' },
    ],
    aiHint:
      'Brew AI should explain the current Mega Millions structure in simple terms so users understand that the ticket price includes the multiplier and that this is still a match-number game, not a box play.',
    source: 'Mega Millions official How to Play and New Game FAQ pages.',
  },
];

export function getBrewwuPlayStyleGuide(gameId: BrewwuGameGuide['id']) {
  return BREWU_PLAY_STYLE_GUIDES.find((guide) => guide.id === gameId) ?? null;
}
