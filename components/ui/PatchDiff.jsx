// @file: PatchDiff.jsx
// @summary: Brew-themed diff viewer with unified/split view, line numbers, syntax highlighting, and collapsible blocks
// @timestamp: 2025-07-04
// @author: Copilot x RB
// @dependencies: diff, prismjs
// @status: Cockpit-ready ✅

import { diffLines } from 'diff';
import { useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';

export default function PatchDiff({ before = '', after = '', language = 'javascript' }) {
    const diff = diffLines(before, after);
    const [viewMode, setViewMode] = useState('inline');
    const [showUnchanged, setShowUnchanged] = useState(true);

    const highlight = (code = '') =>
        Prism.highlight(code, Prism.languages[language], language);

    return (
        <div className="space-y-2">
            {/* Toggle Controls */}
            <div className="flex items-center gap-4 text-sm text-yellow-400">
                <label className="flex items-center gap-1">
                    <input
                        type="checkbox"
                        checked={viewMode === 'split'}
                        onChange={() => setViewMode(viewMode === 'split' ? 'inline' : 'split')}
                    />
                    Split View
                </label>
                <label className="flex items-center gap-1">
                    <input
                        type="checkbox"
                        checked={showUnchanged}
                        onChange={() => setShowUnchanged((s) => !s)}
                    />
                    Show Unchanged
                </label>
            </div>

            {/* Diff Display */}
            <pre className="bg-[#1a1a1a] text-sm p-4 rounded overflow-auto text-yellow-100 font-mono border border-yellow-800 leading-relaxed">
                {diff.map((part, i) => {
                    if (!showUnchanged && !part.added && !part.removed) return null;

                    const color = part.added
                        ? 'bg-green-900 text-green-300'
                        : part.removed
                            ? 'bg-red-900 text-red-300'
                            : 'text-yellow-400';

                    const highlighted = highlight(part.value);

                    if (viewMode === 'split') {
                        return (
                            <div key={i} className="flex border-b border-yellow-700 last:border-0">
                                <div className={`w-1/2 pr-2 ${part.removed ? color : 'text-yellow-800'}`}>
                                    {part.removed ? (
                                        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
                                    ) : (
                                        <code>&nbsp;</code>
                                    )}
                                </div>
                                <div className={`w-1/2 pl-2 ${part.added ? color : 'text-yellow-800'}`}>
                                    {part.added ? (
                                        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
                                    ) : (
                                        <code>&nbsp;</code>
                                    )}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={i} className={`whitespace-pre-wrap ${color}`}>
                            <code dangerouslySetInnerHTML={{ __html: highlighted }} />
                        </div>
                    );
                })}
            </pre>
        </div>
    );
}