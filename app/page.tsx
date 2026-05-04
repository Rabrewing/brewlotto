"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function HomePage() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showCta, setShowCta] = useState(false);
    const [autoplayBlocked, setAutoplayBlocked] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const videoMp4Src =
        process.env.NEXT_PUBLIC_LANDING_VIDEO_MP4_URL ||
        "/landing/brewlotto-cta-mobile.mp4";
    const videoWebmSrc =
        process.env.NEXT_PUBLIC_LANDING_VIDEO_WEBM_URL ||
        "/landing/brewlotto-cta-mobile.webm";
    const videoFallbackSrc = "/landing/brewlotto-cta.mp4";

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = isMuted;
    }, [isMuted]);

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
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[12px] uppercase tracking-[0.16em] text-white/72 backdrop-blur-md">
                            <span className="h-2 w-2 rounded-full bg-[#ffcb4d] shadow-[0_0_10px_rgba(255,203,77,0.85)] animate-brew-pulse" />
                            BrewLotto reel
                        </div>

                        <div className="overflow-hidden rounded-[32px] border border-[#ffc742]/18 bg-[linear-gradient(145deg,rgba(28,18,14,0.96),rgba(9,8,8,0.98))] shadow-[0_0_38px_rgba(255,184,28,0.14)]">
                            <div className="px-5 pb-3 pt-5 sm:px-6">
                                <div className="text-[13px] uppercase tracking-[0.18em] text-white/38">
                                    BrewLotto preview reel
                                </div>
                                <div className="mt-2 text-[22px] font-semibold text-[#f7ddb3]">
                                    {showCta ? "Step into BrewLotto." : "Watch BrewLotto come alive."}
                                </div>
                            </div>

                            <div className="px-3 pb-3 sm:px-4">
                                <div className="relative overflow-hidden rounded-[26px] border border-white/8 bg-black">
                                    <video
                                        ref={videoRef}
                                        className="block h-[62vh] w-full object-contain"
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
                                        <source src={videoMp4Src} type="video/mp4" />
                                        <source src={videoWebmSrc} type="video/webm" />
                                        <source src={videoFallbackSrc} type="video/mp4" />
                                    </video>

                                    <div className="absolute bottom-3 right-3 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => void handleReplay()}
                                            className="rounded-full border border-white/12 bg-black/65 px-3 py-1.5 text-[12px] font-medium text-white/80 backdrop-blur-md transition-colors hover:text-white"
                                        >
                                            Replay
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => void (isMuted ? playWithSound() : toggleMute())}
                                            className="rounded-full border border-white/12 bg-black/65 px-3 py-1.5 text-[12px] font-medium text-white/80 backdrop-blur-md transition-colors hover:text-white"
                                        >
                                            {isMuted ? "Play with sound" : "Mute"}
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
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
