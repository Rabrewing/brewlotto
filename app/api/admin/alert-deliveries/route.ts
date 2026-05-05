/**
 * GET /api/admin/alert-deliveries - List recent alert delivery attempts
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
      .from('alert_deliveries')
      .select(`
        id,
        channel,
        recipient_identifier,
        status,
        sent_at,
        delivered_at,
        error_message,
        retry_count,
        created_at,
        updated_at,
        alert_events (
          id,
          title,
          severity,
          status,
          triggered_at,
          event_data,
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

    const rows = (data || []).map((delivery: any) => {
      const alertEvent = Array.isArray(delivery.alert_events) ? delivery.alert_events[0] : delivery.alert_events;
      const systemAlert = Array.isArray(alertEvent?.system_alerts)
        ? alertEvent.system_alerts[0]
        : alertEvent?.system_alerts;

      return {
        id: delivery.id,
        channel: delivery.channel,
        recipient: delivery.recipient_identifier,
        status: delivery.status,
        sentAt: delivery.sent_at,
        deliveredAt: delivery.delivered_at,
        errorMessage: delivery.error_message,
        retryCount: delivery.retry_count || 0,
        createdAt: delivery.created_at,
        updatedAt: delivery.updated_at,
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
          message: error instanceof Error ? error.message : 'Failed to load alert deliveries.',
        },
      },
      { status: 500 },
    );
  }
}
