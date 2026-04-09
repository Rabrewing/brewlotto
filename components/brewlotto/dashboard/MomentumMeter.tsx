interface MomentumMeterProps {
  percent: number; // 0-100
}

export function MomentumMeter({ percent }: MomentumMeterProps) {
  const clampedPercent = Math.max(0, Math.min(100, percent));

  return (
    <div className="flex h-full min-h-[430px] flex-col rounded-[30px] border border-[#ffbd39]/20 bg-gradient-to-b from-[#17120f]/95 to-[#0b090a]/95 px-4 py-5 shadow-[inset_0_0_24px_rgba(255,179,0,0.04)]">
      <span className="text-left text-[14px] font-medium tracking-[0.02em] text-[#ffc96a] sm:text-[15px]">
        Momentum Meter
      </span>

      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <div className="relative flex h-[270px] w-full items-center justify-center overflow-hidden rounded-[28px] border border-[#ffbd39]/10 bg-[radial-gradient(circle_at_center,rgba(255,189,57,0.08),transparent_68%)]">
          <div className="pointer-events-none absolute inset-y-6 left-[calc(50%-38px)] w-px bg-gradient-to-b from-transparent via-[#ffbd39]/18 to-transparent" />
          <div className="pointer-events-none absolute inset-y-6 right-[calc(50%-38px)] w-px bg-gradient-to-b from-transparent via-[#ffbd39]/18 to-transparent" />

          <div className="relative flex h-[220px] w-[68px] items-center justify-center rounded-[999px] border border-[#6f4b17] bg-gradient-to-b from-[#090707] via-[#161012] to-[#090707] shadow-[inset_0_0_24px_rgba(0,0,0,0.9),0_0_22px_rgba(255,161,44,0.08)]">
            <div className="absolute inset-y-3 left-1/2 w-[24px] -translate-x-1/2 rounded-[999px] bg-gradient-to-b from-[#120d09] to-[#050404] shadow-[inset_0_0_12px_rgba(0,0,0,0.8)]" />

            <div className="absolute inset-y-5 left-1/2 w-[3px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#ffdb8d]/40 to-transparent blur-[1px]" />

            <div
              className="absolute bottom-5 left-1/2 w-[18px] -translate-x-1/2 rounded-[999px] bg-gradient-to-t from-[#ff8a1f] via-[#ffc63d] to-[#fff0a8] shadow-[0_0_22px_rgba(255,184,28,0.7)] transition-all duration-1000"
              style={{ height: `${Math.max(18, Math.round(clampedPercent * 1.6))}px` }}
            >
              <div className="absolute inset-x-0 top-0 h-4 rounded-t-[999px] bg-gradient-to-b from-white/50 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_70%)]" />
            </div>

            <div className="pointer-events-none absolute inset-y-6 left-1/2 w-[28px] -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(255,204,94,0.35),transparent_70%)] blur-md" />

            <div className="pointer-events-none absolute inset-y-7 left-[14px] flex flex-col justify-between text-[#d18d32]/50">
              <span className="text-[18px] leading-none">~</span>
              <span className="text-[18px] leading-none">~</span>
              <span className="text-[18px] leading-none">~</span>
              <span className="text-[18px] leading-none">~</span>
              <span className="text-[18px] leading-none">~</span>
            </div>
            <div className="pointer-events-none absolute inset-y-7 right-[14px] flex flex-col justify-between text-[#d18d32]/50">
              <span className="text-[18px] leading-none">~</span>
              <span className="text-[18px] leading-none">~</span>
              <span className="text-[18px] leading-none">~</span>
              <span className="text-[18px] leading-none">~</span>
              <span className="text-[18px] leading-none">~</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[56px] font-semibold leading-none text-[#ffc96a] drop-shadow-[0_0_10px_rgba(255,199,66,0.38)] sm:text-[60px]">
            {clampedPercent}%
          </span>
          <span className="mt-2 text-center text-[13px] text-white/72 sm:text-[14px]">
            Win Probability
          </span>
        </div>
      </div>
    </div>
  );
}
