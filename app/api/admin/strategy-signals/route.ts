import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

import { requireBrewCommandRequest } from '@/lib/auth/brewcommand';

const getSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback: number | null = null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function GET(request: NextRequest) {
  try {
    const unauthorizedResponse = await requireBrewCommandRequest(request);
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('user_notifications')
      .select('id, user_id, title, body, cta_label, cta_url, priority, is_read, created_at, metadata')
      .contains('metadata', { source: 'strategy_signal' })
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FETCH_ERROR',
            message: error.message,
          },
        },
        { status: 500 },
      );
    }

    const rows = (data || []).map((row) => {
      const metadata = row.metadata && typeof row.metadata === 'object' ? (row.metadata as Record<string, unknown>) : {};

      return {
        id: row.id,
        userId: row.user_id,
        contactEmail: asString(metadata.contact_email || metadata.contactEmail || ''),
        title: row.title,
        body: row.body,
        ctaLabel: row.cta_label,
        ctaUrl: row.cta_url,
        priority: row.priority,
        isRead: row.is_read,
        createdAt: row.created_at,
        state: asString(metadata.state || ''),
        gameKey: asString(metadata.game_key || ''),
        gameLabel: asString(metadata.game_label || ''),
        drawDate: asString(metadata.draw_date || ''),
        drawWindowLabel: asString(metadata.draw_window_label || ''),
        signalType: asString(metadata.signal_type || ''),
        signalReason: asString(metadata.signal_reason || ''),
        momentumPercent: asNumber(metadata.momentum_percent, null),
        hotNumbers: Array.isArray(metadata.hot_numbers) ? metadata.hot_numbers.filter((value) => typeof value === 'number') : [],
        coldNumbers: Array.isArray(metadata.cold_numbers) ? metadata.cold_numbers.filter((value) => typeof value === 'number') : [],
        signalKey: asString(metadata.signal_key || ''),
        eligibleStrategyKeys: Array.isArray(metadata.eligible_strategy_keys)
          ? metadata.eligible_strategy_keys.filter((value) => typeof value === 'string')
          : [],
      };
    });

    const summary = {
      totalSignals: rows.length,
      highPriority: rows.filter((row) => row.priority === 'high').length,
      unread: rows.filter((row) => !row.isRead).length,
      surgeSignals: rows.filter((row) => row.signalType === 'momentum_surge').length,
      recentEmails: rows.filter((row) => Boolean(row.contactEmail)).length,
    };

    return NextResponse.json({
      success: true,
      data: {
        summary,
        recent: rows,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown server error',
        },
      },
      { status: 500 },
    );
  }
}
