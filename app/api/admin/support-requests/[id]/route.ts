/**
 * PATCH /api/admin/support-requests/[id] - Update a support request
 */

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

import { requireBrewCommandRequest } from '@/lib/auth/brewcommand';
import { sendSupportRequestStatusEmail } from '@/lib/notifications/supportRequests';

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

    const allowedStatuses = ['open', 'in_progress', 'waiting_on_user', 'resolved', 'closed'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Choose a valid support ticket status.',
          },
        },
        { status: 400 },
      );
    }

    const { data: existing, error: fetchError } = await supabase
      .from('support_requests')
      .select('id, user_id, contact_email, category, subject, message, page, status, admin_notes')
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
            message: 'Support request not found.',
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
      nextFields.first_response_at = existing.status === 'open' ? new Date().toISOString() : undefined;
    } else if (status === 'in_progress' && !existing.admin_notes) {
      nextFields.first_response_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('support_requests')
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

    if (status === 'resolved' && existing.status !== 'resolved') {
      await sendSupportRequestStatusEmail(supabase, {
        requestId: String(data.id),
        userId: data.user_id,
        contactEmail: data.contact_email,
        category: data.category,
        subject: data.subject,
        message: data.message,
        page: data.page,
        status: 'resolved',
        adminNotes: adminNotes || data.admin_notes || null,
      });
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
          message: error instanceof Error ? error.message : 'Failed to update support request.',
        },
      },
      { status: 500 },
    );
  }
}
