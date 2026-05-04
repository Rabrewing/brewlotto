import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  createBillingAdminClient,
  ensureBillingSubscriptionProduct,
  getBillingTierEntitlementPayload,
  markBillingWebhookProcessed,
  resolveIntervalFromPriceId,
  resolveTierFromPriceId,
  upsertBillingEntitlements,
  upsertBillingWebhookEvent,
  verifyStripeSignature,
} from '@/lib/billing/stripe';

type StripeEvent = {
  id: string;
  type: string;
  data?: {
    object?: Record<string, any>;
  };
};

function normalizeTier(value: unknown) {
  const tier = String(value || '').toLowerCase();
  if (tier === 'starter' || tier === 'pro' || tier === 'master' || tier === 'free') {
    return tier;
  }

  return null;
}

function getSubscriptionWindow(subscription: Record<string, any>) {
  const start = typeof subscription.current_period_start === 'number'
    ? new Date(subscription.current_period_start * 1000).toISOString()
    : new Date().toISOString();
  const end = typeof subscription.current_period_end === 'number'
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null;

  return { start, end };
}

async function upsertSubscriptionRecord(
  admin: ReturnType<typeof createBillingAdminClient>,
  input: {
    userId: string;
    customerId: string | null;
    subscriptionId: string | null;
    tier: 'free' | 'starter' | 'pro' | 'master';
    interval: 'month' | 'year';
    stripePriceId: string | null;
    stripeProductId: string | null;
    status: string;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    trialEnd: string | null;
  },
) {
  const subscriptionProductId = await ensureBillingSubscriptionProduct(admin, {
    tier: input.tier,
    interval: input.interval,
    stripeProductId: input.stripeProductId,
    stripePriceId: input.stripePriceId,
  });

  const existing = input.subscriptionId
    ? await admin
        .from('user_subscriptions')
        .select('id')
        .eq('provider_subscription_id', input.subscriptionId)
        .maybeSingle()
    : { data: null, error: null };

  if (existing.error) {
    throw existing.error;
  }

  const row = {
    id: existing.data?.id || crypto.randomUUID(),
    user_id: input.userId,
    provider: 'stripe',
    provider_customer_id: input.customerId,
    provider_subscription_id: input.subscriptionId,
    subscription_product_id: subscriptionProductId,
    status: input.status,
    current_period_start: input.currentPeriodStart,
    current_period_end: input.currentPeriodEnd,
    cancel_at_period_end: input.cancelAtPeriodEnd,
    trial_end: input.trialEnd,
    metadata: {
      stripe_price_id: input.stripePriceId,
      stripe_product_id: input.stripeProductId,
      tier_code: input.tier,
      interval: input.interval,
    },
  };

  const { error } = await admin
    .from('user_subscriptions')
    .upsert(row, { onConflict: 'provider_subscription_id' });

  if (error) {
    throw error;
  }
}

async function processCheckoutCompleted(admin: ReturnType<typeof createBillingAdminClient>, event: StripeEvent) {
  const session = event.data?.object || {};
  const metadata = session.metadata || {};
  const userId = String(metadata.user_id || session.client_reference_id || '');
  const tier = normalizeTier(metadata.tier_key) || 'starter';
  const interval = String(metadata.interval || 'month') === 'year' ? 'year' : 'month';
  const subscriptionId = typeof session.subscription === 'string' ? session.subscription : null;
  const customerId = typeof session.customer === 'string' ? session.customer : null;
  const stripePriceId = getStripePriceIdOrNull(tier, interval);

  if (!userId) {
    throw new Error('Checkout session missing user reference');
  }

  const { start, end } = getSubscriptionWindow({
    current_period_start: session.current_period_start,
    current_period_end: session.current_period_end,
  });

  await upsertSubscriptionRecord(admin, {
    userId,
    customerId,
    subscriptionId,
    tier,
    interval,
    stripePriceId,
    stripeProductId: null,
    status: 'active',
    currentPeriodStart: start,
    currentPeriodEnd: end,
    cancelAtPeriodEnd: false,
    trialEnd: null,
  });

  await upsertBillingEntitlements(admin, userId, tier, start);
}

