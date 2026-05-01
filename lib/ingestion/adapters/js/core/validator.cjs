"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDraw = validateDraw;
exports.validateBatch = validateBatch;
const GAME_SPECS = {
    pick3: { min: 0, max: 9, count: 3 },
    pick4: { min: 0, max: 9, count: 4 },
    daily3: { min: 0, max: 9, count: 3 },
    daily4: { min: 0, max: 9, count: 4 },
    cash5: { min: 1, max: 43, count: 5 },
    fantasy5: { min: 1, max: 39, count: 5 },
    powerball: { min: 1, max: 69, count: 5, hasBonus: true, bonusMin: 1, bonusMax: 26 },
    mega_millions: { min: 1, max: 70, count: 5, hasBonus: true, bonusMin: 1, bonusMax: 25 },
};
function validateDraw(draw) {
    const errors = [];
    const warnings = [];
    // Required fields
    if (!draw.state)
        errors.push('Missing state');
    if (!draw.game)
        errors.push('Missing game');
    if (!draw.draw_date)
        errors.push('Missing draw_date');
    if (!draw.numbers || draw.numbers.length === 0)
        errors.push('Missing numbers');
    if (!draw.source_name)
        errors.push('Missing source_name');
    if (!draw.checksum)
        errors.push('Missing checksum');
    // Date format validation
    if (draw.draw_date && !/^\d{4}-\d{2}-\d{2}$/.test(draw.draw_date)) {
        errors.push(`Invalid date format: ${draw.draw_date}`);
    }
    // Number validation
    if (draw.numbers) {
        const spec = GAME_SPECS[draw.game];
        if (spec) {
            // Check count
            if (draw.numbers.length !== spec.count) {
                errors.push(`Expected ${spec.count} numbers, got ${draw.numbers.length}`);
            }
            // Check range
            for (let i = 0; i < draw.numbers.length; i++) {
                const num = draw.numbers[i];
                if (num < spec.min || num > spec.max) {
                    errors.push(`Number ${num} at position ${i} is out of range [${spec.min}-${spec.max}]`);
                }
            }
            // Check duplicates
            const unique = new Set(draw.numbers);
            if (unique.size !== draw.numbers.length && draw.game !== 'pick3' && draw.game !== 'pick4' && draw.game !== 'daily3' && draw.game !== 'daily4') {
                warnings.push('Duplicate numbers detected (allowed for Pick games)');
            }
        }
        // Check for all zeros (invalid)
        if (draw.numbers.every(n => n === 0)) {
            errors.push('All numbers are zero - invalid draw');
        }
    }
    // Bonus number validation
    if (draw.bonus_number !== undefined && draw.bonus_number !== null) {
        const spec = GAME_SPECS[draw.game];
        if (spec?.hasBonus && spec.bonusMin !== undefined && spec.bonusMax !== undefined) {
            if (draw.bonus_number < spec.bonusMin || draw.bonus_number > spec.bonusMax) {
                errors.push(`Bonus number ${draw.bonus_number} out of range [${spec.bonusMin}-${spec.bonusMax}]`);
            }
        }
    }
    // Fireball validation (0-9 for pick games)
    if (draw.fireball !== undefined && draw.fireball !== null) {
        if (draw.fireball < 0 || draw.fireball > 9) {
            errors.push(`Fireball ${draw.fireball} must be 0-9`);
        }
    }
    // Trust score validation
    if (draw.trust_score < 0 || draw.trust_score > 100) {
        errors.push(`Trust score ${draw.trust_score} must be 0-100`);
    }
    // Source tier validation
    if (draw.source_tier < 1 || draw.source_tier > 3) {
        errors.push(`Source tier ${draw.source_tier} must be 1-3`);
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
function validateBatch(draws) {
    const results = new Map();
    let valid = 0;
    let invalid = 0;
    for (const draw of draws) {
        const result = validateDraw(draw);
        results.set(draw.checksum, result);
        if (result.valid)
            valid++;
        else
            invalid++;
    }
    return { valid, invalid, results };
}
