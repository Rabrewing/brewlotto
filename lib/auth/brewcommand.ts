import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/serverClient';

function parseAdminEmails() {
  return (process.env.BREWCOMMAND_ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function hasAdminMetadata(user: {
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
  app_metadata?: Record<string, unknown> | null;
}) {
  const email = user.email?.toLowerCase() || '';
  const adminEmails = parseAdminEmails();

  if (email && adminEmails.includes(email)) {
    return true;
  }

  const metadata = [user.app_metadata || {}, user.user_metadata || {}];
  return metadata.some((entry) =>
    entry.role === 'admin' ||
    entry.isAdmin === true ||
    entry.is_admin === true ||
    (Array.isArray(entry.roles) && entry.roles.includes('admin'))
  );
}

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

  return hasAdminMetadata(user);
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

  return hasAdminMetadata(user);
}
