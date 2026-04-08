# BrewLotto — PWA Setup & Customer Nav (MVP)

//timestamp: 2025-11-10 00:00 UTC
//brief summary: Production-ready Next.js PWA setup with Install button, offline fallback, and built-in customer navigation dropdown. Includes QA checklist and BrewPulse audit notes.

---

## ✅ Overview

This guide enables BrewLotto to run as an installable Progressive Web App (PWA) with a customer-facing navigation dropdown and a visible **Install App** control. It uses **Next.js (App Router) + next-pwa + Tailwind** and is compatible with Vercel deployments.

---

## 🔧 Requirements

* Next.js 14/15 (App Router)
* pnpm
* Tailwind CSS
* `next-pwa` plugin

---

## 📦 Install & Configure

**1) Install dependency**

```bash
pnpm add next-pwa
```

**2) Configure Next**
Create/update `next.config.js`:

```js
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // enable in prod
  fallbacks: {
    image: '/icons/icon-192.png',
    document: '/offline.html',
  },
});

module.exports = withPWA({
  reactStrictMode: true,
});
```

**3) App metadata**
Add manifest & theme in `app/layout.tsx`:

```ts
export const metadata = {
  title: 'BrewLotto',
  description: 'AI-powered lottery insights and smart picks.',
  manifest: '/manifest.webmanifest',
  themeColor: '#FFD700',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};
```

**4) Web App Manifest**
`public/manifest.webmanifest`:

```json
{
  "name": "BrewLotto",
  "short_name": "BrewLotto",
  "description": "AI-powered lottery insights, strategies, and smart picks.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#181818",
  "theme_color": "#FFD700",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

**5) Offline fallback**
Create `public/offline.html` (simple branded page).

**6) Icons**
Add PNGs into `public/icons/` (192, 512, maskable-512). Use Brew-Gold + transparent background.

---

## 🧩 UI Components (Install Button + Customer Dropdown)

**`components/PwaInstall.tsx`** — handles `beforeinstallprompt`:

```tsx
'use client';
import { useEffect, useState } from 'react';
export default function PwaInstall(){
  const [deferred, setDeferred] = useState<any>(null);
  const [installed, setInstalled] = useState(false);
  useEffect(()=>{
    const onPrompt=(e:any)=>{ e.preventDefault(); setDeferred(e); };
    const onInstalled=()=> setInstalled(true);
    window.addEventListener('beforeinstallprompt', onPrompt as any);
    window.addEventListener('appinstalled', onInstalled);
    return ()=>{
      window.removeEventListener('beforeinstallprompt', onPrompt as any);
      window.removeEventListener('appinstalled', onInstalled);
    };
  },[]);
  if(installed) return null;
  const onInstall = async()=>{
    if(!deferred) return; deferred.prompt(); await deferred.userChoice; setDeferred(null);
  };
  return (
    <button onClick={onInstall} className="rounded-2xl border border-[#FFD700]/40 bg-[#1a1a1c] px-3 py-1 text-sm font-semibold text-[#FFD700] hover:bg-[#232326]">Install App</button>
  );
}
```

**`components/CustomerNavDropdown.tsx`** — customer navigation:

```tsx
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
```

**`components/Header.tsx`** — combines logo, dropdown, install:

```tsx
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
```

**`app/page.tsx`** — dashboard stub:

```tsx
export default function Page(){
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-[#101012] p-4">
        <h2 className="mb-3 text-base font-semibold text-[#FFD700]">Hot Numbers</h2>
        <div className="flex gap-2">{['3','14','29'].map(n=> (
          <div key={n} className="rounded-xl bg-[#19191b] px-4 py-3 font-bold">{n}</div>
        ))}</div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-[#101012] p-4">
        <h2 className="mb-3 text-base font-semibold text-[#FFD700]">Cold Numbers</h2>
        <div className="flex gap-2">{['16','26','61'].map(n=> (
          <div key={n} className="rounded-xl bg-[#19191b] px-4 py-3 font-bold">{n}</div>
        ))}</div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-[#101012] p-4 md:col-span-2">
        <h2 className="mb-2 text-base font-semibold text-[#FFD700]">Prediction</h2>
        <p className="text-sm text-white/80">Brew says the trend favors low and even numbers.</p>
        <button className="mt-4 rounded-2xl bg-[#FFD700] px-5 py-2 text-black font-bold hover:brightness-95">Generate My Smart Pick</button>
      </div>
    </section>
  );
}
```

---

## 🧪 QA: PWA & UX Checklist (BrewPulse)

* [ ] Manifest valid; icons load (192/512/maskable)
* [ ] Service worker registers in production
* [ ] App is **Installable** (Chrome → Install App, iOS Add to Home)
* [ ] Offline: `offline.html` shows when network drops
* [ ] Lighthouse PWA score ≥ 90
* [ ] Header sticky; dropdown closes on selection/blur
* [ ] Install button only appears when `beforeinstallprompt` fires
* [ ] Touch targets ≥ 44px; text contrast meets WCAG AA

---

## 🛠️ Troubleshooting

* SW doesn’t register locally → `disable` is true in dev. Build a prod build: `pnpm build && pnpm start`.
* Icons not maskable → ensure 512x512 PNG with safe padding and `purpose: "maskable"`.
* Install button not showing → Clear app data, ensure HTTPS, check `beforeinstallprompt` firing.

---

## 🚀 Deployment

* Vercel production URL will enable service worker.
* Re-test **Install** and offline behaviors post-deploy.

---

## 📌 Next Steps

* Add **Voice Mode** orb and mic permission flow.
* Add **Game Selector Tabs** (Pick3/4, Cash5, Powerball, Mega Millions) above dashboard.
* Hook **Smart Pick** to strategy engine (`smartPick()` w/ Poisson/Markov/Entropy).
* Log PWA events (installed, first-open) to Supabase `telemetry_pwa` table.

//end
