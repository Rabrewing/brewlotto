// /utils/fetchDraws.js
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function fetchRecentDraws(table, count = 50) {
    const { data, error } = await supabase
        .from(table)
        .select("numbers,megaBall,powerball,draw_date")
        .order("draw_date", { ascending: false })
        .limit(count);
    if (error) {
        console.error("Supabase fetch error:", error);
        return [];
    }
    return data;
}
