/**
 * GET /api/admin/alerts/summary - Get alert summary for dashboard widgets
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireBrewCommandRequest } from '@/lib/auth/brewcommand';

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const unauthorizedResponse = await requireBrewCommandRequest(request);
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const supabase = getSupabase();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get counts by status and severity
    const [openAlerts, criticalAlerts, warningAlerts, acknowledgedAlerts, resolvedToday] = await Promise.all([
      supabase.from('alert_events').select('id', { count: 'exact' }).neq('status', 'resolved'),
      supabase.from('alert_events').select('id', { count: 'exact' }).eq('severity', 'critical').neq('status', 'resolved'),
      supabase.from('alert_events').select('id', { count: 'exact' }).eq('severity', 'warning').neq('status', 'resolved'),
      supabase.from('alert_events').select('id', { count: 'exact' }).eq('status', 'acknowledged'),
      supabase.from('alert_events').select('id', { count: 'exact' }).eq('status', 'resolved').gte('resolved_at', today.toISOString()),
    ]);
    
    // Get counts by category
    const { data: categoryData } = await supabase
      .from('alert_events')
      .select('id, system_alerts(alert_type)')
      .neq('status', 'resolved');
    
    const byCategory: Record<string, number> = {};
    categoryData?.forEach((alert: any) => {
      const cat = alert.system_alerts?.alert_type || 'unknown';
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    });
    
    // Get latest critical alert
    const { data: latestCritical } = await supabase
      .from('alert_events')
      .select('id, title, triggered_at')
      .eq('severity', 'critical')
      .neq('status', 'resolved')
      .order('triggered_at', { ascending: false })
      .limit(1)
      .single();
    
    return NextResponse.json({
      success: true,
      data: {
        openCount: openAlerts.count || 0,
        criticalOpenCount: criticalAlerts.count || 0,
        warningOpenCount: warningAlerts.count || 0,
        acknowledgedCount: acknowledgedAlerts.count || 0,
        resolvedTodayCount: resolvedToday.count || 0,
        byCategory,
        latestCritical: latestCritical ? {
          id: latestCritical.id,
          title: latestCritical.title,
          lastSeenAt: latestCritical.triggered_at
        } : null,
      },
      meta: {}
    });
  } catch (error: any) {
    console.error('Alerts summary GET error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
