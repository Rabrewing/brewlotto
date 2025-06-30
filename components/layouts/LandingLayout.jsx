// @components/layouts/LandingLayout.jsx
// Updated: 2025-06-28T02:50 EDT
// Description: Base landing page layout with header, BrewBot toast overlay, and main content region

import HamburgerMenu from "../nav/HamburgerMenu";
import BrewLottoBot from "../ui/BrewLottoBot";

export default function LandingLayout({ user, children }) {
    return (
        <div className="min-h-screen bg-[#181818] text-white relative px-4 pb-24">

            {/* Header nav menu */}
            <HamburgerMenu user={user} />

            {/* Primary content area */}
            <main className="pt-16 max-w-6xl mx-auto">{children}</main>

            {/* Floating BrewBot notification system */}
            <BrewLottoBot />

        </div>
    );
}