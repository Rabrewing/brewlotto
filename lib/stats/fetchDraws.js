// @status: ✅ Refactored (live-ready)
// @lastUpdated: 2025-06-27
// @purpose: Fetches recent draws from Supabase for any game table

import { supabase } from '@/lib/supabase/browserClient';

/**
 * Fetches recent lottery draws from a specified Supabase table.
 * @param {string} table - Supabase table name (e.g., 'pick3_draws')
 * @param {number} count - Number of draws to fetch (default: 50)
 * @returns {Promise<Array>} Array of draw objects
 */
export async function fetchRecentDraws(table, count = 50) {
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