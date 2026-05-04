'use client';

import { useEffect, useState } from 'react';
import { DashboardContainer, Header, NavigationTabs, SectionCard } from '@/components/brewlotto/dashboard';
import { supabase } from '@/lib/supabase/browserClient';

interface AuthUser {
  id: string;
}

interface UserSettingsRecord {
  theme: 'dark' | 'light' | 'system';
  accent_mode: 'gold' | 'blue' | 'auto';
  voice_enabled: boolean;
  brew_commentary_enabled: boolean;
  strategy_explanations_enabled: boolean;
  motion_enabled: boolean;
  sound_effects_enabled: boolean;
  default_state: 'NC' | 'CA';
  default_game: 'pick3' | 'pick4' | 'cash5' | 'powerball' | 'mega_millions';
  auto_save_picks: boolean;
  show_results_first: boolean;
}

const DEFAULT_SETTINGS: UserSettingsRecord = {
  theme: 'dark',
  accent_mode: 'gold',
  voice_enabled: true,
  brew_commentary_enabled: true,
  strategy_explanations_enabled: true,
  motion_enabled: true,
  sound_effects_enabled: false,
  default_state: 'NC',
  default_game: 'pick3',
  auto_save_picks: true,
  show_results_first: false,
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [settings, setSettings] = useState<UserSettingsRecord>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
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
            setError('You need to sign in before Brew can show app settings.');
          }
          return;
        }

        const { data, error: settingsError } = await supabase
          .from('user_settings')
          .select('theme, accent_mode, voice_enabled, brew_commentary_enabled, strategy_explanations_enabled, motion_enabled, sound_effects_enabled, default_state, default_game, auto_save_picks, show_results_first')
          .eq('user_id', authUser.id)
          .maybeSingle();

        if (settingsError) {
          throw settingsError;
        }

        if (!cancelled) {
          setUser({ id: authUser.id });
          setSettings({ ...DEFAULT_SETTINGS, ...(data || {}) });
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load settings');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  async function saveSettings() {
    if (!user) {
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const { error: upsertError } = await supabase.from('user_settings').upsert(
        {
          user_id: user.id,
          ...settings,
        },
        { onConflict: 'user_id' },
      );

      if (upsertError) {
        throw upsertError;
      }

      setMessage('Settings saved.');
    } catch (saveError) {
      setMessage(saveError instanceof Error ? saveError.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  const toggleFields: Array<{ key: keyof UserSettingsRecord; label: string; description: string }> = [
    { key: 'voice_enabled', label: 'Voice Mode', description: 'Allow narrated Brew commentary when supported.' },
    { key: 'brew_commentary_enabled', label: 'Brew Commentary', description: 'Show guided pick commentary in active surfaces.' },
    { key: 'strategy_explanations_enabled', label: 'Strategy Explanations', description: 'Prefer expanded explainability details where available.' },
    { key: 'motion_enabled', label: 'Motion Effects', description: 'Keep animated interface transitions enabled.' },
    { key: 'sound_effects_enabled', label: 'Sound Effects', description: 'Reserved for future sound cues in the dashboard shell.' },
    { key: 'auto_save_picks', label: 'Auto Save Picks', description: 'Default saved behavior for future authenticated pick flows.' },
    { key: 'show_results_first', label: 'Results First', description: 'Favor results-oriented route ordering in future account UX.' },
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DashboardContainer>
        <Header />
        <NavigationTabs />

        <div className="mb-5 mt-2 text-[40px] font-medium tracking-[-0.03em] text-[#f8cf98]">Settings</div>

        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/55">Loading settings...</div>
        ) : error ? (
          <div className="rounded-[28px] border border-[#ff8d7b]/25 bg-[#2a120d]/60 px-5 py-8 text-center text-[#ffc4b8]">{error}</div>
        ) : (
          <div className="space-y-5">
            <section className="rounded-[30px] border border-[#ffc742]/24 bg-[radial-gradient(circle_at_top_left,rgba(255,199,66,0.18),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(30,20,13,0.88),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(255,184,28,0.08)]">
              <div className="text-[15px] uppercase tracking-[0.16em] text-white/38">App behavior</div>
              <div className="mt-3 text-[26px] font-semibold text-[#f7ddb3]">Environment-wide preferences</div>
              <div className="mt-2 max-w-2xl text-[15px] leading-7 text-white/62">This page uses `user_settings` for app-level controls that are broader than profile identity, and keeps future controls inside the same stable record.</div>
            </section>

            <SectionCard title="Defaults" description="Saved defaults influence future route and gameplay preferences for your account.">
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <div className="mb-2 text-[12px] uppercase tracking-[0.16em] text-white/35">Default state</div>
                  <select value={settings.default_state} onChange={(event) => setSettings((current) => ({ ...current, default_state: event.target.value as UserSettingsRecord['default_state'] }))} className="w-full rounded-[18px] border border-white/10 bg-[#0d0b0b] px-4 py-3 text-[15px] text-white outline-none">
                    <option value="NC">North Carolina</option>
                    <option value="CA">California</option>
                  </select>
                </label>
                <label>
                  <div className="mb-2 text-[12px] uppercase tracking-[0.16em] text-white/35">Default game</div>
                  <select value={settings.default_game} onChange={(event) => setSettings((current) => ({ ...current, default_game: event.target.value as UserSettingsRecord['default_game'] }))} className="w-full rounded-[18px] border border-white/10 bg-[#0d0b0b] px-4 py-3 text-[15px] text-white outline-none">
                    <option value="pick3">Pick 3</option>
                    <option value="pick4">Pick 4</option>
                    <option value="cash5">Cash 5</option>
                    <option value="powerball">Powerball</option>
                    <option value="mega_millions">Mega Millions</option>
                  </select>
                </label>
              </div>
            </SectionCard>

            <SectionCard title="Experience Preferences" description="These toggles use fields already defined on the `user_settings` table.">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {toggleFields.map((field) => (
                  <label key={field.key} className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-[16px] font-medium text-[#f7ddb3]">{field.label}</div>
                      <input type="checkbox" checked={Boolean(settings[field.key])} onChange={(event) => setSettings((current) => ({ ...current, [field.key]: event.target.checked }))} className="h-4 w-4 accent-[#ffc742]" />
                    </div>
                    <div className="mt-2 text-[13px] leading-6 text-white/55">{field.description}</div>
                  </label>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Theme & Accent" description="These values are stored now even though the full theme switcher rollout remains future work.">
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <div className="mb-2 text-[12px] uppercase tracking-[0.16em] text-white/35">Theme</div>
                  <select value={settings.theme} onChange={(event) => setSettings((current) => ({ ...current, theme: event.target.value as UserSettingsRecord['theme'] }))} className="w-full rounded-[18px] border border-white/10 bg-[#0d0b0b] px-4 py-3 text-[15px] text-white outline-none">
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="system">System</option>
                  </select>
                </label>
                <label>
                  <div className="mb-2 text-[12px] uppercase tracking-[0.16em] text-white/35">Accent mode</div>
                  <select value={settings.accent_mode} onChange={(event) => setSettings((current) => ({ ...current, accent_mode: event.target.value as UserSettingsRecord['accent_mode'] }))} className="w-full rounded-[18px] border border-white/10 bg-[#0d0b0b] px-4 py-3 text-[15px] text-white outline-none">
                    <option value="gold">Gold</option>
                    <option value="blue">Blue</option>
                    <option value="auto">Auto</option>
                  </select>
                </label>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button type="button" onClick={saveSettings} disabled={saving} className="rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-6 py-3 text-[15px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.18)] disabled:cursor-not-allowed disabled:opacity-60">{saving ? 'Saving...' : 'Save Settings'}</button>
                <div className="text-[14px] text-white/58">{message || 'Settings controls stay intentionally narrow until the broader account configuration layer expands.'}</div>
              </div>
            </SectionCard>
          </div>
        )}
      </DashboardContainer>
    </main>
  );
}
