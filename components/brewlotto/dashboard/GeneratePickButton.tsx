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
      className="group relative w-full overflow-hidden rounded-[999px] bg-gradient-to-r from-[#ffc742] via-[#ffd364] to-[#ffbe27] px-6 py-4 text-[18px] font-bold text-black transition-all hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(255,199,66,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
    >
      {/* Inner shine */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
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
            Generate My Smart Pick
            <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </span>
    </button>
  );
}