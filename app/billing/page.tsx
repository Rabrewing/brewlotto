'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { DashboardContainer, Header, NavigationTabs, SectionCard } from '@/components/brewlotto/dashboard';
import { supabase } from '@/lib/supabase/browserClient';

type TierCode = 'free' | 'starter' | 'pro' | 'master';

interface AuthUser { id: string; }
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
        const [entitlementsResult, tiersResult, featuresResult] = await Promise.all([
          supabase.from('user_entitlements').select('tier_code, ai_quota_monthly, ai_quota_used, pick_generation_limit_daily, advanced_strategy_access, premium_explanations_access, premium_comparison_access, export_access, voice_commentary_access, notifications_premium_access, effective_from, effective_to').eq('user_id', authUser.id).maybeSingle(),
          supabase.from('subscription_tiers').select('tier_key, display_name, marketing_label, price_monthly, price_annual, sort_order').eq('is_active', true).order('sort_order', { ascending: true }),
          supabase.from('feature_entitlements').select('feature_key, feature_name, description, min_tier, category, sort_order').eq('is_active', true).order('sort_order', { ascending: true }),
        ]);
        if (entitlementsResult.error) throw entitlementsResult.error;
        if (tiersResult.error) throw tiersResult.error;
        if (featuresResult.error) throw featuresResult.error;
        if (!cancelled) {
          setUser({ id: authUser.id });
          setEntitlements((entitlementsResult.data as UserEntitlementRecord | null) || null);
          setTiers((tiersResult.data || []) as SubscriptionTierRecord[]);
          setFeatures((featuresResult.data || []) as FeatureEntitlementRecord[]);
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
  const unlockedFeatures = useMemo(() => features.filter((entry) => TIER_ORDER[currentTier] >= TIER_ORDER[entry.min_tier]), [currentTier, features]);
  const lockedFeatures = useMemo(() => features.filter((entry) => TIER_ORDER[currentTier] < TIER_ORDER[entry.min_tier]), [currentTier, features]);
  const aiQuotaRemaining = entitlements?.ai_quota_monthly != null && entitlements?.ai_quota_used != null ? Math.max(0, entitlements.ai_quota_monthly - entitlements.ai_quota_used) : null;

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
        <div className="mb-5 mt-2 text-[40px] font-medium tracking-[-0.03em] text-[#f8cf98]">Subscription &amp; Billing</div>
        {loading ? <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/55">Loading billing status...</div> : error ? <div className="rounded-[28px] border border-[#ff8d7b]/25 bg-[#2a120d]/60 px-5 py-8 text-center text-[#ffc4b8]">{error}</div> : !user ? <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/55">No active account data is available right now.</div> : (
          <div className="space-y-5">
            <section className="rounded-[30px] border border-[#ffc742]/24 bg-[radial-gradient(circle_at_top_left,rgba(255,199,66,0.18),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(30,20,13,0.88),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(255,184,28,0.08)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="text-[15px] uppercase tracking-[0.16em] text-white/38">Current plan</div>
                  <div className="mt-3 text-[26px] font-semibold text-[#f7ddb3]">{currentPlan?.display_name || currentTier}</div>
                  <div className="mt-2 max-w-2xl text-[15px] leading-7 text-white/62">
                    This page is authenticated account billing context. Marketing and upgrade copy still lives on `/pricing`, while this route shows current entitlement truth from your account records. The planned ladder is Starter at $4.99, Pro at $9.99, and Master at $19.99, with AI beginning in Starter and expanding by tier.
                  </div>
                </div>
                <Link href="/pricing" className="rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-6 py-3 text-[15px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.18)]">Manage / Upgrade</Link>
              </div>
            </section>

            <SectionCard title="Entitlement Summary" description="Live account entitlements from `user_entitlements`.">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {[
                  ['Advanced strategies', entitlements?.advanced_strategy_access ? 'Enabled' : 'Locked'],
                  ['Premium explanations', entitlements?.premium_explanations_access ? 'Enabled' : 'Locked'],
                  ['Prediction comparisons', entitlements?.premium_comparison_access ? 'Enabled' : 'Locked'],
                  ['Voice commentary', entitlements?.voice_commentary_access ? 'Enabled' : 'Locked'],
                  ['Export tools', entitlements?.export_access ? 'Enabled' : 'Locked'],
                  ['Premium notifications', entitlements?.notifications_premium_access ? 'Enabled' : 'Locked'],
                ].map(([label, value]) => <div key={label} className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4"><div className="text-[12px] uppercase tracking-[0.16em] text-white/35">{label}</div><div className="mt-3 text-[18px] font-medium text-[#f7ddb3]">{value}</div></div>)}
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-[14px] text-white/58">
                <span>AI quota remaining: {aiQuotaRemaining !== null ? aiQuotaRemaining : 'N/A'}</span>
                <span>•</span>
                <span>Daily pick limit: {entitlements?.pick_generation_limit_daily ?? 'N/A'}</span>
              </div>
            </SectionCard>

            <SectionCard title="Plan Ladder" description="Canonical billing tiers from `subscription_tiers`.">
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

                <button
                  type="button"
                  onClick={openPortal}
                  disabled={actionLoading === 'portal'}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-[14px] font-medium text-[#f2d29f] transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionLoading === 'portal' ? 'Opening...' : 'Open Billing Portal'}
                </button>
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

            <SectionCard title="Billing History" description="V1 billing event history is not surfaced here yet.">
              <div className="rounded-[20px] border border-white/8 bg-black/20 px-4 py-4 text-[14px] leading-6 text-white/58">Invoice and charge history are not yet exposed as a self-serve account table in this route. For now, plan selection and upgrade entry stay on `/pricing`, while this route remains the truthful entitlement summary.</div>
            </SectionCard>
          </div>
        )}
      </DashboardContainer>
    </main>
  );
}
