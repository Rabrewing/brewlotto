import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { pick, strategy, entropy = 0 } = await req.json();

    if (!pick || !strategy) {
        return NextResponse.json({ error: "Missing pick or strategy" }, { status: 400 });
    }

    const STRATEGY_EXPLAINERS: { [key: string]: string } = {
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

    return NextResponse.json({
        commentary,
        meta: {
            strategy,
            pick,
            entropy,
            voiceSuggested: entropy > 60 || strategy === "SequenceX",
        }
    }, { status: 200 });
}
