/**
 * GET /api/predictions - List predictions
 * POST /api/predictions - Create a new prediction
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
