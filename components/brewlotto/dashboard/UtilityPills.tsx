import Link from 'next/link';

interface UtilityPillProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  caption?: string;
}

type UtilityGameId = 'powerball' | 'mega' | 'cash5' | 'pick3' | 'pick4';

const GAME_ROUTE_MAP: Record<UtilityGameId, string> = {
  powerball: '/powerball',
  mega: '/mega',
  cash5: '/pick5',
  pick3: '/pick3',
  pick4: '/pick4',
};

function UtilityPill({ href, icon, label, caption }: UtilityPillProps) {
  return (
    <Link
      href={href}
      className="group flex min-w-0 items-center gap-2.5 rounded-full border border-white/10 bg-[#1a1a1c]/80 px-3.5 py-2 text-white/80 shadow-[inset_0_0_14px_rgba(255,199,66,0.02)] transition-all hover:border-[#ffd364]/25 hover:bg-[#232326] hover:text-white hover:shadow-[0_0_14px_rgba(255,199,66,0.08)]"
    >
      <span className="text-lg transition-transform group-hover:scale-110">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-medium leading-none">{label}</div>
        {caption ? <div className="mt-0.5 truncate text-[9px] uppercase tracking-[0.14em] text-white/35">{caption}</div> : null}
      </div>
      <div className="text-white/22 transition-colors group-hover:text-[#ffd364]/55">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

export function UtilityPills({
  freshnessStatus = 'unknown',
  game,
}: {
  freshnessStatus?: string;
  game: UtilityGameId;
}) {
  return (
    <div className="mb-3 grid grid-cols-2 gap-2.5">
      <UtilityPill
        href={GAME_ROUTE_MAP[game]}
        icon={<span>👤</span>}
        label="Open Game"
        caption={`Data ${freshnessStatus}`}
      />
      <UtilityPill
        href="/pricing"
        icon={<span>🔒</span>}
        label="Upgrade Tiers"
        caption="Premium methods"
      />
    </div>
  );
}
