#!/usr/bin/env node

/**
 * Test script for Multi-State Mega Millions Adapter
 * Run with: npx tsx scripts/testMultiStateMegaMillions.ts
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

import { ingestMultiStateMegaMillionsData } from '../lib/ingestion/adapters/multiStateMegaMillionsAdapter.js';

async function main() {
  try {
    await ingestMultiStateMegaMillionsData();
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

main();