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

            const metadata = session?.user?.user_metadata || {};
            const user = session?.user;

            if (!user || !mounted) {
                setCurrentTier("free");
                setIsTrial(Boolean(metadata.isTrial));
                setTrialEndsAt(metadata.trialEndsAt || null);
                return;
            }

            const { data: entitlements, error } = await supabase
                .from("user_entitlements")
                .select("tier_code, effective_to")
                .eq("user_id", user.id)
                .maybeSingle();

            if (!mounted) return;

            setCurrentTier(!error && entitlements?.tier_code ? entitlements.tier_code : "free");

            setIsTrial(Boolean(metadata.isTrial));
            setTrialEndsAt(metadata.trialEndsAt || entitlements?.effective_to || null);
        };

        fetchSession();
        return () => {
            mounted = false;
        };
    }, []);

    return {
        currentTier,
        tier: currentTier,
        isTrial,
        trialEndsAt,
    };
}
