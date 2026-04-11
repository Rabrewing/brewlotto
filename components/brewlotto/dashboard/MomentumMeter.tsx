interface MomentumMeterProps {
  percent: number; // 0-100
}

export function MomentumMeter({ percent }: MomentumMeterProps) {
  const clampedPercent = Math.max(0, Math.min(100, percent));
  const fillHeight = Math.max(18, Math.round(clampedPercent * 1.48));

  return (
    <div className="flex h-full min-h-[268px] flex-col rounded-[30px] border border-[#ffbd39]/24 bg-gradient-to-b from-[#17120f]/95 to-[#0b090a]/95 px-3 py-3 shadow-[0_0_18px_rgba(255,199,66,0.08),inset_0_0_24px_rgba(255,179,0,0.05)] sm:min-h-[284px] sm:px-3.5 sm:py-3.5">
      <span className="text-center text-[13px] font-medium tracking-[0.02em] text-[#ffc96a] sm:text-[14px]">
        Momentum Meter
      </span>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 sm:gap-3.5">
        <div className="relative flex h-[172px] w-full items-center justify-center overflow-hidden rounded-[28px] border border-[#ffbd39]/10 bg-[radial-gradient(circle_at_center,rgba(255,189,57,0.08),transparent_68%)] sm:h-[184px]">
          <div className="pointer-events-none absolute inset-y-5 left-[calc(50%-34px)] w-px bg-gradient-to-b from-transparent via-[#ffbd39]/18 to-transparent sm:left-[calc(50%-38px)]" />
          <div className="pointer-events-none absolute inset-y-5 right-[calc(50%-34px)] w-px bg-gradient-to-b from-transparent via-[#ffbd39]/18 to-transparent sm:right-[calc(50%-38px)]" />

          <div className="relative flex h-[156px] w-[50px] items-center justify-center rounded-[999px] border border-[#6f4b17] bg-gradient-to-b from-[#090707] via-[#161012] to-[#090707] shadow-[inset_0_0_24px_rgba(0,0,0,0.9),0_0_22px_rgba(255,161,44,0.08)] sm:h-[168px] sm:w-[54px]">
            <div className="absolute inset-y-3 left-1/2 w-[18px] -translate-x-1/2 rounded-[999px] bg-gradient-to-b from-[#120d09] to-[#050404] shadow-[inset_0_0_12px_rgba(0,0,0,0.8)] sm:w-[20px]" />

            <div className="absolute inset-y-4 left-1/2 w-[3px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#ffdb8d]/40 to-transparent blur-[1px] sm:inset-y-5" />

            <div
              className="absolute bottom-4 left-1/2 w-[14px] -translate-x-1/2 rounded-[999px] bg-gradient-to-t from-[#ff8a1f] via-[#ffc63d] to-[#fff0a8] shadow-[0_0_22px_rgba(255,184,28,0.7)] transition-all duration-1000 sm:w-[16px]"
              style={{ height: `${fillHeight}px` }}
            >
              <div className="absolute inset-x-0 top-0 h-4 rounded-t-[999px] bg-gradient-to-b from-white/50 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_70%)]" />
            </div>

            <div className="pointer-events-none absolute inset-y-5 left-1/2 w-[20px] -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(255,204,94,0.35),transparent_70%)] blur-md sm:w-[24px]" />

            <div className="pointer-events-none absolute inset-y-6 left-[12px] flex flex-col justify-between text-[#d18d32]/50 sm:left-[14px] sm:inset-y-7">
              <span className="text-[16px] leading-none sm:text-[18px]">~</span>
              <span className="text-[16px] leading-none sm:text-[18px]">~</span>
              <span className="text-[16px] leading-none sm:text-[18px]">~</span>
              <span className="text-[16px] leading-none sm:text-[18px]">~</span>
            </div>
            <div className="pointer-events-none absolute inset-y-6 right-[12px] flex flex-col justify-between text-[#d18d32]/50 sm:right-[14px] sm:inset-y-7">
              <span className="text-[16px] leading-none sm:text-[18px]">~</span>
              <span className="text-[16px] leading-none sm:text-[18px]">~</span>
              <span className="text-[16px] leading-none sm:text-[18px]">~</span>
              <span className="text-[16px] leading-none sm:text-[18px]">~</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[40px] font-semibold leading-none text-[#ffc96a] drop-shadow-[0_0_10px_rgba(255,199,66,0.38)] sm:text-[44px]">
            {clampedPercent}%
          </span>
          <span className="mt-2 text-center text-[12px] text-white/72 sm:text-[13px]">
            Win Probability
          </span>
        </div>
      </div>
    </div>
  );
}
