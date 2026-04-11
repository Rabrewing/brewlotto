/**
 * GET /api/predictions - List predictions
 * POST /api/predictions - Create a new prediction
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { DASHBOARD_GAME_CONFIG, type DashboardGameId } from '@/lib/dashboard/game-config';

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getWorstFreshnessStatus(statuses: string[]) {
  const rank = { failed: 0, stale: 1, delayed: 2, healthy: 3, unknown: 4 } as const;
  return [...statuses].sort((a, b) => (rank[a as keyof typeof rank] ?? 5) - (rank[b as keyof typeof rank] ?? 5))[0] || 'unknown';
}

function resolveDashboardConfig(gameKey: string, state: string) {
  const entries = Object.entries(DASHBOARD_GAME_CONFIG) as Array<[DashboardGameId, (typeof DASHBOARD_GAME_CONFIG)[DashboardGameId]]>;

  return entries.find(([, config]) => {
    const matchesRequestRoute = config.requestGameKey === gameKey && config.requestState === state;
    const matchesPredictionRoute = config.predictionGame === gameKey && config.predictionStates.includes(state);
    return matchesRequestRoute || matchesPredictionRoute;
  })?.[1] || null;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    
    const state = searchParams.get('state');
    const game = searchParams.get('game');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
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
    
    const { data, error, count } = await query;
    
    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'FETCH_ERROR', message: error.message } },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: data || [],
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
