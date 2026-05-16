'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getStrategyLabel } from '@/utils/strategyLabel';
import { useUserTier } from '@/hooks/useUserTier';
import {
  DashboardContainer,
  Header,
  NavigationTabs,
  LotteryBall,
} from '@/components/brewlotto/dashboard';
import { supabase } from '@/lib/supabase/browserClient';

type FilterState = 'ALL' | 'NC' | 'CA';
type FilterGame = 'ALL' | 'pick3' | 'pick4' | 'cash5' | 'powerball' | 'mega_millions';
type FilterWindow = 'ALL' | 'midday' | 'evening';
type PickStatus = 'saved' | 'pending';

interface PredictionExplanation {
  summary_text?: string | null;
}

interface StrategyScore {
  strategy_key?: string | null;
  score?: number | null;
}

interface PredictionRecord {
  id: string;
  state: string | null;
  game: string | null;
  created_at: string | null;
  source_strategy_key?: string | null;
  confidence_score?: number | null;
  predicted_numbers?: number[] | null;
  bonus_number?: number | null;
  is_saved?: boolean | null;
  draw_date?: string | null;
  draw_time?: string | null;
  matchInfo?: {
    drawDate: string;
    drawWindow: string;
    primaryMatch: number;
    bonusMatch: boolean;
    totalMatch: number;
    drawNumbers: number[];
    drawBonus: number | null;
    drawFireball: number | null;
  } | null;
  prediction_explanations?: PredictionExplanation[] | null;
  prediction_strategy_scores?: StrategyScore[] | null;
}

interface PlayLogRecord {
  id: string;
  prediction_id: string | null;
  is_settled: boolean | null;
  outcome_result_code?: string | null;
  outcome_match_count?: number | null;
  draw_date?: string | null;
  created_at: string;
  metadata?: unknown;
}

type QueryResult<T> = {
  data: T | null;
  error: { message: string } | null;
};

const STATE_OPTIONS: Array<{ value: FilterState; label: string }> = [
  { value: 'ALL', label: 'All States' },
  { value: 'NC', label: 'NC' },
  { value: 'CA', label: 'CA' },
];

const TIMING_LABELS = new Set([
  'HeatCheck',
  'HeatCheck II',
  'HeatCheck III',
  'HeatCheck IV',
  'HeatWave',
  'HeatWave II',
  'HeatWave III',
  'PulseSync',
  'PulseSync II',
  'SequenceX',
]);

const TIMING_PROFILE_ALIASES: Record<string, string> = {
  'TimePulse': 'PulseSync',
  'TimePulse II': 'PulseSync II',
};

function formatGameLabel(game: string | null) {
  if (!game) {
    return 'Unknown Game';
  }

  switch (game) {
    case 'powerball':
      return 'Powerball';
    case 'mega_millions':
      return 'Mega Millions';
    case 'mega':
      return 'Mega Millions';
    case 'cash5':
      return 'Cash 5';
    case 'fantasy5':
      return 'Fantasy 5';
    case 'pick3':
      return 'Pick 3';
    case 'daily3':
      return 'Daily 3';
    case 'pick4':
      return 'Pick 4';
    case 'daily4':
      return 'Daily 4';
    default:
      return game;
  }
}

function normalizePredictionGame(game: string | null) {
  const normalized = String(game || '').trim().toLowerCase();
  if (normalized === 'daily3') return 'pick3';
  if (normalized === 'daily4') return 'pick4';
  if (normalized === 'fantasy5') return 'cash5';
  if (normalized === 'mega') return 'mega_millions';
  return normalized as FilterGame;
}

function matchesGameFilter(predictionGame: string | null, selectedGame: FilterGame) {
  if (selectedGame === 'ALL') {
    return true;
  }

  return normalizePredictionGame(predictionGame) === selectedGame;
}

function normalizeDrawWindow(value: string | null) {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'midday' || normalized === 'morning' || normalized === 'day') {
    return 'midday';
  }
  if (normalized === 'evening' || normalized === 'night' || normalized === 'pm') {
    return 'evening';
  }
  return normalized || null;
}

