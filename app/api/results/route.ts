import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { resolveDashboardGameConfig, type DashboardGameId, type DashboardStateCode } from '@/lib/dashboard/game-config';

export const dynamic = 'force-dynamic';

const NO_CACHE = { headers: { 'Cache-Control': 'no-store, must-revalidate' } };

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const RESULT_GAME_CONFIG: Record<DashboardGameId, { primaryCount: number; hasBonus: boolean }> = {
  pick3: { primaryCount: 3, hasBonus: false },
  pick4: { primaryCount: 4, hasBonus: false },
  cash5: { primaryCount: 5, hasBonus: false },
  powerball: { primaryCount: 5, hasBonus: true },
  mega: { primaryCount: 5, hasBonus: true },
};

function intersectCount(source: number[], target: number[]) {
  const remaining = [...target];
  let hits = 0;

  for (const value of source) {
    const index = remaining.indexOf(value);
    if (index >= 0) {
      hits += 1;
      remaining.splice(index, 1);
    }
  }

  return hits;
}

function buildInsights(matchCount: number, hotHits: number, coldHits: number) {
  const insights: string[] = [];

  if (hotHits > 0) {
    insights.push(hotHits > 1 ? 'Hot trend hit again' : 'A hot number showed up again');
  }

  if (coldHits === 0) {
    insights.push('Cold numbers missed this draw');
  } else {
    insights.push('Cold numbers stayed in the mix');
  }

  if (matchCount >= 2) {
    insights.push('Pattern shift detected around your closest pick');
  } else {
    insights.push('No strong player match pattern yet');
  }

  return insights.slice(0, 3);
}

