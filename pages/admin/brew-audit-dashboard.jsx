// File: pages/admin/brew-audit-dashboard.jsx
// Route: http://localhost:3000/admin/brew-audit-dashboard.jsx
// Timestamp: 2025-06-25 21:12 EDT
// Purpose: Renders the BrewAuditDashboard component from @/admin

import dynamic from 'next/dynamic';

// Dynamically import the admin dashboard to prevent SSR issues with hooks
const BrewAuditDashboard = dynamic(() => import('@/admin/BrewAuditDashboard'), {
    ssr: false,
    loading: () => <p className="text-white p-6">Loading BrewAuditDashboard...</p>,
});

export default function BrewAuditDashboardPage() {
    return <BrewAuditDashboard />;
}
