'use client';

import { useState, useEffect } from "react";
import { getGameSettings } from "@/lib/config/getGameSettings"; // Adjusted path
import { GameStrategySelector } from "@/components"; // Adjusted path
import { getLatestDrawResults } from "@/utils/getLatestDrawResults";
import { supabase } from "@/lib/supabase/browserClient"; // Adjusted path

interface LogPlayProps {
    user_id: string;
    strategy: string;
    numbers: string[];
    draw_type: string;
    add_on: string | null;
    amount_spent: number;
}

async function logPlay({ user_id, strategy, numbers, draw_type, add_on, amount_spent }: LogPlayProps) {
    await fetch("/api/play/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id,
            game: "Pick 3",
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

interface PickData {
    numbers: string[];
    strategy: string;
    explanation: string;
}

interface LatestDraws {
    day?: { result: string; date: string };
    evening?: { result: string; date: string };
}

interface LatestPickDrawsResponse {
    draws?: LatestDraws;
}

export default function Pick3() {
    const [pick, setPick] = useState<PickData | null>(null);
    const [loading, setLoading] = useState(false);
    const [strategy, setStrategy] = useState("momentum");
    const [latest, setLatest] = useState<LatestDraws | null>(null);
    const [latestLoading, setLatestLoading] = useState(true);

    useEffect(() => {
        setLatestLoading(true);
        getLatestDrawResults("pick3")
            .then((data: LatestPickDrawsResponse) => {
                console.log("Latest Draws:", data);
                setLatest(data.draws || {});
            })
            .finally(() => setLatestLoading(false));
    }, []);

    const fetchPick = async (selectedStrategy = strategy) => {
        setLoading(true);
        setPick(null);
        setStrategy(selectedStrategy);

        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error || !user?.id) {
            alert("Please log in to run predictions and save your picks.");
            setLoading(false);
            return;
        }

        const res = await fetch(`/api/predict/pick3?strategy=${selectedStrategy}`);
        if (!res.ok) {
            console.error("Prediction API failed:", res.statusText);
            setLoading(false);
            return;
        }

        const data: PickData = await res.json();
        console.log("Prediction API Response:", data);
        console.log("Pick numbers:", data.numbers);

        const settings = await getGameSettings("Pick 3");
        const ticketCost = settings.ticket_cost ?? 1;
        const addOn = settings.add_on ?? null;

        await logPlay({
            user_id: user.id,
            strategy: selectedStrategy,
            numbers: data.numbers,
            draw_type: "Day",
            add_on: addOn,
            amount_spent: ticketCost,
        });

        setPick(data);
        setLoading(false);
    };

    const handleSmartPick = (gameType: string, selectedStrategy: string) => {
        if (gameType !== "pick3") return;
        fetchPick(selectedStrategy);
    };

    return (
        <div className="flex flex-col min-h-screen items-center bg-[#181818] text-white p-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#FFD700] mb-2 mt-4">
                Pick 3 Smart Picks
            </h1>

            <p className="mb-4 text-gray-300">
                Get BrewLotto’s top predictions using{" "}
                <span className="font-bold text-[#FFD700]">{strategy}</span> strategy.
            </p>

            <GameStrategySelector gameType="pick3" onRun={handleSmartPick} />

            <div className="w-full max-w-md mb-6 mt-6">
                <div className="text-[#FFD700] font-semibold text-base text-center mb-2">
                    Latest Winning Numbers
                </div>

                <section className="w-full">
                    {latestLoading ? (
                        <div className="text-gray-400 text-center mt-6">Loading latest results…</div>
                    ) : (
                        <div className="w-full max-w-2xl mx-auto min-h-[120px] flex flex-col md:flex-row justify-center items-stretch gap-4 mt-6 transition-all duration-300">
                            {["day", "evening"].map((type) => (
                                <div
                                    key={type}
                                    className="w-full md:w-1/2 min-w-[140px] bg-[#232323] rounded-xl p-4 shadow border-l-4 border-[#FFD700] transition-all duration-300"
                                >
                                    <div className="text-xs text-gray-400 mb-1">
                                        {type === "day" ? "Day Draw" : "Evening Draw"}
                                    </div>
                                    <div className="text-lg text-[#FFD700] font-extrabold mb-1">
                                        {latest?.[type as keyof LatestDraws]?.result || "— — —"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {latest?.[type as keyof LatestDraws]?.date || "No date"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <div className="mb-6 text-center">
                    <div className="text-[#FFD700] font-semibold text-base">NC Pick 3 Draw Times</div>
                    <div className="text-gray-300 text-sm">
                        Daytime: <span className="font-bold text-white">3:00 p.m.</span>
                        <br />
                        Evening: <span className="font-bold text-white">11:22 p.m.</span>
                    </div>
                </div>

                <div className="bg-[#232323] rounded-2xl p-6 min-w-[280px] flex flex-col items-center shadow-xl">
                    {loading && <div className="text-[#FFD700] animate-pulse">Calculating...</div>}

                    {!loading && pick && (
                        <>
                            <div className="text-xl mb-2">
                                <span className="font-bold text-[#FFD700]">Your Pick:</span>{" "}
                                <span className="tracking-wider text-2xl">
                                    {Array.isArray(pick.numbers) ? pick.numbers.join(" ") : "— — —"}
                                </span>
                            </div>
                            <div className="text-gray-400 text-sm mb-2">
                                Strategy: <span className="capitalize">{pick.strategy}</span>
                            </div>
                            <div className="text-gray-500 text-xs italic">{pick.explanation}</div>
                        </>
                    )}

                    {!loading && !pick && (
                        <div className="text-gray-400">Click a strategy to get your pick!</div>
                    )}
                </div>

                {pick && !loading && (
                    <button
                        className="mt-8 px-5 py-2 rounded-xl font-bold bg-[#FFD700] text-[#181818] hover:bg-white hover:text-[#FFD700] transition-transform hover:scale-[1.03]"
                        onClick={() => fetchPick(strategy)}
                    >
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
}
