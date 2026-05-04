'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  DashboardContainer,
  Header,
  NavigationTabs,
  SectionCard,
} from '@/components/brewlotto/dashboard';
import { supabase } from '@/lib/supabase/browserClient';

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
  source_strategy_key?: string | null;
  confidence_score?: number | null;
  created_at: string;
}

interface UserEntitlementRecord {
  tier_code?: TierCode | null;
  advanced_strategy_access?: boolean | null;
  premium_explanations_access?: boolean | null;
  premium_comparison_access?: boolean | null;
  voice_commentary_access?: boolean | null;
}

interface SubscriptionTierRecord {
  tier_key: TierCode;
  display_name: string;
  price_monthly?: number | null;
  sort_order: number;
}

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [strategies, setStrategies] = useState<StrategyRecord[]>([]);
  const [savedStrategies, setSavedStrategies] = useState<SavedStrategyRecord[]>([]);
  const [strategyActivity, setStrategyActivity] = useState<StrategyActivityRecord[]>([]);
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [entitlements, setEntitlements] = useState<UserEntitlementRecord | null>(null);
  const [subscriptionTiers, setSubscriptionTiers] = useState<SubscriptionTierRecord[]>([]);
  const [savingStrategyId, setSavingStrategyId] = useState<string | null>(null);

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

        const [strategiesResult, savedResult, activityResult, predictionsResult, entitlementsResult, tiersResult] = await Promise.all([
          supabase
            .from('strategy_registry')
            .select('id, strategy_key, public_name, description, category, min_tier, sort_order, metadata')
            .eq('is_active', true)
            .order('sort_order', { ascending: true }),
          supabase
            .from('user_saved_strategies')
            .select('strategy_id, is_favorite, nickname, updated_at')
            .eq('user_id', authUser.id),
          supabase
            .from('user_strategy_activity')
            .select('strategy_id, game, state, context, occurred_at')
            .eq('user_id', authUser.id)
            .order('occurred_at', { ascending: false })
            .limit(60),
          supabase
            .from('predictions')
            .select('source_strategy_key, confidence_score, created_at')
            .eq('user_id', authUser.id)
            .order('created_at', { ascending: false })
            .limit(60),
          supabase
            .from('user_entitlements')
            .select('tier_code, advanced_strategy_access, premium_explanations_access, premium_comparison_access, voice_commentary_access')
            .eq('user_id', authUser.id)
            .maybeSingle(),
          supabase
            .from('subscription_tiers')
            .select('tier_key, display_name, price_monthly, sort_order')
            .eq('is_active', true)
            .order('sort_order', { ascending: true }),
        ]);

        if (strategiesResult.error) {
          throw strategiesResult.error;
        }
        if (savedResult.error) {
          throw savedResult.error;
        }
        if (activityResult.error) {
          throw activityResult.error;
        }
        if (predictionsResult.error) {
          throw predictionsResult.error;
        }
        if (entitlementsResult.error) {
          throw entitlementsResult.error;
        }
        if (tiersResult.error) {
          throw tiersResult.error;
        }

        if (!cancelled) {
          setUser({ id: authUser.id, email: authUser.email });
          setStrategies((strategiesResult.data || []) as StrategyRecord[]);
          setSavedStrategies((savedResult.data || []) as SavedStrategyRecord[]);
          setStrategyActivity((activityResult.data || []) as StrategyActivityRecord[]);
          setPredictions((predictionsResult.data || []) as PredictionRecord[]);
          setEntitlements((entitlementsResult.data as UserEntitlementRecord | null) || null);
          setSubscriptionTiers((tiersResult.data || []) as SubscriptionTierRecord[]);
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
    return entitlements?.tier_code || 'free';
  }, [entitlements?.tier_code]);

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
      if (existing) {
        const { error: deleteError } = await supabase
          .from('user_saved_strategies')
          .delete()
          .eq('user_id', user.id)
          .eq('strategy_id', strategy.id);

        if (deleteError) {
          throw deleteError;
        }

        setSavedStrategies((current) => current.filter((entry) => entry.strategy_id !== strategy.id));
      } else {
        const { data, error: insertError } = await supabase
          .from('user_saved_strategies')
          .insert({
            user_id: user.id,
            strategy_id: strategy.id,
            is_favorite: true,
          })
          .select('strategy_id, is_favorite, nickname, updated_at')
          .single();

        if (insertError) {
          throw insertError;
        }

        setSavedStrategies((current) => [data as SavedStrategyRecord, ...current]);
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to update saved strategy');
    } finally {
      setSavingStrategyId(null);
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
                    Strategy Locker reads live strategy registry rows plus your saved methods, activity history, and tier entitlements. Locked cards stay visible so upgrade boundaries are truthful.
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-[12px] uppercase tracking-[0.14em] text-white/42">
                  <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">Unlocked {unlockedCount}</span>
                  <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">Favorites {favoriteCount}</span>
                  <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">Activity {strategyActivity.length}</span>
                </div>
              </div>
            </section>

            <SectionCard
              title="Entitlement Snapshot"
              description="This is the current tier framing Brew can verify on your account right now."
            >
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4">
                  <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">Advanced strategies</div>
                  <div className="mt-3 text-[18px] font-medium text-[#f7ddb3]">
                    {entitlements?.advanced_strategy_access ? 'Enabled' : 'Locked'}
                  </div>
                </div>
                <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4">
                  <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">Premium explanations</div>
                  <div className="mt-3 text-[18px] font-medium text-[#f7ddb3]">
                    {entitlements?.premium_explanations_access ? 'Enabled' : 'Locked'}
                  </div>
                </div>
                <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4">
                  <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">Comparisons</div>
                  <div className="mt-3 text-[18px] font-medium text-[#f7ddb3]">
                    {entitlements?.premium_comparison_access ? 'Enabled' : 'Locked'}
                  </div>
                </div>
                <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4">
                  <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">Voice commentary</div>
                  <div className="mt-3 text-[18px] font-medium text-[#f7ddb3]">
                    {entitlements?.voice_commentary_access ? 'Enabled' : 'Locked'}
                  </div>
                </div>
              </div>
            </SectionCard>

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
                              {strategy.public_name}
                            </div>
                            <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-white/38">
                              {formatCategoryLabel(strategy.category)}
                            </span>
                          </div>
                          <div className="mt-3 text-[14px] leading-7 text-white/58">
                            {strategy.description || 'No strategy description stored yet.'}
                          </div>
                        </div>
                        <div className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] ${hasAccess ? 'border border-[#72caff]/18 bg-[#72caff]/10 text-[#9fdcff]' : 'border border-[#ff8d7b]/18 bg-[#ff8d7b]/10 text-[#ffc4b8]'}`}>
                          {hasAccess ? 'Unlocked' : `Requires ${formatTierLabel(strategy.min_tier)}`}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 text-[12px] uppercase tracking-[0.14em] text-white/40">
                        <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">Saved {saved ? 'Yes' : 'No'}</span>
                        <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">Uses {predictionData?.uses || 0}</span>
                        <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">
                          Avg confidence {averageConfidence !== null ? `${averageConfidence}%` : 'N/A'}
                        </span>
                      </div>

                      <div className="mt-5 border-t border-white/8 pt-4 text-[14px] text-white/62">
                        {lastUsedAt
                          ? `Last seen in your account activity on ${new Date(lastUsedAt).toLocaleDateString()}.`
                          : 'No account-linked activity has been recorded for this strategy yet.'}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          disabled={!hasAccess || savingStrategyId === strategy.id}
                          onClick={() => handleToggleSaved(strategy)}
                          className="rounded-full border border-[#ffc742]/28 bg-[#ffc742]/10 px-4 py-2 text-[14px] font-medium text-[#ffd27e] transition-colors hover:bg-[#ffc742]/16 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          {savingStrategyId === strategy.id ? 'Saving...' : saved ? 'Remove Favorite' : 'Save to Locker'}
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
                    </article>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard
              title="Plan Ladder"
              description="Subscription tier rows are shown directly from the tier registry so the upgrade path stays aligned with stored pricing names."
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {subscriptionTiers.map((tier) => {
                  const active = tier.tier_key === currentTier;

                  return (
                    <div
                      key={tier.tier_key}
                      className={`rounded-[22px] border px-4 py-4 ${
                        active
                          ? 'border-[#ffc742]/30 bg-[#ffc742]/10'
                          : 'border-white/8 bg-black/20'
                      }`}
                    >
                      <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">{tier.tier_key}</div>
                      <div className="mt-3 text-[20px] font-medium text-[#f7ddb3]">{tier.display_name}</div>
                      <div className="mt-2 text-[14px] text-white/58">
                        {tier.price_monthly != null ? `$${Number(tier.price_monthly).toFixed(2)}/mo` : 'Contact tier'}
                      </div>
                      <div className="mt-4 text-[12px] uppercase tracking-[0.14em] text-white/42">
                        {active ? 'Current plan' : 'Upgrade target'}
                      </div>
                    </div>
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
