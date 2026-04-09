import { LotteryBall } from './LotteryBall';

interface ColdNumbersCardProps {
  numbers: number[];
  bonus?: number;
  bonusLabel?: string;
  showBonus?: boolean;
}

export function ColdNumbersCard({
  numbers,
  bonus,
  bonusLabel = 'Powerball',
  showBonus = true,
}: ColdNumbersCardProps) {
  const hasNumbers = numbers.length > 0;
  const hasBonus = showBonus && bonus !== undefined;

  return (
    <div className="rounded-[30px] border border-[#72caff]/30 bg-gradient-to-br from-[#72caff]/15 to-[#58a9ff]/5 p-5 shadow-[0_4px_24px_rgba(114,202,255,0.15)]">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg">❄️</span>
        <h3 className="text-[16px] font-semibold text-white">Cold Numbers</h3>
      </div>

      {/* Primary numbers */}
      {hasNumbers ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {numbers.map((num) => (
            <LotteryBall
              key={num}
              number={num}
              variant="cold"
              size="large"
            />
          ))}
        </div>
      ) : (
        <div className="mb-4 text-[13px] text-white/55">
          Brew needs more live draw history before cold-number signals can be shown.
        </div>
      )}

      {/* Bonus number */}
      {hasBonus && (
        <div className="flex flex-col items-start gap-1">
          <LotteryBall
            number={bonus}
            variant="bonus-cold"
            size="large"
            label={bonusLabel}
          />
        </div>
      )}
    </div>
  );
}
