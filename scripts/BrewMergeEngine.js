// /scripts/BrewMergeEngine.js
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve('./');

const FILE_STATUSES = {
    CANONICAL: '✅ Canonical',
    REFACTOR: '♻️ Refactor',
    ARCHIVE: '🗃️ Archive',
};

const FILE_TAGS = ['@deprecated', 'IS_BREW_LOTTO_1', 'Brew2_Canonical'];

function scanAndClassify(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (FILE_TAGS.some(tag => content.includes(tag))) return FILE_STATUSES.ARCHIVE;
    if (content.includes('Brew2_Canonical')) return FILE_STATUSES.CANONICAL;
    return FILE_STATUSES.REFACTOR;
}

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(file => {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) return walk(full, callback);
        if (full.endsWith('.js') || full.endsWith('.jsx')) callback(full);
    });
}

function runMergeAudit() {
    const results = [];
    walk(projectRoot, file => {
        const status = scanAndClassify(file);
        results.push({ file, status });
    });

    console.log('🔍 BrewMerge Audit Results:');
    results.forEach(({ file, status }) => {
        console.log(`${status} → ${file}`);
    });

    fs.writeFileSync('CODE_PRUNE_AUDIT.json', JSON.stringify(results, null, 2));
}

runMergeAudit();
