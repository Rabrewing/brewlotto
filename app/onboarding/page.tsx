'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browserClient';

const TUTORIAL_SLIDES = [
  {
    title: 'Welcome to BrewLotto',
    body: 'Smart picks, sharper odds. Choose a game, generate predictions, and track results against official lottery draws.',
  },
  {
    title: 'Pick a Game',
    body: 'Select from Pick 3, Pick 4, Cash 5, Powerball, or Mega Millions. Each game has unique odds and draw schedules.',
  },
  {
    title: 'Generate a Pick',
    body: 'Brew analyzes historical draws using multiple strategies — Poisson, Momentum, Markov, and Ensemble — to generate explainable predictions.',
  },
  {
    title: 'Track & Learn',
    body: 'Save your picks, compare against official results, and learn from BrewU lessons to improve your strategy over time.',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
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
      // Check if already onboarded
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
    await supabase.from('user_preferences').upsert({
      user_id: userId,
      disclaimer_acknowledged: true,
      acknowledged_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
    setSaving(false);
    setStep(2);
  }

  async function completeOnboarding() {
    if (!userId) return;
    setSaving(true);
    await supabase.from('user_preferences').upsert({
      user_id: userId,
      onboarding_completed: true,
    }, { onConflict: 'user_id' });
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
      <div className="w-full max-w-md">
        {/* Step indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className={`h-2 w-2 rounded-full ${step >= 1 ? 'bg-[#ffc742]' : 'bg-white/20'}`} />
          <div className={`h-[1px] w-8 ${step >= 2 ? 'bg-[#ffc742]/50' : 'bg-white/10'}`} />
          <div className={`h-2 w-2 rounded-full ${step >= 2 ? 'bg-[#ffc742]' : 'bg-white/20'}`} />
        </div>

        {step < 2 && (
          <div className="rounded-[28px] border border-[#ffbd39]/22 bg-[linear-gradient(145deg,rgba(32,19,13,0.82),rgba(13,10,10,0.96))] px-6 py-8 shadow-[0_0_22px_rgba(255,184,28,0.08)]">
            <div className="text-center text-[22px] font-medium text-[#f7d6ab]">
              Before You Start
            </div>

            <div className="mt-6 rounded-[16px] border border-[#ff7d67]/20 bg-[#2a1311]/60 px-4 py-4 text-[14px] leading-6 text-[#ffcdc6]">
              <div className="mb-2 flex items-start gap-2 text-[15px] font-semibold text-[#ffb5a8]">
                <span>⚠</span>
                <span>No Guarantee, No Hype</span>
              </div>
              <p>
                BrewLotto provides statistical analysis, prediction commentary, and educational
                context. It does <strong>not</strong> guarantee wins, improve the odds, or
                replace the randomness of lottery outcomes. Every game involves financial risk,
                and no strategy, tier, or model can overcome the house edge. Use BrewLotto as a
                decision aid, not as a promise of results.
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
                I understand that BrewLotto is informational only, does not guarantee results,
                and that all lottery play involves financial risk. I will play responsibly.
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
        )}

        {step >= 2 && (
          <div className="rounded-[28px] border border-[#ffbd39]/22 bg-[linear-gradient(145deg,rgba(32,19,13,0.82),rgba(13,10,10,0.96))] px-6 py-8 shadow-[0_0_22px_rgba(255,184,28,0.08)]">
            <div className="text-center text-[22px] font-medium text-[#f7d6ab]">
              {slideIndex < TUTORIAL_SLIDES.length ? TUTORIAL_SLIDES[slideIndex].title : 'Ready!'}
            </div>

            {slideIndex < TUTORIAL_SLIDES.length && (
              <>
                <p className="mt-4 text-center text-[15px] leading-6 text-white/70">
                  {TUTORIAL_SLIDES[slideIndex].body}
                </p>

                <div className="mt-6 flex justify-center gap-2">
                  {TUTORIAL_SLIDES.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-1.5 rounded-full ${
                        i === slideIndex ? 'bg-[#ffc742]' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>

                <div className="mt-8 flex gap-3">
                  {slideIndex < TUTORIAL_SLIDES.length - 1 ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setSlideIndex((i) => Math.min(i + 1, TUTORIAL_SLIDES.length - 1))}
                        className="flex-1 rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-6 py-3 text-[15px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.22)] transition-all hover:scale-[1.02]"
                      >
                        Next
                      </button>
                      <button
                        type="button"
                        onClick={completeOnboarding}
                        className="rounded-full border border-white/10 px-5 py-3 text-[13px] text-white/50 transition-colors hover:border-white/20 hover:text-white/80"
                        disabled={saving}
                      >
                        Skip
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={completeOnboarding}
                      disabled={saving}
                      className="w-full rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-6 py-3 text-[15px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.22)] transition-all hover:scale-[1.02] disabled:opacity-40"
                    >
                      {saving ? 'Loading...' : 'Done — Start Playing'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
