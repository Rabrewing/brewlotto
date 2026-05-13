#!/usr/bin/env node

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
);

const GAME_KEY_MAP = {
  pick3: 'pick3', pick4: 'pick4', cash5: 'cash5',
  powerball: 'powerball', mega_millions: 'mega_millions', mega: 'mega_millions',
  daily3: 'daily3', daily4: 'daily4', fantasy5: 'fantasy5',
};

function countIntersection(a, b) {
  const remaining = [...b];
  let hits = 0;
  for (const v of a) {
    const idx = remaining.indexOf(v);
    if (idx >= 0) { hits += 1; remaining.splice(idx, 1); }
  }
  return hits;
}

function toNumbers(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(function(v) { return typeof v === 'number'; });
}

(async () => {
  console.log('🚀 Starting settlement sweep...\n');

  const { data: logs, error: logsError } = await supabase
    .from('play_logs')
    .select('*')
    .eq('is_settled', false);

  if (logsError) {
    console.error('Failed to fetch play logs:', logsError.message);
    process.exit(1);
  }

  if (!logs || logs.length === 0) {
    console.log('No unsettled play logs');
    return;
  }

  console.log('Found ' + logs.length + ' unsettled play logs');

  let settled = 0;
  let wins = 0;
  let skipped = 0;

  for (const log of logs) {
    const gameKey = GAME_KEY_MAP[log.game];
    if (!gameKey) { skipped += 1; continue; }

    const stateCode = log.state === 'MULTI' ? 'NC' : log.state;
    const drawDate = log.draw_date;
    const drawWindow = log.draw_time;

    if (!drawDate || !drawWindow) { skipped += 1; continue; }

    const { data: gameRow } = await supabase
      .from('lottery_games')
      .select('id, display_name')
      .eq('game_key', gameKey)
      .eq('state_code', stateCode)
      .maybeSingle();

    if (!gameRow) { skipped += 1; continue; }

    const { data: draws } = await supabase
      .from('official_draws')
      .select('primary_numbers, bonus_numbers, fireball_value')
      .eq('game_id', gameRow.id)
      .eq('draw_date', drawDate)
      .eq('draw_window_label', drawWindow);

    if (!draws || draws.length === 0) { skipped += 1; continue; }

    const draw = draws[0];
    const playedNums = Array.isArray(log.played_numbers) ? log.played_numbers : [];
    const officialNums = toNumbers(draw.primary_numbers);
    const officialBonus = Array.isArray(draw.bonus_numbers) ? draw.bonus_numbers[0] : null;

    const matchCount = countIntersection(playedNums, officialNums);
    const bonusMatch = officialBonus != null && log.played_bonus_number != null && Number(officialBonus) === Number(log.played_bonus_number);

    const isWin = matchCount >= 5 || (matchCount >= 3 && bonusMatch);
    const resultCode = isWin ? 'win' : matchCount > 0 ? 'partial' : 'no_match';

    const { error: updateError } = await supabase
      .from('play_logs')
      .update({
        is_settled: true,
        settled_at: new Date().toISOString(),
        outcome_match_count: matchCount,
        outcome_bonus_match: bonusMatch,
        outcome_result_code: resultCode,
      })
      .eq('id', log.id);

    if (updateError) { skipped += 1; continue; }

    settled += 1;
    if (isWin) wins += 1;
  }

  console.log('\nSettlement sweep complete');
  console.log('  Settled: ' + settled);
  console.log('  Wins: ' + wins);
  console.log('  Skipped: ' + skipped);
  console.log('\nDone!');
})();
