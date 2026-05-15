/**
 * GET /api/admin/qa-reports - List recent QA reports
 */

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

import { requireBrewCommandRequest } from '@/lib/auth/brewcommand';

const getSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

export async function GET(request: NextRequest) {
  try {
    const unauthorizedResponse = await requireBrewCommandRequest(request);
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '12', 10), 1), 50);

    const { data, error } = await supabase
      .from('qa_reports')
      .select(`
        id,
        user_id,
        contact_email,
        tester_name,
        tier_tested,
        journey_stage,
        feature_area,
        page_path,
        loaded_as_expected,
        tier_matched,
        next_step_matched,
        fireball_relevant,
        timepulse_relevant,
        expected_behavior,
        actual_behavior,
        notes,
        browser_info,
        status,
        priority,
        screenshot_count,
        screenshot_payload,
        admin_notes,
        first_response_at,
        resolved_at,
        created_at,
        updated_at,
        alert_event_id,
        alert_events (
          id,
          title,
          severity,
          status,
          triggered_at,
          system_alerts (
            alert_key,
            alert_name,
            alert_type
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

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

    const rows = (data || []).map((reportRow: any) => {
      const alertEvent = Array.isArray(reportRow.alert_events)
        ? reportRow.alert_events[0]
        : reportRow.alert_events;
      const systemAlert = Array.isArray(alertEvent?.system_alerts)
        ? alertEvent.system_alerts[0]
        : alertEvent?.system_alerts;

      return {
        id: reportRow.id,
        userId: reportRow.user_id,
        contactEmail: reportRow.contact_email,
        testerName: reportRow.tester_name,
        tierTested: reportRow.tier_tested,
        journeyStage: reportRow.journey_stage,
        featureArea: reportRow.feature_area,
        pagePath: reportRow.page_path,
        loadedAsExpected: reportRow.loaded_as_expected,
        tierMatched: reportRow.tier_matched,
        nextStepMatched: reportRow.next_step_matched,
        fireballRelevant: reportRow.fireball_relevant,
        timepulseRelevant: reportRow.timepulse_relevant,
        expectedBehavior: reportRow.expected_behavior,
        actualBehavior: reportRow.actual_behavior,
        notes: reportRow.notes,
        browserInfo: reportRow.browser_info || {},
        status: reportRow.status,
        priority: reportRow.priority,
        screenshotCount: reportRow.screenshot_count || 0,
        screenshotPayload: reportRow.screenshot_payload || [],
        adminNotes: reportRow.admin_notes,
        firstResponseAt: reportRow.first_response_at,
        resolvedAt: reportRow.resolved_at,
        createdAt: reportRow.created_at,
        updatedAt: reportRow.updated_at,
        alertEventId: reportRow.alert_event_id,
        alert: alertEvent
          ? {
              id: alertEvent.id,
              title: alertEvent.title,
              severity: alertEvent.severity,
              status: alertEvent.status,
              triggeredAt: alertEvent.triggered_at,
              alertKey: systemAlert?.alert_key || null,
              alertName: systemAlert?.alert_name || null,
              alertType: systemAlert?.alert_type || null,
            }
          : null,
      };
    });

    return NextResponse.json({
      success: true,
      data: rows,
      meta: {
        total: rows.length,
        limit,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to load QA reports.',
        },
      },
      { status: 500 },
    );
  }
}
