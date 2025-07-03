// @file: brew-scan.js
// @directory: /
// @summary: CLI runner for scanEngine.js — prints audit summary, JSON snapshot, or Git-safe exit

import { runAuditScan } from './lib/scanEngine.js';
import fs from 'fs';

const args = process.argv.slice(2);
const asJSON = args.includes('--json');
const isHook = args.includes('--hook');
const showSummary = args.includes('--summary') || (!asJSON && !isHook);

const snapshot = runAuditScan('src');

if (asJSON) {
    const outPath = './.brew-audit-snapshot.json';
    fs.writeFileSync(outPath, JSON.stringify(snapshot, null, 2), 'utf-8');
    console.log(`✅ Audit snapshot saved to ${outPath}`);
    process.exit(0);
}

if (isHook) {
    const risky = snapshot.refactor_candidates.filter(f => f.score > 150);
    if (risky.length > 0) {
        console.log('\n🛑 Commit blocked — High-complexity files detected:');
        risky.forEach(f =>
            console.log(`  🔧 ${f.file} (score: ${f.score})`)
        );
        process.exit(1);
    } else {
        console.log('✅ BrewScan passed — no blocking entropy found.');
        process.exit(0);
    }
}

if (showSummary) {
    console.log('\n📂 Audit Summary — ./src');
    console.log('--------------------------');
    console.log(`✅ Active Modules:       ${snapshot.active_modules.length}`);
    console.log(`❌ Deprecated Modules:    ${snapshot.deprecated_modules.length}`);
    console.log(`🟡 Unused Files:          ${snapshot.unused_files.length}`);
    console.log(`🔧 Refactor Candidates:   ${snapshot.refactor_candidates.length}`);
    console.log(`\n📅 Timestamp: ${new Date(snapshot.timestamp).toLocaleString()}\n`);
}