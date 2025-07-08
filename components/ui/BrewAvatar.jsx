// =============================================
// 📁 /components/ui/BrewAvatar.jsx
// Created: 2025-06-27T03:30 EDT
// Summary: Dynamic Brew avatar that auto-selects animated SVG or static PNG
// based on user preference, mobile mode, or reduced motion setting.
// =============================================

import { useEffect, useState } from "react";
import Image from "next/image";
import AnimatedSVG from "./BrewAvatarAnimated"; // This will be created next

export default function BrewAvatar({ status = "idle", avatarMode = "auto", size = 80 }) {
    const [usePNG, setUsePNG] = useState(false);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const isMobile = window.matchMedia("(max-width: 640px)").matches;
        const saveData = navigator?.connection?.saveData;

        const fallback =
            avatarMode === "png" ||
            (avatarMode === "auto" && (prefersReducedMotion || isMobile || saveData));

        setUsePNG(fallback);
    }, [avatarMode]);

    return usePNG ? (
        <Image
            src="/assets/brewbot.png"
            alt="Brew Avatar PNG"
            width={size}
            height={size}
            className="rounded-full shadow-lg"
        />
    ) : (
        <AnimatedSVG status={status} size={size} />
    );
}