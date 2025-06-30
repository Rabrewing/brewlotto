// components/dashboard/SidebarMenu.jsx
import Link from 'next/link';

export default function SidebarMenu({ user }) {
    if (!user?.role === 'admin') return null;

    return (
        <aside className="w-64 bg-[#1c1c1c] text-[#FFD700] h-full p-6 space-y-4 shadow-md">
            <div className="text-xl font-extrabold tracking-tight mb-4">Admin Tools</div>
            <nav className="space-y-3 text-md font-medium">
                <Link href="/admin" className="hover:text-white block transition">Admin Panel</Link>
                <Link href="/brewcommand" className="hover:text-white block transition">BrewCommand</Link>
                <Link href="/audit" className="hover:text-white block transition">Audit Feed</Link>
                <Link href="/logs" className="hover:text-white block transition">Log Viewer</Link>
                <Link href="/backupviewer" className="hover:text-white block transition">Backup Viewer</Link>
                <Link href="/brewvision" className="hover:text-white block transition">BrewVision Docs</Link>
            </nav>
        </aside>
    );
}