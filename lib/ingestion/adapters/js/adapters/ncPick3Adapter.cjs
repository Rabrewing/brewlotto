"use strict";
/**
 * NC Pick 3 Adapter
 * Ingests North Carolina Pick 3 historical data from CSV files
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NCPick3Adapter = void 0;
exports.ingestNCPick3Data = ingestNCPick3Data;
const fs = require("fs/promises");
const path = require("path");
const supabase_js_1 = require('@supabase/supabase-js');
const parser_js_1 = require(__dirname + '/../core/parser.cjs');
const normalizer_js_1 = require(__dirname + '/../core/normalizer.cjs');
const validator_js_1 = require(__dirname + '/../core/validator.cjs');
const sourceRegistry_js_1 = require(__dirname + '/../core/sourceRegistry.cjs');
class NCPick3Adapter {
    constructor(dataDir = process.cwd() + '/data') {
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
     * Ingest NC Pick 3 data
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
            const sourceConfig = (0, sourceRegistry_js_1.getSourceConfig)('nc_pick3_official');
            if (!sourceConfig) {
                result.errors.push(`Source configuration not found: nc_pick3_official`);
                return result;
            }
            // Check if file exists
            const filePath = path.join(this.dataDir, 'nc', 'nc-pick3.csv');
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
                const remappedRow = this.remapColumns(row, 'pick3');
                const normalized = (0, normalizer_js_1.normalizeDraw)(remappedRow, 'NC_PICK3', // Game config key for NC Pick 3
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
            console.log(`\n📊 NC PICK 3 Ingestion Summary:`);
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
        // Handle NC CSV format: "MM/DD/YYYY", "Draw Type", "Num1-Num2-Num3"
        if (remapped['Draw Date'] && !remapped.draw_date) {
            const dateStr = String(remapped['Draw Date']);
            const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
            if (match) {
                const month = match[1];
                const day = match[2];
                const year = match[3];
                remapped.draw_date = `${year}-${month}-${day}`;
            }
            delete remapped['Draw Date'];
        }
        if (remapped['Draw Type'] && !remapped.draw_time) {
            // Store draw type in draw_time field for processing later
            remapped.draw_time = String(remapped['Draw Type']);
            delete remapped['Draw Type'];
        }
        if (remapped['Winning Numbers'] && !remapped.n1) {
            const numbersStr = String(remapped['Winning Numbers']);
            const numbers = numbersStr
                .split('-')
                .map(n => parseInt(n.trim()))
                .filter(n => !isNaN(n));
            // Store as individual n1, n2, n3 fields for normalizer
            if (numbers.length >= 1)
                remapped.n1 = numbers[0];
            if (numbers.length >= 2)
                remapped.n2 = numbers[1];
            if (numbers.length >= 3)
                remapped.n3 = numbers[2];
            delete remapped['Winning Numbers'];
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
            // Set time based on draw type (NC Pick 3: Day ~1:00 PM ET, Evening ~8:30 PM ET)
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
            pick3: {
                displayName: 'Pick 3',
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
                        { label: 'day', time: '13:00', cutoff: 0 },
                        { label: 'evening', time: '20:30', cutoff: 0 }
                    ]
                }
            }
        };
        return configs[game] || configs.pick3;
    }
}
exports.NCPick3Adapter = NCPick3Adapter;
/**
 * Main execution function
 */
async function ingestNCPick3Data() {
    console.log('🚀 Starting NC Pick 3 data ingestion...');
    const adapter = new NCPick3Adapter();
    const result = await adapter.ingest();
    console.log('\n📈 Final Results:');
    console.log(`NC PICK 3:`);
    console.log(`  ✅ Success: ${result.success}`);
    console.log(`  📊 Processed: ${result.totalProcessed}`);
    console.log(`  ✔️ Valid: ${result.validRecords}`);
    console.log(`  ❌ Invalid: ${result.invalidRecords}`);
    console.log(`  📥 Inserted: ${result.insertedRecords}`);
    if (result.errors.length > 0) {
        console.log(`  ⚠️ Errors: ${result.errors.length}`);
    }
    if (result.success) {
        console.log('\n✅ NC Pick 3 data ingested successfully!');
    }
    else {
        console.log('\n⚠️ NC Pick 3 ingestion had issues. Check errors above.');
    }
}
