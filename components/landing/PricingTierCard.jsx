// @components/landing/PricingTierCard.jsx
// Summary: Renders a tier card with lock state, feature list, and upgrade button

import { CheckCircleIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function PricingTierCard({
    tierId = "",
    title = "",
    description = "",
    features = [],
    locked = false,
    current = false,
    onUpgrade = () => { },
}) {
    const tierColor = current
        ? "border-yellow-400 bg-yellow-950"
        : locked
            ? "border-gray-600 bg-gray-900"
            : "border-yellow-600/50 bg-gray-900";

    return (
        <motion.div
            className={`relative rounded-2xl border-2 ${tierColor} p-6 flex flex-col`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            {current && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                    CURRENT
                </div>
            )}

            <div className="mb-4">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="text-sm text-gray-400 mt-1">{description}</p>
            </div>

            <ul className="space-y-2 mb-6 flex-grow">
                {features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircleIcon className="w-4 h-4 text-green-400" />
                        {feature}
                    </li>
                ))}
            </ul>

            <button
                onClick={onUpgrade}
                disabled={locked}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    locked
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-yellow-500 text-black hover:bg-yellow-400"
                }`}
            >
                {locked ? (
                    <span className="flex items-center justify-center gap-2">
                        <LockClosedIcon className="w-4 h-4" />
                        Locked
                    </span>
                ) : (
                    "Upgrade"
                )}
            </button>
        </motion.div>
    );
}
