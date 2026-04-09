import { SupabaseClient } from '@supabase/supabase-js';

export function createSupabaseServerClient(): SupabaseClient;
export function createSupabaseServerClientLegacy(req: any, res: any): SupabaseClient;
