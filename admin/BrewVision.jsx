// @module: BrewVision.jsx
// admin/BrewVision.jsx
// @created: 2025-06-25 04:20 EDT
// @description: Admin-only control panel for BrewLotto — shows roadmap, active modules, alerts, and security status.
// @author: BrewCommand

import React, { useEffect, useState } from 'react';
import PhaseRoadmapViewer from '../components/BrewVision/PhaseRoadmapViewer';
import BrewAlertPanel from '../components/BrewVision/BrewAlertPanel';
import ModuleRegistryCard from '../components/BrewVision/ModuleRegistryCard';
import ThreatPulseFeed from '../components/BrewVision/ThreatPulseFeed';
import DevCoreLaunchButton from '../components/BrewVision/DevCoreLaunchButton';

const BrewVision = () => {
    const [roadmapData, setRoadmapData] = useState([]);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        // 🔄 Load roadmap and sentinel alerts for control view
        fetch('/config/roadmap.json')
            .then(res => res.json())
            .then(setRoadmapData);

        fetch('/logs/sentinelAlerts.json')
            .then(res => res.json())
            .then(setAlerts);
    }, []);

    return (
        <div className="p-6 bg-[#0f172a] text-white min-h-screen font-mono">
            {/* 🧭 Panel Title */}
            <h1 className="text-4xl font-bold mb-4">🧭 BrewVision Control Panel</h1>

            {/* 🔧 Dashboard Grid */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <PhaseRoadmapViewer data={roadmapData} />      {/* ✔️ Roadmap View */}
                <BrewAlertPanel alerts={alerts} />             {/* 🚨 High-priority alert feed */}
                <ModuleRegistryCard />                         {/* 📦 Live modules status */}
                <ThreatPulseFeed />                            {/* 🛡️ Sentinel threat heat */}
            </div>

            {/* 👨‍💻 DevCore Access */}
            <div className="mt-6">
                <DevCoreLaunchButton />

            </div>
        </div>
    );
};

export default BrewVision;