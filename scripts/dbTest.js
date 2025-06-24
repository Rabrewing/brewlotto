// /scripts/dbTest.js
// BrewLotto AI — Database Read Test Script
// Last updated: 2025-06-22

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TABLES = [
    "pick3_draws",
    "pick4_draws",
    "pick5_draws",
    "mega_draws",
    "powerball_draws"
];

// Print last 3 draws from each game table
async function checkTables() {
    for (const table of TABLES) {
        const { data, error } = await supabase
            .from(table)
            .select("*")
            .order("draw_date", { ascending: false })
            .limit(3);

        console.log(`\n=== ${table} ===`);
        if (error) {
            console.error("DB error:", error);
        } else if (!data || data.length === 0) {
            console.log("No data found!");
        } else {
            for (const row of data) {
                console.log(row);
            }
        }
    }
    process.exit(0);
}

checkTables();
