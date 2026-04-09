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
      className="group flex items-center justify-between gap-3 rounded-full border border-white/10 bg-[#1a1a1c]/80 px-5 py-3 text-white/80 transition-all hover:border-white/20 hover:bg-[#232326] hover:text-white"
    >
      <div className="flex items-center gap-3">
        <span className="text-lg transition-transform group-hover:scale-110">{icon}</span>
        <div className="flex flex-col">
          <span className="text-[16px] font-medium">{label}</span>
          {caption ? <span className="text-[11px] uppercase tracking-[0.14em] text-white/35">{caption}</span> : null}
        </div>
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
    <div className="mb-5 grid grid-cols-2 gap-4">
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
