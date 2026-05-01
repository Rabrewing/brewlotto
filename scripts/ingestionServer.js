#!/usr/bin/env node

import http from 'http';
import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const PORT = process.env.PORT || 8080;

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
);

function runIngestion() {
  console.log('🚀 Starting ingestion job...');
  try {
    const output = execSync('node scripts/ingestionJob.js', { 
      encoding: 'utf-8', 
      timeout: 300000 // 5 minute timeout
    });
    console.log('✅ Ingestion completed successfully');
    return { success: true, output };
  } catch (error) {
    console.error('❌ Ingestion failed:', error.message);
    return { success: false, error: error.message };
  }
}

const server = http.createServer((req, res) => {
  console.log(`📥 Received ${req.method} request to ${req.url}`);

  // Run ingestion
  const result = runIngestion();

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: result.success ? 'completed' : 'failed',
    timestamp: new Date().toISOString(),
    ...result
  }));
});

server.listen(PORT, () => {
  console.log(`🚀 Ingestion service listening on port ${PORT}`);
});
