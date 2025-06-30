// @pages/index.js
// @timestamp: 2025-06-25T21:12 EDT
// @description: Main landing page for the BrewLotto application, showcasing available lottery games and user profile integration.
import LandingLayout from "@/components/layouts/LandingLayout";
import GameCard from "@/components/landing/GameCard";
import { useUserProfile } from "@/hooks/useUserProfile"; // Or however you fetch user

export default function HomePage() {
    const { user } = useUserProfile();

    const games = [
        { name: "Pick 3", route: "/pick3" },
        { name: "Pick 4", route: "/pick4" },
        { name: "Pick 5", route: "/pick5" },
        { name: "Mega Millions", route: "/mega" },
        { name: "Powerball", route: "/powerball" },
    ];

    return (
        <LandingLayout user={user}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                    <GameCard key={game.route} game={game} user={user} />
                ))}
            </div>
        </LandingLayout>
    );
}