import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/serverClient.js';
import {
  createBillingAdminClient,
  getEffectiveBillingTier,
  loadCurrentBillingSubscription,
  upsertBillingEntitlements,
} from '@/lib/billing/stripe';

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
    const { subscription, error: subscriptionError } = await loadCurrentBillingSubscription(admin, user.id);

    if (subscriptionError) {
      throw subscriptionError;
    }

    const tier = getEffectiveBillingTier(subscription);

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
