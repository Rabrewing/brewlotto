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
      ingestion: 'unknown',
    },
    version: '1.0.0',
  };
  
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { error } = await supabase.from('lottery_games').select('id').limit(1);
    
    if (error) {
      health.services.database = 'degraded';
      health.status = 'degraded';
    } else {
      health.services.database = 'healthy';
    }
  } catch (e) {
    health.services.database = 'unhealthy';
    health.status = 'unhealthy';
  }
  
  const statusCode = health.status === 'healthy' ? 200 : 503;
  
  return NextResponse.json(health, { status: statusCode });
}
