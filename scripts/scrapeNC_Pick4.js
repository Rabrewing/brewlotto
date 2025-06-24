// /scripts/scrapeNC_Pick4.js
// Fetches all available NC Pick 4 draws (day & evening) from nclottery.com and uploads to Supabase
// Last updated: 2025-06-22
import "dotenv/config";
import axios from "axios";
import { load } from "cheerio";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const MONTHS_BACK = 24;

(async () => {
    let allDraws = [];
    let today = new Date();

    for (let i = 0; i < MONTHS_BACK; i++) {
        const dt = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const url = `https://nclottery.com/pick4-past-draws?month=${dt.getMonth() + 1}&year=${dt.getFullYear()}`;
        console.log(`Fetching: ${url}`);

        const resp = await axios.get(url);
        const $ = load(resp.data);

        $(".past-draws-table tbody tr").each((_, el) => {
            const tds = $(el).find("td");
            const date = $(tds[0]).text().trim();
            const draw_type = $(tds[1]).text().toLowerCase().includes("day") ? "day" : "evening";
            const numbers = $(tds[2])
                .text()
                .split("-")
                .map(n => parseInt(n.trim()))
                .filter(n => !isNaN(n));
            if (date && numbers.length === 4) {
                allDraws.push({ draw_date: formatDate(date), draw_type, numbers });
            }
        });
    }

    // Remove duplicates by date+type
    allDraws = allDraws.filter((v, i, a) =>
        a.findIndex(t => (t.draw_date === v.draw_date && t.draw_type === v.draw_type)) === i
    );
    console.log(`Total Pick 4 draws: ${allDraws.length}`);

    for (let i = 0; i < allDraws.length; i += 1000) {
        const batch = allDraws.slice(i, i + 1000);
        const { error } = await supabase.from("pick4_draws").upsert(batch, { onConflict: ['draw_date', 'draw_type'] });
        if (error) console.error("Upload error:", error);
    }
    console.log("✅ Pick 4 history loaded!");
})();

function formatDate(str) {
    const [m, d, y] = str.split("/");
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}
// Example usage of axios to fetch data from a URL
try {
    const response = await axios.get(url);
    // parse response.data
} catch (error) {
    console.error("Failed to fetch Pick 4 data:", error.message);
}
