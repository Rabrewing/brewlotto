'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Changed from "next/router"
import { supabase } from "../../lib/supabase/browserClient";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const logout = async () => {
            await supabase.auth.signOut();
            router.push("/login");
        };
        logout();
    }, [router]);

    return <p className="text-white p-6">Logging out...</p>;
}