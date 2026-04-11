'use client';
import { useEffect, useState } from 'react';

interface DeferredPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function PwaInstall() {
  const [deferred, setDeferred] = useState<DeferredPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      const installEvent = event as DeferredPromptEvent;
      installEvent.preventDefault();
      setDeferred(installEvent);
    };
    const onInstalled = () => setInstalled(true);

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed || !deferred) {
    return null;
  }

  const onInstall = async () => {
    if (!deferred) {
      return;
    }

    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  return (
    <button
      onClick={onInstall}
      className="rounded-full border border-[#FFD700]/35 bg-[#1a1a1c] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FFD700] transition hover:border-[#FFD700]/55 hover:bg-[#232326]"
    >
      Install App
    </button>
  );
}
