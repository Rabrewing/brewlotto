'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  DashboardContainer,
  Header,
  NavigationTabs,
  GameTabs,
  type GameId,
  LotteryBall,
  LiveTrustBadge,
  FreshnessBanner,
} from '@/components/brewlotto/dashboard';
import { resolveDashboardGameConfig } from '@/lib/dashboard/game-config';
import { normalizePreferredStateCode, usePreferredState } from '@/hooks/usePreferredState';

interface DrawEntry {
  drawDate: string | null;
  drawnAt: string | null;
  windowLabel: string | null;
  primaryNumbers: number[];
  bonusNumber: number | null;
  fireballValue?: number | null;
  bonusLabel: string;
}

interface MatchCountEntry {
  drawDate: string | null;
  matchCount: number;
  bonusMatch: boolean;
  predictedNumbers: number[];
}

interface ResultsPayload {
  draws: DrawEntry[];
  closestPrediction: {
    id: string;
    game: string | null;
    state: string | null;
    createdAt: string | null;
    strategyLabel: string | null;
    confidenceScore: number | null;
    primaryNumbers: number[];
    bonusNumber: number | null;
    matchCount: number;
    bonusMatch: boolean;
    isSaved: boolean;
  } | null;
  matchCount: number;
  matchCounts: MatchCountEntry[];
  insights: string[];
  freshness?: {
    status: 'healthy' | 'delayed' | 'stale' | 'failed' | 'unknown';
    stalenessMinutes: number | null;
    expectedNextDrawAt: string | null;
  };
}

type HistoryRange = 90 | 180;

const WINDOW_ORDER = {
  midday: 0,
  evening: 1,
} as const;

const EMPTY_RESULTS: ResultsPayload = {
  draws: [],
  closestPrediction: null,
  matchCount: 0,
  matchCounts: [],
  insights: [],
  freshness: undefined,
};

