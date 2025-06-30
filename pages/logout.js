// pages/logout.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";

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