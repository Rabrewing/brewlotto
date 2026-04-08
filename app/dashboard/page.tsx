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

// Mock data - replace with Supabase/API calls in production
const MOCK_DATA: Record<GameId, {
  hotNumbers: number[];
  hotBonus?: number;
  coldNumbers: number[];
  coldBonus?: number;
  momentum: number;
}> = {
  pick3: {
    hotNumbers: [3, 7, 5],
    coldNumbers: [1, 9, 4],
    momentum: 62,
  },
  pick4: {
    hotNumbers: [3, 1, 4, 1],
    coldNumbers: [1, 7, 2, 2],
    momentum: 58,
  },
  cash5: {
    hotNumbers: [3, 14, 22, 29, 35],
    coldNumbers: [7, 18, 25, 31, 40],
    momentum: 55,
  },
  powerball: {
    hotNumbers: [3, 14, 29, 41, 52],
    hotBonus: 11,
    coldNumbers: [1, 7, 22, 54, 69],
    coldBonus: 3,
    momentum: 49,
  },
  mega: {
    hotNumbers: [10, 22, 38, 51, 65],
    hotBonus: 15,
    coldNumbers: [5, 19, 33, 47, 60],
    coldBonus: 8,
    momentum: 52,
  },
};

interface DashboardStats {
  hotNumbers: number[];
  hotBonus?: number | null;
  coldNumbers: number[];
  coldBonus?: number | null;
  momentumPercent: number;
  drawCount: number;
  sourceGames: string[];
}

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
}

const EMPTY_COMMENTARY: DashboardCommentary = {
  summary: 'Brew is waiting on a fresh stored prediction. Generate a new pick to populate real explainability here.',
  strategyLabel: null,
  confidenceScore: null,
  generatedAt: null,
  sourceGame: null,
  primaryNumbers: [],
  bonusNumber: null,
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
  };
}

export default function DashboardPage() {
  const [selectedGame, setSelectedGame] = useState<GameId>('powerball');
  const [isGenerating, setIsGenerating] = useState(false);
  const [commentary, setCommentary] = useState<DashboardCommentary>(EMPTY_COMMENTARY);
  const [commentaryLoading, setCommentaryLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    hotNumbers: MOCK_DATA.powerball.hotNumbers,
    hotBonus: MOCK_DATA.powerball.hotBonus,
    coldNumbers: MOCK_DATA.powerball.coldNumbers,
    coldBonus: MOCK_DATA.powerball.coldBonus,
    momentumPercent: MOCK_DATA.powerball.momentum,
    drawCount: 0,
    sourceGames: [],
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [freshness, setFreshness] = useState<DashboardFreshness>(EMPTY_FRESHNESS);
  const [freshnessLoading, setFreshnessLoading] = useState(true);

  const fallbackStats = MOCK_DATA[selectedGame];
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

  useEffect(() => {
    let cancelled = false;

    async function loadCommentary() {
      setCommentaryLoading(true);

      try {
        const response = await fetch(`/api/dashboard/commentary?game=${selectedGame}`, {
          cache: 'no-store',
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error?.message || 'Failed to load commentary');
        }

        if (!cancelled) {
          setCommentary(payload.data || EMPTY_COMMENTARY);
        }
      } catch (error) {
        if (!cancelled) {
          setCommentary({
            ...EMPTY_COMMENTARY,
            summary: error instanceof Error ? error.message : EMPTY_COMMENTARY.summary,
          });
        }
      } finally {
        if (!cancelled) {
          setCommentaryLoading(false);
        }
      }
    }

    loadCommentary();

    return () => {
      cancelled = true;
    };
  }, [selectedGame]);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      setStatsLoading(true);

      try {
        const response = await fetch(`/api/dashboard/stats?game=${selectedGame}`, {
          cache: 'no-store',
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error?.message || 'Failed to load stats');
        }

        if (!cancelled) {
          setStats(payload.data || {
            hotNumbers: fallbackStats.hotNumbers,
            hotBonus: fallbackStats.hotBonus,
            coldNumbers: fallbackStats.coldNumbers,
            coldBonus: fallbackStats.coldBonus,
            momentumPercent: fallbackStats.momentum,
            drawCount: 0,
            sourceGames: [],
          });
        }
      } catch {
        if (!cancelled) {
          setStats({
            hotNumbers: fallbackStats.hotNumbers,
            hotBonus: fallbackStats.hotBonus,
            coldNumbers: fallbackStats.coldNumbers,
            coldBonus: fallbackStats.coldBonus,
            momentumPercent: fallbackStats.momentum,
            drawCount: 0,
            sourceGames: [],
          });
        }
      } finally {
        if (!cancelled) {
          setStatsLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, [selectedGame, fallbackStats.coldBonus, fallbackStats.coldNumbers, fallbackStats.hotBonus, fallbackStats.hotNumbers, fallbackStats.momentum]);

  useEffect(() => {
    let cancelled = false;

    async function loadFreshness() {
      setFreshnessLoading(true);

      try {
        const response = await fetch(`/api/dashboard/freshness?game=${selectedGame}`, {
          cache: 'no-store',
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error?.message || 'Failed to load freshness');
        }

        if (!cancelled) {
          setFreshness(payload.data || EMPTY_FRESHNESS);
        }
      } catch {
        if (!cancelled) {
          setFreshness(EMPTY_FRESHNESS);
        }
      } finally {
        if (!cancelled) {
          setFreshnessLoading(false);
        }
      }
    }

    loadFreshness();

    return () => {
      cancelled = true;
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
        ) : stats.drawCount > 0 ? (
          <div className="-mt-1 mb-5 text-[12px] uppercase tracking-[0.16em] text-white/35">
            Live stats from {stats.drawCount} stored draws{stats.sourceGames.length > 0 ? ` across ${stats.sourceGames.join(', ')}` : ''}
          </div>
        ) : (
          <div className="-mt-1 mb-5 text-[12px] uppercase tracking-[0.16em] text-white/35">
            Live stats unavailable, showing fallback dashboard defaults
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
        />

        <GeneratePickButton
          onClick={handleGenerate}
          loading={isGenerating}
        />

        <UtilityPills freshnessStatus={freshness.status} />
        <VoiceModeCard text={voiceText} title="Brew Voice" />
      </DashboardContainer>
    </div>
  );
}
