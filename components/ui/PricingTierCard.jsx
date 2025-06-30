// @components/ui/PricingTierCard.jsx
// Summary: Renders a tier card with lock state, feature list, and upgrade button + voice prompts

import { CheckCircleIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useBrewBotContext } from "@/components/context/BrewBotContext";

export default function PricingTierCard({
    tierId = "",
    title = "",
    description = "",
    features = [],
    locked = false,
    current = false,
    onUpgrade = () => { },
}) {
    const { prompt } = useBrewBotContext();

    const handleMouseEnter = () => {
        if (locked) {
            const previewLines = {
                brew: "This is Brew Tier. Brew commentary and strategic Pulse are activated here.",
                master: "Master Tier engages full prediction firepower. SequenceX™, entropy, the works.",
            };
            if (previewLines[tierId]) prompt(previewLines[tierId]);
        }
    };

    const tierColor = current
        ? "border-yellow-400 bg-yellow-950"
        : locked
            ? "border-neutral-700 bg-neutral-900"
            : "border-green-700 bg-neutral-800";

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`rounded-lg border ${tierColor} p-6 space-y-4 relative shadow`}
            onMouseEnter={handleMouseEnter}
        >
            {locked && (
                <div className="absolute top-4 right-4 bg-yellow-600 text-black text-xs px-2 py-1 rounded-full">
                    Locked
                </div>
            )}

            {current && (
                <div className="absolute top-4 right-4 bg-green-500 text-black text-xs px-2 py-1 rounded-full">
                    Current Tier
                </div>
            )}

            <h2 className="text-xl font-bold text-yellow-300">{title}</h2>
            <p className="text-neutral-400 text-sm">{description}</p>

            <ul className="mt-2 space-y-2">
                {features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                        {locked ? (
                            <LockClosedIcon className="w-4 h-4 text-neutral-500" />
                        ) : (
                            <CheckCircleIcon className="w-4 h-4 text-green-400" />
                        )}
                        {feat}
                    </li>
                ))}
            </ul>

            {!current && (
                <button
                    onClick={onUpgrade}
                    className="mt-4 w-full py-2 text-sm font-medium rounded bg-yellow-500 hover:bg-yellow-400 text-black"
                >
                    Upgrade to {title}
                </button>
            )}
        </motion.div>
    );
}