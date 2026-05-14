import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { computeTimingProfile } from '@/lib/prediction/timingAnalysis';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const game = searchParams.get('game') || 'pick3';
    const state = searchParams.get('state') || 'NC';

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const gameKey = game === 'mega' ? 'mega_millions' : game;
    const stateCode = state === 'MULTI' ? 'NC' : state;

    const { data: gameRow } = await supabase
      .from('lottery_games')
      .select('id')
      .eq('game_key', gameKey)
      .eq('state_code', stateCode)
      .maybeSingle();

    if (!gameRow) {
      return NextResponse.json({ success: true, data: {} });
    }

    const { data: predictions } = await supabase
      .from('predictions')
      .select('id, created_at, predicted_numbers, draw_date, source_strategy_key')
      .eq('game', gameKey)
      .eq('state', stateCode)
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

    const labels = ['HeatCheck', 'HeatCheck II', 'HeatCheck III', 'HeatCheck IV', 'HeatWave', 'HeatWave II', 'HeatWave III', 'PulseSync', 'PulseSync II', 'SequenceX'];
    const profiles = {};
    for (const label of labels) {
      const profile = computeTimingProfile(fp, fd, label);
      if (profile) profiles[label] = profile;
    }

    return NextResponse.json({ success: true, data: profiles });
  } catch (error: unknown) {
    return NextResponse.json({ success: true, data: {} });
  }
}
