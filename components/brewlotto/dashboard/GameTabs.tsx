'use client';

export type GameId = 'pick3' | 'pick4' | 'cash5' | 'powerball' | 'mega';

interface Game {
  id: GameId;
  label: string;
}

const GAMES: Game[] = [
  { id: 'pick3', label: 'Pick 3' },
  { id: 'pick4', label: 'Pick 4' },
  { id: 'cash5', label: 'Cash 5' },
  { id: 'powerball', label: 'Powerball' },
  { id: 'mega', label: 'Mega' },
];

interface GameTabsProps {
  selectedGame?: GameId;
  onSelect?: (game: GameId) => void;
}

export function GameTabs({ selectedGame = 'powerball', onSelect }: GameTabsProps) {

  return (
    <div className="mb-3 flex flex-wrap gap-1.5">
      {GAMES.map((game) => (
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
  );
}
