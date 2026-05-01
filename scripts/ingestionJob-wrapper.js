#!/usr/bin/env node'

import { spawn } from 'child_process';

const proc = spawn('tsx', ['scripts/ingestionJob.js'], {
  stdio: 'inherit',
  env: process.env
});

proc.on('close', (code) => {
  process.exit(code);
});
