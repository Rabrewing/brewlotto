#!/usr/bin/env node

/**
 * Test script for Multi-State Powerball Adapter
 * Run with: npx tsx scripts/testMultiStatePowerball.ts
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

import { ingestMultiStatePowerballData } from '../lib/ingestion/adapters/multiStatePowerballAdapter.js';

async function main() {
  try {
    await ingestMultiStatePowerballData();
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

main();