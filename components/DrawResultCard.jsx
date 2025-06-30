// @component: DrawResultCard
// Updated: 2025-06-28T02:59 EDT
// Displays a single draw result card with optional bonus, extra tags, and date info

export default function DrawResultCard({
    label = "Draw",
    result = "— — —",
    date = "No date",
    bonus = null,
    extra = null,
}) {
    return (
        <div className="w-full md:w-1/2 min-w-[140px] bg-[#232323] rounded-xl p-4 shadow border-l-4 border-[#FFD700] text-center transition-all duration-300">
            <div className="text-xs text-gray-400 mb-1">{label}</div>

            <div className="text-lg text-[#FFD700] font-extrabold mb-1">{result}</div>

            {bonus && (
                <div className="text-base text-[#FFD700] font-bold mb-1">{bonus}</div>
            )}

            {extra && (
                <div className="text-sm text-gray-400">{extra}</div>
            )}

            <div className="text-xs text-gray-500 mt-1">{date}</div>
        </div>
    );
}