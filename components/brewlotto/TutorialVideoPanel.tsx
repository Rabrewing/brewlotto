'use client';

import type { ReactNode } from 'react';

interface TutorialVideoPanelProps {
  eyebrow: string;
  title: string;
  description: string;
  videoSrc: string;
  poster?: string;
  captionsSrc?: string;
  transcriptTitle?: string;
  transcript: string[];
  children?: ReactNode;
}

export function TutorialVideoPanel({
  eyebrow,
  title,
  description,
  videoSrc,
  poster = '/frontend/brew_logo.png',
  captionsSrc,
  transcriptTitle = 'Read transcript',
  transcript,
  children,
}: TutorialVideoPanelProps) {
  return (
    <section className="rounded-[28px] border border-[#ffbd39]/22 bg-[linear-gradient(145deg,rgba(32,19,13,0.82),rgba(13,10,10,0.96))] px-5 py-5 shadow-[0_0_22px_rgba(255,184,28,0.08)]">
      <div className="text-[13px] uppercase tracking-[0.18em] text-white/38">{eyebrow}</div>
      <div className="mt-2 text-[22px] font-semibold text-[#f7d6ab]">{title}</div>
      <div className="mt-2 max-w-3xl text-[15px] leading-7 text-white/66">{description}</div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-white/8 bg-black shadow-[0_0_22px_rgba(255,184,28,0.08)]">
        <video
          className="block h-auto w-full max-h-[70vh] object-contain"
          controls
          playsInline
          preload="metadata"
          poster={poster}
        >
          {captionsSrc ? <track kind="captions" src={captionsSrc} srcLang="en" label="English" default /> : null}
          <source src={videoSrc} type="video/mp4" />
        </video>
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
