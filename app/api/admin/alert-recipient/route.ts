import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

import { requireBrewCommandRequest } from '@/lib/auth/brewcommand';
import { parseBrewCommandAdminEmails } from '@/lib/auth/brewcommandShared';

const getSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

const SETTING_KEY = 'alert_notification_recipient_email';

export async function GET(request: NextRequest) {
  try {
    const unauthorizedResponse = await requireBrewCommandRequest(request);
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('brewcommand_settings')
      .select('setting_value')
      .eq('setting_key', SETTING_KEY)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FETCH_ERROR',
            message: error.message,
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        recipientEmail: data?.setting_value || 'command@brewlotto.app',
        choices: parseBrewCommandAdminEmails(),
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to load alert recipient.',
        },
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const unauthorizedResponse = await requireBrewCommandRequest(request);
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const body = await request.json().catch(() => ({}));
    const recipientEmail = String(body?.recipientEmail || '').trim().toLowerCase();
    const allowedChoices = parseBrewCommandAdminEmails();

    if (!recipientEmail || !allowedChoices.includes(recipientEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Choose a valid BrewCommand admin email recipient.',
          },
        },
        { status: 400 },
      );
    }

    const supabase = getSupabase();
    const { error } = await supabase.from('brewcommand_settings').upsert(
      {
        setting_key: SETTING_KEY,
        setting_value: recipientEmail,
      },
      { onConflict: 'setting_key' },
    );

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UPDATE_ERROR',
            message: error.message,
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        recipientEmail,
        choices: allowedChoices,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to save alert recipient.',
        },
      },
      { status: 500 },
    );
  }
}
