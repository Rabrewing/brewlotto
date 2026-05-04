"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

import { supabase } from "../../lib/supabase/browserClient";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const router = useRouter();

    const videoSrc =
        process.env.NEXT_PUBLIC_LANDING_VIDEO_MP4_URL ||
        "/landing/brewlotto-cta.mp4";

    useEffect(() => {
        let active = true;

        const checkSession = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!active) return;

            if (!user) {
                setCheckingSession(false);
                return;
            }

            const { data: prefs } = await supabase
                .from("user_preferences")
                .select("onboarding_completed")
                .eq("user_id", user.id)
                .maybeSingle();

            if (!active) return;

            router.replace(prefs?.onboarding_completed ? "/dashboard" : "/onboarding");
        };

        void checkSession();

        return () => {
            active = false;
        };
    }, [router]);

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
        setMessage(null);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true,
                emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            const lower = error.message.toLowerCase();
            const hint =
                lower.includes("smtp") || lower.includes("email") || lower.includes("otp")
                    ? " Check Supabase Auth SMTP, Resend sender verification, and redirect URLs."
                    : "";
            setMessage({ type: "error", text: `${error.message}${hint}` });
        } else {
            setMessage({
                type: "success",
                text: "Magic link sent. Check your email and open it on the same device if possible.",
            });
        }

        setSubmitting(false);
    };

    if (checkingSession) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white/55">
                Loading sign-in...
            </main>
        );
    }

    return (
        <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
            <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
                <header className="flex items-center justify-between gap-4 rounded-[24px] border border-white/8 bg-black/20 px-4 py-4 backdrop-blur-sm">
                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="text-left"
                    >
                        <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">BrewVerse Labs</div>
                        <div className="mt-1 text-[18px] font-semibold tracking-[-0.03em] text-[#f7ddb3]">BrewLotto</div>
                    </button>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/pricing"
                            className="hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[14px] text-white/72 transition-colors hover:text-white sm:inline-flex"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="/"
                            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[14px] text-white/72 transition-colors hover:text-white"
                        >
                            Home
                        </Link>
                    </div>
                </header>

                <section className="grid flex-1 items-center gap-8 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-10">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#ffc742]/18 bg-[#ffc742]/10 px-3 py-1 text-[12px] uppercase tracking-[0.16em] text-[#ffd988]">
                            <span className="h-2 w-2 rounded-full bg-[#ffcb4d] shadow-[0_0_8px_rgba(255,203,77,0.8)] animate-brew-pulse" />
                            Secure magic link sign-in
                        </div>

                        <h1 className="mt-5 text-[40px] font-semibold tracking-[-0.05em] text-[#fff1d3] sm:text-[54px] lg:text-[64px]">
                            Sign in to BrewLotto.
                        </h1>

                        <p className="mt-4 max-w-xl text-[17px] leading-8 text-white/68 sm:text-[18px]">
                            Enter your email to get a branded magic link, then continue through onboarding and into the dashboard.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2 text-[13px] text-white/55">
                            <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">Fast setup</span>
                            <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">Same-device recommended</span>
                            <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">Tutorial follows sign-in</span>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-6 rounded-[34px] bg-[#ffc742]/8 blur-2xl animate-brew-drift" />
                        <div className="relative overflow-hidden rounded-[32px] border border-[#ffc742]/24 bg-[linear-gradient(145deg,rgba(28,18,14,0.92),rgba(10,9,9,0.98))] shadow-[0_0_38px_rgba(255,184,28,0.16)]">
                            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.12)_35%,transparent_50%)] opacity-0 mix-blend-screen animate-brew-shimmer" />

                            <div className="px-5 pb-4 pt-5">
                                <div className="text-[13px] uppercase tracking-[0.18em] text-white/38">Magic link entry</div>
                                <div className="mt-2 text-[22px] font-semibold text-[#f7ddb3]">Email first. Then continue.</div>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4 px-5 pb-5">
                                <label className="block">
                                    <div className="mb-2 text-[12px] uppercase tracking-[0.16em] text-white/35">Email address</div>
                                    <input
                                        type="email"
                                        placeholder="you@brewlotto.ai"
                                        className="w-full rounded-[18px] border border-white/10 bg-[#0d0b0b] px-4 py-3 text-[15px] text-white outline-none placeholder:text-white/28"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required
                                    />
                                </label>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-5 py-3 text-[15px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {submitting ? "Sending..." : "Send Magic Link"}
                                </button>

                                {message ? (
                                    <p
                                        className={`rounded-[16px] px-4 py-3 text-[14px] ${
                                            message.type === "error"
                                                ? "border border-[#ff8d7b]/25 bg-[#2a120d]/60 text-[#ffc4b8]"
                                                : "border border-[#ffc742]/20 bg-[#2a2110]/60 text-[#ffd988]"
                                        }`}
                                    >
                                        {message.text}
                                    </p>
                                ) : null}
                            </form>

                            <div className="border-t border-white/8 px-5 py-4">
                                <div className="text-[12px] uppercase tracking-[0.16em] text-white/38">Brand preview</div>
                                <video
                                    className="mt-3 aspect-[16/9] w-full rounded-[20px] object-cover"
                                    src={videoSrc}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                    poster="/frontend/brew_logo.png"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
