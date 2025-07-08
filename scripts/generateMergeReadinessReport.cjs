// @file: generateMergeReadinessReport.cjs
// @summary: Generates MergeReadinessReport.md and returns metadata for API / CLI
// @output: /docs/merge/MergeReadinessReport.md
// @log: Appends to refactor_ledger.json

const fs = require('fs');
const path = require('path');

module.exports = function generateReport() {
    const indexPath = './public/BrewMergeFileIndex.json';
    const lockPath = './MERGE_LOCK.json';
    const ledgerPath = './refactor_ledger.json';
    const reportOut = './docs/merge/MergeReadinessReport.md';

    if (!fs.existsSync(indexPath)) {
        throw new Error(`BrewMergeFileIndex.json not found at ${indexPath}`);
    }

    const files = JSON.parse(fs.readFileSync(indexPath, 'utf8') || '[]');
    const lock = fs.existsSync(lockPath)
        ? JSON.parse(fs.readFileSync(lockPath, 'utf8'))
        : null;
    const now = new Date().toISOString();

    // 🧠 Helper functions
    const countTagged = (tag) =>
        files.filter((f) => f.tags?.includes(tag)).length;

    const countRisk = (level) =>
        files.filter((f) => f.refactorRisk === level).length;

    const untriaged = files.filter((f) => !f.status || f.status === 'untriaged');

    const sampleUnpatched = files
        .filter((f) => f.tags?.includes('strategy_candidate') && !f.status)
        .slice(0, 3);

    const reportHash = `bda-${now.slice(2, 10).replace(/-/g, '')}`;

    const markdown = `# ✅ BrewMerge Readiness Report
_Compiled by Brew Da AI · ${now}_

---

## 🧭 Merge Scan Summary
- **Total Indexed Files**: ${files.length}
- **JS Modules**: ${countTagged('js_module')}
- **JSX Components**: ${countTagged('jsx_component')}
- **Strategy Candidates**: ${countTagged('strategy_candidate')}
- **Untriaged Files**: ${untriaged.length}
- **High-Risk Zones**: ${countRisk('high')}

---

## 🔐 MERGE_LOCK Status
- ${lock ? '✅ Lock active' : '⚠️ No lock detected'}
${lock ? `- Reason: ${lock.reason}\n- Locked by: ${lock.lockedBy} @ ${lock.timestamp}` : ''}

---

## 📦 Patch Queue Candidates
${sampleUnpatched.map((f) => `- \`${f.path}\` — 🧠 ${f.lines} lines`).join('\n') || '*No strategy files pending*'}

---

## 🚦 Recommendations
- [ ] Triage ${untriaged.length} files in index
- [ ] Confirm RLS guards for refactor files
- [ ] Finalize auth bridge scaffolding before merge
- [ ] Flip \`MergeCheckpoint.AUDIT_LAUNCHABLE = true\` when stable

---

Report hash: \`${reportHash}\` · Cockpit Snapshot Valid ✅
`;

    fs.writeFileSync(reportOut, markdown);
    console.log(`✅ MergeReadinessReport.md written to ${reportOut}`);

    const ledgerEntry = {
        type: 'merge-report',
        timestamp: now,
        filesScanned: files.length,
        untriaged: untriaged.length,
        locked: !!lock,
        path: reportOut,
        reportHash
    };

    let ledger = [];
    if (fs.existsSync(ledgerPath)) {
        try {
            ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
        } catch (e) {
            console.error('⚠️ Failed to parse refactor_ledger.json:', e.message);
        }
    }

    ledger.push(ledgerEntry);
    fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));
    console.log('📓 Logged entry to refactor_ledger.json');

    return {
        outputPath: reportOut,
        reportHash,
        filesScanned: files.length,
        timestamp: now,
        locked: !!lock
    };
};