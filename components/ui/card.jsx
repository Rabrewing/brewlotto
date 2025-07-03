// @file: card.jsx
// @directory: /components/ui
// @timestamp: 2025-07-01T11:18 EDT
// @summary: Reusable container with padding, rounded corners, and dark surface
// @route: N/A — used across admin panels

import React from 'react';
import clsx from 'clsx';

export const Card = ({ className = '', children, ...props }) => (
    <div
        className={clsx(
            'bg-[#1C1C1C] border border-[#333] rounded-xl p-4 shadow-md',
            className
        )}
        {...props}
    >
        {children}
    </div>
);