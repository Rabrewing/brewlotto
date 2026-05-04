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
import { normalizePreferredStateCode, savePreferredStateForUser, setStoredPreferredStateCode } from '@/hooks/usePreferredState';

type PreferredStateCode = 'NC' | 'CA';

interface ProfileRecord {
  display_name?: string | null;
  avatar_url?: string | null;
  email?: string | null;
  created_at?: string | null;
  last_login?: string | null;
}

interface UserPreferencesRecord {
  default_state_code?: string | null;
}

interface AuthUser {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata?: {
    full_name?: string;
    tier?: string;
    isTrial?: boolean;
    trialEndsAt?: string | null;
  };
}

const STATE_OPTIONS: Array<{ value: PreferredStateCode; label: string }> = [
  { value: 'NC', label: 'North Carolina' },
  { value: 'CA', label: 'California' },
];

function formatDate(value: string | null | undefined) {
  if (!value) {
    return 'Unavailable';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getInitials(name: string) {
  const parts = name
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return 'BL';
  }

  return parts.map((part) => part[0]?.toUpperCase() || '').join('');
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/6 py-3 last:border-b-0 last:pb-0 first:pt-0">
      <div className="text-[12px] uppercase tracking-[0.16em] text-white/35">{label}</div>
      <div className="text-right text-[15px] text-white/82">{value}</div>
    </div>
  );
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [preferredState, setPreferredState] = useState<PreferredStateCode>('NC');
  const [savingState, setSavingState] = useState(false);
  const [stateMessage, setStateMessage] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [displayNameDraft, setDisplayNameDraft] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
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
            setUser(null);
            setProfile(null);
            setError('You need to sign in before Brew can show your account details.');
          }
          return;
        }

        const [{ data: profileRow }, { data: preferencesRow }] = await Promise.all([
          supabase
            .from('user_profiles')
            .select('display_name, avatar_url, email, created_at, last_login')
            .eq('id', authUser.id)
            .maybeSingle(),
          supabase
            .from('user_preferences')
            .select('default_state_code')
            .eq('user_id', authUser.id)
            .maybeSingle(),
        ]);

        if (!cancelled) {
          setUser({
            id: authUser.id,
            email: authUser.email,
            created_at: authUser.created_at,
            user_metadata: {
              full_name: authUser.user_metadata?.full_name,
              tier: authUser.user_metadata?.tier,
              isTrial: authUser.user_metadata?.isTrial,
              trialEndsAt: authUser.user_metadata?.trialEndsAt,
            },
          });
          setProfile(profileRow || null);

          const nextPreferredState = normalizePreferredStateCode(preferencesRow?.default_state_code);
          setPreferredState(nextPreferredState);
          setStoredPreferredStateCode(nextPreferredState);

          const initialName =
            authUser.user_metadata?.full_name ||
            profileRow?.display_name ||
            authUser.email ||
            'Brew Player';
          setDisplayNameDraft(initialName);
        }
      } catch (loadError) {
        if (!cancelled) {
          setUser(null);
          setProfile(null);
          setError(loadError instanceof Error ? loadError.message : 'Failed to load your profile');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const displayName = useMemo(() => {
    return user?.user_metadata?.full_name || profile?.display_name || user?.email || 'Brew Player';
  }, [profile?.display_name, user?.email, user?.user_metadata?.full_name]);

  const currentTierLabel = useMemo(() => {
    const tier = user?.user_metadata?.tier || 'free';
    return `${tier.charAt(0).toUpperCase()}${tier.slice(1)} Tier`;
  }, [user?.user_metadata?.tier]);

  async function handleSaveDisplayName() {
    const trimmed = displayNameDraft.trim();
    if (!trimmed) {
      setProfileMessage('Display name cannot be empty.');
      return;
    }

    setSavingProfile(true);
    setProfileMessage(null);

    try {
      const { data, error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: trimmed,
        },
      });

      if (updateError) {
        throw updateError;
      }

      setUser((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          user_metadata: {
            ...current.user_metadata,
            full_name: data.user?.user_metadata?.full_name || trimmed,
          },
        };
      });
      setEditingProfile(false);
      setProfileMessage('Display name updated for your current auth profile.');
    } catch (saveError) {
      setProfileMessage(saveError instanceof Error ? saveError.message : 'Failed to update display name');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSavePreferredState() {
    if (!user) {
      return;
    }

    setSavingState(true);
    setStateMessage(null);

    try {
      await savePreferredStateForUser(user.id, preferredState);

      setStateMessage(`Default state saved as ${preferredState}.`);
    } catch (saveError) {
      setStateMessage(saveError instanceof Error ? saveError.message : 'Failed to save default state');
    } finally {
      setSavingState(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DashboardContainer>
        <Header />
        <NavigationTabs />

        <div className="mb-5 mt-2 text-[40px] font-medium tracking-[-0.03em] text-[#f8cf98]">
          Profile
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/55">
            Loading your Brew account...
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-[#ff8d7b]/25 bg-[#2a120d]/60 px-5 py-8 text-center text-[#ffc4b8]">
            {error}
          </div>
        ) : !user ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/55">
            No active account is available right now.
          </div>
        ) : (
          <div className="space-y-5">
            <section className="rounded-[30px] border border-[#ffc742]/24 bg-[radial-gradient(circle_at_top_left,rgba(255,199,66,0.18),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(30,20,13,0.88),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(255,184,28,0.08)]">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#ffc742]/65 bg-gradient-to-br from-[#ffc742] to-[#ffbe27] text-[22px] font-bold text-black shadow-[0_0_18px_rgba(255,199,66,0.22)]">
                    {getInitials(displayName)}
                  </div>
                  <div>
                    <div className="text-[24px] font-semibold text-[#f7ddb3]">{displayName}</div>
                    <div className="mt-1 text-[14px] text-white/58">{user.email || profile?.email || 'Email unavailable'}</div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-white/40">
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[#ffd27e]">
                        {currentTierLabel}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
                        Default state {preferredState}
                      </span>
                      {user.user_metadata?.isTrial ? (
                        <span className="rounded-full border border-[#72caff]/24 bg-[#72caff]/10 px-3 py-1 text-[#9fdcff]">
                          Trial active
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingProfile(true);
                    setProfileMessage(null);
                  }}
                  className="rounded-full border border-[#ffc742]/30 bg-[#ffc742]/10 px-5 py-2 text-[14px] font-medium text-[#ffd27e] transition-colors hover:bg-[#ffc742]/16 hover:text-white"
                >
                  Edit Profile
                </button>
              </div>

              {profileMessage ? (
                <div className="mt-4 rounded-[18px] border border-white/8 bg-black/20 px-4 py-3 text-[14px] text-white/72">
                  {profileMessage}
                </div>
              ) : null}
            </section>

            <SectionCard
              title="Account Details"
              description="Identity details are pulled from your active auth session plus your seeded Brew profile record."
            >
              <div>
                <DetailRow label="Display name" value={displayName} />
                <DetailRow label="Email" value={user.email || profile?.email || 'Unavailable'} />
                <DetailRow label="Member since" value={formatDate(profile?.created_at || user.created_at)} />
                <DetailRow label="Last login" value={formatDate(profile?.last_login)} />
              </div>
            </SectionCard>

            <SectionCard
              title="Preferences"
              description="This default state is stored in your V1 user preferences so new account surfaces can reuse the same home lottery context."
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <label className="block max-w-[280px] flex-1">
                  <div className="mb-2 text-[12px] uppercase tracking-[0.16em] text-white/35">Default state</div>
                  <select
                    value={preferredState}
                    onChange={(event) => setPreferredState(event.target.value as PreferredStateCode)}
                    className="w-full rounded-[18px] border border-white/10 bg-[#0d0b0b] px-4 py-3 text-[15px] text-white outline-none transition-colors focus:border-[#ffc742]/45"
                  >
                    {STATE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={handleSavePreferredState}
                  disabled={savingState}
                  className="rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-6 py-3 text-[15px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingState ? 'Saving...' : 'Save State'}
                </button>
              </div>

              <div className="mt-4 text-[14px] text-white/58">
                {stateMessage || 'Your home state will guide future profile-aware defaults as more account surfaces come online.'}
              </div>
            </SectionCard>

            <SectionCard
              title="Security Actions"
              description="BrewLotto currently uses your authenticated session and magic-link flow. No fake password tools are shown here."
            >
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/logout"
                  className="rounded-full border border-[#ff8d7b]/24 bg-[#ff8d7b]/10 px-5 py-3 text-[15px] font-medium text-[#ffc4b8] transition-colors hover:bg-[#ff8d7b]/16 hover:text-white"
                >
                  Sign Out
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-[15px] font-medium text-[#f2d29f] transition-colors hover:text-white"
                >
                  Back to Dashboard
                </Link>
              </div>

              <div className="mt-4 rounded-[18px] border border-white/8 bg-black/20 px-4 py-3 text-[14px] leading-6 text-white/62">
                If you change your login identity details outside Brew, sign out and return through the normal login flow so your seeded profile record can pick up the latest account information.
              </div>
            </SectionCard>
          </div>
        )}

        {editingProfile && user ? (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/65 px-4">
            <div className="w-full max-w-md rounded-[28px] border border-[#ffc742]/25 bg-[linear-gradient(145deg,rgba(23,17,13,0.95),rgba(8,8,8,0.98))] p-5 shadow-[0_0_36px_rgba(255,184,28,0.12)]">
              <div className="text-[22px] font-medium text-[#f7ddb3]">Edit Profile</div>
              <div className="mt-2 text-[14px] leading-6 text-white/58">
                This V1 surface updates the display name stored on your auth profile. Email remains managed by your login provider.
              </div>

              <label className="mt-5 block">
                <div className="mb-2 text-[12px] uppercase tracking-[0.16em] text-white/35">Display name</div>
                <input
                  type="text"
                  value={displayNameDraft}
                  onChange={(event) => setDisplayNameDraft(event.target.value)}
                  className="w-full rounded-[18px] border border-white/10 bg-[#0d0b0b] px-4 py-3 text-[15px] text-white outline-none transition-colors focus:border-[#ffc742]/45"
                  placeholder="Enter display name"
                />
              </label>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProfile(false)}
                  className="flex-1 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-[15px] text-white/72 transition-colors hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveDisplayName}
                  disabled={savingProfile}
                  className="flex-1 rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-4 py-3 text-[15px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingProfile ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </DashboardContainer>
    </main>
  );
}
