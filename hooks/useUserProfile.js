// hooks/useUserProfile.js
// Unified hook: fetches authenticated user and profile data from Supabase
// Timestamp: 2025-06-26T14:10 EDT

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

export function useUserProfile() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchUserAndProfile = async () => {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                if (isMounted) {
                    setUser(null);
                    setProfile(null);
                    setLoading(false);
                }
                return;
            }

            const { data, error } = await supabase
                .from("user_profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (isMounted) {
                setUser(user);
                setProfile(error ? null : data);
                setLoading(false);
            }
        };

        fetchUserAndProfile();

        return () => {
            isMounted = false;
        };
    }, []);

    return { user, profile, loading };
}