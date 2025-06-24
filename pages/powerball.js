import { useState, useEffect } from "react";

// ---- Helper to fetch latest results (replace with real DB call) ----
async function fetchLatestPowerballResults() {
    // TODO: Replace with Supabase or API call
    return {
        lastDraw: {
            date: "2025-06-22",
            numbers: "10 16 23 29 63",
            powerBall: "17",
            powerPlay: "2x"
        },
        nextDraw: {
            date: "2025-06-26"
        }
    };
}

export default function Powerball() {
    const [pick, setPick] = useState(null);
    const [loading, setLoading] = useState(false);
    const [strategy, setStrategy] = useState("momentum");
    const [latest, setLatest] = useState(null);
    const [latestLoading, setLatestLoading] = useState(true);

    useEffect(() => {
        setLatestLoading(true);
        fetchLatestPowerballResults().then((data) => {
            setLatest(data);
            setLatestLoading(false);
        });
    }, []);

    const fetchPick = async (selectedStrategy = strategy) => {
        setLoading(true);
        setPick(null);
        setStrategy(selectedStrategy);

        const res = await fetch(`/api/predict/powerball?strategy=${selectedStrategy}`);
        const data = await res.json();
        setPick(data);
        setLoading(false);
    };

    return (
        <div className="flex flex-col min-h-screen items-center bg-[#181818] text-white p-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#FFD700] mb-2 mt-4">
                Powerball Smart Picks
            </h1>
            <p className="mb-4 text-gray-300">
                Get BrewLotto’s Powerball picks using <span className="font-bold text-[#FFD700]">{strategy}</span> strategy.
            </p>

            {/* --- Last Draw Section --- */}
            <div className="w-full max-w-md mb-6">
                <div className="text-[#FFD700] font-semibold text-base text-center mb-2">
                    Last Winning Numbers
                </div>
                {latestLoading ? (
                    <div className="text-gray-400 text-center">Loading latest results…</div>
                ) : (
                    <div className="bg-[#232323] rounded-xl p-4 shadow border-l-4 border-[#FFD700] text-center">
                        <div className="text-xs text-gray-400 mb-1">{latest?.lastDraw?.date || '-'}</div>
                        <div className="text-lg text-[#FFD700] font-extrabold mb-1">{latest?.lastDraw?.numbers || '-- -- -- -- --'}</div>
                        <div className="text-base text-[#FFD700] font-bold mb-1">Powerball: {latest?.lastDraw?.powerBall || '--'}</div>
                        <div className="text-sm text-gray-400">Power Play: {latest?.lastDraw?.powerPlay || '-'}</div>
                    </div>
                )}
                {!latestLoading && (
                    <div className="text-gray-400 text-center text-sm mt-2">
                        Next draw: <span className="text-[#FFD700] font-semibold">{latest?.nextDraw?.date || '-'}</span>
                    </div>
                )}
            </div>
            {/* ------------------------ */}

            <div className="flex gap-2 mb-8 flex-wrap justify-center">
                <button
                    className={`px-4 py-2 rounded-xl font-bold ${strategy === "momentum" ? "bg-[#FFD700] text-[#181818]" : "bg-[#232323] text-[#FFD700] hover:bg-[#FFD700] hover:text-[#181818]"}`}
                    onClick={() => fetchPick("momentum")}
                >
                    Momentum (Hot Numbers)
                </button>
                <button
                    className={`px-4 py-2 rounded-xl font-bold ${strategy === "filtered" ? "bg-[#FFD700] text-[#181818]" : "bg-[#232323] text-[#FFD700] hover:bg-[#FFD700] hover:text-[#181818]"}`}
                    onClick={() => fetchPick("filtered")}
                >
                    Filtered Random
                </button>
                <button
                    className={`px-4 py-2 rounded-xl font-bold ${strategy === "random" ? "bg-[#FFD700] text-[#181818]" : "bg-[#232323] text-[#FFD700] hover:bg-[#FFD700] hover:text-[#181818]"}`}
                    onClick={() => fetchPick("random")}
                >
                    Random
                </button>
            </div>
            <div className="bg-[#232323] rounded-2xl p-6 min-w-[320px] flex flex-col items-center shadow-xl">
                {loading && <div className="text-[#FFD700] animate-pulse">Calculating...</div>}
                {!loading && pick && (
                    <>
                        <div className="text-xl mb-2">
                            <span className="font-bold text-[#FFD700]">Your Pick:</span>{" "}
                            <span className="tracking-wider text-2xl">{pick.numbers?.join(" ")}</span>
                            <span className="ml-4 text-[#FFD700] font-bold">PB: {pick.powerBall}</span>
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
