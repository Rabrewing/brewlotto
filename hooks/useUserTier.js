// @hooks/useUserTier.js
// Summary: Retrieves current user tier and trial info using Supabase SSR client

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/browserClient";

export function useUserTier() {
    const [currentTier, setCurrentTier] = useState("free");
    const [isTrial, setIsTrial] = useState(false);
    const [trialEndsAt, setTrialEndsAt] = useState(null);

    useEffect(() => {
        let mounted = true;

        const fetchSession = async () => {
            const {
                data: { session }
            } = await supabase.auth.getSession();

            const metadata = session?.user?.user_metadata;
            if (!metadata || !mounted) return;

            setCurrentTier(metadata.tier || "free");
            setIsTrial(metadata.isTrial || false);
            setTrialEndsAt(metadata.trialEndsAt || null);
        };

        fetchSession();
        return () => {
            mounted = false;
        };
    }, []);

    return { currentTier, isTrial, trialEndsAt };
}