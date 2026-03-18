/**
 * Data normalizer - converts all source formats into canonical draw shape
 */
import type { ParsedRow } from './parser.js';

export interface NormalizedDraw {
  state: string;
  game: string;
  draw_date: string;
  draw_time?: string | null;
  numbers: number[];
  bonus_number?: number | null;
  multiplier?: string | null;
  fireball?: number | null;
  special_values?: Record<string, unknown>;
  source_name: string;
  source_url?: string;
  source_tier: number;
  trust_score: number;
  checksum: string;
  raw_payload?: unknown;
  draw_variant?: string | null; // e.g., 'double_draw', 'double_play'
}

export interface GameConfig {
  state: string;
  game: string;
  primaryCount: number;
  primaryMin: number;
  primaryMax: number;
  hasBonus?: boolean;
  bonusCount?: number;
  bonusMin?: number;
  bonusMax?: number;
  supportsFireball?: boolean;
}

const GAME_CONFIGS: Record<string, GameConfig> = {
  'NC_PICK3': { state: 'NC', game: 'pick3', primaryCount: 3, primaryMin: 0, primaryMax: 9, supportsFireball: true },
  'NC_PICK4': { state: 'NC', game: 'pick4', primaryCount: 4, primaryMin: 0, primaryMax: 9, supportsFireball: true },
  'NC_CASH5': { state: 'NC', game: 'cash5', primaryCount: 5, primaryMin: 1, primaryMax: 43, hasBonus: false },
  'NC_POWERBALL': { state: 'NC', game: 'powerball', primaryCount: 5, primaryMin: 1, primaryMax: 69, hasBonus: true, bonusCount: 1, bonusMin: 1, bonusMax: 26 },
  'NC_MEGA_MILLIONS': { state: 'NC', game: 'mega_millions', primaryCount: 5, primaryMin: 1, primaryMax: 70, hasBonus: true, bonusCount: 1, bonusMin: 1, bonusMax: 25 },
  'CA_DAILY3': { state: 'CA', game: 'daily3', primaryCount: 3, primaryMin: 0, primaryMax: 9, supportsFireball: true },
  'CA_DAILY4': { state: 'CA', game: 'daily4', primaryCount: 4, primaryMin: 0, primaryMax: 9, supportsFireball: true },
  'CA_FANTASY5': { state: 'CA', game: 'fantasy5', primaryCount: 5, primaryMin: 1, primaryMax: 39 },
  'CA_POWERBALL': { state: 'CA', game: 'powerball', primaryCount: 5, primaryMin: 1, primaryMax: 69, hasBonus: true, bonusCount: 1, bonusMin: 1, bonusMax: 26 },
  'CA_MEGA_MILLIONS': { state: 'CA', game: 'mega_millions', primaryCount: 5, primaryMin: 1, primaryMax: 70, hasBonus: true, bonusCount: 1, bonusMin: 1, bonusMax: 25 },
};

/**
 * Normalize a parsed row into canonical format
 */
export function normalizeDraw(
  row: ParsedRow,
  sourceKey: string,
  sourceName: string,
  sourceUrl?: string,
  sourceTier = 2,
  trustScore = 75
): NormalizedDraw | null {
  const configKey = `${sourceKey}`.toUpperCase();
  const config = GAME_CONFIGS[configKey];

  if (!config) {
    console.warn(`Unknown game config: ${sourceKey}`);
    return null;
  }

  // Extract draw date
  const drawDate = extractDate(row);
  if (!drawDate) return null;

  // Extract numbers based on game type
  const numbers = extractNumbers(row, config.primaryCount);
  if (numbers.length !== config.primaryCount) return null;

  // Extract bonus number if applicable
  let bonusNumber: number | null = null;
  if (config.hasBonus) {
    bonusNumber = extractBonusNumber(row);
  }

  // Extract fireball if applicable
  let fireball: number | null = null;
  if (config.supportsFireball) {
    fireball = extractFireball(row);
  }

  // Compute checksum
  const checksum = computeChecksum(config.state, config.game, drawDate, numbers, bonusNumber, fireball);

  return {
    state: config.state,
    game: config.game,
    draw_date: drawDate,
    numbers,
    bonus_number: bonusNumber ?? undefined,
    fireball: fireball ?? undefined,
    source_name: sourceName,
    source_url: sourceUrl,
    source_tier: sourceTier,
    trust_score: trustScore,
    checksum,
  };
}

function extractDate(row: ParsedRow): string | null {
  // Try various date field names
  const dateFields = ['draw_date', 'date', 'drawdate', 'winning_date', 'Date'];
  
  for (const field of dateFields) {
    const value = row[field];
    if (value) {
      // Handle different date formats
      if (typeof value === 'string') {
        // Try ISO format first
        if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value;
        // Try MM/DD/YYYY
        const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (match) {
          return `${match[3]}-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`;
        }
      }
    }
  }
  return null;
}

function extractNumbers(row: ParsedRow, count: number): number[] {
  const numbers: number[] = [];
  
  // Try numbered fields (n1, n2, n3, ball1, ball2, etc.)
  for (let i = 1; i <= count; i++) {
    const fields = [`n${i}`, `ball${i}`, `number_${i}`, `num${i}`, `Ball ${i}`];
    for (const field of fields) {
      const value = row[field];
      if (typeof value === 'number') {
        numbers.push(value);
        break;
      } else if (typeof value === 'string' && /^\d+$/.test(value)) {
        numbers.push(parseInt(value, 10));
        break;
      }
    }
  }

  // Fallback: try combined field
  if (numbers.length < count) {
    const combinedFields = ['numbers', 'winning_numbers', 'balls', 'result'];
    for (const field of combinedFields) {
      const value = row[field];
      if (typeof value === 'string') {
        const parts = value.split(/[\s,\-]+/).filter(s => /^\d+$/.test(s));
        if (parts.length >= count) {
          return parts.slice(0, count).map(p => parseInt(p, 10));
        }
      }
    }
  }

  return numbers;
}

function extractBonusNumber(row: ParsedRow): number | null {
  const bonusFields = ['bonus', 'bonus_number', 'powerball', 'mega_ball', 'megaball', 'bonus_ball', 'pb', 'mb'];
  
  for (const field of bonusFields) {
    const value = row[field];
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && /^\d+$/.test(value)) return parseInt(value, 10);
  }
  
  return null;
}

function extractFireball(row: ParsedRow): number | null {
  const fireballFields = ['fireball', 'fire_ball', 'fb'];
  
  for (const field of fireballFields) {
    const value = row[field];
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && value !== '' && /^\d+$/.test(value)) return parseInt(value, 10);
  }
  
  return null;
}

function computeChecksum(
  state: string,
  game: string,
  drawDate: string,
  numbers: number[],
  bonus?: number | null,
  fireball?: number | null
): string {
  const parts = [
    state,
    game,
    drawDate,
    numbers.join('-'),
    bonus?.toString() ?? '',
    fireball?.toString() ?? ''
  ];
  return parts.join('|');
}
