// @file: fix-file.js
// @directory: /pages/api
// @summary: Applies approved fix patch to disk and logs to refactor ledger

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { file, patch, approvedBy } = req.body;

    if (!file || !patch?.after) {
        return res.status(400).json({ error: 'Missing file or patch content' });
    }

    const fullPath = path.join(process.cwd(), file);

    try {
        fs.writeFileSync(fullPath, patch.after, 'utf-8');

        const ledgerPath = path.join(process.cwd(), '.brew-refactor-activity/refactorLedger.json');
        const ledger = fs.existsSync(ledgerPath)
            ? JSON.parse(fs.readFileSync(ledgerPath, 'utf-8'))
            : [];

        ledger.push({
            file,
            approvedBy,
            timestamp: new Date().toISOString(),
            summary: `Fix applied by Brew Da AI`,
        });

        fs.mkdirSync(path.dirname(ledgerPath), { recursive: true });
        fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));

        return res.status(200).json({ status: 'success', file });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}