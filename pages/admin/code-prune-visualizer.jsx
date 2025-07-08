// File: pages/admin/code-prune-visualizer.jsx
// Route: http://localhost:3000/admin/code-prune-visualizer
// Description: Entry page for BrewMerge Code Prune Visualizer with layout + fallback loader

import Head from 'next/head';
import dynamic from 'next/dynamic';
import BrewAdminLayout from '@/components/layouts/BrewAdminLayout';

const CodePruneVisualizer = dynamic(
    () => import('@/components/admin/CodePruneVisualizer'),
    {
        ssr: false,
        loading: () => (
            <div className="p-6 text-white">
                <h2 className="text-xl font-semibold mb-2">🔄 Loading Visualizer...</h2>
                <p>Please wait while the code pruning module initializes.</p>
            </div>
        ),
    }
);

export default function CodePruneVisualizerPage() {
    return (
        <BrewAdminLayout>
            <Head>
                <title>BrewMerge • Code Prune Visualizer</title>
            </Head>
            <CodePruneVisualizer />
        </BrewAdminLayout>
    );
}
