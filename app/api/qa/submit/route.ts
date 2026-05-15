import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/lib/supabase/serverClient';
import { deliverAdminAlertEmail } from '@/lib/notifications/adminAlerts';
import { isBrewCommandAccessUser } from '@/lib/auth/brewcommandShared';

const QA_ALERT_KEY = 'qa-submission';
const QA_SCREENSHOTS_BUCKET = 'qa-screenshots';
const MAX_SCREENSHOTS = 4;

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
    .from(QA_SCREENSHOTS_BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: signedUrlData, error: signedUrlError } = await adminClient.storage
    .from(QA_SCREENSHOTS_BUCKET)
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

function parseBoolean(value: FormDataEntryValue | null | undefined) {
  return String(value || '').toLowerCase() === 'true';
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
            message: 'Please sign in before sending a QA report.',
          },
        },
        { status: 401 },
      );
    }

    if (!isBrewCommandAccessUser(user)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Approved BrewCommand testers only.',
          },
        },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const testerName = String(formData.get('testerName') || '').trim();
    const contactEmail = String(formData.get('contactEmail') || user.email || '').trim();
    const tierTested = String(formData.get('tierTested') || 'free').trim().toLowerCase();
    const journeyStage = String(formData.get('journeyStage') || 'start_here').trim().toLowerCase();
    const featureArea = String(formData.get('featureArea') || 'dashboard').trim().toLowerCase();
    const pagePath = String(formData.get('pagePath') || '').trim();
    const expectedBehavior = String(formData.get('expectedBehavior') || '').trim();
    const actualBehavior = String(formData.get('actualBehavior') || '').trim();
    const notes = String(formData.get('notes') || '').trim();
    const priority = String(formData.get('priority') || 'normal').trim().toLowerCase();
    const loadedAsExpected = parseBoolean(formData.get('loadedAsExpected'));
    const tierMatched = parseBoolean(formData.get('tierMatched'));
    const nextStepMatched = parseBoolean(formData.get('nextStepMatched'));
    const fireballRelevant = parseBoolean(formData.get('fireballRelevant'));
    const timepulseRelevant = parseBoolean(formData.get('timepulseRelevant'));
    const browserInfoRaw = String(formData.get('browserInfo') || '{}').trim();

    if (!expectedBehavior || !actualBehavior) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Expected behavior and actual behavior are required.',
          },
        },
        { status: 400 },
      );
    }

    const screenshots = formData
      .getAll('screenshots')
      .filter((entry): entry is File => entry instanceof File && entry.size > 0)
      .slice(0, MAX_SCREENSHOTS);

    let browserInfo = {} as Record<string, unknown>;
    try {
      browserInfo = JSON.parse(browserInfoRaw || '{}') as Record<string, unknown>;
    } catch {
      browserInfo = {};
    }

    const admin = getAdminClient();
    const uploads = [];
    for (const file of screenshots) {
      const uploaded = await uploadScreenshot(admin, user.id, file);
      if (uploaded) {
        uploads.push(uploaded);
      }
    }

    const behaviorScore = [loadedAsExpected, tierMatched, nextStepMatched].filter(Boolean).length;
    const allowedPriorities = ['low', 'normal', 'high', 'urgent'];
    const qaPriority = allowedPriorities.includes(priority)
      ? priority
      : behaviorScore >= 3
        ? 'normal'
        : behaviorScore === 2
          ? 'high'
          : 'urgent';
    const qaMessage = [
      `QA report from ${contactEmail || user.email || 'unknown user'}.`,
      `Tester: ${testerName || 'Unspecified'}`,
      `Tier: ${tierTested}`,
      `Stage: ${journeyStage}`,
      `Feature: ${featureArea}`,
      `Page: ${pagePath || 'unknown'}`,
      `Loaded as expected: ${loadedAsExpected ? 'yes' : 'no'}`,
      `Tier matched: ${tierMatched ? 'yes' : 'no'}`,
      `Next step matched: ${nextStepMatched ? 'yes' : 'no'}`,
      `Fireball relevant: ${fireballRelevant ? 'yes' : 'no'}`,
      `TimePulse relevant: ${timepulseRelevant ? 'yes' : 'no'}`,
      `Expected behavior: ${expectedBehavior}`,
      `Actual behavior: ${actualBehavior}`,
      `Notes: ${notes || 'None'}`,
    ].join('\n');

    const { data: eventId, error: alertError } = await admin.rpc('raise_system_alert', {
      p_alert_key: QA_ALERT_KEY,
      p_severity: 'info',
      p_title: `${tierTested.toUpperCase()} QA report`,
      p_message: qaMessage,
      p_game_id: null,
      p_state_code: null,
      p_event_data: {
        tester_name: testerName,
        contact_email: contactEmail,
        user_id: user.id,
        user_email: user.email || null,
        tier_tested: tierTested,
        journey_stage: journeyStage,
        feature_area: featureArea,
        page_path: pagePath,
        loaded_as_expected: loadedAsExpected,
        tier_matched: tierMatched,
        next_step_matched: nextStepMatched,
        fireball_relevant: fireballRelevant,
        timepulse_relevant: timepulseRelevant,
        expected_behavior: expectedBehavior,
        actual_behavior: actualBehavior,
        notes,
        screenshot_count: uploads.length,
        screenshots: uploads,
        browser_info: browserInfo,
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
            message: 'QA alert configuration is not available.',
          },
        },
        { status: 404 },
      );
    }

    const { error: reportError } = await admin.from('qa_reports').insert({
      user_id: user.id,
      contact_email: contactEmail,
      tester_name: testerName || null,
      tier_tested: tierTested,
      journey_stage: journeyStage,
      feature_area: featureArea,
      page_path: pagePath || null,
      loaded_as_expected: loadedAsExpected,
      tier_matched: tierMatched,
      next_step_matched: nextStepMatched,
      fireball_relevant: fireballRelevant,
      timepulse_relevant: timepulseRelevant,
      expected_behavior: expectedBehavior,
      actual_behavior: actualBehavior,
      notes: notes || null,
      browser_info: browserInfo,
      status: 'open',
      priority: qaPriority,
      screenshot_count: uploads.length,
      screenshot_payload: uploads,
      alert_event_id: eventId,
    });

    if (reportError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'QA_REPORT_ERROR',
            message: reportError.message,
          },
        },
        { status: 500 },
      );
    }

    await deliverAdminAlertEmail(admin, {
      alertEventId: String(eventId),
      alertKey: QA_ALERT_KEY,
      alertName: 'QA Test Report',
      alertType: 'qa',
      severity: 'info',
      title: `${tierTested.toUpperCase()} QA report`,
      message: qaMessage,
      stateCode: null,
      gameName: null,
      emailRequired: true,
      notificationChannels: { email: true },
      eventData: {
        tester_name: testerName || null,
        contact_email: contactEmail,
        user_id: user.id,
        user_email: user.email || null,
        tier_tested: tierTested,
        journey_stage: journeyStage,
        feature_area: featureArea,
        page_path: pagePath || null,
        loaded_as_expected: loadedAsExpected,
        tier_matched: tierMatched,
        next_step_matched: nextStepMatched,
        fireball_relevant: fireballRelevant,
        timepulse_relevant: timepulseRelevant,
        expected_behavior: expectedBehavior,
        actual_behavior: actualBehavior,
        notes: notes || null,
        browser_info: browserInfo,
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
          message: error instanceof Error ? error.message : 'Failed to submit QA report.',
        },
      },
      { status: 500 },
    );
  }
}
