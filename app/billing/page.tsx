'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { DashboardContainer, Header, NavigationTabs, SectionCard, TrialUpgradeBanner } from '@/components/brewlotto/dashboard';
import { supabase } from '@/lib/supabase/browserClient';

type TierCode = 'free' | 'starter' | 'pro' | 'master';

interface AuthUser {
  id: string;
  email?: string | null;
}
interface UserEntitlementRecord {
  tier_code?: TierCode | null;
  ai_quota_monthly?: number | null;
  ai_quota_used?: number | null;
  pick_generation_limit_daily?: number | null;
  advanced_strategy_access?: boolean | null;
  premium_explanations_access?: boolean | null;
  premium_comparison_access?: boolean | null;
  export_access?: boolean | null;
  voice_commentary_access?: boolean | null;
  notifications_premium_access?: boolean | null;
  timing_analysis_access?: boolean | null;
  effective_from?: string | null;
  effective_to?: string | null;
}
interface SubscriptionTierRecord {
  tier_key: TierCode;
  display_name: string;
  marketing_label?: string | null;
  price_monthly?: number | null;
  price_annual?: number | null;
  sort_order: number;
}
interface FeatureEntitlementRecord {
  feature_key: string;
  feature_name: string;
  description?: string | null;
  min_tier: TierCode;
  category: string;
  sort_order: number;
}

