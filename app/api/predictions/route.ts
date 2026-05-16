/**
 * GET /api/predictions - List predictions
 * POST /api/predictions - Create a new prediction
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { resolveDashboardGameConfig, type DashboardGameId, type DashboardStateCode } from '@/lib/dashboard/game-config';

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

const GAME_KEY_MAP: Record<string, string> = {
  pick3: 'pick3',
  pick4: 'pick4',
  cash5: 'cash5',
  powerball: 'powerball',
  mega_millions: 'mega_millions',
  mega: 'mega_millions',
};

type PredictionRow = {
  game?: string | null;
  state?: string | null;
  draw_date?: string | null;
  draw_time?: string | null;
  predicted_numbers?: unknown;
  bonus_number?: unknown;
};

type DrawRow = {
  primary_numbers?: unknown;
  bonus_numbers?: unknown;
  fireball_value?: unknown;
};

async function attachMatchInfo(supabase: any, predictions: PredictionRow[]) {
  const enriched: Array<PredictionRow & { matchInfo: Record<string, unknown> | null }> = [];

  for (const prediction of predictions) {
    const game = prediction.game;
    const state = prediction.state;
    const drawDate = prediction.draw_date;
    const drawWindow = prediction.draw_time;
    const gameKey = GAME_KEY_MAP[String(game || '')];
    let matchInfo: Record<string, unknown> | null = null;

    if (gameKey && state && drawDate && drawWindow) {
      const stateCode = state === 'MULTI' ? 'NC' : state;
      const { data: gameRowData } = await supabase
        .from('lottery_games')
        .select('id, has_bonus')
        .eq('game_key', gameKey)
        .eq('state_code', stateCode)
        .maybeSingle();
      const gameRow = gameRowData as { id?: string; has_bonus?: boolean | null } | null;

      if (gameRow) {
        const { data: drawsData } = await supabase
          .from('official_draws')
          .select('primary_numbers, bonus_numbers, fireball_value')
          .eq('game_id', gameRow.id)
          .eq('draw_date', drawDate)
          .eq('draw_window_label', drawWindow);
        const draws = (drawsData || []) as DrawRow[];

        if (draws && draws.length > 0) {
          const draw = draws[0];
          const predictedNumbers = Array.isArray(prediction.predicted_numbers)
            ? prediction.predicted_numbers.filter((v: unknown): v is number => typeof v === 'number')
            : [];
          const drawNumbers = Array.isArray(draw.primary_numbers)
            ? draw.primary_numbers.filter((v: unknown): v is number => typeof v === 'number')
            : [];
          const drawBonus = Array.isArray(draw.bonus_numbers) ? draw.bonus_numbers[0] : null;
          const predictedBonus = prediction.bonus_number ? Number(prediction.bonus_number) : null;
          const drawFireball = typeof draw.fireball_value === 'number' ? draw.fireball_value : null;

          const primaryMatch = intersectCount(predictedNumbers, drawNumbers);
          const bonusMatch = drawBonus !== null && predictedBonus !== null && Number(drawBonus) === predictedBonus;

          matchInfo = {
            drawDate,
            drawWindow,
            primaryMatch,
            bonusMatch,
            totalMatch: primaryMatch + (bonusMatch ? 1 : 0),
            drawNumbers,
            drawBonus,
            drawFireball,
          };
        }
      }
    }

    enriched.push({ ...prediction, matchInfo });
  }

  return enriched;
}

function getWorstFreshnessStatus(statuses: string[]) {
  const rank = { failed: 0, stale: 1, delayed: 2, healthy: 3, unknown: 4 } as const;
  return [...statuses].sort((a, b) => (rank[a as keyof typeof rank] ?? 5) - (rank[b as keyof typeof rank] ?? 5))[0] || 'unknown';
}

function resolveDashboardConfig(gameKey: string, state: string) {
  const entries = ['pick3', 'pick4', 'cash5', 'powerball', 'mega'] as DashboardGameId[];
  const normalizedState = state === 'CA' ? 'CA' : 'NC';

  return entries
    .map((gameId) => resolveDashboardGameConfig(gameId, normalizedState as DashboardStateCode))
    .filter((config): config is NonNullable<ReturnType<typeof resolveDashboardGameConfig>> => Boolean(config))
    .find((config) => {
      const matchesRequestRoute = config.requestGameKey === gameKey && config.requestState === state;
      const matchesPredictionRoute = config.predictionGame === gameKey && config.predictionStates.includes(state);
      return matchesRequestRoute || matchesPredictionRoute;
    }) || null;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    
    const state = searchParams.get('state');
    const game = searchParams.get('game');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const createdAfter = searchParams.get('created_after');
    const savedParam = searchParams.get('saved');
    const drawWindow = searchParams.get('draw_window');
    const savedOnly = savedParam === 'true';
    
    let query = supabase
      .from('predictions')
      .select(`
        *,
        prediction_explanations(id, explanation_type, summary_text),
        prediction_strategy_scores(id, strategy_key, score)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (state) {
      query = query.eq('state', state);
    }
    if (game) {
      query = query.eq('game', game);
    }
    if (createdAfter) {
      query = query.gte('created_at', createdAfter);
    }
    if (drawWindow) {
      query = query.eq('draw_time', drawWindow);
    }
    if (savedOnly) {
      query = query.eq('is_saved', true);
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'FETCH_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    const predictions = data || [];
    const enriched = await attachMatchInfo(supabase, predictions);

    return NextResponse.json({
      success: true,
      data: enriched,
      meta: { total: count || 0, limit, offset }
    });
  } catch (error: any) {
    console.error('Predictions GET error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    
    const { gameKey, state, drawTime, userId } = body;
    
    if (!gameKey || !state) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'gameKey and state are required' } },
        { status: 400 }
      );
    }

    const freshnessConfig = resolveDashboardConfig(gameKey, state);
    if (freshnessConfig) {
      const { data: freshnessRows, error: freshnessError } = await supabase
        .from('v_ingestion_health_summary')
        .select('freshness_status')
        .eq('state_code', freshnessConfig.statsStateCode)
        .eq('game_key', freshnessConfig.statsGameKey);

      if (freshnessError) {
        return NextResponse.json(
          { success: false, error: { code: 'FRESHNESS_ERROR', message: freshnessError.message } },
          { status: 500 }
        );
      }

      const freshnessStatus = getWorstFreshnessStatus((freshnessRows || []).map((row) => row.freshness_status || 'unknown'));
      if (freshnessStatus !== 'healthy') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'STALE_SOURCE_DATA',
              message: `Cannot generate ${gameKey} predictions while source freshness is ${freshnessStatus}. Wait for the latest official draw ingestion to complete.`,
            },
          },
          { status: 409 }
        );
      }
    }
    
    // Import and run the prediction generator
    const { generatePrediction } = await import('@/lib/prediction/predictionGenerator.js');
    const result = await generatePrediction({ gameKey, state, drawTime, userId });
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: 'PREDICTION_ERROR', message: result.error } },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: result.prediction,
      meta: {}
    }, { status: 201 });
  } catch (error: any) {
    console.error('Predictions POST error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
