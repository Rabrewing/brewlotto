import { HotNumbersCard } from './HotNumbersCard';
import { ColdNumbersCard } from './ColdNumbersCard';
import { MomentumMeter } from './MomentumMeter';

interface StatsGridProps {
  hotNumbers: number[];
  hotBonus?: number;
  coldNumbers: number[];
  coldBonus?: number;
  momentumPercent: number;
  game: 'powerball' | 'mega' | 'cash5' | 'pick3' | 'pick4';
  showBonus?: boolean;
}

export function StatsGrid({
  hotNumbers,
  hotBonus,
  coldNumbers,
  coldBonus,
  momentumPercent,
  game,
  showBonus = true,
}: StatsGridProps) {
  const bonusLabel = game === 'mega' ? 'Mega Ball' : 'Powerball';

  return (
    <div className="mb-5 grid grid-cols-[1.9fr_0.85fr] gap-4">
      {/* Left: Hot & Cold Numbers */}
      <div className="flex flex-col gap-4">
        <HotNumbersCard
          numbers={hotNumbers}
          bonus={hotBonus}
          bonusLabel={bonusLabel}
          showBonus={showBonus}
        />
        <ColdNumbersCard
          numbers={coldNumbers}
          bonus={coldBonus}
          bonusLabel={bonusLabel}
          showBonus={showBonus}
        />
      </div>

      {/* Right: Momentum Meter */}
      <MomentumMeter percent={momentumPercent} />
    </div>
  );
}