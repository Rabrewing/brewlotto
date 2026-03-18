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

      // Insert into Supabase (D7.2)
      if (normalizedDraws.length > 0) {
        try {
          const supabase = this.getSupabaseClient();
          
          // Get game_id and source_id
          const gameId = await this.getGameId(supabase, sourceConfig.state, game);
          const sourceId = await this.getSourceId(supabase, sourceConfig.state, sourceKey);
          
          if (!gameId) {
            throw new Error(`Game ID not found for state ${sourceConfig.state} and game ${game}`);
          }
          if (!sourceId) {
            throw new Error(`Source ID not found for source key ${sourceKey}`);
          }
          
          // Transform to database format
          // For games with multiple draws per day, we need to determine day/evening
          const dbRecords = this.assignDrawWindows(normalizedDraws, game, gameId, sourceId);

          // For historical data, we'll insert directly (no upsert due to unique constraint complexity)
          // First, check for existing records to avoid duplicates
          const existingChecksums: Set<string> = new Set();
          
          // Get existing draws for this game and date range
          const dates = dbRecords.map(r => r.draw_date);
          const { data: existingDraws } = await supabase
            .from('official_draws')
            .select('source_draw_id')
            .eq('game_id', gameId)
            .in('draw_date', dates);
          
          if (existingDraws) {
            existingDraws.forEach((draw: any) => existingChecksums.add(draw.source_draw_id));
          }
          
          // Filter out existing records
          const newRecords = dbRecords.filter(r => !existingChecksums.has(r.source_draw_id));
          
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
          
          // Show what draw windows are assigned
          if (dbRecords.length > 0) {
            console.log(`  🕐 Draw window assignments:`);
            dbRecords.slice(0, 2).forEach((record: any, i: number) => {
              console.log(`    [${i + 1}] ${record.draw_date} ${record.draw_window_label}: ${record.primary_numbers.join('-')} @ ${record.draw_datetime_local}`);
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

      // Success if we have valid records and no fatal errors (invalid records are expected)
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
   * Generate a UUID
   */
  private generateUuid(): string {
    return crypto.randomUUID();
  }

  /**
   * Get or create game ID from Supabase
   */
  private async getGameId(supabase: any, state: string, game: string): Promise<string | null> {
    const gameKeyMap: Record<string, string> = {
      'daily3': 'daily3',
      'daily4': 'daily4',
      'fantasy5': 'fantasy5',
    };
    
    const gameKey = gameKeyMap[game] || game;
    
    // Try to find existing game
    const { data: existingGame, error: selectError } = await supabase
      .from('lottery_games')
      .select('id')
      .eq('state_code', state)
      .eq('game_key', gameKey)
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
        game_key: gameKey,
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
    // Try to find existing source
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
        parser_key: 'csv', // Default parser key
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
      daily3: {
        displayName: 'Daily 3',
        gameFamily: 'pick3',
        primaryCount: 3,
        primaryMin: 0,
        primaryMax: 9,
        hasBonus: false,
        bonusCount: 0,
        drawStyle: 'twice_daily',
        supportsMultiplier: false,
        supportsFireball: true,
        scheduleConfig: {
          windows: [
            { label: 'day', time: '13:29', cutoff: 30 },
            { label: 'evening', time: '18:59', cutoff: 30 }
          ]
        }
      },
      daily4: {
        displayName: 'Daily 4',
        gameFamily: 'pick4',
        primaryCount: 4,
        primaryMin: 0,
        primaryMax: 9,
        hasBonus: false,
        bonusCount: 0,
        drawStyle: 'twice_daily',
        supportsMultiplier: false,
        supportsFireball: true,
        scheduleConfig: {
          windows: [
            { label: 'day', time: '13:29', cutoff: 30 },
            { label: 'evening', time: '18:59', cutoff: 30 }
          ]
        }
      },
      fantasy5: {
        displayName: 'Fantasy 5',
        gameFamily: 'cash5',
        primaryCount: 5,
        primaryMin: 1,
        primaryMax: 39,
        hasBonus: false,
        bonusCount: 0,
        drawStyle: 'daily',
        supportsMultiplier: false,
        supportsFireball: false,
        scheduleConfig: {
          windows: [
            { label: 'nightly', time: '18:45', cutoff: 60 }
          ]
        }
      }
    };
    
    return configs[game] || configs.daily3;
  }

  /**
   * Assign draw windows (day/evening) based on draw order
   */
  private assignDrawWindows(
    draws: NormalizedDraw[], 
    game: string, 
    gameId: string, 
    sourceId: string
  ): any[] {
    // Group draws by date
    const drawsByDate: Record<string, NormalizedDraw[]> = {};
    draws.forEach(draw => {
      if (!drawsByDate[draw.draw_date]) {
        drawsByDate[draw.draw_date] = [];
      }
      drawsByDate[draw.draw_date].push(draw);
    });

    const dbRecords: any[] = [];

    Object.entries(drawsByDate).forEach(([date, dateDraws]) => {
      // Sort by draw_id (from raw_payload or checksum) to determine order
      // For now, we'll assume the order in the CSV is chronological
      // Later, we could parse the draw_id from raw_payload if available
      
      if (game === 'daily3' || game === 'daily4') {
        // These games have 2 draws per day: day and evening
        // But data sources might only include one draw per day
        if (dateDraws.length === 2) {
          // Two draws: assume first is day, second is evening
          dateDraws.forEach((draw, index) => {
            const isDayDraw = index === 0;
            const windowLabel = isDayDraw ? 'day' : 'evening';
            const timeStr = isDayDraw ? '13:29:00' : '18:59:00'; // 1:29 PM and 6:59 PM PT
            
            dbRecords.push({
              id: this.generateUuid(),
              game_id: gameId,
              draw_date: draw.draw_date,
              draw_window_label: windowLabel,
              draw_datetime_local: `${draw.draw_date}T${timeStr}-07:00`,
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
        } else {
          // Single draw: default to evening (main draw)
          const draw = dateDraws[0];
          dbRecords.push({
            id: this.generateUuid(),
            game_id: gameId,
            draw_date: draw.draw_date,
            draw_window_label: 'evening',
            draw_datetime_local: `${draw.draw_date}T18:59:00-07:00`,
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
        }
      } else {
        // Fantasy 5 and other games have 1 draw per day
        const draw = dateDraws[0];
        dbRecords.push({
          id: this.generateUuid(),
          game_id: gameId,
          draw_date: draw.draw_date,
          draw_window_label: 'nightly',
          draw_datetime_local: `${draw.draw_date}T18:45:00-07:00`, // 6:45 PM PT
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
      }
    });

    return dbRecords;
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