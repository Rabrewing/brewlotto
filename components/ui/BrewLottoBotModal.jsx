// =============================================
// 📁 /components/ui/BrewLottoBotModal.jsx
// Updated: 2025-06-28T02:38 EDT
// Summary: Full-screen assistant interface for Brew
// Consistent with brand tone, voice toggle, mode selection
// Hooked into BrewTheme, useBrewVoice, and CommentaryEngine
// =============================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BrewAvatar from "./BrewAvatar";
import BrewCommentaryEngine from "./BrewCommentaryEngine";
import useBrewVoice from "@/hooks/useBrewVoice";

export default function BrewLottoBotModal({ open, onClose }) {
    const [voiceTone, setVoiceTone] = useState("coach"); // voice delivery style
    const [showVoice, setShowVoice] = useState(true);    // voice toggle state
    const [userMode, setUserMode] = useState("strategist"); // UX tone

    const { speak, muted, mute, unmute } = useBrewVoice({
        tone: voiceTone,
        autoMute: !showVoice,
    });

    const toggleVoice = () => {
        if (muted) unmute();
        else mute();
        setShowVoice(!showVoice);
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-neutral-900 rounded-xl shadow-xl p-6 max-w-md w-full flex flex-col items-center space-y-4"
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 60, opacity: 0 }}
                    >
                        <BrewAvatar status="idle" size={100} />
                        <BrewCommentaryEngine
                            status="idle"
                            strategy="momentum"     // 🧠 default strategic tone
                            mode={userMode}
                            speak={showVoice}
                            voiceHook={speak}
                        />

                        <div className="flex justify-between items-center gap-4 w-full mt-4">
                            <label className="text-xs text-yellow-300">Voice Tone</label>
                            <select
                                className="bg-neutral-800 text-white rounded px-3 py-1 text-sm"
                                value={voiceTone}
                                onChange={(e) => setVoiceTone(e.target.value)}
                            >
                                <option value="coach">🗣️ Coach</option>
                                <option value="narrator">📜 Narrator</option>
                                <option value="chill">🧘 Chill</option>
                                <option value="default">🎧 Default</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between gap-4 w-full">
                            <label className="text-xs text-yellow-300">🔊 Brew Voice</label>
                            <button
                                onClick={toggleVoice}
                                className="text-sm bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-1 rounded"
                            >
                                {showVoice ? "Mute Brew" : "Unmute Brew"}
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="text-xs text-neutral-400 hover:text-yellow-300 mt-4"
                        >
                            Close
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}