function formatDrawTime(value: string | null) {
  if (!value) return 'Time unavailable';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDrawDate(value: string | null) {
  if (!value) return 'Date unavailable';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ResultsPage() {
  const { preferredState } = usePreferredState();
  const preferredStateCode = normalizePreferredStateCode(preferredState);
  const [selectedGame, setSelectedGame] = useState<GameId>('pick3');
  const [selectedWindow, setSelectedWindow] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gameParam = params.get('game') as GameId | null;
    if (gameParam && ['pick3', 'pick4', 'cash5', 'powerball', 'mega'].includes(gameParam)) {
      setSelectedGame(gameParam);
    }
  }, []);
  const [historyDays, setHistoryDays] = useState<HistoryRange>(180);
  const [results, setResults] = useState<ResultsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadResults() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/results?game=${selectedGame}&state=${preferredStateCode}&history_days=${historyDays}`, {
          cache: 'no-store',
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error?.message || 'Failed to load results');
        }

        if (!cancelled) {
          setResults(payload.data || null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setResults(null);
          setError(loadError instanceof Error ? loadError.message : 'Failed to load results');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadResults();

    const interval = setInterval(() => {
      if (!cancelled) loadResults();
    }, 120000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [historyDays, selectedGame, preferredStateCode]);

  useEffect(() => {
    setSelectedWindow(null);
  }, [selectedGame, preferredStateCode]);

  const gameConfig = resolveDashboardGameConfig(selectedGame, preferredStateCode) || resolveDashboardGameConfig('pick3', 'NC')!;
  const resultsData = results || EMPTY_RESULTS;
  const showBonus = selectedGame === 'powerball' || selectedGame === 'mega';
  const freshnessBlocked = resultsData.freshness && (resultsData.freshness.status === 'stale' || resultsData.freshness.status === 'failed');
  const draws = resultsData.draws;

  const windowLabels = [...new Set(draws.map((d) => d.windowLabel).filter(Boolean))].sort((a, b) => {
    const left = WINDOW_ORDER[(a || '').toLowerCase() as keyof typeof WINDOW_ORDER] ?? 99;
    const right = WINDOW_ORDER[(b || '').toLowerCase() as keyof typeof WINDOW_ORDER] ?? 99;
    return left - right;
  }) as string[];
  const activeWindow = selectedWindow || windowLabels[0] || null;
  const filteredDraws = activeWindow ? draws.filter(d => d.windowLabel === activeWindow) : draws;
  const latestDraw = draws[0] || null;
  const closestPredictionAfterDraw = Boolean(
    results?.closestPrediction?.createdAt &&
      latestDraw?.drawDate &&
      new Date(results.closestPrediction.createdAt).getTime() >
        new Date(`${latestDraw.drawDate}T23:59:59`).getTime(),
  );

  const windowDisplayName: Record<string, string> = {
    midday: 'Midday',
    day: 'Midday',
    evening: 'Evening',
    daily: 'Nightly',
    nightly: 'Nightly',
  };
  const groupedDraws = filteredDraws.reduce<Array<{ drawDate: string | null; draws: Array<{ draw: DrawEntry; index: number }> }>>((groups, draw, index) => {
    const key = draw.drawDate || 'unknown-date';
    const existing = groups.find((group) => (group.drawDate || 'unknown-date') === key);

    if (existing) {
      existing.draws.push({ draw, index });
      return groups;
    }

    groups.push({
      drawDate: draw.drawDate,
      draws: [{ draw, index }],
    });

    return groups;
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DashboardContainer>
        <Header />
        <NavigationTabs />

        <div className="mb-5 mt-2 text-[40px] font-medium tracking-[-0.03em] text-[#f8cf98]">
          Today&apos;s Results
        </div>

        <FreshnessBanner
          status={results?.freshness?.status || 'unknown'}
          stalenessMinutes={results?.freshness?.stalenessMinutes || null}
          expectedNextDrawAt={results?.freshness?.expectedNextDrawAt || null}
          loading={loading}
          stateCode={preferredStateCode}
        />

        <GameTabs selectedGame={selectedGame} onSelect={setSelectedGame} stateCode={preferredStateCode} />

        <div className="mb-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setHistoryDays(90)}
            className={`rounded-full border px-4 py-2 text-[13px] font-medium uppercase tracking-[0.08em] transition-all ${
              historyDays === 90
                ? 'border-[#ffbd39]/30 bg-[#ffbd39]/12 text-[#ffd27e]'
                : 'border-white/10 bg-white/[0.04] text-white/55 hover:text-white'
            }`}
          >
            3 Months
          </button>
          <button
            type="button"
            onClick={() => setHistoryDays(180)}
            className={`rounded-full border px-4 py-2 text-[13px] font-medium uppercase tracking-[0.08em] transition-all ${
              historyDays === 180
                ? 'border-[#ffbd39]/30 bg-[#ffbd39]/12 text-[#ffd27e]'
                : 'border-white/10 bg-white/[0.04] text-white/55 hover:text-white'
            }`}
          >
            6 Months
          </button>
          <div className="flex items-center px-2 text-[12px] uppercase tracking-[0.14em] text-white/35">
            Showing {historyDays} days of draw history
          </div>
        </div>

        {windowLabels.length > 1 ? (
          <div className="-mt-2 mb-5 flex gap-1.5">
            {windowLabels.map((w) => {
              const active = activeWindow === w;
              return (
                <button
                  key={w}
                  onClick={() => setSelectedWindow(w)}
                  className={`rounded-full px-4 py-1.5 text-[13px] font-medium uppercase tracking-[0.06em] transition-all ${
                    active
                      ? 'bg-[#ffbd39]/15 text-[#ffbd39] shadow-[0_0_10px_rgba(255,184,28,0.08)]'
                      : 'bg-white/[0.04] text-white/45 hover:bg-white/[0.08] hover:text-white/70'
                  }`}
                >
                  {windowDisplayName[w] || w}
                </button>
              );
            })}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/55">
            Loading latest draw results...
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-[#ff8d7b]/25 bg-[#2a120d]/60 px-5 py-8 text-center text-[#ffc4b8]">
            {error}
          </div>
        ) : filteredDraws.length === 0 ? (
          <div className={`rounded-[28px] px-5 py-8 text-center ${freshnessBlocked ? 'border border-[#ff8d7b]/25 bg-[#2a120d]/60 text-[#ffc4b8]' : 'border border-white/10 bg-white/[0.03] text-white/55'}`}>
            {freshnessBlocked
              ? resultsData.insights?.[0] || `Official ${gameConfig.displayLabel} results are temporarily withheld until freshness returns to healthy.`
              : draws.length > 0
                ? `No ${windowDisplayName[activeWindow || ''] || ''} draw available yet.`
                : `No official draw is available yet for ${gameConfig.displayLabel}.`}
          </div>
        ) : (
          <div className="space-y-7">
            {groupedDraws.map((group) => (
              <section key={group.drawDate || 'unknown-date'} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#ffbd39]/35 to-transparent" />
                  <div className="rounded-full border border-[#ffbd39]/20 bg-[#24160f] px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#f7d6ab]">
                    {formatDrawDate(group.drawDate)}
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#ffbd39]/35 to-transparent" />
                </div>

                <div className="space-y-5">
                  {group.draws.map(({ draw, index }) => {
                    const matchCountEntry = resultsData.matchCounts?.[index] || null;
                    return (
                      <section
                        key={`${draw.drawDate}-${draw.windowLabel || index}`}
                        className="rounded-[28px] border border-[#ffbd39]/22 bg-[linear-gradient(145deg,rgba(32,19,13,0.82),rgba(13,10,10,0.96))] px-5 py-4 shadow-[0_0_22px_rgba(255,184,28,0.08)]"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="text-[16px] font-semibold text-[#f7d6ab]">
                            {gameConfig.displayLabel}
                            <span className="ml-1 text-white/45">• {gameConfig.statsStateCode}</span>
                          </div>
                          <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] uppercase tracking-[0.12em] text-white/55">
                            {formatDrawTime(draw.drawnAt)}
                          </div>
                        </div>

                        {draw.windowLabel ? (
                          <div className="mt-1 text-[13px] font-medium uppercase tracking-[0.06em] text-[#ffbd39]/70">
                            {draw.windowLabel} Draw
                          </div>
                        ) : null}

                        <div className="mt-4 flex flex-wrap items-start gap-2">
                          {draw.primaryNumbers.map((value, i) => (
                            <LotteryBall key={`draw-${index}-${value}-${i}`} number={value} variant="hot" size="tiny" />
                          ))}
                            {showBonus && draw.bonusNumber !== null ? (
                              <LotteryBall
                                number={draw.bonusNumber}
                                variant="bonus-hot"
                                size="tiny"
                                label={draw.bonusLabel}
                              />
                            ) : null}
                            {gameConfig.statsStateCode === 'NC' && (selectedGame === 'pick3' || selectedGame === 'pick4') ? (
                              draw.fireballValue !== null && draw.fireballValue !== undefined ? (
                                <div className="rounded-full border border-[#72caff]/18 bg-[#111f28] px-3 py-1 text-[12px] uppercase tracking-[0.12em] text-[#9edcff]">
                                  Fireball: {draw.fireballValue}
                                </div>
                              ) : (
                                <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[12px] uppercase tracking-[0.12em] text-white/45">
                                  Fireball not drawn
                                </div>
                              )
                            ) : null}
                          </div>

                        <div className="mt-4 text-[13px] text-white/50">
                          Drawn: {formatDrawTime(draw.drawnAt)} • {formatDrawDate(draw.drawDate)}
                        </div>

                        {matchCountEntry ? (
                          <div className="mt-2 text-[13px] text-[#ffd27e]">
                            Closest pick matched {matchCountEntry.matchCount} number{matchCountEntry.matchCount === 1 ? '' : 's'}
                            {showBonus && matchCountEntry.bonusMatch ? ' + bonus' : ''}
                          </div>
                        ) : null}
                      </section>
                    );
                  })}
                </div>
              </section>
            ))}

            <section>
              <div className="mb-3 text-[18px] font-medium text-[#f7d6ab]">
                {resultsData.closestPrediction
                  ? `You matched: ${resultsData.matchCount} number${resultsData.matchCount === 1 ? '' : 's'}`
                  : 'No nearby Brew pick found yet'}
              </div>

              {resultsData.closestPrediction ? (
                <div className="rounded-[28px] border border-[#72caff]/20 bg-[linear-gradient(145deg,rgba(19,22,31,0.76),rgba(10,10,12,0.96))] px-5 py-4 shadow-[0_0_22px_rgba(114,202,255,0.06)]">
                  <div className="text-[16px] font-semibold text-[#d8e6f8]">Closest Pick</div>
                  <div className="mt-1 text-[13px] text-white/52">
                    Generated on {formatDrawDate(resultsData.closestPrediction.createdAt)} • confirm in My Picks if you actually played this draw
                  </div>
                  <div className="mt-5 flex flex-wrap items-start gap-2">
                    {resultsData.closestPrediction.primaryNumbers.map((value, i) => (
                      <LotteryBall key={`pick-${value}-${i}`} number={value} variant="cold" size="tiny" />
                    ))}
                    {showBonus && resultsData.closestPrediction.bonusNumber !== null ? (
                      <LotteryBall
                        number={resultsData.closestPrediction.bonusNumber}
                        variant="bonus-cold"
                        size="tiny"
                        label={gameConfig.bonusLabel}
                      />
                    ) : null}
                  </div>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-4 text-[15px]">
                    <div className="text-[#ffd27e]">
                      Closest match: {resultsData.closestPrediction.matchCount} number{resultsData.closestPrediction.matchCount === 1 ? '' : 's'}
                    </div>
                    <div className="flex items-center gap-3 text-[#d9c39a]">
                      <Link href="/dashboard" className="transition-colors hover:text-white">Replay</Link>
                      <span className="text-white/18">|</span>
                      <Link href="/my-picks" className="transition-colors hover:text-white">View Picks</Link>
                    </div>
                  </div>
                  {closestPredictionAfterDraw ? (
                    <div className="mt-3 rounded-[18px] border border-[#ffbd39]/18 bg-[#24160f] px-4 py-3 text-[13px] leading-6 text-[#f3d7a7]">
                      Brew generated this pick after the current draw window, so it is a pattern match only until you confirm a real play in My Picks.
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-6 text-white/55">
                  Brew has no stored prediction close to this draw yet. Generate more picks from the dashboard to improve match tracking.
                </div>
              )}
            </section>

            <section className="rounded-[28px] border border-[#ffbd39]/18 bg-[linear-gradient(145deg,rgba(28,18,14,0.75),rgba(12,10,10,0.95))] px-5 py-4 shadow-[0_0_20px_rgba(255,184,28,0.05)]">
              <div className="mb-4 text-[18px] font-medium text-[#f7d6ab]">Insights</div>
              <div className="space-y-3 text-[16px] text-white/78">
                {resultsData.insights.map((insight) => (
                  <div key={insight} className="flex items-start gap-3">
                    <span className="mt-1 text-[#ffc742]">✦</span>
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </section>

            {latestDraw ? (
              <div className="mt-2 mb-4">
                <LiveTrustBadge
                  status={resultsData.freshness?.status || 'unknown'}
                  latestDrawDate={latestDraw.drawDate}
                  stalenessMinutes={resultsData.freshness?.stalenessMinutes}
                  expectedNextDrawAt={resultsData.freshness?.expectedNextDrawAt}
                  stateCode={preferredStateCode}
                />
              </div>
            ) : null}

            <section className="rounded-[28px] border border-[#ffbd39]/18 bg-[linear-gradient(145deg,rgba(30,19,12,0.76),rgba(12,10,10,0.95))] px-6 py-6 text-center shadow-[0_0_20px_rgba(255,184,28,0.05)]">
              <div className="text-[20px] font-medium text-[#f7d6ab]">Don&apos;t miss the next drawing.</div>
              <div className="mt-3 text-[15px] text-white/60">
                Notifications are planned in the next account-support phase. Use BrewCommand and freshness status for now.
              </div>
              <Link
                href="/dashboard"
                className="mt-5 inline-flex rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-8 py-3 text-[17px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.22)]"
              >
                Back to Dashboard
              </Link>
            </section>
          </div>
        )}
      </DashboardContainer>
    </main>
  );
}
