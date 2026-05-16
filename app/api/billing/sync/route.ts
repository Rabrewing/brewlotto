import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/serverClient.js';
import { createBillingAdminClient, upsertBillingEntitlements } from '@/lib/billing/stripe';

type BillingTierCode = 'free' | 'starter' | 'pro' | 'master';

function normalizeTier(value: unknown): BillingTierCode | null {
  const tier = String(value || '').toLowerCase();
  if (tier === 'starter' || tier === 'pro' || tier === 'master' || tier === 'free') {
    return tier;
  }

  return null;
}

function tierFromProductCode(code: unknown): BillingTierCode | null {
  const productCode = String(code || '').toLowerCase();
  if (productCode.includes('master')) return 'master';
  if (productCode.includes('pro')) return 'pro';
  if (productCode.includes('starter')) return 'starter';
  if (productCode.includes('free')) return 'free';
  return null;
}

function getEffectiveTier(
  subscription: {
    status?: string | null;
    metadata?: Record<string, unknown> | null;
    subscription_products?: { code?: string | null } | null;
  } | null,
): BillingTierCode | null {
  if (!subscription) {
    return null;
  }

  const status = String(subscription.status || '').toLowerCase();
  if (status === 'canceled' || status === 'incomplete_expired' || status === 'unpaid') {
    return 'free';
  }

  return (
    normalizeTier(subscription.metadata?.tier_code) ||
    tierFromProductCode(subscription.subscription_products?.code) ||
    null
  );
}

async function loadCurrentSubscription(admin: ReturnType<typeof createBillingAdminClient>, userId: string) {
  const activeQuery = admin
    .from('user_subscriptions')
    .select('status, metadata, subscription_products!inner(code)')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing', 'past_due'])
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const latestQuery = admin
    .from('user_subscriptions')
    .select('status, metadata, subscription_products!inner(code)')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const [
    { data: activeSubscription, error: activeError },
    { data: latestSubscription, error: latestError },
  ] = await Promise.all([activeQuery, latestQuery]);

  return {
    subscription: activeSubscription || latestSubscription,
    error: activeError || latestError,
  };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'AUTH_REQUIRED', message: 'Sign in before refreshing billing access' } },
        { status: 401 },
      );
    }

    const admin = createBillingAdminClient();
    const { subscription, error: subscriptionError } = await loadCurrentSubscription(admin, user.id);

    if (subscriptionError) {
      throw subscriptionError;
    }

    const tier = getEffectiveTier(subscription as {
      status?: string | null;
      metadata?: Record<string, unknown> | null;
      subscription_products?: { code?: string | null } | null;
    } | null);

    if (!tier) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NO_SUBSCRIPTION',
            message: 'No Stripe subscription record was found to refresh from. Complete checkout first.',
          },
        },
        { status: 404 },
      );
    }

    const now = new Date().toISOString();
    const effectiveFrom = tier === 'free' ? now : now;

    await upsertBillingEntitlements(admin, user.id, tier, effectiveFrom);

    return NextResponse.json({
      success: true,
      data: {
        tier,
        refreshedAt: now,
      },
    });
  } catch (error: unknown) {
    console.error('Billing sync POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown server error',
        },
      },
      { status: 500 },
    );
  }
}
