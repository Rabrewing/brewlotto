"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function HomePage() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [showCta, setShowCta] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const attemptPlay = async () => {
            try {
                await video.play();
            } catch {
                // Browsers may still require a user gesture. The poster remains visible.
            }
        };

        void attemptPlay();
    }, []);

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
            <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                src="/landing/brewlotto-cta.mp4"
                autoPlay
                muted
                playsInline
                preload="auto"
                poster="/frontend/brew_logo.png"
                onEnded={() => setShowCta(true)}
                onCanPlay={() => {
                    if (videoRef.current && !showCta) {
                        void videoRef.current.play().catch(() => undefined);
                    }
                }}
            />

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16)_0%,rgba(0,0,0,0.32)_42%,rgba(5,5,5,0.86)_100%)]" />

            <div className="relative z-10 flex min-h-screen flex-col">
                <header className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div>
                        <div className="text-[11px] uppercase tracking-[0.22em] text-white/40">BrewVerse Labs</div>
                        <div className="mt-1 text-[18px] font-semibold tracking-[-0.03em] text-[#f7ddb3]">BrewLotto</div>
                    </div>
                    <Link
                        href="/login"
                        className="rounded-full border border-white/12 bg-black/30 px-4 py-2 text-[14px] text-white/82 backdrop-blur-md transition-colors hover:text-white"
                    >
                        Sign In
                    </Link>
                </header>

                <div className="flex flex-1 items-end px-4 pb-6 sm:px-6 lg:px-8 lg:pb-8">
                    <div className="max-w-2xl">
                        {!showCta ? (
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[12px] uppercase tracking-[0.16em] text-white/72 backdrop-blur-md">
                                <span className="h-2 w-2 rounded-full bg-[#ffcb4d] shadow-[0_0_10px_rgba(255,203,77,0.85)] animate-brew-pulse" />
                                Watch BrewLotto come alive
                            </div>
                        ) : null}

                        <div className="mt-4 max-w-xl rounded-[28px] border border-white/10 bg-black/35 p-5 backdrop-blur-md sm:p-6">
                            <div className="text-[13px] uppercase tracking-[0.18em] text-white/42">
                                {showCta ? "Enter BrewLotto" : "Video first"}
                            </div>
                            <h1 className="mt-2 text-[38px] font-semibold tracking-[-0.05em] text-[#fff1d3] sm:text-[54px]">
                                {showCta ? "Step into BrewLotto." : "Premium lottery energy, upfront."}
                            </h1>
                            <p className="mt-4 max-w-lg text-[16px] leading-7 text-white/72 sm:text-[18px]">
                                {showCta
                                    ? "The intro reel has finished. Enter BrewLotto to sign in and continue to onboarding."
                                    : "The intro reel is the whole point. No extra clutter, no confusing CTA labels, just the brand hook first."}
                            </p>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-7 py-3 text-[15px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.22)]"
                                >
                                    Enter BrewLotto
                                </Link>
                                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-[14px] text-white/68">
                                    Sign in, acknowledge the disclaimer, continue to the tutorial.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
