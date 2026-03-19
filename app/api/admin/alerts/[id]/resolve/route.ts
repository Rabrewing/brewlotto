/**
 * POST /api/admin/alerts/[id]/resolve - Resolve an alert
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
    
    const { resolved_by } = body;
    
    const { data, error } = await supabase
      .from('alert_events')
      .update({
        status: 'resolved',
        resolved_at: new Date().toISOString(),
        resolved_by: resolved_by || null,
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
        resolvedAt: data.resolved_at,
        resolvedBy: data.resolved_by
      },
      meta: {}
    });
  } catch (error: any) {
    console.error('Alert resolve error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
