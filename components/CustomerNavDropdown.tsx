'use client';
import { useState } from 'react';
import Link from 'next/link';
const items = [
  {label:'Dashboard', href:'/'},
  {label:'My Picks', href:'/picks'},
  {label:'Strategy Locker', href:'/strategies'},
  {label:'Insights', href:'/insights'},
  {label:'How It Works', href:'/learn'}
];
export default function CustomerNavDropdown(){
  const [open,setOpen]=useState(false);
  return (
    <div className="relative">
      <button onClick={()=>setOpen(v=>!v)} className="rounded-2xl border border-white/10 bg-[#151516] px-3 py-1.5 text-sm font-medium hover:bg-[#1c1c1e]">Menu</button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[#101012] p-2 shadow-xl" onMouseLeave={()=>setOpen(false)}>
          {items.map(it=> (
            <Link key={it.href} href={it.href} className="block rounded-xl px-3 py-2 text-sm hover:bg-white/5">{it.label}</Link>
          ))}
          <div className="my-2 h-px bg-white/10"/>
          <Link href="/settings" className="block rounded-xl px-3 py-2 text-sm hover:bg-white/5">Settings</Link>
        </div>
      )}
    </div>
  );
}