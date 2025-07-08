// @pages/predictor/[game].jsx
// Created: 2025-06-28T03:04 EDT
// Summary: Game-specific predictor page with strategy selection and voice commentary

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import BrewAvatar from "@/components/ui/BrewAvatar";
import BrewCommentaryEngine from "@/components/ui/BrewCommentaryEngine";
import useBrewVoice from "@/hooks/useBrewVoice";
import { STRATEGY_EXPLAINERS } from "@/lib/explainers/strategyExplainers";
import DrawEntropyCard from "@/components/stats/DrawEntropyCard";
import MatchAccuracyTimeline from "@/components/stats/MatchAccuracyTimeline";
import PredictionResultPanel from "@/components/predict/PredictionResultPanel";
import { useUserTier } from "@/hooks/useUserTier";
import { hasTierAccess } from "@/utils/tier-utils";
import { calculateEntropy } from "@/utils/entropy";

const GAME_CONFIG = {
    pick3: { title: "Pick 3", digits: 3, strategies: ["poisson++", "momentum"] },
    pick4: { title: "Pick 4", digits: 4, strategies: ["poisson++", "markov++"] },
    pick5: { title: "Pick 5", digits: 5, strategies: ["momentum", "hotCold"] },
    mega: { title: "Mega Millions", digits: 5, strategies: ["poisson++", "random"] },
    powerball: { title: "Powerball", digits: 5, strategies: ["markov++", "momentum"] },
};

export default function PredictorPage() {
    const { query } = useRouter();
    const [status, setStatus] = useState("idle");
    const [strategy, setStrategy] = useState("poisson++");
    const [game, setGame] = useState(null);
    const [drawHistory, setDrawHistory] = useState([]);
    const [matchHistory, setMatchHistory] = useState([]);
    const [predictedNumbers, setPredictedNumbers] = useState([]);

    const { speak, muted } = useBrewVoice({ tone: "coach" });
    const { currentTier } = useUserTier();

    useEffect(() => {
        if (query.game && GAME_CONFIG[query.game]) {
            const conf = GAME_CONFIG[query.game];
            setGame(conf);
            speak(`Loading predictions for ${conf.title}`);
        }
    }, [query.game]);

    const runPrediction = (selectedStrategy) => {
        setStrategy(selectedStrategy);
        setStatus("loading");

        const label = STRATEGY_EXPLAINERS[selectedStrategy]?.label || selectedStrategy;
        speak(`Running ${label}...`);

        const mockDraws = [
            [1, 2, 3, 4, 5],
            [3, 5, 7, 9, 11],
            [2, 4, 6, 8, 10],
            [5, 6, 7, 8, 9],
            [1, 3, 5, 7, 9],
        ];
        const mockPredictions = [3, 5, 7, 8, 10];

        const matchData = mockDraws.map((draw) => {
            const matched = draw.filter((n) => mockPredictions.includes(n)).length;
            return { matched, total: draw.length };
        });

        setTimeout(() => {
            setStatus("success");
            setDrawHistory(mockDraws);
            setMatchHistory(matchData);
            setPredictedNumbers(mockPredictions);
            speak("Prediction complete. Let’s see the hot numbers.");
        }, 2000);
    };

    if (!game) {
        return (
            <div className="text-center text-yellow-400 mt-20">
                <p>🎲 Loading game config...</p>
            </div>
        );
    }

    const entropyScore = calculateEntropy(drawHistory);
    const latestMatch = matchHistory[matchHistory.length - 1] || { matched: 0, total: game.digits };

    return (
        <>
            <Head>
                <title>{game.title} Predictions | BrewLotto</title>
            </Head>
            <div className="min-h-screen bg-black text-white p-6 space-y-4">
                <h1 className="text-2xl font-bold text-yellow-400">
                    {game.title} Predictor
                </h1>

                <div className="flex items-center space-x-4">
                    <BrewAvatar status={status} size={60} />
                    <BrewCommentaryEngine
                        status={status}
                        strategy={strategy}
                        mode="strategist"
                        speak={!muted}
                        voiceHook={speak}
                    />
                </div>

                <div className="mt-4 flex gap-4 flex-wrap">
                    {game.strategies.map((s) => {
                        const label = STRATEGY_EXPLAINERS[s]?.label || s;
                        return (
                            <button
                                key={s}
                                onClick={() => runPrediction(s)}
                                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded"
                            >
                                Run {label}
                            </button>
                        );
                    })}
                </div>

                {status === "success" && (
                    <div className="mt-6 space-y-4">
                        <PredictionResultPanel
                            numbers={predictedNumbers}
                            matched={latestMatch.matched}
                            total={latestMatch.total}
                            strategy={strategy}
                        />
                        <DrawEntropyCard entropy={entropyScore} />
                        <MatchAccuracyTimeline history={matchHistory} />
                    </div>
                )}
            </div>
        </>
    );
}