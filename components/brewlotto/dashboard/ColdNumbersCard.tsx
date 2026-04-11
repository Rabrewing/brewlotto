import { LotteryBall } from './LotteryBall';

type DashboardBallSize = 'extraSmall' | 'small' | 'medium' | 'large';

interface ColdNumbersCardProps {
  numbers: number[];
  bonus?: number;
  bonusLabel?: string;
  showBonus?: boolean;
  ballSize?: DashboardBallSize;
  centerBonus?: boolean;
}

export function ColdNumbersCard({
  numbers,
  bonus,
  bonusLabel = 'Powerball',
  showBonus = true,
  ballSize = 'large',
  centerBonus = false,
}: ColdNumbersCardProps) {
  const hasNumbers = numbers.length > 0;
  const hasBonus = showBonus && bonus !== undefined;

  return (
    <div className="relative rounded-[30px] border border-[#72caff]/34 bg-gradient-to-br from-[#72caff]/15 to-[#58a9ff]/5 p-4 shadow-[0_4px_24px_rgba(114,202,255,0.15),0_0_18px_rgba(255,199,66,0.05)] lg:p-4 xl:p-5">
      <div className="pointer-events-none absolute inset-x-6 bottom-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#8ad0ff] to-transparent shadow-[0_0_14px_rgba(114,202,255,0.72)]" />
      {/* Header */}
      <div className="mb-2.5 flex items-center gap-2">
        <span className="text-lg">❄️</span>
        <h3 className="text-[15px] font-semibold text-white sm:text-[16px]">Cold Numbers</h3>
      </div>

      {/* Primary numbers */}
      {hasNumbers ? (
        <div className="mb-2.5 flex flex-wrap gap-2 sm:gap-2.5">
          {numbers.map((num) => (
            <LotteryBall
              key={num}
              number={num}
              variant="cold"
              size={ballSize}
            />
          ))}
        </div>
      ) : (
        <div className="mb-2.5 text-[12px] leading-5 text-white/55 sm:text-[13px]">
          Brew needs more live draw history before cold-number signals can be shown.
        </div>
      )}

      {/* Bonus number */}
      {hasBonus && (
        <div className={`flex flex-col gap-1 ${centerBonus ? 'items-center' : 'items-start'}`}>
          <LotteryBall
            number={bonus}
            variant="bonus-cold"
            size={ballSize}
            label={bonusLabel}
          />
        </div>
      )}
    </div>
  );
}
