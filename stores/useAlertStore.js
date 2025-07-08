// @file: useAlertStore.js
// @directory: /stores
// @summary: Zustand store for Brew Da AI alert system

import { create } from 'zustand';
import { nanoid } from 'nanoid';

export const useAlertStore = create((set) => ({
    alerts: [],

    addAlert: (alert) =>
        set((state) => ({
            alerts: [
                ...state.alerts,
                {
                    id: nanoid(),
                    type: alert.type || 'info',
                    title: alert.title || 'Brew Da AI Notification',
                    message: alert.message || '',
                    assigned_to: alert.assigned_to || null,
                    from: alert.from || 'System',
                    timestamp: alert.timestamp || new Date().toISOString(),
                    status: alert.status || 'unread',
                },
            ],
        })),

    markRead: (id) =>
        set((state) => ({
            alerts: state.alerts.map((a) =>
                a.id === id ? { ...a, status: 'read' } : a
            ),
        })),

    dismissAlert: (id) =>
        set((state) => ({
            alerts: state.alerts.filter((a) => a.id !== id),
        })),

    clearAlerts: () => set({ alerts: [] }),
}));