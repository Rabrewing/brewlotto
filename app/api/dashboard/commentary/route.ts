/**
 * GET /api/dashboard/commentary?game=pick3
 * Returns the latest stored prediction explanation for the dashboard game.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { DASHBOARD_GAME_CONFIG, type DashboardGameId } from '@/lib/dashboard/game-config';

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function buildFallback(game: string) {
  return {
    summary: `Brew is waiting on a fresh stored prediction for ${game}. Generate a new pick to populate live explainability here.`,
    strategyLabel: null,
    confidenceScore: null,
    generatedAt: null,
    sourceGame: null,
    primaryNumbers: [],
    bonusNumber: null,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const game = (searchParams.get('game') || 'powerball') as DashboardGameId;
    const config = DASHBOARD_GAME_CONFIG[game];

    if (!config) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Unsupported game key' } },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('predictions')
      .select(`
        id,
        game,
        state,
        created_at,
        source_strategy_key,
        confidence_score,
        predicted_numbers,
        bonus_number,
        prediction_explanations(id, explanation_type, summary_text, detail_text)
      `)
      .eq('game', config.predictionGame)
      .in('state', config.predictionStates)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'FETCH_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    const latestWithExplanation = (data || []).find((prediction) =>
      Array.isArray(prediction.prediction_explanations) && prediction.prediction_explanations.length > 0,
    );

    if (!latestWithExplanation) {
      return NextResponse.json({
        success: true,
        data: buildFallback(game),
        meta: { fallback: true },
      });
    }

    const explanation = latestWithExplanation.prediction_explanations.find(
      (item) => item.summary_text || item.detail_text,
    );

    return NextResponse.json({
      success: true,
      data: {
        summary:
          explanation?.summary_text ||
          explanation?.detail_text ||
          buildFallback(game).summary,
        strategyLabel: latestWithExplanation.source_strategy_key,
        confidenceScore: latestWithExplanation.confidence_score,
        generatedAt: latestWithExplanation.created_at,
        sourceGame: latestWithExplanation.game,
        primaryNumbers: Array.isArray(latestWithExplanation.predicted_numbers)
          ? latestWithExplanation.predicted_numbers
          : [],
        bonusNumber: latestWithExplanation.bonus_number,
      },
      meta: { fallback: !explanation },
    });
  } catch (error: unknown) {
    console.error('Dashboard commentary GET error:', error);
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
