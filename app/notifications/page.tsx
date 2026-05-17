'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  DashboardContainer,
  Header,
  NavigationTabs,
  SectionCard,
} from '@/components/brewlotto/dashboard';
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
  const [preferences, setPreferences] =
    useState<NotificationPreferenceRecord>(DEFAULT_PREFERENCES);
  const [notifications, setNotifications] = useState<UserNotificationRecord[]>(
    []
  );
  const [selectedTab, setSelectedTab] = useState<'new' | 'all'>('new');
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
            setError(
              'You need to sign in before Brew can show notification preferences.'
            );
          }
          return;
        }

        const [preferencesResult, notificationsResult] = await Promise.all([
          supabase
            .from('notification_preferences')
            .select(
              'email_enabled, push_enabled, sms_enabled, draw_results_enabled, pick_reminders_enabled, streak_alerts_enabled, mission_alerts_enabled, promo_alerts_enabled, subscription_alerts_enabled, security_alerts_enabled, quiet_hours_enabled, quiet_hours_start, quiet_hours_end'
            )
            .eq('user_id', authUser.id)
            .maybeSingle(),
          supabase
            .from('user_notifications')
            .select(
              'id, type, title, body, cta_label, cta_url, is_read, priority, created_at'
            )
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
          setPreferences({
            ...DEFAULT_PREFERENCES,
            ...(preferencesResult.data || {}),
          });
          setNotifications(notificationsResult.data || []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Failed to load notifications'
          );
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

  const unreadCount = useMemo(
    () => notifications.filter((entry) => !entry.is_read).length,
    [notifications]
  );
  const visibleNotifications = useMemo(() => {
    if (selectedTab === 'all') {
      return notifications;
    }

    return notifications.filter((entry) => !entry.is_read);
  }, [notifications, selectedTab]);
  const compactNotificationTypes = new Set(['pick_reminder', 'draw_result']);
  const enabledDeliveryChannels = [
    preferences.email_enabled ? 'Email' : null,
    'In-app',
  ].filter(Boolean) as string[];
  const preferenceCount = [
    preferences.draw_results_enabled,
    preferences.pick_reminders_enabled,
    preferences.streak_alerts_enabled,
    preferences.mission_alerts_enabled,
    preferences.subscription_alerts_enabled,
    preferences.security_alerts_enabled,
    preferences.promo_alerts_enabled,
  ].filter(Boolean).length;

  async function savePreferences() {
    if (!user) {
      return;
    }

    setSavingPreferences(true);
    setMessage(null);

    try {
      const { error: upsertError } = await supabase
        .from('notification_preferences')
        .upsert(
          {
            user_id: user.id,
            ...preferences,
          },
          { onConflict: 'user_id' }
        );

      if (upsertError) {
        throw upsertError;
      }

      setMessage('Notification preferences saved.');
    } catch (saveError) {
      setMessage(
        saveError instanceof Error
          ? saveError.message
          : 'Failed to save preferences'
      );
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
      current.map((entry) =>
        entry.id === notificationId ? { ...entry, is_read: true } : entry
      )
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

    setNotifications((current) =>
      current.map((entry) => ({ ...entry, is_read: true }))
    );
  }

  const preferenceFields: Array<{
    key: keyof NotificationPreferenceRecord;
    label: string;
    description: string;
  }> = [
    {
      key: 'draw_results_enabled',
      label: 'Results Updates',
      description: 'A new draw is posted or your results are ready.',
    },
    {
      key: 'pick_reminders_enabled',
      label: 'Pick Reminders',
      description: 'A saved pick is coming back around soon.',
    },
    {
      key: 'streak_alerts_enabled',
      label: 'Progress Updates',
      description: 'Milestones, streaks, and saved-hit progress.',
    },
    {
      key: 'mission_alerts_enabled',
      label: 'Brew Challenges',
      description: 'Simple prompts and future BrewU activities.',
    },
    {
      key: 'subscription_alerts_enabled',
      label: 'Plan Updates',
      description: 'Changes to your plan, renewal, or access.',
    },
    {
      key: 'security_alerts_enabled',
      label: 'Account Safety',
      description: 'Sign-in and security notices.',
    },
    {
      key: 'promo_alerts_enabled',
      label: 'Offers',
      description: 'Optional Brew updates and product announcements.',
    },
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DashboardContainer>
        <Header />
        <NavigationTabs />

        <div className="mb-5 mt-2 text-[40px] font-medium tracking-[-0.03em] text-[#f8cf98]">
          Notifications
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/55">
            Loading your notification center...
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-[#ff8d7b]/25 bg-[#2a120d]/60 px-5 py-8 text-center text-[#ffc4b8]">
            {error}
          </div>
        ) : (
          <div className="space-y-5">
            <section className="rounded-[30px] border border-[#72caff]/18 bg-[radial-gradient(circle_at_top_left,rgba(114,202,255,0.14),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(18,24,36,0.9),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(114,202,255,0.06)]">
              <div className="text-[15px] uppercase tracking-[0.16em] text-white/38">
                Notification snapshot
              </div>
              <div className="mt-3 text-[26px] font-semibold text-[#d7ecff]">
                See what Brew can send at a glance
              </div>
              <div className="mt-2 max-w-2xl text-[15px] leading-7 text-white/62">
                This page combines your notification choices with the real
                in-app inbox so you can see what Brew can send today,
                what&apos;s unread, and what&apos;s ready now.
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4">
                  <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">
                    Unread
                  </div>
                  <div className="mt-2 text-[28px] font-semibold text-[#d7ecff]">
                    {unreadCount}
                  </div>
                  <div className="mt-1 text-[13px] leading-6 text-white/52">
                    Notifications waiting in the feed
                  </div>
                </div>
                <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4">
                  <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">
                    Channels
                  </div>
                  <div className="mt-2 text-[18px] font-semibold text-[#f7ddb3]">
                    {enabledDeliveryChannels.join(' • ') || 'None enabled'}
                  </div>
                  <div className="mt-1 text-[13px] leading-6 text-white/52">
                    How Brew can reach you
                  </div>
                </div>
                <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4">
                  <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">
                    Topics on
                  </div>
                  <div className="mt-2 text-[28px] font-semibold text-[#ddf7e2]">
                    {preferenceCount}
                  </div>
                  <div className="mt-1 text-[13px] leading-6 text-white/52">
                    Topics turned on
                  </div>
                </div>
                <div className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4">
                  <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">
                    Quiet hours
                  </div>
                  <div className="mt-2 text-[18px] font-semibold text-[#f7ddb3]">
                    {preferences.quiet_hours_enabled &&
                    preferences.quiet_hours_start &&
                    preferences.quiet_hours_end
                      ? `${preferences.quiet_hours_start} - ${preferences.quiet_hours_end}`
                      : 'Off'}
                  </div>
                  <div className="mt-1 text-[13px] leading-6 text-white/52">
                    Quiet mode window
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/support"
                  className="rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-5 py-2.5 text-[14px] font-semibold text-black transition-transform hover:scale-[1.02]"
                >
                  Need help?
                </Link>
                <Link
                  href="/learn#systems"
                  className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-[14px] text-white/80 transition-colors hover:text-white"
                >
                  Review BrewU help
                </Link>
              </div>
            </section>

            <section className="rounded-[30px] border border-[#ffc742]/24 bg-[radial-gradient(circle_at_top_left,rgba(255,199,66,0.18),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(30,20,13,0.88),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(255,184,28,0.08)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-[15px] uppercase tracking-[0.16em] text-white/38">
                    Brew updates
                  </div>
                  <div className="mt-3 text-[26px] font-semibold text-[#f7ddb3]">
                    {unreadCount} unread notification
                    {unreadCount === 1 ? '' : 's'}
                  </div>
                  <div className="mt-2 max-w-2xl text-[15px] leading-7 text-white/62">
                    This page uses your real notification choices plus any
                    in-app alerts currently stored for your account. Email and
                    in-app alerts are live today; push and SMS stay here as
                    future options until Twilio and mobile delivery are ready.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={markAllRead}
                  disabled={unreadCount === 0}
                  className="rounded-full border border-[#ffc742]/28 bg-[#ffc742]/10 px-5 py-2 text-[14px] font-medium text-[#ffd27e] transition-colors hover:bg-[#ffc742]/16 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Mark All Read
                </button>
              </div>

              <div className="mt-5 flex items-center gap-3 border-t border-white/8 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedTab('new')}
                  className={`rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${
                    selectedTab === 'new'
                      ? 'bg-[#ffc742] text-black'
                      : 'border border-white/10 bg-white/[0.03] text-white/72 hover:bg-white/[0.06]'
                  }`}
                >
                  New
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTab('all')}
                  className={`rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${
                    selectedTab === 'all'
                      ? 'bg-[#ffc742] text-black'
                      : 'border border-white/10 bg-white/[0.03] text-white/72 hover:bg-white/[0.06]'
                  }`}
                >
                  All
                </button>
                <div className="ml-auto text-[14px] text-white/48">
                  {selectedTab === 'new'
                    ? 'Unread alerts only'
                    : 'All stored alerts'}
                </div>
              </div>
            </section>

            <SectionCard
              title="Preference Toggles"
              description="These settings are stored in `notification_preferences` for your authenticated account."
            >
              <div className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-[24px] border border-white/8 bg-black/20 px-4 py-4">
                  <div className="mb-4 text-[12px] uppercase tracking-[0.16em] text-white/35">
                    How Brew can reach you
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        key: 'email_enabled' as const,
                        label: 'Email',
                        live: true,
                      },
                      {
                        key: 'push_enabled' as const,
                        label: 'Push',
                        live: false,
                      },
                      {
                        key: 'sms_enabled' as const,
                        label: 'SMS',
                        live: false,
                      },
                    ].map((entry) => (
                      <label
                        key={entry.key}
                        className={`flex items-center justify-between gap-4 text-[15px] ${entry.live ? 'text-white/78' : 'text-white/48'}`}
                      >
                        <span>
                          {entry.label}
                          {entry.live ? '' : ' (coming later)'}
                        </span>
                        <input
                          type="checkbox"
                          checked={preferences[entry.key]}
                          onChange={(event) =>
                            setPreferences((current) => ({
                              ...current,
                              [entry.key]: event.target.checked,
                            }))
                          }
                          disabled={!entry.live}
                          className="h-4 w-4 accent-[#ffc742] disabled:cursor-not-allowed disabled:opacity-35"
                        />
                      </label>
                    ))}
                  </div>
                </div>
                <div className="rounded-[24px] border border-white/8 bg-black/20 px-4 py-4">
                  <div className="mb-4 text-[12px] uppercase tracking-[0.16em] text-white/35">
                    Quiet mode
                  </div>
                  <label className="flex items-center justify-between gap-4 text-[15px] text-white/78">
                    <span>Pause alerts during quiet mode</span>
                    <input
                      type="checkbox"
                      checked={preferences.quiet_hours_enabled}
                      onChange={(event) =>
                        setPreferences((current) => ({
                          ...current,
                          quiet_hours_enabled: event.target.checked,
                        }))
                      }
                      className="h-4 w-4 accent-[#ffc742]"
                    />
                  </label>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <input
                      type="time"
                      value={preferences.quiet_hours_start || ''}
                      onChange={(event) =>
                        setPreferences((current) => ({
                          ...current,
                          quiet_hours_start: event.target.value || null,
                        }))
                      }
                      className="rounded-[16px] border border-white/10 bg-[#0d0b0b] px-3 py-3 text-[15px] text-white outline-none"
                    />
                    <input
                      type="time"
                      value={preferences.quiet_hours_end || ''}
                      onChange={(event) =>
                        setPreferences((current) => ({
                          ...current,
                          quiet_hours_end: event.target.value || null,
                        }))
                      }
                      className="rounded-[16px] border border-white/10 bg-[#0d0b0b] px-3 py-3 text-[15px] text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {preferenceFields.map((field) => (
                  <label
                    key={field.key}
                    className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-[16px] font-medium text-[#f7ddb3]">
                        {field.label}
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences[field.key]}
                        onChange={(event) =>
                          setPreferences((current) => ({
                            ...current,
                            [field.key]: event.target.checked,
                          }))
                        }
                        className="h-4 w-4 accent-[#ffc742]"
                      />
                    </div>
                    <div className="mt-2 text-[13px] leading-6 text-white/55">
                      {field.description}
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={savePreferences}
                  disabled={savingPreferences}
                  className="rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-6 py-3 text-[15px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingPreferences ? 'Saving...' : 'Save Preferences'}
                </button>
                <div className="text-[14px] text-white/58">
                  {message ||
                    'Email and in-app alerts are live today. Push and SMS stay here as future options until Twilio and mobile delivery are ready.'}
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Recent Alerts"
              description="This feed shows your latest Brew updates. Empty state is explicit until events start landing."
            >
              {visibleNotifications.length === 0 ? (
                <div className="rounded-[20px] border border-white/8 bg-black/20 px-4 py-4 text-[14px] leading-6 text-white/58">
                  No Brew updates are stored for this account yet. As results,
                  reminders, plan changes, and support updates land, they will
                  appear here.
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleNotifications.map((entry) => {
                    const isCompact = compactNotificationTypes.has(entry.type);
                    return (
                      <article
                        key={entry.id}
                        className={`rounded-[22px] border px-3 py-3 sm:px-4 sm:py-4 ${entry.is_read ? 'border-white/8 bg-black/20' : 'border-[#ffc742]/20 bg-[#ffc742]/8'}`}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="text-[15px] font-medium text-[#f7ddb3] sm:text-[16px]">
                                {entry.title}
                              </div>
                              {isCompact ? (
                                <span className="rounded-full border border-[#ffc742]/18 bg-[#ffc742]/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[#ffd27e]">
                                  quick update
                                </span>
                              ) : (
                                <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-white/38">
                                  {entry.type}
                                </span>
                              )}
                              <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-white/38 sm:text-[11px]">
                                {entry.priority}
                              </span>
                            </div>
                            <div
                              className={`mt-2 text-[13px] leading-6 text-white/62 sm:text-[14px] sm:leading-7 ${isCompact ? 'max-w-2xl' : ''}`}
                            >
                              {entry.body ||
                                'No detail text stored for this notification.'}
                            </div>
                            <div className="mt-2 text-[12px] uppercase tracking-[0.14em] text-white/35">
                              {formatTimestamp(entry.created_at)}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                            {entry.cta_url ? (
                              <Link
                                href={entry.cta_url}
                                className="w-full rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-center text-[12px] font-medium text-white/72 transition-colors hover:text-white sm:w-auto sm:text-[13px]"
                              >
                                {entry.cta_label || 'Open'}
                              </Link>
                            ) : null}
                            {!entry.is_read ? (
                              <button
                                type="button"
                                onClick={() => markAsRead(entry.id)}
                                className="w-full rounded-full border border-[#ffc742]/28 bg-[#ffc742]/10 px-4 py-2 text-[12px] font-medium text-[#ffd27e] transition-colors hover:bg-[#ffc742]/16 hover:text-white sm:w-auto sm:text-[13px]"
                              >
                                Mark Read
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </SectionCard>
          </div>
        )}
      </DashboardContainer>
    </main>
  );
}
