import Link from 'next/link';
import type { ReactNode } from 'react';

import { DashboardContainer, Header, NavigationTabs } from '@/components/brewlotto/dashboard';

interface LegalPageSection {
  title: string;
  body: string;
  bullets?: string[];
}

interface LegalContentPageProps {
  title: string;
  eyebrow: string;
  summary: string;
  sections: LegalPageSection[];
  footerNote?: ReactNode;
  supportSubject?: string;
}

export function LegalContentPage({
  title,
  eyebrow,
  summary,
  sections,
  footerNote,
  supportSubject,
}: LegalContentPageProps) {
  const supportHref = supportSubject
    ? `/support?category=legal&subject=${encodeURIComponent(supportSubject)}`
    : '/support?category=legal';

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DashboardContainer>
        <Header />
        <NavigationTabs />

        <div className="mb-5 mt-2 text-[40px] font-medium tracking-[-0.03em] text-[#f8cf98]">
          {title}
        </div>

        <section className="rounded-[30px] border border-[#ffc742]/24 bg-[radial-gradient(circle_at_top_left,rgba(255,199,66,0.18),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(30,20,13,0.88),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(255,184,28,0.08)]">
          <div className="text-[15px] uppercase tracking-[0.16em] text-white/38">{eyebrow}</div>
          <div className="mt-3 text-[26px] font-semibold text-[#f7ddb3]">{summary}</div>
          <div className="mt-2 max-w-3xl text-[15px] leading-7 text-white/62">
            These pages are the working policy drafts for BrewLotto V1. They are written so the live app has a clear legal backbone for NC / CA support, AI usage, and user data handling.
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={supportHref}
              className="rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-5 py-2.5 text-[14px] font-semibold text-black transition-transform hover:scale-[1.02]"
            >
              Ask a legal question
            </Link>
            <Link
              href="/legal"
              className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-[14px] font-medium text-white/72 transition-colors hover:text-white"
            >
              Back to legal index
            </Link>
          </div>
        </section>

        <section className="mt-5 space-y-4">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-[26px] border border-[#ffbd39]/18 bg-[linear-gradient(145deg,rgba(28,18,14,0.78),rgba(10,9,9,0.96))] px-5 py-5 shadow-[0_0_20px_rgba(255,184,28,0.05)]"
            >
              <div className="text-[20px] font-medium text-[#f7ddb3]">
                {section.title}
              </div>
              <div className="mt-3 text-[15px] leading-7 text-white/62">
                {section.body}
              </div>
              {section.bullets?.length ? (
                <ul className="mt-4 space-y-2 text-[14px] leading-6 text-white/66">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffc742]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </section>

        {footerNote ? (
          <section className="mt-5 rounded-[24px] border border-[#72caff]/18 bg-[#101922] px-5 py-4 text-[14px] leading-7 text-white/68">
            {footerNote}
          </section>
        ) : null}
      </DashboardContainer>
    </main>
  );
}
