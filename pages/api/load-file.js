// @file: load-file.js
// @directory: /pages/api
// @summary: Reads a source file from disk by relative path

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const { path: filePath } = req.query;

    if (!filePath) {
        return res.status(400).json({ error: 'Missing file path' });
    }

    try {
        const safePath = path.resolve(process.cwd(), filePath);
        if (!fs.existsSync(safePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        const content = fs.readFileSync(safePath, 'utf-8');
        res.status(200).send(content);
    } catch (err) {
        console.error('File load error:', err.message);
        res.status(500).json({ error: 'Error loading file' });
    }
}