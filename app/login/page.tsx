'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase/browserClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Magic link sent. Check your email and open it on the same device if possible.' });
    }

    setSubmitting(false);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 rounded-[24px] border border-white/8 bg-black/20 px-4 py-4 backdrop-blur-sm">
          <div>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-left"
            >
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">BrewVerse Labs</div>
              <div className="mt-1 text-[18px] font-semibold tracking-[-0.03em] text-[#f7ddb3]">BrewLotto</div>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[14px] text-white/72 transition-colors hover:text-white sm:inline-flex"
            >
              Pricing
            </Link>
            <Link
              href="/"
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[14px] text-white/72 transition-colors hover:text-white"
            >
              Home
            </Link>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-8 py-6 lg:grid-cols-[0.95fr_1.05fr] lg:py-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ffc742]/18 bg-[#ffc742]/10 px-3 py-1 text-[12px] uppercase tracking-[0.16em] text-[#ffd988]">
              <span className="h-2 w-2 rounded-full bg-[#ffcb4d] shadow-[0_0_8px_rgba(255,203,77,0.8)] animate-brew-pulse" />
              Secure magic link sign-in
            </div>
            <h1 className="mt-5 text-[44px] font-semibold tracking-[-0.05em] text-[#fff1d3] sm:text-[56px] lg:text-[68px]">
              Sign in to BrewLotto.
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-8 text-white/68 sm:text-[18px]">
              The app starts with a premium landing page, then moves into magic-link sign-in, onboarding,
              and finally the dashboard. Keep the same device open for the cleanest auth flow.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[18px] border border-white/8 bg-black/20 px-4 py-4 text-[14px] leading-6 text-white/72">
                Same-device magic links reduce auth friction.
              </div>
              <div className="rounded-[18px] border border-white/8 bg-black/20 px-4 py-4 text-[14px] leading-6 text-white/72">
                Onboarding stays focused on the legal acknowledgment.
              </div>
              <div className="rounded-[18px] border border-white/8 bg-black/20 px-4 py-4 text-[14px] leading-6 text-white/72">
                Dashboard access opens after the tutorial gate.
              </div>
            </div>

            <div className="mt-6 rounded-[22px] border border-[#ffc742]/16 bg-[linear-gradient(145deg,rgba(30,20,13,0.78),rgba(8,8,8,0.96))] px-5 py-5">
              <div className="text-[13px] uppercase tracking-[0.18em] text-white/38">Flow</div>
              <div className="mt-3 text-[15px] leading-7 text-white/68">
                Landing → Login → Onboarding acknowledgment → Tutorial → Dashboard
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[34px] bg-[#ffc742]/8 blur-2xl animate-brew-drift" />
            <div className="relative overflow-hidden rounded-[32px] border border-[#ffc742]/24 bg-[linear-gradient(145deg,rgba(28,18,14,0.92),rgba(10,9,9,0.98))] shadow-[0_0_38px_rgba(255,184,28,0.16)]">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.12)_35%,transparent_50%)] opacity-0 mix-blend-screen animate-brew-shimmer" />
              <div className="px-5 pb-3 pt-5">
                <div className="text-[13px] uppercase tracking-[0.18em] text-white/38">Auth entry</div>
                <div className="mt-2 text-[22px] font-semibold text-[#f7ddb3]">Magic link sign-in</div>
              </div>

              <video
                className="block aspect-[9/10] w-full object-cover"
                src="/landing/brewlotto-cta.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="/frontend/brew_logo.png"
              />

              <form onSubmit={handleLogin} className="space-y-4 px-5 py-5">
                <label className="block">
                  <div className="mb-2 text-[12px] uppercase tracking-[0.16em] text-white/35">Email address</div>
                  <input
                    type="email"
                    placeholder="you@brewlotto.ai"
                    className="w-full rounded-[18px] border border-white/10 bg-[#0d0b0b] px-4 py-3 text-[15px] text-white outline-none placeholder:text-white/28"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-5 py-3 text-[15px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Sending...' : 'Send Magic Link'}
                </button>

                <div className="rounded-[18px] border border-white/8 bg-black/20 px-4 py-4 text-[14px] leading-7 text-white/62">
                  We use magic link email to keep account creation simple. The next screen is the onboarding gate
                  with the no-guarantee acknowledgment.
                </div>

                {message ? (
                  <p className={`rounded-[16px] px-4 py-3 text-[14px] ${message.type === 'error' ? 'border border-[#ff8d7b]/25 bg-[#2a120d]/60 text-[#ffc4b8]' : 'border border-[#ffc742]/20 bg-[#2a2110]/60 text-[#ffd988]'}`}>
                    {message.text}
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
