// @components/ui/BrewLottoBot.jsx
// Updated: 2025-06-28T02:33 EDT
// Toast-style floating message from Brew
// Replaces “BrewLottoBot” with brand-consistent “🧠 Brew”
// Auto-disappears after 5 seconds unless replaced

import { useEffect, useState } from "react";

export default function BrewLottoBot({ message }) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        if (!message) return;
        setShow(true);
        const timer = setTimeout(() => setShow(false), 5000);
        return () => clearTimeout(timer);
    }, [message]);

    if (!show || !message) return null;

    return (
        <div
            className="fixed bottom-6 right-6 z-50 bg-[#232323] text-white rounded-lg px-4 py-3 shadow-lg border border-yellow-400 max-w-sm"
            role="status"
            aria-live="polite"
        >
            <p className="text-sm font-mono text-yellow-200">
                🧠 Brew: {message}
            </p>
        </div>
    );
}