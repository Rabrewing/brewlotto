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
} from '@/components/brewlotto/dashboard';
import { DASHBOARD_GAME_CONFIG } from '@/lib/dashboard/game-config';

interface ResultsPayload {
  latestDraw: {
    game: string;
    state: string;
    drawnAt: string | null;
    drawDate: string | null;
    primaryNumbers: number[];
    bonusNumber: number | null;
    bonusLabel: string;
  } | null;
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
  insights: string[];
  freshness?: {
    status: 'healthy' | 'delayed' | 'stale' | 'failed' | 'unknown';
    stalenessMinutes: number | null;
    expectedNextDrawAt: string | null;
  };
}

function formatDrawTime(value: string | null) {
  if (!value) {
    return 'Time unavailable';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function ResultsPage() {
  const [selectedGame, setSelectedGame] = useState<GameId>('powerball');
  const [results, setResults] = useState<ResultsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadResults() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/results?game=${selectedGame}`, { cache: 'no-store' });
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

    return () => {
      cancelled = true;
    };
  }, [selectedGame]);

  const gameConfig = DASHBOARD_GAME_CONFIG[selectedGame];
  const showBonus = selectedGame === 'powerball' || selectedGame === 'mega';
  const freshnessBlocked = results?.freshness && results.freshness.status !== 'healthy';

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DashboardContainer>
        <Header />
        <NavigationTabs />

        <div className="mb-5 mt-2 text-[40px] font-medium tracking-[-0.03em] text-[#f8cf98]">
          Today&apos;s Results
        </div>

        <GameTabs selectedGame={selectedGame} onSelect={setSelectedGame} />

        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/55">
            Loading latest draw results...
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-[#ff8d7b]/25 bg-[#2a120d]/60 px-5 py-8 text-center text-[#ffc4b8]">
            {error}
          </div>
        ) : !results?.latestDraw ? (
          <div className={`rounded-[28px] px-5 py-8 text-center ${freshnessBlocked ? 'border border-[#ff8d7b]/25 bg-[#2a120d]/60 text-[#ffc4b8]' : 'border border-white/10 bg-white/[0.03] text-white/55'}`}>
            {freshnessBlocked
              ? results?.insights?.[0] || `Official ${gameConfig.displayLabel} results are temporarily withheld until freshness returns to healthy.`
              : `No official draw is available yet for ${gameConfig.displayLabel}.`}
          </div>
        ) : (
          <div className="space-y-5">
            <section className="rounded-[28px] border border-[#ffbd39]/22 bg-[linear-gradient(145deg,rgba(32,19,13,0.82),rgba(13,10,10,0.96))] px-5 py-4 shadow-[0_0_22px_rgba(255,184,28,0.08)]">
              <div className="text-[16px] font-semibold text-[#f7d6ab]">
                {results.latestDraw.game}
                <span className="ml-1 text-white/45">• {results.latestDraw.state}</span>
              </div>
              <div className="mt-5 flex flex-wrap items-start gap-3">
                {results.latestDraw.primaryNumbers.map((value, index) => (
                  <LotteryBall key={`draw-${value}-${index}`} number={value} variant="hot" size="small" />
                ))}
                {showBonus && results.latestDraw.bonusNumber !== null ? (
                  <LotteryBall
                    number={results.latestDraw.bonusNumber}
                    variant="bonus-hot"
                    size="small"
                    label={results.latestDraw.bonusLabel}
                  />
                ) : null}
              </div>
              <div className="mt-5 text-[15px] text-white/58">Drawn: {formatDrawTime(results.latestDraw.drawnAt)}</div>
            </section>

            <section>
              <div className="mb-3 text-[18px] font-medium text-[#f7d6ab]">
                {results.closestPrediction
                  ? `You matched: ${results.matchCount} number${results.matchCount === 1 ? '' : 's'}`
                  : 'No nearby Brew pick found yet'}
              </div>

              {results.closestPrediction ? (
                <div className="rounded-[28px] border border-[#72caff]/20 bg-[linear-gradient(145deg,rgba(19,22,31,0.76),rgba(10,10,12,0.96))] px-5 py-4 shadow-[0_0_22px_rgba(114,202,255,0.06)]">
                  <div className="text-[16px] font-semibold text-[#d8e6f8]">Closest Pick</div>
                  <div className="mt-5 flex flex-wrap items-start gap-3">
                    {results.closestPrediction.primaryNumbers.map((value, index) => (
                      <LotteryBall key={`pick-${value}-${index}`} number={value} variant="cold" size="small" />
                    ))}
                    {showBonus && results.closestPrediction.bonusNumber !== null ? (
                      <LotteryBall
                        number={results.closestPrediction.bonusNumber}
                        variant="bonus-cold"
                        size="small"
                        label={gameConfig.bonusLabel}
                      />
                    ) : null}
                  </div>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-4 text-[15px]">
                    <div className="text-[#ffd27e]">
                      Closest match: {results.closestPrediction.matchCount} number{results.closestPrediction.matchCount === 1 ? '' : 's'}
                    </div>
                    <div className="flex items-center gap-3 text-[#d9c39a]">
                      <Link href="/dashboard" className="transition-colors hover:text-white">Replay</Link>
                      <span className="text-white/18">|</span>
                      <Link href="/my-picks" className="transition-colors hover:text-white">View Picks</Link>
                    </div>
                  </div>
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
                {results.insights.map((insight) => (
                  <div key={insight} className="flex items-start gap-3">
                    <span className="mt-1 text-[#ffc742]">✦</span>
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </section>

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
