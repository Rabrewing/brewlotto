// @components/dev/BrewDevChat.jsx
// Summary: Brew AI Dev Chat with TTS + Speech Input + Auto-Send + Voice Profile + Waveform + Enter-to-send

import { useState, useEffect } from "react";
import { useBrewAI } from "@/lib/ai/useBrewAI";
import { useTTS } from "@/lib/voice/useTTS";
import { useSpeechToText } from "@/lib/voice/useSpeechToText";
import BrewVoiceWaveform from "@/components/dev/BrewVoiceWaveform";

export default function BrewDevChat({ context = null }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [speakMode, setSpeakMode] = useState(true);
    const [autoSendMode, setAutoSendMode] = useState(true);
    const [voiceProfile, setVoiceProfile] = useState("Mentor");
    const [isSpeaking, setIsSpeaking] = useState(false);

    const { sendPrompt } = useBrewAI();
    const { speak } = useTTS(voiceProfile, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false)
    });

    const {
        transcript,
        listening,
        startListening,
        stopListening,
        setTranscript
    } = useSpeechToText();

    useEffect(() => {
        if (transcript) setInput(transcript);
    }, [transcript]);

    useEffect(() => {
        if (!listening && transcript && autoSendMode) {
            handleSubmit();
        }
    }, [listening, transcript, autoSendMode]);

    const handleSubmit = async () => {
        const cleanInput = input.trim();
        if (!cleanInput) return;

        const userMessage = { role: "user", content: cleanInput };
        setMessages((prev) => [...prev, userMessage]);

        const reply = await sendPrompt([...messages, userMessage], {
            context,
            fileEditing: true
        });

        if (speakMode) speak(reply);
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        setInput("");
        setTranscript("");
    };

    return (
        <div className="bg-neutral-950 border border-yellow-600 p-4 rounded space-y-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <h2 className="text-yellow-400 font-semibold">🧠 Brew AI Dev Chat</h2>
                <div className="flex flex-wrap gap-2 items-center text-xs">
                    <select
                        value={voiceProfile}
                        onChange={(e) => setVoiceProfile(e.target.value)}
                        className="bg-neutral-800 text-yellow-300 border border-yellow-500 rounded px-2 py-1"
                    >
                        <option value="Mentor">🎓 Mentor</option>
                        <option value="Narrator">📖 Narrator</option>
                        <option value="Hype">🔥 Hype</option>
                    </select>
                    <button
                        onClick={() => setSpeakMode(!speakMode)}
                        className="px-2 py-1 border border-yellow-500 rounded text-yellow-300 hover:bg-yellow-700 hover:text-black"
                    >
                        {speakMode ? "🔊 Voice ON" : "🔇 Voice OFF"}
                    </button>
                    <button
                        onClick={() => setAutoSendMode(!autoSendMode)}
                        className="px-2 py-1 border border-yellow-500 rounded text-yellow-300 hover:bg-yellow-700 hover:text-black"
                    >
                        {autoSendMode ? "🤖 Auto-Send ON" : "✋ Manual Send"}
                    </button>
                    <button
                        onClick={listening ? stopListening : startListening}
                        className={`px-2 py-1 border rounded ${listening
                                ? "bg-red-500 text-black border-red-300"
                                : "text-yellow-300 border-yellow-500 hover:bg-yellow-700 hover:text-black"
                            }`}
                    >
                        {listening ? "🎙 Listening..." : "🎙 Speak Prompt"}
                    </button>
                </div>
            </div>

            {context?.name && (
                <p className="text-xs text-yellow-300">
                    Context: <code>{context.name}</code>{" "}
                    {context.isLocalUpload && "📁 (Local Upload)"}
                </p>
            )}

            <div className="h-64 overflow-y-auto text-sm bg-black p-2 rounded">
                {messages.map((msg, idx) => (
                    <p
                        key={idx}
                        className={
                            msg.role === "user" ? "text-yellow-300" : "text-green-400"
                        }
                    >
                        <strong>{msg.role === "user" ? "You:" : "Brew:"}</strong>{" "}
                        {msg.content}
                    </p>
                ))}
            </div>

            <BrewVoiceWaveform isSpeaking={isSpeaking} profile={voiceProfile} />

            <div className="flex gap-2">
                <textarea
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                        }
                    }}
                    placeholder="e.g. Refactor this strategy function..."
                    className="flex-1 resize-none bg-neutral-800 px-3 py-2 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                />
                <button
                    onClick={handleSubmit}
                    className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-300 disabled:opacity-40"
                >
                    Send
                </button>
            </div>
        </div>
    );
}