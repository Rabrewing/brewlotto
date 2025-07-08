// File: pages/admin/brew-merge-ui.jsx
// Route: http://localhost:3000/admin/brew-merge-ui
// Description: Launchpad for BrewMerge refactor dashboard (file diffing, merge readiness, visual tools)

import Head from 'next/head';
import BrewAdminLayout from '@/components/layouts/BrewAdminLayout';
import dynamic from 'next/dynamic';

const BrewMergeUI = dynamic(() => import('@/admin/BrewMergeUI'), {
    ssr: false,
    loading: () => <p className="text-white p-4">Loading Merge UI...</p>,
});

export default function BrewMergeUIPage() {
    return (
        <BrewAdminLayout>
            <Head>
                <title>BrewMerge • Merge Panel</title>
            </Head>

            <div className="p-6 space-y-4">
                <h1 className="text-2xl font-bold text-white">🧩 Merge Panel</h1>
                <p className="text-white">
                    This is the main BrewMerge UI for file comparisons, refactor readiness checks, and merge staging.
                </p>

                <BrewMergeUI />
            </div>
        </BrewAdminLayout>
    );
}
