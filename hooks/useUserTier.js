// @hooks/useUserTier.js
// Summary: Retrieves current user tier and trial info using Supabase SSR client

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/browserClient";

function normalizeTier(value) {
    const tier = String(value || "").toLowerCase();
    if (tier === "starter" || tier === "pro" || tier === "master" || tier === "free") {
        return tier;
    }

    return null;
}

function tierFromProductCode(code) {
    const productCode = String(code || "").toLowerCase();
    if (productCode.includes("master")) return "master";
    if (productCode.includes("pro")) return "pro";
    if (productCode.includes("starter")) return "starter";
    if (productCode.includes("free")) return "free";
    return null;
}

function getEffectiveTier(subscription) {
    if (!subscription) {
        return null;
    }

    const status = String(subscription.status || "").toLowerCase();
    if (status === "canceled" || status === "incomplete_expired" || status === "unpaid") {
        return "free";
    }

    return normalizeTier(subscription.metadata?.tier_code) || tierFromProductCode(subscription.subscription_products?.code) || null;
}

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

            const activeSubscriptionQuery = supabase
                .from("user_subscriptions")
                .select("status, metadata, subscription_products!inner(code)")
                .eq("user_id", user.id)
                .in("status", ["active", "trialing", "past_due"])
                .order("updated_at", { ascending: false })
                .limit(1)
                .maybeSingle();

            const latestSubscriptionQuery = supabase
                .from("user_subscriptions")
                .select("status, metadata, subscription_products!inner(code)")
                .eq("user_id", user.id)
                .order("updated_at", { ascending: false })
                .limit(1)
                .maybeSingle();

            const [
                { data: activeSubscription, error: activeSubscriptionError },
                { data: latestSubscription, error: latestSubscriptionError },
            ] = await Promise.all([activeSubscriptionQuery, latestSubscriptionQuery]);

            const { data: entitlements, error } = await supabase
                .from("user_entitlements")
                .select("tier_code, effective_to")
                .eq("user_id", user.id)
                .maybeSingle();

            if (!mounted) return;

            const subscription = activeSubscription || latestSubscription;
            const subscriptionError = activeSubscriptionError || latestSubscriptionError;
            const subscriptionTier = !subscriptionError ? getEffectiveTier(subscription) : null;
            setCurrentTier(subscriptionTier || (!error && entitlements?.tier_code ? entitlements.tier_code : "free"));

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
