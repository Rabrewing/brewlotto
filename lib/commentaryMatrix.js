// =============================================
// 📁 File: /lib/commentaryMatrix.js
// 🧠 Summary: Determines narrative tone for patches based on file, user, category, and fix status
//
// 🔁 Used in: FixSuggestionPanel.jsx, PatchNarrator, BrewDevManual toggles
// ✨ Added: Phase 5.1 — Tone Matrix Logic
// =============================================

export function getCommentaryTone({ file = "", user = "", category = "", status = "" }) {
    const lowerFile = file.toLowerCase();
    const lowerCategory = category.toLowerCase();

    if (lowerFile.includes("brew-command") || lowerCategory.includes("brewcommand")) {
        return "strategic";
    }

    if (user === "junior" && status !== "applied") {
        return "encouraging";
    }

    if (
        lowerCategory.includes("powerball") ||
        lowerCategory.includes("megamillions") ||
        lowerFile.includes("drawengine")
    ) {
        return "precautionary";
    }

    if (status === "applied" && user === "RB") {
        return "mission-complete";
    }

    return "neutral";
}

export const tonePhrases = {
    strategic: [
        "This module anchors refactor orchestration — proceeding with precision.",
        "Strategic zone identified. We scan, we speak, we surgically uplift.",
        "Core cockpit territory. Every change echoes through BrewCommand."
    ],
    encouraging: [
        "Solid patch! Elegant lift — great use of the LedgerHandler.",
        "Clean diff. Light, confident refactor — keep rolling.",
        "You're reading the entropy like a seasoned brew whisperer!"
    ],
    precautionary: [
        "This governs draw flow. All deltas must pass jackpot integrity.",
        "Flagged for prediction-chain overlap — proceed cautiously.",
        "Draw logic central — full diff review recommended."
    ],
    "mission-complete": [
        "Patch secured. Risk profile zeroed. Brew approved.",
        "Fix locked. No unresolved entropy. Mission complete.",
        "Delta applied — zero conflicts. BrewBot signs off."
    ],
    neutral: [
    "Standard diff pattern identified. Suggest refactor.",
    "Flagged by BrewScan — complexity exceeds threshold.",
    "Entropy exceeds safe limits. Patch proposal incoming."
]
};