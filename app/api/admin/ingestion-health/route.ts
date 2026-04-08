/**
 * GET /api/admin/ingestion-health - Ingestion health summary for BrewCommand
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type FreshnessStatus = 'healthy' | 'delayed' | 'stale' | 'failed' | 'unknown';
type RunStatus = 'running' | 'succeeded' | 'partial' | 'failed' | 'unknown';

function resolveFreshnessStatus(stalenessMinutes: number | null, explicitStatus?: string | null): FreshnessStatus {
  if (explicitStatus === 'healthy' || explicitStatus === 'delayed' || explicitStatus === 'stale' || explicitStatus === 'failed') {
    return explicitStatus;
  }

  if (stalenessMinutes == null) {
    return 'unknown';
  }

  if (stalenessMinutes <= 180) {
    return 'healthy';
  }

  if (stalenessMinutes <= 720) {
    return 'delayed';
  }

  return 'stale';
}

function getMinutesBetween(dateString?: string | null) {
  if (!dateString) {
    return null;
  }

  const timestamp = new Date(dateString).getTime();
  if (Number.isNaN(timestamp)) {
    return null;
  }

  return Math.max(0, Math.round((Date.now() - timestamp) / 60000));
}

export async function GET() {
  try {
    const supabase = getSupabase();

    const [gamesResult, freshnessResult, runsResult, drawsResult] = await Promise.all([
      supabase
        .from('lottery_games')
        .select('id, display_name, game_key, state_code, is_active')
        .eq('is_active', true)
        .order('state_code')
        .order('display_name'),
      supabase
        .from('draw_freshness_status')
        .select('game_id, status, staleness_minutes, latest_draw_datetime_local, expected_next_draw_at, updated_at'),
      supabase
        .from('draw_ingestion_runs')
        .select('id, game_id, status, started_at, finished_at, draws_seen, draws_inserted, draws_updated, error_count')
        .order('started_at', { ascending: false })
        .limit(200),
      supabase
        .from('official_draws')
        .select('id, game_id, draw_date, draw_datetime_local, created_at')
        .order('draw_datetime_local', { ascending: false })
        .limit(500),
    ]);

    const firstError = gamesResult.error || freshnessResult.error || runsResult.error || drawsResult.error;
    if (firstError) {
      return NextResponse.json(
        { success: false, error: { code: 'FETCH_ERROR', message: firstError.message } },
        { status: 500 }
      );
    }

    const freshnessByGame = new Map((freshnessResult.data || []).map((row) => [row.game_id, row]));
    const latestRunByGame = new Map<string, (typeof runsResult.data)[number]>();
    const latestDrawByGame = new Map<string, (typeof drawsResult.data)[number]>();

    for (const run of runsResult.data || []) {
      if (run.game_id && !latestRunByGame.has(run.game_id)) {
        latestRunByGame.set(run.game_id, run);
      }
    }

    for (const draw of drawsResult.data || []) {
      if (draw.game_id && !latestDrawByGame.has(draw.game_id)) {
        latestDrawByGame.set(draw.game_id, draw);
      }
    }

    const rows = (gamesResult.data || []).map((game) => {
      const freshness = freshnessByGame.get(game.id);
      const latestRun = latestRunByGame.get(game.id);
      const latestDraw = latestDrawByGame.get(game.id);
      const derivedStalenessMinutes = freshness?.staleness_minutes ?? getMinutesBetween(latestDraw?.draw_datetime_local);
      const freshnessStatus = resolveFreshnessStatus(derivedStalenessMinutes, freshness?.status);
      const runStatus = (latestRun?.status || 'unknown') as RunStatus;

      return {
        gameId: game.id,
        gameName: game.display_name,
        gameKey: game.game_key,
        stateCode: game.state_code,
        freshnessStatus,
        freshnessSource: freshness ? 'tracked' : 'derived',
        stalenessMinutes: derivedStalenessMinutes,
        latestDrawAt: freshness?.latest_draw_datetime_local || latestDraw?.draw_datetime_local || null,
        latestDrawDate: latestDraw?.draw_date || null,
        expectedNextDrawAt: freshness?.expected_next_draw_at || null,
        lastRunId: latestRun?.id || null,
        lastRunStatus: runStatus,
        lastRunStartedAt: latestRun?.started_at || null,
        lastRunFinishedAt: latestRun?.finished_at || null,
        drawsSeen: latestRun?.draws_seen ?? null,
        drawsInserted: latestRun?.draws_inserted ?? null,
        drawsUpdated: latestRun?.draws_updated ?? null,
        errorCount: latestRun?.error_count ?? 0,
      };
    });

    rows.sort((a, b) => {
      const severityRank = { failed: 0, stale: 1, delayed: 2, unknown: 3, healthy: 4 } as const;
      const runRank = { failed: 0, partial: 1, unknown: 2, running: 3, succeeded: 4 } as const;
      const freshnessDiff = severityRank[a.freshnessStatus] - severityRank[b.freshnessStatus];
      if (freshnessDiff !== 0) {
        return freshnessDiff;
      }

      const runDiff = runRank[a.lastRunStatus] - runRank[b.lastRunStatus];
      if (runDiff !== 0) {
        return runDiff;
      }

      return (b.stalenessMinutes || 0) - (a.stalenessMinutes || 0);
    });

    const summary = rows.reduce(
      (acc, row) => {
        acc.totalGames += 1;
        acc.byFreshness[row.freshnessStatus] += 1;

        if (row.lastRunStatus === 'failed') {
          acc.failedRuns += 1;
        }

        if (row.errorCount > 0) {
          acc.gamesWithErrors += 1;
        }

        return acc;
      },
      {
        totalGames: 0,
        failedRuns: 0,
        gamesWithErrors: 0,
        byFreshness: {
          healthy: 0,
          delayed: 0,
          stale: 0,
          failed: 0,
          unknown: 0,
        } as Record<FreshnessStatus, number>,
      }
    );

    return NextResponse.json({
      success: true,
      data: rows,
      meta: { summary },
    });
  } catch (error: unknown) {
    console.error('Ingestion health GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown server error',
        },
      },
      { status: 500 }
    );
  }
}
