'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  DashboardContainer,
  Header,
  NavigationTabs,
  LotteryBall,
} from '@/components/brewlotto/dashboard';

type FilterState = 'ALL' | 'NC' | 'MULTI';
type FilterGame = 'ALL' | 'pick3' | 'pick4' | 'cash5' | 'powerball' | 'mega_millions';
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
  prediction_explanations?: PredictionExplanation[] | null;
  prediction_strategy_scores?: StrategyScore[] | null;
}

const GAME_OPTIONS: Array<{ value: FilterGame; label: string }> = [
  { value: 'ALL', label: 'All Games' },
  { value: 'powerball', label: 'Powerball' },
  { value: 'mega_millions', label: 'Mega Millions' },
  { value: 'cash5', label: 'Cash 5' },
  { value: 'pick4', label: 'Pick 4' },
  { value: 'pick3', label: 'Pick 3' },
];

const STATE_OPTIONS: Array<{ value: FilterState; label: string }> = [
  { value: 'ALL', label: 'All States' },
  { value: 'NC', label: 'NC' },
  { value: 'MULTI', label: 'Multi-State' },
];

function formatGameLabel(game: string | null) {
  if (!game) {
    return 'Unknown Game';
  }

  switch (game) {
    case 'powerball':
      return 'Powerball';
    case 'mega_millions':
      return 'Mega Millions';
    case 'cash5':
      return 'Cash 5';
    case 'pick3':
      return 'Pick 3';
    case 'pick4':
      return 'Pick 4';
    default:
      return game;
  }
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
    return `Generated using ${prediction.source_strategy_key} strategy signals.`;
  }

  return 'Stored Brew pick ready for replay or save actions.';
}

function getPickStatus(prediction: PredictionRecord): PickStatus {
  return prediction.is_saved ? 'saved' : 'pending';
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

function PickCard({
  prediction,
  isConfirmed,
  isConfirming,
  onToggleSaved,
  onConfirmPlayed,
  onDelete,
}: {
  prediction: PredictionRecord;
  isConfirmed: boolean;
  isConfirming: boolean;
  onToggleSaved: (prediction: PredictionRecord) => Promise<void>;
  onConfirmPlayed: (prediction: PredictionRecord) => Promise<void>;
  onDelete: (prediction: PredictionRecord) => Promise<void>;
}) {
  const numbers = Array.isArray(prediction.predicted_numbers) ? prediction.predicted_numbers : [];
  const hasBonus = prediction.bonus_number !== null && prediction.bonus_number !== undefined;
  const status = getPickStatus(prediction);

  return (
    <article className="rounded-[28px] border border-[#ffbd39]/22 bg-[linear-gradient(145deg,rgba(32,19,13,0.82),rgba(13,10,10,0.96))] px-5 py-4 shadow-[0_0_22px_rgba(255,184,28,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[16px] font-semibold text-[#f7d6ab]">
            {formatGameLabel(prediction.game)}
            <span className="ml-1 text-white/45">• {prediction.state || 'N/A'}</span>
          </div>
          <div className="mt-1 text-[12px] uppercase tracking-[0.14em] text-white/35">
            {prediction.source_strategy_key || 'brew strategy'}
            {prediction.confidence_score !== null && prediction.confidence_score !== undefined
              ? ` • ${Math.round(Number(prediction.confidence_score))}% confidence`
              : ''}
          </div>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-white/38">
          {status}
        </div>
      </div>

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

      <div className="mt-4 text-[14px] leading-7 text-white/66">{getPredictionSummary(prediction)}</div>

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
  const [selectedState, setSelectedState] = useState<FilterState>('ALL');
  const [selectedGame, setSelectedGame] = useState<FilterGame>('ALL');
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmedPredictionIds, setConfirmedPredictionIds] = useState<string[]>([]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [confirmingPredictionId, setConfirmingPredictionId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPredictions() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ limit: '100' });
        const createdAfter = new Date();
        createdAfter.setDate(createdAfter.getDate() - 30);
        params.set('created_after', createdAfter.toISOString());
        params.set('saved', 'true');

        if (selectedState !== 'ALL') {
          params.set('state', selectedState);
        }

        if (selectedGame !== 'ALL') {
          params.set('game', selectedGame);
        }

        const response = await fetch(`/api/predictions?${params.toString()}`, {
          cache: 'no-store',
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error?.message || 'Failed to load picks');
        }

        const data = Array.isArray(payload.data) ? payload.data : [];
        if (!cancelled) {
          setPredictions(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setPredictions([]);
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
  }, [selectedGame, selectedState]);

  const savedCount = useMemo(() => predictions.length, [predictions]);

  const primaryGame = useMemo(() => {
    const first = predictions[0]?.game;
    return first ? formatGameLabel(first) : 'No game yet';
  }, [predictions]);

  const groupedPredictions = useMemo(() => {
    return predictions.reduce<Array<{ createdAt: string | null; picks: PredictionRecord[] }>>((groups, prediction) => {
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
  }, [predictions]);

  const savedDays = useMemo(() => groupedPredictions.length, [groupedPredictions]);

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
            {GAME_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6 flex rounded-full border border-[#ffbd39]/25 bg-[linear-gradient(145deg,rgba(35,19,12,0.74),rgba(10,8,8,0.92))] shadow-[0_0_18px_rgba(255,184,28,0.08)]">
          <SummaryMetric label="Saved Picks" value={String(savedCount)} />
          <div className="my-4 w-px bg-white/10" />
          <SummaryMetric label="Saved Days" value={String(savedDays)} />
          <div className="my-4 w-px bg-white/10" />
          <SummaryMetric label="Latest Game" value={predictions.length > 0 ? primaryGame : '--'} />
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
              href="/strategy-locker"
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
                  {group.picks.map((prediction) => (
                    <PickCard
                      key={prediction.id}
                      prediction={prediction}
                      isConfirmed={confirmedPredictionIds.includes(prediction.id)}
                      isConfirming={confirmingPredictionId === prediction.id}
                      onToggleSaved={handleToggleSaved}
                      onConfirmPlayed={handleConfirmPlayed}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </DashboardContainer>
    </main>
  );
}
