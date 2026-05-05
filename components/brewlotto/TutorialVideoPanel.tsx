"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

interface TutorialVideoPanelProps {
  eyebrow: string;
  title: string;
  description: string;
  videoSrc: string;
  poster?: string;
  captionsSrc?: string;
  transcriptTitle?: string;
  transcript: string[];
  autoPlay?: boolean;
  defaultExpanded?: boolean;
  children?: ReactNode;
}

export function TutorialVideoPanel({
  eyebrow,
  title,
  description,
  videoSrc,
  poster = "/frontend/brew_logo.png",
  captionsSrc,
  transcriptTitle = "Read transcript",
  transcript,
  autoPlay = true,
  defaultExpanded = false,
  children,
}: TutorialVideoPanelProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isCaptionsOn, setIsCaptionsOn] = useState(Boolean(captionsSrc));
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !captionsSrc) return;

    const tracks = video.textTracks;
    for (let index = 0; index < tracks.length; index += 1) {
      tracks[index].mode = isCaptionsOn ? "showing" : "disabled";
    }
  }, [captionsSrc, isCaptionsOn]);

  useEffect(() => {
    if (!autoPlay) return;

    const video = videoRef.current;
    if (!video) return;

    const attemptPlay = async () => {
      try {
        await video.play();
        setAutoplayBlocked(false);
      } catch {
        setAutoplayBlocked(true);
      }
    };

    void attemptPlay();
  }, [autoPlay]);

  const replay = async () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;

    try {
      await video.play();
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

  const toggleCaptions = () => {
    setIsCaptionsOn((value) => !value);
  };

  return (
    <section className="rounded-[28px] border border-[#ffbd39]/22 bg-[linear-gradient(145deg,rgba(32,19,13,0.82),rgba(13,10,10,0.96))] px-5 py-5 shadow-[0_0_22px_rgba(255,184,28,0.08)]">
      <div className="text-[13px] uppercase tracking-[0.18em] text-white/38">{eyebrow}</div>
      <div className="mt-2 text-[22px] font-semibold text-[#f7d6ab]">{title}</div>
      <div className="mt-2 max-w-3xl text-[15px] leading-7 text-white/66">{description}</div>

      <div
        className={
          isExpanded
            ? "fixed inset-4 z-50 mx-auto flex w-[min(100%,960px)] flex-col overflow-hidden rounded-[32px] border border-[#ffc742]/18 bg-[linear-gradient(145deg,rgba(28,18,14,0.98),rgba(9,8,8,0.99))] shadow-[0_0_60px_rgba(255,184,28,0.22)] backdrop-blur-xl"
            : "mt-5 overflow-hidden rounded-[24px] border border-white/8 bg-black shadow-[0_0_22px_rgba(255,184,28,0.08)]"
        }
      >
        {isExpanded ? (
          <button
            type="button"
            aria-label="Close expanded tutorial"
            onClick={() => setIsExpanded(false)}
            className="absolute right-4 top-4 z-20 rounded-full border border-white/12 bg-black/70 px-3 py-1.5 text-[12px] font-medium text-white/78 backdrop-blur-md transition-colors hover:text-white"
          >
            Close
          </button>
        ) : null}

        <div className="px-4 pb-3 pt-4 sm:px-5">
          <div className="text-[13px] uppercase tracking-[0.18em] text-white/38">BrewLotto tutorial reel</div>
          <div className="mt-2 text-[18px] font-semibold text-[#f7ddb3]">
            {autoplayBlocked ? "Autoplay blocked." : "Watch BrewLotto come alive."}
          </div>
        </div>

        <div className="px-3 pb-3 sm:px-4">
          <div className="relative overflow-hidden rounded-[26px] border border-white/8 bg-black">
            <video
              ref={videoRef}
              className={isExpanded ? "block h-[80vh] w-full object-contain" : "block h-[56vh] w-full object-contain"}
              autoPlay={autoPlay}
              muted={isMuted}
              playsInline
              preload="metadata"
              poster={poster}
              onEnded={() => undefined}
              onPlay={() => {
                setAutoplayBlocked(false);
              }}
              onPause={() => undefined}
              onLoadedMetadata={() => {
                if (captionsSrc && videoRef.current) {
                  const tracks = videoRef.current.textTracks;
                  for (let index = 0; index < tracks.length; index += 1) {
                    tracks[index].mode = isCaptionsOn ? "showing" : "disabled";
                  }
                }

                if (autoPlay && videoRef.current) {
                  void videoRef.current.play().catch(() => {
                    setAutoplayBlocked(true);
                  });
                }
              }}
            >
              {captionsSrc ? <track kind="captions" src={captionsSrc} srcLang="en" label="English" default /> : null}
              <source src={videoSrc} type="video/mp4" />
            </video>

            <div className="absolute bottom-3 right-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void replay()}
                className="rounded-full border border-white/12 bg-black/65 px-3 py-1.5 text-[12px] font-medium text-white/80 backdrop-blur-md transition-colors hover:text-white"
              >
                Replay
              </button>
              <button
                type="button"
                onClick={() => void toggleMute()}
                className="rounded-full border border-white/12 bg-black/65 px-3 py-1.5 text-[12px] font-medium text-white/80 backdrop-blur-md transition-colors hover:text-white"
              >
                {isMuted ? "Play with sound" : "Mute"}
              </button>
              <button
                type="button"
                onClick={toggleCaptions}
                disabled={!captionsSrc}
                className="rounded-full border border-white/12 bg-black/65 px-3 py-1.5 text-[12px] font-medium text-white/80 backdrop-blur-md transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isCaptionsOn ? "CC on" : "CC off"}
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded((value) => !value)}
                className="rounded-full border border-white/12 bg-black/65 px-3 py-1.5 text-[12px] font-medium text-white/80 backdrop-blur-md transition-colors hover:text-white"
              >
                {isExpanded ? "Shrink" : "Expand"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <details className="rounded-[20px] border border-white/8 bg-black/20 px-4 py-4">
          <summary className="cursor-pointer list-none text-[14px] font-medium text-[#f7ddb3] outline-none">
            {transcriptTitle}
          </summary>
          <div className="mt-3 space-y-2 text-[14px] leading-7 text-white/66">
            {transcript.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </details>

        {children ? (
          <div className="rounded-[20px] border border-white/8 bg-black/20 px-4 py-4">
            {children}
          </div>
        ) : (
          <div className="rounded-[20px] border border-white/8 bg-black/20 px-4 py-4 text-[14px] leading-7 text-white/60">
            Captions are built into the player, and the transcript can be expanded whenever you want the text version.
          </div>
        )}
      </div>
    </section>
  );
}
