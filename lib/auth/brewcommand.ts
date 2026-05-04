import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/serverClient';
import { isBrewCommandAdminUser } from '@/lib/auth/brewcommandShared';

function hasAdminSecret(request: NextRequest) {
  const configuredSecret = process.env.BREWCOMMAND_ADMIN_SECRET;
  if (!configuredSecret) {
    return false;
  }

  return request.headers.get('x-brewcommand-admin-secret') === configuredSecret;
}

export async function isAuthorizedBrewCommandRequest(request: NextRequest) {
  if (hasAdminSecret(request)) {
    return true;
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  return isBrewCommandAdminUser(user);
}

export async function requireBrewCommandRequest(request: NextRequest) {
  const authorized = await isAuthorizedBrewCommandRequest(request);

  if (!authorized) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'BrewCommand access requires an authorized admin account.',
        },
      },
      { status: 401 }
    );
  }

  return null;
}

export async function isAuthorizedBrewCommandViewer() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  return isBrewCommandAdminUser(user);
}
