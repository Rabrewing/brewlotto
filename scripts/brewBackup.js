// @module: brewBackup.js
// @created: 2025-06-25 06:14 EDT
// @description: Pulls key Supabase tables and saves them to local backup directory in timestamped folders.
// @note: Run via cron job, task scheduler, or manually.
import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@/supabase/supabase-js';

import fs from 'fs';
import path from 'path';

// 📅 Generate timestamped folder
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const backupDir = './backups';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const folderPath = path.join(backupDir, timestamp);

// 🧠 Key tables to back up
const tables = ['draws', 'users', 'roadmap', 'brew_sentinel_logs'];

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables.');
}

export const supabaseService = createClient(supabaseUrl, supabaseKey);

(async () => {
    try {
        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

        for (const table of tables) {
            const { data, error } = await supabase.from(table).select('*');
            if (error) {
                console.error(`❌ Error fetching ${table}:`, error.message);
                continue;
            }

            fs.writeFileSync(`${folderPath}/${table}.json`, JSON.stringify(data, null, 2));
            console.log(`✅ Backed up ${table} → ${table}.json`);
        }

        // 💾 Optional: Log backup run
        fs.writeFileSync(
            `${folderPath}/_meta.json`,
            JSON.stringify({ created_at: timestamp, tables, status: 'complete' }, null, 2)
        );

        console.log(`🧠 Backup complete: ${folderPath}`);
    } catch (err) {
        console.error('🔥 Backup failed:', err);
    }
})();