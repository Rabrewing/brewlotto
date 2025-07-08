import { useState } from "react";
import { useUserTier } from "@/hooks/useUserTier"; // Updated path
import { hasTierAccess } from "@/utils/tier-utils";
import { STRATEGY_EXPLAINERS } from "@/lib/explainers/strategyExplainers";
import { useBrewBotContext } from "@/components/context/BrewBotContext";
import toast from "react-hot-toast";

const STRATEGIES = [
    { id: "random", icon: "🎲", tier: 1 },
    { id: "hotCold", icon: "🔥🧊", tier: 1 },
    { id: "momentum", icon: "📈", tier: 1 },
    { id: "poisson+", icon: "🧠", tier: 2 },
    { id: "poisson++", icon: "🧠⚡️", tier: 3 },
    { id: "markov++", icon: "🔮", tier: 3 },
];

export default function PredictionStrategyToggle({ selected, onChange }) {
    const { currentTier } = useUserTier();
    const { prompt } = useBrewBotContext();
    const [hovered, setHovered] = useState(null);

    const handleClick = (strategy) => {
        const allowed = hasTierAccess(currentTier, strategy.tier);
        if (!allowed) {
            toast("Unlock this strategy by upgrading your tier");
            prompt(`The ${STRATEGY_EXPLAINERS?.[strategy.id]?.label || strategy.id} strategy requires a higher tier.`);
            return;
        }

        const isActive = selected.includes(strategy.id);
        const next = isActive
            ? selected.filter((s) => s !== strategy.id)
            : [...selected, strategy.id];

        onChange(next);
    };

    return (
        <div className="flex flex-wrap gap-2">
            {STRATEGIES.map((s) => {
                const unlocked = hasTierAccess(currentTier, s.tier);
                const isActive = selected.includes(s.id);
                const label = STRATEGY_EXPLAINERS?.[s.id]?.label || s.id;

                return (
                    <button
                        key={s.id}
                        className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm border
              ${isActive ? "bg-yellow-400 text-black" : "bg-neutral-800 text-neutral-300"}
              ${unlocked ? "border-neutral-700 hover:bg-yellow-500 hover:text-black" : "border-neutral-700 opacity-40 cursor-not-allowed"}
            `}
                        onClick={() => handleClick(s)}
                        onMouseEnter={() => {
                            setHovered(s.id);
                            if (!unlocked) {
                                prompt(`The ${label} strategy is locked. Upgrade your tier to enable it.`);
                            }
                        }}
                        onMouseLeave={() => setHovered(null)}
                        title={
                            unlocked
                                ? `Toggle ${label}`
                                : `Unlock ${label} with Brew Tier ${s.tier}`
                        }
                    >
                        <span>{s.icon}</span>
                        <span>{label}</span>
                        {!unlocked && <span className="ml-1 text-xs">🔒</span>}
                    </button>
                );
            })}
        </div>
    );
}