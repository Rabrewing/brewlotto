import crypto from 'crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type BillingTierCode = 'free' | 'starter' | 'pro' | 'master';
export type BillingInterval = 'month' | 'year';

export interface BillingTierEntitlementPayload {
  tier_code: BillingTierCode;
  tier_rank: number;
  ai_quota_monthly: number;
  ai_quota_used: number;
  pick_generation_limit_daily: number;
  advanced_strategy_access: boolean;
  premium_explanations_access: boolean;
  premium_comparison_access: boolean;
  export_access: boolean;
  voice_commentary_access: boolean;
  notifications_premium_access: boolean;
  effective_from: string;
  effective_to: string | null;
}

const TIER_ORDER: Record<BillingTierCode, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  master: 3,
};

const TIER_PRICE_ENV: Record<Exclude<BillingTierCode, 'free'>, Record<BillingInterval, string>> = {
  starter: {
    month: 'STRIPE_PRICE_STARTER_MONTHLY',
    year: 'STRIPE_PRICE_STARTER_YEARLY',
  },
  pro: {
    month: 'STRIPE_PRICE_PRO_MONTHLY',
    year: 'STRIPE_PRICE_PRO_YEARLY',
  },
  master: {
    month: 'STRIPE_PRICE_MASTER_MONTHLY',
    year: 'STRIPE_PRICE_MASTER_YEARLY',
  },
};

const TIER_TO_BILLING_PRODUCT_CODE: Record<BillingTierCode, Record<BillingInterval, string>> = {
  free: {
    month: 'free_month',
    year: 'free_year',
  },
  starter: {
    month: 'starter_month',
    year: 'starter_year',
  },
  pro: {
    month: 'pro_month',
    year: 'pro_year',
  },
  master: {
    month: 'master_month',
    year: 'master_year',
  },
};

const TIER_FEATURES: Record<BillingTierCode, BillingTierEntitlementPayload> = {
  free: {
    tier_code: 'free',
    tier_rank: TIER_ORDER.free,
    ai_quota_monthly: 0,
    ai_quota_used: 0,
    pick_generation_limit_daily: 5,
    advanced_strategy_access: false,
    premium_explanations_access: false,
    premium_comparison_access: false,
    export_access: false,
    voice_commentary_access: false,
    notifications_premium_access: false,
    effective_from: new Date().toISOString(),
    effective_to: null,
  },
  starter: {
    tier_code: 'starter',
    tier_rank: TIER_ORDER.starter,
    ai_quota_monthly: 100,
    ai_quota_used: 0,
    pick_generation_limit_daily: 25,
    advanced_strategy_access: true,
    premium_explanations_access: false,
    premium_comparison_access: false,
    export_access: false,
    voice_commentary_access: false,
    notifications_premium_access: false,
    effective_from: new Date().toISOString(),
    effective_to: null,
  },
  pro: {
    tier_code: 'pro',
    tier_rank: TIER_ORDER.pro,
    ai_quota_monthly: 300,
    ai_quota_used: 0,
    pick_generation_limit_daily: 75,
    advanced_strategy_access: true,
    premium_explanations_access: true,
    premium_comparison_access: true,
    export_access: false,
    voice_commentary_access: false,
    notifications_premium_access: true,
    effective_from: new Date().toISOString(),
    effective_to: null,
  },
  master: {
    tier_code: 'master',
    tier_rank: TIER_ORDER.master,
    ai_quota_monthly: 750,
    ai_quota_used: 0,
    pick_generation_limit_daily: 200,
    advanced_strategy_access: true,
    premium_explanations_access: true,
    premium_comparison_access: true,
    export_access: true,
    voice_commentary_access: true,
    notifications_premium_access: true,
    effective_from: new Date().toISOString(),
    effective_to: null,
  },
};

const STRIPE_API_BASE = 'https://api.stripe.com/v1';

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export function getStripeSecretKey() {
  return getRequiredEnv('STRIPE_SECRET_KEY');
}

export function getStripeWebhookSecret() {
  return getRequiredEnv('STRIPE_WEBHOOK_SECRET');
}

export function getStripePriceId(tier: Exclude<BillingTierCode, 'free'>, interval: BillingInterval) {
  return process.env[TIER_PRICE_ENV[tier][interval]] || null;
}

export function resolveTierFromPriceId(priceId: string | null | undefined): BillingTierCode | null {
  if (!priceId) {
    return null;
  }

  for (const [tier, mapping] of Object.entries(TIER_PRICE_ENV) as Array<[
    Exclude<BillingTierCode, 'free'>,
    Record<BillingInterval, string>,
  ]>) {
    if (mapping.month && process.env[mapping.month] === priceId) {
      return tier;
    }

    if (mapping.year && process.env[mapping.year] === priceId) {
      return tier;
    }
  }

  return null;
}

export function resolveIntervalFromPriceId(priceId: string | null | undefined): BillingInterval | null {
  if (!priceId) {
    return null;
  }

  for (const mapping of Object.values(TIER_PRICE_ENV)) {
    if (mapping.month && process.env[mapping.month] === priceId) {
      return 'month';
    }

    if (mapping.year && process.env[mapping.year] === priceId) {
      return 'year';
    }
  }

  return null;
}

export function getBillingTierEntitlementPayload(
  tier: BillingTierCode,
  effectiveFrom = new Date().toISOString(),
): BillingTierEntitlementPayload {
  return {
    ...TIER_FEATURES[tier],
    effective_from: effectiveFrom,
    effective_to: null,
  };
}

export function getBillingProductCode(tier: BillingTierCode, interval: BillingInterval) {
  return TIER_TO_BILLING_PRODUCT_CODE[tier][interval];
}

