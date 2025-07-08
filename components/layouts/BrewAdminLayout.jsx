// /components/layouts/BrewAdminLayout.jsx
// Timestamp: 2025-06-25 21:12 EDT
// Description: Layout component for Brew Admin Dashboard, includes sidebar and main content area
// Route: http://localhost:3000/admin/brew-admin-layout
import React from 'react';
import MergebarMenu from '@/components/ui/MergebarMenu';

const BrewAdminLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-[#111827] text-white">
            {/* Sidebar Menu */}
            <div className="w-64 border-r border-[#232323] shadow-xl">
                <MergebarMenu />
            </div>

            {/* Main Panel */}
            <main className="flex-1 overflow-auto p-6 bg-[#181818]">
                {children}
            </main>
        </div>
    );
};

export default BrewAdminLayout;
