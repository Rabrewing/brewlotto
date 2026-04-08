'use client';
import Link from 'next/link';
import CustomerNavDropdown from './CustomerNavDropdown';
import PwaInstall from './PwaInstall';
export default function Header(){
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0f0f10]/70 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-lg font-extrabold tracking-wide text-[#FFD700]">BREWLOTTO</Link>
          <nav className="hidden md:block"><CustomerNavDropdown/></nav>
        </div>
        <div className="flex items-center gap-3"><PwaInstall/>
          <Link href="/account" className="rounded-full border border-white/10 bg-[#1a1a1c] px-3 py-1.5 text-sm hover:bg-[#232326]">Account</Link>
        </div>
      </div>
    </header>
  );
}