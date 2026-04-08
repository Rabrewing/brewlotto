"use strict";
/**
 * NC Pick 3 Adapter
 * Ingests North Carolina Pick 3 historical data from CSV files
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NCPick3Adapter = void 0;
exports.ingestNCPick3Data = ingestNCPick3Data;
var fs = require("fs/promises");
var path = require("path");
var supabase_js_1 = require("@supabase/supabase-js");
var parser_js_1 = require("../core/parser.js");
var normalizer_js_1 = require("../core/normalizer.js");
var validator_js_1 = require("../core/validator.js");
var sourceRegistry_js_1 = require("../core/sourceRegistry.js");
var NCPick3Adapter = /** @class */ (function () {
    function NCPick3Adapter(dataDir) {
        if (dataDir === void 0) { dataDir = '/home/brewexec/brewlotto/data'; }
        this.dataDir = dataDir;
        this.supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';
    }
    NCPick3Adapter.prototype.getSupabaseClient = function () {
        if (!this.supabaseUrl || !this.supabaseKey) {
            throw new Error('Supabase URL or service role key not configured');
        }
        return (0, supabase_js_1.createClient)(this.supabaseUrl, this.supabaseKey);
    };
    NCPick3Adapter.prototype.generateUuid = function () {
        return crypto.randomUUID();
    };
    /**
     * Ingest NC Pick 3 data
     */
    NCPick3Adapter.prototype.ingest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, result, sourceConfig, filePath, _a, csvContent, parsedRows, normalizedDraws, _i, parsedRows_1, row, remappedRow, normalized, validation, supabase, gameId, sourceId, dbRecords, existingChecksums_1, dates, existingDraws, newRecords, _b, insertError, insertedData, supabaseError_1, errorMessage, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        startTime = Date.now();
                        result = {
                            success: false,
                            totalProcessed: 0,
                            validRecords: 0,
                            invalidRecords: 0,
                            insertedRecords: 0,
                            skippedRecords: 0,
                            errors: [],
                            duration: 0,
                        };
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 18, , 19]);
                        sourceConfig = (0, sourceRegistry_js_1.getSourceConfig)('nc_pick3_official');
                        if (!sourceConfig) {
                            result.errors.push("Source configuration not found: nc_pick3_official");
                            return [2 /*return*/, result];
                        }
                        filePath = path.join(this.dataDir, 'nc', 'nc-pick3.csv');
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.access(filePath)];
                    case 3:
                        _c.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _a = _c.sent();
                        result.errors.push("File not found: ".concat(filePath));
                        return [2 /*return*/, result];
                    case 5: return [4 /*yield*/, fs.readFile(filePath, 'utf-8')];
                    case 6:
                        csvContent = _c.sent();
                        parsedRows = (0, parser_js_1.parseCSV)(csvContent);
                        result.totalProcessed = parsedRows.length;
                        normalizedDraws = [];
                        for (_i = 0, parsedRows_1 = parsedRows; _i < parsedRows_1.length; _i++) {
                            row = parsedRows_1[_i];
                            remappedRow = this.remapColumns(row, 'pick3');
                            normalized = (0, normalizer_js_1.normalizeDraw)(remappedRow, 'NC_PICK3', // Game config key for NC Pick 3
                            sourceConfig.sourceName, sourceConfig.sourceUrl, sourceConfig.sourceTier, sourceConfig.trustScore);
                            if (normalized) {
                                validation = (0, validator_js_1.validateDraw)(normalized);
                                if (validation.valid) {
                                    normalizedDraws.push(normalized);
                                    result.validRecords++;
                                }
                                else {
                                    result.invalidRecords++;
                                    result.errors.push("Row ".concat(result.totalProcessed - parsedRows.length + normalizedDraws.length + 1, ": ").concat(validation.errors.join(', ')));
                                }
                            }
                            else {
                                result.invalidRecords++;
                                result.errors.push("Row ".concat(result.totalProcessed - parsedRows.length + normalizedDraws.length + 1, ": Normalization failed"));
                            }
                        }
                        // Log results
                        console.log("\n\uD83D\uDCCA NC PICK 3 Ingestion Summary:");
                        console.log("  Total rows: ".concat(result.totalProcessed));
                        console.log("  Valid records: ".concat(result.validRecords));
                        console.log("  Invalid records: ".concat(result.invalidRecords));
                        console.log("  Source: ".concat(sourceConfig.sourceName, " (Tier ").concat(sourceConfig.sourceTier, ", Trust ").concat(sourceConfig.trustScore, ")"));
                        if (result.errors.length > 0) {
                            console.log("  Errors:");
                            result.errors.forEach(function (err) { return console.log("    - ".concat(err)); });
                        }
                        if (!(normalizedDraws.length > 0)) return [3 /*break*/, 16];
                        _c.label = 7;
                    case 7:
                        _c.trys.push([7, 14, , 15]);
                        supabase = this.getSupabaseClient();
                        return [4 /*yield*/, this.getGameId(supabase, sourceConfig.state, sourceConfig.game)];
                    case 8:
                        gameId = _c.sent();
                        return [4 /*yield*/, this.getSourceId(supabase, sourceConfig.state, sourceConfig.sourceKey)];
                    case 9:
                        sourceId = _c.sent();
                        if (!gameId) {
                            throw new Error("Game ID not found for state ".concat(sourceConfig.state, " and game ").concat(sourceConfig.game));
                        }
                        if (!sourceId) {
                            throw new Error("Source ID not found for source key ".concat(sourceConfig.sourceKey));
                        }
                        dbRecords = this.assignDrawWindows(normalizedDraws, sourceConfig.game, gameId, sourceId);
                        existingChecksums_1 = new Set();
                        dates = dbRecords.map(function (r) { return r.draw_date; });
                        return [4 /*yield*/, supabase
                                .from('official_draws')
                                .select('source_draw_id')
                                .eq('game_id', gameId)
                                .in('draw_date', dates)];
                    case 10:
                        existingDraws = (_c.sent()).data;
                        if (existingDraws) {
                            existingDraws.forEach(function (draw) { return existingChecksums_1.add(draw.source_draw_id); });
                        }
                        newRecords = dbRecords.filter(function (r) { return !existingChecksums_1.has(r.source_draw_id); });
                        if (!(newRecords.length > 0)) return [3 /*break*/, 12];
                        return [4 /*yield*/, supabase
                                .from('official_draws')
                                .insert(newRecords)
                                .select()];
                    case 11:
                        _b = _c.sent(), insertError = _b.error, insertedData = _b.data;
                        if (insertError) {
                            console.error("  \u274C Insertion error: ".concat(insertError.message));
                            result.errors.push("Insertion failed: ".concat(insertError.message));
                        }
                        else {
                            result.insertedRecords = (insertedData === null || insertedData === void 0 ? void 0 : insertedData.length) || 0;
                            console.log("  \uD83D\uDCE5 Inserted ".concat(result.insertedRecords, " new records into Supabase"));
                        }
                        return [3 /*break*/, 13];
                    case 12:
                        console.log("  \uD83D\uDCE5 All ".concat(dbRecords.length, " records already exist in Supabase"));
                        result.insertedRecords = 0;
                        _c.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        supabaseError_1 = _c.sent();
                        errorMessage = supabaseError_1 instanceof Error ? supabaseError_1.message : String(supabaseError_1);
                        console.error("  \u274C Supabase error: ".concat(errorMessage));
                        result.errors.push("Supabase error: ".concat(errorMessage));
                        return [3 /*break*/, 15];
                    case 15: return [3 /*break*/, 17];
                    case 16:
                        result.insertedRecords = 0;
                        _c.label = 17;
                    case 17:
                        result.success = result.validRecords > 0;
                        result.duration = Date.now() - startTime;
                        return [2 /*return*/, result];
                    case 18:
                        error_1 = _c.sent();
                        result.errors.push("Fatal error: ".concat(error_1 instanceof Error ? error_1.message : String(error_1)));
                        result.duration = Date.now() - startTime;
                        return [2 /*return*/, result];
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Remap CSV columns to expected format for normalizer
     */
    NCPick3Adapter.prototype.remapColumns = function (row, game) {
        var remapped = __assign({}, row);
        // Handle NC CSV format: "MM/DD/YYYY", "Draw Type", "Num1-Num2-Num3"
        if (remapped['Draw Date'] && !remapped.draw_date) {
            var dateStr = String(remapped['Draw Date']);
            var match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
            if (match) {
                var month = match[1];
                var day = match[2];
                var year = match[3];
                remapped.draw_date = "".concat(year, "-").concat(month, "-").concat(day);
            }
            delete remapped['Draw Date'];
        }
        if (remapped['Draw Type'] && !remapped.draw_time) {
            // Store draw type in draw_time field for processing later
            remapped.draw_time = String(remapped['Draw Type']);
            delete remapped['Draw Type'];
        }
        if (remapped['Winning Numbers'] && !remapped.n1) {
            var numbersStr = String(remapped['Winning Numbers']);
            var numbers = numbersStr
                .split('-')
                .map(function (n) { return parseInt(n.trim()); })
                .filter(function (n) { return !isNaN(n); });
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
    };
    /**
     * Assign draw windows (day/evening) based on draw type
     */
    NCPick3Adapter.prototype.assignDrawWindows = function (draws, game, gameId, sourceId) {
        var _this = this;
        var dbRecords = [];
        draws.forEach(function (draw) {
            // Determine draw window from draw_time (which we stored during remapping)
            var drawType = draw.draw_time ? String(draw.draw_time).toLowerCase() : 'evening';
            var windowLabel = drawType.includes('day') ? 'day' : 'evening';
            // Set time based on draw type (NC Pick 3: Day ~1:00 PM ET, Evening ~8:30 PM ET)
            var timeStr = windowLabel === 'day' ? '13:00:00' : '20:30:00';
            dbRecords.push({
                id: _this.generateUuid(),
                game_id: gameId,
                draw_date: draw.draw_date,
                draw_window_label: windowLabel,
                draw_datetime_local: "".concat(draw.draw_date, "T").concat(timeStr, "-05:00"), // ET timezone
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
    };
    /**
     * Get or create game ID from Supabase
     */
    NCPick3Adapter.prototype.getGameId = function (supabase, state, game) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, existingGame, selectError, newGameId, gameConfig, insertError;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('lottery_games')
                            .select('id')
                            .eq('state_code', state)
                            .eq('game_key', game)
                            .maybeSingle()];
                    case 1:
                        _a = _b.sent(), existingGame = _a.data, selectError = _a.error;
                        if (selectError) {
                            console.error("Error fetching game ID for ".concat(state, " ").concat(game, ":"), selectError.message);
                            return [2 /*return*/, null];
                        }
                        if (existingGame) {
                            return [2 /*return*/, existingGame.id];
                        }
                        // Game doesn't exist, create it
                        console.log("  \u2139\uFE0F Creating game record for ".concat(state, " ").concat(game, "..."));
                        newGameId = this.generateUuid();
                        gameConfig = this.getGameConfig(game);
                        return [4 /*yield*/, supabase
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
                            })];
                    case 2:
                        insertError = (_b.sent()).error;
                        if (insertError) {
                            console.error("  \u274C Error creating game record: ".concat(insertError.message));
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, newGameId];
                }
            });
        });
    };
    /**
     * Get or create source ID from Supabase
     */
    NCPick3Adapter.prototype.getSourceId = function (supabase, state, sourceKey) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, existingSource, selectError, newSourceId, sourceConfig, sourceTypeMap, mappedSourceType, insertError;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('draw_sources')
                            .select('id')
                            .eq('state_code', state)
                            .eq('source_key', sourceKey)
                            .maybeSingle()];
                    case 1:
                        _a = _b.sent(), existingSource = _a.data, selectError = _a.error;
                        if (selectError) {
                            console.error("Error fetching source ID for ".concat(state, " ").concat(sourceKey, ":"), selectError.message);
                            return [2 /*return*/, null];
                        }
                        if (existingSource) {
                            return [2 /*return*/, existingSource.id];
                        }
                        // Source doesn't exist, create it
                        console.log("  \u2139\uFE0F Creating source record for ".concat(state, " ").concat(sourceKey, "..."));
                        newSourceId = this.generateUuid();
                        sourceConfig = (0, sourceRegistry_js_1.getSourceConfig)(sourceKey);
                        if (!sourceConfig) {
                            console.error("  \u274C Source configuration not found for ".concat(sourceKey));
                            return [2 /*return*/, null];
                        }
                        sourceTypeMap = {
                            'official': 'api',
                            'official-page': 'html',
                            'trusted-archive': 'csv',
                            'community': 'manual',
                        };
                        mappedSourceType = sourceTypeMap[sourceConfig.sourceType] || 'manual';
                        return [4 /*yield*/, supabase
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
                            })];
                    case 2:
                        insertError = (_b.sent()).error;
                        if (insertError) {
                            console.error("  \u274C Error creating source record: ".concat(insertError.message));
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, newSourceId];
                }
            });
        });
    };
    /**
     * Get game configuration based on game type
     */
    NCPick3Adapter.prototype.getGameConfig = function (game) {
        var configs = {
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
    };
    return NCPick3Adapter;
}());
exports.NCPick3Adapter = NCPick3Adapter;
/**
 * Main execution function
 */
function ingestNCPick3Data() {
    return __awaiter(this, void 0, void 0, function () {
        var adapter, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🚀 Starting NC Pick 3 data ingestion...');
                    adapter = new NCPick3Adapter();
                    return [4 /*yield*/, adapter.ingest()];
                case 1:
                    result = _a.sent();
                    console.log('\n📈 Final Results:');
                    console.log("NC PICK 3:");
                    console.log("  \u2705 Success: ".concat(result.success));
                    console.log("  \uD83D\uDCCA Processed: ".concat(result.totalProcessed));
                    console.log("  \u2714\uFE0F Valid: ".concat(result.validRecords));
                    console.log("  \u274C Invalid: ".concat(result.invalidRecords));
                    console.log("  \uD83D\uDCE5 Inserted: ".concat(result.insertedRecords));
                    if (result.errors.length > 0) {
                        console.log("  \u26A0\uFE0F Errors: ".concat(result.errors.length));
                    }
                    if (result.success) {
                        console.log('\n✅ NC Pick 3 data ingested successfully!');
                    }
                    else {
                        console.log('\n⚠️ NC Pick 3 ingestion had issues. Check errors above.');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
