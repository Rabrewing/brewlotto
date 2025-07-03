// @file: scanEngine.js
// @directory: /lib
// @summary: Executes directory scan + classification. Returns ingestible audit snapshot.

import fs from 'fs';
import path from 'path';

// 🧠 Pattern matchers — replace with smarter logic later
const isDeprecated = (filePath) =>
    filePath.includes('archive/') || filePath.includes('old/') || filePath.includes('legacy');

const isUnused = (filePath) =>
    ['PredictionCard.jsx', 'DrawEntropyCard.jsx', 'BrewLottoBot.jsx'].some((f) =>
        filePath.endsWith(f)
    );

const isActive = (filePath) =>
    ['SmartPickRefactor.js', 'DrawDataTriage.js', 'BrewMergeUI.jsx'].some((f) =>
        filePath.endsWith(f)
    );

const IGNORE_DIRS = ['node_modules', '.next', 'dist', 'out'];

// 🧠 Crude complexity check
const estimateComplexity = (content) => {
    const lines = content.split('\n').length;
    const nestingScore = (content.match(/[\{\(]|\b(if|for|while|switch)\b/g) || []).length;
    return lines + nestingScore;
};

// 🔁 Recursively walk directory and collect .js/.jsx files
const walkDirectory = (startPath, collected = []) => {
    const files = fs.readdirSync(startPath);
    for (let file of files) {
        const fullPath = path.join(startPath, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory() && !IGNORE_DIRS.includes(file)) {
            walkDirectory(fullPath, collected);
        } else if (stats.isFile() && /\.(js|jsx)$/.test(file)) {
            collected.push(fullPath);
        }
    }
    return collected;
};

// 🚀 Main scan function
export const runAuditScan = (startDir = './src') => {
    const fullList = walkDirectory(startDir);
    const deprecated = [];
    const unused = [];
    const active = [];
    const refactor = [];

    fullList.forEach((filePath) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        const normalizedPath = filePath.replace(/^\.\/?/, '').replace(/\\/g, '/');

        if (isDeprecated(normalizedPath)) {
            deprecated.push({
                file: normalizedPath,
                reason: 'Matched deprecated folder or filename',
                status: 'Deprecated',
            });
        } else if (isUnused(normalizedPath)) {
            unused.push({
                file: normalizedPath,
                reason: 'Flagged as unused in audit ledger',
                status: 'Unused',
            });
        } else if (isActive(normalizedPath)) {
            active.push(normalizedPath);
        }

        const complexity = estimateComplexity(content);
        if (complexity > 100) {
            refactor.push({
                file: normalizedPath,
                score: complexity,
                reason: 'Complexity exceeds threshold',
                status: 'Refactor Candidate',
            });
        }
    });

    return {
        deprecated_modules: deprecated,
        unused_files: unused,
        active_modules: active,
        refactor_candidates: refactor,
        timestamp: new Date().toISOString(),
    };
};