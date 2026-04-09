'use client';

import { useEffect, useState } from 'react';
import { 
  DashboardContainer, 
  Header, 
  NavigationTabs, 
  SectionKicker, 
  FreshnessBanner,
  GameTabs, 
  GameId,
  StatsGrid,
  PredictionCard,
  GeneratePickButton,
  UtilityPills,
  VoiceModeCard
} from '@/components/brewlotto/dashboard';
import { DASHBOARD_GAME_CONFIG } from '@/lib/dashboard/game-config';

interface DashboardStats {
  hotNumbers: number[];
  hotBonus?: number | null;
  coldNumbers: number[];
  coldBonus?: number | null;
  momentumPercent: number;
  drawCount: number;
  sourceGames: string[];
}

const EMPTY_STATS: DashboardStats = {
  hotNumbers: [],
  hotBonus: null,
  coldNumbers: [],
  coldBonus: null,
  momentumPercent: 0,
  drawCount: 0,
  sourceGames: [],
};

interface DashboardFreshness {
  status: 'healthy' | 'delayed' | 'stale' | 'failed' | 'unknown';
  stalenessMinutes: number | null;
  expectedNextDrawAt: string | null;
}

interface DashboardCommentary {
  summary: string;
  strategyLabel: string | null;
  confidenceScore: number | null;
  generatedAt: string | null;
  sourceGame: string | null;
  primaryNumbers: number[];
  bonusNumber: number | null;
  state: 'missing_prediction' | 'missing_explanation' | 'ready';
}

interface StoredPredictionExplanation {
  summary_text?: string | null;
  detail_text?: string | null;
}

interface StoredPredictionResponse {
  source_strategy_key?: string | null;
  confidence_score?: number | string | null;
  created_at?: string | null;
  game?: string | null;
  predicted_numbers?: unknown;
  bonus_number?: number | string | null;
  explanations?: StoredPredictionExplanation[] | null;
  state?: DashboardCommentary['state'];
}

const EMPTY_COMMENTARY: DashboardCommentary = {
  summary: 'Brew is waiting on a fresh stored prediction. Generate a new pick to populate real explainability here.',
  strategyLabel: null,
  confidenceScore: null,
  generatedAt: null,
  sourceGame: null,
  primaryNumbers: [],
  bonusNumber: null,
  state: 'missing_prediction',
};

const EMPTY_FRESHNESS: DashboardFreshness = {
  status: 'unknown',
  stalenessMinutes: null,
  expectedNextDrawAt: null,
};

function normalizePredictionResponse(prediction: StoredPredictionResponse): DashboardCommentary {
  const explanation = Array.isArray(prediction?.explanations)
    ? prediction.explanations.find((item) => item?.summary_text || item?.detail_text)
    : null;

  return {
    summary:
      explanation?.summary_text ||
      explanation?.detail_text ||
      EMPTY_COMMENTARY.summary,
    strategyLabel: prediction?.source_strategy_key || null,
    confidenceScore:
      prediction?.confidence_score !== null && prediction?.confidence_score !== undefined
        ? Number(prediction.confidence_score)
        : null,
    generatedAt: prediction?.created_at || null,
    sourceGame: prediction?.game || null,
    primaryNumbers: Array.isArray(prediction?.predicted_numbers) ? prediction.predicted_numbers : [],
    bonusNumber:
      prediction?.bonus_number !== null && prediction?.bonus_number !== undefined
        ? Number(prediction.bonus_number)
        : null,
    state: prediction?.state || (explanation ? 'ready' : 'missing_explanation'),
  };
}

