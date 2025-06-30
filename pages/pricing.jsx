// @pages/pricing.jsx
// Created: 2025-06-28T03:04 EDT
// Summary: Displays tiered pricing for BrewLotto with upgrade actions + voice commentary

import Head from "next/head";
import { useEffect } from "react";
import { useUserTier } from "@/hooks/useUserTier";
import { useBrewBotContext } from "@/components/context/BrewBotContext";
import PricingTierCard from "@/components/ui/PricingTierCard"; // You’ll build this next

export default function PricingPage() {
    const { currentTier } = useUserTier(); // Supabase-powered
    const { prompt } = useBrewBotContext();

    const handleUpgrade = (tier) => {
        const tierPitches = {
            brew: "Upgrading to Brew Tier unlocks PulsePrime™, commentary, and deep strategy tracking.",
            master: "Master Tier grants you full access to SequenceX™, entropy scores, and cross-game insights.",
        };

        if (tier !== currentTier && tierPitches[tier]) {
            prompt(tierPitches[tier]);
        }

        // TODO: Implement upgrade logic (Stripe, modal, etc.)
        console.log("Upgrade to:", tier);
    };

    useEffect(() => {
        if (currentTier === "free") {
            prompt("Explore higher tiers to unlock smarter predictions with Brew.");
        }
    }, [currentTier, prompt]);

    return (
        <>
            <Head>
                <title>Pricing | BrewLotto</title>
            </Head>

            <main className="bg-black text-white min-h-screen py-12 px-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-3xl font-bold text-yellow-400 text-center">
                        Choose your tier. Predict smarter.
                    </h1>
                    <p className="text-center text-neutral-400 max-w-xl mx-auto">
                        Brew’s different tiers unlock different types of prediction power — from casual picks to strategist-grade heat.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                        <PricingTierCard
                            tierId="free"
                            title="Free"
                            description="Try prediction basics without commentary or insights."
                            features={["Basic Pick Support", "No Match Tracking", "No Voice Commentary"]}
                            locked={false}
                            current={currentTier === "free"}
                            onUpgrade={() => handleUpgrade("brew")}
                        />

                        <PricingTierCard
                            tierId="brew"
                            title="Brew Tier"
                            description="Commentary, predictions, PulsePrime™ and more."
                            features={["PulsePrime™ Strategy", "BrewBot Voice", "Pick Tracker"]}
                            locked={currentTier !== "brew" && currentTier !== "master"}
                            current={currentTier === "brew"}
                            onUpgrade={() => handleUpgrade("brew")}
                        />

                        <PricingTierCard
                            tierId="master"
                            title="Master Tier"
                            description="Unlock Brew’s full brain. SequenceX™, entropy, and analytics."
                            features={["SequenceX™ Engine", "Draw Entropy", "Full Commentary & History"]}
                            locked={currentTier !== "master"}
                            current={currentTier === "master"}
                            onUpgrade={() => handleUpgrade("master")}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}