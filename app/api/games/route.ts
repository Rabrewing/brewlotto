/**
 * GET /api/games - List all available lottery games
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('lottery_games')
      .select(`
        *,
        states(code, name, timezone)
      `)
      .eq('is_active', true)
      .order('display_name');
    
    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'FETCH_ERROR', message: error.message } },
        { status: 500 }
      );
    }
    
    const formattedData = (data || []).map((game: any) => ({
      id: game.id,
      state: game.states?.code,
      stateName: game.states?.name,
      gameKey: game.game_key,
      displayName: game.display_name,
      gameFamily: game.game_family,
      primaryCount: game.primary_count,
      primaryRange: `${game.primary_min}-${game.primary_max}`,
      hasBonus: game.has_bonus,
      drawStyle: game.draw_style,
      schedule: game.schedule_config,
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedData,
      meta: { total: formattedData.length }
    });
  } catch (error: any) {
    console.error('Games GET error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
