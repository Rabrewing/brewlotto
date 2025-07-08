// @file: SidebarMenu.jsx
// @directory: /components/dashboard
// @summary: Sidebar nav for BrewCommand with role check, icons, and active highlighting

import Link from 'next/link';
import { useRouter } from 'next/router';

export default function SidebarMenu({ user }) {
    const router = useRouter();

    if (!user || user.role !== 'admin') return null;

    const navItems = [
        { label: '🛠 Admin Panel', path: '/admin' },
        { label: '🧠 BrewCommand', path: '/brewcommand' },
        { label: '📜 Audit Feed', path: '/audit' },
        { label: '📂 Log Viewer', path: '/logs' },
        { label: '💾 Backup Viewer', path: '/backupviewer' },
        { label: '📊 BrewVision Docs', path: '/brewvision' },
    ];

    return (
        <aside className="w-64 bg-[#1c1c1c] text-[#FFD700] h-full p-6 space-y-4 shadow-md">
            <div className="text-xl font-extrabold tracking-tight mb-4">Admin Tools</div>

            <nav className="space-y-3 text-md font-medium">
                {navItems.map(({ label, path }) => (
                    <Link
                        key={path}
                        href={path}
                        className={`block transition ${router.pathname === path ? 'text-white font-bold' : 'hover:text-white'
                            }`}
                    >
                        {label}
                    </Link>
                ))}
            </nav>

            {/* Optional: Add version badge or environment toggle here */}
            {/* <div className="text-xs text-gray-400 pt-4">v1.2.3 • Dev</div> */}
        </aside>
    );
}