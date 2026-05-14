import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const supabase = getAdmin();
    const { data, error } = await supabase
      .from('brewu_content')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('section_key', { ascending: true });

    if (error) {
      return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: { message: error instanceof Error ? error.message : 'Server error' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getAdmin();
    const body = await request.json();
    const { section_key, state_code, game_key, title, body: contentBody, sort_order } = body;

    if (!section_key || !title || !contentBody) {
      return NextResponse.json(
        { success: false, error: { message: 'section_key, title, and body are required' } },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('brewu_content')
      .insert({
        section_key,
        state_code: state_code || null,
        game_key: game_key || null,
        title,
        body: contentBody,
        sort_order: sort_order || 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: { message: error instanceof Error ? error.message : 'Server error' } },
      { status: 500 }
    );
  }
}
