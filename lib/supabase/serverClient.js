// @lib/supabase/serverClient.js
// Summary: Supabase SSR-safe client using modern cookie handlers (no TS deprecation)

import { createServerClient } from '@supabase/ssr';

export function createSupabaseServerClient(req, res) {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    return req.cookies?.[name];
                },
                set(name, value, options) {
                    res.setHeader('Set-Cookie', `${name}=${value}; Path=/; HttpOnly; SameSite=Lax`);
                },
                remove(name) {
                    res.setHeader('Set-Cookie', `${name}=; Path=/; Max-Age=0`);
                }
            },
            headers: req.headers
        }
    );
}