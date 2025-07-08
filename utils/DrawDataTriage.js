// ✅ DrawDataTriage.js — Flags Draw Gaps, Stale Entries

import { supabase } from '@/lib/supabase';
import { format, parseISO, differenceInDays } from 'date-fns';

export async function getDrawHealth() {
    const { data, error } = await supabase.from('draws').select('*');
    if (error) throw error;

    const healthReport = {};

    data.forEach(draw => {
        const key = draw.game;
        const drawDate = parseISO(draw.date);
        const daysOld = differenceInDays(new Date(), drawDate);

        if (!healthReport[key]) healthReport[key] = { recent: drawDate, stale: [] };
        else if (drawDate > healthReport[key].recent) healthReport[key].recent = drawDate;

        if (daysOld > 7) healthReport[key].stale.push(format(drawDate, 'yyyy-MM-dd'));
    });

    return healthReport;
}
