export type PrizeTableRow = {
  label: string;
  value: string;
  note?: string;
};

export type BrewwuPrizeTableGuide = {
  id: 'pick3' | 'pick4' | 'cash5' | 'daily3' | 'daily4' | 'fantasy5' | 'powerball' | 'mega';
  title: string;
  label: string;
  summary: string;
  rows: PrizeTableRow[];
  source: string;
};

export const BREWU_PRIZE_TABLES: BrewwuPrizeTableGuide[] = [
  {
    id: 'pick3',
    title: 'NC Pick 3',
    label: 'Fixed Fireball ladder',
    summary:
      'North Carolina Pick 3 has a fixed straight / any-order ladder, plus Fireball payouts that only apply when the user actually played Fireball on the winning draw date.',
    rows: [
      { label: 'Straight', value: '$250 / $500', note: '50¢ / $1 exact-order payout.' },
      { label: 'Any 3-way', value: '$80 / $160', note: 'Repeated-digit any-order path.' },
      { label: 'Any 6-way', value: '$40 / $80', note: 'All-unique any-order path.' },
      { label: 'Fireball exact', value: '$90 / $180', note: 'Only when Fireball was active on the confirmed draw.' },
      { label: 'Fireball any 3-way', value: '$30 / $60', note: 'NC Fireball-adjusted any-order payout.' },
      { label: 'Fireball any 6-way', value: '$15 / $30', note: 'NC Fireball-adjusted any-order payout.' },
    ],
    source: 'NC Lottery Pick 3 payout page.',
  },
  {
    id: 'pick4',
    title: 'NC Pick 4',
    label: 'Fixed Fireball ladder',
    summary:
      'North Carolina Pick 4 has a fixed straight / any-order ladder, and Fireball again only matters on the exact draw date that was actually played.',
    rows: [
      { label: 'Straight', value: '$2,500 / $5,000', note: '50¢ / $1 exact-order payout.' },
      { label: 'Any 24-way', value: '$100 / $200', note: 'All four digits unique.' },
      { label: 'Fireball exact', value: '$675 / $1,350', note: 'NC Fireball-adjusted exact-order payout.' },
      { label: 'Fireball 4-way', value: '$170 / $340', note: 'Three like digits and one unique digit.' },
      { label: 'Fireball 6-way', value: '$112 / $224', note: 'Two pairs.' },
      { label: 'Fireball 12-way', value: '$56 / $112', note: 'Two like digits and two uniques.' },
      { label: 'Fireball 24-way', value: '$28 / $56', note: 'All unique digits.' },
    ],
    source: 'NC Lottery Pick 4 payout page.',
  },
  {
    id: 'cash5',
    title: 'NC Cash 5',
    label: 'Fixed prizes + add-ons',
    summary:
      'NC Cash 5 keeps the core ladder fixed, then adds Double Play and EZ Match as separate prize paths.',
    rows: [
      { label: '5 of 5', value: 'Jackpot', note: 'Jackpot estimate changes by draw.' },
      { label: '4 of 5', value: '$250', note: 'Fixed base prize.' },
      { label: '3 of 5', value: '$5', note: 'Fixed base prize.' },
      { label: '2 of 5', value: '$1', note: 'Fixed base prize.' },
      { label: 'Double Play 5 of 5', value: '$50,000', note: 'Second drawing top prize.' },
      { label: 'Double Play 4 of 5', value: '$500', note: 'Separate add-on payout.' },
      { label: 'EZ Match', value: '$2-$500', note: 'Instant add-on prize ladder.' },
    ],
    source: 'NC Lottery Cash 5 how-to-play and payout pages.',
  },
  {
    id: 'daily3',
    title: 'CA Daily 3',
    label: 'Pari-mutuel snapshot',
    summary:
      'California Daily 3 prize amounts are certified per draw and can vary, so BrewLotto should show the latest official payout table instead of pretending the amounts are static.',
    rows: [
      { label: 'Straight', value: 'Pari-mutuel', note: 'Certified per draw.' },
      { label: 'Box', value: 'Pari-mutuel', note: 'Certified per draw.' },
      { label: 'Straight and Box', value: 'Pari-mutuel', note: 'Certified per draw.' },
      { label: 'Box only', value: 'Pari-mutuel', note: 'Certified per draw.' },
    ],
    source: 'California Lottery Daily 3 draw results and payout pages.',
  },
  {
    id: 'daily4',
    title: 'CA Daily 4',
    label: 'Pari-mutuel snapshot',
    summary:
      'California Daily 4 prize amounts are certified per draw and can vary, so BrewLotto should present them as current certified values rather than fixed payouts.',
    rows: [
      { label: 'Straight', value: 'Pari-mutuel', note: 'Certified per draw.' },
      { label: 'Box', value: 'Pari-mutuel', note: 'Certified per draw.' },
      { label: 'Straight and Box', value: 'Pari-mutuel', note: 'Certified per draw.' },
      { label: 'Box only', value: 'Pari-mutuel', note: 'Certified per draw.' },
    ],
    source: 'California Lottery Daily 4 draw results and payout pages.',
  },
  {
    id: 'fantasy5',
    title: 'CA Fantasy 5',
    label: 'Pari-mutuel snapshot',
    summary:
      'California Fantasy 5 is pari-mutuel. The top prize starts in a range and the lower prizes are certified from the official draw, so the app should call out the current official values.',
    rows: [
      { label: '5 of 5', value: 'Starts around $60K-$80K', note: 'Can grow when there is no winner.' },
      { label: '4 of 5', value: 'Certified per draw', note: 'Official draw result page shows the current value.' },
      { label: '3 of 5', value: 'Certified per draw', note: 'Official draw result page shows the current value.' },
      { label: '2 of 5', value: 'Free play', note: 'Standard lower tier.' },
    ],
    source: 'California Lottery Fantasy 5 how-to-play and draw result pages.',
  },
  {
    id: 'powerball',
    title: 'Powerball',
    label: 'Fixed lower tiers',
    summary:
      'Powerball keeps fixed lower-tier prizes and a variable jackpot, with Power Play changing the lower-tier values.',
    rows: [
      { label: 'Jackpot', value: 'Variable', note: 'Cash option / annuity depend on the advertised jackpot.' },
      { label: '5 + Powerball', value: '$1,000,000', note: 'Fixed lower-tier prize.' },
      { label: '4 + Powerball', value: '$50,000', note: 'Fixed lower-tier prize.' },
      { label: '4', value: '$100', note: 'Fixed lower-tier prize.' },
      { label: '3 + Powerball', value: '$100', note: 'Fixed lower-tier prize.' },
      { label: '3', value: '$7', note: 'Fixed lower-tier prize.' },
      { label: '2 + Powerball', value: '$7', note: 'Fixed lower-tier prize.' },
      { label: '1 + Powerball', value: '$4', note: 'Fixed lower-tier prize.' },
      { label: 'Power Play', value: '2X-10X', note: 'Multiplier add-on for non-jackpot prizes.' },
    ],
    source: 'Powerball official prize chart.',
  },
  {
    id: 'mega',
    title: 'Mega Millions',
    label: 'Built-in multiplier',
    summary:
      'Mega Millions uses the new embedded multiplier structure, so non-jackpot prizes move inside a fixed prize matrix instead of a separate add-on.',
    rows: [
      { label: '5 + 1', value: 'Jackpot', note: 'Variable jackpot.' },
      { label: '5 + 0', value: '$1M base / $2M-$10M with multiplier', note: 'Current new game matrix.' },
      { label: '4 + 1', value: '$10K base / $20K-$100K with multiplier', note: 'Current new game matrix.' },
      { label: '4 + 0', value: '$500 base / $1K-$5K with multiplier', note: 'Current new game matrix.' },
      { label: '3 + 1', value: '$200 base / $400-$2K with multiplier', note: 'Current new game matrix.' },
      { label: '3 + 0', value: '$10 base / $20-$100 with multiplier', note: 'Current new game matrix.' },
      { label: '2 + 1', value: '$10 base / $20-$100 with multiplier', note: 'Current new game matrix.' },
      { label: '1 + 1', value: '$7 base / $14-$70 with multiplier', note: 'Current new game matrix.' },
      { label: '0 + 1', value: '$5 base / $10-$50 with multiplier', note: 'Current new game matrix.' },
    ],
    source: 'Mega Millions new prize matrix and how-to-play pages.',
  },
];

export function getBrewwuPrizeTableGuide(gameId: BrewwuPrizeTableGuide['id']) {
  return BREWU_PRIZE_TABLES.find((guide) => guide.id === gameId) ?? null;
}
