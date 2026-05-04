#!/usr/bin/env node'

import http from 'http';
import { spawn } from 'child_process';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const PORT = process.env.PORT || 8080;

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
);

function runIngestion(res) {
  console.log('🚀 Starting ingestion job...');  
  
  const proc = spawn('node', ['scripts/ingestionJob.js'], {
    env: process.env,
    stdio: 'pipe'
  });

  let output = '';
  let errorOutput = '';

  proc.stdout.on('data', (data) => {
    const text = data.toString();
    output += text;
    console.log(text.trim());
  });

  proc.stderr.on('data', (data) => {
    const text = data.toString();
    errorOutput += text;
    console.error(text.trim());
  });

  proc.on('close', (code) => {
    console.log(`✅ Ingestion completed with code ${code}`);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: code === 0 ? 'completed' : 'failed',
      exitCode: code,
      timestamp: new Date().toISOString(),
      output: output.slice(-1000),
      error: errorOutput.slice(-500)
    }));
  });

  proc.on('error', (err) => {
    console.error('❌ Failed to start ingestion:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'failed',
      error: err.message,
      timestamp: new Date().toISOString()
    }));
  });
}

const server = http.createServer((req, res) => {
  console.log(`📥 Received ${req.method} request to ${req.url}`);

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
    return;
  }

  // Run ingestion (async)
  runIngestion(res);
});

server.listen(PORT, () => {
  console.log(`🚀 Ingestion service listening on port ${PORT}`);
});
