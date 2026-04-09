import { LotteryBall } from './LotteryBall';

interface HotNumbersCardProps {
  numbers: number[];
  bonus?: number;
  bonusLabel?: string;
  showBonus?: boolean;
}

export function HotNumbersCard({
  numbers,
  bonus,
  bonusLabel = 'Powerball',
  showBonus = true,
}: HotNumbersCardProps) {
  const hasNumbers = numbers.length > 0;
  const hasBonus = showBonus && bonus !== undefined;

  return (
    <div className="rounded-[30px] border border-[#ffbd39]/30 bg-gradient-to-br from-[#ffbd39]/15 to-[#ffb84a]/5 p-5 shadow-[0_4px_24px_rgba(255,189,57,0.15)]">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg">🔥</span>
        <h3 className="text-[16px] font-semibold text-white">Hot Numbers</h3>
      </div>

      {/* Primary numbers */}
      {hasNumbers ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {numbers.map((num) => (
            <LotteryBall
              key={num}
              number={num}
              variant="hot"
              size="large"
            />
          ))}
        </div>
      ) : (
        <div className="mb-4 text-[13px] text-white/55">
          Brew has not stored enough live draw data to rank hot numbers yet.
        </div>
      )}

      {/* Bonus number */}
      {hasBonus && (
        <div className="flex flex-col items-start gap-1">
          <LotteryBall
            number={bonus}
            variant="bonus-hot"
            size="large"
            label={bonusLabel}
          />
        </div>
      )}
    </div>
  );
}
