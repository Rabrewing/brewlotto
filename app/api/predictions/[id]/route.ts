/**
 * GET /api/predictions/[id] - Get prediction by ID
 * PUT /api/predictions/[id] - Update prediction
 * DELETE /api/predictions/[id] - Delete prediction
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
      .from('predictions')
      .select(`
        *,
        prediction_explanations(*),
        prediction_strategy_scores(*)
      `)
      .eq('id', id)
      .single();
    
    if (error || !data) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Prediction not found' } },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data,
      meta: {}
    });
  } catch (error: any) {
    console.error('Prediction GET error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabase();
    const body = await request.json();
    
    const { is_saved, is_featured } = body;
    
    const { data, error } = await supabase
      .from('predictions')
      .update({
        is_saved: is_saved ?? undefined,
        is_featured: is_featured ?? undefined,
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
      data,
      meta: {}
    });
  } catch (error: any) {
    console.error('Prediction PUT error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabase();
    
    const { error } = await supabase
      .from('predictions')
      .delete()
      .eq('id', id);
    
    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'DELETE_ERROR', message: error.message } },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: { id },
      meta: {}
    });
  } catch (error: any) {
    console.error('Prediction DELETE error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
