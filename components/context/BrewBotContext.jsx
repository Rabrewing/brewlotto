// @components/context/BrewBotContext.jsx
// Updated: 2025-06-28 02:44 EDT
// Description: Context provider for Brew alerts, toasts, and floating messages
// Exposes `speak(text, options)` and `clear()`
// Used by BrewLottoBot and other notification layers

import { createContext, useContext, useState } from "react";

const BrewBotContext = createContext();

export function BrewBotProvider({ children }) {
    const [message, setMessage] = useState(null);       // active message text
    const [tone, setTone] = useState("default");        // optional theme tone
    const [visible, setVisible] = useState(false);      // toast visibility

    /**
     * Speak = show Brew popup (not voice — this is UI-level)
     * @param {string} text - message body
     * @param {object} options - { tone: string, duration: number (ms), important: boolean }
     */
    const speak = (text, options = {}) => {
        setMessage(text);
        setTone(options.tone || "default");
        setVisible(true);

        // Auto-dismiss unless duration = 0
        if (options.duration !== 0) {
            setTimeout(() => setVisible(false), options.duration || 6000);
        }
    };

    const clear = () => setVisible(false);

    return (
        <BrewBotContext.Provider value={{ message, tone, visible, speak, clear }}>
            {children}
        </BrewBotContext.Provider>
    );
}

export function useBrewBotContext() {
    return useContext(BrewBotContext);
}