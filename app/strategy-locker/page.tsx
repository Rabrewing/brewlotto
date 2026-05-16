'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  DashboardContainer,
  Header,
  NavigationTabs,
  SectionCard,
  GameTabs,
  type GameId,
} from '@/components/brewlotto/dashboard';
import { supabase } from '@/lib/supabase/browserClient';
import { buildStrategyPerformanceSummary, type StrategyPerformanceSummary } from '@/lib/stats/strategyPerformance';
import { getStrategyLabel } from '@/utils/strategyLabel';
import { normalizePreferredStateCode, usePreferredState } from '@/hooks/usePreferredState';
import { useUserTier } from '@/hooks/useUserTier';
import { resolveDashboardGameConfig } from '@/lib/dashboard/game-config';
import { resolveTimingAccessLabel, resolveTimingAccessMode } from '@/utils/timepulse';

type TierCode = 'free' | 'starter' | 'pro' | 'master';

interface AuthUser {
  id: string;
  email?: string;
}

interface StrategyRecord {
  id: string;
  strategy_key: string;
  public_name: string;
  description?: string | null;
  category: string;
  min_tier: TierCode;
  sort_order: number;
  metadata?: {
    ui_group?: string;
  } | null;
}

interface SavedStrategyRecord {
  strategy_id: string;
  is_favorite: boolean;
  nickname?: string | null;
  updated_at?: string | null;
}

interface StrategyActivityRecord {
  strategy_id: string;
  game?: string | null;
  state?: string | null;
  context: string;
  occurred_at: string;
}

interface PredictionRecord {
  id: string;
  source_strategy_key?: string | null;
  confidence_score?: number | null;
  created_at: string;
}

interface PlayLogRecord {
  id: string;
  prediction_id?: string | null;
  outcome_result_code?: string | null;
  outcome_match_count?: number | null;
  is_settled?: boolean | null;
  created_at: string;
  metadata?: unknown;
}

interface RunPreviewRecord {
  engineKey: string;
  gameKey: string;
  homeState: string;
  primaryNumbers: number[];
  bonusNumbers: number[];
  publicName: string;
  strategyKey: string;
  drawWindow: string | null;
  predictionId: string | null;
  predictionSaved: boolean;
  timingProfile?: {
    p25: number;
    p75: number;
    median: number;
    spread: number;
    sampleSize: number;
    windowStart: string;
    windowEnd: string;
    confidence: string;
    recommendedStyle: string | null;
    styleDistribution: Record<string, number> | null;
  } | null;
  strategyComparisons?: Record<string, {
    median: number;
    p25: number;
    p75: number;
    sampleSize: number;
    windowStart: string;
    windowEnd: string;
  }> | null;
  timingTierLabel?: string | null;
  createdAt: string;
}

interface UserEntitlementRecord {
  tier_code?: TierCode | null;
  advanced_strategy_access?: boolean | null;
  premium_explanations_access?: boolean | null;
  premium_comparison_access?: boolean | null;
  voice_commentary_access?: boolean | null;
  timing_analysis_access?: boolean | null;
}

interface SubscriptionTierRecord {
  tier_key: TierCode;
  display_name: string;
  price_monthly?: number | null;
  sort_order: number;
}

type QueryResult<T> = {
  data: T | null;
  error: { message: string } | null;
};

const TIER_ORDER: Record<TierCode, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  master: 3,
};

function formatTierLabel(tier: TierCode) {
  switch (tier) {
    case 'free':
      return 'Free Explorer';
    case 'starter':
      return 'BrewStarter';
    case 'pro':
      return 'BrewPro';
    case 'master':
      return 'BrewMaster';
  }
}

function formatCategoryLabel(category: string) {
  switch (category) {
    case 'core':
      return 'Core';
    case 'advanced':
      return 'Advanced';
    case 'utility':
      return 'Utility';
    case 'experimental':
      return 'Experimental';
    case 'ai':
      return 'AI';
    default:
      return category;
  }
}

