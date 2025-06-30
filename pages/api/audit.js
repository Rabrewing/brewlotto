/**
 * API Route: /api/audit
 * Description: Runs drawHistoryAudit logic server-side and returns any gaps as JSON
 */

import { supabase } from "@/utils/supabase";
import { runAudit } from '@/scripts/drawHistoryAudit';

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

export default async function handler(req, res) {
    const results = [];

    for (const { game, table } of games) {
        const { data } = await supabase
            .from(table)
            .select('draw_date')
            .order('draw_date', { ascending: true });

        const dates = data?.map((row) => row.draw_date).filter(Boolean);
        if (!dates || dates.length === 0) continue;

        const fullRange = getDateRange(dates[0], dates.at(-1));
        const missing = fullRange.filter((d) => !dates.includes(d));

        if (missing.length > 0) {
            results.push({ game, missing });
        }

        {
            try {
                const auditResults = await runAudit();
                return res.status(200).json(auditResults);
            } catch (e) {
                console.error('❌ Audit failed:', e);
                return res.status(500).json({ error: e.message });
            }

        }
    }

    return res.status(200).json(results);
}




