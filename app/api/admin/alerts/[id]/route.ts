/**
 * GET /api/admin/alerts/[id] - Get alert detail
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('alert_events')
      .select(`
        *,
        system_alerts(id, alert_key, alert_name, alert_type, severity, description, threshold_config)
      `)
      .eq('id', id)
      .single();
    
    if (error || !data) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Alert not found' } },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        alertKey: data.system_alerts?.alert_key,
        sourceModule: data.system_alerts?.alert_type,
        category: data.system_alerts?.alert_type,
        severity: data.severity,
        status: data.status,
        state: data.state_code,
        game: data.game_id,
        title: data.title,
        message: data.message,
        fingerprint: data.event_data?.fingerprint,
        occurrenceCount: data.event_data?.occurrence_count || 1,
        firstSeenAt: data.triggered_at,
        lastSeenAt: data.triggered_at,
        acknowledgedAt: data.acknowledged_at,
        acknowledgedBy: data.acknowledged_by,
        resolvedAt: data.resolved_at,
        resolvedBy: data.resolved_by,
        emailRequired: data.event_data?.email_required || false,
        emailLastSentAt: data.event_data?.email_last_sent_at,
        metadata: data.event_data?.metadata || {},
      },
      meta: {}
    });
  } catch (error: any) {
    console.error('Alert detail GET error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
