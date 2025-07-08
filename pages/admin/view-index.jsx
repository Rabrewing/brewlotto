// @route: /admin/view-index
// @summary: Fully enhanced visual index viewer with live tools
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function ViewIndex() {
    const [files, setFiles] = useState([]);
    const [query, setQuery] = useState('');
    const [sortBy, setSortBy] = useState('path');
    const [ascending, setAscending] = useState(true);
    const [showJSON, setShowJSON] = useState(false);
    const [compact, setCompact] = useState(false);

    useEffect(() => {
        fetch('/public/BrewMergeFileIndex.json')
            .then((res) => res.json())
            .then((data) => setFiles(data || []))
            .catch((err) => console.error('Failed to load index:', err));
    }, []);

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(files, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'BrewMergeFileIndex.json';
        link.click();
    };

    const header = (label, key) => (
        <th
            className="p-2 cursor-pointer hover:underline text-left"
            onClick={() => {
                setSortBy(key);
                setAscending(key === sortBy ? !ascending : true);
            }}
        >
            {label} {sortBy === key ? (ascending ? '▲' : '▼') : ''}
        </th>
    );

    const filtered = files
        .filter(
            (f) =>
                f.path.toLowerCase().includes(query.toLowerCase()) ||
                (f.tags || []).some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
                (f.description || '').toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => {
            const valA = a[sortBy] || '';
            const valB = b[sortBy] || '';
            if (typeof valA === 'number') return ascending ? valA - valB : valB - valA;
            return ascending
                ? String(valA).localeCompare(String(valB))
                : String(valB).localeCompare(String(valA));
        });

    const updateTags = (i, value) => {
        const updated = [...files];
        updated[i].tags = value.split(',').map((s) => s.trim());
        setFiles(updated);
    };

    return (
        <div className="p-6 bg-[#111] min-h-screen text-yellow-100">
            <Head>
                <title>Brew Index Viewer</title>
            </Head>

            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h1 className="text-2xl font-bold">📂 BrewMerge Index Viewer</h1>

                <div className="flex gap-2">
                    <input
                        className="bg-[#222] border border-yellow-600 text-yellow-200 px-3 py-1 rounded text-sm"
                        placeholder="Search path, tag, or description..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                        onClick={handleExport}
                        className="bg-yellow-600 hover:bg-yellow-500 text-black px-3 py-1 rounded text-sm font-medium"
                    >
                        ⬇️ Export JSON
                    </button>
                    <label className="text-sm flex items-center gap-1">
                        <input
                            type="checkbox"
                            checked={showJSON}
                            onChange={() => setShowJSON(!showJSON)}
                        />
                        Show Raw JSON
                    </label>
                    <label className="text-sm flex items-center gap-1">
                        <input
                            type="checkbox"
                            checked={compact}
                            onChange={() => setCompact(!compact)}
                        />
                        Compact Mode
                    </label>
                </div>
            </div>

            {showJSON ? (
                <pre className="text-xs bg-[#222] text-yellow-300 p-4 rounded max-h-[70vh] overflow-auto">
                    {JSON.stringify(files, null, 2)}
                </pre>
            ) : (
                <table className="w-full text-sm border border-yellow-700 rounded overflow-hidden">
                    <thead className="bg-yellow-900 text-yellow-200">
                        <tr>
                            {header('Path', 'path')}
                            {header('Tags', 'tags')}
                            {header('Risk', 'refactorRisk')}
                            {header('Lines', 'lines')}
                            {header('Status', 'status')}
                            {header('Description', 'description')}
                            <th className="p-2">🧠</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((f, i) => (
                            <tr
                                key={i}
                                className={`border-b border-yellow-800 hover:bg-yellow-800/10 transition ${f.refactorRisk === 'high'
                                        ? 'bg-red-800/20'
                                        : f.refactorRisk === 'medium'
                                            ? 'bg-yellow-600/10'
                                            : 'bg-transparent'
                                    }`}
                            >
                                <td className="p-2 font-mono">{f.path}</td>
                                <td className="p-2 text-center">
                                    <input
                                        className="bg-[#222] border border-yellow-500 text-yellow-100 text-xs px-1 py-0.5 rounded w-full"
                                        value={(f.tags || []).join(', ')}
                                        onChange={(e) => updateTags(i, e.target.value)}
                                    />
                                </td>
                                <td className="p-2 text-center capitalize">{f.refactorRisk}</td>
                                <td className="p-2 text-center">{f.lines}</td>
                                <td className="p-2 text-center">{f.status}</td>
                                <td className={`p-2 text-yellow-300 ${compact ? 'text-xs' : ''}`}>
                                    {f.description}
                                </td>
                                <td className="p-2 text-center">
                                    <button
                                        className="bg-yellow-500 hover:bg-yellow-400 text-black px-2 py-0.5 rounded text-xs"
                                        title="Generate fix suggestion"
                                        onClick={() => console.log(`Suggest fix for: ${f.path}`)}
                                    >
                                        💡
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {filtered.length === 0 && (
                <p className="mt-4 italic text-yellow-500">No matching files found.</p>
            )}
        </div>
    );
}