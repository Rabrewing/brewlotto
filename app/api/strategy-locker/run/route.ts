import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/lib/supabase/serverClient';
import StrategyEngine from '@/lib/prediction/strategyEngine';
import { PredictionStorage } from '@/lib/prediction/predictionStorage';

type TierCode = 'free' | 'starter' | 'pro' | 'master';

type RegistryStrategyKey =
  | 'hot_cold'
  | 'momentum'
  | 'poisson_basic'
  | 'strategy_explanations'
  | 'advanced_scoring'
  | 'confidence_bands'
  | 'prediction_comparisons'
  | 'deep_ai_explanations'
  | 'early_access_strategies';

type EngineKey = 'poisson' | 'momentum' | 'markov' | 'ensemble';

const TIER_ORDER: Record<TierCode, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  master: 3,
};

const ENGINE_BY_REGISTRY_KEY: Partial<Record<RegistryStrategyKey, EngineKey>> = {
  hot_cold: 'poisson',
  momentum: 'momentum',
  poisson_basic: 'poisson',
  strategy_explanations: 'ensemble',
  advanced_scoring: 'ensemble',
  confidence_bands: 'ensemble',
  prediction_comparisons: 'ensemble',
  deep_ai_explanations: 'ensemble',
  early_access_strategies: 'ensemble',
};

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function normalizeTier(value: unknown): TierCode {
  const tier = String(value || '').toLowerCase();
  if (tier === 'starter' || tier === 'pro' || tier === 'master') {
    return tier;
  }

  return 'free';
}

function getEngineKey(strategyKey: string): EngineKey {
  return ENGINE_BY_REGISTRY_KEY[strategyKey as RegistryStrategyKey] || 'ensemble';
}

function countFrequencies(draws: Array<{ primary_numbers?: number[] | null }>, min: number, max: number) {
  const frequency: Record<number, number> = {};
  const recentFrequency: Record<number, number> = {};
  const transitionMatrix: Record<number, Record<number, number>> = {};

  for (let number = min; number <= max; number += 1) {
    frequency[number] = 0;
    recentFrequency[number] = 0;
    transitionMatrix[number] = {};
    for (let to = min; to <= max; to += 1) {
      transitionMatrix[number][to] = 0;
    }
  }

  for (let index = 0; index < draws.length; index += 1) {
    const numbers = Array.isArray(draws[index]?.primary_numbers) ? draws[index]?.primary_numbers || [] : [];
    const isRecentWindow = index < Math.min(12, draws.length);

    for (const number of numbers) {
      if (frequency[number] !== undefined) {
        frequency[number] += 1;
      }

      if (isRecentWindow && recentFrequency[number] !== undefined) {
        recentFrequency[number] += 1;
      }
    }

    const nextNumbers = Array.isArray(draws[index + 1]?.primary_numbers) ? draws[index + 1]?.primary_numbers || [] : [];
    for (const fromNumber of numbers) {
      for (const toNumber of nextNumbers) {
        if (transitionMatrix[fromNumber]?.[toNumber] !== undefined) {
          transitionMatrix[fromNumber][toNumber] += 1;
        }
      }
    }
  }

  return {
    frequency,
    recentFrequency,
    transitionMatrix,
  };
}

function summarizeScoreMap(scoreMap: Record<string, number> | undefined | null) {
  if (!scoreMap) {
    return 0;
  }

  const values = Object.values(scoreMap).filter((value) => Number.isFinite(Number(value)));
  if (values.length === 0) {
    return 0;
  }

  return Number((values.reduce((sum, value) => sum + Number(value), 0) / values.length).toFixed(4));
}

async function resolveHomeState(admin: ReturnType<typeof getAdminClient>, userId: string): Promise<'NC' | 'CA'> {
  const { data } = await admin
    .from('user_preferences')
    .select('default_state_code')
    .eq('user_id', userId)
    .maybeSingle();

  const state = String(data?.default_state_code || '').toUpperCase();
  return state === 'CA' ? 'CA' : 'NC';
}

