import { NextRequest, NextResponse } from 'next/server';
import { getStripePriceId, stripeApiRequest } from '@/lib/billing/stripe';
import { createSupabaseServerClient } from '@/lib/supabase/serverClient.js';

type BillingTierCode = 'starter' | 'pro' | 'master';
type BillingInterval = 'month' | 'year';

function getOrigin(request: NextRequest) {
  return process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const tier = String(body?.tier || body?.tierKey || 'starter') as BillingTierCode;
    const interval = String(body?.interval || 'month') as BillingInterval;

    if (!['starter', 'pro', 'master'].includes(tier) || !['month', 'year'].includes(interval)) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid tier or interval' } },
        { status: 400 },
      );
    }

    const priceId = getStripePriceId(tier, interval);
    if (!priceId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CONFIG_ERROR',
            message: `Missing Stripe price id for ${tier} (${interval})`,
          },
        },
        { status: 500 },
      );
    }

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
        { success: false, error: { code: 'AUTH_REQUIRED', message: 'Sign in before starting checkout' } },
        { status: 401 },
      );
    }

    const origin = getOrigin(request);
    const successUrl = `${origin}/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/pricing?checkout=cancelled`;

    const form = new URLSearchParams();
    form.set('mode', 'subscription');
    form.set('success_url', successUrl);
    form.set('cancel_url', cancelUrl);
    form.set('client_reference_id', user.id);
    form.set('line_items[0][price]', priceId);
    form.set('line_items[0][quantity]', '1');
    form.set('subscription_data[metadata][user_id]', user.id);
    form.set('subscription_data[metadata][tier_key]', tier);
    form.set('subscription_data[metadata][interval]', interval);
    form.set('subscription_data[metadata][price_id]', priceId);
    form.set('metadata[user_id]', user.id);
    form.set('metadata[tier_key]', tier);
    form.set('metadata[interval]', interval);
    form.set('allow_promotion_codes', 'true');
    if (user.email) {
      form.set('customer_email', user.email);
    }

    const session = await stripeApiRequest('/checkout/sessions', form);

    return NextResponse.json({
      success: true,
      data: {
        checkoutUrl: session.url,
        sessionId: session.id,
        priceId,
        tier,
        interval,
      },
    });
  } catch (error: unknown) {
    console.error('Billing checkout POST error:', error);
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
