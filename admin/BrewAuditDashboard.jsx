// @file: BrewAuditDashboard.jsx
// @summary: Cockpit dashboard for merge audit tracking, scan insights, and manual report generation

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Core layout and UI modules
import BrewAdminLayout from '@/components/layouts/BrewAdminLayout';
import MergebarMenu from '@/components/ui/MergebarMenu';
import MergeAuditTable from '@/components/ui/MergeAuditTable';

// Static audit datasets
import CODE_PRUNE_AUDIT from '@/data/CODE_PRUNE_AUDIT.json';
import BrewMergeFileIndex from '@/mnt/data/BrewMergeFileIndex.json';

// 🔁 NEW AUDIT INTELLIGENCE COMPONENTS
import BrewGenerateToolbar from '@/components/dashboard/BrewGenerateToolbar';
import BrewMergeOverviewCard from '@/components/dashboard/BrewMergeOverviewCard';
import ReadinessReportViewer from '@/components/dashboard/ReadinessReportViewer';
import RefactorLedgerPanel from '@/components/dashboard/RefactorLedgerPanel';
import PatchQueuePanel from '@/components/dashboard/PatchQueuePanel';
import AuditVoiceOverlay from '@/components/overlays/AuditVoiceOverlay';

const TABS = [
    'Deprecated Files',
    'Unused Modules',
    'Merge-Ready',
    'Legacy Tracker'
];

export default function BrewAuditDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(TABS[0]);

    useEffect(() => {
        const urlTab = router.query.tab;
        const storedTab = localStorage.getItem('brewmerge_active_tab');
        if (urlTab && TABS.includes(urlTab)) setActiveTab(urlTab);
        else if (storedTab && TABS.includes(storedTab)) setActiveTab(storedTab);
    }, [router.query.tab]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        localStorage.setItem('brewmerge_active_tab', tab);
        router.push({ query: { ...router.query, tab } }, undefined, { shallow: true });
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Deprecated Files':
                return (
                    <MergeAuditTable
                        title="Deprecated Files"
                        data={CODE_PRUNE_AUDIT.deprecated_modules.map((m) => ({
                            file: m.file,
                            reason: m.reason,
                            status: 'Deprecated'
                        }))}
                    />
                );
            case 'Unused Modules':
                return (
                    <MergeAuditTable
                        title="Unused Modules"
                        data={CODE_PRUNE_AUDIT.unused_files.map((m) => ({
                            file: m.file,
                            reason: m.reason,
                            status: 'Unused'
                        }))}
                    />
                );
            case 'Merge-Ready':
                return (
                    <MergeAuditTable
                        title="Merge-Ready Files"
                        data={CODE_PRUNE_AUDIT.active_modules.map((f) => ({
                            file: f,
                            reason: 'Confirmed as core to current refactor',
                            status: 'Active'
                        }))}
                    />
                );
            case 'Legacy Tracker':
                return (
                    <MergeAuditTable
                        title="Legacy Files (from Merge Index)"
                        data={(BrewMergeFileIndex.legacy || []).map((file) => ({
                            file,
                            reason: 'Auto-classified from directory scan',
                            status: 'Legacy'
                        }))}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <BrewAdminLayout>
            <div className="flex flex-col md:flex-row">
                <MergebarMenu active={activeTab} onChange={handleTabChange} />

                <div className="flex-1 p-6 space-y-6">
                    {/* 📝 Manual report generation trigger */}
                    <BrewGenerateToolbar />

                    {/* 🧠 Merge scan summary */}
                    <BrewMergeOverviewCard />

                    {/* 📑 AI-aware audit intelligence */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <ReadinessReportViewer />
                        <RefactorLedgerPanel />
                        <PatchQueuePanel />
                    </div>

                    {/* 🔍 Categorized audit views */}
                    {renderTabContent()}

                    {/* 🎤 Optional AI overlays */}
                    <AuditVoiceOverlay />
                </div>
            </div>
        </BrewAdminLayout>
    );
}