import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/serverClient';
import { StrategyEngine } from '@/lib/prediction/strategyEngine';
import { IngestionManager } from '@/lib/ingestion/ingestionManager';

/**
 * Generate predictions for a specific game
 * GET /api/predict/[game]
 */
export async function GET(request, { params }) {
  try {
    const { game } = params;
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '1');
    const explanationDepth = searchParams.get('explanation') || 'short';
    
    // Get game configuration from database
    const supabase = createSupabaseServerClient();
    
    // Get the game details
    const { data: gameData, error: gameError } = await supabase
      .from('lottery_games')
      .select('*')
      .eq('game_key', game)
      .single();
      
    if (gameError) {
      return NextResponse.json(
        { error: `Game not found: ${game}` },
        { status: 404 }
      );
    }
    
    // Get latest feature snapshot or create a temporary one
    // In a full implementation, we would check for recent feature snapshots
    // For now, we'll create a basic feature set from recent draws
    
    // Get recent draws for feature calculation
    const { data: recentDraws, error: drawsError } = await supabase
      .from('official_draws')
      .select('*')
      .eq('game_id', gameData.id)
      .order('draw_datetime_local', { descending: true })
      .limit(100); // Use last 100 draws for feature calculation
      
    if (drawsError) {
      return NextResponse.json(
        { error: 'Failed to fetch draw data' },
        { status: 500 }
      );
    }
    
    if (!recentDraws || recentDraws.length === 0) {
      return NextResponse.json(
        { error: 'No draw data available for this game' },
        { status: 404 }
      );
    }
    
    // Prepare feature data for strategies
    const featureData = {
      game_id: gameData.id,
      recentDraws: recentDraws,
      numberRange: {
        min: gameData.has_bonus ? 1 : gameData.primary_min,
        max: gameData.has_bonus ? gameData.primary_max : gameData.primary_max
      },
      primaryCount: gameData.primary_count,
      hasBonus: gameData.has_bonus,
      bonusCount: gameData.bonus_count || 0
    };
    
    // Execute strategies
    const strategyEngine = new StrategyEngine();
    const strategyScores = strategyEngine.executeStrategies(featureData);
    const ensembleScores = strategyEngine.calculateEnsembleScores(strategyScores);
    const candidatePicks = strategyEngine.generateCandidatePicks(
      ensembleScores, 
      gameData, 
      count
    );
    
    // Format the response
    const predictions = candidatePicks.map((numbers, index) => ({
      numbers: {
        primary: numbers.slice(0, gameData.primary_count),
        bonus: gameData.has_bonus ? numbers.slice(gameData.primary_count) : []
      },
      strategy_scores: Object.entries(strategyScores)
        .filter(([, score]) => score !== null)
        .reduce((acc, [key, score]) => {
          acc[key] = parseFloat(score.toFixed(4));
          return acc;
        }, {}),
      ensemble_score: parseFloat(
        Object.values(ensembleScores).reduce((sum, score) => sum + score, 0) / 
        Object.keys(ensembleScores).length
      ).toFixed(4),
      confidence_band: 'medium', // Would be calculated based on score distribution
      generated_at: new Date().toISOString()
    }));
    
    return NextResponse.json({
      game: {
        id: gameData.id,
        key: gameData.game_key,
        name: gameData.display_name,
        family: gameData.game_family
      },
      predictions,
      generated_at: new Date().toISOString(),
      cache_until: new Date(Date.now() + 300000).toISOString() // 5 minutes
    });
  } catch (error) {
    console.error('Error in predict API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/predict
 * Submit prediction request with optional user context
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { game, count = 1, userId = null, explanationDepth = 'short' } = body;
    
    if (!game) {
      return NextResponse.json(
        { error: 'Game key is required' },
        { status: 400 }
      );
    }
    
    const supabase = createSupabaseServerClient();
    
    // Get game configuration
    const { data: gameData, error: gameError } = await supabase
      .from('lottery_games')
      .select('*')
      .eq('game_key', game)
      .single();
      
    if (gameError) {
      return NextResponse.json(
        { error: `Game not found: ${game}` },
        { status: 404 }
      );
    }
    
    // Get recent draws
    const { data: recentDraws, error: drawsError } = await supabase
      .from('official_draws')
      .select('*')
      .eq('game_id', gameData.id)
      .order('draw_datetime_local', { descending: true })
      .limit(100);
      
    if (drawsError) {
      return NextResponse.json(
        { error: 'Failed to fetch draw data' },
        { status: 500 }
      );
    }
    
    // Execute prediction strategies
    const featureData = {
      game_id: gameData.id,
      recentDraws: recentDraws,
      numberRange: {
        min: gameData.primary_min,
        max: gameData.primary_max
      },
      primaryCount: gameData.primary_count,
      hasBonus: gameData.has_bonus,
      bonusCount: gameData.bonus_count || 0
    };
    
    const strategyEngine = new StrategyEngine();
    const strategyScores = strategyEngine.executeStrategies(featureData);
    const ensembleScores = strategyEngine.calculateEnsembleScores(strategyScores);
    const candidatePicks = strategyEngine.generateCandidatePicks(
      ensembleScores, 
      gameData, 
      count
    );
    
    // Store prediction request
    const predictionRequest = {
      user_id: userId,
      game_id: gameData.id,
      request_source: 'api',
      entitlement_tier_code: userId ? 'premium' : 'free',
      variant_context: {},
      requested_count: count,
      requested_explanation_depth: explanationDepth,
      status: 'completed'
    };
    
    const { data: requestData, error: requestError } = await supabase
      .from('prediction_requests')
      .insert([predictionRequest])
      .select()
      .single();
      
    if (requestError) {
      console.error('Failed to store prediction request:', requestError);
    }
    
    // Store predictions
    const predictionsToStore = candidatePicks.map((numbers, index) => ({
      prediction_request_id: requestData?.id || null,
      game_id: gameData.id,
      user_id: userId,
      primary_numbers: numbers.slice(0, gameData.primary_count),
      bonus_numbers: gameData.has_bonus ? numbers.slice(gameData.primary_count) : [],
      special_values: {},
      composite_score: Object.values(ensembleScores).reduce((sum, score) => sum + score, 0) / Object.keys(ensembleScores).length,
      confidence_band: 'medium',
      strategy_public_label: 'Ensemble',
      strategy_internal_bundle: strategyScores,
      evidence_bundle: {},
      prediction_hash: `${game}-${Date.now()}-${index}`,
      is_saved_by_default: false
    }));
    
    if (requestData) {
      const { error: predictionsError } = await supabase
        .from('predictions')
        .insert(predictionsToStore);
        
      if (predictionsError) {
        console.error('Failed to store predictions:', predictionsError);
      }
    }
    
    // Format the response
    const predictions = candidatePicks.map((numbers, index) => ({
      numbers: {
        primary: numbers.slice(0, gameData.primary_count),
        bonus: gameData.has_bonus ? numbers.slice(gameData.primary_count) : []
      },
      strategy_scores: Object.entries(strategyScores)
        .filter(([, score]) => score !== null)
        .reduce((acc, [key, score]) => {
          acc[key] = parseFloat(score.toFixed(4));
          return acc;
        }, {}),
      ensemble_score: parseFloat(
        Object.values(ensembleScores).reduce((sum, score) => sum + score, 0) / 
        Object.keys(ensembleScores).length
      ).toFixed(4),
      confidence_band: 'medium',
      generated_at: new Date().toISOString()
    }));
    
    return NextResponse.json({
      game: {
        id: gameData.id,
        key: gameData.game_key,
        name: gameData.display_name,
        family: gameData.game_family
      },
      predictions,
      request_id: requestData?.id || null,
      generated_at: new Date().toISOString(),
      cache_until: new Date(Date.now() + 300000).toISOString()
    });
  } catch (error) {
    console.error('Error in predict API POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Get prediction history for a game
 * GET /api/predict/[game]/history
 */
export async function GET(request, { params }) {
  try {
    const { game } = params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Get game configuration from database
    const supabase = createSupabaseServerClient();
    
    // Get the game details
    const { data: gameData, error: gameError } = await supabase
      .from('lottery_games')
      .select('*')
      .eq('game_key', game)
      .single();
      
    if (gameError) {
      return NextResponse.json(
        { error: `Game not found: ${game}` },
        { status: 404 }
      );
    }
    
    // Get prediction history
    const { data: predictions, error: predsError } = await supabase
      .from('predictions')
      .select(`
        *,
        prediction_requests!inner (
          *,
          users!inner (id, username)
        ),
        lottery_games!inner (
          *,
          states!inner (code, name)
        )
      `)
      .eq('game_id', gameData.id)
      .order('created_at', { descending: true })
      .range(offset, offset + limit - 1);
      
    if (predsError) {
      return NextResponse.json(
        { error: 'Failed to fetch prediction history' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      game: {
        id: gameData.id,
        key: gameData.game_key,
        name: gameData.display_name
      },
      predictions: predictions.map(pred => ({
        id: pred.id,
        numbers: {
          primary: pred.primary_numbers,
          bonus: pred.bonus_numbers
        },
        composite_score: pred.composite_score,
        confidence_band: pred.confidence_band,
        strategy_public_label: pred.strategy_public_label,
        generated_at: pred.created_at,
        user: pred.prediction_requests?.users || null
      })),
      pagination: {
        limit,
        offset,
        total: predictions.length // In a full implementation, we'd get a count query
      }
    });
  } catch (error) {
    console.error('Error in predict history API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
