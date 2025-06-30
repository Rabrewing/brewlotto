// @components/user/ReplayModal.jsx
// Updated: 2025-06-28T14:12 EDT
// Tier-aware replay modal with BrewBot commentary and access gating

import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import BrewCommentaryEngine from "@/components/ui/BrewCommentaryEngine";
import { useUserTier } from "@/hooks/useUserTier";
import { hasTierAccess } from "@/utils/tier-utils";
import { useBrewBotContext } from "@/components/context/BrewBotContext";
import toast from "react-hot-toast";

export default function ReplayModal({
    open,
    onClose,
    predicted = [],
    actual = [],
    insight = "",
    strategy = "random",
}) {
    const { currentTier } = useUserTier();
    const { prompt } = useBrewBotContext();

    const unlocked = hasTierAccess(currentTier, "master");

    const handleBlocked = () => {
        toast("Replay is a Master Tier feature.");
        prompt("Replay is a Master Tier feature. Unlock to visualize your strategy in action.");
        onClose();
    };

    return (
        <AnimatePresence>
            {open && (
                <Dialog as="div" className="relative z-50" onClose={onClose}>
                    <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="bg-neutral-950 rounded border border-yellow-500 shadow-xl p-6 w-full max-w-md text-neutral-200 space-y-5">

                            <Dialog.Title className="text-lg font-semibold">
                                🔁 Replay: Prediction Breakdown
                            </Dialog.Title>

                            {!unlocked ? (
                                <div className="text-center text-yellow-300 text-sm space-y-4">
                                    <p>🔒 Replay is available in <strong>Master Tier</strong>.</p>
                                    <button
                                        onClick={handleBlocked}
                                        className="w-full mt-2 bg-yellow-500 hover:bg-yellow-400 text-black py-2 rounded font-semibold"
                                    >
                                        Upgrade to Unlock
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4 text-center font-mono text-xl">
                                        <div>
                                            <div className="text-yellow-400">🎯 Your Pick</div>
                                            <div className="flex justify-center gap-2 mt-1">
                                                {predicted.map((n, i) => (
                                                    <motion.span
                                                        key={i}
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.3 }}
                                                        className="w-10 py-1 bg-neutral-800 border border-neutral-700 rounded"
                                                    >
                                                        {String(n).padStart(2, "0")}
                                                    </motion.span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-green-400">🔢 Drawn</div>
                                            <div className="flex justify-center gap-2 mt-1">
                                                {actual.map((n, i) => (
                                                    <motion.span
                                                        key={i}
                                                        initial={{ opacity: 0, y: -6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.3 + 0.15 }}
                                                        className="w-10 py-1 bg-neutral-800 border border-neutral-700 rounded"
                                                    >
                                                        {String(n).padStart(2, "0")}
                                                    </motion.span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 text-sm text-yellow-300">
                                        <BrewCommentaryEngine
                                            status="success"
                                            strategy={strategy}
                                            mode="strategist"
                                            speak={false}
                                        >
                                            {insight}
                                        </BrewCommentaryEngine>
                                    </div>

                                    <button
                                        onClick={onClose}
                                        className="w-full mt-4 bg-yellow-500 hover:bg-yellow-400 text-black py-2 rounded font-semibold"
                                    >
                                        Close Replay
                                    </button>
                                </>
                            )}
                        </Dialog.Panel>
                    </div>
                </Dialog>
            )}
        </AnimatePresence>
    );
}