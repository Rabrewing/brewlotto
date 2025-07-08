// @file: summarizeUtils.js
// @directory: /lib
// @summary: Generates file-level summary using patterns or AI

export const generateAISummary = (code = '') => {
    const length = code.split('\n').length;

    if (/entropy|score|variation/.test(code)) return 'Analyzes draws for entropy or risk factors';
    if (/generate|random|Math\.random/.test(code)) return 'Creates randomized number sequences';
    if (/filter|map|reduce/.test(code)) return 'Processes datasets to narrow results';
    if (/draws|results|history/.test(code)) return 'Parses historical draw data';
    if (/strategy/i.test(code)) return 'Encodes a lotto strategy or number selection algorithm';
    if (/chart|render|button|card|panel/.test(code)) return 'Renders a front-end UI component';
    if (length > 300) return 'Complex logic file — may include multiple strategies or pipelines';

    return 'General-purpose utility or data handling logic';
};