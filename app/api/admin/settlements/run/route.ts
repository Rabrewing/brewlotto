/**
 * POST /api/admin/settlements/run - Sweep unsettled play logs and settle against official draws.
 */

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

import { requireBrewCommandRequest } from '@/lib/auth/brewcommand';
import { sendPlaySettlementEmail } from '@/lib/notifications/playSettlements';

type PlayLogRow = {
  id: string;
  user_id: string;
  state: 'NC' | 'CA';
  game: string;
  draw_date: string;
  draw_time: string | null;
  played_numbers: unknown;
  played_bonus_number: number | null;
  amount_spent: number | null;
  prediction_id: string | null;
  user_pick_id: string | null;
};

type LotteryGameRow = {
  id: string;
  state_code: 'NC' | 'CA';
  game_key: string;
  display_name: string;
  has_bonus: boolean | null;
};

type OfficialDrawRow = {
  id: string;
  draw_date: string;
  draw_window_label: string | null;
  primary_numbers: unknown;
  bonus_numbers: unknown;
};

const getSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

function escapeLikeGame(value: string) {
  return value.trim().toLowerCase();
}

function normalizeGameKey(game: string, state: 'NC' | 'CA') {
  const normalized = escapeLikeGame(game);

  if (normalized === 'pick3') {
    return state === 'CA' ? 'daily3' : 'pick3';
  }

  if (normalized === 'pick4') {
    return state === 'CA' ? 'daily4' : 'pick4';
  }

  if (normalized === 'cash5') {
    return state === 'CA' ? 'fantasy5' : 'cash5';
  }

  if (normalized === 'mega') {
    return 'mega_millions';
  }

  if (normalized === 'megamillions') {
    return 'mega_millions';
  }

  return normalized;
}

function normalizeDrawWindow(drawTime: string | null) {
  const value = String(drawTime || '').trim().toLowerCase();

  if (value === 'midday' || value === 'day' || value === 'morning') {
    return 'day';
  }

  if (value === 'evening' || value === 'night' || value === 'nightly') {
    return 'evening';
  }

  if (value === 'draw') {
    return null;
  }

  return null;
}

function normalizeNumbers(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (typeof entry === 'number' && Number.isFinite(entry)) {
        return entry;
      }

      const parsed = Number(entry);
      return Number.isFinite(parsed) ? parsed : null;
    })
    .filter((entry): entry is number => entry != null);
}

function countExactPositions(a: number[], b: number[]) {
  const length = Math.min(a.length, b.length);
  let hits = 0;

  for (let index = 0; index < length; index += 1) {
    if (a[index] === b[index]) {
      hits += 1;
    }
  }

  return hits;
}

function countIntersection(a: number[], b: number[]) {
  const remaining = [...b];
  let hits = 0;

  for (const value of a) {
    const index = remaining.indexOf(value);
    if (index >= 0) {
      hits += 1;
      remaining.splice(index, 1);
    }
  }

  return hits;
}

function buildResultCode({
  exactPrimary,
  bonusMatch,
  matchCount,
}: {
  exactPrimary: boolean;
  bonusMatch: boolean;
  matchCount: number;
}) {
  if (exactPrimary && bonusMatch) {
    return 'exact_primary_bonus';
  }

  if (exactPrimary) {
    return 'exact_primary';
  }

  if (bonusMatch) {
    return 'bonus_match';
  }

  if (matchCount > 0) {
    return `partial_match_${matchCount}`;
  }

  return 'no_match';
}

function buildPayoutTier({
  exactPrimary,
  bonusMatch,
  matchCount,
}: {
  exactPrimary: boolean;
  bonusMatch: boolean;
  matchCount: number;
}) {
  if (exactPrimary && bonusMatch) {
    return 'jackpot';
  }

  if (exactPrimary) {
    return 'top_prize';
  }

  if (bonusMatch) {
    return 'bonus_prize';
  }

  if (matchCount >= 3) {
    return `match_${matchCount}`;
  }

  return null;
}

