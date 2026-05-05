import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

import { requireBrewCommandRequest } from '@/lib/auth/brewcommand';

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

export async function GET(request: NextRequest) {
  try {
    const unauthorizedResponse = await requireBrewCommandRequest(request);
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const supabase = getSupabase();
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const { data, error } = await supabase
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
          metadata
        `,
      )
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FETCH_ERROR',
            message: error.message,
          },
        },
        { status: 500 },
      );
    }

    const rows = (data || []) as AiUsageRow[];

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
        byProvider: {} as Record<string, { provider: string; requestCount: number; tokens: number; estimatedCostUsd: number }>,
        byModel: {} as Record<string, { provider: string; model: string; requestCount: number; tokens: number; estimatedCostUsd: number; averageLatencyMs: number; latencyCount: number }>,
      },
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
