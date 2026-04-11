'use client';

import { useState } from 'react';
import { AvatarDropdown } from './AvatarDropdown';
import { BotBadge } from './BotBadge';
import PwaInstall from '@/components/PwaInstall';

interface HeaderProps {
  logoSrc?: string;
}

export function Header({ logoSrc = "/frontend/brew_logo.png" }: HeaderProps) {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="mb-4">
      <div className="flex items-start justify-between">
        {/* Left: Branding */}
        <div className="flex flex-col">
          {/* BrewVerse Labs sub-header */}
          <div className="mb-1 flex items-center gap-2">
            <div className="h-[2px] w-4 bg-gradient-to-r from-[#ffc742] to-[#ffd364]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#d6d1cf]">
              BrewVerse Labs
            </span>
          </div>
          
          {/* Main Logo - transparent PNG, tight crop */}
          <div className="drop-shadow-[0_0_18px_rgba(255,184,28,0.45)]">
            {!logoError ? (
              <img 
                src={logoSrc} 
                alt="BrewLotto" 
                className="h-[24px] w-auto object-contain sm:h-[28px]"
                onError={() => setLogoError(true)}
              />
            ) : (
              /* Text fallback - matches Figma exactly */
              <h1 className="bg-gradient-to-r from-[#ffc742] via-[#ffd364] to-[#ffbe27] bg-clip-text text-[36px] font-black uppercase tracking-wide text-transparent sm:text-[42px]">
                BrewLotto
              </h1>
            )}
          </div>
        </div>

        {/* Right: Avatar + Bot Badge */}
        <div className="flex items-center gap-3">
          <PwaInstall />
          <BotBadge />
          <AvatarDropdown />
        </div>
      </div>
      
      {/* Accent bar */}
      <div className="mt-3 h-[1px] w-full bg-gradient-to-r from-[#ffd364]/40 via-[#ffc742]/20 to-transparent" />
    </header>
  );
}
