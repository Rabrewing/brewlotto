'use client';

import { getDashboardGameTabs, type DashboardStateCode, type DashboardGameId } from '@/lib/dashboard/game-config';

export type GameId = DashboardGameId;

interface GameTabsProps {
  selectedGame?: GameId;
  onSelect?: (game: GameId) => void;
  stateCode?: DashboardStateCode;
}

export function GameTabs({ selectedGame = 'pick3', onSelect, stateCode = 'NC' }: GameTabsProps) {
  const games = getDashboardGameTabs(stateCode);

  return (
    <div className="mb-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-w-max gap-1.5">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => onSelect?.(game.id)}
            className={`rounded-full border px-3 py-1 text-[12px] font-medium transition-all ${
              selectedGame === game.id
                ? 'border-[#ffe08a] bg-gradient-to-r from-[#ffc742] to-[#ffd364] text-black ring-1 ring-[#fff0ab]/35 shadow-[0_0_16px_rgba(255,199,66,0.54),0_0_28px_rgba(255,174,42,0.2)]'
                : 'border-white/20 bg-[#1a1a1c]/80 text-white/80 hover:border-[#ffd364]/30 hover:text-white hover:shadow-[0_0_12px_rgba(255,199,66,0.14)]'
            }`}
          >
            {game.label}
          </button>
        ))}
      </div>
    </div>
  );
}
