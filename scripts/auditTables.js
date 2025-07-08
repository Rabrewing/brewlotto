// File: scripts/auditTables.js
// Purpose: Inspect key Supabase tables and confirm latest data + schema health
// Updated: 2025-06-25T21:12 EDT

// Load .env file first
import 'dotenv/config';
import { supabase } from "@/utils/supabase";

const TABLES = ['pick3_draws', 'pick4_draws', 'pick5_draws', 'predictions', 'game_settings'];

(async () => {
    for (const table of TABLES) {
        console.log(`\n📦 Inspecting table: ${table}\n`);

        // Sample latest 3 rows
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .order('draw_date', { ascending: false })
            .limit(3);

        if (error) {
            console.error(`❌ Error reading ${table}:`, error.message);
        } else if (!data.length) {
            console.warn(`⚠️ Table ${table} is empty.`);
        } else {
            console.table(data, Object.keys(data[0]).slice(0, 8)); // Print first 8 columns
        }
    }

    console.log('\n✅ Audit complete. Check above output for missing draw fields or date staleness.\n');
})();