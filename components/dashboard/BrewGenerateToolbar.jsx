// @file: BrewGenerateToolbar.jsx
// @summary: Live audit trigger with report hash + last run summary
import { useEffect, useState } from 'react';
// import { toast } from 'react-hot-toast';

export default function BrewGenerateToolbar() {
    const [status, setStatus] = useState(null);
    const [reportType, setReportType] = useState('Full');
    const [lastHash, setLastHash] = useState(null);
    const [lastTime, setLastTime] = useState(null);
    const [lastStatus, setLastStatus] = useState(null);

    useEffect(() => {
        fetch('/refactor_ledger.json')
            .then((res) => res.json())
            .then((data) => {
                const latest = data?.slice()?.reverse()?.find((e) => e.type === 'merge-report');
                if (latest) {
                    setLastHash(latest.reportHash);
                    setLastTime(new Date(latest.timestamp).toLocaleString());
                    setLastStatus(latest.untriaged === 0 && !latest.locked ? '🟢 Clean' : latest.locked ? '🔒 Locked' : '⚠️ Review');
                }
            })
            .catch(() => {
                setLastHash(null);
                setLastTime(null);
                setLastStatus(null);
            });
    }, []);

    const triggerReport = async () => {
        setStatus('Generating...');

        try {
            const res = await fetch(`/api/generate-merge-report?type=${reportType}`);
            if (!res.ok) {
                const errorDetails = await (res.headers.get('content-type')?.includes('json') ? res.json() : res.text());
                console.error('⚠️ Merge API error:', errorDetails);
                setStatus('⚠️ Report generation failed');
                return;
            }

            const result = await res.json();
            setStatus(`✅ Saved to ${result.path}`);
            setLastHash(result.reportHash);
            setLastTime(new Date(result.timestamp).toLocaleString());
            setLastStatus(result.locked ? '🔒 Locked' : result.untriaged === 0 ? '🟢 Clean' : '⚠️ Review');
        } catch (err) {
            console.error('❌ Merge trigger failed:', err);
            setStatus('❌ Merge generation error');
        }
    };

    return (
        <div className="bg-[#111] border border-yellow-700 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex flex-wrap items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-yellow-300">📘 Generate Readiness Report</span>
                    <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="bg-[#222] border border-yellow-500 text-yellow-200 px-2 py-1 text-sm rounded"
                    >
                        <option value="Full">Full</option>
                        <option value="Patch Only">Patch Only</option>
                        <option value="Diff from Last">Diff from Last</option>
                    </select>
                    <button
                        onClick={triggerReport}
                        className="bg-yellow-600 hover:bg-yellow-500 text-black px-3 py-1 rounded text-sm font-medium"
                    >
                        📤 Generate
                    </button>
                </div>

                <div className="text-sm text-yellow-400 italic">
                    {lastStatus && (
                        <span className="mr-2">Status: <strong>{lastStatus}</strong></span>
                    )}
                    {lastHash && <span className="mr-2">Hash: {lastHash}</span>}
                    {lastTime && <span>Last: {lastTime}</span>}
                </div>
            </div>

            {status && <div className="text-yellow-400 text-sm italic mt-1">{status}</div>}
        </div>
    );
}