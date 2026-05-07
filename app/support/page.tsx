'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { DashboardContainer, Header, NavigationTabs, SectionCard } from '@/components/brewlotto/dashboard';
import { supabase } from '@/lib/supabase/browserClient';

type SupportCategory =
  | 'dashboard'
  | 'my-picks'
  | 'results'
  | 'stats'
  | 'strategy-locker'
  | 'billing'
  | 'notifications'
  | 'learn'
  | 'legal'
  | 'login'
  | 'settings'
  | 'other';

const SUPPORT_CATEGORIES: Array<{ value: SupportCategory; label: string; description: string }> = [
  { value: 'dashboard', label: 'Dashboard', description: 'Prediction cards, commentary, and home flow' },
  { value: 'my-picks', label: 'My Picks', description: 'Saved picks, logs, and replay issues' },
  { value: 'results', label: 'Results', description: 'Recent draws, comparisons, and recap cards' },
  { value: 'stats', label: 'Stats & Performance', description: 'Hot/cold, momentum, and history views' },
  { value: 'strategy-locker', label: 'Strategy Locker', description: 'Saved strategies, tier gating, and run preview' },
  { value: 'billing', label: 'Billing', description: 'Pricing, checkout, entitlements, and upgrades' },
  { value: 'notifications', label: 'Notifications', description: 'Delivery preferences and inbox flow' },
  { value: 'learn', label: 'BrewU', description: 'Tutorials, explainers, and systems links' },
  { value: 'legal', label: 'Terms & Privacy', description: 'Policies, responsible use, and trust text' },
  { value: 'login', label: 'Login / Auth', description: 'Magic link, callback, or access errors' },
  { value: 'settings', label: 'Settings', description: 'Theme, defaults, and profile preferences' },
  { value: 'other', label: 'Other', description: 'Something else that needs BrewCommand attention' },
];

const MAX_SCREENSHOTS = 3;

