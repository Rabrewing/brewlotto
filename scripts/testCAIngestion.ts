#!/usr/bin/env node

/**
 * Test script for CA Historical Data Adapter
 * Run with: npx tsx scripts/testCAIngestion.ts
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

import { ingestCAHistoricalData } from '../lib/ingestion/adapters/caHistoricalAdapter.js';

async function main() {
  try {
    await ingestCAHistoricalData();
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

main();