function gameLabelFromKey(gameKey: string) {
  const labels: Record<string, string> = {
    pick3: 'Pick 3',
    daily3: 'Daily 3',
    pick4: 'Pick 4',
    daily4: 'Daily 4',
    cash5: 'Cash 5',
    fantasy5: 'Fantasy 5',
    powerball: 'Powerball',
    mega_millions: 'Mega Millions',
  };

  return labels[gameKey] || gameKey;
}

async function getOfficialDraw(
  supabase: ReturnType<typeof getSupabase>,
  game: LotteryGameRow,
  playLog: PlayLogRow,
) {
  const drawWindow = normalizeDrawWindow(playLog.draw_time);
  const query = supabase
    .from('official_draws')
    .select('id, draw_date, draw_window_label, primary_numbers, bonus_numbers')
    .eq('game_id', game.id)
    .eq('draw_date', playLog.draw_date)
    .order('draw_datetime_local', { ascending: false });

  if (drawWindow) {
    const { data: windowMatches, error: windowError } = await query.eq('draw_window_label', drawWindow).limit(1);
    if (windowError) {
      throw windowError;
    }

    if ((windowMatches || []).length > 0) {
      return windowMatches[0] as OfficialDrawRow;
    }
  }

  const { data, error } = await query.limit(1);
  if (error) {
    throw error;
  }

  return (data || [])[0] as OfficialDrawRow | undefined;
}

