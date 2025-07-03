// @file: button.jsx
// @directory: /components/ui
// @timestamp: 2025-07-01T11:55 EDT
// @summary: Primary, outline, and ghost button variants with Brew styling
// @route: N/A — used in BrewMergeUI, dashboard, and visualizers

import React from 'react';
import clsx from 'clsx';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const base = 'rounded-xl px-4 py-2 font-semibold transition-all text-sm';
    const variants = {
        primary: 'bg-[#FFD700] text-black hover:bg-white hover:text-[#FFD700]',
        outline: 'border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black',
        ghost: 'bg-transparent text-yellow-300 hover:bg-[#1f2937]',
    };

    return (
        <button className={clsx(base, variants[variant], className)} {...props}>
            {children}
        </button>
    );
};