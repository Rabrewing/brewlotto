// @function: getLatestDrawResults
// @purpose: Get latest Pick 3 draws (day & evening) from Supabase
// @returns: { draws: { day: { date, result }, evening: { date, result } } }
// @lastUpdated: 2025-06-27
// @status: 🟡 Modernized (Not in use — Brew 1 artifact)
// @proposedUse: Draw ingestion preview, dashboard widget, or prediction context

import { supabase } from '@/lib/supabase/browserClient';

export async function getLatestDrawResults(game) {
    if (game !== 'pick3') {
        console.warn(`[getLatestDrawResults] Unsupported game: ${game}`);
        return { draws: [] };
    }

    const [dayRes, eveRes] = await Promise.all([
        supabase
            .from('pick3_draws')
            .select('draw_date, numbers')
            .eq('draw_type', 'day')
            .order('draw_date', { ascending: false })
            .limit(1)
            .maybeSingle(),

        supabase
            .from('pick3_draws')
            .select('draw_date, numbers')
            .eq('draw_type', 'evening')
            .order('draw_date', { ascending: false })
            .limit(1)
            .maybeSingle(),
    ]);

    return {
        draws: {
            day: dayRes.data
                ? {
                    date: dayRes.data.draw_date,
                    result: (dayRes.data.numbers || []).join(' '),
                }
                : null,
            evening: eveRes.data
                ? {
                    date: eveRes.data.draw_date,
                    result: (eveRes.data.numbers || []).join(' '),
                }
                : null,
        },
    };
}