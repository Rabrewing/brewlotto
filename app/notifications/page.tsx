'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { DashboardContainer, Header, NavigationTabs } from '@/components/brewlotto/dashboard';
import { supabase } from '@/lib/supabase/browserClient';

interface AuthUser {
  id: string;
}

interface NotificationPreferenceRecord {
  email_enabled: boolean;
  push_enabled: boolean;
  sms_enabled: boolean;
  draw_results_enabled: boolean;
  pick_reminders_enabled: boolean;
  streak_alerts_enabled: boolean;
  mission_alerts_enabled: boolean;
  promo_alerts_enabled: boolean;
  subscription_alerts_enabled: boolean;
  security_alerts_enabled: boolean;
  quiet_hours_enabled: boolean;
  quiet_hours_start?: string | null;
  quiet_hours_end?: string | null;
}

interface UserNotificationRecord {
  id: string;
  type: string;
  title: string;
  body?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  is_read: boolean;
  priority: string;
  created_at: string;
}

const DEFAULT_PREFERENCES: NotificationPreferenceRecord = {
  email_enabled: true,
  push_enabled: true,
  sms_enabled: false,
  draw_results_enabled: true,
  pick_reminders_enabled: true,
  streak_alerts_enabled: true,
  mission_alerts_enabled: true,
  promo_alerts_enabled: false,
  subscription_alerts_enabled: true,
  security_alerts_enabled: true,
  quiet_hours_enabled: false,
  quiet_hours_start: null,
  quiet_hours_end: null,
};

function SectionCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-[28px] border border-[#ffbd39]/18 bg-[linear-gradient(145deg,rgba(28,18,14,0.75),rgba(12,10,10,0.95))] px-5 py-5 shadow-[0_0_20px_rgba(255,184,28,0.05)]">
      <div className="text-[18px] font-medium text-[#f7d6ab]">{title}</div>
      <div className="mt-1 text-[14px] leading-6 text-white/55">{description}</div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferenceRecord>(DEFAULT_PREFERENCES);
  const [notifications, setNotifications] = useState<UserNotificationRecord[]>([]);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadNotifications() {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user: authUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!authUser) {
          if (!cancelled) {
            setError('You need to sign in before Brew can show notification preferences.');
          }
          return;
        }

        const [preferencesResult, notificationsResult] = await Promise.all([
          supabase
            .from('notification_preferences')
            .select('email_enabled, push_enabled, sms_enabled, draw_results_enabled, pick_reminders_enabled, streak_alerts_enabled, mission_alerts_enabled, promo_alerts_enabled, subscription_alerts_enabled, security_alerts_enabled, quiet_hours_enabled, quiet_hours_start, quiet_hours_end')
            .eq('user_id', authUser.id)
            .maybeSingle(),
          supabase
            .from('user_notifications')
            .select('id, type, title, body, cta_label, cta_url, is_read, priority, created_at')
            .eq('user_id', authUser.id)
            .order('created_at', { ascending: false })
            .limit(25),
        ]);

        if (preferencesResult.error) {
          throw preferencesResult.error;
        }
        if (notificationsResult.error) {
          throw notificationsResult.error;
        }

        if (!cancelled) {
          setUser({ id: authUser.id });
          setPreferences({ ...DEFAULT_PREFERENCES, ...(preferencesResult.data || {}) });
          setNotifications(notificationsResult.data || []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load notifications');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadNotifications();

    return () => {
      cancelled = true;
    };
  }, []);

  const unreadCount = useMemo(() => notifications.filter((entry) => !entry.is_read).length, [notifications]);

  async function savePreferences() {
    if (!user) {
      return;
    }

    setSavingPreferences(true);
    setMessage(null);

    try {
      const { error: upsertError } = await supabase.from('notification_preferences').upsert(
        {
          user_id: user.id,
          ...preferences,
        },
        { onConflict: 'user_id' },
      );

      if (upsertError) {
        throw upsertError;
      }

      setMessage('Notification preferences saved.');
    } catch (saveError) {
      setMessage(saveError instanceof Error ? saveError.message : 'Failed to save preferences');
    } finally {
      setSavingPreferences(false);
    }
  }

  async function markAsRead(notificationId: string) {
    const { error: updateError } = await supabase
      .from('user_notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId);

    if (updateError) {
      setMessage(updateError.message);
      return;
    }

    setNotifications((current) =>
      current.map((entry) => (entry.id === notificationId ? { ...entry, is_read: true } : entry)),
    );
  }

  async function markAllRead() {
    if (!user || unreadCount === 0) {
      return;
    }

    const { error: updateError } = await supabase
      .from('user_notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (updateError) {
      setMessage(updateError.message);
      return;
    }

    setNotifications((current) => current.map((entry) => ({ ...entry, is_read: true })));
  }

  const preferenceFields: Array<{ key: keyof NotificationPreferenceRecord; label: string; description: string }> = [
    { key: 'draw_results_enabled', label: 'Draw Results', description: 'Official draw posted and recap alerts.' },
    { key: 'pick_reminders_enabled', label: 'Pick Reminders', description: 'Saved-pick reminders before the next draw.' },
    { key: 'streak_alerts_enabled', label: 'Streak Alerts', description: 'Performance streak and hit milestone nudges.' },
    { key: 'mission_alerts_enabled', label: 'Mission Alerts', description: 'Gamified tasks and future BrewU hooks.' },
    { key: 'subscription_alerts_enabled', label: 'Subscription Alerts', description: 'Plan, renewal, and entitlement warnings.' },
    { key: 'security_alerts_enabled', label: 'Security Alerts', description: 'Session and account-safety notices.' },
    { key: 'promo_alerts_enabled', label: 'Promo Alerts', description: 'Optional marketing and product promos.' },
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DashboardContainer>
        <Header />
        <NavigationTabs />

        <div className="mb-5 mt-2 text-[40px] font-medium tracking-[-0.03em] text-[#f8cf98]">Notifications</div>

        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/55">Loading your notification center...</div>
        ) : error ? (
          <div className="rounded-[28px] border border-[#ff8d7b]/25 bg-[#2a120d]/60 px-5 py-8 text-center text-[#ffc4b8]">{error}</div>
        ) : (
          <div className="space-y-5">
            <section className="rounded-[30px] border border-[#ffc742]/24 bg-[radial-gradient(circle_at_top_left,rgba(255,199,66,0.18),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(30,20,13,0.88),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(255,184,28,0.08)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-[15px] uppercase tracking-[0.16em] text-white/38">In-app center</div>
                  <div className="mt-3 text-[26px] font-semibold text-[#f7ddb3]">{unreadCount} unread notification{unreadCount === 1 ? '' : 's'}</div>
                  <div className="mt-2 max-w-2xl text-[15px] leading-7 text-white/62">This page uses your real notification preference row plus any in-app notifications currently stored for your account.</div>
                </div>
                <button type="button" onClick={markAllRead} disabled={unreadCount === 0} className="rounded-full border border-[#ffc742]/28 bg-[#ffc742]/10 px-5 py-2 text-[14px] font-medium text-[#ffd27e] transition-colors hover:bg-[#ffc742]/16 hover:text-white disabled:cursor-not-allowed disabled:opacity-45">
                  Mark All Read
                </button>
              </div>
            </section>

            <SectionCard title="Preference Toggles" description="These settings are stored in `notification_preferences` for your authenticated account.">
              <div className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-[24px] border border-white/8 bg-black/20 px-4 py-4">
                  <div className="mb-4 text-[12px] uppercase tracking-[0.16em] text-white/35">Delivery Channels</div>
                  <div className="space-y-3">
                    {[
                      { key: 'email_enabled' as const, label: 'Email' },
                      { key: 'push_enabled' as const, label: 'Push' },
                      { key: 'sms_enabled' as const, label: 'SMS' },
                    ].map((entry) => (
                      <label key={entry.key} className="flex items-center justify-between gap-4 text-[15px] text-white/78">
                        <span>{entry.label}</span>
                        <input type="checkbox" checked={preferences[entry.key]} onChange={(event) => setPreferences((current) => ({ ...current, [entry.key]: event.target.checked }))} className="h-4 w-4 accent-[#ffc742]" />
                      </label>
                    ))}
                  </div>
                </div>
                <div className="rounded-[24px] border border-white/8 bg-black/20 px-4 py-4">
                  <div className="mb-4 text-[12px] uppercase tracking-[0.16em] text-white/35">Quiet Hours</div>
                  <label className="flex items-center justify-between gap-4 text-[15px] text-white/78">
                    <span>Enable quiet hours</span>
                    <input type="checkbox" checked={preferences.quiet_hours_enabled} onChange={(event) => setPreferences((current) => ({ ...current, quiet_hours_enabled: event.target.checked }))} className="h-4 w-4 accent-[#ffc742]" />
                  </label>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <input type="time" value={preferences.quiet_hours_start || ''} onChange={(event) => setPreferences((current) => ({ ...current, quiet_hours_start: event.target.value || null }))} className="rounded-[16px] border border-white/10 bg-[#0d0b0b] px-3 py-3 text-[15px] text-white outline-none" />
                    <input type="time" value={preferences.quiet_hours_end || ''} onChange={(event) => setPreferences((current) => ({ ...current, quiet_hours_end: event.target.value || null }))} className="rounded-[16px] border border-white/10 bg-[#0d0b0b] px-3 py-3 text-[15px] text-white outline-none" />
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {preferenceFields.map((field) => (
                  <label key={field.key} className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-[16px] font-medium text-[#f7ddb3]">{field.label}</div>
                      <input type="checkbox" checked={preferences[field.key]} onChange={(event) => setPreferences((current) => ({ ...current, [field.key]: event.target.checked }))} className="h-4 w-4 accent-[#ffc742]" />
                    </div>
                    <div className="mt-2 text-[13px] leading-6 text-white/55">{field.description}</div>
                  </label>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button type="button" onClick={savePreferences} disabled={savingPreferences} className="rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-6 py-3 text-[15px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.18)] disabled:cursor-not-allowed disabled:opacity-60">
                  {savingPreferences ? 'Saving...' : 'Save Preferences'}
                </button>
                <div className="text-[14px] text-white/58">{message || 'Push and SMS remain preference-level controls; actual delivery depends on future channel rollout.'}</div>
              </div>
            </SectionCard>

            <SectionCard title="Recent Alerts" description="This feed reads from the `user_notifications` table. Empty state is explicit until events start landing.">
              {notifications.length === 0 ? (
                <div className="rounded-[20px] border border-white/8 bg-black/20 px-4 py-4 text-[14px] leading-6 text-white/58">No in-app notifications are stored for this account yet. As draw, streak, subscription, and system events land, they will appear here.</div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((entry) => (
                    <article key={entry.id} className={`rounded-[22px] border px-4 py-4 ${entry.is_read ? 'border-white/8 bg-black/20' : 'border-[#ffc742]/20 bg-[#ffc742]/8'}`}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="text-[16px] font-medium text-[#f7ddb3]">{entry.title}</div>
                            <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-white/38">{entry.type}</span>
                            <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-white/38">{entry.priority}</span>
                          </div>
                          <div className="mt-2 text-[14px] leading-7 text-white/62">{entry.body || 'No detail text stored for this notification.'}</div>
                          <div className="mt-2 text-[12px] uppercase tracking-[0.14em] text-white/35">{formatTimestamp(entry.created_at)}</div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {entry.cta_url ? <Link href={entry.cta_url} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-white/72 transition-colors hover:text-white">{entry.cta_label || 'Open'}</Link> : null}
                          {!entry.is_read ? <button type="button" onClick={() => markAsRead(entry.id)} className="rounded-full border border-[#ffc742]/28 bg-[#ffc742]/10 px-4 py-2 text-[13px] font-medium text-[#ffd27e] transition-colors hover:bg-[#ffc742]/16 hover:text-white">Mark Read</button> : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        )}
      </DashboardContainer>
    </main>
  );
}
