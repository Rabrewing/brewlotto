'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useUserTier } from '@/hooks/useUserTier';

type TierCard = {
  key: string;
  title: string;
  subtitle: string;
  price: string;
  features: string[];
  cta: string;
  highlight?: boolean;
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

  const trialDateLabel = useMemo(() => formatTrialEndsAt(trialEndsAt), [trialEndsAt]);

  const tiers: TierCard[] = [
    {
      key: 'trial',
      title: '3-Day Trial',
      subtitle: 'Best for testing the full vibe without long-term commitment.',
      price: '$0',
      features: [
        'Full product preview across the app',
        'Capped AI usage to control burn',
        'Onboarding + dashboard + live route preview',
      ],
      cta: 'Start Trial',
      highlight: true,
    },
    {
      key: 'starter',
      title: 'Starter',
      subtitle: 'Entry paid tier for core commentary and saved picks.',
      price: '$4.99/mo',
      features: [
        'Basic AI commentary',
        'Saved picks and match tracking',
        'Limited AI quota',
      ],
      cta: 'Choose Starter',
    },
    {
      key: 'pro',
      title: 'Pro',
      subtitle: 'Best value for active users who want deeper explanations.',
      price: '$9.99/mo',
      features: [
        'Advanced explanations',
        'Strategy comparisons',
        'Higher AI quota and premium surfaces',
      ],
      cta: 'Choose Pro',
      highlight: true,
    },
    {
      key: 'master',
      title: 'Master',
      subtitle: 'Maximum analysis, voice, and premium access.',
      price: '$19.99/mo',
      features: [
        'Voice commentary',
        'Largest AI quota',
        'Full premium strategy access',
      ],
      cta: 'Choose Master',
    },
  ];

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
              href="/login"
              className="rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-5 py-2 text-[14px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.18)]"
            >
              Sign In
            </Link>
          </div>
        </header>

        <section className="grid gap-8 py-6 lg:grid-cols-[0.95fr_1.05fr] lg:py-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ffc742]/18 bg-[#ffc742]/10 px-3 py-1 text-[12px] uppercase tracking-[0.16em] text-[#ffd988]">
              <span className="h-2 w-2 rounded-full bg-[#ffcb4d] shadow-[0_0_8px_rgba(255,203,77,0.8)] animate-brew-pulse" />
              3-day capped trial
            </div>
            <h1 className="mt-5 text-[44px] font-semibold tracking-[-0.05em] text-[#fff1d3] sm:text-[56px] lg:text-[68px]">
              Test the app. Cap the burn.
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-8 text-white/68 sm:text-[18px]">
              Use a short trial to prove the experience, then convert into paid access if the product feels worth it.
              That keeps AI exposure controlled and avoids an unlimited free ride.
            </p>

            <div className="mt-7 rounded-[22px] border border-[#ffc742]/16 bg-[linear-gradient(145deg,rgba(30,20,13,0.78),rgba(8,8,8,0.96))] px-5 py-5">
              <div className="text-[13px] uppercase tracking-[0.18em] text-white/38">Recommended launch setup</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4 text-[14px] leading-6 text-white/72">
                  3-day trial only
                </div>
                <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4 text-[14px] leading-6 text-white/72">
                  AI starts in Starter
                </div>
                <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4 text-[14px] leading-6 text-white/72">
                  30% annual savings
                </div>
                <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4 text-[14px] leading-6 text-white/72">
                  No unlimited tier
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-7 py-3 text-[15px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.2)]"
              >
                Start 3-Day Trial
              </Link>
              <Link
                href="/billing"
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-7 py-3 text-[15px] text-white/80 transition-colors hover:text-white"
              >
                View Account Billing
              </Link>
            </div>

            {isTrial && trialDateLabel ? (
              <div className="mt-6 rounded-[20px] border border-[#72caff]/18 bg-[linear-gradient(145deg,rgba(19,22,31,0.76),rgba(10,10,12,0.96))] px-5 py-5 text-[15px] leading-7 text-white/70">
                Your trial is active and ends on {trialDateLabel}. It unlocks the full product preview for 3 days with capped AI usage so users can see the whole system before choosing a paid tier.
              </div>
            ) : null}

            <div className="mt-6 rounded-[20px] border border-white/10 bg-white/[0.03] px-5 py-5 text-[15px] leading-7 text-white/68">
              Current session tier: <span className="text-[#f7ddb3]">{currentTier}</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[34px] bg-[#ffc742]/8 blur-2xl animate-brew-drift" />
            <div className="relative grid gap-4 xl:grid-cols-4">
              {tiers.map((tier) => (
                <article
                  key={tier.key}
                  className={`rounded-[28px] border px-5 py-5 shadow-[0_0_24px_rgba(255,184,28,0.08)] transition-transform duration-500 hover:-translate-y-1 ${
                    tier.highlight
                      ? 'border-[#ffc742]/28 bg-[linear-gradient(145deg,rgba(32,19,13,0.92),rgba(13,10,10,0.98))]'
                      : 'border-white/8 bg-white/[0.03]'
                  }`}
                >
                  <div className="text-[12px] uppercase tracking-[0.18em] text-white/35">{tier.price}</div>
                  <div className="mt-3 text-[24px] font-semibold text-[#f7ddb3]">{tier.title}</div>
                  <div className="mt-2 text-[14px] leading-6 text-white/62">{tier.subtitle}</div>

                  <div className="mt-5 space-y-3">
                    {tier.features.map((feature) => (
                      <div key={feature} className="rounded-[16px] border border-white/8 bg-black/20 px-4 py-3 text-[14px] leading-6 text-white/72">
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/login"
                    className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-[15px] font-semibold shadow-[0_0_18px_rgba(255,199,66,0.12)] ${
                      tier.highlight
                        ? 'bg-gradient-to-r from-[#ffc742] to-[#ffbe27] text-black'
                        : 'border border-white/10 bg-white/[0.03] text-white/82 transition-colors hover:text-white'
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 pb-6 lg:grid-cols-3">
          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-5">
            <div className="text-[14px] uppercase tracking-[0.16em] text-white/35">Trial policy</div>
            <div className="mt-2 text-[16px] leading-7 text-white/68">
              Keep the trial short and capped. Give users the full product preview without opening a long, expensive free period.
            </div>
          </div>
          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-5">
            <div className="text-[14px] uppercase tracking-[0.16em] text-white/35">Upgrade path</div>
            <div className="mt-2 text-[16px] leading-7 text-white/68">
              Convert trial users into Starter, Pro, or Master after onboarding and a few live interactions, not before they see the value.
            </div>
          </div>
          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-5">
            <div className="text-[14px] uppercase tracking-[0.16em] text-white/35">Cost control</div>
            <div className="mt-2 text-[16px] leading-7 text-white/68">
              Unlimited AI access is the wrong launch default. Start AI in Starter, expand it through Pro and Master, then let Stripe and entitlements enforce the rest.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