export function getBillingProductName(tier: BillingTierCode, interval: BillingInterval) {
  const base = tier === 'free' ? 'Free Explorer' : `Brew${tier.charAt(0).toUpperCase()}${tier.slice(1)}`;
  return `${base} ${interval === 'year' ? 'Annual' : 'Monthly'}`;
}

export function getAnnualPriceFromMonthly(priceMonthly: number | null | undefined) {
  if (priceMonthly == null) {
    return null;
  }

  return Number((priceMonthly * 12 * 0.7).toFixed(2));
}

export function buildStripeHeaders() {
  return {
    Authorization: `Bearer ${getStripeSecretKey()}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
}

export async function stripeApiRequest(path: string, formData: URLSearchParams) {
  const response = await fetch(`${STRIPE_API_BASE}${path}`, {
    method: 'POST',
    headers: buildStripeHeaders(),
    body: formData.toString(),
  });

  const text = await response.text();
  let payload: any = null;

  try {
    payload = JSON.parse(text);
  } catch {
    payload = { raw: text };
  }

  if (!response.ok) {
    const message = payload?.error?.message || `Stripe request failed for ${path}`;
    throw new Error(message);
  }

  return payload;
}

export function verifyStripeSignature(rawBody: string, signatureHeader: string | null) {
  const secret = getStripeWebhookSecret();
  if (!signatureHeader) {
    throw new Error('Missing Stripe signature header');
  }

  const parts = signatureHeader.split(',').map((item) => item.trim());
  const entries = new Map<string, string[]>();

  for (const part of parts) {
    const separatorIndex = part.indexOf('=');
    if (separatorIndex <= 0) {
      continue;
    }

    const key = part.slice(0, separatorIndex);
    const value = part.slice(separatorIndex + 1);
    const list = entries.get(key) || [];
    list.push(value);
    entries.set(key, list);
  }

  const timestamp = entries.get('t')?.[0];
  const signatures = entries.get('v1') || [];

  if (!timestamp || signatures.length === 0) {
    throw new Error('Invalid Stripe signature header');
  }

  const signedPayload = `${timestamp}.${rawBody}`;
  const expectedSignature = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');

  for (const signature of signatures) {
    const signatureBuffer = Buffer.from(signature, 'hex');
    if (signatureBuffer.length !== expectedBuffer.length) {
      continue;
    }

    if (crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
      return true;
    }
  }

  throw new Error('Stripe signature verification failed');
}

export function createBillingAdminClient() {
  return createClient(
    getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
    getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

export async function upsertBillingEntitlements(
  supabase: SupabaseClient,
  userId: string,
  tier: BillingTierCode,
  effectiveFrom = new Date().toISOString(),
) {
  const payload = getBillingTierEntitlementPayload(tier, effectiveFrom);

  const { error } = await supabase.from('user_entitlements').upsert(
    {
      user_id: userId,
      ...payload,
    },
    { onConflict: 'user_id' },
  );

  if (error) {
    throw error;
  }

  return payload;
}

export async function upsertBillingWebhookEvent(
  supabase: SupabaseClient,
  input: {
    eventId: string;
    eventType: string;
    payload: unknown;
  },
) {
  const { data: existing, error: existingError } = await supabase
    .from('billing_webhook_events')
    .select('provider_event_id, processed, error_message')
    .eq('provider_event_id', input.eventId)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existing) {
    return null;
  }

  const { data, error } = await supabase
    .from('billing_webhook_events')
    .insert({
      id: crypto.randomUUID(),
      provider: 'stripe',
      provider_event_id: input.eventId,
      event_type: input.eventType,
      payload: input.payload,
      processed: false,
    })
    .select('provider_event_id, processed, error_message')
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data || null;
}

export async function ensureBillingSubscriptionProduct(
  supabase: SupabaseClient,
  options: {
    tier: BillingTierCode;
    interval: BillingInterval;
    stripeProductId?: string | null;
    stripePriceId?: string | null;
  },
) {
  const code = getBillingProductCode(options.tier, options.interval);
  const name = getBillingProductName(options.tier, options.interval);
  const featureMatrix = getBillingTierEntitlementPayload(options.tier);

  const { data: existing, error: existingError } = await supabase
    .from('subscription_products')
    .select('id')
    .eq('code', code)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existing?.id) {
    const { error: updateError } = await supabase
      .from('subscription_products')
      .update({
        provider: 'stripe',
        provider_product_id: options.stripeProductId || null,
        provider_price_id: options.stripePriceId || null,
        name,
        billing_interval: options.interval,
        rank: TIER_ORDER[options.tier],
        feature_matrix: featureMatrix,
        is_active: true,
      })
      .eq('id', existing.id);

    if (updateError) {
      throw updateError;
    }

    return existing.id;
  }

  const productId = crypto.randomUUID();
  const { error: insertError } = await supabase.from('subscription_products').insert({
    id: productId,
    provider: 'stripe',
    provider_product_id: options.stripeProductId || null,
    provider_price_id: options.stripePriceId || null,
    code,
    name,
    billing_interval: options.interval,
    rank: TIER_ORDER[options.tier],
    feature_matrix: featureMatrix,
    is_active: true,
  });

  if (insertError) {
    throw insertError;
  }

  return productId;
}

export async function markBillingWebhookProcessed(
  supabase: SupabaseClient,
  eventId: string,
  options: { errorMessage?: string | null } = {},
) {
  const { error } = await supabase
    .from('billing_webhook_events')
    .update({
      processed: !options.errorMessage,
      processed_at: options.errorMessage ? null : new Date().toISOString(),
      error_message: options.errorMessage || null,
    })
    .eq('provider_event_id', eventId);

  if (error) {
    throw error;
  }
}
