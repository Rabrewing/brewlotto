// =============================================
// 📁 /hooks/useBrewBot.js
// Updated: 2025-06-28T03:00 EDT
// Description: Global Brew controller for modal UI + voice prompts
// Exposes modal open state + speech methods: speak, alert, prompt
// =============================================

import { create } from "zustand";
import useBrewVoice from "@/hooks/useBrewVoice";

export const useBrewBot = create((set) => ({
  open: false,
  message: "",
  tone: "default",
  toggle: () => set((s) => ({ open: !s.open })),
  openBot: () => set({ open: true }),
  closeBot: () => set({ open: false }),
  speak: () => { }, // injected below
  alert: () => { },
  prompt: () => { },
  clear: () => set({ message: "", tone: "default" }),
}));

// 🔊 Voice hook injection (run on app mount or Brew boot)
export function useInjectBrewVoice({ tone = "default" } = {}) {
  const { speak: ttsSpeak } = useBrewVoice({ tone });
  const setBot = useBrewBot.setState;

  const speak = (msg, opts = {}) => {
    const chosenTone = opts.tone || "default";
    const audible = opts.audible !== false;
    setBot({ message: msg, tone: chosenTone });
    if (audible) ttsSpeak(msg);
  };

  const alert = (msg) =>
    speak(msg, { tone: "alert", audible: true });

  const prompt = (msg) =>
    speak(msg, { tone: "guide", audible: true });

  setBot({ speak, alert, prompt });
}