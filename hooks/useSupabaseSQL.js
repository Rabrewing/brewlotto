// @summary: Executes SQL statements securely via Supabase Edge Function or RPC
// @timestamp: 2025-07-01T11:35 EDT
// @directory: /hooks

import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function useSupabaseSQL() {
    const client = useSupabaseClient();

    const executeSQL = async ({ title, sql }) => {
        const { data, error } = await client.rpc('execute_sql', { command: sql });

        if (error) {
            console.error(`[❌ ${title}]`, error);
            return { success: false, error };
        }

        console.log(`[✅ ${title}]`, data);
        return { success: true, data };
    };

    return { executeSQL };
}