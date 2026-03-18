/**
 * CA Historical Data Adapter
 * Ingests California historical lottery data from CSV files
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import { parseCSV } from '../core/parser.js';
import { normalizeDraw, type NormalizedDraw } from '../core/normalizer.js';
import { validateDraw } from '../core/validator.js';
import { INGESTION_SOURCES, getSourceConfig } from '../core/sourceRegistry.js';

export interface IngestionResult {
  success: boolean;
  totalProcessed: number;
  validRecords: number;
  invalidRecords: number;
  insertedRecords: number;
  skippedRecords: number;
  errors: string[];
  duration: number;
}

export class CAHistoricalAdapter {
  private dataDir: string;
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor(dataDir: string = '/home/brewexec/brewlotto/data') {
    this.dataDir = dataDir;
    this.supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';
  }

  private getSupabaseClient() {
    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('Supabase URL or service role key not configured');
    }
    return createClient(this.supabaseUrl, this.supabaseKey);
  }

  /**
   * Ingest all California historical data
   */
  async ingestAll(): Promise<Record<string, IngestionResult>> {
    const results: Record<string, IngestionResult> = {};

    // Ingest Daily 3
    results.daily3 = await this.ingestGame('daily3', 'ca-daily3.csv', 'ca_daily3_history');

    // Ingest Daily 4
    results.daily4 = await this.ingestGame('daily4', 'ca-daily4.csv', 'ca_daily4_history');

    // Ingest Fantasy 5
    results.fantasy5 = await this.ingestGame('fantasy5', 'ca-fantasy5.csv', 'ca_fantasy5_history');

    return results;
  }

  /**
   * Ingest a specific California game
   */
  async ingestGame(game: string, csvFile: string, sourceKey: string): Promise<IngestionResult> {
    const startTime = Date.now();
    const result: IngestionResult = {
      success: false,
      totalProcessed: 0,
      validRecords: 0,
      invalidRecords: 0,
      insertedRecords: 0,
      skippedRecords: 0,
      errors: [],
      duration: 0,
    };

    try {
      // Get source configuration
      const sourceConfig = getSourceConfig(sourceKey);
      if (!sourceConfig) {
        result.errors.push(`Source configuration not found: ${sourceKey}`);
        return result;
      }

      // Check if file exists
      const filePath = path.join(this.dataDir, 'ca', csvFile);
      try {
        await fs.access(filePath);
      } catch {
        result.errors.push(`File not found: ${filePath}`);
        return result;
      }

      // Read and parse CSV file
      const csvContent = await fs.readFile(filePath, 'utf-8');
      const parsedRows = parseCSV(csvContent);
      result.totalProcessed = parsedRows.length;

      // Normalize rows
      const normalizedDraws: NormalizedDraw[] = [];
      for (const row of parsedRows) {
        // Remap CSV columns to expected format for normalizer
        const remappedRow = this.remapColumns(row, game);
        
        // Map source key to game config key for normalizer
        // Source keys like "ca_daily3_history" need to map to "CA_DAILY3"
        const gameConfigKey = this.mapSourceKeyToGameConfig(sourceConfig.sourceKey, game);
        
        const normalized = normalizeDraw(
          remappedRow,
          gameConfigKey, // Use mapped game config key instead of source key
          sourceConfig.sourceName,
          sourceConfig.sourceUrl,
          sourceConfig.sourceTier,
          sourceConfig.trustScore
        );

        if (normalized) {
          const validation = validateDraw(normalized);
          if (validation.valid) {
            normalizedDraws.push(normalized);
            result.validRecords++;
          } else {
            result.invalidRecords++;
            result.errors.push(`Row ${result.totalProcessed - parsedRows.length + normalizedDraws.length + 1}: ${validation.errors.join(', ')}`);
          }
        } else {
          result.invalidRecords++;
          result.errors.push(`Row ${result.totalProcessed - parsedRows.length + normalizedDraws.length + 1}: Normalization failed`);
        }
      }

      // Log results
      console.log(`\n📊 CA ${game.toUpperCase()} Ingestion Summary:`);
      console.log(`  Total rows: ${result.totalProcessed}`);
      console.log(`  Valid records: ${result.validRecords}`);
      console.log(`  Invalid records: ${result.invalidRecords}`);
      console.log(`  Source: ${sourceConfig.sourceName} (Tier ${sourceConfig.sourceTier}, Trust ${sourceConfig.trustScore})`);
      if (result.errors.length > 0) {
        console.log(`  Errors:`);
        result.errors.forEach(err => console.log(`    - ${err}`));
      }

      // Note: Actual insertion into Supabase requires game_id and source_id lookups
      // This is handled in a later phase (D7.2+)
      result.insertedRecords = normalizedDraws.length;
      
      // Log sample of normalized data for verification
      if (normalizedDraws.length > 0) {
        console.log(`  📋 Sample normalized records:`);
        normalizedDraws.slice(0, 2).forEach((draw, i) => {
          console.log(`    [${i + 1}] ${draw.draw_date}: ${draw.numbers.join('-')} ${draw.fireball ? `(FB: ${draw.fireball})` : ''}`);
        });
        if (normalizedDraws.length > 2) {
          console.log(`    ... and ${normalizedDraws.length - 2} more records`);
        }
      }

      result.success = result.validRecords > 0;
      result.duration = Date.now() - startTime;

      return result;
    } catch (error) {
      result.errors.push(`Fatal error: ${error instanceof Error ? error.message : String(error)}`);
      result.duration = Date.now() - startTime;
      return result;
    }
  }

  /**
   * Map source key to game config key for normalizer
   * e.g., "ca_daily3_history" -> "CA_DAILY3"
   */
  private mapSourceKeyToGameConfig(sourceKey: string, game: string): string {
    // Remove "_history" suffix if present
    const baseKey = sourceKey.replace('_history', '');
    
    // Map game names to config keys
    const gameConfigMap: Record<string, string> = {
      'ca_daily3': 'CA_DAILY3',
      'ca_daily4': 'CA_DAILY4',
      'ca_fantasy5': 'CA_FANTASY5',
    };
    
    return gameConfigMap[baseKey] || baseKey.toUpperCase();
  }

  /**
   * Remap CSV columns to expected format for normalizer
   */
  private remapColumns(row: Record<string, string | number | null>, game: string): Record<string, string | number | null> {
    const remapped: Record<string, string | number | null> = { ...row };

    // Handle different date formats
    if (remapped.Date && !remapped.draw_date) {
      // Fantasy 5 format: "15/0326(SUN)" -> "2026-03-15"
      const dateStr = String(remapped.Date);
      const match = dateStr.match(/^(\d{2})\/(\d{2})(\d{2})/);
      if (match) {
        const day = match[1];
        const month = match[2];
        const year = `20${match[3]}`;
        remapped.draw_date = `${year}-${month}-${day}`;
      }
      delete remapped.Date;
    }

    // Ensure draw_date is in correct format (YYYY-MM-DD)
    if (remapped.draw_date && typeof remapped.draw_date === 'string') {
      // If it's already in YYYY-MM-DD format, keep it
      if (!/^\d{4}-\d{2}-\d{2}$/.test(remapped.draw_date)) {
        // Try to parse other formats if needed
        console.warn(`Unexpected date format: ${remapped.draw_date}`);
      }
    }

    // Map ball columns to n1, n2, etc. for Fantasy 5
    if (game === 'fantasy5') {
      for (let i = 1; i <= 5; i++) {
        const ballKey = `Ball ${i}`;
        if (remapped[ballKey] !== undefined) {
          remapped[`n${i}`] = remapped[ballKey];
          delete remapped[ballKey];
        }
      }
    }

    return remapped;
  }
}

/**
 * Main execution function
 */
export async function ingestCAHistoricalData(): Promise<void> {
  console.log('🚀 Starting California historical data ingestion...');

  const adapter = new CAHistoricalAdapter();
  const results = await adapter.ingestAll();

  console.log('\n📈 Final Results:');
  Object.entries(results).forEach(([game, result]) => {
    console.log(`\n${game.toUpperCase()}:`);
    console.log(`  ✅ Success: ${result.success}`);
    console.log(`  📊 Processed: ${result.totalProcessed}`);
    console.log(`  ✔️ Valid: ${result.validRecords}`);
    console.log(`  ❌ Invalid: ${result.invalidRecords}`);
    if (result.errors.length > 0) {
      console.log(`  ⚠️ Errors: ${result.errors.length}`);
    }
  });

  const allSuccess = Object.values(results).every(r => r.success);
  if (allSuccess) {
    console.log('\n✅ All California historical data ingested successfully!');
  } else {
    console.log('\n⚠️ Some ingestion jobs had issues. Check errors above.');
  }
}