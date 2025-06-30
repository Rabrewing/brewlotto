// =============================================
// 📄 PredictionInsights.jsx
// Updated: 2025-06-28T02:56 EDT
// Summary: Adds Brew commentary + pattern analysis based on recent draws and predictions
// =============================================

import { useEffect, useState } from "react";
import { getLastDraw } from "@/lib/drawDataUtils";
import { brewAnalyzePick } from "@/lib/brewCommentary";

export default function PredictionInsights({ prediction, game }) {
    const [lastDraw, setLastDraw] = useState(null);
    const [comment, setComment] = useState("");

    useEffect(() => {
        if (!prediction?.length || !game) return;

        async function analyze() {
            const draw = await getLastDraw(game);
            setLastDraw(draw);

            const analysis = await brewAnalyzePick({
                prediction,
                lastDraw: draw,
            });

            setComment(analysis);
        }

        analyze();
    }, [prediction, game]);

    if (!comment) return null;

    return (
        <div className="mt-4 bg-neutral-900 text-neutral-300 p-3 rounded text-sm italic">
            <p>
                🎙️ <span className="text-yellow-400 font-semibold">Brew:</span>{" "}
                {comment}
            </p>
        </div>
    );
}