import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/lib/supabase/serverClient';
import { deliverAdminAlertEmail } from '@/lib/notifications/adminAlerts';

const SUPPORT_ALERT_KEY = 'support-submission';
const SUPPORT_SCREENSHOTS_BUCKET = 'support-screenshots';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function safeFileName(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'screenshot';
}

async function uploadScreenshot(
  adminClient: ReturnType<typeof getAdminClient>,
  userId: string,
  file: File,
): Promise<{ name: string; path: string; url: string; size: number; type: string } | null> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${safeFileName(file.name || 'screenshot')}`;
  const storagePath = `${userId}/${fileName}`;

  const { error: uploadError } = await adminClient.storage
    .from(SUPPORT_SCREENSHOTS_BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: signedUrlData, error: signedUrlError } = await adminClient.storage
    .from(SUPPORT_SCREENSHOTS_BUCKET)
    .createSignedUrl(storagePath, 60 * 60 * 24 * 7);

  if (signedUrlError) {
    throw new Error(signedUrlError.message);
  }

  return {
    name: file.name || fileName,
    path: storagePath,
    url: signedUrlData?.signedUrl || '',
    size: file.size,
    type: file.type || 'application/octet-stream',
  };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AUTH_ERROR',
            message: userError.message,
          },
        },
        { status: 401 },
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Please sign in before sending a support request.',
          },
        },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const category = String(formData.get('category') || '').trim();
    const subject = String(formData.get('subject') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const page = String(formData.get('page') || '').trim();
    const contactEmail = String(formData.get('contactEmail') || user.email || '').trim();

    if (!category || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Category, subject, and message are required.',
          },
        },
        { status: 400 },
      );
    }

    const screenshots = formData
      .getAll('screenshots')
      .filter((entry): entry is File => entry instanceof File && entry.size > 0)
      .slice(0, 3);

    const admin = getAdminClient();
    const uploads = [];
    for (const file of screenshots) {
      const uploaded = await uploadScreenshot(admin, user.id, file);
      if (uploaded) {
        uploads.push(uploaded);
      }
    }

    const alertMessage = [
      `Support request from ${user.email || 'unknown user'}.`,
      `Category: ${category}`,
      `Subject: ${subject}`,
      `Page: ${page || 'unknown'}`,
      `Message: ${message}`,
    ].join('\n');

    const { data: eventId, error: alertError } = await admin.rpc('raise_system_alert', {
      p_alert_key: SUPPORT_ALERT_KEY,
      p_severity: 'info',
      p_title: subject,
      p_message: alertMessage,
      p_game_id: null,
      p_state_code: null,
      p_event_data: {
        category,
        subject,
        message,
        page,
        contact_email: contactEmail,
        user_id: user.id,
        user_email: user.email || null,
        screenshot_count: uploads.length,
        screenshots: uploads,
        submitted_at: new Date().toISOString(),
      },
    });

    if (alertError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ALERT_ERROR',
            message: alertError.message,
          },
        },
        { status: 500 },
      );
    }

    if (!eventId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ALERT_MISSING',
            message: 'Support alert configuration is not available.',
          },
        },
        { status: 404 },
      );
    }

    const { error: supportRequestError } = await admin.from('support_requests').insert({
      user_id: user.id,
      contact_email: contactEmail,
      category,
      subject,
      message,
      page: page || null,
      status: 'open',
      priority: 'normal',
      screenshot_count: uploads.length,
      screenshot_payload: uploads,
      alert_event_id: eventId,
    });

    if (supportRequestError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'SUPPORT_REQUEST_ERROR',
            message: supportRequestError.message,
          },
        },
        { status: 500 },
      );
    }

    await deliverAdminAlertEmail(admin, {
      alertEventId: String(eventId),
      alertKey: SUPPORT_ALERT_KEY,
      alertName: 'Support Request',
      alertType: 'support',
      severity: 'info',
      title: subject,
      message: alertMessage,
      stateCode: null,
      gameName: null,
      emailRequired: true,
      notificationChannels: { email: true },
      eventData: {
        category,
        subject,
        message,
        page,
        contact_email: contactEmail,
        user_id: user.id,
        user_email: user.email || null,
        screenshots: uploads,
      },
      alertStatus: 'raised',
    });

    return NextResponse.json({
      success: true,
      data: {
        alertId: eventId,
        screenshotCount: uploads.length,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to submit support request.',
        },
      },
      { status: 500 },
    );
  }
}
