/**
 * POST /api/internal/alerts/raise - Internal endpoint to raise alerts from jobs/services
 * Access: Service role or internal secret only
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { deliverAdminAlertEmail } from '@/lib/notifications/adminAlerts';

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Verify internal API key
    const apiKey = request.headers.get('x-internal-api-key');
    const internalKey = process.env.INTERNAL_API_KEY;
    
    if (internalKey && apiKey !== internalKey) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Invalid internal API key' } },
        { status: 403 }
      );
    }
    
    const supabase = getSupabase();
    const body = await request.json();
    
    const {
      alert_key,
      source_module,
      category,
      severity = 'warning',
      title,
      message,
      fingerprint,
      state,
      game,
      email_required = false,
      metadata = {},
    } = body;
    
    if (!alert_key || !title || !message) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'alert_key, title, and message are required' } },
        { status: 400 }
      );
    }
    
    // Look up the alert configuration
    const { data: alertConfig } = await supabase
      .from('system_alerts')
      .select('id, alert_name, alert_type, severity, notification_channels')
      .eq('alert_key', alert_key)
      .eq('is_enabled', true)
      .single();
    
    if (!alertConfig) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: `Alert config '${alert_key}' not found or disabled` } },
        { status: 404 }
      );
    }
    
    // Check for existing open alert with same fingerprint (dedup)
    let existingAlert = null;
    if (fingerprint) {
      const { data } = await supabase
        .from('alert_events')
        .select('id, event_data')
        .eq('alert_id', alertConfig.id)
        .eq('status', 'open')
        .eq('event_data->>fingerprint', fingerprint)
        .single();
      
      existingAlert = data;
    }
    
    let alertId: string;
    let createdOrUpdated = 'created';
    
    if (existingAlert) {
      // Update existing alert
      const occurrenceCount = (existingAlert.event_data?.occurrence_count || 1) + 1;
      
      await supabase
        .from('alert_events')
        .update({
          event_data: {
            ...existingAlert.event_data,
            occurrence_count: occurrenceCount,
            last_seen_at: new Date().toISOString(),
          },
          triggered_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingAlert.id);
      
      alertId = existingAlert.id;
      createdOrUpdated = 'updated';
    } else {
      // Create new alert event
      const { data: newAlert } = await supabase
        .from('alert_events')
        .insert({
          alert_id: alertConfig.id,
          game_id: game || null,
          state_code: state || null,
          severity,
          status: 'raised',
          title,
          message,
          event_data: {
            fingerprint,
            source_module: source_module || alert_key,
            category: category || 'system',
            email_required,
            email_last_sent_at: null,
            occurrence_count: 1,
            metadata,
          },
        })
        .select('id')
        .single();
      
      alertId = newAlert?.id;
    }

    const alertEventData = existingAlert?.event_data || {
      fingerprint,
      source_module: source_module || alert_key,
      category: category || 'system',
      email_required,
      email_last_sent_at: null,
      occurrence_count: 1,
      metadata,
    };

    const emailDispatch = await deliverAdminAlertEmail(supabase, {
      alertEventId: alertId,
      alertKey: alert_key,
      alertName: alertConfig?.alert_name || alert_key,
      alertType: alertConfig?.alert_type || category || 'system',
      severity,
      title,
      message,
      stateCode: state || null,
      gameName: game || null,
      emailRequired: email_required,
      notificationChannels: (alertConfig?.notification_channels as Record<string, unknown> | null) || null,
      eventData: alertEventData,
      alertStatus: 'raised',
    });
    
    return NextResponse.json({
      success: true,
      data: {
        alertId,
        status: 'open',
        createdOrUpdated,
        emailDispatch,
      },
      meta: {}
    }, { status: createdOrUpdated === 'created' ? 201 : 200 });
  } catch (error: any) {
    console.error('Internal raise alert error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
