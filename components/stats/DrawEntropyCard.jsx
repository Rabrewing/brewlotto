// @components/stats/DrawEntropyCard.jsx
// Summary: Displays entropy score with tier access gating and BrewBot prompt
// @timestamp 2025-06-28T15:00 EDT
import { hasTierAccess } from "@/utils/tier-utils";
import { useUserTier } from "@/hooks/useUserTier";
import { useBrewBotContext } from "@/components/context/BrewBotContext";
import toast from "react-hot-toast";

export default function DrawEntropyCard({ entropy = 0 }) {
    const { currentTier } = useUserTier();
    const { prompt } = useBrewBotContext();

    const unlocked = hasTierAccess(currentTier, "master");

    const handleLocked = () => {
        toast("Entropy scores are a Master Tier feature.");
        prompt("Entropy analytics require Master Tier. Upgrade to reveal randomness patterns and predictability.");
    };

    if (!unlocked) {
        return (
            <div
                onClick={handleLocked}
                className="cursor-pointer relative bg-neutral-900 border border-yellow-700 rounded p-4 text-center opacity-60 hover:opacity-90 transition"
            >
                <div className="text-yellow-400 font-semibold mb-1">🔒 Draw Entropy</div>
                <div className="text-sm text-neutral-400">
                    Available in <strong>Master Tier</strong>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-neutral-900 border border-yellow-700 rounded p-4 text-center">
            <div className="text-yellow-400 font-semibold mb-1">🧪 Draw Entropy</div>
            <div className="text-3xl font-mono text-white">{entropy.toFixed(2)}</div>
            <div className="text-sm text-neutral-400">0 = Repeat-heavy | 100 = Random chaos</div>
        </div>
    );
}