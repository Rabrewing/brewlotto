// utils/supabaseServerClient.js
import { createServerClient } from '@supabase/auth-helpers-nextjs';

export function getSupabaseServerClient(req, res) {
    return createServerClient({ req, res });
}