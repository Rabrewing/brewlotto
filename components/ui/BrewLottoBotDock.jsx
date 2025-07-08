// =============================================
// 📁 /components/ui/BrewLottoBotDock.jsx
// Updated: 2025-06-28T02:35 EDT
// Summary: Floating dock button to launch Brew modal
// Uses useBrewBot() for modal state control
// Includes Alt+B keyboard shortcut to open Brew
// Consistent with voice and icon across the stack
// =============================================

import { useEffect } from "react";
import { useBrewBot } from "@/hooks/useBrewBot";

export default function BrewLottoBotDock() {
    const { toggle } = useBrewBot();

    // 🔑 Optional: Alt+B shortcut to open BrewBot modal
    useEffect(() => {
        const handleKey = (e) => {
            if (e.altKey && e.key.toLowerCase() === "b") {
                e.preventDefault();
                toggle();
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [toggle]);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <button
                onClick={toggle}
                className="bg-yellow-400 hover:bg-yellow-300 text-black px-5 py-2 rounded-full shadow-lg text-sm transition flex items-center gap-2"
                aria-label="Open Brew assistant"
            >
                🧠 Talk to Brew
            </button>
        </div>
    );
}