'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useUserTier } from '@/hooks/useUserTier';
import { supabase } from '@/lib/supabase/browserClient';

type BillingInterval = 'month' | 'year';
type TierAction = 'upgrade' | 'downgrade' | 'current' | 'trial';
type TierKey = 'trial' | 'starter' | 'pro' | 'master';

type TierCard = {
  key: TierKey;
  title: string;
  subtitle: string;
  monthlyPrice: string;
  annualPrice: string;
  annualSavings: string;
  features: string[];
  highlight?: boolean;
};

const TIER_ORDER: Record<TierKey, number> = {
  trial: 0,
  starter: 1,
  pro: 2,
  master: 3,
};

const BILLING_CYCLE_COPY: Record<BillingInterval, { label: string; helper: string }> = {
  month: {
    label: 'Monthly',
    helper: 'Keep it flexible with month-to-month billing.',
  },
  year: {
    label: 'Annual',
    helper: 'Save 30% with annual billing.',
  },
};

function formatTrialEndsAt(trialEndsAt: string | null) {
  if (!trialEndsAt) {
    return null;
  }

  const date = new Date(trialEndsAt);
  if (Number.isNaN(date.getTime())) {
    return trialEndsAt;
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function PricingPage() {
  const { currentTier, isTrial, trialEndsAt } = useUserTier();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('month');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const trialDateLabel = useMemo(() => formatTrialEndsAt(trialEndsAt), [trialEndsAt]);
  const currentTierKey = (currentTier || 'free') as TierKey | 'free';
  const selectedCycle = BILLING_CYCLE_COPY[billingInterval];
  const currentSessionLabel = isTrial ? 'Trial active' : currentTierKey === 'free' ? 'Free session' : currentTierKey;
  const currentSessionCopy = isTrial && trialDateLabel
    ? `Your trial remains active until ${trialDateLabel}.`
    : currentTierKey === 'free'
      ? 'Choose a plan to unlock paid features.'
      : `${currentTierKey.charAt(0).toUpperCase()}${currentTierKey.slice(1)} is active.`;
  const primaryPricingAction =
    isTrial || currentTierKey !== 'free'
      ? { href: '/billing', label: 'Open Billing & Subscription' }
      : { href: '/login', label: 'Start 3-Day Trial' };

  const tiers: TierCard[] = [
    {
      key: 'trial',
      title: '3-Day Trial',
      subtitle: 'Best for testing the full experience before you commit.',
      monthlyPrice: '$0',
      annualPrice: '$0',
      annualSavings: 'Trial stays capped either way.',
      features: ['Full product preview', 'Capped AI usage', 'Onboarding, dashboard, and replay surfaces'],
      highlight: true,
    },
    {
      key: 'starter',
      title: 'Starter',
      subtitle: 'Entry paid tier for core commentary and saved picks.',
      monthlyPrice: '$4.99/mo',
      annualPrice: '$41.92/yr',
      annualSavings: 'Save 30% annually.',
      features: ['Basic AI commentary', 'Saved picks and match tracking', 'Limited AI quota'],
    },
    {
      key: 'pro',
      title: 'Pro',
      subtitle: 'Best value for active users who want deeper explanations.',
      monthlyPrice: '$9.99/mo',
      annualPrice: '$83.92/yr',
      annualSavings: 'Save 30% annually.',
      features: ['Advanced explanations', 'Strategy comparisons', 'Higher AI quota and premium surfaces'],
      highlight: true,
    },
    {
      key: 'master',
      title: 'Master',
      subtitle: 'Maximum analysis, voice, and premium access.',
      monthlyPrice: '$19.99/mo',
      annualPrice: '$167.92/yr',
      annualSavings: 'Save 30% annually.',
      features: ['Voice commentary', 'Largest AI quota', 'Full premium strategy access', 'TimePulse timing analysis'],
    },
  ];

  function getTierAction(tierKey: TierKey): TierAction {
    if (tierKey === 'trial') {
      return isTrial ? 'current' : 'trial';
    }

    if (currentTierKey === tierKey) {
      return 'current';
    }

    if (currentTierKey === 'free' || TIER_ORDER[currentTierKey as TierKey] < TIER_ORDER[tierKey]) {
      return 'upgrade';
    }

    return 'downgrade';
  }

  function getTierPrice(tier: TierCard) {
    if (tier.key === 'trial') {
      return billingInterval === 'year' ? tier.annualPrice : tier.monthlyPrice;
    }

    return billingInterval === 'year' ? tier.annualPrice : tier.monthlyPrice;
  }

  function getTierCtaLabel(tier: TierCard) {
    const action = getTierAction(tier.key);

    switch (action) {
      case 'trial':
        return 'Start Trial';
      case 'current':
        return tier.key === 'trial' ? 'Manage Trial in Billing' : 'Current plan';
      case 'downgrade':
        return `Downgrade in Billing`;
      case 'upgrade':
      default:
        return `Upgrade to ${tier.title}`;
    }
  }

  async function handleTierAction(tier: TierCard) {
    setActionLoading(tier.key);
    setActionMessage(null);

    const action = getTierAction(tier.key);

    try {
      const { data: authData } = await supabase.auth.getUser();
      const authUser = authData.user;

      if (!authUser) {
        window.location.assign('/login');
        return;
      }

      if (action === 'trial') {
        window.location.assign('/login');
        return;
      }

      if (tier.key === 'trial' && action === 'current') {
        window.location.assign('/billing');
        return;
      }

      if (action === 'current' || action === 'downgrade') {
        const response = await fetch('/api/billing/portal', { method: 'POST' });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error?.message || 'Failed to open billing portal');
        }

        if (payload?.data?.portalUrl) {
          window.location.assign(payload.data.portalUrl);
          return;
        }

        throw new Error('Billing portal URL was not returned');
      }

      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tierKey: tier.key,
          interval: billingInterval,
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
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : 'Failed to load plan action');
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 rounded-[24px] border border-white/8 bg-black/20 px-4 py-4 backdrop-blur-sm">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">BrewVerse Labs</div>
            <div className="mt-1 text-[18px] font-semibold tracking-[-0.03em] text-[#f7ddb3]">Pricing</div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[14px] text-white/72 transition-colors hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/billing"
              className="rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-5 py-2 text-[14px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.18)]"
            >
              Billing &amp; Subscription
            </Link>
          </div>
        </header>

        <section className="grid gap-8 py-6 lg:grid-cols-[1.02fr_0.98fr] lg:py-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ffc742]/18 bg-[#ffc742]/10 px-3 py-1 text-[12px] uppercase tracking-[0.16em] text-[#ffd988]">
              <span className="h-2 w-2 rounded-full bg-[#ffcb4d] shadow-[0_0_8px_rgba(255,203,77,0.8)] animate-brew-pulse" />
              State-aware plan selection
            </div>
            <h1 className="mt-5 text-[44px] font-semibold tracking-[-0.05em] text-[#fff1d3] sm:text-[56px] lg:text-[68px]">
              Choose a plan. Manage it in Billing.
            </h1>
            <p className="mt-5 max-w-2xl text-[17px] leading-8 text-white/68 sm:text-[18px]">
              This page is for selection. Billing is for management. Pick a tier, route into Stripe when you need to upgrade,
              and keep downgrades or active subscriptions in the Billing surface so the flow stays clean.
            </p>

            <div className="mt-7 rounded-[22px] border border-[#ffc742]/16 bg-[linear-gradient(145deg,rgba(30,20,13,0.78),rgba(8,8,8,0.96))] px-5 py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-[13px] uppercase tracking-[0.18em] text-white/38">Billing cycle</div>
                  <div className="mt-2 text-[16px] leading-7 text-white/70">{selectedCycle.helper}</div>
                </div>
                <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
                  {(['month', 'year'] as BillingInterval[]).map((interval) => {
                    const active = billingInterval === interval;
                    return (
                      <button
                        key={interval}
                        type="button"
                        onClick={() => setBillingInterval(interval)}
                        className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                          active
                            ? 'bg-[#ffc742] text-black'
                            : 'text-white/68 hover:text-white'
                        }`}
                      >
                        {BILLING_CYCLE_COPY[interval].label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-white/35">Trial cap</div>
                  <div className="mt-2 text-[14px] leading-6 text-white/72">3 days of full preview with limited AI usage.</div>
                </div>
                <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-white/35">Upgrade path</div>
                  <div className="mt-2 text-[14px] leading-6 text-white/72">Upgrades go through Stripe checkout immediately.</div>
                </div>
                <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-white/35">Downgrades</div>
                  <div className="mt-2 text-[14px] leading-6 text-white/72">Current plans and downgrades route through Billing.</div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                href={primaryPricingAction.href}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-7 py-3 text-[15px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.2)]"
              >
                {primaryPricingAction.label}
              </Link>
              <Link
                href="/pricing#plans"
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-7 py-3 text-[15px] text-white/80 transition-colors hover:text-white"
              >
                Review the plan ladder
              </Link>
            </div>

            {isTrial && trialDateLabel ? (
              <div className="mt-6 rounded-[20px] border border-[#72caff]/18 bg-[linear-gradient(145deg,rgba(19,22,31,0.76),rgba(10,10,12,0.96))] px-5 py-5 text-[15px] leading-7 text-white/70">
                Your trial is active and ends on {trialDateLabel}. It unlocks the full product preview for 3 days with capped AI usage.
              </div>
            ) : null}

            <div className="mt-6 rounded-[20px] border border-[#72caff]/16 bg-[linear-gradient(145deg,rgba(18,24,36,0.86),rgba(9,11,14,0.96))] px-5 py-5 text-[15px] leading-7 text-white/72 shadow-[0_0_18px_rgba(114,202,255,0.08)]">
              <div className="text-[12px] uppercase tracking-[0.18em] text-[#9edcff]">Current session</div>
              <div className="mt-2 text-[17px] font-medium text-[#d7ecff]">{currentSessionLabel}</div>
              <div className="mt-2 text-[15px] leading-7 text-white/60">{currentSessionCopy}</div>
              {currentTier !== 'free' || isTrial ? (
                <div className="mt-3 text-[14px] leading-6 text-white/46">
                  {isTrial
                    ? 'Manage the active trial or move into a paid tier from Billing.'
                    : currentTier === 'starter'
                      ? 'Upgrade to Pro or Master, or manage a downgrade in Billing.'
                      : currentTier === 'pro'
                        ? 'Upgrade to Master or downgrade to Starter in Billing.'
                        : currentTier === 'master'
                          ? 'Downgrade in Billing if you want a lower tier.'
                          : ''}
                </div>
              ) : null}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[34px] bg-[#ffc742]/8 blur-2xl animate-brew-drift" />
            <div className="relative rounded-[28px] border border-white/8 bg-[linear-gradient(160deg,rgba(17,14,12,0.94),rgba(7,7,8,0.98))] p-5 shadow-[0_0_28px_rgba(255,184,28,0.08)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[12px] uppercase tracking-[0.18em] text-white/35">Session summary</div>
                  <div className="mt-2 text-[26px] font-semibold tracking-[-0.04em] text-[#f7ddb3]">
                    {isTrial ? 'Trial active' : currentTierKey === 'free' ? 'Plan selection ready' : `${currentTierKey} plan`}
                  </div>
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-white/58">
                  {selectedCycle.label}
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-white/35">Plan chooser</div>
                  <div className="mt-2 text-[14px] leading-6 text-white/72">
                    Select a tier here. Stripe handles new purchases, and Billing handles current-plan changes.
                  </div>
                </div>
                <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-white/35">Current cycle</div>
                  <div className="mt-2 text-[14px] leading-6 text-white/72">
                    {selectedCycle.helper} {billingInterval === 'year' ? 'Annual totals already include the savings view.' : 'Monthly keeps the surface flexible.'}
                  </div>
                </div>
                <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-white/35">Billing home</div>
                  <div className="mt-2 text-[14px] leading-6 text-white/72">
                    Billing &amp; Subscription is the home for invoices, plan changes, and portal access.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-6" id="plans">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[13px] uppercase tracking-[0.18em] text-white/38">Plan ladder</div>
              <div className="mt-2 text-[18px] leading-7 text-white/68">
                Pick the tier that matches your usage. Annual billing saves 30% on paid plans.
              </div>
            </div>
            <div className="hidden rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[12px] uppercase tracking-[0.18em] text-white/45 lg:block">
              Trial stays capped; paid tiers unlock more AI and strategy depth
            </div>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-4">
            {tiers.map((tier) => {
              const action = getTierAction(tier.key);
              const isCurrent = action === 'current';
              const isDowngrade = action === 'downgrade';
              const isTrialTier = tier.key === 'trial';
              const price = getTierPrice(tier);

              return (
                <article
                  key={tier.key}
                  className={`rounded-[28px] border px-5 py-5 shadow-[0_0_24px_rgba(255,184,28,0.08)] transition-transform duration-500 hover:-translate-y-1 ${
                    tier.highlight
                      ? 'border-[#ffc742]/28 bg-[linear-gradient(145deg,rgba(32,19,13,0.92),rgba(13,10,10,0.98))]'
                      : 'border-white/8 bg-white/[0.03]'
                  } ${isCurrent ? 'ring-1 ring-[#85d36c]/22' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[12px] uppercase tracking-[0.18em] text-white/35">{price}</div>
                      <div className="mt-3 text-[24px] font-semibold text-[#f7ddb3]">{tier.title}</div>
                    </div>
                    {isCurrent ? (
                      <div className="rounded-full border border-[#85d36c]/20 bg-[#102117] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-[#85d36c]">
                        Current
                      </div>
                    ) : isDowngrade ? (
                      <div className="rounded-full border border-[#72caff]/18 bg-[#111f28] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-[#9edcff]">
                        Downgrade
                      </div>
                    ) : isTrialTier ? (
                      <div className="rounded-full border border-[#ffc742]/20 bg-[#ffc742]/10 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-[#ffd27e]">
                        Trial
                      </div>
                    ) : (
                      <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-white/48">
                        {billingInterval === 'year' ? 'Annual' : 'Monthly'}
                      </div>
                    )}
                  </div>

                  <div className="mt-2 text-[14px] leading-6 text-white/62">{tier.subtitle}</div>

                  <ul className="mt-5 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-[14px] leading-6 text-white/74">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffc742] shadow-[0_0_10px_rgba(255,199,66,0.7)]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 rounded-[18px] border border-white/8 bg-black/20 px-4 py-4">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-white/35">Billing note</div>
                    <div className="mt-2 text-[13px] leading-6 text-white/68">
                      {tier.annualSavings}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTierAction(tier)}
                    disabled={actionLoading !== null}
                    className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-[15px] font-semibold shadow-[0_0_18px_rgba(255,199,66,0.12)] ${
                      isCurrent
                        ? 'border border-white/10 bg-white/[0.03] text-white/82 transition-colors hover:text-white'
                        : tier.highlight
                          ? 'bg-gradient-to-r from-[#ffc742] to-[#ffbe27] text-black'
                          : isDowngrade
                            ? 'border border-[#72caff]/18 bg-[#111f28] text-[#9edcff] transition-colors hover:text-white'
                            : 'border border-white/10 bg-white/[0.03] text-white/82 transition-colors hover:text-white'
                    }`}
                  >
                    {actionLoading === tier.key ? 'Opening...' : getTierCtaLabel(tier)}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 pb-6 lg:grid-cols-3">
          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-5">
            <div className="text-[14px] uppercase tracking-[0.16em] text-white/35">Selection flow</div>
            <div className="mt-2 text-[16px] leading-7 text-white/68">
              Pick a tier here, then complete the purchase in Stripe or open Billing for current-plan changes.
            </div>
          </div>
          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-5">
            <div className="text-[14px] uppercase tracking-[0.16em] text-white/35">Billing home</div>
            <div className="mt-2 text-[16px] leading-7 text-white/68">
              Billing &amp; Subscription keeps the active account record, portal access, invoices, and downgrade handling.
            </div>
          </div>
          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-5">
            <div className="text-[14px] uppercase tracking-[0.16em] text-white/35">Savings view</div>
            <div className="mt-2 text-[16px] leading-7 text-white/68">
              Annual billing shows the 30% savings view without hiding the monthly price users compare against.
            </div>
          </div>
        </section>

        {actionMessage ? (
          <section className="mb-5 rounded-[20px] border border-[#72caff]/18 bg-[#111f28] px-5 py-4 text-[14px] leading-7 text-[#d7ecff]">
            {actionMessage}
          </section>
        ) : null}
      </div>
    </main>
  );
}
