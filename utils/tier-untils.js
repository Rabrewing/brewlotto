export function hasTierAccess(currentTier, required) {
    const tierOrder = ["free", "brew", "master"];
    return tierOrder.indexOf(currentTier) >= tierOrder.indexOf(required);
}