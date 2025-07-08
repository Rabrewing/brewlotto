// @file: /pages/api/generate-merge-report.js
// @summary: Triggers BrewMergeReadinessReport from frontend via native function call
// @timestamp: 2025-07-06T (latest patched)

import path from 'path';

const scriptPath = path.resolve('./scripts/generateMergeReadinessReport.cjs');
const generateReport = require(scriptPath); // ✅ CommonJS interop for .cjs module

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Only GET allowed' });
    }

    const { type = 'Full' } = req.query;
    console.log(`📝 API Triggered: generate-report?type=${type}`);

    try {
        const result = generateReport();

        if (!result || typeof result !== 'object') {
            console.error('⚠️ generateReport() returned null or malformed:', result);
            return res.status(500).json({
                error: 'Report generation returned invalid structure',
            });
        }

        const {
            outputPath = '/docs/merge/MergeReadinessReport.md',
            filesScanned = null,
            reportHash = null,
            timestamp = new Date().toISOString(),
        } = result;

        console.log('✅ Report metadata:', { outputPath, reportHash, filesScanned });

        return res.status(200).json({
            message: 'Report generated successfully',
            path: outputPath,
            filesScanned,
            reportHash,
            timestamp,
        });
    } catch (err) {
        console.error('❌ Internal error during report generation:', err);
        return res.status(500).json({
            error: 'Internal error while generating report',
            message: err.message || 'Unknown failure',
        });
    }
}