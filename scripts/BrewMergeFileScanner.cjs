// ✅ scripts/BrewMergeFileScanner.js
const fs = require('fs');
const path = require('path');

const rootDir = './'; // root of your project
const output = {
    all_files: [],
    js_modules: [],
    jsx_components: [],
    strategy_candidates: []
};

function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else {
            output.all_files.push(fullPath);
            if (file.endsWith('.js')) output.js_modules.push(fullPath);
            if (file.endsWith('.jsx')) output.jsx_components.push(fullPath);
            if (file.toLowerCase().includes('strategy')) output.strategy_candidates.push(fullPath);
        }
    });
}

walk(rootDir);
fs.writeFileSync('BrewMergeFileIndex.json', JSON.stringify(output, null, 2));
console.log('✅ BrewMergeFileIndex.json generated.');
