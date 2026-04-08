"use strict";
/**
 * NC Cash 5 Adapter
 * Ingests North Carolina Cash 5 historical data from CSV files
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NCCash5Adapter = void 0;
exports.ingestNCCash5Data = ingestNCCash5Data;
const fs = require("fs/promises");
const path = require("path");
const supabase_js_1 = require("@supabase/supabase-js");
const parser_js_1 = require("../core/parser.js");
const normalizer_js_1 = require("../core/normalizer.js");
const validator_js_1 = require("../core/validator.js");
const sourceRegistry_js_1 = require("../core/sourceRegistry.js");
class NCCash5Adapter {
    constructor(dataDir = '/home/brewexec/brewlotto/data') {
        this.dataDir = dataDir;
        this.supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';
    }
    getSupabaseClient() {
        if (!this.supabaseUrl || !this.supabaseKey) {
            throw new Error('Supabase URL or service role key not configured');
        }
        return (0, supabase_js_1.createClient)(this.supabaseUrl, this.supabaseKey);
    }
    generateUuid() {
        return crypto.randomUUID();
    }
    /**
     * Ingest NC Cash 5 data
     */
    async ingest() {
        const startTime = Date.now();
        const result = {
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
            const sourceConfig = (0, sourceRegistry_js_1.getSourceConfig)('nc_cash5_official');
            if (!sourceConfig) {
                result.errors.push(`Source configuration not found: nc_cash5_official`);
                return result;
            }
            // Check if file exists
            const filePath = path.join(this.dataDir, 'nc', 'nc-cash5.csv');
            try {
                await fs.access(filePath);
            }
            catch {
                result.errors.push(`File not found: ${filePath}`);
                return result;
            }
            // Read and parse CSV file
            const csvContent = await fs.readFile(filePath, 'utf-8');
            const parsedRows = (0, parser_js_1.parseCSV)(csvContent);
            result.totalProcessed = parsedRows.length;
            // Normalize rows
            const normalizedDraws = [];
            for (const row of parsedRows) {
                // Remap CSV columns to expected format
                const remappedRow = this.remapColumns(row, 'cash5');
                const normalized = (0, normalizer_js_1.normalizeDraw)(remappedRow, 'NC_CASH5', // Game config key for NC Cash 5
                sourceConfig.sourceName, sourceConfig.sourceUrl, sourceConfig.sourceTier, sourceConfig.trustScore);
                if (normalized) {
                    const validation = (0, validator_js_1.validateDraw)(normalized);
                    if (validation.valid) {
                        normalizedDraws.push(normalized);
                        result.validRecords++;
                    }
                    else {
                        result.invalidRecords++;
                        result.errors.push(`Row ${result.totalProcessed - parsedRows.length + normalizedDraws.length + 1}: ${validation.errors.join(', ')}`);
                    }
                }
                else {
                    result.invalidRecords++;
                    result.errors.push(`Row ${result.totalProcessed - parsedRows.length + normalizedDraws.length + 1}: Normalization failed`);
                }
            }
            // Log results
            console.log(`\n📊 NC CASH 5 Ingestion Summary:`);
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
                    const gameId = await this.getGameId(supabase, sourceConfig.state, sourceConfig.game);
                    const sourceId = await this.getSourceId(supabase, sourceConfig.state, sourceConfig.sourceKey);
                    if (!gameId) {
                        throw new Error(`Game ID not found for state ${sourceConfig.state} and game ${sourceConfig.game}`);
                    }
                    if (!sourceId) {
                        throw new Error(`Source ID not found for source key ${sourceConfig.sourceKey}`);
                    }
                    // Transform to database format
                    const dbRecords = this.assignDrawWindows(normalizedDraws, sourceConfig.game, gameId, sourceId);
                    // Check for existing records
                    const existingChecksums = new Set();
                    const dates = dbRecords.map((r) => r.draw_date);
                    const { data: existingDraws } = await supabase
                        .from('official_draws')
                        .select('source_draw_id')
                        .eq('game_id', gameId)
                        .in('draw_date', dates);
                    if (existingDraws) {
                        existingDraws.forEach((draw) => existingChecksums.add(draw.source_draw_id));
                    }
                    // Filter out existing records
                    const newRecords = dbRecords.filter((r) => !existingChecksums.has(r.source_draw_id));
                    if (newRecords.length > 0) {
                        const { error: insertError, data: insertedData } = await supabase
                            .from('official_draws')
                            .insert(newRecords)
                            .select();
                        if (insertError) {
                            console.error(`  ❌ Insertion error: ${insertError.message}`);
                            result.errors.push(`Insertion failed: ${insertError.message}`);
                        }
                        else {
                            result.insertedRecords = insertedData?.length || 0;
                            console.log(`  📥 Inserted ${result.insertedRecords} new records into Supabase`);
                        }
                    }
                    else {
                        console.log(`  📥 All ${dbRecords.length} records already exist in Supabase`);
                        result.insertedRecords = 0;
                    }
                }
                catch (supabaseError) {
                    const errorMessage = supabaseError instanceof Error ? supabaseError.message : String(supabaseError);
                    console.error(`  ❌ Supabase error: ${errorMessage}`);
                    result.errors.push(`Supabase error: ${errorMessage}`);
                }
            }
            else {
                result.insertedRecords = 0;
            }
            result.success = result.validRecords > 0;
            result.duration = Date.now() - startTime;
            return result;
        }
        catch (error) {
            result.errors.push(`Fatal error: ${error instanceof Error ? error.message : String(error)}`);
            result.duration = Date.now() - startTime;
            return result;
        }
    }
    /**
     * Remap CSV columns to expected format for normalizer
     */
    remapColumns(row, game) {
        const remapped = { ...row };
        // Handle NC CSV format: "MM/DD/YYYY", "Ball 1", "Ball 2", ..., "Ball 5", "DP"
        if (remapped.Date && !remapped.draw_date) {
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
        // Store draw type in draw_time field (DP column indicates if it's a day or evening draw)
        if (remapped['DP'] !== undefined && !remapped.draw_time) {
            // DP column: 0 = Evening, 1 = Day (based on observation of the data)
            const dpValue = Number(remapped['DP']);
            remapped.draw_time = dpValue === 1 ? 'day' : 'evening';
            delete remapped['DP'];
        }
        // Map ball columns to n1, n2, etc. for normalizer
        for (let i = 1; i <= 5; i++) {
            const ballKey = `Ball ${i}`;
            if (remapped[ballKey] !== undefined) {
                remapped[`n${i}`] = remapped[ballKey];
                delete remapped[ballKey];
            }
        }
        return remapped;
    }
    /**
     * Assign draw windows (day/evening) based on draw type
     */
    assignDrawWindows(draws, game, gameId, sourceId) {
        const dbRecords = [];
        draws.forEach(draw => {
            // Determine draw window from draw_time (which we stored during remapping)
            const drawType = draw.draw_time ? String(draw.draw_time).toLowerCase() : 'evening';
            const windowLabel = drawType.includes('day') ? 'day' : 'evening';
            // Set time based on draw type (NC Cash 5: Day ~1:00 PM ET, Evening ~8:30 PM ET)
            const timeStr = windowLabel === 'day' ? '13:00:00' : '20:30:00';
            dbRecords.push({
                id: this.generateUuid(),
                game_id: gameId,
                draw_date: draw.draw_date,
                draw_window_label: windowLabel,
                draw_datetime_local: `${draw.draw_date}T${timeStr}-05:00`, // ET timezone
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
    async getGameId(supabase, state, game) {
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
    async getSourceId(supabase, state, sourceKey) {
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
        const sourceConfig = (0, sourceRegistry_js_1.getSourceConfig)(sourceKey);
        if (!sourceConfig) {
            console.error(`  ❌ Source configuration not found for ${sourceKey}`);
            return null;
        }
        // Map source type to allowed values
        const sourceTypeMap = {
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
    getGameConfig(game) {
        const configs = {
            cash5: {
                displayName: 'Cash 5',
                gameFamily: 'cash5',
                primaryCount: 5,
                primaryMin: 1,
                primaryMax: 43,
                hasBonus: false,
                bonusCount: 0,
                drawStyle: 'twice_daily',
                supportsMultiplier: false,
                supportsFireball: false,
                scheduleConfig: {
                    windows: [
                        { label: 'day', time: '13:00', cutoff: 0 },
                        { label: 'evening', time: '20:30', cutoff: 0 }
                    ]
                }
            }
        };
        return configs[game] || configs.cash5;
    }
}
exports.NCCash5Adapter = NCCash5Adapter;
/**
 * Main execution function
 */
async function ingestNCCash5Data() {
    console.log('🚀 Starting NC Cash 5 data ingestion...');
    const adapter = new NCCash5Adapter();
    const result = await adapter.ingest();
    console.log('\n📈 Final Results:');
    console.log(`NC CASH 5:`);
    console.log(`  ✅ Success: ${result.success}`);
    console.log(`  📊 Processed: ${result.totalProcessed}`);
    console.log(`  ✔️ Valid: ${result.validRecords}`);
    console.log(`  ❌ Invalid: ${result.invalidRecords}`);
    console.log(`  📥 Inserted: ${result.insertedRecords}`);
    if (result.errors.length > 0) {
        console.log(`  ⚠️ Errors: ${result.errors.length}`);
    }
    if (result.success) {
        console.log('\n✅ NC Cash 5 data ingested successfully!');
    }
    else {
        console.log('\n⚠️ NC Cash 5 ingestion had issues. Check errors above.');
    }
}
