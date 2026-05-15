/**
 * PATCH /api/admin/qa-reports/[id] - Update a QA report
 */

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

import { requireBrewCommandRequest } from '@/lib/auth/brewcommand';

const getSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const unauthorizedResponse = await requireBrewCommandRequest(request);
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const { id } = await params;
    const supabase = getSupabase();
    const body = await request.json().catch(() => ({}));
    const status = String(body?.status || '').trim();
    const adminNotes = String(body?.adminNotes || '').trim();

    const allowedStatuses = ['open', 'reviewing', 'triaged', 'resolved', 'closed'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Choose a valid QA report status.',
          },
        },
        { status: 400 },
      );
    }

    const { data: existing, error: fetchError } = await supabase
      .from('qa_reports')
      .select('id, status, admin_notes')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FETCH_ERROR',
            message: fetchError.message,
          },
        },
        { status: 500 },
      );
    }

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'QA report not found.',
          },
        },
        { status: 404 },
      );
    }

    const nextFields: Record<string, unknown> = {
      status,
      admin_notes: adminNotes || existing.admin_notes || null,
      updated_at: new Date().toISOString(),
    };

    if (status === 'resolved' && existing.status !== 'resolved') {
      nextFields.resolved_at = new Date().toISOString();
    } else if (status === 'reviewing' && !existing.admin_notes) {
      nextFields.first_response_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('qa_reports')
      .update(nextFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UPDATE_ERROR',
            message: error.message,
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        status: data.status,
        adminNotes: data.admin_notes,
        firstResponseAt: data.first_response_at,
        resolvedAt: data.resolved_at,
      },
      meta: {},
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update QA report.',
        },
      },
      { status: 500 },
    );
  }
}