export default function DashboardPage() {
  const [selectedGame, setSelectedGame] = useState<GameId>('powerball');
  const [isGenerating, setIsGenerating] = useState(false);
  const [commentary, setCommentary] = useState<DashboardCommentary>(EMPTY_COMMENTARY);
  const [commentaryLoading, setCommentaryLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    ...EMPTY_STATS,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsFallback, setStatsFallback] = useState(false);
  const [freshness, setFreshness] = useState<DashboardFreshness>(EMPTY_FRESHNESS);
  const [freshnessLoading, setFreshnessLoading] = useState(true);

  const gameConfig = DASHBOARD_GAME_CONFIG[selectedGame];
  const gameLabel = gameConfig.displayLabel;
  const showBonus = selectedGame === 'powerball' || selectedGame === 'mega';
  const voiceText = [
    freshness.status === 'healthy'
      ? `Freshness check. ${gameLabel} data is current.`
      : freshness.status === 'unknown'
        ? `Freshness check. ${gameLabel} data freshness is unclear.`
        : `Freshness check. ${gameLabel} data is currently ${freshness.status}.`,
    commentary.summary,
  ].join(' ');

  async function loadCommentary(game: GameId, signal?: { cancelled: boolean }) {
    setCommentaryLoading(true);

    try {
      const response = await fetch(`/api/dashboard/commentary?game=${game}`, {
        cache: 'no-store',
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error?.message || 'Failed to load commentary');
      }

      if (!signal?.cancelled) {
        setCommentary(payload.data || EMPTY_COMMENTARY);
      }
    } catch (error) {
      if (!signal?.cancelled) {
        setCommentary({
          ...EMPTY_COMMENTARY,
          summary: error instanceof Error ? error.message : EMPTY_COMMENTARY.summary,
        });
      }
    } finally {
      if (!signal?.cancelled) {
        setCommentaryLoading(false);
      }
    }
  }

  async function loadStats(game: GameId, signal?: { cancelled: boolean }) {
    setStatsLoading(true);

    try {
      const response = await fetch(`/api/dashboard/stats?game=${game}`, {
        cache: 'no-store',
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error?.message || 'Failed to load stats');
      }

      if (!signal?.cancelled) {
        setStats(payload.data || EMPTY_STATS);
        setStatsFallback(Boolean(payload?.meta?.fallback) || !(payload?.data?.drawCount > 0));
      }
    } catch {
      if (!signal?.cancelled) {
        setStats(EMPTY_STATS);
        setStatsFallback(true);
      }
    } finally {
      if (!signal?.cancelled) {
        setStatsLoading(false);
      }
    }
  }

  async function loadFreshness(game: GameId, signal?: { cancelled: boolean }) {
    setFreshnessLoading(true);

    try {
      const response = await fetch(`/api/dashboard/freshness?game=${game}`, {
        cache: 'no-store',
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error?.message || 'Failed to load freshness');
      }

      if (!signal?.cancelled) {
        setFreshness(payload.data || EMPTY_FRESHNESS);
      }
    } catch {
      if (!signal?.cancelled) {
        setFreshness(EMPTY_FRESHNESS);
      }
    } finally {
      if (!signal?.cancelled) {
        setFreshnessLoading(false);
      }
    }
  }

  useEffect(() => {
    const signal = { cancelled: false };

    loadCommentary(selectedGame, signal);

    return () => {
      signal.cancelled = true;
    };
  }, [selectedGame]);

  useEffect(() => {
    const signal = { cancelled: false };

    loadStats(selectedGame, signal);

    return () => {
      signal.cancelled = true;
    };
  }, [selectedGame]);

  useEffect(() => {
    const signal = { cancelled: false };

    loadFreshness(selectedGame, signal);

    return () => {
      signal.cancelled = true;
    };
  }, [selectedGame]);

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameKey: gameConfig.requestGameKey,
          state: gameConfig.requestState,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error?.message || 'Failed to generate pick');
      }

      setCommentary(normalizePredictionResponse(payload.data));
      await Promise.all([
        loadCommentary(selectedGame),
        loadStats(selectedGame),
        loadFreshness(selectedGame),
      ]);
    } catch (error) {
      setCommentary({
        ...EMPTY_COMMENTARY,
        summary: error instanceof Error ? error.message : 'Failed to generate pick',
      });
    } finally {
      setIsGenerating(false);
      setCommentaryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <DashboardContainer>
        <Header />
        <NavigationTabs />
        <SectionKicker />
        <FreshnessBanner
          status={freshness.status}
          stalenessMinutes={freshness.stalenessMinutes}
          expectedNextDrawAt={freshness.expectedNextDrawAt}
          loading={freshnessLoading}
        />
        <GameTabs selectedGame={selectedGame} onSelect={setSelectedGame} />
        
        <StatsGrid
          hotNumbers={stats.hotNumbers}
          hotBonus={stats.hotBonus ?? undefined}
          coldNumbers={stats.coldNumbers}
          coldBonus={stats.coldBonus ?? undefined}
          momentumPercent={stats.momentumPercent}
          game={selectedGame}
          showBonus={showBonus}
        />

        {statsLoading ? (
          <div className="-mt-1 mb-5 text-[12px] uppercase tracking-[0.16em] text-white/35">
            Loading live dashboard stats...
          </div>
        ) : stats.drawCount > 0 && !statsFallback ? (
          <div className="-mt-1 mb-5 text-[12px] uppercase tracking-[0.16em] text-white/35">
            Live stats from {stats.drawCount} stored draws{stats.sourceGames.length > 0 ? ` across ${stats.sourceGames.join(', ')}` : ''}
          </div>
        ) : (
          <div className="-mt-1 mb-5 text-[12px] uppercase tracking-[0.16em] text-white/35">
            No live stats are available for this game yet
          </div>
        )}

        <PredictionCard
          game={gameLabel}
          summary={commentaryLoading ? 'is loading the latest stored explainability...' : commentary.summary}
          strategyLabel={commentary.strategyLabel}
          confidenceScore={commentary.confidenceScore}
          generatedAt={commentary.generatedAt}
          sourceGame={commentary.sourceGame}
          primaryNumbers={commentary.primaryNumbers}
          bonusNumber={commentary.bonusNumber}
          bonusLabel={gameConfig.bonusLabel}
          state={commentary.state}
        />

        <GeneratePickButton
          onClick={handleGenerate}
          loading={isGenerating}
        />

        <UtilityPills freshnessStatus={freshness.status} game={selectedGame} />
        <VoiceModeCard text={voiceText} title="Brew Voice" />
      </DashboardContainer>
    </div>
  );
}
