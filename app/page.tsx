"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { supabase } from "../lib/supabase/browserClient";

export default function HomePage() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showCta, setShowCta] = useState(false);
    const [autoplayBlocked, setAutoplayBlocked] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isExpanded, setIsExpanded] = useState(true);
    const videoMp4Src =
        process.env.NEXT_PUBLIC_LANDING_VIDEO_MP4_URL ||
        "/landing/brewlotto-no-watermark.mp4";
    const videoWebmSrc =
        process.env.NEXT_PUBLIC_LANDING_VIDEO_WEBM_URL ||
        "/landing/brewlotto-cta-mobile.webm";
    const videoFallbackSrc = "/landing/brewlotto-cta-mobile.mp4";
    const videoCaptionsSrc = "/landing/brewlotto-cta-mobile.vtt";
    const landingTranscript = [
        "Watch BrewLotto come alive.",
        "Play with sound if you want the full reel.",
        "Use replay to start over at any time.",
        "Expand or shrink the movie-style frame.",
        "Enter BrewLotto to sign in and continue.",
    ];

    useEffect(() => {
        let active = true;

        const hasOnboardedCookie =
            typeof document !== "undefined" &&
            document.cookie.split("; ").some((part) => part.trim() === "brewlotto_onboarded=1");

        const checkSession = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!active) return;

            if (user) {
                router.replace("/dashboard");
                return;
            }

            if (hasOnboardedCookie) {
                router.replace("/login");
                return;
            }

            setIsReady(true);
        };

        void checkSession();

        return () => {
            active = false;
        };
    }, [router]);

    useEffect(() => {
        if (!isReady) return;

        const video = videoRef.current;
        if (!video) return;

        const attemptPlay = async () => {
            try {
                await video.play();
                setIsPlaying(true);
                setAutoplayBlocked(false);
            } catch {
                setAutoplayBlocked(true);
            }
        };

        void attemptPlay();
    }, [isReady]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = isMuted;
    }, [isMuted]);

    useEffect(() => {
        if (!isExpanded) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsExpanded(false);
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isExpanded]);

    const handleReplay = async () => {
        const video = videoRef.current;
        if (!video) return;

        setShowCta(false);
        setIsPlaying(false);
        video.currentTime = 0;

        try {
            await video.play();
            setIsPlaying(true);
            setAutoplayBlocked(false);
        } catch {
            setAutoplayBlocked(true);
        }
    };

    const soundButtonClass = isMuted
        ? "rounded-full border border-[#ffc742]/32 bg-[linear-gradient(180deg,rgba(56,39,10,0.98),rgba(21,16,10,0.98))] px-3 py-1.5 text-[12px] font-medium text-[#fff3cf] shadow-[0_0_18px_rgba(255,199,66,0.28)] backdrop-blur-md transition-colors hover:border-[#ffd978]/45 hover:text-white"
        : "rounded-full border border-white/12 bg-black/65 px-3 py-1.5 text-[12px] font-medium text-white/80 backdrop-blur-md transition-colors hover:text-white";
    const replayButtonClass =
        "rounded-full border border-[#ffc742]/16 bg-[linear-gradient(180deg,rgba(35,24,11,0.96),rgba(16,12,8,0.98))] px-3 py-1.5 text-[12px] font-medium text-[#f6e2b3] shadow-[0_0_10px_rgba(255,199,66,0.16)] backdrop-blur-md transition-colors hover:border-[#ffd978]/28 hover:text-white";
    const utilityButtonClass =
        "rounded-full border border-[#ffc742]/14 bg-[linear-gradient(180deg,rgba(28,20,12,0.94),rgba(14,11,8,0.96))] px-3 py-1.5 text-[12px] font-medium text-[#f3dfb0] shadow-[0_0_8px_rgba(255,199,66,0.12)] backdrop-blur-md transition-colors hover:border-[#ffd978]/24 hover:text-white";

    const toggleMute = async () => {
        const video = videoRef.current;
        const nextMuted = !isMuted;

        setIsMuted(nextMuted);

        if (video) {
            video.muted = nextMuted;

            if (!video.paused && !nextMuted) {
                try {
                    await video.play();
                } catch {
                    setAutoplayBlocked(true);
                }
            }
        }
    };

    const playWithSound = async () => {
        const video = videoRef.current;
        if (!video) return;

        setShowCta(false);
        setIsPlaying(false);
        setIsMuted(false);
        video.muted = false;
        video.currentTime = 0;

        try {
            await video.play();
            setIsPlaying(true);
            setAutoplayBlocked(false);
        } catch {
            setAutoplayBlocked(true);
        }
    };

    if (!isReady) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white/55">
                Loading BrewLotto...
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
                <header className="flex items-center justify-between rounded-[24px] border border-white/8 bg-black/20 px-4 py-4 backdrop-blur-sm">
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

                <section className="flex flex-1 items-center py-6 lg:py-10">
                    <div className="w-full">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ffc742]/16 bg-[linear-gradient(180deg,rgba(36,25,12,0.88),rgba(14,11,8,0.94))] px-3 py-1.5 text-[12px] uppercase tracking-[0.16em] text-[#f7ddb3] shadow-[0_0_10px_rgba(255,199,66,0.12)] backdrop-blur-md">
                            <span className="h-2 w-2 rounded-full bg-[#ffcb4d] shadow-[0_0_10px_rgba(255,203,77,0.85)] animate-brew-pulse" />
                            BrewLotto reel
                        </div>

                        <div
                            className={
                                isExpanded
                                    ? "fixed inset-4 z-50 mx-auto flex w-[min(100%,960px)] flex-col overflow-hidden rounded-[32px] border border-[#ffc742]/18 bg-[linear-gradient(145deg,rgba(28,18,14,0.98),rgba(9,8,8,0.99))] shadow-[0_0_60px_rgba(255,184,28,0.22)] backdrop-blur-xl"
                                    : "overflow-hidden rounded-[32px] border border-[#ffc742]/18 bg-[linear-gradient(145deg,rgba(28,18,14,0.96),rgba(9,8,8,0.98))] shadow-[0_0_38px_rgba(255,184,28,0.14)]"
                            }
                        >
                            {isExpanded ? (
                                <button
                                    type="button"
                                    aria-label="Close expanded video"
                                    onClick={() => setIsExpanded(false)}
                                    className="absolute right-4 top-4 z-20 rounded-full border border-[#ffc742]/18 bg-[linear-gradient(180deg,rgba(36,25,12,0.88),rgba(14,11,8,0.95))] px-3 py-1.5 text-[12px] font-medium text-[#f7ddb3] shadow-[0_0_10px_rgba(255,199,66,0.14)] backdrop-blur-md transition-colors hover:border-[#ffd978]/28 hover:text-white"
                                >
                                    Close
                                </button>
                            ) : null}

                            <div className="px-5 pb-3 pt-5 sm:px-6">
                                <div className="text-[13px] uppercase tracking-[0.18em] text-white/38">
                                    BrewLotto preview reel
                                </div>
                                <div className="mt-2 text-[22px] font-semibold text-[#f7ddb3]">
                                    {showCta ? "Step into BrewLotto." : "Watch BrewLotto come alive."}
                                </div>
                            </div>

                            <div className="px-3 pb-3 sm:px-4">
                                <div
                                    className={
                                        isExpanded
                                            ? "relative overflow-hidden rounded-[26px] border border-white/8 bg-black"
                                            : "relative overflow-hidden rounded-[26px] border border-white/8 bg-black"
                                    }
                                >
                                    <video
                                        ref={videoRef}
                                        className={isExpanded ? "block h-[80vh] w-full object-contain" : "block h-[62vh] w-full object-contain"}
                                        autoPlay
                                        muted={isMuted}
                                        playsInline
                                        preload="metadata"
                                        poster="/frontend/brew_logo.png"
                                        onEnded={() => setShowCta(true)}
                                        onPlay={() => {
                                            setIsPlaying(true);
                                            setAutoplayBlocked(false);
                                        }}
                                        onPause={() => {
                                            if (!showCta) {
                                                setIsPlaying(false);
                                            }
                                        }}
                                        onLoadedMetadata={() => {
                                            if (videoRef.current) {
                                                void videoRef.current.play().catch(() => undefined);
                                            }
                                        }}
                                    >
                                        <track kind="captions" src={videoCaptionsSrc} srcLang="en" label="English" default />
                                        <source src={videoMp4Src} type="video/mp4" />
                                        <source src={videoWebmSrc} type="video/webm" />
                                        <source src={videoFallbackSrc} type="video/mp4" />
                                    </video>

                                    <div className="absolute bottom-3 right-3 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => void handleReplay()}
                                            className={replayButtonClass}
                                        >
                                            Replay
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => void (isMuted ? playWithSound() : toggleMute())}
                                            className={soundButtonClass}
                                        >
                                            {isMuted ? "Play with sound" : "Mute"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsExpanded((value) => !value)}
                                            className={utilityButtonClass}
                                        >
                                            {isExpanded ? "Shrink" : "Expand"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {!isPlaying ? (
                                <div className="px-5 pb-1 sm:px-6">
                                    <div className="rounded-[18px] border border-white/10 bg-black/35 px-4 py-3 text-[14px] leading-6 text-white/72">
                                        <span className="font-semibold text-[#f7ddb3]">
                                            {autoplayBlocked ? "Autoplay blocked." : "Video starting..."}
                                        </span>{" "}
                                        Tap Replay or Sound on to test the reel.
                                    </div>
                                </div>
                            ) : null}

                            <div className="grid gap-3 border-t border-white/8 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6">
                                <div className="text-[15px] leading-7 text-white/68">
                                    {showCta
                                        ? "The reel has ended. Enter BrewLotto to sign in and continue."
                                        : "Let the reel play first, then drop straight into the sign-in step."}
                                </div>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ffc742] to-[#ffbe27] px-7 py-3 text-[15px] font-semibold text-black shadow-[0_0_18px_rgba(255,199,66,0.22)]"
                                >
                                    Enter BrewLotto
                                </Link>
                            </div>

                            <details className="border-t border-white/8 px-5 py-4 text-[14px] leading-7 text-white/64 sm:px-6">
                                <summary className="flex cursor-pointer list-none items-center justify-center gap-2 font-medium text-[#f7ddb3] outline-none">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#ffc742]/20 bg-[linear-gradient(180deg,rgba(36,25,12,0.9),rgba(14,11,8,0.96))] text-[10px] text-[#ffd873] shadow-[0_0_8px_rgba(255,199,66,0.12)]">
                                        ▾
                                    </span>
                                    <span>Read landing transcript</span>
                                </summary>
                                <div className="mt-3 space-y-2">
                                    {landingTranscript.map((line) => (
                                        <p key={line}>{line}</p>
                                    ))}
                                </div>
                            </details>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
