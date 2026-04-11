'use client';

import { useEffect, useMemo, useState } from 'react';

interface VoiceModeCardProps {
  text: string;
  title?: string;
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

export function VoiceModeCard({ text, title = 'Voice Mode', enabled = false, onToggle }: VoiceModeCardProps) {
  const [isActive, setIsActive] = useState(enabled);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window);

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const buttonTitle = useMemo(() => {
    if (!isSupported) {
      return 'Browser voice narration is unavailable on this device.';
    }

    return isActive ? 'Stop Brew narration' : 'Play Brew narration';
  }, [isActive, isSupported]);

  const handleToggle = () => {
    if (!isSupported) {
      return;
    }

    const newState = !isActive;
    setIsActive(newState);
    onToggle?.(newState);

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    if (newState && text.trim()) {
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.onend = () => {
        setIsActive(false);
        onToggle?.(false);
      };
      utterance.onerror = () => {
        setIsActive(false);
        onToggle?.(false);
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="relative rounded-[24px] border border-[#ffc742]/32 bg-gradient-to-r from-[#1a1816]/90 to-[#14120e]/90 p-3 shadow-[0_0_22px_rgba(255,199,66,0.14),inset_0_0_18px_rgba(255,184,28,0.04)] lg:p-3 xl:p-3.5">
      <div className="pointer-events-none absolute right-3 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,199,66,0.3),transparent_68%)] blur-xl" />
      <div className="flex items-center gap-2.5 lg:gap-3">
        {/* Left: Info */}
        <div className="flex-1">
          <div className="mb-0.5 flex items-center gap-2">
            <span className="text-lg">🎙️</span>
            <h3 className="text-[15px] font-semibold text-white">{title}</h3>
          </div>
          <p className="text-[11px] leading-4.5 text-white/60 lg:text-[12px]">
            {isSupported
              ? 'Play the current Brew summary and freshness warning using your browser voice engine.'
              : 'Voice narration is unavailable in this browser, but your latest Brew summary is still shown above.'}
          </p>
        </div>

        {/* Right: Mic button */}
        <button
          onClick={handleToggle}
          disabled={!isSupported}
          title={buttonTitle}
          className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-all lg:h-14 lg:w-14 ${
            isActive
              ? 'bg-gradient-to-br from-[#ffc742] to-[#ffbe27] shadow-[0_0_24px_rgba(255,199,66,0.6),0_0_40px_rgba(255,174,42,0.22)]'
              : 'bg-[#1a1a1c] border border-white/20 shadow-[0_0_12px_rgba(255,199,66,0.08)] hover:border-[#ffc742]/60 hover:shadow-[0_0_18px_rgba(255,199,66,0.18)]'
          }`}
        >
          {/* Pulse ring when active */}
          {isActive && (
            <div className="absolute inset-0 animate-ping rounded-full bg-[#ffc742]/30" />
          )}
          
          <svg
            className={`relative z-10 h-6 w-6 ${isActive ? 'text-black' : 'text-[#ffc742]'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </button>
      </div>

      <div className="mt-2 text-[9px] uppercase tracking-[0.16em] text-white/35 lg:text-[10px]">
        {isSupported ? (isActive ? 'Narration live' : 'Narration ready') : 'Narration unavailable'}
      </div>
    </div>
  );
}
