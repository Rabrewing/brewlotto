import Link from 'next/link';
import { TutorialVideoPanel } from '@/components/brewlotto/TutorialVideoPanel';
import { DashboardContainer, Header, NavigationTabs } from '@/components/brewlotto/dashboard';
import { BREWU_PLAY_STYLE_GUIDES } from '@/lib/brewwu/playStyleMatrix';
import { BREWU_PAYOUT_GUIDES } from '@/lib/brewwu/payoutMatrix';
import { BREWU_PRIZE_TABLES } from '@/lib/brewwu/prizeTableMatrix';

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

const COVERAGE_OVERVIEW = [
  {
    label: 'Play-style guides',
    value: BREWU_PLAY_STYLE_GUIDES.length,
    note: 'NC, CA, and multi-state play options',
  },
  {
    label: 'Payout ladders',
    value: BREWU_PAYOUT_GUIDES.length,
    note: 'Prize-shape guidance by game family',
  },
  {
    label: 'Game families',
    value: 5,
    note: 'Pick 3, Pick 4, Cash 5, Powerball, Mega Millions',
  },
  {
    label: 'Systems links',
    value: 4,
    note: 'BrewU, Support, Terms & Privacy, Logout',
  },
];

const FIREBALL_GUIDE = [
  {
    label: 'Where it matters',
    summary:
      'Fireball is an NC-only modifier for Pick 3 and Pick 4. BrewLotto tracks it in Results, My Picks, Strategy Locker, Stats, and BrewCommand so the play history stays accurate.',
  },
  {
    label: 'What it changes',
    summary:
      'Fireball changes settlement classification and confirmed-play ratios for the draw it was actually played on. It does not change hot/cold or momentum, which stay draw-trend only.',
  },
  {
    label: 'What it does not change',
    summary:
      'Fireball is not a separate strategy meter and it does not guarantee a better result. If the user did not confirm that play on the winning draw date, it should not count as a win.',
  },
];

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DashboardContainer>
        <Header />
        <NavigationTabs />

        <div className="mb-5 mt-2 text-[40px] font-medium tracking-[-0.03em] text-[#f8cf98]">BrewU</div>

        <section className="rounded-[30px] border border-[#ffc742]/24 bg-[radial-gradient(circle_at_top_left,rgba(255,199,66,0.16),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(30,20,13,0.9),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(255,184,28,0.08)]">
          <div className="text-[15px] uppercase tracking-[0.16em] text-white/38">Intelligence Center</div>
          <div className="mt-3 text-[26px] font-semibold text-[#f7ddb3]">Master the strategies behind every pick</div>
          <div className="mt-2 max-w-3xl text-[15px] leading-7 text-white/62">
            BrewU stays tied to the live app, not a fake LMS. The pages below explain real play
            styles, payout shapes, and where each concept shows up inside BrewLotto.
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {COVERAGE_OVERVIEW.map((item) => (
              <div key={item.label} className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4">
                <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">{item.label}</div>
                <div className="mt-3 text-[28px] font-semibold text-[#ddf7e2]">{item.value}</div>
                <div className="mt-2 text-[13px] leading-6 text-white/52">{item.note}</div>
              </div>
            ))}
          </div>
        </section>

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
            defaultExpanded
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

        <section className="mt-5 rounded-[30px] border border-[#ffc742]/24 bg-[radial-gradient(circle_at_top_left,rgba(255,199,66,0.18),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(30,20,13,0.88),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(255,184,28,0.08)]">
          <div className="text-[15px] uppercase tracking-[0.16em] text-white/38">BrewUniversity Lite</div>
          <div className="mt-3 text-[26px] font-semibold text-[#f7ddb3]">Short explainers, not a fake LMS</div>
          <div className="mt-2 max-w-3xl text-[15px] leading-7 text-white/62">
            V1 keeps learning lightweight and connected to real product surfaces. This route
            explains core Brew concepts and links back into the dashboard, stats, and strategy
            views where those concepts appear.
          </div>
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-2">
          {LESSONS.map((lesson) => (
            <article key={lesson.title} className="rounded-[26px] border border-[#ffbd39]/18 bg-[linear-gradient(145deg,rgba(28,18,14,0.78),rgba(10,9,9,0.96))] px-5 py-5 shadow-[0_0_20px_rgba(255,184,28,0.05)]">
              <div className="text-[20px] font-medium text-[#f7ddb3]">{lesson.title}</div>
              <div className="mt-3 text-[15px] leading-7 text-white/62">{lesson.summary}</div>
            </article>
          ))}
        </section>

        <section className="mt-5 rounded-[30px] border border-[#53d48a]/18 bg-[radial-gradient(circle_at_top_left,rgba(83,212,138,0.14),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(16,26,18,0.88),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(83,212,138,0.08)]">
          <div className="text-[15px] uppercase tracking-[0.16em] text-white/38">Play styles by game</div>
          <div className="mt-3 text-[26px] font-semibold text-[#ddf7e2]">Teach the game before the bet</div>
          <div className="mt-2 max-w-3xl text-[15px] leading-7 text-white/62">
            This section turns the official game rules into plain-English guidance so BrewLotto
            can show customers what straight, box, straight/box, 50/50, combo, or add-on play
            actually means for the game they are viewing.
          </div>
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {BREWU_PLAY_STYLE_GUIDES.map((guide) => (
              <article
                key={guide.title}
                className="rounded-[24px] border border-white/8 bg-black/20 px-5 py-5 shadow-[0_0_18px_rgba(83,212,138,0.04)]"
              >
                <div className="text-[12px] uppercase tracking-[0.16em] text-[#93efb8]">{guide.label}</div>
                <div className="mt-2 text-[21px] font-semibold text-white">{guide.title}</div>
                <div className="mt-3 text-[13px] uppercase tracking-[0.16em] text-white/42">{guide.odds}</div>
                <div className="mt-3 text-[15px] leading-7 text-white/66">{guide.summary}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {guide.playStyles.map((style) => (
                    <div
                      key={`${guide.id}-${style.name}`}
                      className="rounded-full border border-[#93efb8]/18 bg-[#0f1912] px-3 py-1.5 text-[12px] text-[#d9f7e5]"
                    >
                      <span className="font-medium text-white">{style.name}</span>
                      {style.odds ? <span className="ml-2 text-white/55">{style.odds}</span> : null}
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-[18px] border border-[#53d48a]/18 bg-[#102117] px-4 py-4 text-[14px] leading-7 text-[#c8f4d8]">
                  <span className="font-semibold text-white">Brew AI help: </span>
                  {guide.aiHint}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-[30px] border border-[#72caff]/18 bg-[radial-gradient(circle_at_top_left,rgba(114,202,255,0.14),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(13,20,28,0.9),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(114,202,255,0.06)]">
          <div className="text-[15px] uppercase tracking-[0.16em] text-white/38">Fireball clarity</div>
          <div className="mt-3 text-[26px] font-semibold text-[#d7ecff]">Only NC Pick 3 / Pick 4 uses Fireball</div>
          <div className="mt-2 max-w-3xl text-[15px] leading-7 text-white/62">
            Fireball is a play modifier, not a trend signal. BrewLotto keeps it tied to the actual
            draw date so Results, My Picks, Strategy Locker, Stats, and BrewCommand stay aligned
            with the ticket rules.
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {FIREBALL_GUIDE.map((item) => (
              <div key={item.label} className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4">
                <div className="text-[12px] uppercase tracking-[0.16em] text-[#9edcff]">{item.label}</div>
                <div className="mt-3 text-[14px] leading-7 text-white/68">{item.summary}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-[30px] border border-[#f7b84d]/18 bg-[radial-gradient(circle_at_top_left,rgba(247,184,77,0.14),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(28,20,12,0.92),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(247,184,77,0.08)]">
          <div className="text-[15px] uppercase tracking-[0.16em] text-white/38">Payout ladders by game</div>
          <div className="mt-3 text-[26px] font-semibold text-[#f7ddb3]">Show the prize shape, not hype</div>
          <div className="mt-2 max-w-3xl text-[15px] leading-7 text-white/62">
            This section gives BrewLotto a single place to explain how a play style maps to the
            game&apos;s prize ladder so customers can see the difference between a precision play,
            a coverage play, and a standard number-match game.
          </div>
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {BREWU_PAYOUT_GUIDES.map((guide) => (
              <article
                key={guide.title}
                className="rounded-[24px] border border-white/8 bg-black/20 px-5 py-5 shadow-[0_0_18px_rgba(247,184,77,0.04)]"
              >
                <div className="text-[12px] uppercase tracking-[0.16em] text-[#f5cf84]">{guide.label}</div>
                <div className="mt-2 text-[21px] font-semibold text-white">{guide.title}</div>
                <div className="mt-3 text-[15px] leading-7 text-white/66">{guide.summary}</div>
                <div className="mt-4 space-y-2">
                  {guide.tiers.map((tier) => (
                    <div
                      key={`${guide.id}-${tier.name}`}
                      className="rounded-[18px] border border-[#f5cf84]/12 bg-[#171208] px-4 py-3 text-[13px] leading-6 text-[#f1dfc0]"
                    >
                      <div className="font-semibold text-white">{tier.name}</div>
                      <div className="text-white/54">{tier.odds || 'Odds vary by style and state'}</div>
                      <div className="mt-1 text-white/72">{tier.note}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-[18px] border border-[#f5cf84]/14 bg-[#24190b] px-4 py-4 text-[14px] leading-7 text-[#f6e2bc]">
                  <span className="font-semibold text-white">Brew AI help: </span>
                  {guide.aiHint}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-[30px] border border-[#ffb84d]/18 bg-[radial-gradient(circle_at_top_left,rgba(255,184,77,0.14),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(28,20,12,0.92),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(255,184,77,0.08)]">
          <div className="text-[15px] uppercase tracking-[0.16em] text-white/38">Data Freshness</div>
          <div className="mt-3 text-[26px] font-semibold text-[#f7ddb3]">Official results can be delayed — BrewLotto adapts</div>
          <div className="mt-2 max-w-3xl text-[15px] leading-7 text-white/62">
            Draw data is ingested shortly after each official lottery posting. On rare occasions, the
            official source may post results later than expected. BrewLotto&apos;s ingestion pipeline
            retries automatically and continues checking until fresh data arrives.
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4">
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#93efb8]">Healthy</div>
              <div className="mt-2 text-[14px] leading-7 text-white/68">
                Green dot. Draw data is current and within the expected posting window. All stats,
                predictions, and results reflect the latest official draw.
              </div>
            </div>
            <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4">
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#f5cf84]">Delayed</div>
              <div className="mt-2 text-[14px] leading-7 text-white/68">
                Amber dot. The next draw has not been posted yet but is within the expected grace
                period. Existing data is still displayed while Brew waits for the next result.
              </div>
            </div>
            <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4">
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#ffb5a8]">Stale</div>
              <div className="mt-2 text-[14px] leading-7 text-white/68">
                Red dot. Draw data has not been updated beyond the expected window. Live stats and
                predictions are paused until the official source publishes the next result.
              </div>
            </div>
          </div>
          <div className="mt-5 rounded-[22px] border border-[#ffb84d]/14 bg-[#1a140c] px-5 py-4 text-[14px] leading-7 text-[#f6e2bc]">
            <span className="font-semibold text-white">LiveTrustBadge: </span>
            Every results page and dashboard shows a compact badge with the current freshness
            status, the latest draw date, and a short disclaimer. If data is stale, the app will
            state it clearly and resume normal operation as soon as the next draw is ingested.
          </div>
        </section>

        <section className="mt-5 rounded-[28px] border border-[#72caff]/18 bg-[linear-gradient(145deg,rgba(19,22,31,0.76),rgba(10,10,12,0.96))] px-6 py-6 shadow-[0_0_20px_rgba(114,202,255,0.05)]">
          <div className="text-[20px] font-medium text-[#d8e6f8]">How Brew AI helps without overpromising</div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <div className="rounded-[20px] border border-white/8 bg-black/20 px-4 py-4 text-[15px] text-white/78">
              Explain the play style in plain English before the user picks anything.
            </div>
            <div className="rounded-[20px] border border-white/8 bg-black/20 px-4 py-4 text-[15px] text-white/78">
              Compare straight, box, straight/box, combo, and add-ons so users understand the tradeoffs.
            </div>
            <div className="rounded-[20px] border border-white/8 bg-black/20 px-4 py-4 text-[15px] text-white/78">
              Keep the guidance educational. No strategy beats randomness or guarantees a win.
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[30px] border border-[#72caff]/18 bg-[radial-gradient(circle_at_top_left,rgba(114,202,255,0.14),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(13,20,28,0.9),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(114,202,255,0.06)]">
          <div className="text-[15px] uppercase tracking-[0.16em] text-white/38">Prize tables</div>
          <div className="mt-3 text-[26px] font-semibold text-[#d7ecff]">Show the official payout shape</div>
          <div className="mt-2 max-w-3xl text-[15px] leading-7 text-white/62">
            Fixed ladders can be shown directly. CA pari-mutuel games should stay labeled as
            draw-specific certified values so no one confuses an example payout with a guarantee.
          </div>
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {BREWU_PRIZE_TABLES.map((guide) => (
              <article
                key={guide.title}
                className="rounded-[24px] border border-white/8 bg-black/20 px-5 py-5 shadow-[0_0_18px_rgba(114,202,255,0.04)]"
              >
                <div className="text-[12px] uppercase tracking-[0.16em] text-[#9edcff]">{guide.label}</div>
                <div className="mt-2 text-[21px] font-semibold text-white">{guide.title}</div>
                <div className="mt-3 text-[15px] leading-7 text-white/66">{guide.summary}</div>
                <div className="mt-4 space-y-2">
                  {guide.rows.map((row) => (
                    <div
                      key={`${guide.id}-${row.label}`}
                      className="rounded-[18px] border border-[#72caff]/14 bg-[#101922] px-4 py-3 text-[13px] leading-6 text-[#d7ecff]"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <div className="font-semibold text-white">{row.label}</div>
                        <div className="text-white/78">{row.value}</div>
                      </div>
                      {row.note ? <div className="mt-1 text-white/54">{row.note}</div> : null}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-[13px] leading-6 text-white/44">Source: {guide.source}</div>
              </article>
            ))}
          </div>
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
          <div className="text-[18px] font-medium text-[#f7ddb3]">Systems</div>
          <div className="mt-3 text-[15px] leading-7 text-white/62">
            BrewU keeps product learning and system access in one place. Use this area to replay the tutorial, reach support, review policies, or sign out.
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Link href="/learn" className="rounded-[18px] border border-[#ffc742]/20 bg-[#ffc742]/10 px-4 py-4 transition-colors hover:border-[#ffc742]/35 hover:bg-[#ffc742]/14">
              <div className="text-[16px] font-medium text-[#f7ddb3]">BrewU</div>
              <div className="mt-2 text-[14px] leading-7 text-white/60">Tutorial replay and explainers.</div>
            </Link>
            <Link href="/support" className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-4 transition-colors hover:border-[#ffc742]/20 hover:bg-[#ffc742]/8">
              <div className="text-[16px] font-medium text-[#f7ddb3]">Support</div>
              <div className="mt-2 text-[14px] leading-7 text-white/60">Report an issue and notify BrewCommand.</div>
            </Link>
            <Link href="/legal" className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-4 transition-colors hover:border-[#ffc742]/20 hover:bg-[#ffc742]/8">
              <div className="text-[16px] font-medium text-[#f7ddb3]">Terms &amp; Privacy</div>
              <div className="mt-2 text-[14px] leading-7 text-white/60">Policies and responsible-use notes.</div>
            </Link>
            <Link href="/logout" className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-4 transition-colors hover:border-[#ffc742]/20 hover:bg-[#ffc742]/8">
              <div className="text-[16px] font-medium text-[#f7ddb3]">Logout</div>
              <div className="mt-2 text-[14px] leading-7 text-white/60">Sign out of the current session.</div>
            </Link>
          </div>
        </section>
      </DashboardContainer>
    </main>
  );
}
