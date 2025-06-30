// @deprecated: Superseded by lib/supabase/browserClient.js (uses @supabase/ssr)
// @date: 2024-01-15
// utils/supabase.js
// @timestamp: 2024-01-15
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
