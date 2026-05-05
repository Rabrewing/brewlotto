import Link from 'next/link';
import { TutorialVideoPanel } from '@/components/brewlotto/TutorialVideoPanel';
import { DashboardContainer, Header, NavigationTabs } from '@/components/brewlotto/dashboard';

const LESSONS = [
  {
    title: 'Hot and Cold Numbers',
    summary: 'Hot numbers have appeared more often in recent draws, while cold numbers have appeared less often. Neither guarantees the next result; they are just recent-frequency signals.',
  },
  {
    title: 'Momentum',
    summary: 'Momentum is BrewLotto shorthand for short-term trend acceleration. It highlights numbers or patterns that are picking up recent activity, not a promise of future performance.',
  },
  {
    title: 'Confidence',
    summary: 'Confidence is an internal ranking signal attached to a prediction, based on the strategy blend and current evidence. Higher confidence still does not change the odds of the game.',
  },
  {
    title: 'Why Strategy Variety Matters',
    summary: 'Different strategies emphasize different evidence, such as frequency, momentum, or scoring. Strategy Locker exists so premium users can see which approaches are available and when they were used.',
  },
];

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

const TUTORIAL_VIDEO_SRC =
  process.env.NEXT_PUBLIC_TUTORIAL_VIDEO_URL ||
  'https://qrmbod86z2yiiftp.public.blob.vercel-storage.com/brewlotto-tutorial.mp4';

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DashboardContainer>
        <Header />
        <NavigationTabs />

        <div className="mb-5 mt-2 text-[40px] font-medium tracking-[-0.03em] text-[#f8cf98]">BrewU</div>

        <section id="tutorial" className="mt-1">
          <TutorialVideoPanel
            eyebrow="BrewU Replay"
            title="Tutorial Walkthrough"
            description="This is the same skippable tutorial from onboarding. Replay it anytime to revisit the state, game, generate, and dashboard flow."
            videoSrc={TUTORIAL_VIDEO_SRC}
            poster="/frontend/brew_logo.png"
            captionsSrc="/landing/tutorial/brewlotto-tutorial.vtt"
            transcriptTitle="Read the tutorial transcript"
            transcript={TUTORIAL_TRANSCRIPT}
          >
            <div className="text-[14px] leading-7 text-white/66">
              Need a refresher later? Come back here from BrewU, or jump back to the dashboard when
              you're ready to play.
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-5 py-2.5 text-[14px] font-semibold text-black transition-transform hover:scale-[1.02]"
              >
                Go to dashboard
              </Link>
            </div>
          </TutorialVideoPanel>
        </section>

        <section className="rounded-[30px] border border-[#ffc742]/24 bg-[radial-gradient(circle_at_top_left,rgba(255,199,66,0.18),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(30,20,13,0.88),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(255,184,28,0.08)]">
          <div className="text-[15px] uppercase tracking-[0.16em] text-white/38">BrewUniversity Lite</div>
          <div className="mt-3 text-[26px] font-semibold text-[#f7ddb3]">Short explainers, not a fake LMS</div>
          <div className="mt-2 max-w-3xl text-[15px] leading-7 text-white/62">V1 keeps learning lightweight and connected to real product surfaces. This route explains core Brew concepts and links back into the dashboard, stats, and strategy views where those concepts appear.</div>
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-2">
          {LESSONS.map((lesson) => (
            <article key={lesson.title} className="rounded-[26px] border border-[#ffbd39]/18 bg-[linear-gradient(145deg,rgba(28,18,14,0.78),rgba(10,9,9,0.96))] px-5 py-5 shadow-[0_0_20px_rgba(255,184,28,0.05)]">
              <div className="text-[20px] font-medium text-[#f7ddb3]">{lesson.title}</div>
              <div className="mt-3 text-[15px] leading-7 text-white/62">{lesson.summary}</div>
            </article>
          ))}
        </section>

        <section className="mt-5 rounded-[28px] border border-[#72caff]/18 bg-[linear-gradient(145deg,rgba(19,22,31,0.76),rgba(10,10,12,0.96))] px-6 py-6 shadow-[0_0_20px_rgba(114,202,255,0.05)]">
          <div className="text-[20px] font-medium text-[#d8e6f8]">Where to use this knowledge</div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <Link href="/dashboard" className="rounded-[20px] border border-white/8 bg-black/20 px-4 py-4 text-[15px] text-white/78 transition-colors hover:text-white">Dashboard: live commentary, hot/cold, and momentum context</Link>
            <Link href="/stats" className="rounded-[20px] border border-white/8 bg-black/20 px-4 py-4 text-[15px] text-white/78 transition-colors hover:text-white">Stats: track how outcomes and trends are landing over time</Link>
            <Link href="/strategy-locker" className="rounded-[20px] border border-white/8 bg-black/20 px-4 py-4 text-[15px] text-white/78 transition-colors hover:text-white">Strategy Locker: see which strategies are available at your tier</Link>
          </div>
        </section>

        <section className="mt-5 rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-6">
          <div className="text-[18px] font-medium text-[#f7ddb3]">Support Notes</div>
          <div className="mt-3 text-[15px] leading-7 text-white/62">BrewLotto is built around transparency, not promises. If a term or score is not yet explained inline, use this route as the canonical V1 explainer surface while deeper BrewU APIs remain future work.</div>
        </section>
      </DashboardContainer>
    </main>
  );
}
