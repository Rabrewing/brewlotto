// BrewLotto Login Page
// @pages/login.js
// Timestamp: 2025-06-25T21:12 EDT
// Purpose: Provides a login interface for users to sign in using their email
import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";
import { showToast } from "@/utils/toastservice"; // If you use toasts here (optional)

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage(null);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true,
                emailRedirectTo: `${window.location.origin}/pick3`,
            },
        });

        if (error) {
            setMessage({ type: "error", text: error.message });
        } else {
            setMessage({ type: "success", text: "Magic link sent! Check your email." });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#181818] text-white p-6">
            <div className="mb-6">
                <button
                    onClick={() => router.push("/")}
                    className="text-sm text-[#181818] hover:text-white underline transition"
                >
                    ← Back to BrewLotto
                </button>
            </div>

            <form
                onSubmit={handleLogin}
                className="bg-[#232323] p-6 rounded-xl shadow max-w-sm w-full"
            >
                <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Sign in to BrewLotto</h2>

                <input
                    type="email"
                    placeholder="you@brewlotto.ai"
                    className="w-full px-4 py-2 mb-4 rounded bg-slate-800 text-white placeholder-gray-400 border border-gray-600 shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-[#FFD700] text-[#181818] font-bold py-2 rounded hover:bg-white hover:text-[#FFD700] transition"
                >
                    Send Magic Link
                </button>

                {message && (
                    <p
                        className={`mt-4 text-sm ${message.type === "error" ? "text-red-400" : "text-green-400"
                            }`}
                    >
                        {message.text}
                    </p>
                )}
            </form>
        </div>
    );
}