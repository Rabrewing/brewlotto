// /scripts/dbInspect.js
// Description: Inspect draw table metadata — last draw date, row count, sample row
import "dotenv/config";
import { supabase } from "../../lib/supabase/browserClient";

const TABLES = ["pick3_draws", "pick4_draws", "pick5_draws", "mega_draws", "powerball_draws"];

async function inspectTable(table) {
    const [latest, countRes, sample] = await Promise.all([
        supabase.from(table).select('draw_date').order('draw_date', { ascending: false }).limit(1),
        supabase.from(table).select('*', { count: 'exact', head: true }),
        supabase.from(table).select('*').limit(1)
    ]);

    const lastDate = latest.data?.[0]?.draw_date ?? "–";
    const count = countRes.count ?? "n/a";
    const example = sample.data?.[0] ?? {};

    console.log(`\n📊 ${table}`);
    console.log(`   ├─ Last draw: ${lastDate}`);
    console.log(`   ├─ Rows: ${count}`);
    console.log(`   └─ Sample:`, example);
}

(async () => {
    console.log(`📦 Inspecting draw tables (${new Date().toLocaleString()})`);
    for (const table of TABLES) await inspectTable(table);
    console.log("\n✅ Inspection complete.");
})();