// /scripts/drawHistoryAudit.js
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !/^https?:\/\//i.test(url) || !key) {
        return null;
    }

    return createClient(url, key);
}

const games = [
    { game: 'Pick 3', table: 'pick3_draws' },
    { game: 'Pick 4', table: 'pick4_draws' },
    { game: 'Pick 5', table: 'pick5_draws' }
];

const getDateRange = (start, end) => {
    const range = [];
    let current = new Date(start);
    const stop = new Date(end);
    while (current <= stop) {
        range.push(current.toISOString().slice(0, 10));
        current.setDate(current.getDate() + 1);
    }
    return range;
};

export async function runAudit() {
    const supabase = getSupabase();
    if (!supabase) {
        return games.map((entry) => ({
            game: entry.game,
            error: 'Supabase environment variables are not configured for audit.',
            missingDates: [],
            count: -1,
        }));
    }

    const results = [];

    for (const { game, table } of games) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('draw_date')
                .order('draw_date', { ascending: true });

            if (error) {
                results.push({ game, error: error.message, missingDates: [], count: -1 });
                continue;
            }

            const dates = data.map((row) => row.draw_date).filter(Boolean);
            if (!dates.length) {
                results.push({ game, warning: 'No data found', missingDates: [], count: -1 });
                continue;
            }

            const fullRange = getDateRange(dates[0], dates.at(-1));
            const missing = fullRange.filter((d) => !dates.includes(d));

            results.push({ game, missingDates: missing, count: missing.length });
        } catch (e) {
            results.push({ game, error: e.message, missingDates: [], count: -1 });
        }
    }

    return results;
}
