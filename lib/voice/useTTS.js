// @lib/voice/useTTS.js
// Summary: Text-to-speech engine for Brew with profile support + lifecycle hooks

export function useTTS(profileName = "Mentor", { onStart, onEnd } = {}) {
    const speak = (text) => {
        if (typeof window === "undefined" || !window.speechSynthesis) return;

        const voiceProfiles = {
            Mentor: { rate: 0.95, pitch: 1, nameMatch: "en-US" },
            Narrator: { rate: 0.88, pitch: 0.95, nameMatch: "Google" },
            Hype: { rate: 1.15, pitch: 1.2, nameMatch: "Google" },
        };

        const profile = voiceProfiles[profileName] || voiceProfiles.Mentor;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = profile.rate;
        utterance.pitch = profile.pitch;
        utterance.volume = 1;

        utterance.voice = speechSynthesis
            .getVoices()
            .find((v) => v.name.includes(profile.nameMatch) || v.lang === "en-US");

        utterance.onstart = () => {
            if (typeof onStart === "function") onStart();
        };

        utterance.onend = () => {
            if (typeof onEnd === "function") onEnd();
        };

        window.speechSynthesis.cancel(); // cancel overlapping speech
        window.speechSynthesis.speak(utterance);
    };

    return { speak };
}