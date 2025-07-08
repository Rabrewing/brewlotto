// @file: initFileIndex.cjs
// @summary: Scans project files (excluding noise) and outputs BrewMergeFileIndex.json
// @status: ✅ Stable (JS variant, BrewLotto 2 compatible)

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const OUTPUT_FILE = './public/BrewMergeFileIndex.json';

// Check for MERGE_LOCK.json
const LOCK_FILE = './MERGE_LOCK.json';

if (fs.existsSync(LOCK_FILE)) {
    const lock = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf8'));
    console.log(`🛑 Merge is locked: ${lock.reason || 'No reason provided'}`);
    console.log(`🔐 Locked by: ${lock.lockedBy || 'unknown'} @ ${lock.timestamp || 'n/a'}`);
    process.exit(0);
}

const EXCLUDE_DIRS = [
    '.git',
    'node_modules',
    '.next',
    'dist',
    'out',
    'public',
    '.turbo',
    '.vercel',
    'tmp',
    '__tests__'
];

const isIgnorable = (filePath) =>
    EXCLUDE_DIRS.some((dir) => filePath.includes(path.sep + dir + path.sep));

function hashContent(content) {
    return crypto.createHash('sha1').update(content).digest('hex');
}

function collectFiles(dir, collected = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            if (!EXCLUDE_DIRS.includes(entry.name)) {
                collectFiles(fullPath, collected);
            }
        } else {
            if (!isIgnorable(fullPath)) {
                collected.push(fullPath);
            }
        }
    }

    return collected;
}

function classifyFile(filePath) {
    const ext = path.extname(filePath).toLowerCase().replace('.', '');
    return ext || 'unknown';
}

function scanProject() {
    const baseDir = path.resolve('.');
    const files = collectFiles(baseDir);
    const index = [];

    for (const filePath of files) {
        const relativePath = path.relative(baseDir, filePath);
        const content = fs.readFileSync(filePath, 'utf8');
        const hash = hashContent(content);
        const lines = content.split('\n').length;
        const type = classifyFile(filePath);

        index.push({
            path: relativePath,
            hash,
            lines,
            type,
            origin: 'Brew2' // can be updated later during merge tracing
        });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));
    console.log(`✅ BrewMergeFileIndex generated: ${files.length} files → ${OUTPUT_FILE}`);
}

scanProject();