function getGameOptions() {
  return [
    { value: 'ALL' as const, label: 'All Games' },
    { value: 'powerball' as const, label: 'Powerball' },
    { value: 'mega_millions' as const, label: 'Mega Millions' },
    { value: 'cash5' as const, label: 'Cash 5' },
    { value: 'pick4' as const, label: 'Pick 4 / Daily 4' },
    { value: 'pick3' as const, label: 'Pick 3 / Daily 3' },
  ];
}

function formatCreatedAt(value: string | null) {
  if (!value) {
    return 'Date unavailable';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

function formatPickGroupDate(value: string | null) {
  if (!value) {
    return 'Unknown day';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getPredictionSummary(prediction: PredictionRecord) {
  const explanation = Array.isArray(prediction.prediction_explanations)
    ? prediction.prediction_explanations.find((item) => item?.summary_text)
    : null;

  if (explanation?.summary_text) {
    return explanation.summary_text;
  }

  if (prediction.source_strategy_key) {
    return `Generated using ${getStrategyLabel(prediction.source_strategy_key)} strategy signals.`;
  }

  return 'Stored Brew pick ready for replay or save actions.';
}

function getTimingProfileKey(strategyKey: string | null | undefined) {
  if (!strategyKey) {
    return null;
  }

  const trimmed = strategyKey.trim();
  if (TIMING_LABELS.has(trimmed)) {
    return trimmed;
  }

  if (TIMING_PROFILE_ALIASES[trimmed]) {
    return TIMING_PROFILE_ALIASES[trimmed];
  }

  const mapped = getStrategyLabel(trimmed);
  if (TIMING_PROFILE_ALIASES[mapped]) {
    return TIMING_PROFILE_ALIASES[mapped];
  }
  return TIMING_LABELS.has(mapped) ? mapped : null;
}

function getPickStatus(prediction: PredictionRecord): PickStatus {
  return prediction.is_saved ? 'saved' : 'pending';
}

function getFireballContext(playLog?: PlayLogRecord | null) {
  if (!playLog) {
    return null;
  }

  const metadata = playLog.metadata;
  if (metadata && typeof metadata === 'object') {
    const value = metadata as Record<string, unknown>;
    const active = value.fireball_active ?? value.fireball ?? null;
    if (active === true || active === 'true') {
      return 'Fireball active';
    }
    if (typeof value.fireball_value === 'number') {
      return `Fireball ${value.fireball_value}`;
    }
    if (typeof value.fireball_value === 'string' && value.fireball_value.trim() !== '' && Number.isFinite(Number(value.fireball_value))) {
      return `Fireball ${value.fireball_value}`;
    }
  }

  if (typeof playLog.outcome_result_code === 'string' && playLog.outcome_result_code.toLowerCase().includes('fireball')) {
    return 'Fireball tracked';
  }

  return null;
}

function PickStatusPill({ status, createdAt }: { status: PickStatus; createdAt: string | null }) {
  if (status === 'saved') {
    return (
      <div className="flex items-center gap-2 text-[15px] text-[#85d36c]">
        <span className="text-lg leading-none">✓</span>
        <span>Saved on {formatCreatedAt(createdAt)}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-[15px] text-[#d8b07a]">
      <span className="text-lg leading-none">⏳</span>
      <span>Generated {formatCreatedAt(createdAt)}</span>
    </div>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 px-4 py-3 text-center">
      <div className="text-[11px] uppercase tracking-[0.16em] text-white/35">{label}</div>
      <div className="mt-2 text-[24px] font-semibold text-[#ffd27e]">{value}</div>
    </div>
  );
}

interface PickCardProps {
  prediction: PredictionRecord;
  playLog: PlayLogRecord | null;
  isConfirmed: boolean;
  isConfirming: boolean;
  onToggleSaved: (prediction: PredictionRecord) => Promise<void>;
  onConfirmPlayed: (prediction: PredictionRecord) => Promise<void>;
  onDelete: (prediction: PredictionRecord) => Promise<void>;
  timingLabel: string;
  timingProfile?: { windowStart: string; windowEnd: string; sampleSize: number } | null;
  onRefreshTiming?: () => void;
  refreshingTiming?: boolean;
  cooldownRemaining?: number;
}

function PickCard({
  prediction,
  playLog,
  isConfirmed,
  isConfirming,
  onToggleSaved,
  onConfirmPlayed,
  onDelete,
  timingLabel,
  timingProfile,
  onRefreshTiming,
  refreshingTiming,
  cooldownRemaining,
}: PickCardProps) {
  const numbers = Array.isArray(prediction.predicted_numbers) ? prediction.predicted_numbers : [];
  const hasBonus = prediction.bonus_number !== null && prediction.bonus_number !== undefined;
  const status = getPickStatus(prediction);
  const fireballContext = getFireballContext(playLog);

  return (
    <article className="rounded-[28px] border border-[#ffbd39]/22 bg-[linear-gradient(145deg,rgba(32,19,13,0.82),rgba(13,10,10,0.96))] px-5 py-4 shadow-[0_0_22px_rgba(255,184,28,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[16px] font-semibold text-[#f7d6ab]">
            {formatGameLabel(prediction.game)}
            <span className="ml-1 text-white/45">• {prediction.state || 'N/A'}</span>
            {prediction.draw_time ? (
              <span className="ml-2 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-white/50">
                {prediction.draw_time}
              </span>
            ) : null}
          </div>
          <div className="mt-1 text-[12px] uppercase tracking-[0.14em] text-white/35">
            {getStrategyLabel(prediction.source_strategy_key)}
            {prediction.confidence_score !== null && prediction.confidence_score !== undefined
              ? ` • ${Math.round(Number(prediction.confidence_score))}% confidence`
              : ''}
          </div>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-white/38">
          {status}
        </div>
      </div>

      {fireballContext ? (
        <div className="mt-3 inline-flex rounded-full border border-[#72caff]/18 bg-[#111f28] px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-[#9edcff]">
          {fireballContext}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-start gap-3">
        {numbers.map((value, index) => (
          <LotteryBall key={`${prediction.id}-${value}-${index}`} number={value} variant="hot" size="small" />
        ))}
        {hasBonus ? (
          <LotteryBall
            number={Number(prediction.bonus_number)}
            variant="bonus-hot"
            size="small"
            label={prediction.game === 'mega_millions' ? 'Mega Ball' : 'Bonus'}
          />
        ) : null}
      </div>

      {isConfirmed && prediction.matchInfo ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-[#72caff]/20 bg-[#72caff]/10 px-3 py-1 text-[12px] font-medium text-[#9fdcff]">
            {prediction.matchInfo.totalMatch === 0
              ? 'No match this draw'
              : `Matched ${prediction.matchInfo.primaryMatch} number${prediction.matchInfo.primaryMatch === 1 ? '' : 's'}${prediction.matchInfo.bonusMatch ? ' + bonus' : ''} ${prediction.matchInfo.totalMatch === 5 ? '— Jackpot!' : ''}`}
          </div>
          {prediction.matchInfo.drawFireball !== null ? (
            <div className="rounded-full border border-[#72caff]/18 bg-[#111f28] px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-[#9edcff]">
              Fireball: {prediction.matchInfo.drawFireball}
            </div>
          ) : null}
          <div className="text-[12px] text-white/42">
            vs {prediction.matchInfo.drawDate} {prediction.matchInfo.drawWindow}
          </div>
        </div>
      ) : null}

      <div className="mt-4 text-[14px] leading-7 text-white/66">{getPredictionSummary(prediction)}</div>

      {timingProfile ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="rounded-full border border-[#ffbd39]/14 bg-[#1a140c] px-3 py-1 text-[11px] text-[#f5cf84]">
            {timingLabel}: {timingProfile.windowStart} — {timingProfile.windowEnd}
          </div>
          {onRefreshTiming ? (
            <button
              type="button"
              onClick={onRefreshTiming}
              disabled={refreshingTiming || (cooldownRemaining != null && cooldownRemaining > 0)}
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                refreshingTiming
                  ? 'animate-spin bg-[#3b82f6]/30 text-white/50'
                  : cooldownRemaining != null && cooldownRemaining > 0
                    ? 'bg-white/5 text-white/30 cursor-default'
                    : 'bg-[#3b82f6]/15 text-[#60a5fa] hover:bg-[#3b82f6]/25 animate-pulse'
              }`}
              title={
                cooldownRemaining != null && cooldownRemaining > 0
                  ? `${Math.ceil(cooldownRemaining / 3600000)}h remaining`
                  : 'Refresh timing window'
              }
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-4">
        <PickStatusPill status={status} createdAt={prediction.created_at} />

        <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#f2d29f] sm:gap-3 sm:text-[14px]">
          <button
            type="button"
            className={`rounded-full border px-3 py-2 font-medium transition-colors sm:px-4 ${
              isConfirmed
                ? 'border-[#85d36c]/25 bg-[#102117] text-[#85d36c]'
                : 'border-[#ffc742]/22 bg-[#ffc742]/10 text-[#ffd27e] hover:bg-[#ffc742]/16 hover:text-white'
            }`}
            onClick={() => onConfirmPlayed(prediction)}
            disabled={isConfirmed || isConfirming}
          >
            {isConfirmed ? 'Played' : isConfirming ? 'Confirming...' : 'I Played This'}
          </button>
          <button
            type="button"
            className="transition-colors hover:text-white"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Replay
          </button>
          <span className="text-white/18">|</span>
          <button
            type="button"
            className="transition-colors hover:text-white"
            onClick={() => onToggleSaved(prediction)}
          >
            {prediction.is_saved ? 'Unsave' : 'Save'}
          </button>
          <span className="text-white/18">|</span>
          <button
            type="button"
            className="transition-colors hover:text-[#ff8d7b]"
            onClick={() => onDelete(prediction)}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default function MyPicksPage() {
  const { currentTier } = useUserTier();
  const [selectedState, setSelectedState] = useState<FilterState>('ALL');
  const [selectedGame, setSelectedGame] = useState<FilterGame>('ALL');
  const [selectedWindow, setSelectedWindow] = useState<FilterWindow>('ALL');
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [playLogs, setPlayLogs] = useState<PlayLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmedPredictionIds, setConfirmedPredictionIds] = useState<string[]>([]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [confirmingPredictionId, setConfirmingPredictionId] = useState<string | null>(null);
  const [timingProfiles, setTimingProfiles] = useState<Record<string, { windowStart: string; windowEnd: string; sampleSize: number; confidence: string }>>({});
  const timingLabel = currentTier === 'master' ? 'TimePulse II' : 'TimePulse';
  const [timingRefreshCooldowns, setTimingRefreshCooldowns] = useState<Record<string, number>>({});
  const [refreshingTiming, setRefreshingTiming] = useState<string | null>(null);
  const gameOptions = useMemo(() => getGameOptions(), []);

  useEffect(() => {
    let cancelled = false;

    async function loadPredictions() {
      setLoading(true);
      setError(null);

      try {
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData.user?.id || '';
        const params = new URLSearchParams({ limit: '100' });
        const createdAfter = new Date();
        createdAfter.setDate(createdAfter.getDate() - 30);
        params.set('created_after', createdAfter.toISOString());
        params.set('saved', 'true');

        if (selectedState !== 'ALL') {
          params.set('state', selectedState);
        }

        if (selectedWindow !== 'ALL') {
          params.set('draw_window', selectedWindow);
        }

        const [predictionsResponse, playLogsResponse] = (await Promise.all([
          fetch(`/api/predictions?${params.toString()}`, {
            cache: 'no-store',
          }),
          supabase
            .from('play_logs')
            .select('id, prediction_id, is_settled, outcome_result_code, outcome_match_count, draw_date, created_at, metadata')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(120),
        ])) as [Response, QueryResult<PlayLogRecord[]>];

        const payload = await predictionsResponse.json();

        if (!predictionsResponse.ok) {
          throw new Error(payload?.error?.message || 'Failed to load picks');
        }

        const typedPlayLogsResponse = playLogsResponse as QueryResult<PlayLogRecord[]>;

        if (typedPlayLogsResponse.error) {
          throw typedPlayLogsResponse.error;
        }

        const data = Array.isArray(payload.data) ? payload.data : [];
        if (!cancelled) {
          setPredictions(data);
          const nextPlayLogs = (typedPlayLogsResponse.data || []) as PlayLogRecord[];
          setPlayLogs(nextPlayLogs);
          setConfirmedPredictionIds(
            nextPlayLogs
              .filter((entry) => Boolean(entry.prediction_id))
              .map((entry) => entry.prediction_id as string),
          );
        }
      } catch (loadError) {
        if (!cancelled) {
          setPredictions([]);
          setPlayLogs([]);
          setConfirmedPredictionIds([]);
          setError(loadError instanceof Error ? loadError.message : 'Failed to load picks');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPredictions();

    return () => {
      cancelled = true;
    };
  }, [selectedGame, selectedState, selectedWindow]);

  useEffect(() => {
    let cancelled = false;
    async function loadTiming() {
      const gameParam = selectedGame !== 'ALL' ? selectedGame : 'pick3';
      const stateParam = selectedState === 'ALL' ? 'NC' : selectedState;
      const res = await fetch(`/api/stats/timing?game=${gameParam}&state=${stateParam}&mode=${currentTier === 'master' ? 'master' : 'pro'}`);
      const payload = await res.json();
      if (!cancelled && payload.success) setTimingProfiles(payload.data || {});
    }
    loadTiming();
    return () => { cancelled = true; };
  }, [currentTier, selectedGame, selectedState]);

  const filteredPredictions = useMemo(() => {
    return predictions.filter((prediction) => {
      const gameMatches = matchesGameFilter(prediction.game, selectedGame);
      const windowMatches = selectedWindow === 'ALL' || normalizeDrawWindow(prediction.draw_time ?? null) === selectedWindow;
      return gameMatches && windowMatches;
    });
  }, [predictions, selectedGame, selectedWindow]);

  const savedCount = useMemo(() => filteredPredictions.length, [filteredPredictions]);

  const primaryGame = useMemo(() => {
    const first = filteredPredictions[0]?.game;
    return first ? formatGameLabel(first) : 'No game yet';
  }, [filteredPredictions]);

  const TIMING_COOLDOWN_MS = 36 * 60 * 60 * 1000;

  async function handleRefreshTiming(game: string, state: string) {
    const cacheKey = `brewlotto:timepulse-refresh-${game}-${state}`;
    const lastRefresh = parseInt(localStorage.getItem(cacheKey) || '0', 10);
    if (Date.now() - lastRefresh < TIMING_COOLDOWN_MS) return;

    setRefreshingTiming(`${game}-${state}`);
    localStorage.setItem(cacheKey, String(Date.now()));
    setTimingRefreshCooldowns((prev) => ({ ...prev, [`${game}-${state}`]: Date.now() }));

    try {
      const res = await fetch(`/api/stats/timing?game=${game}&state=${state}&mode=${currentTier === 'master' ? 'master' : 'pro'}`);
      const payload = await res.json();
      if (payload.success) setTimingProfiles(payload.data || {});
    } catch {
      // silently fail
    } finally {
      setRefreshingTiming(null);
    }
  }

  const groupedPredictions = useMemo(() => {
    return filteredPredictions.reduce<Array<{ createdAt: string | null; picks: PredictionRecord[] }>>((groups, prediction) => {
      const key = prediction.created_at ? new Date(prediction.created_at).toISOString().slice(0, 10) : 'unknown-date';
      const existing = groups.find((group) => {
        const groupKey = group.createdAt ? new Date(group.createdAt).toISOString().slice(0, 10) : 'unknown-date';
        return groupKey === key;
      });

      if (existing) {
        existing.picks.push(prediction);
        return groups;
      }

      groups.push({
        createdAt: prediction.created_at,
        picks: [prediction],
      });

      return groups;
    }, []);
  }, [filteredPredictions]);

  const savedDays = useMemo(() => groupedPredictions.length, [groupedPredictions]);

  const playLogMap = useMemo(() => {
    const map = new Map<string, PlayLogRecord>();

    for (const entry of playLogs) {
      if (entry.prediction_id) {
        map.set(entry.prediction_id, entry);
      }
    }

    return map;
  }, [playLogs]);

  async function handleToggleSaved(prediction: PredictionRecord) {
    const response = await fetch(`/api/predictions/${prediction.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_saved: !prediction.is_saved }),
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error?.message || 'Failed to update saved state');
    }

    setPredictions((current) =>
      current.filter((item) => item.id !== prediction.id),
    );
  }

  async function handleDelete(prediction: PredictionRecord) {
    const response = await fetch(`/api/predictions/${prediction.id}`, {
      method: 'DELETE',
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error?.message || 'Failed to delete pick');
    }

    setPredictions((current) => current.filter((item) => item.id !== prediction.id));
  }

  async function handleConfirmPlayed(prediction: PredictionRecord) {
    if (confirmedPredictionIds.includes(prediction.id)) {
      return;
    }

    setActionMessage(null);
    setConfirmingPredictionId(prediction.id);

    try {
      const drawDate = prediction.created_at ? new Date(prediction.created_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);

      const response = await fetch('/api/play/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: prediction.game || 'pick3',
          draw_date: drawDate,
          strategy: prediction.source_strategy_key || 'my_picks_confirm',
          numbers: prediction.predicted_numbers || [],
          amount_spent: null,
          outcome: null,
          prize: null,
          prediction_id: prediction.id,
          draw_type: null,
          add_on: null,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error?.message || 'Failed to confirm play');
      }

      setConfirmedPredictionIds((current) => [...current, prediction.id]);
      setActionMessage('Play confirmed. Brew will use this as the canonical play history entry for the selected draw date.');
    } catch (confirmError) {
      setActionMessage(confirmError instanceof Error ? confirmError.message : 'Failed to confirm play');
    } finally {
      setConfirmingPredictionId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DashboardContainer>
        <Header />
        <NavigationTabs />

        <div className="mb-5 mt-2 text-[40px] font-medium tracking-[-0.03em] text-[#f8cf98]">
          My Picks
        </div>

        <div className="mb-5 flex flex-wrap gap-3">
          <select
            value={selectedState}
            onChange={(event) => setSelectedState(event.target.value as FilterState)}
            className="rounded-full border border-[#ffbd39]/25 bg-[#120e0e]/85 px-4 py-3 text-[15px] text-[#ffd27e] shadow-[0_0_12px_rgba(255,184,28,0.08)] outline-none"
          >
            {STATE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={selectedGame}
            onChange={(event) => setSelectedGame(event.target.value as FilterGame)}
            className="rounded-full border border-[#ffbd39]/25 bg-[#120e0e]/85 px-4 py-3 text-[15px] text-[#ffd27e] shadow-[0_0_12px_rgba(255,184,28,0.08)] outline-none"
          >
            {gameOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value === 'ALL' ? option.label : option.label}
              </option>
            ))}
          </select>

          {selectedGame === 'pick3' || selectedGame === 'pick4' ? (
            <div className="flex gap-1.5 self-center">
              <button
                type="button"
                onClick={() => setSelectedWindow('ALL')}
                className={`rounded-full px-3 py-1.5 text-[12px] font-medium uppercase tracking-[0.06em] transition-all ${
                  selectedWindow === 'ALL'
                    ? 'bg-[#ffbd39]/15 text-[#ffbd39]'
                    : 'bg-white/[0.04] text-white/45 hover:bg-white/[0.08] hover:text-white/70'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSelectedWindow('midday')}
                className={`rounded-full px-3 py-1.5 text-[12px] font-medium uppercase tracking-[0.06em] transition-all ${
                  selectedWindow === 'midday'
                  ? 'bg-[#ffbd39]/15 text-[#ffbd39]'
                  : 'bg-white/[0.04] text-white/45 hover:bg-white/[0.08] hover:text-white/70'
              }`}
            >
              Midday
            </button>
            <button
              type="button"
              onClick={() => setSelectedWindow('evening')}
              className={`rounded-full px-3 py-1.5 text-[12px] font-medium uppercase tracking-[0.06em] transition-all ${
                selectedWindow === 'evening'
                  ? 'bg-[#ffbd39]/15 text-[#ffbd39]'
                  : 'bg-white/[0.04] text-white/45 hover:bg-white/[0.08] hover:text-white/70'
              }`}
            >
              Evening
            </button>
            </div>
          ) : null}
        </div>

        <div className="mb-6 flex rounded-full border border-[#ffbd39]/25 bg-[linear-gradient(145deg,rgba(35,19,12,0.74),rgba(10,8,8,0.92))] shadow-[0_0_18px_rgba(255,184,28,0.08)]">
          <SummaryMetric label="Saved Picks" value={String(savedCount)} />
          <div className="my-4 w-px bg-white/10" />
          <SummaryMetric label="Saved Days" value={String(savedDays)} />
          <div className="my-4 w-px bg-white/10" />
          <SummaryMetric label="Latest Game" value={filteredPredictions.length > 0 ? primaryGame : '--'} />
        </div>

        {actionMessage ? (
          <div className="mb-5 rounded-[22px] border border-[#53d48a]/20 bg-[#102117] px-4 py-3 text-[14px] leading-6 text-[#c8f4d8]">
            {actionMessage}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/55">
            Loading saved Brew picks...
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-[#ff8d7b]/25 bg-[#2a120d]/60 px-5 py-8 text-center text-[#ffc4b8]">
            {error}
          </div>
        ) : predictions.length === 0 ? (
          <div className="rounded-[30px] border border-[#ffbd39]/22 bg-[linear-gradient(145deg,rgba(32,19,13,0.82),rgba(13,10,10,0.96))] px-6 py-8 text-center shadow-[0_0_22px_rgba(255,184,28,0.08)]">
            <div className="text-[36px] font-semibold tracking-[-0.03em] text-[#f6d29f]">No picks yet</div>
            <div className="mx-auto mt-3 max-w-[280px] text-[17px] leading-8 text-white/68">
              You haven&apos;t saved any picks for this filter set yet. Save a Strategy Locker result first if you want it to appear here and be eligible for play confirmation.
            </div>
            <Link
              href={
                selectedGame !== 'ALL' || selectedState !== 'ALL'
                  ? `/strategy-locker?game=${selectedGame === 'mega_millions' ? 'mega' : selectedGame}&state=${selectedState === 'ALL' ? 'NC' : selectedState}`
                  : '/strategy-locker'
              }
              className="mt-6 inline-flex rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-8 py-3 text-[17px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.22)]"
            >
              Open Strategy Locker →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedPredictions.map((group) => (
              <section key={group.createdAt || 'unknown-date'} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#ffbd39]/35 to-transparent" />
                  <div className="rounded-full border border-[#ffbd39]/20 bg-[#24160f] px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#f7d6ab]">
                    {formatPickGroupDate(group.createdAt)}
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#ffbd39]/35 to-transparent" />
                </div>

                <div className="space-y-4">
                  {group.picks.map((prediction) => {
                    const timingProfileKey = getTimingProfileKey(prediction.source_strategy_key);

                    return (
                      <PickCard
                        key={prediction.id}
                        prediction={prediction}
                        playLog={playLogMap.get(prediction.id) || null}
                        isConfirmed={confirmedPredictionIds.includes(prediction.id)}
                        isConfirming={confirmingPredictionId === prediction.id}
                        onToggleSaved={handleToggleSaved}
                        onConfirmPlayed={handleConfirmPlayed}
                        onDelete={handleDelete}
                        timingLabel={timingLabel}
                        timingProfile={timingProfileKey ? timingProfiles[timingProfileKey] || null : null}
                        onRefreshTiming={() => {
                          const game = prediction.game === 'mega_millions' ? 'mega' : prediction.game || 'pick3';
                          const state = prediction.state || 'NC';
                          handleRefreshTiming(game, state);
                        }}
                        refreshingTiming={refreshingTiming === `${prediction.game || 'pick3'}-${prediction.state || 'NC'}`}
                        cooldownRemaining={(() => {
                          const game = prediction.game === 'mega_millions' ? 'mega' : prediction.game || 'pick3';
                          const state = prediction.state || 'NC';
                          const cacheKey = `brewlotto:timepulse-refresh-${game}-${state}`;
                          const last = parseInt(localStorage.getItem(cacheKey) || '0', 10);
                          return last ? 36 * 60 * 60 * 1000 - (Date.now() - last) : 0;
                        })()}
                      />
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </DashboardContainer>
    </main>
  );
}
