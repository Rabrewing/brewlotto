// =============================================
// 📁 /hooks/useBrewVoice.js
// Created: 2025-06-27T04:35 EDT
// Summary: Enables BrewBot speech output via Web Speech API
// Includes mute toggle, dynamic tone (coach, narrator, chill)
// Used by BrewCommentaryEngine and settings panel
// =============================================

import { useEffect, useState, useRef } from "react";

const VOICE_TONES = {
    default: { rate: 1, pitch: 1 },
    coach: { rate: 1.2, pitch: 1.1 },
    narrator: { rate: 0.95, pitch: 0.9 },
    chill: { rate: 0.85, pitch: 0.95 },
};

export default function useBrewVoice({ tone = "default", autoMute = false }) {
    const [voice, setVoice] = useState(null);
    const [muted, setMuted] = useState(autoMute);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const utteranceRef = useRef(null);

    // Load voice list
    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            const brewVoice =
                voices.find(v => /en-US|en-GB/.test(v.lang)) || voices[0];
            setVoice(brewVoice);
        };

        loadVoices();
        if (typeof window !== "undefined") {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    // Speak function
    const speak = (text) => {
        if (!voice || muted || !text) return;

        const utter = new SpeechSynthesisUtterance(text);
        utter.voice = voice;
        utter.rate = VOICE_TONES[tone]?.rate || 1;
        utter.pitch = VOICE_TONES[tone]?.pitch || 1;
        utter.volume = 1;
        utter.onstart = () => setIsSpeaking(true);
        utter.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utter);
        utteranceRef.current = utter;
    };

    const mute = () => {
        setMuted(true);
        speechSynthesis.cancel();
    };

    const unmute = () => {
        setMuted(false);
    };

    return { speak, mute, unmute, muted, isSpeaking };
}