// File: utils/toastService.js
// Timestamp: 2025-06-24 20:02 EDT
// Description: Exports common toast types for consistency across app

import toast from 'react-hot-toast';

export const showToast = {
    success: (msg) => toast.success(msg),
    error: (msg) => toast.error(msg),
    loading: (msg) => toast.loading(msg),
    custom: (msg, opts = {}) => toast(msg, opts)
};