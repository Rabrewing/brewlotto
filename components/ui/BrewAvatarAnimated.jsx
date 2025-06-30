// =============================================
// 📁 /components/ui/BrewAvatarAnimated.jsx
// Created: 2025-06-27T04:10 EDT
// Summary: Animated Brew mascot using SVG with framer-motion status effects
// Reacts to "idle", "loading", "success", and "alert" modes
// SVG sourced from /public/assets/brewbot.svg
// =============================================

import { motion } from "framer-motion";

export default function BrewAvatarAnimated({ status = "idle", size = 80 }) {
    const statusMap = {
        idle: {
            glow: "#FFD700",
            animate: { scale: 1 },
            pulse: false,
        },
        loading: {
            glow: "#00C7B7",
            animate: { rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] },
            pulse: true,
        },
        success: {
            glow: "#00C7B7",
            animate: { scale: [1, 1.1, 1] },
            pulse: true,
        },
        alert: {
            glow: "#FF5A5F",
            animate: { rotate: [0, 4, -4, 0], scale: [1, 0.98, 1.02, 1] },
            pulse: true,
        },
    };

    const current = statusMap[status] || statusMap.idle;

    return (
        <motion.div
            className="rounded-full flex items-center justify-center shadow-lg"
            style={{
                width: size,
                height: size,
                backgroundColor: "#181818",
                border: `4px solid ${current.glow}`,
                padding: 6,
            }}
            animate={current.animate}
            transition={{
                duration: 1,
                repeat: current.pulse ? Infinity : 0,
                ease: "easeInOut",
            }}
            aria-label={`Brew avatar - ${status}`}
        >
            <object
                type="image/svg+xml"
                data="/assets/brewbot.svg"
                width="100%"
                height="100%"
                aria-label="Brew mascot"
                title="BrewLottoBot Mascot"
            />
        </motion.div>
    );
}