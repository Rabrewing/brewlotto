import { LotteryBall } from './LotteryBall';

type DashboardBallSize = 'extraSmall' | 'small' | 'medium' | 'large';

interface HotNumbersCardProps {
  numbers: number[];
  bonus?: number;
  bonusLabel?: string;
  showBonus?: boolean;
  ballSize?: DashboardBallSize;
  centerBonus?: boolean;
}

export function HotNumbersCard({
  numbers,
  bonus,
  bonusLabel = 'Powerball',
  showBonus = true,
  ballSize = 'large',
  centerBonus = false,
}: HotNumbersCardProps) {
  const hasNumbers = numbers.length > 0;
  const hasBonus = showBonus && bonus !== undefined;

  return (
    <div className="relative rounded-[30px] border border-[#ffbd39]/34 bg-gradient-to-br from-[#ffbd39]/15 to-[#ffb84a]/5 p-4 shadow-[0_4px_24px_rgba(255,189,57,0.15),0_0_18px_rgba(255,199,66,0.08)] lg:p-4 xl:p-5">
      <div className="pointer-events-none absolute inset-x-6 bottom-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#ffc742] to-transparent shadow-[0_0_14px_rgba(255,199,66,0.8)]" />
      {/* Header */}
      <div className="mb-2.5 flex items-center gap-2">
        <span className="text-lg">🔥</span>
        <h3 className="text-[15px] font-semibold text-white sm:text-[16px]">Hot Numbers</h3>
      </div>

      {/* Primary numbers */}
      {hasNumbers ? (
        <div className="mb-2.5 flex flex-wrap gap-2 sm:gap-2.5">
          {numbers.map((num) => (
            <LotteryBall
              key={num}
              number={num}
              variant="hot"
              size={ballSize}
            />
          ))}
        </div>
      ) : (
        <div className="mb-2.5 text-[12px] leading-5 text-white/55 sm:text-[13px]">
          Brew has not stored enough live draw data to rank hot numbers yet.
        </div>
      )}

      {/* Bonus number */}
      {hasBonus && (
        <div className={`flex flex-col gap-1 ${centerBonus ? 'items-center' : 'items-start'}`}>
          <LotteryBall
            number={bonus}
            variant="bonus-hot"
            size={ballSize}
            label={bonusLabel}
          />
        </div>
      )}
    </div>
  );
}
