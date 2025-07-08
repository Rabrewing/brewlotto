// @file: ReadinessReportViewer.jsx
// @summary: Renders the MergeReadinessReport.md from /docs/merge/
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ReadinessReportViewer() {
    const [content, setContent] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch('/docs/merge/MergeReadinessReport.md')
            .then((res) => res.ok ? res.text() : Promise.reject('Load failed'))
            .then(setContent)
            .catch(() => setError(true));
    }, []);

    return (
        <div className="bg-[#1a1a1a] p-4 rounded border border-yellow-700 max-h-[75vh] overflow-auto">
            <h2 className="text-xl font-semibold mb-2 text-yellow-200">🧾 Readiness Report</h2>
            {error ? (
                <p className="text-red-500">Failed to load MergeReadinessReport.md</p>
            ) : (
                <ReactMarkdown className="prose prose-invert prose-sm">
                    {content}
                </ReactMarkdown>
            )}
        </div>
    );
}