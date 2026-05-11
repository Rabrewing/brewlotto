import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

import { requireBrewCommandRequest } from '@/lib/auth/brewcommand';

const getSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

function isFireballPlay(metadata: unknown, resultCode: string | null) {
  if (!metadata || typeof metadata !== 'object') {
    return Boolean(resultCode && String(resultCode).toLowerCase().includes('fireball'));
  }

  const value = metadata as Record<string, unknown>;
  const active = value.fireball_active ?? value.fireball ?? null;

  if (active === true) {
    return true;
  }

  if (typeof active === 'string' && active.toLowerCase() === 'true') {
    return true;
  }

  if (typeof value.fireball_value === 'number') {
    return true;
  }

  if (typeof value.fireball_value === 'string' && value.fireball_value.trim() !== '' && Number.isFinite(Number(value.fireball_value))) {
    return true;
  }

  return Boolean(resultCode && String(resultCode).toLowerCase().includes('fireball'));
}

export async function GET(request: NextRequest) {
  try {
    const unauthorizedResponse = await requireBrewCommandRequest(request);
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('play_logs')
      .select('id, user_id, state, game, draw_date, is_settled, outcome_result_code, outcome_match_count, outcome_payout_amount, created_at, metadata')
      .order('created_at', { ascending: false })
      .limit(250);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FETCH_ERROR',
            message: error.message,
          },
        },
        { status: 500 },
      );
    }

    const rows = Array.isArray(data) ? data : [];
    const fireballRows = rows.filter((row) => isFireballPlay(row.metadata, row.outcome_result_code));
    const settledFireballRows = fireballRows.filter((row) => row.is_settled);
    const fireballWins = settledFireballRows.filter((row) => typeof row.outcome_result_code === 'string' && !row.outcome_result_code.endsWith('_no_match')).length;

    const byGame = new Map<
      string,
      { game: string; state: string; plays: number; settled: number; wins: number; lastSeenAt: string }
    >();

    for (const row of fireballRows) {
      const key = `${row.state}:${row.game}`;
      const current = byGame.get(key) || {
        game: row.game,
        state: row.state,
        plays: 0,
        settled: 0,
        wins: 0,
        lastSeenAt: row.created_at,
      };

      current.plays += 1;
      if (row.is_settled) {
        current.settled += 1;
        if (typeof row.outcome_result_code === 'string' && !row.outcome_result_code.endsWith('_no_match')) {
          current.wins += 1;
        }
      }
      current.lastSeenAt = current.lastSeenAt || row.created_at;
      byGame.set(key, current);
    }

    const recent = settledFireballRows.slice(0, 25).map((row) => ({
      id: row.id,
      state: row.state,
      game: row.game,
      drawDate: row.draw_date,
      createdAt: row.created_at,
      resultCode: row.outcome_result_code,
      matchCount: row.outcome_match_count,
      payoutAmount: row.outcome_payout_amount,
    }));

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalFireballPlays: fireballRows.length,
          settledFireballPlays: settledFireballRows.length,
          fireballWins,
          fireballWinRate: settledFireballRows.length > 0 ? Math.round((fireballWins / settledFireballRows.length) * 100) : null,
          recentCount: recent.length,
        },
        byGame: [...byGame.values()].sort((a, b) => b.plays - a.plays || a.state.localeCompare(b.state) || a.game.localeCompare(b.game)),
        recent,
      },
      meta: {},
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to load Fireball summary.',
        },
      },
      { status: 500 },
    );
  }
}
