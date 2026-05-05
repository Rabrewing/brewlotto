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

  if (!isTrial || !trialEndsAt) {
    return null;
  }

  return (
    <section
      className={`rounded-[28px] border border-[#ffc742]/22 bg-[radial-gradient(circle_at_top_left,rgba(255,199,66,0.16),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(30,20,13,0.82),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(255,184,28,0.08)] ${className}`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="text-[12px] uppercase tracking-[0.18em] text-[#ffd986]">Trial active</div>
          <div className="mt-2 text-[26px] font-semibold tracking-[-0.03em] text-[#f7ddb3]">
            {trialTimeLeft ? `${trialTimeLeft} left to explore` : 'Your 3-day trial is active'}
          </div>
          <div className="mt-2 text-[15px] leading-7 text-white/68">
            Use the product while it is fresh, then upgrade only if the value is clear. This nudge is shown at
            decision points, not as a repeated interruption.
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
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-5 py-3 text-[14px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.18)]"
          >
            Compare tiers
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
