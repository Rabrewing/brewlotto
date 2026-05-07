/**
 * GET /api/admin/support-requests - List recent support requests
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
      .from('support_requests')
      .select(`
        id,
        user_id,
        contact_email,
        category,
        subject,
        message,
        page,
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

    const rows = (data || []).map((requestRow: any) => {
      const alertEvent = Array.isArray(requestRow.alert_events)
        ? requestRow.alert_events[0]
        : requestRow.alert_events;
      const systemAlert = Array.isArray(alertEvent?.system_alerts)
        ? alertEvent.system_alerts[0]
        : alertEvent?.system_alerts;

      return {
        id: requestRow.id,
        userId: requestRow.user_id,
        contactEmail: requestRow.contact_email,
        category: requestRow.category,
        subject: requestRow.subject,
        message: requestRow.message,
        page: requestRow.page,
        status: requestRow.status,
        priority: requestRow.priority,
        screenshotCount: requestRow.screenshot_count || 0,
        screenshotPayload: requestRow.screenshot_payload || [],
        adminNotes: requestRow.admin_notes,
        firstResponseAt: requestRow.first_response_at,
        resolvedAt: requestRow.resolved_at,
        createdAt: requestRow.created_at,
        updatedAt: requestRow.updated_at,
        alertEventId: requestRow.alert_event_id,
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
          message: error instanceof Error ? error.message : 'Failed to load support requests.',
        },
      },
      { status: 500 },
    );
  }
}
