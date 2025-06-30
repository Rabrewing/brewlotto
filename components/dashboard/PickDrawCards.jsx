// @component: PickDrawCards
// @description: Displays the latest day and evening draw results in a card format.
// @timestamp: 2025-06-25T21:12 EDT
// components/dashboard/PickDrawCards.jsx

export default function PickDrawCards({ latest = {} }) {
    const types = ['day', 'evening'];

    return (
        <div className="w-full min-h-[120px] flex flex-col md:flex-row justify-center items-stretch gap-4 mt-6 transition-all duration-300">
            {types.map((type) => (
                <div
                    key={type}
                    className="flex-1 min-w-[140px] bg-[#232323] rounded-xl p-4 shadow border-l-4 border-[#FFD700] transition-all duration-300"
                >
                    <div className="text-xs text-gray-400 mb-1">
                        {type === 'day' ? 'Day Draw' : 'Evening Draw'}
                    </div>
                    <div className="text-lg text-[#FFD700] font-extrabold mb-1">
                        {latest?.[type]?.result || '— — —'}
                    </div>
                    <div className="text-xs text-gray-500">
                        {latest?.[type]?.date || 'No date'}
                    </div>
                </div>
            ))}
        </div>
    );
}