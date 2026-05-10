import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

function getAuditClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !/^https?:\/\//i.test(url) || !key) {
        return null;
    }

    return createClient(url, key);
}

export async function GET() {
    const results: { game: string; missing: string[] }[] = [];
    const supabase = getAuditClient();

    if (!supabase) {
        return NextResponse.json({ missingDates: results, scriptAudit: [] }, { status: 200 });
    }

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
        const { runAudit } = await import('@/scripts/drawHistoryAudit');
        const auditResults = await runAudit();
        // You might want to merge or process auditResults with the missing dates results
        // For now, I'll return both, or you can choose to return only one.
        return NextResponse.json({ missingDates: results, scriptAudit: auditResults }, { status: 200 });
    } catch (e: any) {
        console.error('❌ Audit failed:', e);
        return NextResponse.json({ error: e.message || "Audit failed" }, { status: 500 });
    }
}