const TIER_ORDER: Record<TierCode, number> = { free: 0, starter: 1, pro: 2, master: 3 };

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [entitlements, setEntitlements] = useState<UserEntitlementRecord | null>(null);
  const [tiers, setTiers] = useState<SubscriptionTierRecord[]>([]);
  const [features, setFeatures] = useState<FeatureEntitlementRecord[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<'month' | 'year'>('month');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
      setCheckoutSuccess(true);
      // Clean URL without reloading
      window.history.replaceState({}, '', '/billing');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadBilling() {
      setLoading(true);
      setError(null);
      try {
        const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!authUser) {
          if (!cancelled) setError('You need to sign in before Brew can show billing status.');
          return;
        }

        const { data: entitlementsData, error: entitlementsError } = await supabase
          .from('user_entitlements')
          .select('tier_code, ai_quota_monthly, ai_quota_used, pick_generation_limit_daily, advanced_strategy_access, premium_explanations_access, premium_comparison_access, export_access, voice_commentary_access, notifications_premium_access, timing_analysis_access, effective_from, effective_to')
          .eq('user_id', authUser.id)
          .maybeSingle();

        const [tiersResult, featuresResult] = await Promise.all([
          supabase.from('subscription_tiers').select('tier_key, display_name, marketing_label, price_monthly, price_annual, sort_order').eq('is_active', true).order('sort_order', { ascending: true }),
          supabase.from('feature_entitlements').select('feature_key, feature_name, description, min_tier, category, sort_order').eq('is_active', true).order('sort_order', { ascending: true }),
        ]);
        if (!cancelled) {
          setUser({ id: authUser.id, email: authUser.email });
          setEntitlements((entitlementsData as UserEntitlementRecord | null) || null);
          setTiers(((tiersResult.error ? [] : tiersResult.data) || []) as SubscriptionTierRecord[]);
          setFeatures(((featuresResult.error ? [] : featuresResult.data) || []) as FeatureEntitlementRecord[]);

          if (entitlementsError) {
            console.warn('Billing entitlements load issue:', entitlementsError.message);
          }

          if (tiersResult.error || featuresResult.error) {
            console.warn('Billing optional data load issue:', {
              tiersError: tiersResult.error?.message || null,
              featuresError: featuresResult.error?.message || null,
            });
          }
        }
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : 'Failed to load billing');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadBilling();
    return () => { cancelled = true; };
  }, []);

  const currentTier = (entitlements?.tier_code || 'free') as TierCode;
  const currentPlan = tiers.find((entry) => entry.tier_key === currentTier) || null;
  const displayName = user?.email?.split('@')[0]?.replace(/[._-]+/g, ' ').trim() || 'Brew User';
  const initials =
    displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('') || 'BU';
  const unlockedFeatures = useMemo(() => features.filter((entry) => TIER_ORDER[currentTier] >= TIER_ORDER[entry.min_tier]), [currentTier, features]);
  const lockedFeatures = useMemo(() => features.filter((entry) => TIER_ORDER[currentTier] < TIER_ORDER[entry.min_tier]), [currentTier, features]);
  const aiQuotaRemaining = entitlements?.ai_quota_monthly != null && entitlements?.ai_quota_used != null ? Math.max(0, entitlements.ai_quota_monthly - entitlements.ai_quota_used) : null;
  const nextBillingLabel = entitlements?.effective_to
    ? new Date(entitlements.effective_to).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  async function startCheckout(tier: Exclude<TierCode, 'free'>) {
    setActionLoading(tier);
    setActionMessage(null);

    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tierKey: tier,
          interval: selectedInterval,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error?.message || 'Failed to start checkout');
      }

      if (payload?.data?.checkoutUrl) {
        window.location.assign(payload.data.checkoutUrl);
        return;
      }

      throw new Error('Checkout URL was not returned');
    } catch (checkoutError) {
      setActionMessage(checkoutError instanceof Error ? checkoutError.message : 'Failed to start checkout');
    } finally {
      setActionLoading(null);
    }
  }

  async function openPortal() {
    setActionLoading('portal');
    setActionMessage(null);

    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error?.message || 'Failed to open billing portal');
      }

      if (payload?.data?.portalUrl) {
        window.location.assign(payload.data.portalUrl);
        return;
      }

      throw new Error('Portal URL was not returned');
    } catch (portalError) {
      setActionMessage(portalError instanceof Error ? portalError.message : 'Failed to open billing portal');
    } finally {
      setActionLoading(null);
    }
  }

  async function refreshAccess() {
    setActionLoading('refresh');
    setActionMessage(null);

    try {
      const response = await fetch('/api/billing/sync', {
        method: 'POST',
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error?.message || 'Failed to refresh access');
      }

      setActionMessage(`Access refreshed to ${payload?.data?.tier || 'your current tier'}. Reloading billing...`);
      window.location.reload();
    } catch (refreshError) {
      setActionMessage(refreshError instanceof Error ? refreshError.message : 'Failed to refresh access');
    } finally {
      setActionLoading(null);
    }
  }

  function getPlanDisplayPrice(tier: Pick<SubscriptionTierRecord, 'price_monthly' | 'price_annual'>) {
    if (selectedInterval === 'year') {
      if (tier.price_annual != null) {
        return `$${Number(tier.price_annual).toFixed(2)}/yr`;
      }

      if (tier.price_monthly != null) {
        return `$${Number((Number(tier.price_monthly) * 12 * 0.7).toFixed(2))}/yr`;
      }
    }

    return tier.price_monthly != null ? `$${Number(tier.price_monthly).toFixed(2)}/mo` : 'See pricing';
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DashboardContainer>
        <Header />
        <NavigationTabs />
        <TrialUpgradeBanner className="mt-4" />
        {checkoutSuccess ? (
          <div className="mb-4 mt-4 rounded-[28px] border border-[#53d48a]/30 bg-[#102117] px-5 py-5 text-center shadow-[0_0_22px_rgba(83,212,138,0.12)]">
            <div className="text-[22px] font-semibold text-[#93efb8]">🎉 Upgrade Successful!</div>
            <div className="mt-2 text-[15px] leading-6 text-[#a8f0c5]/80">
              Your plan has been updated. Your new entitlements are reflected below.
            </div>
          </div>
        ) : null}
        <div className="mb-5 mt-2 text-[40px] font-medium tracking-[-0.03em] text-[#f8cf98]">Subscription &amp; Billing</div>
        {loading ? <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/55">Loading billing status...</div> : error ? <div className="rounded-[28px] border border-[#ff8d7b]/25 bg-[#2a120d]/60 px-5 py-8 text-center text-[#ffc4b8]">{error}</div> : !user ? <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/55">No active account data is available right now.</div> : (
          <div className="space-y-5">
            <section className="rounded-[30px] border border-[#ffc742]/24 bg-[radial-gradient(circle_at_top_left,rgba(255,199,66,0.18),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(30,20,13,0.88),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(255,184,28,0.08)]">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-full border border-[#ffc742]/30 bg-[radial-gradient(circle_at_top_left,rgba(255,199,66,0.35),rgba(0,0,0,0)_58%),linear-gradient(145deg,rgba(36,24,16,0.95),rgba(10,10,10,0.98))] text-[34px] font-semibold text-[#f7ddb3] shadow-[0_0_30px_rgba(255,184,28,0.15)]">
                  {initials}
                </div>
                <div className="mt-4 text-[32px] font-semibold text-[#f7ddb3]">{displayName}</div>
                <div className="mt-3 inline-flex rounded-full border border-[#ffc742]/24 bg-[#ffc742]/10 px-4 py-1.5 text-[12px] uppercase tracking-[0.16em] text-[#ffd27e]">
                  {currentPlan?.display_name || currentTier}
                </div>
                <div className="mt-4 max-w-2xl text-[15px] leading-7 text-white/62">
                  This page is authenticated account billing context. Marketing and upgrade copy still lives on `/pricing`, while this route shows current entitlement truth from your account records. The planned ladder is Starter at $4.99, Pro at $9.99, and Master at $19.99, with AI beginning in Starter and expanding by tier.
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <Link href="/pricing" className="rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-6 py-3 text-[15px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.18)]">
                    Manage / Upgrade
                  </Link>
                  <button
                    type="button"
                    onClick={refreshAccess}
                    disabled={actionLoading === 'refresh'}
                    className="rounded-full border border-[#8ad4ff]/25 bg-[#0d1d2b] px-6 py-3 text-[15px] font-medium text-[#b9e3ff] transition-colors hover:border-[#8ad4ff]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionLoading === 'refresh' ? 'Refreshing...' : 'Refresh Access'}
                  </button>
                  <button
                    type="button"
                    onClick={openPortal}
                    disabled={actionLoading === 'portal'}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-[15px] font-medium text-[#f2d29f] transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionLoading === 'portal' ? 'Opening...' : 'Open Billing Portal'}
                  </button>
                </div>
              </div>
            </section>

            <SectionCard title="BrewMaster Benefits" description="Live account entitlements from your account record.">
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-3">
                  {[
                    ['Strategy Locker unlocked', entitlements?.advanced_strategy_access ? 'Yes' : 'Locked'],
                    ['Premium explanations unlocked', entitlements?.premium_explanations_access ? 'Yes' : 'Locked'],
                    ['Prediction comparisons unlocked', entitlements?.premium_comparison_access ? 'Yes' : 'Locked'],
                    ['Voice commentary unlocked', entitlements?.voice_commentary_access ? 'Yes' : 'Locked'],
                    ['TimePulse timing analysis', entitlements?.timing_analysis_access ? 'Enabled' : 'Locked'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4">
                      <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">{label}</div>
                      <div className="mt-3 text-[18px] font-medium text-[#f7ddb3]">{value}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-[24px] border border-[#ffc742]/18 bg-[radial-gradient(circle_at_top_left,rgba(255,199,66,0.16),rgba(0,0,0,0)_36%),linear-gradient(145deg,rgba(18,16,12,0.92),rgba(8,8,8,0.98))] px-5 py-5">
                  <div className="text-[12px] uppercase tracking-[0.16em] text-[#f5cf84]">You&apos;re unlocked</div>
                  <div className="mt-3 text-[18px] font-medium text-[#f7ddb3]">Full access to your current tier</div>
                  <div className="mt-2 text-[14px] leading-6 text-white/62">
                    {currentPlan?.display_name || 'Your active tier'} remains in force until Stripe refreshes the entitlement window.
                  </div>
                  <div className="mt-4 rounded-[18px] border border-[#f5cf84]/12 bg-[#171208] px-4 py-4 text-[14px] leading-6 text-[#f1dfc0]">
                    AI quota remaining: {aiQuotaRemaining !== null ? aiQuotaRemaining : 'N/A'}
                    <br />
                    Daily pick limit: {entitlements?.pick_generation_limit_daily ?? 'N/A'}
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Billing Information" description="Current plan timing and transaction context from the account record.">
              <div className="rounded-[20px] border border-white/8 bg-black/20 px-4 py-4 text-[14px] leading-7 text-white/58">
                {nextBillingLabel ? (
                  <>
                    Next billing context points to <span className="text-[#f7ddb3]">{nextBillingLabel}</span> from the current entitlement window.
                  </>
                ) : (
                  <>
                    Billing date details will appear here once the Stripe entitlement window is refreshed for this account.
                  </>
                )}
                <div className="mt-3">
                  Annual billing should be marketed as a 30% savings over monthly once Stripe is wired, with Pro framed as the best-value tier and Master reserved for the heaviest AI and voice usage.
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Quick Links" description="Common account actions and support routes.">
              <div className="grid gap-3 md:grid-cols-2">
                <Link href="#billing-history" className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-4 transition-colors hover:border-[#ffc742]/20 hover:bg-[#ffc742]/8">
                  <div className="text-[16px] font-medium text-[#f7ddb3]">Transaction History</div>
                  <div className="mt-2 text-[14px] leading-7 text-white/60">Review the billing event history on this page.</div>
                </Link>
                <Link href="/support" className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-4 transition-colors hover:border-[#ffc742]/20 hover:bg-[#ffc742]/8">
                  <div className="text-[16px] font-medium text-[#f7ddb3]">Help &amp; Support</div>
                  <div className="mt-2 text-[14px] leading-7 text-white/60">Open BrewU support for billing questions or issues.</div>
                </Link>
              </div>
            </SectionCard>

            <SectionCard title="Plan Ladder" description="Canonical billing tiers used by BrewLotto.">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {tiers.map((tier) => <div key={tier.tier_key} className={`rounded-[22px] border px-4 py-4 ${tier.tier_key === currentTier ? 'border-[#ffc742]/30 bg-[#ffc742]/10' : 'border-white/8 bg-black/20'}`}><div className="text-[12px] uppercase tracking-[0.16em] text-white/35">{tier.tier_key}</div><div className="mt-3 text-[20px] font-medium text-[#f7ddb3]">{tier.display_name}</div><div className="mt-2 text-[14px] text-white/58">{getPlanDisplayPrice(tier)}</div><div className="mt-4 text-[12px] uppercase tracking-[0.14em] text-white/42">{tier.tier_key === currentTier ? 'Current plan' : 'Available tier'}</div></div>)}
              </div>
              <div className="mt-4 text-[14px] leading-6 text-white/58">
                Annual billing should be marketed as a 30% savings over monthly once Stripe is wired, with Pro framed as the best-value tier and Master reserved for the heaviest AI and voice usage.
              </div>
            </SectionCard>

            <SectionCard title="Billing Actions" description="Stripe checkout and customer portal are wired through API routes.">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">Billing interval</div>
                  <div className="mt-2 flex gap-2">
                    {(['month', 'year'] as const).map((interval) => (
                      <button
                        key={interval}
                        type="button"
                        onClick={() => setSelectedInterval(interval)}
                        className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                          selectedInterval === interval
                            ? 'bg-[#ffc742] text-black'
                            : 'border border-white/10 bg-white/[0.03] text-white/68 hover:bg-white/[0.06]'
                        }`}
                      >
                        {interval === 'month' ? 'Monthly' : 'Yearly'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-[14px] text-white/58">
                  Use the interval selector to switch checkout pricing, then return to the hero if you need the customer portal again.
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {(['starter', 'pro', 'master'] as const).map((tier) => {
                  const tierRow = tiers.find((entry) => entry.tier_key === tier);
                  const isCurrent = tier === currentTier;
                  return (
                    <div key={tier} className={`rounded-[22px] border px-4 py-4 ${isCurrent ? 'border-[#ffc742]/30 bg-[#ffc742]/10' : 'border-white/8 bg-black/20'}`}>
                      <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">{tier}</div>
                      <div className="mt-3 text-[18px] font-medium text-[#f7ddb3]">{tierRow?.display_name || tier}</div>
                      <div className="mt-2 text-[14px] text-white/58">{getPlanDisplayPrice(tierRow || { price_monthly: null, price_annual: null })}</div>
                      <button
                        type="button"
                        onClick={() => startCheckout(tier)}
                        disabled={actionLoading === tier || isCurrent}
                        className="mt-4 rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-4 py-2 text-[13px] font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {actionLoading === tier ? 'Redirecting...' : isCurrent ? 'Current plan' : `Start ${tier}`}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 text-[14px] leading-6 text-white/58">
                Use Stripe CLI with the webhook route at `/api/webhooks/stripe` to test subscription creation, renewal, and entitlement updates before launch.
              </div>

              {actionMessage ? (
                <div className="mt-4 rounded-[18px] border border-[#ff8d7b]/24 bg-[#2a120d]/60 px-4 py-3 text-[14px] text-[#ffc4b8]">
                  {actionMessage}
                </div>
              ) : null}
            </SectionCard>

            <SectionCard title="Feature Access" description="This summary is derived from `feature_entitlements` and compared against your current tier.">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-[24px] border border-white/8 bg-black/20 px-4 py-4"><div className="mb-3 text-[12px] uppercase tracking-[0.16em] text-white/35">Unlocked now</div><div className="space-y-3">{unlockedFeatures.map((feature) => <div key={feature.feature_key} className="rounded-[18px] border border-white/8 bg-white/[0.03] px-3 py-3"><div className="text-[15px] font-medium text-[#f7ddb3]">{feature.feature_name}</div><div className="mt-1 text-[13px] leading-6 text-white/55">{feature.description || 'No description stored.'}</div></div>)}</div></div>
                <div className="rounded-[24px] border border-white/8 bg-black/20 px-4 py-4"><div className="mb-3 text-[12px] uppercase tracking-[0.16em] text-white/35">Upgrade-only features</div><div className="space-y-3">{lockedFeatures.map((feature) => <div key={feature.feature_key} className="rounded-[18px] border border-white/8 bg-white/[0.03] px-3 py-3"><div className="flex items-center justify-between gap-3"><div className="text-[15px] font-medium text-[#f7ddb3]">{feature.feature_name}</div><div className="text-[11px] uppercase tracking-[0.14em] text-white/38">{feature.min_tier}</div></div><div className="mt-1 text-[13px] leading-6 text-white/55">{feature.description || 'No description stored.'}</div></div>)}</div></div>
              </div>
            </SectionCard>

            <SectionCard title="Billing History" description="V1 billing event history is not surfaced here yet." >
              <div id="billing-history" />
              <div className="rounded-[20px] border border-white/8 bg-black/20 px-4 py-4 text-[14px] leading-6 text-white/58">Invoice and charge history are not yet exposed as a self-serve account table in this route. For now, plan selection and upgrade entry stay on `/pricing`, while this route remains the truthful entitlement summary.</div>
            </SectionCard>
          </div>
        )}
      </DashboardContainer>
    </main>
  );
}
