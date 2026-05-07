import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/lib/supabase/serverClient';

const getAdminClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

function normalizeGame(game: string) {
  const normalized = game.trim().toLowerCase();

  if (normalized === 'pick 3' || normalized === 'pick3') {
    return { state: 'NC', game: 'pick3' };
  }

  if (normalized === 'pick 4' || normalized === 'pick4') {
    return { state: 'NC', game: 'pick4' };
  }

  if (normalized === 'pick 5' || normalized === 'cash5' || normalized === 'cash 5') {
    return { state: 'NC', game: 'cash5' };
  }

  return { state: 'NC', game: normalized.replace(/\s+/g, '_') };
}

function normalizeNumbers(numbers: unknown) {
  if (Array.isArray(numbers)) {
    return numbers.map((entry) => String(entry).trim()).filter(Boolean);
  }

  if (typeof numbers === 'string') {
    return numbers
      .split(/[\s,]+/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeDrawTime(drawType: unknown) {
  const value = String(drawType || '').trim().toLowerCase();

  if (value === 'day' || value === 'midday' || value === 'morning') {
    return 'midday';
  }

  if (value === 'evening' || value === 'night' || value === 'nightly') {
    return 'evening';
  }

  if (value === 'draw') {
    return 'draw';
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { user_id, game, draw_type, strategy, numbers, add_on, amount_spent, outcome, prize } = body;

    if (!game) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'game is required.' } },
        { status: 400 },
      );
    }

    const authClient = createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please sign in to save play logs.' } },
        { status: 401 },
      );
    }

    if (user_id && user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'You can only save your own play logs.' } },
        { status: 403 },
      );
    }

    const supabase = getAdminClient();
    const normalizedGame = normalizeGame(String(game));
    const playedNumbers = normalizeNumbers(numbers);
    const drawDate = new Date().toISOString().slice(0, 10);
    const playSource =
      String(strategy || '').trim() ? 'saved_prediction' : 'quick_pick';

    const { data, error } = await supabase
      .from('play_logs')
      .insert([
        {
          user_id: user.id,
          state: normalizedGame.state,
          game: normalizedGame.game,
          draw_date: drawDate,
          draw_time: normalizeDrawTime(draw_type),
          played_numbers: playedNumbers,
          played_bonus_number: null,
          play_source: playSource,
          amount_spent: typeof amount_spent === 'number' ? amount_spent : Number(amount_spent) || null,
          was_played: true,
          is_settled: false,
          outcome_result_code: outcome ? String(outcome) : null,
          outcome_match_count: null,
          outcome_bonus_match: null,
          outcome_payout_amount: typeof prize === 'number' ? prize : Number(prize) || null,
          metadata: {
            strategy: strategy || null,
            add_on: add_on || null,
            legacy_payload: true,
          },
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'INSERT_ERROR', message: error.message } },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to log play.',
        },
      },
      { status: 500 },
    );
  }
}
