// =============================================
// 📁 /components/layouts/AppShell.jsx
// Created: 2025-06-27T05:10 EDT
// Summary: App-wide layout shell with BrewBot dock, animated transitions,
// legal footer, and Alt+B modal support (no NavBar)
// =============================================

import { useEffect } from "react";
import { useBrewBot } from "@/hooks/useBrewBot";
import BrewLottoBotDock from "@/components/ui/BrewLottoBotDock";
import BrewLottoBotModal from "@/components/ui/BrewLottoBotModal";
import { motion, AnimatePresence } from "framer-motion";

export default function AppShell({ children }) {
    const { open, closeBot, toggle } = useBrewBot();

    useEffect(() => {
        const listener = (e) => {
            if (e.altKey && e.key.toLowerCase() === "b") {
                e.preventDefault();
                toggle();
            }
        };
        window.addEventListener("keydown", listener);
        return () => window.removeEventListener("keydown", listener);
    }, [toggle]);

    return (
        <div className="min-h-screen flex flex-col bg-black text-white">
            {/* Main viewport + route fade */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={typeof window !== "undefined" ? window.location.pathname : "brew"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="flex-grow"
                >
                    {children}
                </motion.div>
            </AnimatePresence>

            {/* Docked BrewBot & Voice Modal */}
            <BrewLottoBotDock />
            <BrewLottoBotModal open={open} onClose={closeBot} />

            {/* 📜 Footer with legal info */}
            <footer className="bg-neutral-900 text-xs text-neutral-400 py-6 px-4 mt-10 border-t border-yellow-500">
                <div className="max-w-4xl mx-auto space-y-2">
                    <p>
                        📜 <strong>BrewLotto AI</strong> is intended for users 18+ and for entertainment purposes only. This app does not guarantee winnings or provide gambling services. Play responsibly.
                    </p>
                    <p>
                        🔞 By using BrewLotto AI, you confirm you are 18+ and agree to our{" "}
                        <a href="/legal/terms" className="underline text-yellow-300">
                            Terms of Use
                        </a>{" "}
                        and{" "}
                        <a href="/legal/privacy" className="underline text-yellow-300">
                            Privacy Policy
                        </a>
                        .
                    </p>
                    <p className="text-neutral-500">
                        © {new Date().getFullYear()} BrewLotto AI. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}