/**
 * Multi-State Powerball Adapter
 * Ingests Powerball historical data from CSV files
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import { parseCSV } from '../core/parser.js';
import { normalizeDraw, type NormalizedDraw } from '../core/normalizer.js';
import { validateDraw } from '../core/validator.js';
import { getSourceConfig } from '../core/sourceRegistry.js';

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

export class MultiStatePowerballAdapter {
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

  private generateUuid(): string {
    return crypto.randomUUID();
  }

  /**
   * Ingest Powerball data for both NC and CA states
   */
  async ingestAll(): Promise<Record<string, IngestionResult>> {
    const results: Record<string, IngestionResult> = {};

    // Ingest for NC
    results.nc_powerball = await this.ingestGameState('NC', 'powerball', 'powerball.csv', 'powerball_official');

    // Ingest for CA
    results.ca_powerball = await this.ingestGameState('CA', 'powerball', 'powerball.csv', 'powerball_official');

    return results;
  }

  /**
   * Ingest Powerball data for a specific state
   */
  async ingestGameState(state: string, game: string, csvFile: string, sourceKey: string): Promise<IngestionResult> {
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
      const filePath = path.join(this.dataDir, 'multi-state', csvFile);
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
        // Remap CSV columns to expected format
        const remappedRow = this.remapColumns(row, game);
        
        // Map source key to game config key
        const gameConfigKey = `${state}_POWERBALL`;
        
        const normalized = normalizeDraw(
          remappedRow,
          gameConfigKey,
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
      console.log(`\n📊 ${state} POWERBALL Ingestion Summary:`);
      console.log(`  Total rows: ${result.totalProcessed}`);
      console.log(`  Valid records: ${result.validRecords}`);
      console.log(`  Invalid records: ${result.invalidRecords}`);
      console.log(`  Source: ${sourceConfig.sourceName} (Tier ${sourceConfig.sourceTier}, Trust ${sourceConfig.trustScore})`);
      if (result.errors.length > 0) {
        console.log(`  Errors:`);
        result.errors.forEach(err => console.log(`    - ${err}`));
      }

      // Insert into Supabase
      if (normalizedDraws.length > 0) {
        try {
          const supabase = this.getSupabaseClient();
          
          // Get game_id and source_id
          const gameId = await this.getGameId(supabase, state, game);
          const sourceId = await this.getSourceId(supabase, sourceConfig.state, sourceKey);
          
          if (!gameId) {
            throw new Error(`Game ID not found for state ${state} and game ${game}`);
          }
          if (!sourceId) {
            throw new Error(`Source ID not found for source key ${sourceKey}`);
          }
          
          // Transform to database format with DoubleDraw handling
          const dbRecords = this.assignDrawWindows(normalizedDraws, game, gameId, sourceId, state);
          
          // Check for existing records
          const existingChecksums: Set<string> = new Set();
          const dates = dbRecords.map((r: any) => r.draw_date);
          const { data: existingDraws } = await supabase
            .from('official_draws')
            .select('source_draw_id')
            .eq('game_id', gameId)
            .in('draw_date', dates);
          
          if (existingDraws) {
            existingDraws.forEach((draw: any) => existingChecksums.add(draw.source_draw_id));
          }
          
          // Filter out existing records
          const newRecords = dbRecords.filter((r: any) => !existingChecksums.has(r.source_draw_id));
          
          if (newRecords.length > 0) {
            const { error: insertError, data: insertedData } = await supabase
              .from('official_draws')
              .insert(newRecords)
              .select();

            if (insertError) {
              console.error(`  ❌ Insertion error: ${insertError.message}`);
              result.errors.push(`Insertion failed: ${insertError.message}`);
            } else {
              result.insertedRecords = insertedData?.length || 0;
              console.log(`  📥 Inserted ${result.insertedRecords} new records into Supabase`);
            }
          } else {
            console.log(`  📥 All ${dbRecords.length} records already exist in Supabase`);
            result.insertedRecords = 0;
          }
          
          // Show draw window assignments
          if (dbRecords.length > 0) {
            console.log(`  🕐 Draw window assignments:`);
            dbRecords.slice(0, 2).forEach((record: any, i: number) => {
              console.log(`    [${i + 1}] ${record.draw_date} ${record.draw_window_label}: ${record.primary_numbers.join('-')} PB:${record.bonus_numbers.join('-')} @ ${record.draw_datetime_local}`);
            });
            if (dbRecords.length > 2) {
              console.log(`    ... and ${dbRecords.length - 2} more records`);
            }
          }
        } catch (supabaseError: unknown) {
          const errorMessage = supabaseError instanceof Error ? supabaseError.message : String(supabaseError);
          console.error(`  ❌ Supabase error: ${errorMessage}`);
          result.errors.push(`Supabase error: ${errorMessage}`);
        }
      } else {
        result.insertedRecords = 0;
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
   * Remap CSV columns to expected format for normalizer
   */
  private remapColumns(row: Record<string, string | number | null>, game: string): Record<string, string | number | null> {
    const remapped: Record<string, string | number | null> = { ...row };

    // Handle Powerball CSV format
    if (remapped.Date) {
      // Powerball format: "03/14/2026"
      const dateStr = String(remapped.Date);
      const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
      if (match) {
        const month = match[1];
        const day = match[2];
        const year = match[3];
        remapped.draw_date = `${year}-${month}-${day}`;
      }
      delete remapped.Date;
    }

    // Remap Powerball columns
    if (remapped['Powerball'] !== undefined) {
      remapped.bonus_number = remapped['Powerball'];
      delete remapped['Powerball'];
    }

    // Handle DoubleDraw
    if (remapped.SubName === 'DoubleDraw') {
      remapped.draw_variant = 'double_draw';
    }
    delete remapped.SubName;

    return remapped;
  }

  /**
   * Assign draw windows (day/evening/nightly) based on draw schedule
   */
  private assignDrawWindows(
    draws: NormalizedDraw[],
    game: string,
    gameId: string,
    sourceId: string,
    state: string
  ): any[] {
    const dbRecords: any[] = [];

    draws.forEach(draw => {
      // Powerball draws are on Mon/Wed/Sat at 10:59 PM ET
      // For simplicity, we'll use 'nightly' as the window label
      const windowLabel = draw.draw_variant === 'double_draw' ? 'double_draw' : 'nightly';
      
      dbRecords.push({
        id: this.generateUuid(),
        game_id: gameId,
        draw_date: draw.draw_date,
        draw_window_label: windowLabel,
        draw_datetime_local: `${draw.draw_date}T22:59:00-05:00`, // 10:59 PM ET
        primary_numbers: draw.numbers,
        bonus_numbers: draw.bonus_number ? [draw.bonus_number] : [],
        multiplier_value: draw.multiplier ? parseInt(draw.multiplier) : null,
        fireball_value: draw.fireball || null,
        special_values: draw.special_values || {},
        source_id: sourceId,
        source_draw_id: draw.checksum,
        source_payload: draw.raw_payload || {},
        result_status: 'official',
        is_latest_snapshot: false,
      });
    });

    return dbRecords;
  }

  /**
   * Get or create game ID from Supabase
   */
  private async getGameId(supabase: any, state: string, game: string): Promise<string | null> {
    const { data: existingGame, error: selectError } = await supabase
      .from('lottery_games')
      .select('id')
      .eq('state_code', state)
      .eq('game_key', game)
      .maybeSingle();
    
    if (selectError) {
      console.error(`Error fetching game ID for ${state} ${game}:`, selectError.message);
      return null;
    }
    
    if (existingGame) {
      return existingGame.id;
    }
    
    // Game doesn't exist, create it
    console.log(`  ℹ️ Creating game record for ${state} ${game}...`);
    const newGameId = this.generateUuid();
    
    const gameConfig = this.getGameConfig(game);
    
    const { error: insertError } = await supabase
      .from('lottery_games')
      .insert({
        id: newGameId,
        state_code: state,
        game_key: game,
        display_name: gameConfig.displayName,
        game_family: gameConfig.gameFamily,
        primary_count: gameConfig.primaryCount,
        primary_min: gameConfig.primaryMin,
        primary_max: gameConfig.primaryMax,
        has_bonus: gameConfig.hasBonus,
        bonus_count: gameConfig.bonusCount,
        bonus_min: gameConfig.bonusMin,
        bonus_max: gameConfig.bonusMax,
        bonus_label: gameConfig.bonusLabel,
        draw_style: gameConfig.drawStyle,
        supports_multiplier: gameConfig.supportsMultiplier,
        supports_fireball: gameConfig.supportsFireball,
        schedule_config: gameConfig.scheduleConfig,
      });
    
    if (insertError) {
      console.error(`  ❌ Error creating game record: ${insertError.message}`);
      return null;
    }
    
    return newGameId;
  }

  /**
   * Get or create source ID from Supabase
   */
  private async getSourceId(supabase: any, state: string, sourceKey: string): Promise<string | null> {
    const { data: existingSource, error: selectError } = await supabase
      .from('draw_sources')
      .select('id')
      .eq('state_code', state)
      .eq('source_key', sourceKey)
      .maybeSingle();
    
    if (selectError) {
      console.error(`Error fetching source ID for ${state} ${sourceKey}:`, selectError.message);
      return null;
    }
    
    if (existingSource) {
      return existingSource.id;
    }
    
    // Source doesn't exist, create it
    console.log(`  ℹ️ Creating source record for ${state} ${sourceKey}...`);
    const newSourceId = this.generateUuid();
    
    const sourceConfig = getSourceConfig(sourceKey);
    if (!sourceConfig) {
      console.error(`  ❌ Source configuration not found for ${sourceKey}`);
      return null;
    }
    
    // Map source type to allowed values
    const sourceTypeMap: Record<string, string> = {
      'official': 'api',
      'official-page': 'html',
      'trusted-archive': 'csv',
      'community': 'manual',
    };
    
    const mappedSourceType = sourceTypeMap[sourceConfig.sourceType] || 'manual';
    
    const { error: insertError } = await supabase
      .from('draw_sources')
      .insert({
        id: newSourceId,
        state_code: state,
        source_key: sourceKey,
        source_type: mappedSourceType,
        base_url: sourceConfig.sourceUrl,
        parser_key: 'csv',
        priority: 1,
        is_official: sourceConfig.sourceType === 'official',
        is_active: sourceConfig.isActive,
      });
    
    if (insertError) {
      console.error(`  ❌ Error creating source record: ${insertError.message}`);
      return null;
    }
    
    return newSourceId;
  }

  /**
   * Get game configuration based on game type
   */
  private getGameConfig(game: string): any {
    const configs: Record<string, any> = {
      powerball: {
        displayName: 'Powerball',
        gameFamily: 'powerball',
        primaryCount: 5,
        primaryMin: 1,
        primaryMax: 69,
        hasBonus: true,
        bonusCount: 1,
        bonusMin: 1,
        bonusMax: 26,
        bonusLabel: 'Powerball',
        drawStyle: 'weekly',
        supportsMultiplier: true,
        supportsFireball: false,
        scheduleConfig: {
          windows: [
            { label: 'nightly', time: '22:59', days: ['Mon', 'Wed', 'Sat'] }
          ]
        }
      }
    };
    
    return configs[game] || configs.powerball;
  }
}

/**
 * Main execution function
 */
export async function ingestMultiStatePowerballData(): Promise<void> {
  console.log('🚀 Starting Multi-State Powerball data ingestion...');

  const adapter = new MultiStatePowerballAdapter();
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
    console.log('\n✅ All Multi-State Powerball data ingested successfully!');
  } else {
    console.log('\n⚠️ Some ingestion jobs had issues. Check errors above.');
  }
}