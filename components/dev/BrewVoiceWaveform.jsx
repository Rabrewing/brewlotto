// @components/dev/BrewVoiceWaveform.jsx
// Summary: Animated waveform visual that pulses during Brew voice playback

export default function BrewVoiceWaveform({ isSpeaking, profile = "Mentor" }) {
    const profileColors = {
        Mentor: "bg-green-400",
        Narrator: "bg-blue-400",
        Hype: "bg-pink-500",
    };

    const barStyle = `${profileColors[profile] || "bg-yellow-400"} h-full w-1 mx-0.5 rounded`;

    return (
        <div className="flex items-end justify-center h-8 mt-2">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className={`${barStyle} transition-all duration-300 ease-in-out ${isSpeaking
                            ? `animate-wave-delay${i}`
                            : "opacity-30 scale-y-50"
                        }`}
                />
            ))}

            <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }

        .animate-wave-delay0 { animation: wave 1s infinite 0s ease-in-out; }
        .animate-wave-delay1 { animation: wave 1s infinite 0.1s ease-in-out; }
        .animate-wave-delay2 { animation: wave 1s infinite 0.2s ease-in-out; }
        .animate-wave-delay3 { animation: wave 1s infinite 0.3s ease-in-out; }
        .animate-wave-delay4 { animation: wave 1s infinite 0.4s ease-in-out; }
      `}</style>
        </div>
    );
}