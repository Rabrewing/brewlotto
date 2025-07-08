import { useState } from "react";

export default function useFixSuggestion() {
    const [fix, setFix] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFix = async ({ path, code }) => {
        if (!path) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/suggest-fix", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ path, code }),
            });

            const data = await res.json();

            setFix({
                file: path,
                summary: data.reason || "Suggested fix by Brew Da AI",
                patch: {
                    before: code || "", // optional — for diff
                    after: data.suggestion || "",
                },
                issues: ["Entropy scan triggered review", "Style normalization recommended"],
            });
        } catch (err) {
            console.error("[useFixSuggestion]", err);
            setError("Unable to fetch fix");
        } finally {
            setLoading(false);
        }
    };

    return { fix, fetchFix, loading, error };
}