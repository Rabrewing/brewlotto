import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

import { requireBrewCommandRequest } from '@/lib/auth/brewcommand';

const getSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

const DEFAULT_ADMIN_EMAIL = 'command@brewlotto.app';

export async function POST(request: NextRequest) {
  try {
    const unauthorizedResponse = await requireBrewCommandRequest(request);
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const body = await request.json().catch(() => ({}));
    const email = String(body?.email || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();

    const supabase = getSupabase();
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FETCH_ERROR',
            message: authError.message,
          },
        },
        { status: 500 },
      );
    }

    const targetUser = authUsers?.users?.find((entry) => entry.email?.toLowerCase() === email);

    if (!targetUser?.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `No auth user found for ${email}.`,
          },
        },
        { status: 404 },
      );
    }

    const { error: resetError } = await supabase
      .from('user_preferences')
      .upsert(
        {
          user_id: targetUser.id,
          onboarding_completed: false,
          disclaimer_acknowledged: false,
          acknowledged_at: null,
        },
        { onConflict: 'user_id' },
      );

    if (resetError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UPDATE_ERROR',
            message: resetError.message,
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        email,
        userId: targetUser.id,
        reset: {
          onboarding_completed: false,
          disclaimer_acknowledged: false,
          acknowledged_at: null,
        },
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to reset onboarding state.',
        },
      },
      { status: 500 },
    );
  }
}
