// @summary: Brew Da AI annotates why a strategy pick activated
// @status: ✅ Stable (BrewLotto 2 compatible)
// @timestamp: 2024-01-15T12:00:00Z
// @directory: /src/pages/api
// @route: http://localhost:3000/api/annotate-pick
export default async function handler(req, res) {
    const { pick, strategy, entropy = 0 } = req.body || {};

    if (!pick || !strategy) {
        return res.status(400).json({ error: "Missing pick or strategy" });
    }

    const STRATEGY_EXPLAINERS = {
        PulsePrime: "Activates when draw volatility dips below signal slope. Prefers convergent pairs.",
        SequenceX: "Targets mirrored gap triads across rolling 5-draw windows with entropy lift.",
        HeatCheck: "Identifies number clusters with persistent under-fire probability. Suppression zones elevate picks.",
        QuantumSkew: "Applies rotational modifiers to historically negated states. Counter-predictive shift layer.",
        LuckyLattice: "Combines lattice symmetry with inverted Fibonacci mask. Relies on pre-aligned anchor columns.",
    };

    const base = STRATEGY_EXPLAINERS[strategy] || "No explainer found for this strategy. It may be experimental.";

    const commentary = `
    Strategy: ${strategy}
    Pick: ${pick}
    Rationale: ${base}
    Entropy: ${entropy > 50 ? "High variation detected in recent draws." : "Stable cycle — controlled pattern."}
  `.trim();

    return res.status(200).json({
        commentary,
        meta: {
            strategy,
            pick,
            entropy,
            voiceSuggested: entropy > 60 || strategy === "SequenceX",
        }
    });
}