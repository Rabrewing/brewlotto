// @lib/voice/useSpeechToText.js
// Summary: Voice input hook — speech to text using Web Speech API

import { useEffect, useState, useRef } from "react";

export function useSpeechToText() {
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (typeof window === "undefined" || !window.SpeechRecognition && !window.webkitSpeechRecognition) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (e) => {
            const result = e.results[0][0].transcript;
            setTranscript(result);
        };

        recognition.onerror = (e) => {
            console.error("[Brew STT Error]", e);
        };

        recognition.onend = () => {
            setListening(false);
        };
    }, []);

    const startListening = () => {
        setTranscript("");
        setListening(true);
        recognitionRef.current?.start();
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
        setListening(false);
    };

    return {
        transcript,
        listening,
        startListening,
        stopListening,
        setTranscript // manual override
    };
}