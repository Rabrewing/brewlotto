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
  email?: string;
}

interface PlayLogRecord {
  id: string;
  game: string;
  state: string;
  created_at: string;
  is_settled: boolean;
  outcome_match_count?: number | null;
  outcome_bonus_match?: boolean | null;
  outcome_payout_amount?: number | null;
}

interface PickResultRecord {
  id: string;
  game: string;
  state: string;
  draw_date: string;
  is_win: boolean;
  match_count: number;
  bonus_match: boolean;
  result_code?: string | null;
}

interface DailyStatRecord {
  stat_date: string;
  picks_count: number;
  wins_count: number;
  partial_hits_count: number;
  exact_hits_count: number;
  accuracy: number;
  current_streak: number;
}

interface PredictionRecord {
  id: string;
  game: string;
  state: string;
  created_at: string;
  source_strategy_key?: string | null;
  confidence_score?: number | null;
  is_saved: boolean;
}

interface StatCardProps {
  label: string;
  value: string;
  helper: string;
}

type GameSummary = {
  key: string;
  label: string;
  plays: number;
  wins: number;
  bestMatch: number;
};

type StrategySummary = {
  strategy: string;
  uses: number;
  savedCount: number;
  averageConfidence: number | null;
};

function formatGameLabel(game: string) {
  switch (game) {
    case 'powerball':
      return 'Powerball';
    case 'mega_millions':
      return 'Mega Millions';
    case 'cash5':
      return 'Cash 5';
    case 'pick4':
      return 'Pick 4';
    case 'pick3':
      return 'Pick 3';
    case 'daily3':
      return 'Daily 3';
    case 'daily4':
      return 'Daily 4';
    case 'fantasy5':
      return 'Fantasy 5';
    default:
      return game;
  }
}

function formatDayLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <div className="flex-1 rounded-[24px] border border-[#ffbd39]/16 bg-[linear-gradient(145deg,rgba(27,19,14,0.8),rgba(11,10,10,0.96))] px-4 py-4 shadow-[0_0_18px_rgba(255,184,28,0.04)]">
      <div className="text-[11px] uppercase tracking-[0.16em] text-white/35">{label}</div>
      <div className="mt-3 text-[28px] font-semibold text-[#ffd27e]">{value}</div>
      <div className="mt-2 text-[13px] leading-6 text-white/52">{helper}</div>
    </div>
  );
}

