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
    <div className="mb-5 flex flex-wrap gap-2">
      {GAMES.map((game) => (
        <button
          key={game.id}
          onClick={() => onSelect?.(game.id)}
          className={`rounded-full border px-4 py-2 text-[15px] font-medium transition-all ${
            selectedGame === game.id
              ? 'border-[#ffd364] bg-gradient-to-r from-[#ffc742] to-[#ffd364] text-black shadow-[0_0_12px_rgba(255,199,66,0.4)]'
              : 'border-white/20 bg-[#1a1a1c]/80 text-white/80 hover:border-white/30 hover:text-white'
          }`}
        >
          {game.label}
        </button>
      ))}
    </div>
  );
}
