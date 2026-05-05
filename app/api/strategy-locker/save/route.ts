import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/lib/supabase/serverClient';

type TierCode = 'free' | 'starter' | 'pro' | 'master';

const TIER_ORDER: Record<TierCode, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  master: 3,
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

async function ensureProfileRows(admin: ReturnType<typeof getAdminClient>, userId: string, email: string | null) {
  await admin.from('profiles').upsert({
    id: userId,
  }, { onConflict: 'id' });

  await admin.from('user_profiles').upsert({
    id: userId,
    email,
    last_login: new Date().toISOString(),
  }, { onConflict: 'id' });
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
            message: 'You need to sign in before saving a strategy.',
          },
        },
        { status: 401 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const strategyId = String(body?.strategyId || '').trim();
    const action = String(body?.action || 'save').toLowerCase();

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

    if (action !== 'save' && action !== 'remove') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Action must be save or remove.',
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
          .select('id, strategy_key, public_name, min_tier, is_active')
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

    if (action === 'remove') {
      const { error: deleteError } = await admin
        .from('user_saved_strategies')
        .delete()
        .eq('user_id', user.id)
        .eq('strategy_id', strategyId);

      if (deleteError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'DELETE_ERROR',
              message: deleteError.message,
            },
          },
          { status: 500 },
        );
      }

      await admin.from('user_strategy_activity').insert({
        user_id: user.id,
        strategy_id: strategyId,
        context: 'favorite',
        occurred_at: new Date().toISOString(),
        metadata: {
          action: 'remove',
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          saved: false,
          strategyId,
          strategyKey: strategyRow.strategy_key,
          publicName: strategyRow.public_name,
          action: 'remove',
        },
      });
    }

    const { data: savedRow, error: upsertError } = await admin
      .from('user_saved_strategies')
      .upsert(
        {
          user_id: user.id,
          strategy_id: strategyId,
          is_favorite: true,
        },
        { onConflict: 'user_id,strategy_id' },
      )
      .select('strategy_id, is_favorite, nickname, updated_at')
      .single();

    if (upsertError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'SAVE_ERROR',
            message: upsertError.message,
          },
        },
        { status: 500 },
      );
    }

    await admin.from('user_strategy_activity').insert({
      user_id: user.id,
      strategy_id: strategyId,
      context: 'favorite',
      occurred_at: new Date().toISOString(),
      metadata: {
        action: 'save',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        saved: true,
        strategyId: savedRow.strategy_id,
        isFavorite: savedRow.is_favorite,
        strategyKey: strategyRow.strategy_key,
        publicName: strategyRow.public_name,
        action: 'save',
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to save strategy.',
        },
      },
      { status: 500 },
    );
  }
}
