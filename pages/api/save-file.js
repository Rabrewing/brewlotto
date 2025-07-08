// @file: save-file.js
// @directory: /pages/api
// @summary: Writes code to disk from Monaco editor

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { path: filePath, content } = req.body;
    if (!filePath || typeof content !== 'string') {
        return res.status(400).json({ error: 'Missing path or content' });
    }

    try {
        const target = path.resolve(process.cwd(), filePath);
        fs.writeFileSync(target, content, 'utf-8');
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('[SAVE ERROR]', err.message);
        res.status(500).json({ error: 'Failed to save file' });
    }
}