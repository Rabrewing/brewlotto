// @file: alertStore.js
// @summary: Zustand store for Brew Da AI alert system (assignment, audit, error, toast)

import { create } from 'zustand';
import { nanoid } from 'nanoid';

export const useAlertStore = create((set) => ({
    alerts: [],

    // 🚨 Add a new alert
    addAlert: (alert) =>
        set((state) => ({
            alerts: [
                ...state.alerts,
                {
                    id: nanoid(),
                    type: alert.type || 'info', // e.g., 'fix-assignment', 'error', 'success'
                    title: alert.title || 'Brew Da AI Notification',
                    message: alert.message || '',
                    assigned_to: alert.assigned_to || null,
                    from: alert.from || 'System',
                    timestamp: alert.timestamp || new Date().toISOString(),
                    status: alert.status || 'unread',
                },
            ],
        })),

    // 📥 Mark alert as read
    markRead: (id) =>
        set((state) => ({
            alerts: state.alerts.map((a) =>
                a.id === id ? { ...a, status: 'read' } : a
            ),
        })),

    // ❌ Remove an alert
    dismissAlert: (id) =>
        set((state) => ({
            alerts: state.alerts.filter((a) => a.id !== id),
        })),

    // 🔄 Clear all
    clearAlerts: () => set({ alerts: [] }),
}));