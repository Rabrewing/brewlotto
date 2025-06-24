import Link from "next/link";

export default function NavBar() {
    return (
        <nav className="w-full bg-[#232323] text-[#FFD700] py-4 px-6 flex items-center justify-between shadow-lg sticky top-0 z-50">
            <div className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                <img src="/brewlotto-logo.png" alt="BrewLotto" className="w-8 h-8 rounded-full" draggable={false} />
                BrewLotto AI
            </div>
            <div className="flex flex-wrap gap-6 font-semibold text-lg justify-end">
                <Link href="/pick3" className="hover:text-white transition">Pick 3</Link>
                <Link href="/pick4" className="hover:text-white transition">Pick 4</Link>
                <Link href="/pick5" className="hover:text-white transition">Pick 5</Link>
                <Link href="/mega" className="hover:text-white transition">Mega Millions</Link>
                <Link href="/powerball" className="hover:text-white transition">Powerball</Link>
                <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
            </div>
        </nav>
    );
}
