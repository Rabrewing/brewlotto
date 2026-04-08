interface FreshnessBannerProps {
  status: 'healthy' | 'delayed' | 'stale' | 'failed' | 'unknown';
  stalenessMinutes: number | null;
  expectedNextDrawAt: string | null;
  loading?: boolean;
}

function formatMinutes(value: number | null) {
  if (value == null) {
    return 'unknown';
  }

  if (value < 60) {
    return `${value}m`;
  }

  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

function formatDate(value: string | null) {
  if (!value) {
    return 'not scheduled';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

const STATUS_STYLES = {
  healthy: 'border-[#53d48a]/30 bg-[#102117] text-[#93efb8]',
  delayed: 'border-[#ffc742]/30 bg-[#2b2210] text-[#ffd873]',
  stale: 'border-[#ff7d67]/30 bg-[#2a1311] text-[#ffcdc6]',
  failed: 'border-[#ff7d67]/40 bg-[#2a1311] text-[#ffb5a8]',
  unknown: 'border-white/10 bg-white/5 text-white/70',
};

export function FreshnessBanner({ status, stalenessMinutes, expectedNextDrawAt, loading = false }: FreshnessBannerProps) {
  const title = loading
    ? 'Checking source freshness'
    : status === 'healthy'
      ? 'Draw data is current'
      : status === 'delayed'
        ? 'Draw data is running late'
        : status === 'stale'
          ? 'Draw data is stale'
          : status === 'failed'
            ? 'Draw data is unavailable'
            : 'Freshness is unclear';

  const body = loading
    ? 'Brew is checking the latest ingestion window for this game.'
    : status === 'healthy'
      ? `The latest draw feed is within the expected freshness window. Next expected draw: ${formatDate(expectedNextDrawAt)}.`
      : status === 'delayed'
        ? `The feed is lagging behind the expected schedule by about ${formatMinutes(stalenessMinutes)}. Next expected draw: ${formatDate(expectedNextDrawAt)}.`
        : status === 'stale'
          ? `The latest stored draw is about ${formatMinutes(stalenessMinutes)} old, so pattern guidance may be behind live conditions.`
          : status === 'failed'
            ? 'No recent draw data is available for this game, so current insight quality is degraded until ingestion catches up.'
            : 'Brew could not determine whether the latest draw feed is current.';

  return (
    <div className={`mb-4 rounded-[24px] border p-4 ${STATUS_STYLES[status]}`}>
      <div className="flex flex-wrap items-start gap-3">
        <span className="rounded-full border border-current/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]">
          {loading ? 'checking' : status}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-semibold">{title}</div>
          <p className="mt-1 text-[13px] leading-6 opacity-90">{body}</p>
        </div>
      </div>
    </div>
  );
}
