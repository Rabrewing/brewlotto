//components/RequireAuth.jsx
//time-stamp: 2023-10-01T12:00:00Z
//description: This component checks if a user is authenticated before rendering its children.  If not authenticated, it redirects to the login page.
import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";

export default function RequireAuth({ children }) {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
            }
        };

        checkAuth();
    }, [router]);

    return children;
}