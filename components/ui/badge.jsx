// @file: badge.jsx
// @directory: /components/ui
// @timestamp: 2025-07-01T11:35 EDT
// @summary: Small semantic label used for status indicators (e.g. deprecated, unused, active)
// @route: N/A — used in MergeAuditTable, FileScanResults, and future dashboard pills

import React from 'react';
import clsx from 'clsx';

export const Badge = ({ text, type = 'default', className = '' }) => {
    const base = 'px-2 py-1 rounded text-xs font-semibold text-white';

    const variants = {
        default: 'bg-gray-700',
        active: 'bg-green-500',
        unused: 'bg-yellow-500 text-black',
        deprecated: 'bg-red-600',
        archived: 'bg-gray-500',
    };

    return (
        <span className={clsx(base, variants[type.toLowerCase()] || variants.default, className)}>
            {text}
        </span>
    );
};