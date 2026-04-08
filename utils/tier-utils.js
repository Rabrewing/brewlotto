// @utils/tier-utils.js
// Summary: Tier access utilities

export function hasTierAccess(currentTier, requiredTier) {
    const tierOrder = ["free", "brew", "master"];
    const currentIndex = tierOrder.indexOf(currentTier);
    const requiredIndex = tierOrder.indexOf(requiredTier);

    if (currentIndex === -1 || requiredIndex === -1) {
        return false;
    }

    return currentIndex >= requiredIndex;
}
