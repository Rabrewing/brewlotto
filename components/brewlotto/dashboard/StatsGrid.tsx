import { HotNumbersCard } from './HotNumbersCard';
import { ColdNumbersCard } from './ColdNumbersCard';
import { MomentumMeter } from './MomentumMeter';

type DashboardBallSize = 'extraSmall' | 'small' | 'medium' | 'large';

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
  const ballSize: DashboardBallSize =
    game === 'powerball' || game === 'mega'
      ? 'extraSmall'
      : game === 'cash5'
        ? 'extraSmall'
        : 'medium';
  const centerBonus = game === 'powerball' || game === 'mega';

  return (
    <div className="mb-3 grid grid-cols-[minmax(0,1fr)_132px] items-stretch gap-2 sm:grid-cols-[minmax(0,1fr)_138px] sm:gap-2">
      {/* Left: Hot & Cold Numbers */}
      <div className="flex min-w-0 flex-col gap-2">
        <HotNumbersCard
          numbers={hotNumbers}
          bonus={hotBonus}
          bonusLabel={bonusLabel}
          showBonus={showBonus}
          ballSize={ballSize}
          centerBonus={centerBonus}
        />
        <ColdNumbersCard
          numbers={coldNumbers}
          bonus={coldBonus}
          bonusLabel={bonusLabel}
          showBonus={showBonus}
          ballSize={ballSize}
          centerBonus={centerBonus}
        />
      </div>

      {/* Right: Momentum Meter */}
      <div className="min-w-0 w-[118px] justify-self-center sm:w-[124px]">
        <MomentumMeter percent={momentumPercent} />
      </div>
    </div>
  );
}
