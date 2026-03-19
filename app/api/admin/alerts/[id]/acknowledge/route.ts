/**
 * POST /api/admin/alerts/[id]/acknowledge - Acknowledge an alert
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabase();
    const body = await request.json().catch(() => ({}));
    
    const { acknowledged_by } = body;
    
    const { data, error } = await supabase
      .from('alert_events')
      .update({
        status: 'acknowledged',
        acknowledged_at: new Date().toISOString(),
        acknowledged_by: acknowledged_by || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'UPDATE_ERROR', message: error.message } },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        status: data.status,
        acknowledgedAt: data.acknowledged_at,
        acknowledgedBy: data.acknowledged_by
      },
      meta: {}
    });
  } catch (error: any) {
    console.error('Alert acknowledge error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
