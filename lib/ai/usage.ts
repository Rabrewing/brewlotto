import { createClient } from '@supabase/supabase-js';

import type { AiProviderName } from '@/lib/ai/client';

export interface AiTokenUsage {
  prompt_tokens?: number | null;
  completion_tokens?: number | null;
  total_tokens?: number | null;
}

export interface AiUsageLogInput {
  route: string;
  operation: string;
  provider: AiProviderName;
  model: string;
  status: 'success' | 'error';
  latencyMs?: number | null;
  inputTokens?: number | null;
  outputTokens?: number | null;
  totalTokens?: number | null;
  estimatedCostUsd?: number | null;
  userId?: string | null;
  userEmail?: string | null;
  errorMessage?: string | null;
  metadata?: Record<string, unknown> | null;
}

interface TokenPricing {
  inputPerMillion: number;
  outputPerMillion: number;
}

function readNumberEnv(name: string, fallback = 0) {
  const raw = process.env[name];
  if (!raw) return fallback;

  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getPricing(provider: AiProviderName, model: string): TokenPricing {
  const normalizedModel = model.trim().toLowerCase();

  if (provider === 'openai') {
    return {
      inputPerMillion: readNumberEnv(`OPENAI_RATE_${normalizedModel.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}_INPUT_PER_MILLION`, readNumberEnv('OPENAI_RATE_INPUT_PER_MILLION', 0)),
      outputPerMillion: readNumberEnv(`OPENAI_RATE_${normalizedModel.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}_OUTPUT_PER_MILLION`, readNumberEnv('OPENAI_RATE_OUTPUT_PER_MILLION', 0)),
    };
  }

  if (provider === 'deepseek') {
    return {
      inputPerMillion: readNumberEnv(`DEEPSEEK_RATE_${normalizedModel.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}_INPUT_PER_MILLION`, readNumberEnv('DEEPSEEK_RATE_INPUT_PER_MILLION', 0)),
      outputPerMillion: readNumberEnv(`DEEPSEEK_RATE_${normalizedModel.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}_OUTPUT_PER_MILLION`, readNumberEnv('DEEPSEEK_RATE_OUTPUT_PER_MILLION', 0)),
    };
  }

  return {
    inputPerMillion: readNumberEnv(`NIM_RATE_${normalizedModel.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}_INPUT_PER_MILLION`, readNumberEnv('NIM_RATE_INPUT_PER_MILLION', 0)),
    outputPerMillion: readNumberEnv(`NIM_RATE_${normalizedModel.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}_OUTPUT_PER_MILLION`, readNumberEnv('NIM_RATE_OUTPUT_PER_MILLION', 0)),
  };
}

export function estimateAiUsageCostUsd(
  provider: AiProviderName,
  model: string,
  usage: AiTokenUsage | null | undefined,
) {
  const inputTokens = usage?.prompt_tokens ?? 0;
  const outputTokens = usage?.completion_tokens ?? 0;
  const totalTokens = usage?.total_tokens ?? inputTokens + outputTokens;
  const pricing = getPricing(provider, model);

  const inputCost = (inputTokens / 1_000_000) * pricing.inputPerMillion;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPerMillion;

  return {
    inputTokens,
    outputTokens,
    totalTokens,
    rateInputPerMillion: pricing.inputPerMillion,
    rateOutputPerMillion: pricing.outputPerMillion,
    estimatedCostUsd: Number((inputCost + outputCost).toFixed(6)),
  };
}

export async function recordAiUsageEvent(input: AiUsageLogInput) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!serviceRoleKey || !supabaseUrl) {
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  await supabase.from('ai_usage_events').insert({
    route: input.route,
    operation: input.operation,
    provider: input.provider,
    model: input.model,
    status: input.status,
    latency_ms: input.latencyMs ?? null,
    input_tokens: input.inputTokens ?? null,
    output_tokens: input.outputTokens ?? null,
    total_tokens: input.totalTokens ?? null,
    estimated_cost_usd: input.estimatedCostUsd ?? null,
    user_id: input.userId ?? null,
    user_email: input.userEmail ?? null,
    error_message: input.errorMessage ?? null,
    metadata: input.metadata ?? {},
  });
}
