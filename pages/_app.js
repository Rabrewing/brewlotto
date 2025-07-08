// Project: BrewLotto
// =============================================
// 📁 /pages/_app.js
// Updated: 2025-06-28
// Summary: Global entry — now linked to Brew 2 clean global styles.
// =============================================

import "@/styles/base/brew.css"; // ✅ New Tailwind-first stylesheet
import "@/auth/authListener";

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { BrewBotProvider } from "@/components/context/BrewBotContext";
import { useBrewBotContext } from "@/components/context/BrewBotContext";
import { UpgradeFlowProvider } from "@/hooks/useUpgradeFlow";
import BrewLottoBotDock from "@/components/ui/BrewLottoBotDock";
import BrewLottoBotModal from "@/components/ui/BrewLottoBotModal";
import TrialNudgeBanner from "@/components/ui/TrialNudgeBanner";
import { useInjectBrewVoice } from "@/hooks/useBrewBot";

function BrewClientInject() {
    const { open, closeBot } = useBrewBotContext();
    useInjectBrewVoice({ tone: "coach" });

    return <BrewLottoBotModal open={open} onClose={closeBot} />;
}

export default function App({ Component, pageProps }) {
    return (
        <BrewBotProvider>
            <UpgradeFlowProvider>
                <BrewClientInject />
                <TrialNudgeBanner />
                <BrewLottoBotDock />

                <main className="min-h-screen bg-black text-white">
                    <Component {...pageProps} />
                </main>

                <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            </UpgradeFlowProvider>
        </BrewBotProvider>
    );
}