// @file: /pages/api/ledger.js

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const filePath = path.join(process.cwd(), '.brew-refactor-activity/refactorLedger.json');
    if (!fs.existsSync(filePath)) return res.status(200).json([]);
    const data = fs.readFileSync(filePath, 'utf-8');
    res.status(200).json(JSON.parse(data));
}