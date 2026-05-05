'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { TutorialVideoPanel } from '@/components/brewlotto/TutorialVideoPanel';
import { supabase } from '@/lib/supabase/browserClient';

const TUTORIAL_TRANSCRIPT = [
  "Welcome to BrewLotto. I'm your guide, and I'll keep this simple.",
  'First, choose the state you play in.',
  'Then pick your game.',
  'Tap Generate Numbers to get explainable strategy support behind every pick.',
  'Save it, review it, and track how it performs over time.',
  'And when you land on the dashboard, this is your home base.',
  'Your latest picks and results are here.',
  'Your stats and performance live here.',
  'And Strategy Locker is where the deeper tools sit.',
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);

      supabase
        .from('user_preferences')
        .select('onboarding_completed, disclaimer_acknowledged')
        .eq('user_id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.onboarding_completed) {
            router.push('/dashboard');
            return;
          }

          if (data?.disclaimer_acknowledged) {
            setStep(2);
            setAcknowledged(true);
          }

          setLoading(false);
        });
    });
  }, [router]);

  async function handleAcknowledge() {
    if (!userId) return;

    setSaving(true);
    await supabase.from('user_preferences').upsert(
      {
        user_id: userId,
        disclaimer_acknowledged: true,
        acknowledged_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );
    setSaving(false);
    setStep(2);
  }

  async function completeOnboarding() {
    if (!userId) return;

    setSaving(true);
    await supabase.from('user_preferences').upsert(
      {
        user_id: userId,
        onboarding_completed: true,
      },
      { onConflict: 'user_id' },
    );

    if (typeof document !== 'undefined') {
      document.cookie = 'brewlotto_onboarded=1; Path=/; Max-Age=31536000; SameSite=Lax';
    }

    setSaving(false);
    router.push('/dashboard');
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white/50">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] px-6 text-white">
      <div className="w-full max-w-3xl">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className={`h-2 w-2 rounded-full ${step >= 1 ? 'bg-[#ffc742]' : 'bg-white/20'}`} />
          <div className={`h-[1px] w-8 ${step >= 2 ? 'bg-[#ffc742]/50' : 'bg-white/10'}`} />
          <div className={`h-2 w-2 rounded-full ${step >= 2 ? 'bg-[#ffc742]' : 'bg-white/20'}`} />
        </div>

        {step < 2 ? (
          <div className="rounded-[28px] border border-[#ffbd39]/22 bg-[linear-gradient(145deg,rgba(32,19,13,0.82),rgba(13,10,10,0.96))] px-6 py-8 shadow-[0_0_22px_rgba(255,184,28,0.08)]">
            <div className="text-center text-[22px] font-medium text-[#f7d6ab]">Before You Start</div>

            <div className="mt-6 rounded-[16px] border border-[#ff7d67]/20 bg-[#2a1311]/60 px-4 py-4 text-[14px] leading-6 text-[#ffcdc6]">
              <div className="mb-2 flex items-start gap-2 text-[15px] font-semibold text-[#ffb5a8]">
                <span>⚠</span>
                <span>No Guarantee, No Hype</span>
              </div>
              <p>
                BrewLotto provides statistical analysis, prediction commentary, and educational
                context. It does <strong>not</strong> guarantee wins, improve the odds, or replace
                the randomness of lottery outcomes. Every game involves financial risk, and no
                strategy, tier, or model can overcome the house edge. Use BrewLotto as a decision
                aid, not as a promise of results.
              </p>
            </div>

            <label className="mt-5 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-[#ffc742] focus:ring-[#ffc742]"
              />
              <span className="text-[13px] leading-5 text-white/70">
                I understand that BrewLotto is informational only, does not guarantee results, and
                that all lottery play involves financial risk. I will play responsibly.
              </span>
            </label>

            <button
              type="button"
              disabled={!acknowledged || saving}
              onClick={handleAcknowledge}
              className="mt-6 w-full rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-6 py-3 text-[15px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.22)] transition-all hover:scale-[1.02] disabled:opacity-40"
            >
              {saving ? 'Saving...' : 'I Understand, Continue'}
            </button>
          </div>
        ) : (
          <div className="rounded-[28px] border border-[#ffbd39]/22 bg-[linear-gradient(145deg,rgba(32,19,13,0.82),rgba(13,10,10,0.96))] px-6 py-8 shadow-[0_0_22px_rgba(255,184,28,0.08)]">
            <div className="mb-3 text-center text-[22px] font-medium text-[#f7d6ab]">
              Tutorial, then you're in
            </div>
            <div className="mx-auto max-w-2xl text-center text-[15px] leading-7 text-white/68">
              Watch the walkthrough now or skip straight into the app. You can replay this tutorial
              later in BrewU whenever you want a refresher.
            </div>

            <div className="mt-6">
              <TutorialVideoPanel
                eyebrow="Step 2 of 2"
                title="Quick BrewLotto Tour"
                description="See how to choose your home state, pick a game, generate numbers, and land on the dashboard without getting lost."
                videoSrc="/landing/tutorial/brewlotto-tutorial.mp4"
                poster="/frontend/brew_logo.png"
                captionsSrc="/landing/tutorial/brewlotto-tutorial.vtt"
                transcriptTitle="Read the tutorial transcript"
                transcript={TUTORIAL_TRANSCRIPT}
              >
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={completeOnboarding}
                    disabled={saving}
                    className="w-full rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-6 py-3 text-[15px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.22)] transition-all hover:scale-[1.02] disabled:opacity-40"
                  >
                    {saving ? 'Loading...' : 'Skip tutorial, start playing'}
                  </button>
                  <Link
                    href="/learn#tutorial"
                    className="flex w-full items-center justify-center rounded-full border border-white/12 px-6 py-3 text-[14px] text-white/76 transition-colors hover:border-white/20 hover:text-white"
                  >
                    Replay in BrewU
                  </Link>
                </div>
              </TutorialVideoPanel>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
