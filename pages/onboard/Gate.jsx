// =============================================
// 📄 /pages/onboard/Gate.jsx
// Updated: 2025-06-27T05:45 EDT
// Summary: Age gate with geo-aware voice + Supabase geo logging
// =============================================

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useBrewBot } from "@/hooks/useBrewBot";
import { getUserRegion } from "@/lib/geoCheck";
import { logGeoAudit } from "@/lib/logGeoAudit";
import { supabase } from "@/lib/supabaseClient";

export default function AgeGate() {
    const router = useRouter();
    const { speak } = useBrewBot();
    const [region, setRegion] = useState(null);

    useEffect(() => {
        const ageCheck = localStorage.getItem("brew_18_confirmed");
        if (ageCheck === "yes") {
            router.replace("/");
        } else {
            speak("We just need to confirm you're 18 or older before we brew.");

            getUserRegion().then(async (geo) => {
                if (!geo) return;

                const user = await supabase.auth.getUser();
                await logGeoAudit({
                    user_id: user?.data?.user?.id || null,
                    region: geo.region,
                    country: geo.country,
                    city: geo.city,
                    ip_address: geo.ip_address, // Optionally mask here
                });

                if (geo?.region === "North Carolina") {
                    setRegion("NC");
                    speak("Hey there, North Carolina player — you must be 18+ to play responsibly.");
                }
            });
        }
    }, []);

    const handleConfirm = () => {
        localStorage.setItem("brew_18_confirmed", "yes");
        router.push("/");
    };

    const handleDecline = () => {
        speak("Understood. Brew is only for adults. See you when you're ready.");
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center px-6">
            <h1 className="text-2xl font-bold text-yellow-400 mb-4">🎯 Age Verification</h1>
            <p className="max-w-md mb-6 text-sm text-neutral-300">
                BrewLotto AI is intended for users 18 years or older. Please confirm your age to proceed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleConfirm}
                    className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2 rounded font-semibold"
                >
                    ✅ Yes, I am 18 or older
                </button>
                <button
                    onClick={handleDecline}
                    className="bg-neutral-800 border border-yellow-400 text-yellow-300 px-6 py-2 rounded"
                >
                    ❌ No, take me back
                </button>
            </div>

            <p className="text-xs text-neutral-500 mt-6">
                Required under {region === "NC" ? "North Carolina law" : "our responsible gaming policy"}.
            </p>
        </main>
    );
}