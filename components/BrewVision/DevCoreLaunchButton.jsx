// components/BrewVision/DevCoreLaunchButton.jsx

import { useState } from "react";

export default function DevCoreLaunchButton() {
    const [status, setStatus] = useState("idle");

    const handleLaunch = async () => {
        try {
            setStatus("launching");

            // Placeholder: Launch hook or endpoint call
            const res = await fetch("/api/devcore/trigger", { method: "POST" });

            if (!res.ok) throw new Error("Failed to trigger DevCore");

            setStatus("success");
        } catch (err) {
            setStatus("error");
            console.error("DevCore launch failed:", err);
        } finally {
            setTimeout(() => setStatus("idle"), 3000); // Reset after feedback
        }
    };

    const getLabel = () => {
        switch (status) {
            case "launching": return "Launching Core...";
            case "success": return "Success ✔";
            case "error": return "Launch Failed ✖";
            default: return "Launch DevCore 🔧";
        }
    };

    return (
        <button
            onClick={handleLaunch}
            disabled={status === "launching"}
            className={`px-4 py-2 rounded font-bold transition-all duration-300
        ${status === "success" ? "bg-green-600" :
                    status === "error" ? "bg-red-600" :
                        "bg-[#FFD700] text-black hover:bg-yellow-300"}
      `}
        >
            {getLabel()}
        </button>
    );
}