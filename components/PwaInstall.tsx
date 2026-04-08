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