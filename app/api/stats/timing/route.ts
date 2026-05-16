import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { computeTimingProfile } from '@/lib/prediction/timingAnalysis';
import { resolveDashboardGameConfig, type DashboardGameId, type DashboardStateCode } from '@/lib/dashboard/game-config';

const TIMING_PROFILE_LABELS = ['HeatCheck', 'HeatCheck II', 'HeatCheck III', 'HeatCheck IV', 'HeatWave', 'HeatWave II', 'HeatWave III', 'PulseSync', 'PulseSync II', 'SequenceX'];
const TIMING_PROFILE_ALIASES: Record<string, string> = {
  TimePulse: 'PulseSync',
  'TimePulse II': 'PulseSync II',
};

type TimingProfile = NonNullable<ReturnType<typeof computeTimingProfile>>;

function normalizeTimingGame(game: string): DashboardGameId {
  const normalized = game.trim().toLowerCase();
  if (normalized === 'pick3' || normalized === 'pick4' || normalized === 'cash5' || normalized === 'powerball' || normalized === 'mega') {
    return normalized;
  }

  return 'pick3';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const game = normalizeTimingGame(searchParams.get('game') || 'pick3');
    const state = (searchParams.get('state') || 'NC').toUpperCase() === 'CA' ? 'CA' : 'NC';
    const mode = String(searchParams.get('mode') || 'pro').toLowerCase() === 'master' ? 'master' : 'pro';

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const config = resolveDashboardGameConfig(game, state as DashboardStateCode);

    if (!config) {
      return NextResponse.json({ success: true, data: {} });
    }

    const { data: gameRow } = await supabase
      .from('lottery_games')
      .select('id')
      .eq('game_key', config.statsGameKey)
      .eq('state_code', config.statsStateCode)
      .maybeSingle();

    if (!gameRow) {
      return NextResponse.json({ success: true, data: {} });
    }

    const { data: predictions } = await supabase
      .from('predictions')
      .select('id, created_at, predicted_numbers, draw_date, source_strategy_key')
      .eq('game', config.statsGameKey)
      .eq('state', config.statsStateCode)
      .not('predicted_numbers', 'is', null)
      .order('created_at', { ascending: false })
      .limit(200);

    const { data: draws } = await supabase
      .from('official_draws')
      .select('draw_date, primary_numbers')
      .eq('game_id', gameRow.id)
      .order('draw_date', { ascending: false })
      .limit(500);

    if (!predictions || !draws || predictions.length < 3) {
      return NextResponse.json({ success: true, data: {} });
    }

    const fp = predictions.map(function(p) {
      return {
        id: p.id,
        created_at: p.created_at,
        predicted_numbers: Array.isArray(p.predicted_numbers) ? p.predicted_numbers : [],
        draw_date: p.draw_date,
        source_strategy_key: p.source_strategy_key || null,
      };
    });
    const fd = draws.map(function(d) {
      return {
        draw_date: d.draw_date,
        primary_numbers: Array.isArray(d.primary_numbers) ? d.primary_numbers : [],
      };
    });

    const profiles: Record<string, TimingProfile> = {};
    for (const label of TIMING_PROFILE_LABELS) {
      const profile = computeTimingProfile(fp, fd, label, { mode });
      if (profile) profiles[label] = profile;
    }

    for (const [alias, canonical] of Object.entries(TIMING_PROFILE_ALIASES)) {
      if (profiles[canonical]) {
        profiles[alias] = profiles[canonical];
      }
    }

    return NextResponse.json({ success: true, data: profiles });
  } catch (error: unknown) {
    return NextResponse.json({ success: true, data: {} });
  }
}
