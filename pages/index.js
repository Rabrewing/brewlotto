export default function Home() {
    return (
        <main className="min-h-screen bg-[#181818] flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#FFD700] mb-4 text-center">
                BrewLotto AI
            </h1>
            <p className="text-white text-lg mb-10 text-center">
                Built on Trust. Driven by Probability.
            </p>

            {/* Feature Links */}
            <div className="flex flex-wrap gap-4 mb-12 justify-center w-full max-w-3xl">
                <a href="/pick3" className="w-44 px-4 py-3 rounded-xl font-bold bg-[#FFD700] text-[#181818] text-base hover:bg-white hover:text-[#FFD700] transition shadow text-center">
                    Pick 3 Smart Picks
                </a>
                <a href="/pick4" className="w-44 px-4 py-3 rounded-xl font-bold bg-[#FFD700] text-[#181818] text-base hover:bg-white hover:text-[#FFD700] transition shadow text-center">
                    Pick 4 Smart Picks
                </a>
                <a href="/pick5" className="w-44 px-4 py-3 rounded-xl font-bold bg-[#FFD700] text-[#181818] text-base hover:bg-white hover:text-[#FFD700] transition shadow text-center">
                    Pick 5 Smart Picks
                </a>
                <a href="/mega" className="w-44 px-4 py-3 rounded-xl font-bold bg-[#FFD700] text-[#181818] text-base hover:bg-white hover:text-[#FFD700] transition shadow text-center">
                    Mega Millions Smart Picks
                </a>
                <a href="/powerball" className="w-44 px-4 py-3 rounded-xl font-bold bg-[#FFD700] text-[#181818] text-base hover:bg-white hover:text-[#FFD700] transition shadow text-center">
                    Powerball Smart Picks
                </a>
                <a href="/dashboard" className="w-44 px-4 py-3 rounded-xl font-bold bg-[#FFD700] text-[#181818] text-base hover:bg-white hover:text-[#FFD700] transition shadow text-center">
                    Analytics Dashboard
                </a>
            </div>

            <footer className="w-full text-center text-gray-500 text-sm mt-8 mb-4">
                &copy; {new Date().getFullYear()} BrewLotto AI. All rights reserved.
            </footer>
        </main>
    );
}
