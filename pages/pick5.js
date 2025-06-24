// pages/pick5.js
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { getGameSettings } from '@/utils/getGameSettings';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fetchLatestPick5Results() {
    return {
        day: { date: "2025-06-22", result: "1 8 6 9 3" },
        evening: { date: "2025-06-21", result: "7 3 5 1 0" },
    };
}

async function logPlay({ user_id, strategy, numbers, draw_type, add_on, amount_spent }) {
    await fetch("/api/play/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id,
            game: "Pick 5",
            draw_type,
            strategy,
            numbers: numbers.join(" "),
            add_on,
            amount_spent,
            outcome: "pending",
            prize: 0,
        }),
    });
}

export default function Pick5() {
    const [pick, setPick] = useState(null);
    const [loading, setLoading] = useState(false);
    const [strategy, setStrategy] = useState("momentum");
    const [latest, setLatest] = useState(null);
    const [latestLoading, setLatestLoading] = useState(true);

    useEffect(() => {
        fetchLatestPick5Results().then((data) => {
            setLatest(data);
            setLatestLoading(false);
        });
    }, []);

    const fetchPick = async (selectedStrategy = strategy) => {
        setLoading(true);
        setPick(null);
        setStrategy(selectedStrategy);

        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user?.id) {
            console.error("User not authenticated");
            setLoading(false);
            return;
        }

        const user_id = user.id;

        const res = await fetch(`/api/predict/pick5?strategy=${selectedStrategy}`);
        const data = await res.json();

        const settings = await getGameSettings("Pick 5");
        const ticketCost = settings.ticket_cost ?? 1;
        const addOn = settings.add_on ?? null;

        await logPlay({
            user_id,
            strategy: selectedStrategy,
            numbers: data.numbers,
            draw_type: "Day",
            add_on: addOn,
            amount_spent: ticketCost
        });

        setPick(data);
        setLoading(false);
    };

    return (
        <div className="flex flex-col min-h-screen items-center bg-[#181818] text-white p-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#FFD700] mb-2 mt-4">
                Pick 5 Smart Picks
            </h1>
            <p className="mb-4 text-gray-300">
                Get BrewLotto’s predictions using <span className="font-bold text-[#FFD700]">{strategy}</span> strategy.
            </p>

            <div className="w-full max-w-md mb-6">
                <div className="text-[#FFD700] font-semibold text-base text-center mb-2">
                    Latest Winning Numbers
                </div>
                {latestLoading ? (
                    <div className="text-gray-400 text-center">Loading latest results…</div>
                ) : (
                    <div className="flex flex-col md:flex-row justify-center gap-4">
                        {["day", "evening"].map((type) => (
                            <div key={type} className="bg-[#232323] rounded-xl flex-1 p-4 shadow border-l-4 border-[#FFD700]">
                                <div className="text-xs text-gray-400 mb-1">{type === "day" ? "Day Draw" : "Evening Draw"}</div>
                                <div className="text-lg text-[#FFD700] font-extrabold mb-1">{latest?.[type]?.result || '-- -- -- -- --'}</div>
                                <div className="text-xs text-gray-500">{latest?.[type]?.date || '-'}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mb-6 text-center">
                <div className="text-[#FFD700] font-semibold text-base">
                    NC Pick 5 Draw Times
                </div>
                <div className="text-gray-300 text-sm">
                    Day: <span className="font-bold text-white">3:00 p.m.</span><br />
                    Evening: <span className="font-bold text-white">11:22 p.m.</span>
                </div>
            </div>

            <div className="flex gap-2 mb-8 flex-wrap justify-center">
                {["momentum", "filtered", "random"].map((s) => (
                    <button
                        key={s}
                        className={`px-4 py-2 rounded-xl font-bold ${strategy === s
                                ? "bg-[#FFD700] text-[#181818]"
                                : "bg-[#232323] text-[#FFD700] hover:bg-[#FFD700] hover:text-[#181818]"
                            }`}
                        onClick={() => fetchPick(s)}
                    >
                        {s === "momentum" ? "Momentum (Hot Numbers)" : s === "filtered" ? "Filtered Random" : "Random"}
                    </button>
                ))}
            </div>

            <div className="bg-[#232323] rounded-2xl p-6 min-w-[320px] flex flex-col items-center shadow-xl">
                {loading && <div className="text-[#FFD700] animate-pulse">Calculating...</div>}
                {!loading && pick && (
                    <>
                        <div className="text-xl mb-2">
                            <span className="font-bold text-[#FFD700]">Your Pick:</span>{" "}
                            <span className="tracking-wider text-2xl">{pick.numbers?.join(" ")}</span>
                        </div>
                        <div className="text-gray-400 text-sm mb-2">
                            Strategy: <span className="capitalize">{pick.strategy}</span>
                        </div>
                        <div className="text-gray-500 text-xs italic">{pick.explanation}</div>
                    </>
                )}
                {!loading && !pick && <div className="text-gray-400">Click a strategy to get your pick!</div>}
            </div>

            <button
                className="mt-8 px-5 py-2 rounded-xl font-bold bg-[#FFD700] text-[#181818] hover:bg-white hover:text-[#FFD700]"
                onClick={() => fetchPick(strategy)}
            >
                Try Again
            </button>
        </div>
    );
}