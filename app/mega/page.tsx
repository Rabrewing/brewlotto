'use client';

import { useState, useEffect } from "react";
import { GameStrategySelector } from "@/components"; // Adjusted path
import { getLatestDrawResults } from "@/utils/getLatestDrawResults";
import { supabase } from "@/lib/supabase/browserClient"; // Adjusted path

interface PickData {
    numbers: string[];
    megaBall: string;
    strategy: string;
    explanation: string;
}

interface LatestDraw {
    date: string;
    numbers: string;
    bonusBall: string;
    multiplier: string;
}

interface LatestMegaDraws {
    lastDraw?: LatestDraw;
    nextDraw?: { date: string };
}

interface LatestMegaResponse extends LatestMegaDraws {}

export default function Mega() {
    const [pick, setPick] = useState<PickData | null>(null);
    const [loading, setLoading] = useState(false);
    const [strategy, setStrategy] = useState("momentum");
    const [latest, setLatest] = useState<LatestMegaDraws | null>(null);
    const [latestLoading, setLatestLoading] = useState(true);

    useEffect(() => {
        setLatestLoading(true);
        getLatestDrawResults("mega")
            .then((data: LatestMegaResponse) => setLatest(data))
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
            alert("Please log in to run predictions.");
            setLoading(false);
            return;
        }

        const res = await fetch(`/api/predict/mega?strategy=${selectedStrategy}`);
        if (!res.ok) {
            console.error("Prediction API failed:", res.statusText);
            setLoading(false);
            return;
        }
        const data: PickData = await res.json();
        setPick(data);
        setLoading(false);
    };

    const handleSmartPick = (gameType: string, selectedStrategy: string) => {
        if (gameType !== "mega") return;
        fetchPick(selectedStrategy);
    };

    return (
        <div className="flex flex-col min-h-screen items-center bg-[#181818] text-white p-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#FFD700] mb-2 mt-4">
                Mega Millions Smart Picks
            </h1>
            <p className="mb-4 text-gray-300">
                Get BrewLotto’s Mega Millions picks using{" "}
                <span className="font-bold text-[#FFD700]">{pick?.strategy || strategy}</span> strategy.
            </p>

            <GameStrategySelector gameType="mega" onRun={handleSmartPick} />

            <div className="mb-6 text-center mt-6">
                <div className="text-[#FFD700] font-semibold text-base">Mega Millions Draw Schedule</div>
                <div className="text-gray-300 text-sm">
                    Every <span className="font-bold text-white">Tuesday & Friday</span> at{" "}
                    <span className="font-bold text-white">11:00 p.m. ET</span>
                </div>

                <div className="w-full max-w-md mb-6 mt-4">
                    <div className="text-[#FFD700] font-semibold text-base text-center mb-2">Last Winning Numbers</div>
                    {latestLoading ? (
                        <div className="text-gray-400 text-center">Loading latest results…</div>
                    ) : (
                        <div className="bg-[#232323] rounded-xl p-4 shadow border-l-4 border-[#FFD700] text-center">
                            <div className="text-xs text-gray-400 mb-1">{latest?.lastDraw?.date || "-"}</div>
                            <div className="text-lg text-[#FFD700] font-extrabold mb-1">
                                {latest?.lastDraw?.numbers || "-- -- -- -- --"}
                            </div>
                            <div className="text-base text-[#FFD700] font-bold mb-1">
                                Mega Ball: {latest?.lastDraw?.bonusBall || "--"}
                            </div>
                            <div className="text-sm text-gray-400">
                                Megaplier: {latest?.lastDraw?.multiplier || "-"}
                            </div>
                        </div>
                    )}
                    {!latestLoading && (
                        <div className="text-gray-400 text-center text-sm mt-2">
                            Next draw:{" "}
                            <span className="text-[#FFD700] font-semibold">{latest?.nextDraw?.date || "-"}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-[#232323] rounded-2xl p-6 min-w-[320px] flex flex-col items-center shadow-xl">
                {loading && <div className="text-[#FFD700] animate-pulse">Calculating...</div>}
                {!loading && pick && (
                    <>
                        <div className="text-xl mb-2">
                            <span className="font-bold text-[#FFD700]">Your Pick:</span>{" "}
                            <span className="tracking-wider text-2xl">{pick.numbers?.join(" ")}</span>
                            <span className="ml-4 text-[#FFD700] font-bold">MB: {pick.megaBall}</span>
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

            <button
                className="mt-8 px-5 py-2 rounded-xl font-bold bg-[#FFD700] text-[#181818] hover:bg-white hover:text-[#FFD700] transition-transform hover:scale-[1.03]"
                onClick={() => fetchPick(strategy)}
            >
                Try Again
            </button>
        </div>
    );
}
