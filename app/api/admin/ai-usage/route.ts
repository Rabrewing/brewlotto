import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

import { requireBrewCommandRequest } from '@/lib/auth/brewcommand';

type TierCode = 'free' | 'starter' | 'pro' | 'master' | 'unknown';

type AiUsageRow = {
  id: string;
  created_at: string;
  route: string;
  operation: string;
  provider: string;
  model: string;
  status: 'success' | 'error';
  latency_ms: number | null;
  input_tokens: number | null;
  output_tokens: number | null;
  total_tokens: number | null;
  estimated_cost_usd: number | null;
  error_message: string | null;
  metadata: Record<string, unknown> | null;
  user_id: string | null;
};

type SubscriptionTierRow = {
  tier_key: TierCode;
  display_name: string;
  marketing_label: string | null;
  price_monthly: number | null;
  price_annual: number | null;
  sort_order: number;
};

type UserEntitlementRow = {
  user_id: string;
  tier_code: TierCode | null;
  ai_quota_monthly: number | null;
  ai_quota_used: number | null;
  effective_to: string | null;
};

type AiUsageTierMarginRow = {
  tierCode: TierCode;
  displayName: string;
  activeUsers: number;
  requestCount: number;
  tokens: number;
  estimatedCostUsd: number;
  monthlyPrice: number | null;
  estimatedMonthlyRevenueUsd: number | null;
  estimatedGrossMarginUsd: number | null;
  marginPct: number | null;
  aiQuotaMonthly: number | null;
  aiQuotaUsed: number | null;
  aiQuotaRemaining: number | null;
  costPerActiveUserUsd: number | null;
};

const getSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

function toNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  return 0;
}

function toTierCode(value: unknown): TierCode {
  if (value === 'free' || value === 'starter' || value === 'pro' || value === 'master') {
    return value;
  }

  return 'unknown';
}

function formatTierDisplayName(tier: SubscriptionTierRow | undefined, tierCode: TierCode) {
  return tier?.display_name || tier?.marketing_label || tierCode;
}

