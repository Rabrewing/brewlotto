// components/dashboard/GameStrategySelector.jsx
// time-stamp: 2025-06-25T21:12 EDT
// description: This component provides buttons to select different game strategies for running predictions.

const strategies = ['poisson', 'markov', 'momentum'];

export default function GameStrategySelector({ gameType, onRun }) {
    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {strategies.map(strategy => (
                <button
                    key={strategy}
                    onClick={() => onRun(gameType, strategy)}
                    className="bg-[#FFD700] text-black px-3 py-1 rounded hover:bg-white transition"
                >
                    Run {strategy.charAt(0).toUpperCase() + strategy.slice(1)}
                </button>
            ))}
        </div>
    );
}