async function ensureProfileRows(admin: ReturnType<typeof getAdminClient>, userId: string, email: string | null) {
  await admin.from('profiles').upsert(
    {
      id: userId,
    },
    { onConflict: 'id' },
  );

  await admin.from('user_profiles').upsert(
    {
      id: userId,
      email,
      last_login: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AUTH_ERROR',
            message: userError.message,
          },
        },
        { status: 401 },
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You need to sign in before running a strategy.',
          },
        },
        { status: 401 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const strategyId = String(body?.strategyId || '').trim();

    if (!strategyId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'A strategy id is required.',
          },
        },
        { status: 400 },
      );
    }

    const admin = getAdminClient();

    const [{ data: strategyRow, error: strategyError }, { data: entitlementRow, error: entitlementError }] =
      await Promise.all([
        admin
          .from('strategy_registry')
          .select('id, strategy_key, public_name, description, min_tier, is_active, category, metadata')
          .eq('id', strategyId)
          .maybeSingle(),
        admin
          .from('user_entitlements')
          .select('tier_code')
          .eq('user_id', user.id)
          .maybeSingle(),
      ]);

    if (strategyError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FETCH_ERROR',
            message: strategyError.message,
          },
        },
        { status: 500 },
      );
    }

    if (entitlementError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FETCH_ERROR',
            message: entitlementError.message,
          },
        },
        { status: 500 },
      );
    }

    if (!strategyRow || !strategyRow.is_active) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Strategy not found or inactive.',
          },
        },
        { status: 404 },
      );
    }

    const currentTier = normalizeTier(entitlementRow?.tier_code);
    const requiredTier = normalizeTier(strategyRow.min_tier);

    if (TIER_ORDER[currentTier] < TIER_ORDER[requiredTier]) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: `This strategy requires ${requiredTier} access.`,
          },
        },
        { status: 403 },
      );
    }

    await ensureProfileRows(admin, user.id, user.email || null);

    const homeState = await resolveHomeState(admin, user.id);
    const gameKey = 'pick3';

    const { data: gameRow, error: gameError } = await admin
      .from('lottery_games')
      .select('id, game_key, display_name, primary_count, primary_min, primary_max, has_bonus, bonus_min, bonus_max')
      .eq('game_key', gameKey)
      .eq('state_code', homeState)
      .maybeSingle();

    if (gameError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'GAME_FETCH_ERROR',
            message: gameError.message,
          },
        },
        { status: 500 },
      );
    }

    if (!gameRow) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'GAME_NOT_FOUND',
            message: `No default game found for ${homeState}.`,
          },
        },
        { status: 404 },
      );
    }

    const { data: drawRows, error: drawError } = await admin
      .from('official_draws')
      .select('primary_numbers')
      .eq('game_id', gameRow.id)
      .order('draw_datetime_local', { ascending: false })
      .limit(100);

    if (drawError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DRAW_FETCH_ERROR',
            message: drawError.message,
          },
        },
        { status: 500 },
      );
    }

    const strategyEngine = new StrategyEngine();
    const featureData = countFrequencies(
      (drawRows || []) as Array<{ primary_numbers?: number[] | null }>,
      Number(gameRow.primary_min),
      Number(gameRow.primary_max),
    );
    const strategyScores = strategyEngine.executeStrategies({
      ...featureData,
      numberRange: {
        min: Number(gameRow.primary_min),
        max: Number(gameRow.primary_max),
      },
    });
    const engineKey = getEngineKey(strategyRow.strategy_key);
    const selectedScores =
      engineKey === 'ensemble'
        ? strategyEngine.calculateEnsembleScores(strategyScores)
        : strategyScores[engineKey] || {};
    const candidatePicks = strategyEngine.generateCandidatePicks(selectedScores, {
      primary_count: Number(gameRow.primary_count),
      primary_min: Number(gameRow.primary_min),
      primary_max: Number(gameRow.primary_max),
      has_bonus: Boolean(gameRow.has_bonus),
      bonus_min: Number(gameRow.bonus_min || 1),
      bonus_max: Number(gameRow.bonus_max || 1),
    }, 1);

    const primaryNumbers = candidatePicks[0] || [];
    const bonusNumbers = Boolean(gameRow.has_bonus)
      ? [Math.floor(Math.random() * (Number(gameRow.bonus_max || 1) - Number(gameRow.bonus_min || 1) + 1)) + Number(gameRow.bonus_min || 1)]
      : [];
    const scoreEntries = Object.entries(strategyScores).map(([key, value]) => ({
      strategy_key: key,
      public_label: key,
      weight: 1,
      score: summarizeScoreMap(value as Record<string, number> | null | undefined),
      notes: [`Engine run via ${engineKey}`],
    }));

    const storage = new PredictionStorage(admin);
    const stored = await storage.storePrediction({
      user_id: user.id,
      state: homeState,
      game: gameRow.game_key,
      target_draw_date: new Date().toISOString().slice(0, 10),
      target_draw_window_label: 'run',
      primary_numbers: primaryNumbers,
      bonus_numbers: bonusNumbers,
      composite_score: engineKey === 'ensemble' ? 78 : 72,
      confidence_band: 'medium',
      strategy_public_label: strategyRow.strategy_key,
      strategy_internal_bundle: {
        registry_strategy_key: strategyRow.strategy_key,
        engine_key: engineKey,
        category: strategyRow.category,
        metadata: strategyRow.metadata || {},
      },
      evidence_bundle: {
        homeState,
        gameKey,
        drawCount: (drawRows || []).length,
        engineKey,
      },
      is_saved_by_default: false,
      explanations: [
        {
          explanation_type: 'summary',
          summary_text: `${strategyRow.public_name} ran against your ${homeState} default game and produced ${primaryNumbers.join(', ')}.`,
          detail_text: strategyRow.description || null,
        },
      ],
      strategyScores: scoreEntries,
    });

    await admin.from('user_strategy_activity').insert({
      user_id: user.id,
      strategy_id: strategyId,
      context: 'run',
      occurred_at: new Date().toISOString(),
      metadata: {
        action: 'run',
        engineKey,
        gameKey,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        strategyId,
        strategyKey: strategyRow.strategy_key,
        publicName: strategyRow.public_name,
        engineKey,
        gameKey,
        homeState,
        prediction: stored,
        primaryNumbers,
        bonusNumbers,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to run strategy.',
        },
      },
      { status: 500 },
    );
  }
}
