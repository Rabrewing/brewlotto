// 📁 /lib/logGeoAudit.js
// @timestamp 2025-06-26T14:10 EDT
// @description: Logs geographic audit data to Supabase for user activity tracking
// @dependencies: supabaseClient.js
import { supabase } from "@/lib/supabaseClient";

export async function logGeoAudit({ user_id = null, region, country, city, ip_address = null }) {
    const maskedIp = ip_address?.replace(/\.\d+$/, ".xxx") || null;

    const { error } = await supabase.from("geo_audit_logs").insert([
        { user_id, region, country, city, ip_address: maskedIp },
    ]);

    if (error) console.error("Geo audit log failed:", error.message);
}