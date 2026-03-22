"use client";

import { StateKey, getStateShortName, getStateDisplayName } from "@/lib/brewlotto-games";
import { ChevronDown, MapPin } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface StateSelectorProps {
  currentState: StateKey;
  onStateChange: (state: StateKey) => void;
}

export default function StateSelector({ currentState, onStateChange }: StateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const states: { key: StateKey; name: string; shortName: string }[] = [
    { key: "nc", name: "North Carolina", shortName: "NC" },
    { key: "ca", name: "California", shortName: "CA" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-full border border-[#ffbf47]/30 bg-[linear-gradient(180deg,rgba(30,27,27,0.96),rgba(14,12,12,0.96))] px-3 py-1.5 text-[11px] font-semibold text-[#ffcf68] transition-all duration-200 hover:border-[#ffbf47]/50 hover:text-white"
      >
        <MapPin className="h-3 w-3" />
        <span>{getStateShortName(currentState)}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 w-48 overflow-hidden rounded-2xl border border-[#ffbf47]/30 bg-[#121010] shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(255,180,0,0.1)]">
          <div className="p-2">
            <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-white/50">
              Select State
            </div>
            {states.map((state) => (
              <button
                key={state.key}
                onClick={() => {
                  onStateChange(state.key);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all duration-150 ${
                  currentState === state.key
                    ? "bg-[linear-gradient(180deg,#6a4700_0%,#c48714_28%,#ffb61d_100%)] text-[#fff4c4]"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-[13px] font-medium">{state.name}</span>
                <span className={`text-[11px] font-semibold ${currentState === state.key ? "text-[#fff4c4]/70" : "text-white/40"}`}>
                  {state.shortName}
                </span>
              </button>
            ))}
          </div>
          <div className="border-t border-white/5 px-3 py-2 text-[10px] text-white/40">
            Powerball & Mega available in both states
          </div>
        </div>
      )}
    </div>
  );
}