export async function POST(request: NextRequest) {
  try {
    const unauthorizedResponse = await requireBrewCommandRequest(request);
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const supabase = getSupabase();
    const body = await request.json().catch(() => ({}));
    const limit = Math.min(Math.max(Number(body?.limit) || 50, 1), 200);
    const stateFilter = body?.state === 'CA' || body?.state === 'NC' ? body.state : null;
    const gameFilter = typeof body?.game === 'string' && body.game.trim() ? escapeLikeGame(body.game) : null;

    let logsQuery = supabase
      .from('play_logs')
      .select('id, user_id, state, game, draw_date, draw_time, played_numbers, played_bonus_number, amount_spent, prediction_id, user_pick_id')
      .eq('is_settled', false)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (stateFilter) {
      logsQuery = logsQuery.eq('state', stateFilter);
    }

    if (gameFilter) {
      logsQuery = logsQuery.eq('game', gameFilter);
    }

    const { data: logs, error: logsError } = await logsQuery;

    if (logsError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FETCH_ERROR',
            message: logsError.message,
          },
        },
        { status: 500 },
      );
    }

    if (!logs || logs.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          processed: 0,
          settled: 0,
          wins: 0,
          notificationsCreated: 0,
          emailsSent: 0,
          skipped: 0,
        },
        meta: { fallback: true },
      });
    }

    const gameKeys = new Set<string>();
    for (const log of logs as PlayLogRow[]) {
      gameKeys.add(normalizeGameKey(log.game, log.state));
    }

    const { data: lotteryGames, error: lotteryGamesError } = await supabase
      .from('lottery_games')
      .select('id, state_code, game_key, display_name, has_bonus')
      .in('game_key', [...gameKeys])
      .in('state_code', ['NC', 'CA']);

    if (lotteryGamesError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FETCH_ERROR',
            message: lotteryGamesError.message,
          },
        },
        { status: 500 },
      );
    }

    const gamesByKey = new Map(
      (lotteryGames || []).map((gameRow: LotteryGameRow) => [`${gameRow.state_code}:${gameRow.game_key}`, gameRow]),
    );

    let settled = 0;
    let wins = 0;
    let notificationsCreated = 0;
    let emailsSent = 0;
    let skipped = 0;

    for (const log of logs as PlayLogRow[]) {
      const normalizedGameKey = normalizeGameKey(log.game, log.state);
      const game = gamesByKey.get(`${log.state}:${normalizedGameKey}`);

      if (!game) {
        skipped += 1;
        continue;
      }

      const officialDraw = await getOfficialDraw(supabase, game, log);

      if (!officialDraw) {
        skipped += 1;
        continue;
      }

      const playedNumbers = normalizeNumbers(log.played_numbers);
      const officialNumbers = normalizeNumbers(officialDraw.primary_numbers);
      const officialBonusNumbers = normalizeNumbers(officialDraw.bonus_numbers);
      const playedBonusNumber = log.played_bonus_number;
      const bonusMatch =
        playedBonusNumber != null && officialBonusNumbers.length > 0
          ? officialBonusNumbers.includes(playedBonusNumber)
          : false;
      const matchCount = countIntersection(playedNumbers, officialNumbers);
      const positionalMatchCount = countExactPositions(playedNumbers, officialNumbers);
      const exactPrimary = playedNumbers.length === officialNumbers.length && positionalMatchCount === officialNumbers.length;
      const isWin = exactPrimary || bonusMatch;
      const resultCode = buildResultCode({ exactPrimary, bonusMatch, matchCount });
      const payoutTier = buildPayoutTier({ exactPrimary, bonusMatch, matchCount });
      const payoutAmount = isWin ? (log.amount_spent != null ? Number(log.amount_spent) : null) : null;

      const { error: updateError } = await supabase
        .from('play_logs')
        .update({
          is_settled: true,
          settled_at: new Date().toISOString(),
          outcome_result_code: resultCode,
          outcome_match_count: matchCount,
          outcome_bonus_match: bonusMatch,
          outcome_payout_amount: payoutAmount,
          metadata: {
            settled_by: 'admin-settlement-sweep',
            official_draw_id: officialDraw.id,
            payout_tier: payoutTier,
            exact_primary: exactPrimary,
          },
        })
        .eq('id', log.id);

      if (updateError) {
        skipped += 1;
        continue;
      }

      settled += 1;

      const notificationTitle = isWin ? 'Your BrewLotto pick won' : 'Your BrewLotto pick settled';
      const notificationBody = isWin
        ? `Your ${game.display_name} pick settled against the official draw and matched ${matchCount} number${matchCount === 1 ? '' : 's'}.`
        : `Your ${game.display_name} pick settled against the official draw.`;

      const { error: notificationError } = await supabase.from('user_notifications').insert({
        user_id: log.user_id,
        type: 'draw_result',
        title: notificationTitle,
        body: notificationBody,
        cta_label: 'View Result',
        cta_url: `${process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'https://brewlotto.app'}/notifications`,
        priority: isWin ? 'high' : 'normal',
        metadata: {
          source: 'settlement-sweep',
          play_log_id: log.id,
          game_key: normalizedGameKey,
          state: log.state,
          draw_id: officialDraw.id,
          is_win: isWin,
          match_count: matchCount,
          positional_match_count: positionalMatchCount,
          bonus_match: bonusMatch,
          payout_tier: payoutTier,
          result_code: resultCode,
        },
      });

      if (!notificationError) {
        notificationsCreated += 1;
      }

      if (isWin) {
        wins += 1;
        const {
          data: authUser,
          error: authUserError,
        } = await supabase.auth.admin.getUserById(log.user_id);

        if (!authUserError && authUser?.user?.email) {
          const emailResult = await sendPlaySettlementEmail(supabase, {
            userId: log.user_id,
            contactEmail: authUser.user.email,
            state: log.state,
            gameLabel: game.display_name,
            drawDate: officialDraw.draw_date,
            drawWindowLabel: officialDraw.draw_window_label,
            playedNumbers,
            officialNumbers,
            matchCount,
            positionalMatchCount,
            bonusMatch,
            isWin,
            payoutTier,
            resultCode,
            payoutAmount,
          });

          if (!emailResult.skipped) {
            emailsSent += 1;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        processed: logs.length,
        settled,
        wins,
        notificationsCreated,
        emailsSent,
        skipped,
      },
      meta: {},
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to run settlement sweep.',
        },
      },
      { status: 500 },
    );
  }
}
