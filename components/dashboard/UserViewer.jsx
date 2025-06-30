// File: component/dashboard/UserViewer.jsx
// Timestamp: 2025-06-24 21:55 EDT
// Description: Admin panel component for viewing all user_profiles with login and auth context

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { showToast } from '@/utils/toastservice';

export default function UserViewer() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('user_profiles')
            .select('id, display_name, email, last_login');

        if (error) {
            showToast.error('Failed to fetch users from Supabase.');
            console.error(error);
        } else {
            setUsers(data);
            showToast.success(`🚀 ${data.length} users loaded into AdminHub`);
        }

        setLoading(false);
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">👥 User Management</h2>

            {loading ? (
                <p className="text-emerald-400">Loading users...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-800 text-[#FFD700] uppercase tracking-wide">
                            <tr>
                                <th className="px-4 py-2">Display Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Last Login</th>
                                <th className="px-4 py-2">User ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-4 py-2">{user.display_name || '—'}</td>
                                    <td className="px-4 py-2 text-emerald-300">{user.email}</td>
                                    <td className="px-4 py-2 text-sm text-gray-400">
                                        {user.last_login
                                            ? new Date(user.last_login).toLocaleString()
                                            : '—'}
                                    </td>
                                    <td className="px-4 py-2 text-xs text-gray-500">{user.id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}