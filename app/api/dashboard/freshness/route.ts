/**
 * GET /api/dashboard/freshness?game=pick3
 * Returns freshness state for the selected dashboard game family.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { resolveDashboardGameConfig, type DashboardGameId, type DashboardStateCode } from '@/lib/dashboard/game-config';

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getWorstStatus(statuses: string[]) {
  const rank = { failed: 0, stale: 1, delayed: 2, healthy: 3, unknown: 4 } as const;
  return [...statuses].sort((a, b) => (rank[a as keyof typeof rank] ?? 5) - (rank[b as keyof typeof rank] ?? 5))[0] || 'unknown';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const game = (searchParams.get('game') || 'powerball') as DashboardGameId;
    const state = (searchParams.get('state') || 'NC') as DashboardStateCode;
    const config = resolveDashboardGameConfig(game, state);

    if (!config) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Unsupported game key' } },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('v_ingestion_health_summary')
      .select('state_code,game_name,game_key,freshness_status,staleness_minutes,expected_next_draw_at')
      .eq('state_code', config.statsStateCode)
      .eq('game_key', config.statsGameKey);

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'FETCH_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    const rows = data || [];
    if (rows.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          status: 'unknown',
          stalenessMinutes: null,
          expectedNextDrawAt: null,
          rows: [],
        },
        meta: { fallback: true },
      });
    }

    const validStatuses = rows
      .map((row) => row.freshness_status || 'unknown');

    const worstStatus = getWorstStatus(validStatuses);
    const maxStalenessMinutes = rows.reduce<number | null>((maxValue, row) => {
      if (row.staleness_minutes == null) {
        return maxValue;
      }

      return maxValue == null ? row.staleness_minutes : Math.max(maxValue, row.staleness_minutes);
    }, null);

    const expectedNextDrawAt = rows
      .map((row) => row.expected_next_draw_at)
      .filter(Boolean)
      .sort()[0] || null;

    return NextResponse.json({
      success: true,
      data: {
        status: worstStatus,
        stalenessMinutes: maxStalenessMinutes,
        expectedNextDrawAt,
        rows,
      },
      meta: { fallback: false },
    });
  } catch (error: unknown) {
    console.error('Dashboard freshness GET error:', error);
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
