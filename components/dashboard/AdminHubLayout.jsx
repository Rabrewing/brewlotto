// File: component/AdminHubLayout.jsx
// Timestamp: 2025-06-25 17:20 EDT
// Description: Admin dashboard shell with animated panel layout and integrated SidebarMenu for modular, role-based navigation.
//              Uses Tailwind for styling and Framer Motion for transitions. SidebarMenu conditionally renders based on user role.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarMenu from './SidebarMenu'; // 🔌 modular sidebar with admin-only links
import { useUser } from '../../hooks/useUserProfile'; // 🧠 fetch auth context

const tabs = ['Users', 'Predictions', 'System Logs', 'Entropy Watch'];

export default function AdminHubLayout() {
    const user = useUser(); // ☁️ get role-based access

    const [activeTab, setActiveTab] = useState('Users');

    return (
        <div className="flex h-screen bg-gray-950 text-white">
            {/* SidebarMenu with Admin Modules */}
            <SidebarMenu user={user} />

            {/* Animated Admin Panel Content */}
            <main className="flex-1 p-6 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderTabContent(activeTab)}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}

// Placeholder content generator
function renderTabContent(tab) {
    switch (tab) {
        case 'Users':
            return (
                <div className="text-lg font-medium">
                    👥 UserViewer Panel (Component under construction)
                </div>
            );
        case 'Predictions':
            return <div className="text-lg font-medium">📈 Prediction Audit View Placeholder...</div>;
        case 'System Logs':
            return <div className="text-lg font-medium">🛠️ Trigger Logs and Retrain Jobs...</div>;
        case 'Entropy Watch':
            return <div className="text-lg font-medium">🔥 Live Draw Entropy Charting Interface...</div>;
        default:
            return null;
    }
}