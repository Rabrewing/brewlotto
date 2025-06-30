// @theme/BREW_PHRASES.js
// Last updated: 2025-06-28
// Brew voice lines for commentary overlay and TTS

export const BREW_PHRASES = {
    strategist: {
        idle: [
            "Brew is scanning number flow...",
            "Checking draw cycles for shifts...",
        ],
        loading: [
            "Crunching probability bands...",
            "Syncing entropy overlays — standby...",
        ],
        success: {
            random: ["QuickMix™ deployed — let’s see how it lands."],
            momentum: ["HeatWave™ running — acceleration locked in."],
            "poisson++": ["PulsePrime™ analysis complete — pattern core active."],
            default: ["Prediction aligned. Brew is watching the tail..."],
        },
        error: ["Hmm. That didn’t sync. Try reshuffling picks."],
    },

    chill: {
        idle: [
            "Vibes syncing...",
            "Letting patterns drift in...",
        ],
        loading: [
            "Brew’s pouring over possibilities...",
            "Floating through numberscape 🫧",
        ],
        success: {
            random: ["QuickMix vibes. Let’s ride 🌀"],
            default: ["Looks good. Trust the flow..."],
        },
        error: ["Nah, that one's off. Let’s try again with fresh heat."],
    },

    coach: {
        idle: [
            "Let’s lock in. Brew’s ready.",
            "Clock’s ticking — make your move.",
        ],
        loading: [
            "Scanning for signal...",
            "Data loading — Brew sees the angles.",
        ],
        success: {
            "markov++": ["SequenceX™ cracked. Pattern memory in play."],
            hotCold: ["HeatCheck™ confirms fire on the field."],
            default: ["Numbers in position. Let’s execute."],
        },
        error: ["Reset. Run it back stronger."],
    },
};