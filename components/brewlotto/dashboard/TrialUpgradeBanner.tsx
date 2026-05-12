'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { useUserTier } from '@/hooks/useUserTier';

interface TrialUpgradeBannerProps {
  className?: string;
}

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

export function TrialUpgradeBanner({ className = '' }: TrialUpgradeBannerProps) {
  const { currentTier, isTrial, trialEndsAt } = useUserTier();

  const trialEndsLabel = useMemo(() => formatTrialEndsAt(trialEndsAt), [trialEndsAt]);
  const trialIsExpired = useMemo(() => {
    if (!trialEndsAt) {
      return false;
    }

    const date = new Date(trialEndsAt);
    return Number.isFinite(date.getTime()) ? date.getTime() < Date.now() : false;
  }, [trialEndsAt]);
  const trialTimeLeft = useMemo(() => {
    if (!trialEndsAt) {
      return null;
    }

    const date = new Date(trialEndsAt);
    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return formatDistanceToNowStrict(date, { addSuffix: false });
  }, [trialEndsAt]);

  const hasTrialWindow = Boolean(trialEndsAt) && (isTrial || currentTier === 'free');

  if (!hasTrialWindow) {
    return null;
  }

  return (
    <section
      className={`rounded-[28px] border border-[#72caff]/24 bg-[radial-gradient(circle_at_top_left,rgba(114,202,255,0.18),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(11,20,32,0.84),rgba(6,8,12,0.98))] px-5 py-5 shadow-[0_0_24px_rgba(114,202,255,0.12)] ${className}`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#9fdcff]">
            {trialIsExpired ? 'Trial ended' : 'Trial active'}
          </div>
          <div className="mt-2 text-[26px] font-semibold tracking-[-0.03em] text-[#d9f0ff]">
            {trialIsExpired
              ? 'Your trial has ended'
              : trialTimeLeft
                ? `${trialTimeLeft} left to explore`
                : 'Your 3-day trial is active'}
          </div>
          <div className="mt-2 text-[15px] leading-7 text-white/68">
            {trialIsExpired
              ? 'Choose a plan to keep generating numbers and running premium strategies. Billing handles the card step and Stripe updates your access automatically.'
              : 'Use the product while it is fresh, then upgrade only if the value is clear. This nudge is shown at decision points, not as a repeated interruption.'}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-[12px] uppercase tracking-[0.14em] text-white/48">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">Current tier: {currentTier}</span>
            {trialEndsLabel ? (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">Ends {trialEndsLabel}</span>
            ) : null}
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">AI starts in Starter</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#8ad4ff] to-[#5fbef0] px-5 py-3 text-[14px] font-semibold text-[#03111f] shadow-[0_0_18px_rgba(114,202,255,0.2)]"
          >
            {trialIsExpired ? 'Choose a plan' : 'Compare tiers'}
          </Link>
          <Link
            href="/billing"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-[14px] font-medium text-white/78 transition-colors hover:text-white"
          >
            Open billing
          </Link>
        </div>
      </div>
    </section>
  );
}
