import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const supportedGames = {
    pick3: {
        table: 'pick3_draws',
        conflictKeys: ['draw_date', 'draw_type'],
        parser: (row) => {
            const rawType = (row[1] || 'day').toLowerCase();
            const draw_type = ['day', 'evening'].includes(rawType) ? rawType : 'day';
            return {
                draw_date: row[0],
                draw_type,
                numbers: row[2]?.split(/[\s,-]+/).map(Number).filter(n => !isNaN(n)) || [],
            };
        }
    },
    pick4: {
        table: 'pick4_draws',
        conflictKeys: ['draw_date', 'draw_type'],
        parser: (row) => {
            const rawType = (row[1] || 'day').toLowerCase();
            const draw_type = ['day', 'evening'].includes(rawType) ? rawType : 'day';
            return {
                draw_date: row[0],
                draw_type,
                numbers: row[2]?.split(/[\s,-]+/).map(Number).filter(n => !isNaN(n)) || [],
            };
        }
    },
    pick5: {
        table: 'pick5_draws',
        conflictKeys: ['draw_date', 'draw_type'],
        parser: (row) => {
            const rawType = (row[1] || 'day').toLowerCase();
            const draw_type = ['day', 'evening'].includes(rawType) ? rawType : 'day';
            return {
                draw_date: row[0],
                draw_type,
                numbers: row[2]?.split(/[\s,-]+/).map(Number).filter(n => !isNaN(n)) || [],
            };
        }
    },
    powerball: {
        table: 'powerball_draws',
        conflictKeys: ['draw_date'],
        parser: (row) => ({
            draw_date: row[0],
            numbers: row[1]?.split(/[\s,-]+/).map(Number).filter(n => !isNaN(n)) || [],
            powerball: Number(row[2]),
            powerplay: row[3] || null,
        })
    },
    mega: {
        table: 'mega_draws',
        conflictKeys: ['draw_date'],
        parser: (row) => ({
            draw_date: row[0],
            numbers: row[1]?.split(/[\s,-]+/).map(Number).filter(n => !isNaN(n)) || [],
            mega_ball: Number(row[2]),
            megaplier: row[3] || null,
        })
    }
};

const loadFile = async (game, filePath) => {
    const config = supportedGames[game];

    const rawLines = fs.readFileSync(filePath, 'utf8')
        .split('\n')
        .filter(line =>
            line.trim() &&
            !line.toLowerCase().includes('every effort has been made') &&
            !line.toLowerCase().includes('multi-state lottery association') &&
            line.trim().split(',').length >= 2
        );

    if (!rawLines.length) {
        console.warn(`⚠️ Skipped ${filePath} — no valid rows found after filtering.`);
        return;
    }

    let parsedCsv;
    try {
        parsedCsv = parse(rawLines.join('\n'), {
            skip_empty_lines: true,
            relax_quotes: true,
            relax_column_count: true,
            trim: true
        });
    } catch (err) {
        console.error(`❌ Failed to parse ${filePath}:`, err.message);
        return;
    }

    const rows = Array.isArray(parsedCsv) && parsedCsv.length > 0
        ? (parsedCsv[0][0]?.toLowerCase?.().includes("date") ? parsedCsv.slice(1) : parsedCsv)
        : [];

    if (!rows.length) {
        console.warn(`⚠️ Skipped ${filePath} — no usable rows after parsing.`);
        return;
    }

    const seen = new Set();
    const data = rows.map(config.parser).filter(row => {
        const key = config.conflictKeys.map(k => row[k]).join('|');
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    let inserted = 0;
    for (let i = 0; i < data.length; i += 1000) {
        const batch = data.slice(i, i + 1000);
        const { error } = await supabase
            .from(config.table)
            .upsert(batch, { onConflict: config.conflictKeys });

        if (error) {
            console.error(`❌ Upload error [${filePath} - batch ${i}]:`, error.message);
        } else {
            console.log(`⬆️  Inserted ${batch.length} into ${config.table}`);
            inserted += batch.length;
        }
    }

    console.log(`✅ Finished uploading ${inserted} rows to ${config.table}`);
};

(async () => {
    const folder = process.argv[2] || './data/';
    if (!fs.existsSync(folder)) {
        console.error('📁 Data folder not found:', folder);
        process.exit(1);
    }

    const files = fs.readdirSync(folder);
    const matches = files.filter(f =>
        Object.keys(supportedGames).some(g => f.toLowerCase().includes(g)) &&
        f.toLowerCase().endsWith('.csv')
    );

    if (matches.length === 0) {
        console.log('⚠️ No valid game CSVs found in', folder);
        return;
    }

    for (const file of matches) {
        const game = Object.keys(supportedGames).find(g => file.toLowerCase().includes(g));
        if (!game) continue;

        console.log(`📂 Processing ${file} → ${game}`);
        await loadFile(game, path.join(folder, file));
    }

    console.log('🎉 All bulk loads complete!');
})();