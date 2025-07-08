// =============================================
// 📁 File: /brew-university/BrewDevManual.jsx
// 🧠 Summary: RB-only development cockpit — protocols, toggles, commentary and fix governance
//
// ▸ Central command center for BrewLotto AI strategy and DevOps
// ▸ Live patch telemetry, voice settings, merge safeguards
// ▸ Shadow apply config, rollback triggers, commentary tone matrix
//
// 🔐 Access: RB-only via `/brew-university/brew-dev`
// ✨ Launched: Phase 5.0 — BrewUniversity Flagship
// =============================================

import { usePatchQueue } from "@/hooks/usePatchQueue";
import { useState } from "react";

export default function BrewDevManual() {
    const { queue = [] } = usePatchQueue();
    const [strictMode, setStrictMode] = useState(true);
    const [sandboxEnabled, setSandboxEnabled] = useState(true);
    const [rollbackTrigger, setRollbackTrigger] = useState(null);

    const [allowSarcasm, setAllowSarcasm] = useState(false);
    const [toneBySkill, setToneBySkill] = useState(true);
    const [strategicOnly, setStrategicOnly] = useState(true);

    const riskStats = queue.reduce(
        (acc, f) => {
            if (f.status === "applied") acc.applied++;
            else acc.pending++;

            if (f.status === "applied" && f.score > 150) acc.highRisk++;
            return acc;
        },
        { applied: 0, pending: 0, highRisk: 0 }
    );

    return (
        <div className="bg-[#0c0c0c] text-yellow-200 p-6 rounded-md border border-yellow-800 shadow-md max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-yellow-300">
                🧠 BrewDev Manual: Strategic Ops Console
            </h1>

            {/* 🛡️ Fix Governance */}
            <section>
                <h2 className="text-lg font-semibold text-yellow-400">🛡️ Fix Governance</h2>
                <ul className="text-sm space-y-1 mt-2 list-disc list-inside text-yellow-200">
                    <li>Brew never applies code directly — all fixes must be approved by RB</li>
                    <li>Shadow Apply runs tests in sandbox before presenting any candidate</li>
                    <li>Rollback system enables one-click revert of any patch in queue</li>
                    <li>Fixes tracked with full provenance: source → approval → delegation → status</li>
                </ul>
            </section>

            {/* 🎛️ Runtime Controls */}
            <section>
                <h2 className="text-lg font-semibold text-yellow-400 mt-4">🎛️ Runtime Controls</h2>
                <label className="flex items-center gap-3 text-sm">
                    <input
                        type="checkbox"
                        checked={strictMode}
                        onChange={() => setStrictMode(!strictMode)}
                    />
                    Enforce Approval-Only Fix Mode
                </label>

                <label className="flex items-center gap-3 text-sm">
                    <input
                        type="checkbox"
                        checked={sandboxEnabled}
                        onChange={() => setSandboxEnabled(!sandboxEnabled)}
                    />
                    Enable Shadow Apply with Pre-Scan Testing
                </label>

                <div className="mt-2 flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Patch ID to rollback"
                        value={rollbackTrigger || ""}
                        onChange={(e) => setRollbackTrigger(e.target.value)}
                        className="px-2 py-1 bg-[#1c1c1c] border border-yellow-600 rounded text-xs text-yellow-100 w-40"
                    />
                    <button className="bg-yellow-700 px-3 py-1 text-xs rounded hover:bg-yellow-600">
                        🔙 Rollback Patch
                    </button>
                </div>
            </section>

            {/* 🎤 Commentary Controls */}
            <section>
                <h2 className="text-lg font-semibold text-yellow-400 mt-4">🎤 Commentary Tone Matrix</h2>
                <label className="flex items-center gap-3 text-sm">
                    <input
                        type="checkbox"
                        checked={allowSarcasm}
                        onChange={() => setAllowSarcasm(!allowSarcasm)}
                    />
                    Allow Sarcasm in Commentary
                </label>

                <label className="flex items-center gap-3 text-sm">
                    <input
                        type="checkbox"
                        checked={toneBySkill}
                        onChange={() => setToneBySkill(!toneBySkill)}
                    />
                    Adjust Tone by Skill Level (e.g. junior encouragement)
                </label>

                <label className="flex items-center gap-3 text-sm">
                    <input
                        type="checkbox"
                        checked={strategicOnly}
                        onChange={() => setStrategicOnly(!strategicOnly)}
                    />
                    Enforce Strategic Tone in Core Modules
                </label>
            </section>

            {/* 📈 Patch Stats */}
            <section>
                <h2 className="text-lg font-semibold text-yellow-400 mt-4">📈 Patch Metrics</h2>
                <p className="text-sm">
                    ✅ Applied: <strong>{riskStats.applied}</strong> • ⏳ Pending:{" "}
                    <strong>{riskStats.pending}</strong> • ⚠️ High-Risk Patches Applied:{" "}
                    <strong>{riskStats.highRisk}</strong>
                </p>
            </section>
        </div>
    );
}