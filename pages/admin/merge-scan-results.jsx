// @file: merge-scan-results.jsx
// @directory: /pages/admin
// @timestamp: 2025-07-01T11:12 EDT
// @summary: Displays BrewMerge scan results with live file audit listing
// @route: http://localhost:3000/admin/merge-scan-results

import Head from 'next/head';
import BrewAdminLayout from '@/components/layouts/BrewAdminLayout';
import FileScanResults from '@/admin/FileScanResults'; // ✅ Adjusted path

export default function MergeScanResultsPage() {
    return (
        <BrewAdminLayout>
            <Head>
                <title>BrewMerge • File Scan Results</title>
            </Head>

            <div className="p-6 space-y-4">
                <h1 className="text-2xl font-bold text-white">📂 File Scan Results</h1>
                <p className="text-white">
                    This page shows outputs from smart file diff, entropy scores, legacy overlap, and merge suggestions.
                </p>

                <FileScanResults /> {/* ✅ Now live */}
            </div>
        </BrewAdminLayout>
    );
}