export async function GET(request: NextRequest) {
  try {
    const unauthorizedResponse = await requireBrewCommandRequest(request);
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const supabase = getSupabase();
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const [usageResult, entitlementsResult, tiersResult] = await Promise.all([
      supabase
      .from('ai_usage_events')
      .select(
        `
          id,
          created_at,
          route,
          operation,
          provider,
          model,
          status,
          latency_ms,
          input_tokens,
          output_tokens,
          total_tokens,
          estimated_cost_usd,
          error_message,
          metadata,
          user_id
        `,
      )
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false })
      .limit(500),
      supabase
        .from('user_entitlements')
        .select('user_id, tier_code, ai_quota_monthly, ai_quota_used, effective_to')
        .is('effective_to', null),
      supabase
        .from('subscription_tiers')
        .select('tier_key, display_name, marketing_label, price_monthly, price_annual, sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
    ]);

    const firstError = usageResult.error || entitlementsResult.error || tiersResult.error;

    if (firstError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FETCH_ERROR',
            message: firstError.message,
          },
        },
        { status: 500 },
      );
    }

    const rows = (usageResult.data || []) as AiUsageRow[];
    const entitlementRows = (entitlementsResult.data || []) as UserEntitlementRow[];
    const tierRows = (tiersResult.data || []) as SubscriptionTierRow[];

    const entitlementsByUserId = new Map(
      entitlementRows.map((row) => [row.user_id, row]),
    );
    const tiersByTierCode = new Map(
      tierRows.map((row) => [row.tier_key, row]),
    );

    const summary = rows.reduce(
      (acc, row) => {
        const totalTokens =
          row.total_tokens != null
            ? toNumber(row.total_tokens)
            : toNumber(row.input_tokens) + toNumber(row.output_tokens);
        const cost = toNumber(row.estimated_cost_usd);
        const latency = row.latency_ms;

        acc.requestCount += 1;
        acc.successCount += row.status === 'success' ? 1 : 0;
        acc.errorCount += row.status === 'error' ? 1 : 0;
        acc.inputTokens += toNumber(row.input_tokens);
        acc.outputTokens += toNumber(row.output_tokens);
        acc.totalTokens += totalTokens;
        acc.estimatedCostUsd += cost;
        acc.latencyTotalMs += latency ?? 0;
        acc.latencyCount += latency != null ? 1 : 0;
        acc.totalRows += 1;

        const providerBucket = acc.byProvider[row.provider] || {
          provider: row.provider,
          requestCount: 0,
          tokens: 0,
          estimatedCostUsd: 0,
        };
        providerBucket.requestCount += 1;
        providerBucket.tokens += totalTokens;
        providerBucket.estimatedCostUsd += cost;
        acc.byProvider[row.provider] = providerBucket;

        const modelKey = `${row.provider}:${row.model}`;
        const modelBucket = acc.byModel[modelKey] || {
          provider: row.provider,
          model: row.model,
          requestCount: 0,
          tokens: 0,
          estimatedCostUsd: 0,
          averageLatencyMs: 0,
          latencyCount: 0,
        };
        modelBucket.requestCount += 1;
        modelBucket.tokens += totalTokens;
        modelBucket.estimatedCostUsd += cost;
        modelBucket.averageLatencyMs += latency ?? 0;
        modelBucket.latencyCount += latency != null ? 1 : 0;
        acc.byModel[modelKey] = modelBucket;

        const metadataTier = toTierCode(
          row.metadata?.tierCode ||
            row.metadata?.tier_code ||
            row.metadata?.entitlementTierCode ||
            row.metadata?.entitlement_tier_code,
        );
        const entitlementTier = row.user_id ? toTierCode(entitlementsByUserId.get(row.user_id)?.tier_code) : 'unknown';
        const tierCode = entitlementTier !== 'unknown' ? entitlementTier : metadataTier;
        const tierBucket = acc.byTier[tierCode] || {
          tierCode,
          requestCount: 0,
          tokens: 0,
          estimatedCostUsd: 0,
          activeUsers: 0,
          aiQuotaMonthly: 0,
          aiQuotaUsed: 0,
        };
        tierBucket.requestCount += 1;
        tierBucket.tokens += totalTokens;
        tierBucket.estimatedCostUsd += cost;
        acc.byTier[tierCode] = tierBucket;

        return acc;
      },
      {
        requestCount: 0,
        successCount: 0,
        errorCount: 0,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        estimatedCostUsd: 0,
        latencyTotalMs: 0,
        latencyCount: 0,
        totalRows: 0,
        byProvider: {} as Record<string, { provider: string; requestCount: number; tokens: number; estimatedCostUsd: number }>,
        byModel: {} as Record<string, { provider: string; model: string; requestCount: number; tokens: number; estimatedCostUsd: number; averageLatencyMs: number; latencyCount: number }>,
        byTier: {} as Record<TierCode, {
          tierCode: TierCode;
          requestCount: number;
          tokens: number;
          estimatedCostUsd: number;
          activeUsers: number;
          aiQuotaMonthly: number;
          aiQuotaUsed: number;
        }>,
      },
    );

    const activeUsersByTier = entitlementRows.reduce((acc, row) => {
      const tierCode = toTierCode(row.tier_code);
      acc[tierCode] = (acc[tierCode] || 0) + 1;
      return acc;
    }, {} as Record<TierCode, number>);

    const quotaByTier = entitlementRows.reduce(
      (acc, row) => {
        const tierCode = toTierCode(row.tier_code);
        const quotaMonthly = toNumber(row.ai_quota_monthly);
        const quotaUsed = toNumber(row.ai_quota_used);

        acc[tierCode] = acc[tierCode] || {
          aiQuotaMonthly: 0,
          aiQuotaUsed: 0,
        };

        acc[tierCode].aiQuotaMonthly += quotaMonthly;
        acc[tierCode].aiQuotaUsed += quotaUsed;
        return acc;
      },
      {} as Record<TierCode, { aiQuotaMonthly: number; aiQuotaUsed: number }>,
    );

    const providerRows = Object.values(summary.byProvider).map((entry) => ({
      provider: entry.provider,
      requestCount: entry.requestCount,
      tokens: entry.tokens,
      estimatedCostUsd: Number(entry.estimatedCostUsd.toFixed(6)),
    }));

    const modelRows = Object.values(summary.byModel).map((entry) => ({
      provider: entry.provider,
      model: entry.model,
      requestCount: entry.requestCount,
      tokens: entry.tokens,
      estimatedCostUsd: Number(entry.estimatedCostUsd.toFixed(6)),
      averageLatencyMs: entry.latencyCount > 0 ? Math.round(entry.averageLatencyMs / entry.latencyCount) : null,
    }));

    const tierOrder: TierCode[] = ['free', 'starter', 'pro', 'master', 'unknown'];
    const tierRowsSummary = tierOrder
      .map((tierCode) => {
        const tierUsage = summary.byTier[tierCode];
        const tierEntitlements = quotaByTier[tierCode];
        const tierConfig = tiersByTierCode.get(tierCode);
        const activeUsers = activeUsersByTier[tierCode] || 0;
        const monthlyPrice = tierConfig?.price_monthly != null ? toNumber(tierConfig.price_monthly) : null;
        const estimatedMonthlyRevenueUsd = monthlyPrice != null ? activeUsers * monthlyPrice : null;
        const estimatedCostUsd = Number((tierUsage?.estimatedCostUsd || 0).toFixed(6));
        const estimatedGrossMarginUsd = estimatedMonthlyRevenueUsd != null ? Number((estimatedMonthlyRevenueUsd - estimatedCostUsd).toFixed(6)) : null;
        const marginPct = estimatedMonthlyRevenueUsd && estimatedMonthlyRevenueUsd > 0
          ? Number((((estimatedMonthlyRevenueUsd - estimatedCostUsd) / estimatedMonthlyRevenueUsd) * 100).toFixed(2))
          : null;
        const aiQuotaMonthly = tierEntitlements?.aiQuotaMonthly ?? 0;
        const aiQuotaUsed = tierEntitlements?.aiQuotaUsed ?? 0;
        const aiQuotaRemaining = Math.max(0, aiQuotaMonthly - aiQuotaUsed);
        const costPerActiveUserUsd = activeUsers > 0 ? Number((estimatedCostUsd / activeUsers).toFixed(6)) : null;

        return {
          tierCode,
          displayName: formatTierDisplayName(tierConfig, tierCode),
          activeUsers,
          requestCount: tierUsage?.requestCount || 0,
          tokens: tierUsage?.tokens || 0,
          estimatedCostUsd,
          monthlyPrice,
          estimatedMonthlyRevenueUsd,
          estimatedGrossMarginUsd,
          marginPct,
          aiQuotaMonthly,
          aiQuotaUsed,
          aiQuotaRemaining,
          costPerActiveUserUsd,
        };
      })
      .filter((row) => row.activeUsers > 0 || row.requestCount > 0 || row.tierCode !== 'unknown');

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          requestCount: summary.requestCount,
          successCount: summary.successCount,
          errorCount: summary.errorCount,
          inputTokens: summary.inputTokens,
          outputTokens: summary.outputTokens,
          totalTokens: summary.totalTokens,
          estimatedCostUsd: Number(summary.estimatedCostUsd.toFixed(6)),
          averageLatencyMs: summary.latencyCount > 0 ? Math.round(summary.latencyTotalMs / summary.latencyCount) : null,
          windowStart: since.toISOString(),
          windowEnd: new Date().toISOString(),
        },
        byProvider: providerRows,
        byModel: modelRows.sort((left, right) => right.tokens - left.tokens),
        byTier: tierRowsSummary,
        recent: rows.slice(0, 20),
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to load AI usage summary.',
        },
      },
      { status: 500 },
    );
  }
}
