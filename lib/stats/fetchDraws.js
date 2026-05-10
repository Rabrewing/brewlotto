// @status: ✅ Refactored (live-ready)
// @lastUpdated: 2026-05-10
// @purpose: Fetches recent draws from Supabase for any game table

import { createClient } from '@supabase/supabase-js';

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !/^https?:\/\//i.test(url) || !key) {
        return null;
    }

    return createClient(url, key);
}

/**
 * Fetches recent lottery draws from a specified Supabase table.
 * @param {string} table - Supabase table name (e.g., 'pick3_draws')
 * @param {number} count - Number of draws to fetch (default: 50)
 * @returns {Promise<Array>} Array of draw objects
 */
export async function fetchRecentDraws(table, count = 50) {
    const supabase = getSupabase();
    if (!supabase) {
        return [];
    }

    const { data, error } = await supabase
        .from(table)
        .select('numbers,megaBall,powerball,draw_date')
        .order('draw_date', { ascending: false })
        .limit(count);

    if (error) {
        console.error('Supabase fetch error:', error);
        return [];
    }

    return data;
}
