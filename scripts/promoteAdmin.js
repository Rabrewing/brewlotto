// @script: promoteAdmin.js
// @purpose: Elevate a user to admin role manually via Supabase service client
// @usage: node scripts/promoteAdmin.js
// @note: Ensure you have the correct permissions to perform this action
import "dotenv/config"; // Load environment variables from .env file
// timestamp:  2023-10-01T12:00:00Z

import { supabaseService } from "@/utils/supabaseService";

const promote = async () => {
    const targetEmail = "luckyrbwon@gmail.com"; // 👈 Replace with your email

    const { data, error } = await supabaseService
        .from("users") // or "profiles" depending on your schema
        .update({ role: "admin" })
        .eq("email", targetEmail);

    if (error) {
        console.error(`[❌] Could not promote: ${error.message}`);
    } else {
        console.log(`[✅] ${targetEmail} is now admin:`, data);
    }
};

promote();