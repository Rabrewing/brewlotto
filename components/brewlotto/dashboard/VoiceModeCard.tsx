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
    <div className="rounded-[28px] border border-[#ffc742]/20 bg-gradient-to-r from-[#1a1816]/90 to-[#14120e]/90 p-4">
      <div className="flex items-center gap-4">
        {/* Left: Info */}
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-lg">🎙️</span>
            <h3 className="text-[16px] font-semibold text-white">{title}</h3>
          </div>
          <p className="text-[13px] text-white/60">
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
          className={`relative flex h-14 w-14 items-center justify-center rounded-full transition-all ${
            isActive
              ? 'bg-gradient-to-br from-[#ffc742] to-[#ffbe27] shadow-[0_0_20px_rgba(255,199,66,0.5)]'
              : 'bg-[#1a1a1c] border border-white/20 hover:border-[#ffc742]/50'
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

      <div className="mt-3 text-[11px] uppercase tracking-[0.16em] text-white/35">
        {isSupported ? (isActive ? 'Narration live' : 'Narration ready') : 'Narration unavailable'}
      </div>
    </div>
  );
}
