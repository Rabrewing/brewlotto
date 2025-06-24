/**
 * /scripts/upload/csvUtils.js
 * Description: Shared utilities for parsing, sanitizing, and uploading draw data from CSVs to Supabase
 * Usage: Imported by loadFromCsv.js or any CLI/admin data pipelines
 * Supabase tables: pick3_draws, pick4_draws, pick5_draws, powerball_draws, mega_draws
 * Author: Randy Brewington
 * Last updated: 2025-06-25T02:15:00-04:00 (EDT)
 */
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Supabase client (service role recommended for server scripts)
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 🎮 Game-specific parser config
const supportedGames = {
    pick3: {
        table: 'pick3_draws',
        conflictKeys: ['draw_date', 'draw_type'],
        parser: ([date, type = 'day', values]) => ({
            draw_date: date,
            draw_type: ['day', 'evening'].includes(type.toLowerCase()) ? type.toLowerCase() : 'day',
            numbers: values?.split(/[\s,-]+/).map(Number).filter(n => !isNaN(n)) || []
        })
    },
    pick4: {
        table: 'pick4_draws',
        conflictKeys: ['draw_date', 'draw_type'],
        parser: ([date, type = 'day', values]) => ({
            draw_date: date,
            draw_type: ['day', 'evening'].includes(type.toLowerCase()) ? type.toLowerCase() : 'day',
            numbers: values?.split(/[\s,-]+/).map(Number).filter(n => !isNaN(n)) || []
        })
    },
    pick5: {
        table: 'pick5_draws',
        conflictKeys: ['draw_date', 'draw_type'],
        parser: ([date, type = 'day', values]) => ({
            draw_date: date,
            draw_type: ['day', 'evening'].includes(type.toLowerCase()) ? type.toLowerCase() : 'day',
            numbers: values?.split(/[\s,-]+/).map(Number).filter(n => !isNaN(n)) || []
        })
    },
    powerball: {
        table: 'powerball_draws',
        conflictKeys: ['draw_date'],
        parser: ([date, nums, pb, powerplay]) => ({
            draw_date: date,
            numbers: nums?.split(/[\s,-]+/).map(Number).filter(n => !isNaN(n)) || [],
            powerball: Number(pb),
            powerplay: powerplay || null
        })
    },
    mega: {
        table: 'mega_draws',
        conflictKeys: ['draw_date'],
        parser: ([date, nums, mb, megaplier]) => ({
            draw_date: date,
            numbers: nums?.split(/[\s,-]+/).map(Number).filter(n => !isNaN(n)) || [],
            mega_ball: Number(mb),
            megaplier: megaplier || null
        })
    }
};

// 🧹 Step 1: Parse and sanitize CSV
export function parseCsvFile(filePath) {
    const raw = fs.readFileSync(filePath, 'utf8')
        .split('\n')
        .filter(line =>
            line.trim() &&
            !line.toLowerCase().includes('every effort has been made') &&
            !line.toLowerCase().includes('multi-state lottery association') &&
            line.trim().split(',').length >= 2
        );

    if (!raw.length) return [];

    const parsed = parse(raw.join('\n'), {
        skip_empty_lines: true,
        relax_quotes: true,
        relax_column_count: true,
        trim: true
    });

    return Array.isArray(parsed) && parsed.length
        ? (parsed[0][0].toLowerCase?.().includes('date') ? parsed.slice(1) : parsed)
        : [];
}

// 🧠 Step 2: Parse rows into structured draw objects
export function sanitizeRows(rawRows, gameKey) {
    const config = supportedGames[gameKey];
    if (!config) throw new Error(`Unsupported game: ${gameKey}`);

    const seen = new Set();
    return rawRows
        .map(config.parser)
        .filter(row => {
            const key = config.conflictKeys.map(k => row[k]).join('|');
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
}

// 📥 Step 3: Insert into Supabase
export async function upsertDrawsToSupabase(gameKey, records) {
    const config = supportedGames[gameKey];
    if (!config) throw new Error(`Unsupported game: ${gameKey}`);

    let inserted = 0;
    for (let i = 0; i < records.length; i += 1000) {
        const batch = records.slice(i, i + 1000);
        const { error } = await supabase
            .from(config.table)
            .upsert(batch, { onConflict: config.conflictKeys });

        if (error) {
            console.error(`❌ Failed upload to ${config.table}:`, error.message);
        } else {
            inserted += batch.length;
        }
    }

    return inserted;
}