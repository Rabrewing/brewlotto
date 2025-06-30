import { useState } from "react";
import { useRouter } from "next/router";

export default function HamburgerMenu({ user }) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const navItems = [
        { label: "Home", route: "/" },
        { label: "My Numbers", route: "/dashboard" },
        { label: "Game Rules", route: "/rules" },
        ...(user?.role === "admin" ? [{ label: "Admin", route: "/admin" }] : []),
        { label: user ? "Sign Out" : "Sign In", route: user ? "/signout" : "/login" },
    ];

    return (
        <div className="fixed top-4 left-4 z-50">
            {/* Hamburger Toggle */}
            <button
                onClick={() => setOpen(!open)}
                className="text-white bg-[#0f172a] p-2 rounded-md shadow hover:bg-yellow-500 focus:outline-none"
            >
                <span className="block w-6 h-0.5 bg-white mb-1" />
                <span className="block w-6 h-0.5 bg-white mb-1" />
                <span className="block w-6 h-0.5 bg-white" />
            </button>

            {/* Slide-out Menu */}
            {open && (
                <div className="absolute top-12 left-0 w-52 bg-[#1e293b] text-white p-4 rounded-xl shadow-lg space-y-3 animate-fade-in">
                    {navItems.map((item) => (
                        <button
                            key={item.route}
                            onClick={() => {
                                setOpen(false);
                                router.push(item.route);
                            }}
                            className="w-full text-left hover:text-yellow-400 transition"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}