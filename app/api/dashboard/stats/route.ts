import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { resolveDashboardGameConfig, type DashboardGameId, type DashboardStateCode } from '@/lib/dashboard/game-config';

export const dynamic = 'force-dynamic';

const NO_CACHE = { headers: { 'Cache-Control': 'no-store, must-revalidate' } };

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function buildFallback(game: string) {
  const config = resolveDashboardGameConfig((game as DashboardGameId) || 'powerball', 'NC') || resolveDashboardGameConfig('powerball', 'NC')!;
  return {
    hotNumbers: [],
    hotBonus: null,
    coldNumbers: [],
    coldBonus: null,
    momentumPercent: 0,
    drawCount: 0,
    sourceGames: [config.statsGameKey],
  };
}

function computeMultiWindowStats(
  draws: { primary_numbers: unknown; bonus_numbers: unknown }[],
  primaryCount: number,
  hasBonus: boolean
) {
  const baseWindow = draws;
  const recentWindow = draws.slice(0, 30);

  const baseFreq = new Map<number, number>();
  const recentFreq = new Map<number, number>();
  const bonusBaseFreq = new Map<number, number>();
  const bonusRecentFreq = new Map<number, number>();
  const lastSeen = new Map<number, number>();
  const bonusLastSeen = new Map<number, number>();

  let totalBaseHits = 0;
  let totalRecentHits = 0;

  for (let i = 0; i < baseWindow.length; i++) {
    const primaries = Array.isArray(draws[i].primary_numbers)
      ? draws[i].primary_numbers.filter((v): v is number => typeof v === 'number')
      : [];

    for (const n of primaries) {
      baseFreq.set(n, (baseFreq.get(n) || 0) + 1);
      totalBaseHits++;
      if (!lastSeen.has(n)) lastSeen.set(n, i);
    }

    if (i < 30) {
      for (const n of primaries) {
        recentFreq.set(n, (recentFreq.get(n) || 0) + 1);
        totalRecentHits++;
      }
    }

    if (hasBonus) {
      const bonuses = Array.isArray(draws[i].bonus_numbers)
        ? draws[i].bonus_numbers.filter((v): v is number => typeof v === 'number')
        : [];

      for (const n of bonuses) {
        bonusBaseFreq.set(n, (bonusBaseFreq.get(n) || 0) + 1);
        if (!bonusLastSeen.has(n)) bonusLastSeen.set(n, i);
      }

      if (i < 30) {
        for (const n of bonuses) {
          bonusRecentFreq.set(n, (bonusRecentFreq.get(n) || 0) + 1);
        }
      }
    }
  }

  const allNumbers = new Set<number>();
  for (const n of baseFreq.keys()) allNumbers.add(n);
  for (const n of recentFreq.keys()) allNumbers.add(n);

  let minN = Infinity;
  let maxN = -Infinity;
  for (const n of allNumbers) {
    if (n < minN) minN = n;
    if (n > maxN) maxN = n;
  }

  if (!Number.isFinite(minN)) minN = 0;
  if (!Number.isFinite(maxN)) maxN = 9;

  const numberPool: number[] = [];
  for (let n = minN; n <= maxN; n++) numberPool.push(n);

  const recentWindowSize = Math.max(1, Math.min(recentWindow.length, draws.length));
  const baseWindowSize = Math.max(1, baseWindow.length);

  let maxBaseFreq = 0;
  let maxRecentFreq = 0;
  for (const n of numberPool) {
    maxBaseFreq = Math.max(maxBaseFreq, baseFreq.get(n) || 0);
    maxRecentFreq = Math.max(maxRecentFreq, recentFreq.get(n) || 0);
  }

  let maxDelta = 0;
  const deltas = new Map<number, number>();
  for (const n of numberPool) {
    const bf = baseFreq.get(n) || 0;
    const rf = recentFreq.get(n) || 0;
    const expectedInRecent = bf * recentWindowSize / baseWindowSize;
    const delta = rf - expectedInRecent;
    deltas.set(n, delta);
    maxDelta = Math.max(maxDelta, delta);
  }
  if (maxDelta === 0) maxDelta = 1;

  interface Scored { number: number; score: number; }

  const hotScores: Scored[] = [];
  const coldScores: Scored[] = [];

  for (const n of numberPool) {
    const bf = baseFreq.get(n) || 0;
    const rf = recentFreq.get(n) || 0;
    const delta = deltas.get(n) || 0;

    const hotBase = maxBaseFreq > 0 ? bf / maxBaseFreq : 0;
    const hotRecent = maxRecentFreq > 0 ? rf / maxRecentFreq : 0;
    const hotDelta = delta / maxDelta;
    const hotScore = 0.45 * hotBase + 0.35 * hotRecent + 0.20 * hotDelta;

    const coldBase = maxBaseFreq > 0 ? 1 - bf / maxBaseFreq : 1;
    const recentAbsence = maxRecentFreq > 0 ? 1 - rf / maxRecentFreq : 1;
    const overdueRaw = lastSeen.has(n) ? lastSeen.get(n) : 120;
    const overdueGap = Math.min(overdueRaw, 120) / 120;
    const coldScore = 0.45 * coldBase + 0.35 * recentAbsence + 0.20 * overdueGap;

    hotScores.push({ number: n, score: hotScore });
    coldScores.push({ number: n, score: coldScore });
  }

  hotScores.sort((a, b) => b.score - a.score);
  coldScores.sort((a, b) => b.score - a.score);

  let positiveDeltaSum = 0;
  let negativeDeltaSum = 0;
  for (const delta of deltas.values()) {
    if (delta > 0) {
      positiveDeltaSum += delta;
    } else if (delta < 0) {
      negativeDeltaSum += Math.abs(delta);
    }
  }
  const totalDeltaMagnitude = positiveDeltaSum + negativeDeltaSum;
  let momentum = 50;
  if (totalDeltaMagnitude > 0) {
    const balance = (positiveDeltaSum - negativeDeltaSum) / totalDeltaMagnitude;
    momentum = Math.round(50 + balance * 50);
    momentum = Math.max(0, Math.min(100, momentum));
  }

  let hotBonusResult: number | null = null;
  let coldBonusResult: number | null = null;

  if (hasBonus) {
    const allBonusNumbers = new Set<number>();
    for (const n of bonusBaseFreq.keys()) allBonusNumbers.add(n);
    for (const n of bonusRecentFreq.keys()) allBonusNumbers.add(n);

    let bMin = Infinity;
    let bMax = -Infinity;
    for (const n of allBonusNumbers) {
      if (n < bMin) bMin = n;
      if (n > bMax) bMax = n;
    }
    if (!Number.isFinite(bMin)) bMin = 1;
    if (!Number.isFinite(bMax)) bMax = 26;

    const bonusPool: number[] = [];
    for (let n = bMin; n <= bMax; n++) bonusPool.push(n);

    let maxBonusBase = 0;
    let maxBonusRecent = 0;
    for (const n of bonusPool) {
      maxBonusBase = Math.max(maxBonusBase, bonusBaseFreq.get(n) || 0);
      maxBonusRecent = Math.max(maxBonusRecent, bonusRecentFreq.get(n) || 0);
    }

    let maxBonusDelta = 0;
    const bonusDeltas = new Map<number, number>();
    for (const n of bonusPool) {
      const bf = bonusBaseFreq.get(n) || 0;
      const rf = bonusRecentFreq.get(n) || 0;
      const expectedInRecent = bf * recentWindowSize / baseWindowSize;
      const delta = rf - expectedInRecent;
      bonusDeltas.set(n, delta);
      maxBonusDelta = Math.max(maxBonusDelta, delta);
    }
    if (maxBonusDelta === 0) maxBonusDelta = 1;

    const hotBonusScores: Scored[] = [];
    const coldBonusScores: Scored[] = [];

    for (const n of bonusPool) {
      const bf = bonusBaseFreq.get(n) || 0;
      const rf = bonusRecentFreq.get(n) || 0;
      const delta = bonusDeltas.get(n) || 0;

      const hotBase = maxBonusBase > 0 ? bf / maxBonusBase : 0;
      const hotRecent = maxBonusRecent > 0 ? rf / maxBonusRecent : 0;
      const hotDelta = delta / maxBonusDelta;
      const hotScore = 0.45 * hotBase + 0.35 * hotRecent + 0.20 * hotDelta;

      const coldBase = maxBonusBase > 0 ? 1 - bf / maxBonusBase : 1;
      const recentAbsence = maxBonusRecent > 0 ? 1 - rf / maxBonusRecent : 1;
      const overdueRaw = bonusLastSeen.has(n) ? bonusLastSeen.get(n) : 120;
      const overdueGap = Math.min(overdueRaw, 120) / 120;
      const coldScore = 0.45 * coldBase + 0.35 * recentAbsence + 0.20 * overdueGap;

      hotBonusScores.push({ number: n, score: hotScore });
      coldBonusScores.push({ number: n, score: coldScore });
    }

    hotBonusScores.sort((a, b) => b.score - a.score);
    coldBonusScores.sort((a, b) => b.score - a.score);

    hotBonusResult = hotBonusScores[0]?.number ?? null;
    coldBonusResult = coldBonusScores[0]?.number ?? null;
  }

  return {
    hotNumbers: hotScores.slice(0, primaryCount).map((s) => s.number),
    coldNumbers: coldScores.slice(0, primaryCount).map((s) => s.number),
    hotBonus: hotBonusResult,
    coldBonus: coldBonusResult,
    momentumPercent: momentum,
    drawCount: draws.length,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const game = (searchParams.get('game') || 'powerball') as DashboardGameId;
    const state = (searchParams.get('state') || 'NC') as DashboardStateCode;
    const config = resolveDashboardGameConfig(game, state);

    if (!config) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Unsupported game key' } },
        { status: 400, ...NO_CACHE }
      );
    }

    const supabase = getSupabase();
    const drawsResult = await supabase
      .from('official_draws')
      .select('primary_numbers, bonus_numbers, draw_date, lottery_games!inner(game_key,state_code)')
      .eq('lottery_games.game_key', config.statsGameKey)
      .eq('lottery_games.state_code', config.statsStateCode)
      .order('draw_date', { ascending: false })
      .limit(120);

    if (drawsResult.error) {
      const message = drawsResult.error.message || 'Failed to load dashboard stats';
      return NextResponse.json(
        { success: false, error: { code: 'FETCH_ERROR', message } },
        { status: 500, ...NO_CACHE }
      );
    }

    const draws = drawsResult.data || [];
    if (draws.length === 0) {
      return NextResponse.json({
        success: true,
        data: buildFallback(game),
        meta: { fallback: true },
      }, NO_CACHE);
    }

    const sourceGames = new Set<string>();
    for (const draw of draws) {
      const relatedGame = draw.lottery_games as { game_key?: string | null } | null;
      if (relatedGame?.game_key) sourceGames.add(relatedGame.game_key);
    }

    const stats = computeMultiWindowStats(draws, config.primaryCount, config.hasBonus);

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        sourceGames: [...sourceGames],
      },
      meta: {
        fallback: false,
        strategyVersion: 'v1-multi-window',
        strategyMeta: {
          baseWindow: 120,
          recentWindow: 30,
          momentumWindow: 20,
          scoringMethod: 'composite-weighted',
        },
      },
    }, NO_CACHE);
  } catch (error: unknown) {
    console.error('Dashboard stats GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown server error',
        },
      },
      { status: 500, ...NO_CACHE }
    );
  }
}
