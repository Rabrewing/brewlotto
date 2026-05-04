import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import { isBrewCommandAdminUser } from '@/lib/auth/brewcommandShared';

type CookieEntry = {
  name: string;
  value: string;
  options: CookieOptions;
};

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/onboarding';

  if (code) {
    const supabaseResponse = NextResponse.next({ request });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet: CookieEntry[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !isBrewCommandAdminUser(user)) {
        await supabase.auth.signOut();
        const redirectResponse = NextResponse.redirect(`${origin}/login?error=not-authorized`);
        supabaseResponse.cookies.getAll().forEach(({ name, value, ...options }) => {
          redirectResponse.cookies.set(name, value, options);
        });
        return redirectResponse;
      }

      const redirectResponse = NextResponse.redirect(`${origin}${next}`);
      supabaseResponse.cookies.getAll().forEach(({ name, value, ...options }) => {
        redirectResponse.cookies.set(name, value, options);
      });
      return redirectResponse;
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
