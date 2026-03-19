import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/browserClient';
import { runAudit } from '@/scripts/drawHistoryAudit';

const games = [
    { game: 'Pick 3', table: 'pick3_draws' },
    { game: 'Pick 4', table: 'pick4_draws' },
    { game: 'Pick 5', table: 'pick5_draws' }
];

const getDateRange = (start: string, end: string): string[] => {
    const range: string[] = [];
    let current = new Date(start);
    const stop = new Date(end);
    while (current <= stop) {
        range.push(current.toISOString().slice(0, 10));
        current.setDate(current.getDate() + 1);
    }
    return range;
};

export async function GET() {
    const results: { game: string; missing: string[] }[] = [];

    for (const { game, table } of games) {
        const { data, error } = await supabase
            .from(table)
            .select('draw_date')
            .order('draw_date', { ascending: true });

        if (error) {
            console.error(`Error fetching data for ${game}:`, error.message);
            continue;
        }

        const dates = data?.map((row: { draw_date: string }) => row.draw_date).filter(Boolean);
        if (!dates || dates.length === 0) {
            results.push({ game, missing: ['No data found'] });
            continue;
        }

        const fullRange = getDateRange(dates[0], dates[dates.length - 1]);
        const missing = fullRange.filter((d) => !dates.includes(d));

        if (missing.length > 0) {
            results.push({ game, missing });
        }
    }

    try {
        // Assuming runAudit is meant to be called once for a general audit,
        // not per game in this context.
        const auditResults = await runAudit();
        // You might want to merge or process auditResults with the missing dates results
        // For now, I'll return both, or you can choose to return only one.
        return NextResponse.json({ missingDates: results, scriptAudit: auditResults }, { status: 200 });
    } catch (e: any) {
        console.error('❌ Audit failed:', e);
        return NextResponse.json({ error: e.message || "Audit failed" }, { status: 500 });
    }
}
