/**
 * GET /api/dashboard/stats?game=pick3
 * Returns live hot/cold/momentum stats for the dashboard game family.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { DASHBOARD_GAME_CONFIG, type DashboardGameId } from '@/lib/dashboard/game-config';

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const GAME_STATS_CONFIG: Record<DashboardGameId, { primaryCount: number; hasBonus: boolean }> = {
  pick3: { primaryCount: 3, hasBonus: false },
  pick4: { primaryCount: 4, hasBonus: false },
  cash5: { primaryCount: 5, hasBonus: false },
  powerball: { primaryCount: 5, hasBonus: true },
  mega: { primaryCount: 5, hasBonus: true },
};

function buildFallback(game: string) {
  const config = DASHBOARD_GAME_CONFIG[(game as DashboardGameId)] || DASHBOARD_GAME_CONFIG.powerball;
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

function topEntries(values: Map<number, number>, count: number, direction: 'desc' | 'asc') {
  return [...values.entries()]
    .sort((a, b) => {
      if (a[1] === b[1]) {
        return a[0] - b[0];
      }

      return direction === 'desc' ? b[1] - a[1] : a[1] - b[1];
    })
    .slice(0, count)
    .map(([value]) => value);
}

function computeMomentum(recentPrimary: number[][], hotSet: Set<number>) {
  const flattened = recentPrimary.flat();
  if (flattened.length === 0) {
    return 0;
  }

  const hits = flattened.filter((value) => hotSet.has(value)).length;
  return Math.max(0, Math.min(100, Math.round((hits / flattened.length) * 100)));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const game = (searchParams.get('game') || 'powerball') as DashboardGameId;
    const config = GAME_STATS_CONFIG[game];
    const sourceConfig = DASHBOARD_GAME_CONFIG[game];

    if (!config || !sourceConfig) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Unsupported game key' } },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const drawsResult = await supabase
      .from('official_draws')
      .select('primary_numbers, bonus_numbers, draw_date, lottery_games!inner(game_key,state_code)')
      .eq('lottery_games.game_key', sourceConfig.statsGameKey)
      .eq('lottery_games.state_code', sourceConfig.statsStateCode)
      .order('draw_date', { ascending: false })
      .limit(120);

    if (drawsResult.error) {
      const message = drawsResult.error.message || 'Failed to load dashboard stats';
      return NextResponse.json(
        { success: false, error: { code: 'FETCH_ERROR', message } },
        { status: 500 }
      );
    }

    const draws = drawsResult.data || [];
    if (draws.length === 0) {
      return NextResponse.json({
        success: true,
        data: buildFallback(game),
        meta: { fallback: true },
      });
    }

    const primaryFrequency = new Map<number, number>();
    const bonusFrequency = new Map<number, number>();
    const recentPrimary: number[][] = [];
    const sourceGames = new Set<string>();

    for (const draw of draws) {
      const primaryNumbers = Array.isArray(draw.primary_numbers) ? draw.primary_numbers : [];
      const bonusNumbers = Array.isArray(draw.bonus_numbers) ? draw.bonus_numbers : [];
      const relatedGame = draw.lottery_games as { game_key?: string | null; state_code?: string | null } | null;
      const sourceGame = relatedGame?.game_key ?? null;

      if (sourceGame) {
        sourceGames.add(sourceGame);
      }

      for (const value of primaryNumbers) {
        if (typeof value === 'number') {
          primaryFrequency.set(value, (primaryFrequency.get(value) || 0) + 1);
        }
      }

      for (const value of bonusNumbers) {
        if (typeof value === 'number') {
          bonusFrequency.set(value, (bonusFrequency.get(value) || 0) + 1);
        }
      }

      if (recentPrimary.length < 20) {
        recentPrimary.push(primaryNumbers.filter((value): value is number => typeof value === 'number'));
      }
    }

    const hotNumbers = topEntries(primaryFrequency, config.primaryCount, 'desc');
    const coldNumbers = topEntries(primaryFrequency, config.primaryCount, 'asc');
    const hotSet = new Set(hotNumbers);

    return NextResponse.json({
      success: true,
      data: {
        hotNumbers,
        hotBonus: config.hasBonus ? topEntries(bonusFrequency, 1, 'desc')[0] ?? null : null,
        coldNumbers,
        coldBonus: config.hasBonus ? topEntries(bonusFrequency, 1, 'asc')[0] ?? null : null,
        momentumPercent: computeMomentum(recentPrimary, hotSet),
        drawCount: draws.length,
        sourceGames: [...sourceGames],
      },
      meta: { fallback: false },
    });
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
      { status: 500 }
    );
  }
}
