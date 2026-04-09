type BallVariant = 'hot' | 'cold' | 'bonus-hot' | 'bonus-cold';
type BallSize = 'small' | 'large';

interface LotteryBallProps {
  number: number;
  variant: BallVariant;
  size?: BallSize;
  label?: string;
}

const VARIANT_STYLES: Record<BallVariant, string> = {
  hot: 'bg-gradient-to-br from-[#ffbd39] to-[#ffb84a] text-black shadow-[0_2px_8px_rgba(255,189,57,0.4)]',
  cold: 'bg-gradient-to-br from-[#e8eef5] to-[#c3cfd9] text-[#1e3a5f] shadow-[0_2px_8px_rgba(114,202,255,0.4)]',
  'bonus-hot': 'bg-gradient-to-br from-[#d65c5c] to-[#b94a4a] text-[#ffd364]',
  'bonus-cold': 'bg-gradient-to-br from-[#5c7fd6] to-[#4a68b9] text-white',
};

const SIZE_STYLES: Record<BallSize, string> = {
  small: 'h-10 w-10 text-[15px]',
  large: 'h-[52px] w-[52px] text-[22px] sm:h-[58px] sm:w-[58px] sm:text-[24px]',
};

export function LotteryBall({ number, variant, size = 'large', label }: LotteryBallProps) {
  const isBonus = variant.startsWith('bonus');

  if (isBonus && label) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div
          className={`relative flex items-center justify-center rounded-full font-bold ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]}`}
        >
          {/* Inner glow */}
          <div className="absolute inset-1 rounded-full bg-white/10" />
          <span className="relative z-10">{String(number).padStart(2, '0')}</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/60">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center rounded-full font-bold ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]}`}
    >
      {/* Inner glow */}
      <div className="absolute inset-1 rounded-full bg-white/10" />
      <span className="relative z-10">{String(number).padStart(2, '0')}</span>
    </div>
  );
}