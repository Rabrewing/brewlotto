import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isBrewCommandAdminUser } from '@/lib/auth/brewcommandShared';

type CookieEntry = {
  name: string;
  value: string;
  options: CookieOptions;
};

function isExempt(pathname: string) {
  return pathname === '/'
    || pathname.startsWith('/login')
    || pathname.startsWith('/onboarding')
    || pathname.startsWith('/auth/callback')
    || pathname.startsWith('/pricing')
    || pathname.startsWith('/legal')
    || pathname.startsWith('/logout')
    || pathname.startsWith('/api/')
    || pathname.startsWith('/_next/')
    || pathname === '/favicon.ico';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isExempt(pathname)) return NextResponse.next();

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet: CookieEntry[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith('/admin') && isBrewCommandAdminUser(user)) {
    return supabaseResponse;
  }

  const { data: prefs } = await supabase
    .from('user_preferences')
    .select('onboarding_completed')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!prefs?.onboarding_completed) {
    const url = request.nextUrl.clone();
    url.pathname = '/onboarding';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
