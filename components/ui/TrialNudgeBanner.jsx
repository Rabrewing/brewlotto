// @components/ui/TrialNudgeBanner.jsx
// Summary: Shows trial status banner w/ voice prompt & upgrade CTA

import { useEffect } from "react";
import { useUserTier } from "@/hooks/useUserTier";
import { useBrewBotContext } from "@/components/context/BrewBotContext";
import { formatDistanceToNowStrict } from "date-fns";

export default function TrialNudgeBanner() {
    const { isTrial, trialEndsAt } = useUserTier();
    const { prompt } = useBrewBotContext();

    useEffect(() => {
        if (isTrial && trialEndsAt) {
            const daysLeft = formatDistanceToNowStrict(new Date(trialEndsAt));
            prompt(`Trial mode active. ${daysLeft} remaining. Consider unlocking full prediction access.`);
        }
    }, [isTrial, trialEndsAt, prompt]);

    if (!isTrial || !trialEndsAt) return null;

    const daysLeft = formatDistanceToNowStrict(new Date(trialEndsAt));

    return (
        <div className="bg-yellow-800 text-yellow-100 text-sm p-3 text-center">
            🎯 Trial mode active — {daysLeft} left.{" "}
            <span className="underline cursor-pointer ml-1 hover:text-white" onClick={() => prompt("Ready to level up? Unlock Brew’s full brain.")}>
                Upgrade now
            </span>
        </div>
    );
}