function getWorstStatus(statuses: string[]) {
  const rank = { failed: 0, stale: 1, unknown: 2, delayed: 3, healthy: 4 } as const;
  return [...statuses].sort((a, b) => (rank[a as keyof typeof rank] ?? 5) - (rank[b as keyof typeof rank] ?? 5))[0] || 'unknown';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const game = (searchParams.get('game') || 'powerball') as DashboardGameId;
    const state = (searchParams.get('state') || 'NC') as DashboardStateCode;
    const gameConfig = resolveDashboardGameConfig(game, state);
    const resultConfig = RESULT_GAME_CONFIG[game];

    if (!gameConfig || !resultConfig) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Unsupported game key' } },
        { status: 400, ...NO_CACHE },
      );
    }

    const supabase = getSupabase();

    const freshnessResult = await supabase
      .from('v_ingestion_health_summary')
      .select('freshness_status, staleness_minutes, expected_next_draw_at')
      .eq('state_code', gameConfig.statsStateCode)
      .eq('game_key', gameConfig.statsGameKey);

    if (freshnessResult.error) {
      return NextResponse.json(
        { success: false, error: { code: 'FETCH_ERROR', message: freshnessResult.error.message } },
        { status: 500, ...NO_CACHE },
      );
    }

    const freshnessRows = freshnessResult.data || [];
    const freshnessStatus = getWorstStatus(freshnessRows.map((row) => row.freshness_status || 'unknown'));
    const freshnessBlocked = freshnessStatus === 'stale' || freshnessStatus === 'failed';
    const stalenessMinutes = freshnessRows.reduce<number | null>((maxValue, row) => {
      if (row.staleness_minutes == null) {
        return maxValue;
      }

      return maxValue == null ? row.staleness_minutes : Math.max(maxValue, row.staleness_minutes);
    }, null);
    const expectedNextDrawAt = freshnessRows
      .map((row) => row.expected_next_draw_at)
      .filter(Boolean)
      .sort()[0] || null;

    if (freshnessBlocked) {
      return NextResponse.json({
        success: true,
        data: {
          latestDraw: null,
          closestPrediction: null,
          matchCount: 0,
          insights: [
            freshnessStatus === 'delayed'
              ? `Official ${gameConfig.displayLabel} draw data is still pending ingestion.`
              : freshnessStatus === 'stale'
                ? `Official ${gameConfig.displayLabel} draw data is stale and has been withheld from results.`
                : freshnessStatus === 'failed'
                  ? `Official ${gameConfig.displayLabel} draw ingestion is currently unavailable.`
                  : `Official ${gameConfig.displayLabel} draw freshness could not be verified.`,
          ],
          freshness: {
            status: freshnessStatus,
            stalenessMinutes,
            expectedNextDrawAt,
          },
        },
        meta: { fallback: true, freshnessBlocked: true },
      }, NO_CACHE);
    }

    // Get game_id from lottery_games first (avoid embedding issues)
    const gameIdResult = await supabase
      .from('lottery_games')
      .select('id, display_name')
      .eq('game_key', gameConfig.statsGameKey)
      .eq('state_code', gameConfig.statsStateCode)
      .maybeSingle();

    const gameId = gameIdResult.data?.id;

    const [drawResult, predictionResult, statsResult] = await Promise.all([
      gameId
        ? supabase
            .from('official_draws')
            .select('draw_date, draw_datetime_local, primary_numbers, bonus_numbers')
            .eq('game_id', gameId)
            .order('draw_date', { ascending: false })
            .limit(1)
            .maybeSingle()
        : { data: null, error: null },
      supabase
        .from('predictions')
        .select('id, game, state, created_at, predicted_numbers, bonus_number, is_saved, source_strategy_key, confidence_score')
        .eq('game', gameConfig.predictionGame)
        .in('state', gameConfig.predictionStates)
        .order('created_at', { ascending: false })
        .limit(8),
      gameId
        ? supabase
            .from('official_draws')
            .select('primary_numbers, bonus_numbers')
            .eq('game_id', gameId)
            .order('draw_date', { ascending: false })
            .limit(24)
        : { data: [], error: null },
    ]);

    if (drawResult.error) {
      return NextResponse.json(
        { success: false, error: { code: 'FETCH_ERROR', message: drawResult.error.message } },
        { status: 500, ...NO_CACHE },
      );
    }

    if (predictionResult.error) {
      return NextResponse.json(
        { success: false, error: { code: 'FETCH_ERROR', message: predictionResult.error.message } },
        { status: 500, ...NO_CACHE },
      );
    }

    if (statsResult.error) {
      return NextResponse.json(
        { success: false, error: { code: 'FETCH_ERROR', message: statsResult.error.message } },
        { status: 500, ...NO_CACHE },
      );
    }

    const draw = drawResult.data;
    if (!draw) {
      return NextResponse.json({
        success: true,
        data: {
          latestDraw: null,
          closestPrediction: null,
          matchCount: 0,
          insights: ['No official draw is available yet for this game.'],
        },
        meta: { fallback: true },
      }, NO_CACHE);
    }

    const drawNumbers = Array.isArray(draw.primary_numbers)
      ? draw.primary_numbers.filter((value): value is number => typeof value === 'number')
      : [];
    const drawBonusNumbers = Array.isArray(draw.bonus_numbers)
      ? draw.bonus_numbers.filter((value): value is number => typeof value === 'number')
      : [];
    const drawBonus = drawBonusNumbers[0] ?? null;

    const hotFrequency = new Map<number, number>();
    const coldFrequency = new Map<number, number>();

    for (const row of statsResult.data || []) {
      const primaryNumbers = Array.isArray(row.primary_numbers)
        ? row.primary_numbers.filter((value): value is number => typeof value === 'number')
        : [];

      for (const value of primaryNumbers) {
        hotFrequency.set(value, (hotFrequency.get(value) || 0) + 1);
        coldFrequency.set(value, (coldFrequency.get(value) || 0) + 1);
      }
    }

    const hotSet = new Set(
      [...hotFrequency.entries()]
        .sort((a, b) => b[1] - a[1] || a[0] - b[0])
        .slice(0, resultConfig.primaryCount)
        .map(([value]) => value),
    );

    const coldSet = new Set(
      [...coldFrequency.entries()]
        .sort((a, b) => a[1] - b[1] || a[0] - b[0])
        .slice(0, resultConfig.primaryCount)
        .map(([value]) => value),
    );

    const predictions = predictionResult.data || [];
    const scoredPredictions = predictions.map((prediction) => {
      const predictedNumbers = Array.isArray(prediction.predicted_numbers)
        ? prediction.predicted_numbers.filter((value): value is number => typeof value === 'number')
        : [];
      const primaryMatches = intersectCount(predictedNumbers, drawNumbers);
      const bonusMatch = drawBonus != null && prediction.bonus_number === drawBonus ? 1 : 0;
      const totalMatches = primaryMatches + bonusMatch;

      return {
        ...prediction,
        predicted_numbers: predictedNumbers,
        primaryMatches,
        bonusMatch,
        totalMatches,
      };
    });

    const closestPrediction = scoredPredictions.sort((a, b) => {
      if (b.totalMatches !== a.totalMatches) {
        return b.totalMatches - a.totalMatches;
      }

      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    })[0] || null;

    const hotHits = drawNumbers.filter((value) => hotSet.has(value)).length;
    const coldHits = drawNumbers.filter((value) => coldSet.has(value)).length;

    return NextResponse.json({
      success: true,
      data: {
        latestDraw: {
          game: gameConfig.displayLabel,
          state: gameConfig.statsStateCode,
          drawnAt: draw.draw_datetime_local,
          drawDate: draw.draw_date,
          primaryNumbers: drawNumbers,
          bonusNumber: drawBonus,
          bonusLabel: gameConfig.bonusLabel,
        },
        closestPrediction: closestPrediction
          ? {
              id: closestPrediction.id,
              game: closestPrediction.game,
              state: closestPrediction.state,
              createdAt: closestPrediction.created_at,
              strategyLabel: closestPrediction.source_strategy_key,
              confidenceScore: closestPrediction.confidence_score,
              primaryNumbers: closestPrediction.predicted_numbers,
              bonusNumber: closestPrediction.bonus_number,
              matchCount: closestPrediction.totalMatches,
              bonusMatch: Boolean(closestPrediction.bonusMatch),
              isSaved: Boolean(closestPrediction.is_saved),
            }
          : null,
        matchCount: closestPrediction?.totalMatches || 0,
        insights: buildInsights(closestPrediction?.totalMatches || 0, hotHits, coldHits),
        freshness: {
          status: freshnessStatus,
          stalenessMinutes,
          expectedNextDrawAt,
        },
      },
      meta: { fallback: false },
    }, NO_CACHE);
  } catch (error: unknown) {
    console.error('Results GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown server error',
        },
      },
      { status: 500, ...NO_CACHE },
    );
  }
}
