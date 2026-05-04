// @utils/tier-utils.js
// Summary: Tier access utilities

const TIER_ORDER = {
    free: 0,
    starter: 1,
    brew: 1,
    pro: 2,
    master: 3,
};

function normalizeTierValue(tier) {
    if (typeof tier === "number" && Number.isFinite(tier)) {
        return tier;
    }

    if (typeof tier === "string") {
        const normalized = tier.toLowerCase();
        if (normalized in TIER_ORDER) {
            return TIER_ORDER[normalized];
        }

        const parsed = Number(normalized);
        if (!Number.isNaN(parsed)) {
            return parsed;
        }
    }

    return null;
}

export function hasTierAccess(currentTier, requiredTier) {
    const currentRank = normalizeTierValue(currentTier);
    const requiredRank = normalizeTierValue(requiredTier);

    if (currentRank === null || requiredRank === null) {
        return false;
    }

    return currentRank >= requiredRank;
}

export { normalizeTierValue, TIER_ORDER };
