const TZ_MAP: Record<string, { zone: string; label: string }> = {
  NC: { zone: 'America/New_York', label: 'ET' },
  CA: { zone: 'America/Los_Angeles', label: 'PT' },
};

interface LiveTrustBadgeProps {
  status: 'healthy' | 'delayed' | 'stale' | 'failed' | 'unknown';
  latestDrawDate?: string | null;
  stalenessMinutes?: number | null;
  expectedNextDrawAt?: string | null;
  sourceLabel?: string;
  compact?: boolean;
  stateCode?: 'NC' | 'CA';
}

function formatDate(value: string | null, stateCode: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const tz = TZ_MAP[stateCode] || TZ_MAP.NC;
  return date.toLocaleString('en-US', {
    timeZone: tz.zone, month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

function formatMinutes(value: number | null) {
  if (value == null) return null;
  if (value < 60) return `${value}m`;
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

const STATUS_DOT = {
  healthy: 'bg-[#53d48a] shadow-[0_0_6px_rgba(83,212,138,0.6)]',
  delayed: 'bg-[#ffc742] shadow-[0_0_6px_rgba(255,199,66,0.6)]',
  stale: 'bg-[#ff7d67] shadow-[0_0_6px_rgba(255,125,103,0.6)]',
  failed: 'bg-[#ff5a4a] shadow-[0_0_6px_rgba(255,90,74,0.7)]',
  unknown: 'bg-white/40 shadow-[0_0_6px_rgba(255,255,255,0.2)]',
};

const STATUS_LABEL = {
  healthy: 'Live',
  delayed: 'Delayed',
  stale: 'Stale',
  failed: 'Unavailable',
  unknown: 'Checking',
};

const STATUS_TEXT = {
  healthy: 'text-[#93efb8]',
  delayed: 'text-[#ffd873]',
  stale: 'text-[#ffcdc6]',
  failed: 'text-[#ffb5a8]',
  unknown: 'text-white/60',
};

export function LiveTrustBadge({
  status,
  latestDrawDate,
  stalenessMinutes,
  expectedNextDrawAt,
  sourceLabel = 'Official Source',
  compact = false,
  stateCode = 'NC',
}: LiveTrustBadgeProps) {
  const staleness = formatMinutes(stalenessMinutes);
  const lastDraw = formatDate(latestDrawDate, stateCode);
  const nextDraw = formatDate(expectedNextDrawAt, stateCode);

  return (
    <div className={`inline-flex flex-col gap-1 ${STATUS_TEXT[status]}`}>
      <div className="flex items-center gap-2">
        <span className={`relative inline-block h-2 w-2 rounded-full ${STATUS_DOT[status]}`}>
          {status === 'healthy' && (
            <span className="absolute inset-0 animate-ping rounded-full bg-[#53d48a]/40" />
          )}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">
          {STATUS_LABEL[status]}
        </span>
        <span className="text-white/25">•</span>
        <span className="text-[10px] uppercase tracking-[0.1em] text-white/50">
          {sourceLabel}
        </span>
      </div>

      {!compact && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-white/45">
          {lastDraw && (
            <span>Latest: {lastDraw}</span>
          )}
          {staleness && status !== 'healthy' && (
            <span>{staleness} ago</span>
          )}
          {nextDraw && (
            <span>Next: {nextDraw}</span>
          )}
          <span className="text-white/20">•</span>
          <span className="text-white/30">Statistical insight only. No guaranteed wins.</span>
        </div>
      )}
    </div>
  );
}
