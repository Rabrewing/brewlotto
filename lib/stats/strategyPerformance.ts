type PredictionLike = {
  id: string;
  source_strategy_key?: string | null;
  confidence_score?: number | null;
  is_saved?: boolean | null;
  created_at?: string | null;
};

type PlayLogLike = {
  prediction_id?: string | null;
  outcome_result_code?: string | null;
  outcome_match_count?: number | null;
  is_settled?: boolean | null;
  created_at?: string | null;
  metadata?: unknown;
};

export type StrategyPerformanceSummary = {
  strategy: string;
  predictions: number;
  savedCount: number;
  averageConfidence: number | null;
  confirmedPlays: number;
  wins: number;
  hitRate: number | null;
  winRate: number | null;
  lastActivityAt: string | null;
};

function isWinResultCode(resultCode: string | null | undefined) {
  if (!resultCode) {
    return false;
  }

  return !resultCode.endsWith('_no_match');
}

function extractMetadataStrategy(metadata: unknown) {
  if (!metadata || typeof metadata !== 'object') {
    return null;
  }

  const value = metadata as Record<string, unknown>;
  const raw = value.strategy ?? value.source_strategy_key ?? value.strategy_key ?? null;

  return typeof raw === 'string' && raw.trim() ? raw.trim() : null;
}

export function buildStrategyPerformanceSummary(
  predictions: PredictionLike[],
  playLogs: PlayLogLike[],
): StrategyPerformanceSummary[] {
  const summary = new Map<
    string,
    {
      predictions: number;
      savedCount: number;
      confidenceTotal: number;
      confidenceCount: number;
      confirmedPlays: number;
      wins: number;
      hitCount: number;
      lastActivityAt: string | null;
    }
  >();

  const strategyByPredictionId = new Map<string, string>();

  for (const prediction of predictions) {
    const strategy = prediction.source_strategy_key || 'brew strategy';
    strategyByPredictionId.set(prediction.id, strategy);

    const existing = summary.get(strategy) || {
      predictions: 0,
      savedCount: 0,
      confidenceTotal: 0,
      confidenceCount: 0,
      confirmedPlays: 0,
      wins: 0,
      hitCount: 0,
      lastActivityAt: null,
    };

    existing.predictions += 1;
    existing.savedCount += prediction.is_saved ? 1 : 0;

    if (prediction.confidence_score != null && Number.isFinite(Number(prediction.confidence_score))) {
      existing.confidenceTotal += Number(prediction.confidence_score);
      existing.confidenceCount += 1;
    }

    existing.lastActivityAt = existing.lastActivityAt || prediction.created_at || null;
    summary.set(strategy, existing);
  }

  for (const playLog of playLogs) {
    if (!playLog.is_settled) {
      continue;
    }

    const metadataStrategy = extractMetadataStrategy(playLog.metadata);
    const strategy = metadataStrategy || (playLog.prediction_id ? strategyByPredictionId.get(playLog.prediction_id) : null);

    if (!strategy) {
      continue;
    }

    const existing = summary.get(strategy) || {
      predictions: 0,
      savedCount: 0,
      confidenceTotal: 0,
      confidenceCount: 0,
      confirmedPlays: 0,
      wins: 0,
      hitCount: 0,
      lastActivityAt: null,
    };

    existing.confirmedPlays += 1;

    if ((playLog.outcome_match_count || 0) > 0) {
      existing.hitCount += 1;
    }

    if (isWinResultCode(playLog.outcome_result_code)) {
      existing.wins += 1;
    }

    const playCreatedAt = playLog.created_at || null;
    if (playCreatedAt) {
      existing.lastActivityAt = existing.lastActivityAt || playCreatedAt;
    }

    summary.set(strategy, existing);
  }

  return [...summary.entries()]
    .map(([strategy, entry]) => {
      const averageConfidence =
        entry.confidenceCount > 0 ? Math.round(entry.confidenceTotal / entry.confidenceCount) : null;
      const hitRate = entry.confirmedPlays > 0 ? Math.round((entry.hitCount / entry.confirmedPlays) * 100) : null;
      const winRate = entry.confirmedPlays > 0 ? Math.round((entry.wins / entry.confirmedPlays) * 100) : null;

      return {
        strategy,
        predictions: entry.predictions,
        savedCount: entry.savedCount,
        averageConfidence,
        confirmedPlays: entry.confirmedPlays,
        wins: entry.wins,
        hitRate,
        winRate,
        lastActivityAt: entry.lastActivityAt,
      };
    })
    .sort((a, b) => b.confirmedPlays - a.confirmedPlays || b.predictions - a.predictions || a.strategy.localeCompare(b.strategy));
}