function getStripePriceIdOrNull(tier: 'starter' | 'pro' | 'master', interval: 'month' | 'year') {
  return resolvePriceIdByTierInterval(tier, interval);
}

function resolvePriceIdByTierInterval(tier: 'starter' | 'pro' | 'master', interval: 'month' | 'year') {
  if (tier === 'starter') {
    return process.env[interval === 'year' ? 'STRIPE_PRICE_STARTER_YEARLY' : 'STRIPE_PRICE_STARTER_MONTHLY'] || null;
  }

  if (tier === 'pro') {
    return process.env[interval === 'year' ? 'STRIPE_PRICE_PRO_YEARLY' : 'STRIPE_PRICE_PRO_MONTHLY'] || null;
  }

  return process.env[interval === 'year' ? 'STRIPE_PRICE_MASTER_YEARLY' : 'STRIPE_PRICE_MASTER_MONTHLY'] || null;
}

async function processSubscriptionChange(admin: ReturnType<typeof createBillingAdminClient>, event: StripeEvent) {
  const subscription = event.data?.object || {};
  const price = subscription.items?.data?.[0]?.price || null;
  const priceId = typeof price?.id === 'string' ? price.id : null;
  const productId = typeof price?.product === 'string' ? price.product : null;
  const tier = resolveTierFromPriceId(priceId) || normalizeTier(subscription.metadata?.tier_key) || 'free';
  const interval = resolveIntervalFromPriceId(priceId) || (String(subscription.metadata?.interval || 'month') === 'year' ? 'year' : 'month');
  const userId = String(subscription.metadata?.user_id || '');
  const customerId = typeof subscription.customer === 'string' ? subscription.customer : null;
  const { start, end } = getSubscriptionWindow(subscription);
  const status = String(subscription.status || 'active');
  const tierToStore = tier;

  if (!userId) {
    throw new Error('Subscription event missing user reference');
  }

  await upsertSubscriptionRecord(admin, {
    userId,
    customerId,
    subscriptionId: typeof subscription.id === 'string' ? subscription.id : null,
    tier: tierToStore,
    interval: interval === 'year' ? 'year' : 'month',
    stripePriceId: priceId,
    stripeProductId: productId,
    status,
    currentPeriodStart: start,
    currentPeriodEnd: end,
    cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    trialEnd: typeof subscription.trial_end === 'number' ? new Date(subscription.trial_end * 1000).toISOString() : null,
  });

  if (status === 'active' || status === 'trialing' || status === 'past_due') {
    await upsertBillingEntitlements(admin, userId, tierToStore, start);
  } else if (status === 'canceled' || status === 'incomplete_expired' || status === 'unpaid') {
    await upsertBillingEntitlements(admin, userId, 'free', start);
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature');

  try {
    verifyStripeSignature(rawBody, signature);

    const event = JSON.parse(rawBody) as StripeEvent;
    const admin = createBillingAdminClient();

    const inserted = await upsertBillingWebhookEvent(admin, {
      eventId: event.id,
      eventType: event.type,
      payload: event,
    });

    if (!inserted) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await processCheckoutCompleted(admin, event);
          break;
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await processSubscriptionChange(admin, event);
          break;
        case 'customer.subscription.deleted':
          await processSubscriptionChange(admin, event);
          break;
        default:
          break;
      }

      await markBillingWebhookProcessed(admin, event.id);
      return NextResponse.json({ received: true });
    } catch (processingError) {
      const message = processingError instanceof Error ? processingError.message : 'Webhook processing failed';
      await markBillingWebhookProcessed(admin, event.id, { errorMessage: message });
      throw processingError;
    }
  } catch (error: unknown) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'WEBHOOK_ERROR',
          message: error instanceof Error ? error.message : 'Invalid Stripe webhook',
        },
      },
      { status: 400 },
    );
  }
}
