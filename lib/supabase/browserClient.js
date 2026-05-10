// Summary: Client-side Supabase instance (for use in hooks and components)
import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function createFallbackClient() {
    const noopQuery = {
        select() { return this; },
        insert() { return Promise.resolve({ data: null, error: null }); },
        update() { return Promise.resolve({ data: null, error: null }); },
        upsert() { return Promise.resolve({ data: null, error: null }); },
        delete() { return Promise.resolve({ data: null, error: null }); },
        eq() { return this; },
        in() { return this; },
        order() { return this; },
        limit() { return this; },
        maybeSingle() { return Promise.resolve({ data: null, error: null }); },
        single() { return Promise.resolve({ data: null, error: null }); },
    };

    return {
        auth: {
            async getUser() {
                return { data: { user: null }, error: null };
            },
            async signOut() {
                return { error: null };
            },
            async signInWithOtp() {
                return { data: null, error: new Error('Supabase is not configured.') };
            },
        },
        from() {
            return noopQuery;
        },
    };
}

export const supabase =
    SUPABASE_URL &&
    /^https?:\/\//i.test(SUPABASE_URL) &&
    SUPABASE_ANON_KEY
        ? createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
        : createFallbackClient();
