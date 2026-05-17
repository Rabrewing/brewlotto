import Link from 'next/link';

import { DashboardContainer, Header, NavigationTabs } from '@/components/brewlotto/dashboard';

const LEGAL_SECTIONS = [
  {
    title: 'Terms of Use',
    body: 'Eligibility, account rules, no-guarantee language, dispute handling, and NC / CA service scope.',
    href: '/legal/terms',
  },
  {
    title: 'Privacy Policy',
    body: 'Account data, saved picks, play logs, support requests, screenshots, billing state, and AI usage / telemetry.',
    href: '/legal/privacy',
  },
  {
    title: 'California Privacy Notice',
    body: 'California-specific rights, request language, and CPRA supplement references.',
    href: '/legal/privacy/california',
  },
  {
    title: 'AI Usage Disclosure',
    body: 'Generated commentary is advisory only and stays separate from official draw truth.',
    href: '/legal/ai-usage',
  },
  {
    title: 'Internet Property',
    body: 'Brand ownership, content reuse, user upload licensing, and anti-scraping rules.',
    href: '/legal/internet-property',
  },
  {
    title: 'Responsible Play',
    body: 'Entertainment-only framing, limits, and state resources for responsible lottery play.',
    href: '/legal/responsible-play',
  },
];

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DashboardContainer>
        <Header />
        <NavigationTabs />

        <div className="mb-5 mt-2 text-[40px] font-medium tracking-[-0.03em] text-[#f8cf98]">Policy Center</div>

        <section className="rounded-[30px] border border-[#ffc742]/24 bg-[radial-gradient(circle_at_top_left,rgba(255,199,66,0.18),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(30,20,13,0.88),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(255,184,28,0.08)]">
          <div className="text-[15px] uppercase tracking-[0.16em] text-white/38">Legal index</div>
          <div className="mt-3 text-[26px] font-semibold text-[#f7ddb3]">Launch policy set</div>
          <div className="mt-2 max-w-3xl text-[15px] leading-7 text-white/62">
            This hub keeps BrewLotto’s Terms, Privacy, California notice, AI usage, internet property, and responsible-play language in one place while the final launch review is underway.
          </div>
        </section>

        <section className="mt-5 space-y-4">
          {LEGAL_SECTIONS.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="block rounded-[26px] border border-[#ffbd39]/18 bg-[linear-gradient(145deg,rgba(28,18,14,0.78),rgba(10,9,9,0.96))] px-5 py-5 shadow-[0_0_20px_rgba(255,184,28,0.05)] transition-colors hover:border-[#ffc742]/34 hover:bg-[linear-gradient(145deg,rgba(33,22,15,0.88),rgba(12,11,11,0.98))]"
            >
              <div className="text-[20px] font-medium text-[#f7ddb3]">{section.title}</div>
              <div className="mt-3 text-[15px] leading-7 text-white/62">{section.body}</div>
              <div className="mt-3 text-[12px] uppercase tracking-[0.16em] text-[#ffc742]">Open policy</div>
            </Link>
          ))}
          <article className="rounded-[26px] border border-[#72caff]/18 bg-[linear-gradient(145deg,rgba(17,25,34,0.78),rgba(8,10,12,0.96))] px-5 py-5 shadow-[0_0_20px_rgba(114,202,255,0.05)]">
            <div className="text-[20px] font-medium text-[#9edcff]">Policy notes</div>
            <div className="mt-3 text-[15px] leading-7 text-white/62">
              The canonical working draft lives in <span className="text-white/80">brewdocs/v1/legal-policy-pack.md</span>. That file tracks the final document set, the open counsel questions, and the source anchors behind the published text.
              <div className="mt-3">
                <Link href="/support?category=legal&subject=Legal%20policy%20question" className="text-[#9edcff] underline decoration-[#9edcff]/40 underline-offset-4 hover:text-white">
                  Send a legal request through Support
                </Link>
              </div>
            </div>
          </article>
        </section>
      </DashboardContainer>
    </main>
  );
}
