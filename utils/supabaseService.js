// @utils/supabaseService.js
// Summary: Server-only Supabase client using the Service Role key

import { createClient } from '@supabase/supabase-js';

export const supabaseService = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);