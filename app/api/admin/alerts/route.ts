/**
 * GET /api/admin/alerts - List alerts
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '25');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    let query = supabase
      .from('alert_events')
      .select(`
        *,
        system_alerts(id, alert_key, alert_name, alert_type, severity, description)
      `)
      .order('triggered_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (status) {
      query = query.eq('status', status);
    }
    if (severity) {
      query = query.eq('severity', severity);
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'FETCH_ERROR', message: error.message } },
        { status: 500 }
      );
    }
    
    const formattedData = (data || []).map((alert: any) => ({
      id: alert.id,
      alertKey: alert.system_alerts?.alert_key,
      sourceModule: alert.system_alerts?.alert_type,
      category: alert.system_alerts?.alert_type,
      severity: alert.severity,
      status: alert.status,
      state: alert.state_code,
      game: alert.game_id,
      title: alert.title,
      message: alert.message,
      firstSeenAt: alert.triggered_at,
      lastSeenAt: alert.triggered_at,
      emailRequired: alert.event_data?.email_required || false,
      emailLastSentAt: alert.event_data?.email_last_sent_at,
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedData,
      meta: { total: count || 0, limit, offset }
    });
  } catch (error: any) {
    console.error('Alerts GET error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
