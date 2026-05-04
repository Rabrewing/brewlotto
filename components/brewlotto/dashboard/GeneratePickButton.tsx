interface GeneratePickButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function GeneratePickButton({ onClick, disabled, loading }: GeneratePickButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="group relative mb-3 w-full overflow-hidden rounded-[999px] border border-[#fff0ab]/35 bg-gradient-to-r from-[#ffc742] via-[#ffd364] to-[#ffbe27] px-6 py-3 text-[16px] font-bold text-black shadow-[0_0_22px_rgba(255,199,66,0.34),0_10px_26px_rgba(255,170,24,0.22)] transition-all hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(255,199,66,0.46),0_14px_30px_rgba(255,170,24,0.28)] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 sm:text-[17px]"
    >
      {/* Inner shine */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-1/2 bg-gradient-to-b from-[#fff5c4]/35 to-transparent blur-md" />
      <div className="pointer-events-none absolute inset-x-6 bottom-[3px] h-[3px] rounded-full bg-gradient-to-r from-transparent via-[#fff1a8] to-transparent shadow-[0_0_14px_rgba(255,241,168,0.9)]" />
      
      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating...
          </>
        ) : (
          <>
            Generate Numbers
            <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </span>
    </button>
  );
}
