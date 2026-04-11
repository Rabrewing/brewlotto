type BallVariant = 'hot' | 'cold' | 'bonus-hot' | 'bonus-cold';
type BallSize = 'tiny' | 'extraSmall' | 'small' | 'medium' | 'large';

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
  tiny: 'h-7 w-7 text-[11px] sm:h-8 sm:w-8 sm:text-[13px]',
  extraSmall: 'h-8 w-8 text-[13px] sm:h-9 sm:w-9 sm:text-[14px]',
  small: 'h-9 w-9 text-[14px] sm:h-10 sm:w-10 sm:text-[15px]',
  medium: 'h-[42px] w-[42px] text-[16px] sm:h-[46px] sm:w-[46px] sm:text-[18px]',
  large: 'h-[48px] w-[48px] text-[20px] sm:h-[54px] sm:w-[54px] sm:text-[22px]',
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
        <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/60 sm:text-[10px]">
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
