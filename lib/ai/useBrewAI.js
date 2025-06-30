// @lib/ai/useBrewAI.js
// Summary: Hook to send prompts to BrewAI backend (Copilot-like dev assistant)

import { useState } from "react";
import axios from "axios";

export function useBrewAI() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendPrompt = async (messages = [], options = {}) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.post("/api/brew-ai", {
                messages,
                context: options.context || null,
                systemPrompt: options.systemPrompt || null,
                fileEditing: options.fileEditing || false,
            });

            return response.data.reply || "";
        } catch (err) {
            setError("Brew AI is offline or encountered an error.");
            console.error("[BrewAI Error]:", err);
            return "";
        } finally {
            setLoading(false);
        }
    };

    return { sendPrompt, loading, error };
}