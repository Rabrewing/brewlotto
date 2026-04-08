"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeDraw = normalizeDraw;
var GAME_CONFIGS = {
    'NC_PICK3': { state: 'NC', game: 'pick3', primaryCount: 3, primaryMin: 0, primaryMax: 9, supportsFireball: true },
    'NC_PICK4': { state: 'NC', game: 'pick4', primaryCount: 4, primaryMin: 0, primaryMax: 9, supportsFireball: true },
    'NC_CASH5': { state: 'NC', game: 'cash5', primaryCount: 5, primaryMin: 1, primaryMax: 43, hasBonus: false },
    'NC_POWERBALL': { state: 'NC', game: 'powerball', primaryCount: 5, primaryMin: 1, primaryMax: 69, hasBonus: true, bonusCount: 1, bonusMin: 1, bonusMax: 26 },
    'NC_MEGA_MILLIONS': { state: 'NC', game: 'mega_millions', primaryCount: 5, primaryMin: 1, primaryMax: 70, hasBonus: true, bonusCount: 1, bonusMin: 1, bonusMax: 25 },
    'CA_DAILY3': { state: 'CA', game: 'daily3', primaryCount: 3, primaryMin: 0, primaryMax: 9, supportsFireball: true },
    'CA_DAILY4': { state: 'CA', game: 'daily4', primaryCount: 4, primaryMin: 0, primaryMax: 9, supportsFireball: true },
    'CA_FANTASY5': { state: 'CA', game: 'fantasy5', primaryCount: 5, primaryMin: 1, primaryMax: 39 },
    'CA_POWERBALL': { state: 'CA', game: 'powerball', primaryCount: 5, primaryMin: 1, primaryMax: 69, hasBonus: true, bonusCount: 1, bonusMin: 1, bonusMax: 26 },
    'CA_MEGA_MILLIONS': { state: 'CA', game: 'mega_millions', primaryCount: 5, primaryMin: 1, primaryMax: 70, hasBonus: true, bonusCount: 1, bonusMin: 1, bonusMax: 25 },
};
/**
 * Normalize a parsed row into canonical format
 */
function normalizeDraw(row, sourceKey, sourceName, sourceUrl, sourceTier, trustScore) {
    if (sourceTier === void 0) { sourceTier = 2; }
    if (trustScore === void 0) { trustScore = 75; }
    var configKey = "".concat(sourceKey).toUpperCase();
    var config = GAME_CONFIGS[configKey];
    if (!config) {
        console.warn("Unknown game config: ".concat(sourceKey));
        return null;
    }
    // Extract draw date
    var drawDate = extractDate(row);
    if (!drawDate)
        return null;
    // Extract numbers based on game type
    var numbers = extractNumbers(row, config.primaryCount);
    if (numbers.length !== config.primaryCount)
        return null;
    // Extract bonus number if applicable
    var bonusNumber = null;
    if (config.hasBonus) {
        bonusNumber = extractBonusNumber(row);
    }
    // Extract fireball if applicable
    var fireball = null;
    if (config.supportsFireball) {
        fireball = extractFireball(row);
    }
    // Compute checksum
    var checksum = computeChecksum(config.state, config.game, drawDate, numbers, bonusNumber, fireball);
    return {
        state: config.state,
        game: config.game,
        draw_date: drawDate,
        numbers: numbers,
        bonus_number: bonusNumber !== null && bonusNumber !== void 0 ? bonusNumber : undefined,
        fireball: fireball !== null && fireball !== void 0 ? fireball : undefined,
        source_name: sourceName,
        source_url: sourceUrl,
        source_tier: sourceTier,
        trust_score: trustScore,
        checksum: checksum,
    };
}
function extractDate(row) {
    // Try various date field names
    var dateFields = ['draw_date', 'date', 'drawdate', 'winning_date', 'Date'];
    for (var _i = 0, dateFields_1 = dateFields; _i < dateFields_1.length; _i++) {
        var field = dateFields_1[_i];
        var value = row[field];
        if (value) {
            // Handle different date formats
            if (typeof value === 'string') {
                // Try ISO format first
                if (/^\d{4}-\d{2}-\d{2}/.test(value))
                    return value;
                // Try MM/DD/YYYY
                var match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                if (match) {
                    return "".concat(match[3], "-").concat(match[1].padStart(2, '0'), "-").concat(match[2].padStart(2, '0'));
                }
            }
        }
    }
    return null;
}
function extractNumbers(row, count) {
    var numbers = [];
    // Try numbered fields (n1, n2, n3, ball1, ball2, etc.)
    for (var i = 1; i <= count; i++) {
        var fields = ["n".concat(i), "ball".concat(i), "number_".concat(i), "num".concat(i), "Ball ".concat(i)];
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var field = fields_1[_i];
            var value = row[field];
            if (typeof value === 'number') {
                numbers.push(value);
                break;
            }
            else if (typeof value === 'string' && /^\d+$/.test(value)) {
                numbers.push(parseInt(value, 10));
                break;
            }
        }
    }
    // Fallback: try combined field
    if (numbers.length < count) {
        var combinedFields = ['numbers', 'winning_numbers', 'balls', 'result'];
        for (var _a = 0, combinedFields_1 = combinedFields; _a < combinedFields_1.length; _a++) {
            var field = combinedFields_1[_a];
            var value = row[field];
            if (typeof value === 'string') {
                var parts = value.split(/[\s,\-]+/).filter(function (s) { return /^\d+$/.test(s); });
                if (parts.length >= count) {
                    return parts.slice(0, count).map(function (p) { return parseInt(p, 10); });
                }
            }
        }
    }
    return numbers;
}
function extractBonusNumber(row) {
    var bonusFields = ['bonus', 'bonus_number', 'powerball', 'mega_ball', 'megaball', 'bonus_ball', 'pb', 'mb'];
    for (var _i = 0, bonusFields_1 = bonusFields; _i < bonusFields_1.length; _i++) {
        var field = bonusFields_1[_i];
        var value = row[field];
        if (typeof value === 'number')
            return value;
        if (typeof value === 'string' && /^\d+$/.test(value))
            return parseInt(value, 10);
    }
    return null;
}
function extractFireball(row) {
    var fireballFields = ['fireball', 'fire_ball', 'fb'];
    for (var _i = 0, fireballFields_1 = fireballFields; _i < fireballFields_1.length; _i++) {
        var field = fireballFields_1[_i];
        var value = row[field];
        if (typeof value === 'number')
            return value;
        if (typeof value === 'string' && value !== '' && /^\d+$/.test(value))
            return parseInt(value, 10);
    }
    return null;
}
function computeChecksum(state, game, drawDate, numbers, bonus, fireball) {
    var _a, _b;
    var parts = [
        state,
        game,
        drawDate,
        numbers.join('-'),
        (_a = bonus === null || bonus === void 0 ? void 0 : bonus.toString()) !== null && _a !== void 0 ? _a : '',
        (_b = fireball === null || fireball === void 0 ? void 0 : fireball.toString()) !== null && _b !== void 0 ? _b : ''
    ];
    return parts.join('|');
}
