import Link from 'next/link';

const FEATURE_POINTS = [
  'Live draw-aware insight surfaces',
  'Explainable picks and strategy context',
  'Mobile-first dashboard experience',
];

const TRUST_POINTS = [
  'Official source-first data posture',
  'No guaranteed-win claims',
  'Responsible use and onboarding gate',
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,199,66,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(114,202,255,0.08),transparent_30%)]" />
        <div className="pointer-events-none absolute left-[-12rem] top-[-10rem] h-[26rem] w-[26rem] rounded-full bg-[#ffc742]/10 blur-3xl animate-brew-float" />
        <div className="pointer-events-none absolute bottom-[-12rem] right-[-10rem] h-[24rem] w-[24rem] rounded-full bg-[#72caff]/8 blur-3xl animate-brew-drift" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between gap-4 rounded-[24px] border border-white/8 bg-black/20 px-4 py-4 backdrop-blur-sm">
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">BrewVerse Labs</div>
              <div className="mt-1 text-[18px] font-semibold tracking-[-0.03em] text-[#f7ddb3]">BrewLotto</div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/pricing"
                className="hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[14px] text-white/72 transition-colors hover:text-white sm:inline-flex"
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className="rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-5 py-2 text-[14px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.18)]"
              >
                Sign In
              </Link>
            </div>
          </header>

          <section className="grid flex-1 items-center gap-8 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ffc742]/18 bg-[#ffc742]/10 px-3 py-1 text-[12px] uppercase tracking-[0.16em] text-[#ffd988]">
                <span className="h-2 w-2 rounded-full bg-[#ffcb4d] shadow-[0_0_8px_rgba(255,203,77,0.8)] animate-brew-pulse" />
                Smart lottery, premium feel
              </div>
              <h1 className="mt-5 text-[44px] font-semibold tracking-[-0.05em] text-[#fff1d3] sm:text-[56px] lg:text-[70px]">
                Watch BrewLotto come alive.
              </h1>
              <p className="mt-5 max-w-xl text-[17px] leading-8 text-white/68 sm:text-[18px]">
                A premium lottery intelligence experience with a branded video hook, live-looking product energy,
                explainable picks, and a clean path into sign-in and onboarding.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-7 py-3 text-[15px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.2)]"
                >
                  Enter BrewLotto
                </Link>
                <Link
                  href="#video"
                  className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-7 py-3 text-[15px] text-white/80 transition-colors hover:text-white"
                >
                  Watch the CTA
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {FEATURE_POINTS.map((point) => (
                  <div key={point} className="rounded-[18px] border border-white/8 bg-black/20 px-4 py-4 text-[14px] leading-6 text-white/72">
                    {point}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[22px] border border-[#ffc742]/16 bg-[linear-gradient(145deg,rgba(30,20,13,0.78),rgba(8,8,8,0.96))] px-5 py-5">
                <div className="text-[13px] uppercase tracking-[0.18em] text-white/38">Trust posture</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {TRUST_POINTS.map((point) => (
                    <div key={point} className="rounded-[16px] border border-white/8 bg-white/[0.03] px-4 py-4 text-[13px] leading-6 text-white/66">
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div id="video" className="relative">
              <div className="absolute -inset-6 rounded-[34px] bg-[#ffc742]/8 blur-2xl animate-brew-drift" />
              <div className="relative overflow-hidden rounded-[32px] border border-[#ffc742]/24 bg-[linear-gradient(145deg,rgba(28,18,14,0.92),rgba(10,9,9,0.98))] shadow-[0_0_38px_rgba(255,184,28,0.16)]">
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.12)_35%,transparent_50%)] opacity-0 mix-blend-screen animate-brew-shimmer" />
                <div className="px-5 pb-3 pt-5">
                  <div className="text-[13px] uppercase tracking-[0.18em] text-white/38">Autoplay CTA</div>
                  <div className="mt-2 text-[22px] font-semibold text-[#f7ddb3]">BrewLotto preview reel</div>
                </div>
                <video
                  className="block aspect-[9/16] w-full object-cover sm:aspect-[4/5]"
                  src="/landing/brewlotto-cta.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster="/frontend/brew_logo.png"
                />
                <div className="grid gap-3 px-5 py-4 sm:grid-cols-2">
                  <div className="rounded-[18px] border border-white/8 bg-black/20 px-4 py-4">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">Next step</div>
                    <div className="mt-2 text-[15px] text-[#f7ddb3]">Sign in, acknowledge the disclaimer, then continue into the tutorial.</div>
                  </div>
                  <div className="rounded-[18px] border border-white/8 bg-black/20 px-4 py-4">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">Flow</div>
                    <div className="mt-2 text-[15px] text-[#f7ddb3]">Landing → Login → Onboarding → Dashboard</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 pb-6 lg:grid-cols-3">
              <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-5 transition-transform duration-500 hover:-translate-y-1">
                <div className="text-[14px] uppercase tracking-[0.16em] text-white/35">Explainability</div>
                <div className="mt-2 text-[16px] leading-7 text-white/68">
                  The product should feel transparent from the first touch. The landing page is a teaser for the live dashboard, not a fake promise engine.
                </div>
              </div>
            <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-5 transition-transform duration-500 hover:-translate-y-1">
                <div className="text-[14px] uppercase tracking-[0.16em] text-white/35">Onboarding</div>
                <div className="mt-2 text-[16px] leading-7 text-white/68">
                  New users should hit the no-guarantee acknowledgment first, then the tutorial, then the dashboard.
                </div>
              </div>
            <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-5 transition-transform duration-500 hover:-translate-y-1">
                <div className="text-[14px] uppercase tracking-[0.16em] text-white/35">Later</div>
                <div className="mt-2 text-[16px] leading-7 text-white/68">
                  Stripe, pricing, and trial gating can be layered in once the landing/onboarding story is locked.
                </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
