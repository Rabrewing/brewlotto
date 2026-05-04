import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/serverClient.js';
import { stripeApiRequest } from '@/lib/billing/stripe';
import { createBillingAdminClient } from '@/lib/billing/stripe';

function getOrigin(request: NextRequest) {
  return process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
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
        { success: false, error: { code: 'AUTH_REQUIRED', message: 'Sign in before opening the billing portal' } },
        { status: 401 },
      );
    }

    const admin = createBillingAdminClient();
    const { data: subscription, error: subscriptionError } = await admin
      .from('user_subscriptions')
      .select('provider_customer_id, status, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subscriptionError) {
      throw subscriptionError;
    }

    if (!subscription?.provider_customer_id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NO_STRIPE_CUSTOMER',
            message: 'No Stripe customer record is available yet. Complete checkout first.',
          },
        },
        { status: 404 },
      );
    }

    const origin = getOrigin(request);
    const form = new URLSearchParams();
    form.set('customer', subscription.provider_customer_id);
    form.set('return_url', `${origin}/billing`);

    const session = await stripeApiRequest('/billing_portal/sessions', form);

    return NextResponse.json({
      success: true,
      data: {
        portalUrl: session.url,
      },
    });
  } catch (error: unknown) {
    console.error('Billing portal POST error:', error);
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