export default function StrategyLockerPage() {
  const { currentTier: userTier } = useUserTier();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showFullLadder, setShowFullLadder] = useState(false);
  const [strategies, setStrategies] = useState<StrategyRecord[]>([]);
  const [savedStrategies, setSavedStrategies] = useState<SavedStrategyRecord[]>([]);
  const [strategyActivity, setStrategyActivity] = useState<StrategyActivityRecord[]>([]);
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [playLogs, setPlayLogs] = useState<PlayLogRecord[]>([]);
  const [entitlements, setEntitlements] = useState<UserEntitlementRecord | null>(null);
  const [subscriptionTiers, setSubscriptionTiers] = useState<SubscriptionTierRecord[]>([]);
  const [savingStrategyId, setSavingStrategyId] = useState<string | null>(null);
  const [runningStrategyId, setRunningStrategyId] = useState<string | null>(null);
  const [runPreviews, setRunPreviews] = useState<Record<string, RunPreviewRecord>>({});
  const [savingPredictionId, setSavingPredictionId] = useState<string | null>(null);
  const { preferredState } = usePreferredState();
  const preferredStateCode = normalizePreferredStateCode(preferredState);
  const [selectedGame, setSelectedGame] = useState<GameId>('pick3');
  const [selectedDrawWindow, setSelectedDrawWindow] = useState<'midday' | 'evening'>('midday');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gameParam = params.get('game') as GameId | null;
    const stateParam = params.get('state');
    if (gameParam && ['pick3', 'pick4', 'cash5', 'powerball', 'mega'].includes(gameParam)) {
      setSelectedGame(gameParam);
    }
  }, []);

  useEffect(() => {
    setRunPreviews({});
  }, [selectedGame]);

  const gameConfig = resolveDashboardGameConfig(selectedGame, preferredStateCode) || resolveDashboardGameConfig('pick3', 'NC')!;
  const hasDrawWindow = selectedGame === 'pick3' || selectedGame === 'pick4';

  useEffect(() => {
    if (hasDrawWindow) {
      setRunPreviews({});
    }
  }, [hasDrawWindow, selectedDrawWindow]);

  useEffect(() => {
    let cancelled = false;

    async function loadLocker() {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user: authUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!authUser) {
          if (!cancelled) {
            setError('You need to sign in before Brew can show your strategy access.');
          }
          return;
        }

        const [strategiesResult, savedResult] = (await Promise.all([
          supabase
            .from('strategy_registry')
            .select('id, strategy_key, public_name, description, category, min_tier, sort_order, metadata')
            .eq('is_active', true)
            .order('sort_order', { ascending: true }),
          supabase
            .from('user_saved_strategies')
            .select('strategy_id, is_favorite, nickname, updated_at')
            .eq('user_id', authUser.id),
        ])) as [QueryResult<StrategyRecord[]>, QueryResult<SavedStrategyRecord[]>];

        if (strategiesResult.error) {
          throw strategiesResult.error;
        }
        if (savedResult.error) {
          throw savedResult.error;
        }

        const activityQuery = supabase
            .from('user_strategy_activity')
            .select('strategy_id, game, state, context, occurred_at')
            .eq('user_id', authUser.id)
            .order('occurred_at', { ascending: false })
            .limit(60) as unknown as Promise<QueryResult<StrategyActivityRecord[]>>;
        const predictionsQuery = supabase
            .from('predictions')
            .select('id, source_strategy_key, confidence_score, created_at')
            .eq('user_id', authUser.id)
            .order('created_at', { ascending: false })
            .limit(120) as unknown as Promise<QueryResult<PredictionRecord[]>>;
        const playLogsQuery = supabase
            .from('play_logs')
            .select('id, prediction_id, outcome_result_code, outcome_match_count, is_settled, created_at, metadata')
            .eq('user_id', authUser.id)
            .order('created_at', { ascending: false })
            .limit(120) as unknown as Promise<QueryResult<PlayLogRecord[]>>;
        const entitlementsQuery = supabase
            .from('user_entitlements')
            .select('tier_code, advanced_strategy_access, premium_explanations_access, premium_comparison_access, voice_commentary_access, timing_analysis_access')
            .eq('user_id', authUser.id)
            .maybeSingle() as unknown as Promise<QueryResult<UserEntitlementRecord | null>>;
        const tiersQuery = supabase
            .from('subscription_tiers')
            .select('tier_key, display_name, price_monthly, sort_order')
            .eq('is_active', true)
            .order('sort_order', { ascending: true }) as unknown as Promise<QueryResult<SubscriptionTierRecord[]>>;
        const [activityResult, predictionsResult, playLogsResult, entitlementsResult, tiersResult] = await Promise.allSettled([
          activityQuery,
          predictionsQuery,
          playLogsQuery,
          entitlementsQuery,
          tiersQuery,
        ]);

        const settledResults = [
          ['activity', activityResult],
          ['predictions', predictionsResult],
          ['playLogs', playLogsResult],
          ['entitlements', entitlementsResult],
          ['tiers', tiersResult],
        ] as const;

        const optionalErrors = settledResults
          .map(([label, result]) => {
            if (result.status === 'fulfilled') {
              const payload = result.value as { error?: { message?: string }; data?: unknown };
              return payload.error ? `${label}: ${payload.error.message || 'unknown error'}` : null;
            }

            const reason = result.reason as { message?: string } | Error | null;
            return `${label}: ${(reason && 'message' in reason && reason.message) || 'unknown error'}`;
          })
          .filter(Boolean);

        if (!cancelled) {
          const typedStrategiesResult = strategiesResult as QueryResult<StrategyRecord[]>;
          const typedSavedResult = savedResult as QueryResult<SavedStrategyRecord[]>;
          const typedActivityResult = activityResult as PromiseFulfilledResult<QueryResult<StrategyActivityRecord[]>>;
          const typedPredictionsResult = predictionsResult as PromiseFulfilledResult<QueryResult<PredictionRecord[]>>;
          const typedPlayLogsResult = playLogsResult as PromiseFulfilledResult<QueryResult<PlayLogRecord[]>>;
          const typedEntitlementsResult = entitlementsResult as PromiseFulfilledResult<QueryResult<UserEntitlementRecord | null>>;
          const typedTiersResult = tiersResult as PromiseFulfilledResult<QueryResult<SubscriptionTierRecord[]>>;

          setUser({ id: authUser.id, email: authUser.email });
          setStrategies((typedStrategiesResult.data || []) as StrategyRecord[]);
          setSavedStrategies((typedSavedResult.data || []) as SavedStrategyRecord[]);
          setStrategyActivity(
            (typedActivityResult.status === 'fulfilled' ? (typedActivityResult.value.data || []) : []) as StrategyActivityRecord[],
          );
          setPredictions(
            (typedPredictionsResult.status === 'fulfilled' ? (typedPredictionsResult.value.data || []) : []) as PredictionRecord[],
          );
          setPlayLogs(
            (typedPlayLogsResult.status === 'fulfilled' ? (typedPlayLogsResult.value.data || []) : []) as PlayLogRecord[],
          );
          setEntitlements(
            (typedEntitlementsResult.status === 'fulfilled'
              ? ((typedEntitlementsResult.value.data as UserEntitlementRecord | null) || null)
              : null),
          );
          setSubscriptionTiers(
            (typedTiersResult.status === 'fulfilled' ? (typedTiersResult.value.data || []) : []) as SubscriptionTierRecord[],
          );
          if (optionalErrors.length > 0) {
            console.warn('Strategy Locker loaded with partial data:', optionalErrors);
          }
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load strategy locker');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadLocker();

    return () => {
      cancelled = true;
    };
  }, []);

  const currentTier = useMemo<TierCode>(() => {
    const tier = (userTier || entitlements?.tier_code || 'free') as TierCode;
    return tier;
  }, [entitlements?.tier_code, userTier]);
  const hasTimePulseAccess = currentTier === 'pro' || currentTier === 'master';
  const hasTimePulseIIAccess = currentTier === 'master' || Boolean(entitlements?.timing_analysis_access);
  const timingAccessLabel = resolveTimingAccessLabel({
    tierCode: currentTier,
    timepulseAccess: hasTimePulseAccess,
    timingAnalysisAccess: hasTimePulseIIAccess,
  });
  const timingAccessMode = resolveTimingAccessMode({
    tierCode: currentTier,
    timepulseAccess: hasTimePulseAccess,
    timingAnalysisAccess: hasTimePulseIIAccess,
  });

  const currentTierIndex = TIER_ORDER[currentTier];

  const currentTierRow = useMemo(() => {
    return subscriptionTiers.find((tier) => tier.tier_key === currentTier) || null;
  }, [currentTier, subscriptionTiers]);

  const nextTierRow = useMemo(() => {
    return (
      subscriptionTiers.find((tier) => TIER_ORDER[tier.tier_key] === currentTierIndex + 1) ||
      subscriptionTiers.find((tier) => TIER_ORDER[tier.tier_key] > currentTierIndex) ||
      null
    );
  }, [currentTierIndex, subscriptionTiers]);

  const remainingUpgradeTiers = useMemo(() => {
    return subscriptionTiers.filter((tier) => TIER_ORDER[tier.tier_key] > currentTierIndex);
  }, [currentTierIndex, subscriptionTiers]);

  const savedMap = useMemo(() => {
    return new Map(savedStrategies.map((entry) => [entry.strategy_id, entry]));
  }, [savedStrategies]);

  const activityMap = useMemo(() => {
    const grouped = new Map<string, StrategyActivityRecord[]>();

    for (const entry of strategyActivity) {
      const current = grouped.get(entry.strategy_id) || [];
      current.push(entry);
      grouped.set(entry.strategy_id, current);
    }

    return grouped;
  }, [strategyActivity]);

  const predictionSummary = useMemo(() => {
    const grouped = new Map<string, { uses: number; confidenceTotal: number; confidenceCount: number; lastUsedAt: string | null }>();

    for (const entry of predictions) {
      const key = entry.source_strategy_key || 'brew strategy';
      const current = grouped.get(key) || {
        uses: 0,
        confidenceTotal: 0,
        confidenceCount: 0,
        lastUsedAt: null,
      };

      current.uses += 1;
      if (entry.confidence_score != null && Number.isFinite(Number(entry.confidence_score))) {
        current.confidenceTotal += Number(entry.confidence_score);
        current.confidenceCount += 1;
      }
      current.lastUsedAt = current.lastUsedAt || entry.created_at;
      grouped.set(key, current);
    }

    return grouped;
  }, [predictions]);

  const strategyPerformance = useMemo<StrategyPerformanceSummary[]>(() => {
    return buildStrategyPerformanceSummary(predictions, playLogs);
  }, [playLogs, predictions]);

  const strategyPerformanceMap = useMemo(() => {
    return new Map(strategyPerformance.map((entry) => [entry.strategy, entry]));
  }, [strategyPerformance]);

  const unlockedCount = useMemo(() => {
    return strategies.filter((entry) => TIER_ORDER[currentTier] >= TIER_ORDER[entry.min_tier]).length;
  }, [currentTier, strategies]);

  const favoriteCount = savedStrategies.filter((entry) => entry.is_favorite).length;

  async function handleToggleSaved(strategy: StrategyRecord) {
    if (!user) {
      return;
    }

    const existing = savedMap.get(strategy.id);
    setSavingStrategyId(strategy.id);

    try {
      const response = await fetch('/api/strategy-locker/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          strategyId: strategy.id,
          action: existing ? 'remove' : 'save',
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.success) {
        const message = payload?.error?.message || 'Failed to update saved strategy';
        throw new Error(message);
      }

      if (payload.data?.action === 'remove') {
        setSavedStrategies((current) => current.filter((entry) => entry.strategy_id !== strategy.id));
      } else if (payload.data?.action === 'save') {
        setSavedStrategies((current) => {
          const nextEntry: SavedStrategyRecord = {
            strategy_id: payload.data.strategyId,
            is_favorite: Boolean(payload.data.isFavorite),
            nickname: existing?.nickname || null,
            updated_at: new Date().toISOString(),
          };

          const filtered = current.filter((entry) => entry.strategy_id !== strategy.id);
          return [nextEntry, ...filtered];
        });
      }

      setError(null);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to update saved strategy');
    } finally {
      setSavingStrategyId(null);
    }
  }

  async function handleRunStrategy(strategy: StrategyRecord) {
    if (!user) {
      return;
    }

    if (TIER_ORDER[currentTier] < TIER_ORDER[strategy.min_tier]) {
      setError(`This strategy requires ${formatTierLabel(strategy.min_tier)} access.`);
      return;
    }

    setRunningStrategyId(strategy.id);

    try {
      const response = await fetch('/api/strategy-locker/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategyId: strategy.id,
          gameKey: selectedGame,
          state: preferredStateCode,
          drawWindow: hasDrawWindow ? selectedDrawWindow : null,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.success) {
        const message = payload?.error?.message || 'Failed to run strategy';
        throw new Error(message);
      }

      setRunPreviews((current) => ({
        ...current,
        [strategy.id]: {
          engineKey: payload.data.engineKey,
          gameKey: payload.data.gameKey,
          homeState: payload.data.homeState,
          primaryNumbers: Array.isArray(payload.data.primaryNumbers) ? payload.data.primaryNumbers : [],
          bonusNumbers: Array.isArray(payload.data.bonusNumbers) ? payload.data.bonusNumbers : [],
          publicName: payload.data.publicName,
          strategyKey: payload.data.strategyKey,
          drawWindow: payload.data.drawWindow || null,
          predictionId: payload.data.prediction?.id || null,
          predictionSaved: false,
          timingProfile: payload.data.timingProfile || null,
          strategyComparisons: payload.data.strategyComparisons || null,
          timingTierLabel: payload.data.timingTierLabel || null,
          createdAt: new Date().toISOString(),
        },
      }));
      setError(null);
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : 'Failed to run strategy');
    } finally {
      setRunningStrategyId(null);
    }
  }

  async function handleSavePrediction(strategyId: string) {
    const preview = runPreviews[strategyId];
    if (!preview?.predictionId || preview.predictionSaved) return;

    setSavingPredictionId(strategyId);
    try {
      const response = await fetch(`/api/predictions/${preview.predictionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_saved: true }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) throw new Error('Failed to save pick');

      setRunPreviews((current) => ({
        ...current,
        [strategyId]: { ...current[strategyId], predictionSaved: true },
      }));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save pick');
    } finally {
      setSavingPredictionId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DashboardContainer>
        <Header />
        <NavigationTabs />

        <div className="mb-5 mt-2 text-[40px] font-medium tracking-[-0.03em] text-[#f8cf98]">
          Strategy Locker
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/55">
            Loading your strategy access...
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-[#ff8d7b]/25 bg-[#2a120d]/60 px-5 py-8 text-center text-[#ffc4b8]">
            {error}
          </div>
        ) : !user ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/55">
            No active account data is available right now.
          </div>
        ) : (
          <div className="space-y-5">
            <section className="rounded-[30px] border border-[#ffc742]/24 bg-[radial-gradient(circle_at_top_left,rgba(255,199,66,0.18),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(30,20,13,0.88),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(255,184,28,0.08)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="text-[15px] uppercase tracking-[0.16em] text-white/38">Current access</div>
                  <div className="mt-3 text-[26px] font-semibold text-[#f7ddb3]">{formatTierLabel(currentTier)}</div>
                  <div className="mt-2 max-w-2xl text-[15px] leading-7 text-white/62">
                    Strategy Locker shows your current plan, what is unlocked now, and what is still next in line. Expand the ladder only when you want the full tree.
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-[12px] uppercase tracking-[0.14em] text-white/42">
                  <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">Unlocked {unlockedCount}</span>
                  <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">Favorites {favoriteCount}</span>
                  <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">Activity {strategyActivity.length}</span>
                </div>
              </div>
            </section>

            <div className="text-[12px] uppercase tracking-[0.16em] text-white/38">Choose your game to strategize in</div>
            <GameTabs selectedGame={selectedGame} onSelect={setSelectedGame} stateCode={preferredStateCode} />

            {hasDrawWindow ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDrawWindow('midday')}
                  className={`rounded-full px-4 py-1.5 text-[13px] font-medium uppercase tracking-[0.06em] transition-all ${
                    selectedDrawWindow === 'midday'
                      ? 'bg-[#ffbd39]/15 text-[#ffbd39] shadow-[0_0_10px_rgba(255,184,28,0.08)]'
                      : 'bg-white/[0.04] text-white/45 hover:bg-white/[0.08] hover:text-white/70'
                  }`}
                >
                  Midday
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDrawWindow('evening')}
                  className={`rounded-full px-4 py-1.5 text-[13px] font-medium uppercase tracking-[0.06em] transition-all ${
                    selectedDrawWindow === 'evening'
                      ? 'bg-[#ffbd39]/15 text-[#ffbd39] shadow-[0_0_10px_rgba(255,184,28,0.08)]'
                      : 'bg-white/[0.04] text-white/45 hover:bg-white/[0.08] hover:text-white/70'
                  }`}
                >
                  Evening
                </button>
              </div>
            ) : null}

            <div className="space-y-5">
              <SectionCard
                title="Entitlement Snapshot"
                description="A compact ladder shows what you have now and what still sits above it."
              >
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">Current plan</div>
                    <div className="mt-3 text-[18px] font-medium text-[#f7ddb3]">{currentTierRow?.display_name || formatTierLabel(currentTier)}</div>
                    <div className="mt-2 text-[13px] text-white/54">
                      {currentTierRow?.price_monthly != null ? `$${Number(currentTierRow.price_monthly).toFixed(2)}/mo` : 'Current tier loaded from entitlements'}
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">Unlocked now</div>
                    <div className="mt-3 text-[18px] font-medium text-[#f7ddb3]">{unlockedCount} strategies</div>
                    <div className="mt-2 text-[13px] text-white/54">
                      {entitlements?.advanced_strategy_access || entitlements?.premium_explanations_access || entitlements?.premium_comparison_access || entitlements?.voice_commentary_access
                        ? 'Your tier opens the related access rows below.'
                        : 'Starter view stays compact until you upgrade.'}
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">Next unlock</div>
                    <div className="mt-3 text-[18px] font-medium text-[#f7ddb3]">{nextTierRow?.display_name || 'No higher tier'}</div>
                    <div className="mt-2 text-[13px] text-white/54">
                      {nextTierRow?.price_monthly != null
                        ? `$${Number(nextTierRow.price_monthly).toFixed(2)}/mo keeps the ladder moving.`
                        : 'You are already at the top of the current ladder.'}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowFullLadder((current) => !current)}
                    className="rounded-full border border-[#ffc742]/25 bg-[#ffc742]/10 px-4 py-2 text-[14px] font-medium text-[#ffd27e] transition-colors hover:bg-[#ffc742]/16 hover:text-white"
                  >
                    {showFullLadder ? 'Hide full ladder' : 'View full ladder'}
                  </button>
                  <div className="text-[12px] uppercase tracking-[0.14em] text-white/38">
                    {remainingUpgradeTiers.length > 0 ? `${remainingUpgradeTiers.length} tier${remainingUpgradeTiers.length === 1 ? '' : 's'} above current plan` : 'No higher tiers left'}
                  </div>
                </div>

                {showFullLadder ? (
                  <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4">
                      <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">Feature rows</div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
                          <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">Advanced strategies</div>
                          <div className="mt-2 text-[16px] font-medium text-[#f7ddb3]">{entitlements?.advanced_strategy_access ? 'Enabled' : 'Locked'}</div>
                        </div>
                        <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
                          <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">Premium explanations</div>
                          <div className="mt-2 text-[16px] font-medium text-[#f7ddb3]">{entitlements?.premium_explanations_access ? 'Enabled' : 'Locked'}</div>
                        </div>
                        <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
                          <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">Comparisons</div>
                          <div className="mt-2 text-[16px] font-medium text-[#f7ddb3]">{entitlements?.premium_comparison_access ? 'Enabled' : 'Locked'}</div>
                        </div>
                        <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
                          <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">Voice commentary</div>
                          <div className="mt-2 text-[16px] font-medium text-[#f7ddb3]">{entitlements?.voice_commentary_access ? 'Enabled' : 'Locked'}</div>
                        </div>
                        <div className="rounded-[18px] border border-[#72caff]/18 bg-[#111f28] px-4 py-3">
                          <div className="text-[12px] uppercase tracking-[0.16em] text-[#9edcff]">TimePulse</div>
                          <div className="mt-2 text-[16px] font-medium text-[#d7ecff]">{hasTimePulseAccess ? 'Enabled' : 'Locked'}</div>
                          <div className="mt-1 text-[12px] text-white/40">BrewPro timing window and lag profile</div>
                        </div>
                        <div className="rounded-[18px] border border-[#ffbd39]/18 bg-[#1a140c] px-4 py-3">
                          <div className="text-[12px] uppercase tracking-[0.16em] text-[#f5cf84]">TimePulse II</div>
                          <div className="mt-2 text-[16px] font-medium text-[#f7ddb3]">{hasTimePulseIIAccess ? 'Enabled' : 'Locked'}</div>
                          <div className="mt-1 text-[12px] text-white/40">BrewMaster adaptive timing and regime shifts</div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4">
                      <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">Plan ladder</div>
                      <div className="mt-3 space-y-3">
                        {subscriptionTiers.map((tier) => {
                          const active = tier.tier_key === currentTier;

                          return (
                            <div
                              key={tier.tier_key}
                              className={`rounded-[18px] border px-4 py-4 ${
                                active ? 'border-[#ffc742]/30 bg-[#ffc742]/10' : 'border-white/8 bg-white/[0.03]'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">{tier.tier_key}</div>
                                  <div className="mt-2 text-[18px] font-medium text-[#f7ddb3]">{tier.display_name}</div>
                                </div>
                                <div className="text-right text-[13px] text-white/56">
                                  {tier.price_monthly != null ? `$${Number(tier.price_monthly).toFixed(2)}/mo` : 'Contact tier'}
                                  <div className="mt-2 text-[11px] uppercase tracking-[0.14em] text-white/40">
                                    {active ? 'Current plan' : 'Upgrade target'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : null}
              </SectionCard>

            </div>

            <SectionCard
              title="Strategy Cards"
              description="Available and locked strategies are both shown here using live registry entries."
            >
              <div className="grid gap-4 lg:grid-cols-2">
                {strategies.map((strategy) => {
                  const hasAccess = TIER_ORDER[currentTier] >= TIER_ORDER[strategy.min_tier];
                  const saved = savedMap.get(strategy.id);
                  const activity = activityMap.get(strategy.id) || [];
                  const predictionData = predictionSummary.get(strategy.strategy_key);
                  const performanceData = strategyPerformanceMap.get(getStrategyLabel(strategy.strategy_key));
                  const lastUsedAt = activity[0]?.occurred_at || predictionData?.lastUsedAt || null;
                  const averageConfidence =
                    predictionData && predictionData.confidenceCount > 0
                      ? Math.round(predictionData.confidenceTotal / predictionData.confidenceCount)
                      : null;

                  return (
                    <article
                      key={strategy.id}
                      className={`rounded-[26px] border px-5 py-5 shadow-[0_0_20px_rgba(255,184,28,0.05)] ${
                        hasAccess
                          ? 'border-[#ffbd39]/18 bg-[linear-gradient(145deg,rgba(28,18,14,0.78),rgba(10,9,9,0.96))]'
                          : 'border-white/8 bg-[linear-gradient(145deg,rgba(18,18,18,0.86),rgba(8,8,8,0.98))]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <div className={`text-[19px] font-medium ${hasAccess ? 'text-[#f7ddb3]' : 'text-white/72'}`}>
                              {getStrategyLabel(strategy.strategy_key)}
                            </div>
                            <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-white/38">
                              {formatCategoryLabel(strategy.category)}
                            </span>
                            {hasAccess && timingAccessLabel ? (
                              <span className="rounded-full border border-[#ffbd39]/14 bg-[#1a140c] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#f5cf84]">
                                {timingAccessLabel}
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-3 text-[14px] leading-7 text-white/58">
                            {strategy.description || 'No strategy description stored yet.'}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
                          <div className="text-[11px] uppercase tracking-[0.14em] text-white/35">Saved</div>
                          <div className="mt-2 text-[16px] font-medium text-[#f7ddb3]">{saved ? 'Yes' : 'No'}</div>
                        </div>
                        <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
                          <div className="text-[11px] uppercase tracking-[0.14em] text-white/35">Uses</div>
                          <div className="mt-2 text-[16px] font-medium text-[#f7ddb3]">
                            {performanceData?.predictions || predictionData?.uses || 0}
                          </div>
                        </div>
                        <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
                          <div className="text-[11px] uppercase tracking-[0.14em] text-white/35">Confirms</div>
                          <div className="mt-2 text-[16px] font-medium text-[#f7ddb3]">{performanceData?.confirmedPlays || 0}</div>
                        </div>
                        <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
                          <div className="text-[11px] uppercase tracking-[0.14em] text-white/35">Hit rate</div>
                          <div className="mt-2 text-[16px] font-medium text-[#f7ddb3]">
                            {performanceData?.hitRate !== null && performanceData?.hitRate !== undefined ? `${performanceData.hitRate}%` : 'N/A'}
                          </div>
                        </div>
                        <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
                          <div className="text-[11px] uppercase tracking-[0.14em] text-white/35">Win rate</div>
                          <div className="mt-2 text-[16px] font-medium text-[#f7ddb3]">
                            {performanceData?.winRate !== null && performanceData?.winRate !== undefined ? `${performanceData.winRate}%` : 'N/A'}
                          </div>
                        </div>
                        <div className="rounded-[18px] border border-[#72caff]/18 bg-[#111f28] px-4 py-3">
                          <div className="text-[11px] uppercase tracking-[0.14em] text-[#9edcff]">Fireball plays</div>
                          <div className="mt-2 text-[16px] font-medium text-[#d7ecff]">{performanceData?.fireballConfirmedPlays || 0}</div>
                        </div>
                        <div className="rounded-[18px] border border-[#72caff]/18 bg-[#111f28] px-4 py-3">
                          <div className="text-[11px] uppercase tracking-[0.14em] text-[#9edcff]">Fireball hit rate</div>
                          <div className="mt-2 text-[16px] font-medium text-[#d7ecff]">
                            {performanceData?.fireballHitRate !== null && performanceData?.fireballHitRate !== undefined ? `${performanceData.fireballHitRate}%` : 'N/A'}
                          </div>
                        </div>
                        <div className="rounded-[18px] border border-[#72caff]/18 bg-[#111f28] px-4 py-3">
                          <div className="text-[11px] uppercase tracking-[0.14em] text-[#9edcff]">Fireball win rate</div>
                          <div className="mt-2 text-[16px] font-medium text-[#d7ecff]">
                            {performanceData?.fireballWinRate !== null && performanceData?.fireballWinRate !== undefined ? `${performanceData.fireballWinRate}%` : 'N/A'}
                          </div>
                        </div>
                        <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
                          <div className="text-[11px] uppercase tracking-[0.14em] text-white/35">Avg confidence</div>
                          <div className="mt-2 text-[16px] font-medium text-[#f7ddb3]">
                            {averageConfidence !== null ? `${averageConfidence}%` : 'N/A'}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-white/8 pt-4 text-[14px] text-white/62">
                        {lastUsedAt
                          ? `Last seen in your account activity on ${new Date(lastUsedAt).toLocaleDateString()}.`
                          : 'No account-linked activity has been recorded for this strategy yet.'}
                      </div>

                      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] ${hasAccess ? 'border border-[#72caff]/18 bg-[#72caff]/10 text-[#9fdcff]' : 'border border-[#ff8d7b]/18 bg-[#ff8d7b]/10 text-[#ffc4b8]'}`}>
                          {hasAccess ? 'Unlocked' : `Requires ${formatTierLabel(strategy.min_tier)}`}
                        </div>
                        <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          disabled={!hasAccess || savingStrategyId === strategy.id}
                          onClick={() => handleToggleSaved(strategy)}
                          className="rounded-full border border-[#ffc742]/28 bg-[#ffc742]/10 px-4 py-2 text-[14px] font-medium text-[#ffd27e] transition-colors hover:bg-[#ffc742]/16 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                          >
                          {savingStrategyId === strategy.id ? 'Saving...' : saved ? 'Remove Favorite' : 'Save to Locker'}
                        </button>
                        <button
                          type="button"
                          disabled={!hasAccess || runningStrategyId === strategy.id}
                          onClick={() => handleRunStrategy(strategy)}
                          className="rounded-full border border-[#72caff]/22 bg-[#72caff]/10 px-4 py-2 text-[14px] font-medium text-[#9fdcff] transition-colors hover:bg-[#72caff]/16 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          {runningStrategyId === strategy.id ? 'Running...' : 'Run Strategy'}
                        </button>
                        {!hasAccess ? (
                          <Link
                            href="/pricing"
                            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[14px] font-medium text-white/72 transition-colors hover:text-white"
                          >
                            View Upgrade Path
                          </Link>
                        ) : null}
                        </div>
                      </div>

                      {runPreviews[strategy.id] ? (
                        <div className="mt-4 rounded-[22px] border border-[#72caff]/16 bg-[#72caff]/8 px-4 py-4">
                          <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">Run preview</div>
                          <div className="mt-3 text-[14px] text-white/72">
                            {getStrategyLabel(runPreviews[strategy.id].engineKey)} ran on {runPreviews[strategy.id].homeState} {runPreviews[strategy.id].gameKey.toUpperCase()}.
                          </div>
                          <div className="mt-3 text-[20px] font-medium text-[#f7ddb3]">
                            {runPreviews[strategy.id].primaryNumbers.join(' ')}
                            {runPreviews[strategy.id].bonusNumbers.length > 0 ? ` + ${runPreviews[strategy.id].bonusNumbers.join(' ')}` : ''}
                          </div>
                          <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/35">
                            Pattern outcomes may surface within 1-2 weeks
                          </div>
                          {runPreviews[strategy.id].timingProfile ? (
                            (() => {
                              const timingProfile = runPreviews[strategy.id].timingProfile;
                              const timingMode = timingAccessMode || 'pro';
                              if (!timingProfile) return null;

                              return (
                            <div className={`mt-3 rounded-[18px] px-4 py-3 ${timingMode === 'master' ? 'border border-[#ffbd39]/14 bg-[#1a140c]' : 'border border-[#72caff]/14 bg-[#111f28]'}`}>
                              <div className="flex items-center gap-2">
                                <span className={`text-[12px] font-medium ${timingMode === 'master' ? 'text-[#f5cf84]' : 'text-[#9edcff]'}`}>{runPreviews[strategy.id].timingTierLabel || (timingMode === 'master' ? 'TimePulse II' : 'TimePulse')}</span>
                                <span className="text-[11px] text-white/40">{timingMode === 'master' ? 'Master tier' : 'Pro tier'}</span>
                                <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] ${
                                  timingProfile.confidence === 'high'
                                    ? 'bg-[#85d36c]/15 text-[#85d36c]'
                                    : timingProfile.confidence === 'medium'
                                      ? 'bg-[#f5cf84]/15 text-[#f5cf84]'
                                      : 'bg-white/8 text-white/50'
                                }`}>
                                  {timingProfile.confidence}
                                </span>
                              </div>
                              <div className="mt-2 text-[13px] leading-6 text-white/72">
                                Tracking {runPreviews[strategy.id].primaryNumbers.join(' ')} — best play window: {timingProfile.windowStart} to {timingProfile.windowEnd}
                              </div>
                              <div className="mt-1 text-[11px] text-white/40">
                                Based on {timingProfile.sampleSize} historical {getStrategyLabel(runPreviews[strategy.id].engineKey)} patterns • median {timingProfile.median} days • {timingProfile.spread}d spread
                              </div>
                            </div>
                              );
                            })()
                          ) : timingAccessMode && runPreviews[strategy.id].predictionId ? (
                            <div className={`mt-3 rounded-[18px] px-4 py-3 ${timingAccessMode === 'master' ? 'border border-[#ffbd39]/12 bg-[#1a140c]/60' : 'border border-[#72caff]/12 bg-[#111f28]/60'}`}>
                              <div className="flex items-center gap-2">
                                <span className={`text-[12px] font-medium ${timingAccessMode === 'master' ? 'text-[#f5cf84]' : 'text-[#9edcff]'}`}>{runPreviews[strategy.id].timingTierLabel || (timingAccessMode === 'master' ? 'TimePulse II' : 'TimePulse')}</span>
                                <span className="text-[11px] text-white/40">{timingAccessMode === 'master' ? 'Master tier' : 'Pro tier'}</span>
                              </div>
                              <div className="mt-2 text-[12px] leading-6 text-white/55">
                                {timingAccessMode === 'master'
                                  ? 'Gathering adaptive timing data — save picks and check back as draws accumulate to refine your play window estimate.'
                                  : 'Gathering timing data — save picks and check back as draws accumulate to unlock your play window estimate.'}
                              </div>
                            </div>
                          ) : null}
                          {runPreviews[strategy.id].strategyComparisons ? (
                            (function() {
                              const comparisons = runPreviews[strategy.id].strategyComparisons;
                              if (!comparisons) return null;
                              const entries = Object.entries(comparisons).filter(function(e) { return e[1] && e[1].sampleSize >= 3; });
                              if (entries.length === 0) return null;
                              entries.sort(function(a, b) { return (a[1].p75 - a[1].p25) - (b[1].p75 - b[1].p25); });
                              const best = entries[0];
                              if (!best) return null;
                              const spread = best[1].p75 - best[1].p25;
                              const currentTimingProfile = runPreviews[strategy.id].timingProfile;
                              const currentSpread = currentTimingProfile ? currentTimingProfile.p75 - currentTimingProfile.p25 : null;

                              const styleMap: Record<string, string> = { straight: 'Straight', box: 'Box', '50_50': '50/50' };
                              const styleHint = runPreviews[strategy.id].timingProfile?.recommendedStyle;
                              const styleLabel = styleHint ? styleMap[styleHint] || null : null;

                              const currentLabel = getStrategyLabel(strategy.strategy_key);
                              return (
                                <div className="mt-2 rounded-[18px] border border-[#72caff]/14 bg-[#101922] px-4 py-3">
                                  <div className="text-[11px] font-medium text-[#9edcff]">Brew AI</div>
                                  <div className="mt-1 text-[13px] leading-6 text-white/72">
                                    {best[0] !== currentLabel && spread < (currentSpread || 99)
                                      ? `${best[0]} has a tighter timing window (${best[1].p25}-${best[1].p75}d, ${best[1].sampleSize} samples). Consider running it for this game.`
                                      : `This strategy has the tightest timing window for ${runPreviews[strategy.id].gameKey.toUpperCase()} right now.`}
                                    {styleLabel ? (
                                      <span className="mt-1 block text-[#93efb8]">
                                        Historical pattern favors a <strong>{styleLabel}</strong> play style for this game.
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                              );
                            })()
                          ) : null}
                          <div className="mt-2 text-[12px] uppercase tracking-[0.14em] text-white/40">
                            Stored at {new Date(runPreviews[strategy.id].createdAt).toLocaleString()}
                          </div>
                          {!runPreviews[strategy.id].predictionSaved ? (
                            <button
                              type="button"
                              onClick={() => handleSavePrediction(strategy.id)}
                              disabled={savingPredictionId === strategy.id}
                              className="mt-3 animate-pulse rounded-full bg-[#3b82f6] px-5 py-2 text-[13px] font-semibold text-white transition-all hover:bg-[#60a5fa] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {savingPredictionId === strategy.id ? 'Saving...' : 'Save to My Picks'}
                            </button>
                          ) : (
                            <div className="mt-3 text-[13px] font-medium text-[#93efb8]">✓ Saved to My Picks</div>
                          )}
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </SectionCard>
          </div>
        )}
      </DashboardContainer>
    </main>
  );
}