export default function StatsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [playLogs, setPlayLogs] = useState<PlayLogRecord[]>([]);
  const [pickResults, setPickResults] = useState<PickResultRecord[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStatRecord[]>([]);
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
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
            setError('You need to sign in before Brew can show personal performance data.');
          }
          return;
        }

        const [playLogsResult, pickResultsResult, dailyStatsResult, predictionsResult] = await Promise.all([
          supabase
            .from('play_logs')
            .select('id, game, state, created_at, is_settled, outcome_match_count, outcome_bonus_match, outcome_payout_amount')
            .eq('user_id', authUser.id)
            .order('draw_date', { ascending: false })
            .limit(60),
          supabase
            .from('pick_results')
            .select('id, game, state, draw_date, is_win, match_count, bonus_match, result_code')
            .eq('user_id', authUser.id)
            .order('draw_date', { ascending: false })
            .limit(60),
          supabase
            .from('user_daily_stats')
            .select('stat_date, picks_count, wins_count, partial_hits_count, exact_hits_count, accuracy, current_streak')
            .eq('user_id', authUser.id)
            .order('stat_date', { ascending: false })
            .limit(7),
          supabase
            .from('predictions')
            .select('id, game, state, created_at, source_strategy_key, confidence_score, is_saved')
            .eq('user_id', authUser.id)
            .order('created_at', { ascending: false })
            .limit(60),
        ]);

        if (playLogsResult.error) {
          throw playLogsResult.error;
        }
        if (pickResultsResult.error) {
          throw pickResultsResult.error;
        }
        if (dailyStatsResult.error) {
          throw dailyStatsResult.error;
        }
        if (predictionsResult.error) {
          throw predictionsResult.error;
        }

        if (!cancelled) {
          setUser({ id: authUser.id, email: authUser.email });
          setPlayLogs(playLogsResult.data || []);
          setPickResults(pickResultsResult.data || []);
          setDailyStats(dailyStatsResult.data || []);
          setPredictions(predictionsResult.data || []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load stats');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  const settledPlays = useMemo(() => playLogs.filter((entry) => entry.is_settled), [playLogs]);

  const winCount = useMemo(() => pickResults.filter((entry) => entry.is_win).length, [pickResults]);

  const partialHitCount = useMemo(
    () => pickResults.filter((entry) => !entry.is_win && entry.match_count > 0).length,
    [pickResults],
  );

  const hitRate = useMemo(() => {
    if (pickResults.length === 0) {
      return 0;
    }

    return Math.round(((winCount + partialHitCount) / pickResults.length) * 100);
  }, [partialHitCount, pickResults.length, winCount]);

  const bestMatch = useMemo(() => {
    return pickResults.reduce((best, entry) => Math.max(best, entry.match_count || 0), 0);
  }, [pickResults]);

  const averageConfidence = useMemo(() => {
    const confidenceValues = predictions
      .map((entry) => (entry.confidence_score != null ? Number(entry.confidence_score) : null))
      .filter((entry): entry is number => entry !== null && Number.isFinite(entry));

    if (confidenceValues.length === 0) {
      return null;
    }

    return Math.round(confidenceValues.reduce((sum, value) => sum + value, 0) / confidenceValues.length);
  }, [predictions]);

  const currentStreak = useMemo(() => {
    return dailyStats[0]?.current_streak || 0;
  }, [dailyStats]);

  const gameBreakdown = useMemo<GameSummary[]>(() => {
    const summary = new Map<string, GameSummary>();

    for (const entry of pickResults) {
      const existing = summary.get(entry.game) || {
        key: entry.game,
        label: formatGameLabel(entry.game),
        plays: 0,
        wins: 0,
        bestMatch: 0,
      };

      existing.plays += 1;
      existing.wins += entry.is_win ? 1 : 0;
      existing.bestMatch = Math.max(existing.bestMatch, entry.match_count || 0);
      summary.set(entry.game, existing);
    }

    return [...summary.values()].sort((a, b) => b.plays - a.plays || a.label.localeCompare(b.label));
  }, [pickResults]);

  const strategySummary = useMemo<StrategySummary[]>(() => {
    const summary = new Map<string, { uses: number; savedCount: number; confidenceTotal: number; confidenceCount: number }>();

    for (const entry of predictions) {
      const strategy = entry.source_strategy_key || 'brew strategy';
      const existing = summary.get(strategy) || {
        uses: 0,
        savedCount: 0,
        confidenceTotal: 0,
        confidenceCount: 0,
      };

      existing.uses += 1;
      existing.savedCount += entry.is_saved ? 1 : 0;

      if (entry.confidence_score != null && Number.isFinite(Number(entry.confidence_score))) {
        existing.confidenceTotal += Number(entry.confidence_score);
        existing.confidenceCount += 1;
      }

      summary.set(strategy, existing);
    }

    return [...summary.entries()]
      .map(([strategy, entry]) => ({
        strategy,
        uses: entry.uses,
        savedCount: entry.savedCount,
        averageConfidence: entry.confidenceCount > 0 ? Math.round(entry.confidenceTotal / entry.confidenceCount) : null,
      }))
      .sort((a, b) => b.uses - a.uses || a.strategy.localeCompare(b.strategy));
  }, [predictions]);

  const recentTrend = useMemo(() => {
    return [...dailyStats].reverse();
  }, [dailyStats]);

  const settledSummaryText = settledPlays.length > 0
    ? `Based on ${settledPlays.length} settled plays and ${pickResults.length} stored result records.`
    : 'Outcome logging has not populated enough settled history yet, so Brew is only showing verified data already on your account.';

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DashboardContainer>
        <Header />
        <NavigationTabs />

        <div className="mb-5 mt-2 text-[40px] font-medium tracking-[-0.03em] text-[#f8cf98]">
          Stats &amp; Performance
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/55">
            Loading your Brew performance data...
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-[#ff8d7b]/25 bg-[#2a120d]/60 px-5 py-8 text-center text-[#ffc4b8]">
            {error}
          </div>
        ) : !user ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/55">
            No active account data is available right now.
          </div>
        ) : (
          <div className="space-y-5">
            <section className="rounded-[30px] border border-[#ffc742]/24 bg-[radial-gradient(circle_at_top_left,rgba(255,199,66,0.18),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(30,20,13,0.88),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(255,184,28,0.08)]">
              <div className="text-[15px] uppercase tracking-[0.16em] text-white/38">Verified account performance</div>
              <div className="mt-3 text-[24px] font-semibold text-[#f7ddb3]">{user.email || 'Signed-in Brew player'}</div>
              <div className="mt-2 max-w-2xl text-[15px] leading-7 text-white/62">{settledSummaryText}</div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Settled Plays"
                value={String(settledPlays.length)}
                helper="Only play logs that have been settled against official outcomes."
              />
              <StatCard
                label="Wins Logged"
                value={String(winCount)}
                helper="Confirmed win rows from stored result comparisons."
              />
              <StatCard
                label="Hit Rate"
                value={`${hitRate}%`}
                helper="Wins plus partial hits across stored result records."
              />
              <StatCard
                label="Avg Confidence"
                value={averageConfidence !== null ? `${averageConfidence}%` : 'N/A'}
                helper="Average confidence on account-owned predictions only."
              />
            </section>

            <SectionCard
              title="Game Breakdown"
              description="Per-game totals are derived from stored result records already attached to your account."
            >
              {gameBreakdown.length === 0 ? (
                <div className="rounded-[20px] border border-white/8 bg-black/20 px-4 py-4 text-[14px] leading-6 text-white/58">
                  Brew has not logged enough settled per-game results for this account yet. Once play logs and result settlement are populated, this panel will show your strongest games.
                </div>
              ) : (
                <div className="space-y-3">
                  {gameBreakdown.map((entry) => (
                    <div
                      key={entry.key}
                      className="flex flex-col gap-3 rounded-[22px] border border-white/8 bg-black/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="text-[17px] font-medium text-[#f7ddb3]">{entry.label}</div>
                        <div className="mt-1 text-[13px] text-white/52">{entry.plays} settled results tracked</div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-[13px] uppercase tracking-[0.14em] text-white/42">
                        <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">Wins {entry.wins}</span>
                        <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">Best match {entry.bestMatch}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Streak &amp; Hit-Rate Trends"
              description="This surface reads `user_daily_stats` when that table has been populated for your account."
            >
              {recentTrend.length === 0 ? (
                <div className="rounded-[20px] border border-white/8 bg-black/20 px-4 py-4 text-[14px] leading-6 text-white/58">
                  Daily trend rows have not been generated yet. Brew will start drawing these lines once the daily stats pipeline is writing account summaries.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-3 text-[13px] uppercase tracking-[0.14em] text-white/42">
                    <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">Current streak {currentStreak}</span>
                    <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">Best match {bestMatch}</span>
                  </div>
                  {recentTrend.map((entry) => (
                    <div key={entry.stat_date} className="rounded-[20px] border border-white/8 bg-black/20 px-4 py-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-[16px] font-medium text-[#f7ddb3]">{formatDayLabel(entry.stat_date)}</div>
                          <div className="mt-1 text-[13px] text-white/52">{entry.picks_count} picks logged that day</div>
                        </div>
                        <div className="text-[22px] font-semibold text-[#ffd27e]">{Math.round(entry.accuracy)}%</div>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-white/6">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27]"
                          style={{ width: `${Math.max(6, Math.min(100, Math.round(entry.accuracy)))}%` }}
                        />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-[13px] text-white/58">
                        <span>Wins {entry.wins_count}</span>
                        <span>•</span>
                        <span>Partial hits {entry.partial_hits_count}</span>
                        <span>•</span>
                        <span>Exact hits {entry.exact_hits_count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Strategy Performance Summary"
              description="This section only counts predictions owned by your account. Dashboard-generated anonymous picks will not appear until they are attached to your user record."
            >
              {strategySummary.length === 0 ? (
                <div className="rounded-[20px] border border-white/8 bg-black/20 px-4 py-4 text-[14px] leading-6 text-white/58">
                  No account-owned strategy history is available yet. Generate or save predictions through an authenticated flow to start filling this section.
                </div>
              ) : (
                <div className="space-y-3">
                  {strategySummary.map((entry) => (
                    <div
                      key={entry.strategy}
                      className="flex flex-col gap-3 rounded-[22px] border border-white/8 bg-black/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="text-[17px] font-medium text-[#f7ddb3]">{entry.strategy}</div>
                        <div className="mt-1 text-[13px] text-white/52">{entry.uses} stored predictions</div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-[13px] uppercase tracking-[0.14em] text-white/42">
                        <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">Saved {entry.savedCount}</span>
                        <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">
                          Avg confidence {entry.averageConfidence !== null ? `${entry.averageConfidence}%` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <section className="rounded-[28px] border border-[#72caff]/18 bg-[linear-gradient(145deg,rgba(19,22,31,0.76),rgba(10,10,12,0.96))] px-6 py-6 shadow-[0_0_20px_rgba(114,202,255,0.05)]">
              <div className="text-[20px] font-medium text-[#d8e6f8]">Ready for deeper analysis?</div>
              <div className="mt-3 text-[15px] leading-7 text-white/62">
                The next V1 destination is Strategy Locker, where premium strategy summaries and entitlement framing will live.
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-6 py-3 text-[15px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.18)]"
                >
                  Back to Dashboard
                </Link>
                <Link
                  href="/my-picks"
                  className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-[15px] font-medium text-[#f2d29f] transition-colors hover:text-white"
                >
                  View My Picks
                </Link>
              </div>
            </section>
          </div>
        )}
      </DashboardContainer>
    </main>
  );
}
