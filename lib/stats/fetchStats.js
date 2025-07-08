// @status: 🟡 Modernized (Not in use — Brew 1 artifact)
// @lastUpdated: 2025-06-27
// @purpose: Fetches recent draws and dispatches to the correct analyzer per game type

import { fetchRecentDraws } from '@/lib/stats/fetchDraws';
import { analyzePick3 } from '@/lib/stats/analyzePick3';
import { analyzePick4 } from '@/lib/stats/analyzePick4';
import { analyzePick5 } from '@/lib/stats/analyzePick5';
import { analyzeMega } from '@/lib/stats/analyzeMega';
import { analyzePowerball } from '@/lib/stats/analyzePowerball';

export async function fetchStats(game, opts = {}) {
    let draws = [];

    if (game === 'pick3') {
        draws = await fetchRecentDraws('pick3_draws', 200);
        return analyzePick3(draws, opts);
    }
    if (game === 'pick4') {
        draws = await fetchRecentDraws('pick4_draws', 200);
        return analyzePick4(draws, opts);
    }
    if (game === 'pick5') {
        draws = await fetchRecentDraws('pick5_draws', 200);
        return analyzePick5(draws, opts);
    }
    if (game === 'mega') {
        draws = await fetchRecentDraws('mega_draws', 100);
        return analyzeMega(draws, opts);
    }
    if (game === 'powerball') {
        draws = await fetchRecentDraws('powerball_draws', 100);
        return analyzePowerball(draws, opts);
    }

    throw new Error('Unsupported game type');
}