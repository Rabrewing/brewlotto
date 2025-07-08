// Enriches BrewMergeFileIndex.json with tags, refactorRisk, status, and descriptions
const fs = require('fs');
const path = require('path');

const indexPath = './public/BrewMergeFileIndex.json';

const heuristics = [
    {
        tag: 'js_module',
        test: (f) => f.path.endsWith('.js') && !f.path.includes('test'),
        description: 'JavaScript utility or logic module'
    },
    {
        tag: 'jsx_component',
        test: (f) => f.path.endsWith('.jsx') && f.path.includes('/components/'),
        description: 'UI component written in JSX'
    },
    {
        tag: 'strategy_candidate',
        test: (f) => f.path.includes('/strategy/') || f.path.includes('Forecast'),
        description: 'Contains strategy logic or AI orchestration'
    }
];

function enrich() {
    if (!fs.existsSync(indexPath)) throw new Error('Index file not found');

    const files = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

    const enriched = files.map((f) => {
        const newTags = heuristics
            .filter((h) => h.test(f))
            .map((h) => h.tag);
        const descs = heuristics
            .filter((h) => h.test(f))
            .map((h) => h.description);

        return {
            ...f,
            tags: [...new Set([...(f.tags || []), ...newTags])],
            refactorRisk: f.lines > 300 ? 'high' : f.lines > 100 ? 'medium' : 'low',
            status: f.status || 'untriaged',
            description: f.description || descs[0] || 'Undocumented file'
        };
    });

    fs.writeFileSync(indexPath, JSON.stringify(enriched, null, 2));
    console.log(`🔍 Enriched index with tags, risk, status, and descriptions`);
}

enrich();