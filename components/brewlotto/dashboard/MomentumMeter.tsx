interface MomentumMeterProps {
  percent: number; // 0-100
}

export function MomentumMeter({ percent }: MomentumMeterProps) {
  return (
    <div className="flex flex-col items-center rounded-[30px] border border-white/10 bg-gradient-to-b from-[#120e0e]/80 to-[#0a0a0c]/80 p-4">
      {/* Header */}
      <span className="mb-4 text-[12px] font-medium uppercase tracking-[0.22em] text-[#d6d1cf]">
        Momentum Meter
      </span>

      {/* Tube container */}
      <div className="relative h-[180px] w-[52px] overflow-hidden rounded-[40px] border border-[#ffd364]/30 bg-gradient-to-b from-[#0a0a0c] to-[#120e0e] shadow-[inset_0_0_12px_rgba(255,179,0,0.08)]">
        {/* Liquid fill */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-1000"
          style={{ height: `${percent}%` }}
        >
          {/* Gradient liquid */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#ffc742] via-[#ffd364] to-[#ffbe27]" />
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 animate-pulse bg-gradient-to-t from-transparent via-white/20 to-transparent" />
          
          {/* Top highlight */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-white/40 to-transparent" />
        </div>

        {/* Liquid glow */}
        <div className="absolute bottom-0 left-0 right-0 shadow-[0_0_18px_rgba(255,153,0,0.45)]" style={{ height: `${percent}%` }} />

        {/* Tick marks */}
        <div className="absolute inset-0 flex flex-col justify-between py-4">
          {[100, 75, 50, 25].map((tick) => (
            <div key={tick} className="flex items-center">
              <div className="h-px w-2 bg-white/20" />
            </div>
          ))}
        </div>
      </div>

      {/* Percentage display */}
      <div className="mt-4 flex flex-col items-center">
        <span className="text-[52px] font-semibold leading-none text-[#ffc742] drop-shadow-[0_0_8px_rgba(255,199,66,0.5)]">
          {percent}%
        </span>
        <span className="mt-1 text-[12px] font-medium text-white/60">
          Win Probability
        </span>
      </div>
    </div>
  );
}