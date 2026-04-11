/**
 * GET /api/health - System health check
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      freshness: 'unknown',
    },
    version: '1.0.0',
  };
  
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const [gamesResult, freshnessResult] = await Promise.all([
      supabase.from('lottery_games').select('id').limit(1),
      supabase
        .from('draw_freshness_status')
        .select('status')
        .in('status', ['stale', 'failed'])
        .limit(1),
    ]);

    if (gamesResult.error) {
      health.services.database = 'degraded';
      health.status = 'degraded';
    } else {
      health.services.database = 'healthy';
    }

    if (freshnessResult.error) {
      health.services.freshness = 'degraded';
      health.status = health.status === 'healthy' ? 'degraded' : health.status;
    } else if ((freshnessResult.data || []).length > 0) {
      health.services.freshness = 'degraded';
      health.status = 'degraded';
    } else {
      health.services.freshness = 'healthy';
    }
  } catch (e) {
    health.services.database = 'unhealthy';
    health.services.freshness = 'unhealthy';
    health.status = 'unhealthy';
  }
  
  const statusCode = health.status === 'healthy' ? 200 : 503;
  
  return NextResponse.json(health, { status: statusCode });
}
