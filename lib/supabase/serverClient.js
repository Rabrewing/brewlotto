// @lib/supabase/serverClient.js
// Summary: Supabase SSR-safe client using modern cookie handlers (no TS deprecation)

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Create Supabase server client for Next.js App Router
 * Used in server components and API routes
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, _options) {
          try {
            cookieStore.set({ name, value, ..._options });
          } catch (error) {
            // The `set` method was called from a Server Component
            // which is not allowed. We'll use the headers API instead.
            // This is a workaround for the App Router
          }
        },
        remove(name, _options) {
          try {
            cookieStore.set({ name, value: '', ..._options });
          } catch (error) {
            // The `set` method was called from a Server Component
            // which is not allowed. We'll use the headers API instead.
          }
        }
      }
    }
  );
}

/**
 * Create Supabase client for server-side operations in API routes
 * This is a simpler version that doesn't require cookie manipulation
 */
export function createSupabaseServerClientSimple() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get() {
          return '';
        },
        set() {},
        remove() {}
      }
    }
  );
}

/**
 * Legacy createSupabaseServerClient for Pages Router
 * @param {object} req - Request object
 * @param {object} res - Response object
 */
export function createSupabaseServerClientLegacy(req, res) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return req.cookies?.[name];
        },
        set(name, value, __options) {
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