export default function SupportPage() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [formState, setFormState] = useState({
    category: 'dashboard' as SupportCategory,
    subject: '',
    page: '/support',
  });

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!cancelled) {
          setUserEmail(user?.email || '');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadUser();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedCategory = useMemo(
    () => SUPPORT_CATEGORIES.find((entry) => entry.value === formState.category) || SUPPORT_CATEGORIES[0],
    [formState.category],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setStatus(null);

    try {
      const form = new FormData(event.currentTarget);
      const response = await fetch('/api/support/submit', {
        method: 'POST',
        body: form,
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error?.message || 'Failed to send support request');
      }

      setStatus('Support request sent. BrewCommand will respond within 24 hours.');
      setFormState((current) => ({
        ...current,
        subject: '',
      }));
      event.currentTarget.reset();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to send support request');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <DashboardContainer>
          <Header />
          <NavigationTabs />
          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/60">
            Loading support...
          </div>
        </DashboardContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DashboardContainer>
        <Header />
        <NavigationTabs />

        <div className="mb-5 mt-2 text-[40px] font-medium tracking-[-0.03em] text-[#f8cf98]">Support</div>

        <section className="rounded-[30px] border border-[#ffc742]/24 bg-[radial-gradient(circle_at_top_left,rgba(255,199,66,0.18),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(30,20,13,0.88),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(255,184,28,0.08)]">
          <div className="text-[15px] uppercase tracking-[0.16em] text-white/38">Systems support intake</div>
          <div className="mt-3 text-[26px] font-semibold text-[#f7ddb3]">Tell BrewCommand what needs attention</div>
          <div className="mt-2 max-w-3xl text-[15px] leading-7 text-white/62">
            Use this form for issues, bugs, or confusion anywhere in BrewLotto. Pick the section that applies, leave a clear note, and attach a screenshot if it helps. We’ll respond within 24 hours.
          </div>
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <SectionCard
            title="Support Form"
            description="Category, comments, and screenshots are routed to BrewCommand as a tracked alert."
          >
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-[12px] uppercase tracking-[0.16em] text-white/38" htmlFor="category">
                  Section
                </label>
                <select
                  id="category"
                  name="category"
                  value={formState.category}
                  onChange={(event) => setFormState((current) => ({ ...current, category: event.target.value as SupportCategory }))}
                  className="w-full rounded-[18px] border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-[#ffc742]/45"
                >
                  {SUPPORT_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <div className="text-[13px] leading-6 text-white/50">{selectedCategory.description}</div>
              </div>

              <div className="space-y-2">
                <label className="block text-[12px] uppercase tracking-[0.16em] text-white/38" htmlFor="subject">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={(event) => setFormState((current) => ({ ...current, subject: event.target.value }))}
                  placeholder="Short summary of the issue"
                  className="w-full rounded-[18px] border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-[#ffc742]/45"
                  maxLength={120}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[12px] uppercase tracking-[0.16em] text-white/38" htmlFor="message">
                  Comments
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Tell us what happened, what you expected, and what page or button you were using."
                  rows={7}
                  className="w-full rounded-[18px] border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-[#ffc742]/45"
                />
                <input type="hidden" name="page" value={formState.page} />
              </div>

              <div className="space-y-2">
                <label className="block text-[12px] uppercase tracking-[0.16em] text-white/38" htmlFor="screenshots">
                  Screenshots
                </label>
                <input
                  id="screenshots"
                  name="screenshots"
                  type="file"
                  accept="image/*"
                  multiple
                  className="w-full rounded-[18px] border border-white/10 bg-black/30 px-4 py-3 text-white file:mr-4 file:rounded-full file:border-0 file:bg-[#ffc742] file:px-4 file:py-2 file:text-[12px] file:font-semibold file:text-black"
                />
                <div className="text-[12px] uppercase tracking-[0.14em] text-white/32">
                  Up to {MAX_SCREENSHOTS} screenshots. Attach one if the issue is visual.
                </div>
              </div>

              <div className="space-y-3 rounded-[20px] border border-white/8 bg-black/20 px-4 py-4">
                <div className="text-[13px] font-medium text-[#f7ddb3]">Response window</div>
                <div className="text-[14px] leading-7 text-white/62">
                  BrewCommand will review support requests and respond within 24 hours during active launch support windows.
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-5 py-2.5 text-[14px] font-semibold text-black transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Support Request'}
                </button>
                <Link
                  href="/learn"
                  className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-[14px] font-medium text-white/72 transition-colors hover:text-white"
                >
                  Back to BrewU
                </Link>
              </div>

              {status ? (
                <div className="rounded-[18px] border border-[#72caff]/18 bg-[#72caff]/10 px-4 py-3 text-[14px] text-[#d8f1ff]">
                  {status}
                </div>
              ) : null}

              {error ? (
                <div className="rounded-[18px] border border-[#ff8d7b]/18 bg-[#ff8d7b]/10 px-4 py-3 text-[14px] text-[#ffc4b8]">
                  {error}
                </div>
              ) : null}
            </form>
          </SectionCard>

          <div className="space-y-4">
            <SectionCard
              title="Systems"
              description="BrewU keeps product education and system access together."
            >
              <div className="space-y-3">
                <Link href="/learn" className="block rounded-[20px] border border-white/8 bg-black/20 px-4 py-4 transition-colors hover:border-[#ffc742]/20 hover:bg-[#ffc742]/8">
                  <div className="text-[18px] font-medium text-[#f7ddb3]">BrewU</div>
                  <div className="mt-2 text-[14px] leading-7 text-white/60">Tutorial replay, core explainers, and the product learning surface.</div>
                </Link>
                <Link href="/support" className="block rounded-[20px] border border-[#ffc742]/20 bg-[#ffc742]/10 px-4 py-4 transition-colors hover:border-[#ffc742]/35 hover:bg-[#ffc742]/14">
                  <div className="text-[18px] font-medium text-[#f7ddb3]">Support</div>
                  <div className="mt-2 text-[14px] leading-7 text-white/60">Report issues, attach screenshots, and notify BrewCommand.</div>
                </Link>
                <Link href="/legal" className="block rounded-[20px] border border-white/8 bg-black/20 px-4 py-4 transition-colors hover:border-[#ffc742]/20 hover:bg-[#ffc742]/8">
                  <div className="text-[18px] font-medium text-[#f7ddb3]">Terms &amp; Privacy</div>
                  <div className="mt-2 text-[14px] leading-7 text-white/60">Legal index, privacy posture, and responsible-use notes.</div>
                </Link>
                <Link href="/logout" className="block rounded-[20px] border border-white/8 bg-black/20 px-4 py-4 transition-colors hover:border-[#ffc742]/20 hover:bg-[#ffc742]/8">
                  <div className="text-[18px] font-medium text-[#f7ddb3]">Logout</div>
                  <div className="mt-2 text-[14px] leading-7 text-white/60">Sign out from the current BrewLotto session.</div>
                </Link>
              </div>
            </SectionCard>

            <SectionCard
              title="What to include"
              description="Keep the report short and actionable."
            >
              <div className="space-y-3 text-[14px] leading-7 text-white/62">
                <p>Say what section you were in, what you clicked, what happened, and what you expected to see.</p>
                <p>If the issue is visual or layout-related, add a screenshot. If it is a behavior bug, include the exact page and button name.</p>
                <p>We’ll track the request in BrewCommand and route email to the selected superadmin inbox.</p>
              </div>
            </SectionCard>
          </div>
        </section>
      </DashboardContainer>
    </main>
  );
}
