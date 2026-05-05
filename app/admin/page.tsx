"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AlertSummary {
  openCount: number;
  criticalOpenCount: number;
  warningOpenCount: number;
  acknowledgedCount: number;
  resolvedTodayCount: number;
  byCategory: Record<string, number>;
  latestCritical: {
    id: string;
    title: string;
    lastSeenAt: string;
  } | null;
}

interface AlertItem {
  id: string;
  alertKey: string;
  sourceModule: string;
  category: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'raised' | 'acknowledged' | 'resolved' | 'escalated';
  state: string | null;
  game: string | null;
  title: string;
  message: string;
  firstSeenAt: string;
  lastSeenAt: string;
  emailRequired: boolean;
  emailLastSentAt?: string | null;
}

type AlertStatusFilter = 'all' | AlertItem['status'];
type AlertSeverityFilter = 'all' | AlertItem['severity'];
type AlertCategoryFilter = 'all' | 'freshness' | 'ingestion' | 'validation' | 'system' | 'billing' | 'prediction';
type AlertDeliveryFilter = 'all' | 'sent' | 'failed';

interface IngestionHealthSummary {
  totalGames: number;
  failedRuns: number;
  gamesWithErrors: number;
  byFreshness: {
    healthy: number;
    delayed: number;
    stale: number;
    failed: number;
    unknown: number;
  };
}

interface IngestionHealthRow {
  gameId: string;
  gameName: string;
  gameKey: string;
  stateCode: string;
  freshnessStatus: 'healthy' | 'delayed' | 'stale' | 'failed' | 'unknown';
  freshnessSource: 'tracked' | 'derived';
  stalenessMinutes: number | null;
  latestDrawAt: string | null;
  latestDrawDate: string | null;
  expectedNextDrawAt: string | null;
  lastRunId: string | null;
  lastRunStatus: 'running' | 'succeeded' | 'partial' | 'failed' | 'unknown';
  lastRunStartedAt: string | null;
  lastRunFinishedAt: string | null;
  drawsSeen: number | null;
  drawsInserted: number | null;
  drawsUpdated: number | null;
  errorCount: number;
}

interface AiUsageRow {
  id: string;
  created_at: string;
  route: string;
  operation: string;
  provider: string;
  model: string;
  status: 'success' | 'error';
  latency_ms: number | null;
  input_tokens: number | null;
  output_tokens: number | null;
  total_tokens: number | null;
  estimated_cost_usd: number | null;
  user_email: string | null;
  error_message: string | null;
  metadata: Record<string, unknown> | null;
}

interface AiUsageSummary {
  requestCount: number;
  successCount: number;
  errorCount: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  averageLatencyMs: number | null;
  windowStart: string;
  windowEnd: string;
  totalRevenueUsd: number;
  totalGrossMarginUsd: number;
  totalMarginPct: number | null;
}

interface AiUsageProviderRow {
  provider: string;
  requestCount: number;
  tokens: number;
  estimatedCostUsd: number;
}

interface AiUsageModelRow {
  provider: string;
  model: string;
  requestCount: number;
  tokens: number;
  estimatedCostUsd: number;
  averageLatencyMs: number | null;
}

interface AiUsageTierMarginRow {
  tierCode: 'free' | 'starter' | 'pro' | 'master' | 'unknown';
  displayName: string;
  activeUsers: number;
  requestCount: number;
  tokens: number;
  estimatedCostUsd: number;
  monthlyPrice: number | null;
  estimatedMonthlyRevenueUsd: number | null;
  estimatedGrossMarginUsd: number | null;
  marginPct: number | null;
  aiQuotaMonthly: number;
  aiQuotaUsed: number;
  aiQuotaRemaining: number;
  costPerActiveUserUsd: number | null;
  verdict: 'profitable' | 'watch' | 'unknown';
}

interface AlertRecipientState {
  recipientEmail: string;
  choices: string[];
}

interface AlertDeliveryRow {
  id: string;
  channel: string;
  recipient: string | null;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sentAt: string | null;
  deliveredAt: string | null;
  errorMessage: string | null;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
  alert: {
    id: string;
    title: string;
    severity: 'critical' | 'warning' | 'info';
    status: 'raised' | 'acknowledged' | 'resolved' | 'escalated';
    triggeredAt: string;
    alertKey: string | null;
    alertName: string | null;
    alertType: string | null;
  } | null;
}

type RefreshTarget = 'all' | IngestionHealthRow['gameKey'];

const EMPTY_SUMMARY: AlertSummary = {
  openCount: 0,
  criticalOpenCount: 0,
  warningOpenCount: 0,
  acknowledgedCount: 0,
  resolvedTodayCount: 0,
  byCategory: {},
  latestCritical: null,
};

const EMPTY_INGESTION_SUMMARY: IngestionHealthSummary = {
  totalGames: 0,
  failedRuns: 0,
  gamesWithErrors: 0,
  byFreshness: {
    healthy: 0,
    delayed: 0,
    stale: 0,
    failed: 0,
    unknown: 0,
  },
};

const EMPTY_AI_SUMMARY: AiUsageSummary = {
  requestCount: 0,
  successCount: 0,
  errorCount: 0,
  inputTokens: 0,
  outputTokens: 0,
  totalTokens: 0,
  estimatedCostUsd: 0,
  averageLatencyMs: null,
  windowStart: '',
  windowEnd: '',
  totalRevenueUsd: 0,
  totalGrossMarginUsd: 0,
  totalMarginPct: null,
};

const DEFAULT_ALERT_RECIPIENT: AlertRecipientState = {
  recipientEmail: 'command@brewlotto.app',
  choices: ['command@brewlotto.app', 'michael.brewington@gmail.com', 'tlloretta30@gmail.com'],
};

function formatDate(value?: string | null) {
  if (!value) {
    return 'Not available';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(24,22,26,0.96),rgba(14,12,16,0.96))] p-5 shadow-[inset_0_0_18px_rgba(255,179,0,0.05)]">
      <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">{label}</div>
      <div className={`mt-3 text-4xl font-black ${accent}`}>{value}</div>
    </div>
  );
}

function statusTone(status: IngestionHealthRow['freshnessStatus'] | IngestionHealthRow['lastRunStatus']) {
  switch (status) {
    case 'healthy':
    case 'succeeded':
      return 'border-[#53d48a]/30 bg-[#102117] text-[#93efb8]';
    case 'delayed':
    case 'partial':
    case 'running':
      return 'border-[#ffc742]/30 bg-[#2b2210] text-[#ffd873]';
    case 'failed':
    case 'stale':
      return 'border-[#ff7d67]/30 bg-[#2a1311] text-[#ffb5a8]';
    default:
      return 'border-white/10 bg-white/5 text-white/70';
  }
}

function formatMinutes(value: number | null) {
  if (value == null) {
    return 'Unknown';
  }

  if (value < 60) {
    return `${value}m`;
  }

  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

function formatMoney(value: number | null | undefined) {
  const amount = Number(value ?? 0);
  return `$${amount.toFixed(4)}`;
}

function formatMoneyShort(value: number | null | undefined) {
  const amount = Number(value ?? 0);
  return `$${amount.toFixed(2)}`;
}

function formatNumber(value: number | null | undefined) {
  return new Intl.NumberFormat('en-US').format(Number(value ?? 0));
}

function AlertRow({
  alert,
  isMutating,
  onAcknowledge,
  onResolve,
}: {
  alert: AlertItem;
  isMutating: boolean;
  onAcknowledge: (id: string) => Promise<void>;
  onResolve: (id: string) => Promise<void>;
}) {
  const severityStyles = {
    critical: 'border-[#ff7d67]/30 bg-[#2a1311] text-[#ffb5a8]',
    warning: 'border-[#ffc742]/30 bg-[#2b2210] text-[#ffd873]',
    info: 'border-[#72caff]/30 bg-[#111f28] text-[#9edcff]',
  };

  const statusStyles = {
    raised: 'border-white/10 bg-white/5 text-white/70',
    acknowledged: 'border-[#72caff]/30 bg-[#111f28] text-[#9edcff]',
    resolved: 'border-[#53d48a]/30 bg-[#102117] text-[#93efb8]',
    escalated: 'border-[#ff7d67]/30 bg-[#2a1311] text-[#ffb5a8]',
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(24,22,26,0.96),rgba(14,12,16,0.96))] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${severityStyles[alert.severity]}`}>
              {alert.severity}
            </span>
            <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${statusStyles[alert.status]}`}>
              {alert.status}
            </span>
            <span className="text-[11px] uppercase tracking-[0.16em] text-white/40">{alert.alertKey}</span>
          </div>
          <h2 className="mt-3 text-lg font-semibold text-white">{alert.title}</h2>
          <p className="mt-2 text-sm leading-6 text-white/70">{alert.message}</p>
        </div>

        <div className="flex gap-2">
          {alert.status !== 'acknowledged' && alert.status !== 'resolved' ? (
            <button
              onClick={() => onAcknowledge(alert.id)}
              disabled={isMutating}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Acknowledge
            </button>
          ) : null}
          {alert.status !== 'resolved' ? (
            <button
              onClick={() => onResolve(alert.id)}
              disabled={isMutating}
              className="rounded-full border border-[#ffd978]/80 bg-[linear-gradient(180deg,#ffcf4a_0%,#ffba19_55%,#f6a800_100%)] px-4 py-2 text-sm font-bold text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Resolve
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-white/55 sm:grid-cols-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-white/35">Category</div>
          <div className="mt-1 text-white/75">{alert.category || 'Unknown'}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-white/35">State / Game</div>
          <div className="mt-1 text-white/75">{[alert.state, alert.game].filter(Boolean).join(' / ') || 'System-wide'}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-white/35">Last Seen</div>
          <div className="mt-1 text-white/75">{formatDate(alert.lastSeenAt)}</div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<AlertSummary>(EMPTY_SUMMARY);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshTarget, setRefreshTarget] = useState<RefreshTarget | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);
  const [resettingOnboarding, setResettingOnboarding] = useState(false);
  const [resetEmail, setResetEmail] = useState('command@brewlotto.app');
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [ingestionSummary, setIngestionSummary] = useState<IngestionHealthSummary>(EMPTY_INGESTION_SUMMARY);
  const [ingestionRows, setIngestionRows] = useState<IngestionHealthRow[]>([]);
  const [aiUsageSummary, setAiUsageSummary] = useState<AiUsageSummary>(EMPTY_AI_SUMMARY);
  const [aiUsageByProvider, setAiUsageByProvider] = useState<AiUsageProviderRow[]>([]);
  const [aiUsageByModel, setAiUsageByModel] = useState<AiUsageModelRow[]>([]);
  const [aiUsageByTier, setAiUsageByTier] = useState<AiUsageTierMarginRow[]>([]);
  const [aiUsageRows, setAiUsageRows] = useState<AiUsageRow[]>([]);
  const [alertRecipient, setAlertRecipient] = useState<AlertRecipientState>(DEFAULT_ALERT_RECIPIENT);
  const [savingAlertRecipient, setSavingAlertRecipient] = useState(false);
  const [alertDeliveries, setAlertDeliveries] = useState<AlertDeliveryRow[]>([]);
  const [alertDeliveryFilter, setAlertDeliveryFilter] = useState<AlertDeliveryFilter>('all');
  const [statusFilter, setStatusFilter] = useState<AlertStatusFilter>('all');
  const [severityFilter, setSeverityFilter] = useState<AlertSeverityFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<AlertCategoryFilter>('all');
  const latestRequestRef = useRef(0);
  const marginWatchTier = aiUsageByTier.find((row) => row.verdict === 'watch') || null;
  const marginRiskCopy = marginWatchTier
    ? `${marginWatchTier.displayName} is the current watch tier: estimated AI spend is starting to press margin.`
    : aiUsageByTier.some((row) => row.verdict === 'unknown')
      ? 'One or more tiers still lacks a revenue baseline, so treat the profitability view as provisional.'
      : 'Current pricing ladder remains profitable on the current AI usage snapshot.';
  const visibleAlertDeliveries = alertDeliveries.filter((delivery) => {
    if (alertDeliveryFilter === 'all') {
      return true;
    }

    if (alertDeliveryFilter === 'sent') {
      return delivery.status === 'sent' || delivery.status === 'delivered';
    }

    if (alertDeliveryFilter === 'failed') {
      return delivery.status === 'failed';
    }

    return true;
  });

  async function loadAdminData(options?: { alertsOnly?: boolean; nextRequestId?: number }) {
    setError(null);
    const requestId = options?.nextRequestId ?? latestRequestRef.current;

    const alertParams = new URLSearchParams({ limit: '12' });
    if (statusFilter !== 'all') {
      alertParams.set('status', statusFilter);
    }
    if (severityFilter !== 'all') {
      alertParams.set('severity', severityFilter);
    }
    if (categoryFilter !== 'all') {
      alertParams.set('category', categoryFilter);
    }

    const requests = options?.alertsOnly
      ? [fetch(`/api/admin/alerts?${alertParams.toString()}`, { cache: 'no-store' })]
      : [
          fetch('/api/admin/alerts/summary', { cache: 'no-store' }),
          fetch(`/api/admin/alerts?${alertParams.toString()}`, { cache: 'no-store' }),
          fetch('/api/admin/ingestion-health', { cache: 'no-store' }),
          fetch('/api/admin/ai-usage', { cache: 'no-store' }),
          fetch('/api/admin/alert-recipient', { cache: 'no-store' }),
          fetch('/api/admin/alert-deliveries', { cache: 'no-store' }),
        ];

    const responses = await Promise.all(requests);
    const payloads = await Promise.all(responses.map((response) => response.json()));

    if (requestId !== latestRequestRef.current) {
      return;
    }

    if (options?.alertsOnly) {
      const [alertsResponse] = responses;
      const [alertsPayload] = payloads;

      if (!alertsResponse.ok) {
        throw new Error(alertsPayload?.error?.message || 'Failed to load alerts');
      }

      setAlerts(alertsPayload.data || []);
      return;
    }

    const [summaryResponse, alertsResponse, ingestionResponse, aiUsageResponse, alertRecipientResponse, alertDeliveriesResponse] = responses;
    const [summaryPayload, alertsPayload, ingestionPayload, aiUsagePayload, alertRecipientPayload, alertDeliveriesPayload] = payloads;

    if (!summaryResponse.ok) {
      throw new Error(summaryPayload?.error?.message || 'Failed to load alert summary');
    }

    if (!alertsResponse.ok) {
      throw new Error(alertsPayload?.error?.message || 'Failed to load alerts');
    }

    if (!ingestionResponse.ok) {
      throw new Error(ingestionPayload?.error?.message || 'Failed to load ingestion health');
    }

    if (!aiUsageResponse.ok) {
      throw new Error(aiUsagePayload?.error?.message || 'Failed to load AI usage');
    }

    if (!alertRecipientResponse.ok) {
      throw new Error(alertRecipientPayload?.error?.message || 'Failed to load alert recipient');
    }

    if (!alertDeliveriesResponse.ok) {
      throw new Error(alertDeliveriesPayload?.error?.message || 'Failed to load alert deliveries');
    }

    setSummary(summaryPayload.data || EMPTY_SUMMARY);
    setAlerts(alertsPayload.data || []);
    setIngestionSummary(ingestionPayload.meta?.summary || EMPTY_INGESTION_SUMMARY);
    setIngestionRows(ingestionPayload.data || []);
    setAiUsageSummary(aiUsagePayload.data?.summary || EMPTY_AI_SUMMARY);
    setAiUsageByProvider(aiUsagePayload.data?.byProvider || []);
    setAiUsageByModel(aiUsagePayload.data?.byModel || []);
    setAiUsageByTier(aiUsagePayload.data?.byTier || []);
    setAiUsageRows(aiUsagePayload.data?.recent || []);
    setAlertRecipient({
      recipientEmail: alertRecipientPayload.data?.recipientEmail || DEFAULT_ALERT_RECIPIENT.recipientEmail,
      choices: alertRecipientPayload.data?.choices || DEFAULT_ALERT_RECIPIENT.choices,
    });
    setAlertDeliveries(alertDeliveriesPayload.data || []);
  }

  useEffect(() => {
    async function bootstrap() {
      const requestId = latestRequestRef.current + 1;
      latestRequestRef.current = requestId;

      try {
        if (loading) {
          await loadAdminData({ nextRequestId: requestId });
        } else {
          setAlertsLoading(true);
          await loadAdminData({ alertsOnly: true, nextRequestId: requestId });
        }
      } catch (loadError) {
        if (requestId === latestRequestRef.current) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load BrewCommand');
        }
      } finally {
        if (requestId === latestRequestRef.current) {
          setLoading(false);
          setAlertsLoading(false);
        }
      }
    }

    bootstrap();
  }, [statusFilter, severityFilter, categoryFilter]);

  async function handleRefresh() {
    setRefreshing(true);
    setRefreshMessage(null);

    try {
      await loadAdminData();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Refresh failed');
    } finally {
      setRefreshing(false);
    }
  }

  async function handleManualRefresh(target: RefreshTarget) {
    setRefreshTarget(target);
    setError(null);
    setRefreshMessage(null);

    try {
      const response = await fetch('/api/admin/ingestion-refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ target }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error?.message || 'Manual refresh failed');
      }

      setRefreshMessage(`Manual refresh started for ${payload?.data?.label || target}.`);
      await loadAdminData();
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : 'Manual refresh failed');
    } finally {
      setRefreshTarget(null);
    }
  }

  async function handleResetOnboarding() {
    setResettingOnboarding(true);
    setResetMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/admin/reset-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error?.message || 'Failed to reset onboarding');
      }

      document.cookie = 'brewlotto_onboarded=; Path=/; Max-Age=0; SameSite=Lax';
      setResetMessage(`Onboarding reset for ${resetEmail}. You can sign in again and revisit /onboarding.`);
      router.push('/onboarding');
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'Failed to reset onboarding');
    } finally {
      setResettingOnboarding(false);
    }
  }

  async function updateAlert(id: string, action: 'acknowledge' | 'resolve') {
    setMutatingId(id);
    setError(null);

    try {
      const response = await fetch(`/api/admin/alerts/${id}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error?.message || `Failed to ${action} alert`);
      }

      await loadAdminData();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : `Failed to ${action} alert`);
    } finally {
      setMutatingId(null);
    }
  }

  async function saveAlertRecipient(recipientEmail: string) {
    setSavingAlertRecipient(true);
    setError(null);
    setRefreshMessage(null);

    try {
      const response = await fetch('/api/admin/alert-recipient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipientEmail }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error?.message || 'Failed to save alert recipient');
      }

      setAlertRecipient({
        recipientEmail: payload?.data?.recipientEmail || recipientEmail,
        choices: payload?.data?.choices || alertRecipient.choices,
      });
      setRefreshMessage(`Alert emails will now go to ${recipientEmail}.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save alert recipient');
    } finally {
      setSavingAlertRecipient(false);
    }
  }

  function scrollToAlertFeed() {
    document.getElementById('alert-feed')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-6 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[36px] border border-[#ffd36f]/20 bg-[linear-gradient(135deg,rgba(18,14,14,0.96),rgba(8,8,10,0.96))] p-6 shadow-[inset_0_0_24px_rgba(255,179,0,0.10),inset_0_0_60px_rgba(255,140,0,0.06)] sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-[#f0c46b]">
                <span className="inline-block h-[2px] w-4 rounded-full bg-[#f0b63f]" />
                <span>BrewCommand Lite</span>
              </div>
              <h1 className="mt-4 text-4xl font-black uppercase tracking-wide text-[#ffc742] drop-shadow-[0_0_18px_rgba(255,184,28,0.45)] sm:text-5xl">
                Admin Console
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68 sm:text-base">
                Monitor alert pressure, review unresolved incidents, and close the loop on ingestion issues without leaving the App Router surface.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={scrollToAlertFeed}
                className="inline-flex items-center gap-3 rounded-full border border-[#ffcf4a]/20 bg-[linear-gradient(180deg,rgba(255,199,66,0.12),rgba(255,255,255,0.04))] px-4 py-3 text-left transition hover:border-[#ffcf4a]/40 hover:bg-[linear-gradient(180deg,rgba(255,199,66,0.18),rgba(255,255,255,0.06))]"
              >
                <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ffcf4a]/30 bg-[#20170a] text-[#ffd873]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
                    <path d="M9 17a3 3 0 0 0 6 0" />
                  </svg>
                  {summary.criticalOpenCount > 0 ? <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#ff7d67] ring-2 ring-[#120f0f]" /> : null}
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-[0.22em] text-white/40">Notification Bell</span>
                  <span className="mt-1 block text-sm font-semibold text-white">
                    {summary.openCount} open / {summary.criticalOpenCount} critical
                  </span>
                </span>
              </button>
              <button
                onClick={() => handleManualRefresh('all')}
                disabled={Boolean(refreshTarget) || loading}
                className="rounded-full border border-[#ffd978]/70 bg-[linear-gradient(180deg,#ffcf4a_0%,#ffba19_55%,#f6a800_100%)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {refreshTarget === 'all' ? 'Running Full Refresh' : 'Run Full Refresh'}
              </button>
              <button
                onClick={handleRefresh}
                disabled={refreshing || loading || Boolean(refreshTarget)}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {refreshing ? 'Refreshing' : 'Refresh View'}
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-[#72caff]/20 bg-[#111f28]/70 p-4">
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#9edcff]">BrewCommand Test Mode</div>
            <div className="mt-2 text-sm leading-6 text-white/70">
              Reset onboarding for a BrewCommand account so the disclaimer and tutorial can be replayed.
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="email"
                value={resetEmail}
                onChange={(event) => setResetEmail(event.target.value)}
                className="w-full rounded-full border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 sm:max-w-md"
                placeholder="command@brewlotto.app"
              />
              <button
                onClick={() => void handleResetOnboarding()}
                disabled={resettingOnboarding || loading || !resetEmail.trim()}
                className="rounded-full border border-[#72caff]/30 bg-[#111f28] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[#9edcff] transition hover:border-[#72caff]/50 hover:bg-[#162732] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resettingOnboarding ? 'Resetting Onboarding' : 'Reset Onboarding'}
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-[#ffcf4a]/20 bg-[linear-gradient(180deg,rgba(33,24,10,0.9),rgba(18,14,14,0.92))] p-4">
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#ffd873]">Alert Recipient</div>
            <div className="mt-2 text-sm leading-6 text-white/70">
              Keep BrewCommand alert emails pointed at one inbox at a time. This is the address that receives critical and email-worthy admin alerts.
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <select
                value={alertRecipient.recipientEmail}
                onChange={(event) => void saveAlertRecipient(event.target.value)}
                disabled={savingAlertRecipient}
                className="w-full rounded-full border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none sm:max-w-md"
              >
                {alertRecipient.choices.map((email) => (
                  <option key={email} value={email}>
                    {email}
                  </option>
                ))}
              </select>
              <button
                onClick={() => void saveAlertRecipient(alertRecipient.recipientEmail)}
                disabled={savingAlertRecipient}
                className="rounded-full border border-[#ffcf4a]/30 bg-[#20170a] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[#ffd873] transition hover:border-[#ffcf4a]/50 hover:bg-[#2b2210] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingAlertRecipient ? 'Saving Recipient' : 'Save Recipient'}
              </button>
            </div>
            <div className="mt-3 text-xs uppercase tracking-[0.14em] text-white/40">
              Current recipient: {alertRecipient.recipientEmail}
            </div>
          </div>

          {refreshMessage ? <div className="mt-4 rounded-2xl border border-[#53d48a]/30 bg-[#102117] px-4 py-3 text-sm text-[#93efb8]">{refreshMessage}</div> : null}
          {resetMessage ? <div className="mt-4 rounded-2xl border border-[#72caff]/30 bg-[#111f28] px-4 py-3 text-sm text-[#9edcff]">{resetMessage}</div> : null}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <SummaryCard label="Open Alerts" value={summary.openCount} accent="text-white" />
            <SummaryCard label="Critical Open" value={summary.criticalOpenCount} accent="text-[#ff9f92]" />
            <SummaryCard label="Warnings" value={summary.warningOpenCount} accent="text-[#ffd873]" />
            <SummaryCard label="Acknowledged" value={summary.acknowledgedCount} accent="text-[#9edcff]" />
            <SummaryCard label="Resolved Today" value={summary.resolvedTodayCount} accent="text-[#93efb8]" />
          </div>

          <div className="mt-8 rounded-[30px] border border-[#72caff]/20 bg-[linear-gradient(180deg,rgba(18,22,30,0.96),rgba(10,12,18,0.96))] p-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#9edcff]">AI Usage Ledger</div>
                <h2 className="mt-2 text-xl font-semibold text-white">Tokens, latency, and estimated spend</h2>
                <p className="mt-1 text-sm text-white/55">
                  BrewCommand tracks AI activity by provider and model so you can compare usage cost against pricing and tier margins.
                </p>
              </div>
              <div className="text-right text-[11px] uppercase tracking-[0.16em] text-white/35">
                <div>Window start</div>
                <div className="mt-1 text-white/60 normal-case tracking-normal">
                  {aiUsageSummary.windowStart ? formatDate(aiUsageSummary.windowStart) : 'Last 30 days'}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard label="AI Requests" value={aiUsageSummary.requestCount} accent="text-white" />
              <SummaryCard label="Total Tokens" value={aiUsageSummary.totalTokens} accent="text-[#9edcff]" />
              <SummaryCard label="Estimated Spend" value={Number(aiUsageSummary.estimatedCostUsd.toFixed(4))} accent="text-[#93efb8]" />
              <SummaryCard label="Avg Latency (ms)" value={aiUsageSummary.averageLatencyMs ?? 0} accent="text-[#ffd873]" />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">Projected revenue</div>
                <div className="mt-2 text-2xl font-semibold text-white">{formatMoneyShort(aiUsageSummary.totalRevenueUsd)}</div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">Projected gross margin</div>
                <div className={`mt-2 text-2xl font-semibold ${aiUsageSummary.totalGrossMarginUsd >= 0 ? 'text-[#93efb8]' : 'text-[#ffb5a8]'}`}>
                  {formatMoneyShort(aiUsageSummary.totalGrossMarginUsd)}
                </div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">Margin rate</div>
                <div className={`mt-2 text-2xl font-semibold ${aiUsageSummary.totalMarginPct == null ? 'text-white' : aiUsageSummary.totalMarginPct >= 0 ? 'text-[#93efb8]' : 'text-[#ffb5a8]'}`}>
                  {aiUsageSummary.totalMarginPct == null ? 'N/A' : `${aiUsageSummary.totalMarginPct.toFixed(2)}%`}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-[24px] border border-[#ffcf4a]/18 bg-[linear-gradient(180deg,rgba(34,24,10,0.85),rgba(18,14,14,0.9))] px-4 py-4">
              <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#ffd873]">Margin Risk Note</div>
              <div className="mt-2 text-sm leading-6 text-white/70">{marginRiskCopy}</div>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">By Provider</div>
                <div className="mt-4 space-y-3">
                  {aiUsageByProvider.length > 0 ? aiUsageByProvider.map((row) => (
                    <div key={row.provider} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-semibold text-white">{row.provider}</div>
                        <div className="text-sm text-white/65">{formatMoney(row.estimatedCostUsd)}</div>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-3 text-xs text-white/45">
                        <div>
                          <div className="uppercase tracking-[0.16em]">Requests</div>
                          <div className="mt-1 text-sm text-white/75">{formatNumber(row.requestCount)}</div>
                        </div>
                        <div>
                          <div className="uppercase tracking-[0.16em]">Tokens</div>
                          <div className="mt-1 text-sm text-white/75">{formatNumber(row.tokens)}</div>
                        </div>
                        <div>
                          <div className="uppercase tracking-[0.16em]">Spend</div>
                          <div className="mt-1 text-sm text-white/75">{formatMoney(row.estimatedCostUsd)}</div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-sm text-white/55">No AI usage has been recorded yet.</div>
                  )}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">By Model</div>
                <div className="mt-4 space-y-3">
                  {aiUsageByModel.length > 0 ? aiUsageByModel.map((row) => (
                    <div key={`${row.provider}:${row.model}`} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-white">{row.model}</div>
                          <div className="text-xs uppercase tracking-[0.14em] text-white/40">{row.provider}</div>
                        </div>
                        <div className="text-sm text-white/65">{formatMoney(row.estimatedCostUsd)}</div>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-3 text-xs text-white/45">
                        <div>
                          <div className="uppercase tracking-[0.16em]">Requests</div>
                          <div className="mt-1 text-sm text-white/75">{formatNumber(row.requestCount)}</div>
                        </div>
                        <div>
                          <div className="uppercase tracking-[0.16em]">Tokens</div>
                          <div className="mt-1 text-sm text-white/75">{formatNumber(row.tokens)}</div>
                        </div>
                        <div>
                          <div className="uppercase tracking-[0.16em]">Avg Latency</div>
                          <div className="mt-1 text-sm text-white/75">{row.averageLatencyMs ?? 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-sm text-white/55">No model-level AI usage is available yet.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">Tier Margin Check</div>
                  <div className="mt-1 text-sm text-white/55">This compares estimated AI spend against current monthly tier pricing and current active entitlement counts using the same Starter / Pro / Master language as pricing.</div>
                </div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-white/35">
                  <span>Price ladder truth: Starter / Pro / Master</span>
                </div>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                {aiUsageByTier.length > 0 ? aiUsageByTier.map((row) => {
                  const marginClass = row.estimatedGrossMarginUsd == null
                    ? 'text-white/70'
                    : row.estimatedGrossMarginUsd >= 0
                      ? 'text-[#93efb8]'
                      : 'text-[#ffb5a8]';
                  const verdictLabel = row.verdict === 'profitable' ? 'Profitable' : row.verdict === 'watch' ? 'Watch burn' : 'No baseline';
                  return (
                    <div key={row.tierCode} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">{row.tierCode === 'unknown' ? 'unknown' : row.tierCode}</div>
                          <div className="mt-1 text-lg font-semibold text-white">{row.displayName}</div>
                        </div>
                        <div className={`text-right text-sm font-semibold ${marginClass}`}>
                          {row.estimatedGrossMarginUsd == null ? 'N/A margin' : formatMoney(row.estimatedGrossMarginUsd)}
                          <div className="mt-1 text-[11px] font-normal uppercase tracking-[0.14em] text-white/40">
                            {row.marginPct == null ? 'No revenue baseline' : `${row.marginPct.toFixed(2)}% margin`}
                          </div>
                          <div className="mt-1 text-[11px] font-normal uppercase tracking-[0.14em] text-white/40">
                            {verdictLabel}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 text-xs text-white/45 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <div className="uppercase tracking-[0.16em]">Active users</div>
                          <div className="mt-1 text-base text-white/80">{formatNumber(row.activeUsers)}</div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <div className="uppercase tracking-[0.16em]">Estimated revenue</div>
                          <div className="mt-1 text-base text-white/80">{row.estimatedMonthlyRevenueUsd == null ? 'N/A' : formatMoneyShort(row.estimatedMonthlyRevenueUsd)}</div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <div className="uppercase tracking-[0.16em]">AI spend</div>
                          <div className="mt-1 text-base text-white/80">{formatMoneyShort(row.estimatedCostUsd)}</div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <div className="uppercase tracking-[0.16em]">AI quota left</div>
                          <div className="mt-1 text-base text-white/80">{formatNumber(row.aiQuotaRemaining)}</div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.14em] text-white/40">
                        <span>Tier: {row.displayName}</span>
                        <span>•</span>
                        <span>Requests: {formatNumber(row.requestCount)}</span>
                        <span>•</span>
                        <span>Tokens: {formatNumber(row.tokens)}</span>
                        <span>•</span>
                        <span>AI quota used: {formatNumber(row.aiQuotaUsed)} / {formatNumber(row.aiQuotaMonthly)}</span>
                        <span>•</span>
                        <span>Cost per active user: {row.costPerActiveUserUsd == null ? 'N/A' : formatMoney(row.costPerActiveUserUsd)}</span>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/55">
                    No tier-level AI margin data is available yet.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10 bg-black/20">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                  <thead className="bg-white/5 text-[11px] uppercase tracking-[0.16em] text-white/45">
                    <tr>
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Route</th>
                      <th className="px-4 py-3">Provider / Model</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Tokens</th>
                      <th className="px-4 py-3">Estimated Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/75">
                    {aiUsageRows.map((row) => (
                      <tr key={row.id} className="align-top">
                        <td className="px-4 py-4 text-white/65">{formatDate(row.created_at)}</td>
                        <td className="px-4 py-4">
                          <div className="font-semibold text-white">{row.route}</div>
                          <div className="mt-1 text-xs uppercase tracking-[0.12em] text-white/40">{row.operation}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-semibold text-white">{row.provider}</div>
                          <div className="mt-1 text-xs uppercase tracking-[0.12em] text-white/40">{row.model}</div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${row.status === 'success' ? 'border-[#53d48a]/30 bg-[#102117] text-[#93efb8]' : 'border-[#ff7d67]/30 bg-[#2a1311] text-[#ffb5a8]'}`}>
                            {row.status}
                          </span>
                          <div className="mt-2 text-xs text-white/40">latency: {row.latency_ms ?? 'N/A'}ms</div>
                        </td>
                        <td className="px-4 py-4">
                          <div>in {formatNumber(row.input_tokens)} / out {formatNumber(row.output_tokens)}</div>
                          <div className="mt-1 text-xs text-white/40">total {formatNumber(row.total_tokens)}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-semibold text-white">{formatMoney(row.estimated_cost_usd)}</div>
                          {row.error_message ? <div className="mt-2 text-xs text-[#ffb5a8]">{row.error_message}</div> : null}
                        </td>
                      </tr>
                    ))}
                    {!loading && aiUsageRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-white/55">
                          No AI usage events have been recorded yet.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-8" id="alert-feed">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Ingestion Health</h2>
                <p className="mt-1 text-sm text-white/55">Derived from live game, draw, and ingestion-run records so BrewCommand stays useful even where freshness rows have not been backfilled yet.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard label="Tracked Games" value={ingestionSummary.totalGames} accent="text-white" />
              <SummaryCard label="Healthy" value={ingestionSummary.byFreshness.healthy} accent="text-[#93efb8]" />
              <SummaryCard label="Needs Attention" value={ingestionSummary.byFreshness.stale + ingestionSummary.byFreshness.failed + ingestionSummary.failedRuns} accent="text-[#ff9f92]" />
              <SummaryCard label="Errors Logged" value={ingestionSummary.gamesWithErrors} accent="text-[#ffd873]" />
            </div>

            <div className="mt-5 overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(24,22,26,0.96),rgba(14,12,16,0.96))]">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                  <thead className="bg-white/5 text-[11px] uppercase tracking-[0.16em] text-white/45">
                    <tr>
                      <th className="px-4 py-3">Game</th>
                      <th className="px-4 py-3">Freshness</th>
                      <th className="px-4 py-3">Staleness</th>
                      <th className="px-4 py-3">Last Draw</th>
                      <th className="px-4 py-3">Run Status</th>
                      <th className="px-4 py-3">Run Output</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/75">
                    {ingestionRows.map((row) => (
                      <tr key={row.gameId} className="align-top">
                        <td className="px-4 py-4">
                          <div className="font-semibold text-white">{row.gameName}</div>
                          <div className="mt-1 text-xs uppercase tracking-[0.12em] text-white/40">{row.stateCode} • {row.gameKey}</div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${statusTone(row.freshnessStatus)}`}>
                            {row.freshnessStatus}
                          </span>
                          <div className="mt-2 text-xs text-white/40">{row.freshnessSource === 'tracked' ? 'freshness table' : 'derived from latest draw'}</div>
                        </td>
                        <td className="px-4 py-4">{formatMinutes(row.stalenessMinutes)}</td>
                        <td className="px-4 py-4">
                          <div>{formatDate(row.latestDrawAt)}</div>
                          <div className="mt-1 text-xs text-white/40">draw date: {row.latestDrawDate || 'Unknown'}</div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${statusTone(row.lastRunStatus)}`}>
                            {row.lastRunStatus}
                          </span>
                          <div className="mt-2 text-xs text-white/40">finished: {formatDate(row.lastRunFinishedAt)}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div>seen {row.drawsSeen ?? 0} / inserted {row.drawsInserted ?? 0} / updated {row.drawsUpdated ?? 0}</div>
                          <div className="mt-1 text-xs text-white/40">errors: {row.errorCount}</div>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleManualRefresh(row.gameKey)}
                            disabled={Boolean(refreshTarget) || loading}
                            className="rounded-full border border-[#ffd978]/55 bg-[#20170a] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ffd873] transition hover:border-[#ffd978]/80 hover:bg-[#2b2210] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {refreshTarget === row.gameKey ? 'Running...' : 'Refresh Game'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!loading && ingestionRows.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-sm text-white/55">
                          No ingestion health records are available yet.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 xl:grid-cols-[1.5fr_0.9fr]">
            <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(24,22,26,0.96),rgba(14,12,16,0.96))] p-5">
              <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">Latest Critical</div>
              <div className="mt-3 text-lg font-semibold text-white">
                {summary.latestCritical?.title || 'No unresolved critical alert'}
              </div>
              <div className="mt-2 text-sm text-white/55">
                {summary.latestCritical ? formatDate(summary.latestCritical.lastSeenAt) : 'System is currently clear at the critical level.'}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(24,22,26,0.96),rgba(14,12,16,0.96))] p-5">
              <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">Categories In Play</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(summary.byCategory).length > 0 ? (
                  Object.entries(summary.byCategory).map(([category, count]) => (
                    <span
                      key={category}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80"
                    >
                      {category}: {count}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-white/55">No active categories.</span>
                )}
              </div>
            </div>
          </div>

            <div className="mt-8 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(24,22,26,0.96),rgba(14,12,16,0.96))] p-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">Alert Email History</div>
                  <h2 className="mt-2 text-xl font-semibold text-white">Recent delivery attempts</h2>
                  <p className="mt-1 text-sm text-white/55">
                    Read-only history of BrewCommand alert emails sent from the internal alert system to the currently selected recipient.
                  </p>
                </div>
                <div className="text-right text-[11px] uppercase tracking-[0.14em] text-white/35">
                  One inbox at a time
                  <div className="mt-1 normal-case tracking-normal text-white/60">{alertRecipient.recipientEmail}</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setAlertDeliveryFilter('all')}
                  className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
                    alertDeliveryFilter === 'all'
                      ? 'border-[#ffd978]/60 bg-[#20170a] text-[#ffd873]'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setAlertDeliveryFilter('sent')}
                  className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
                    alertDeliveryFilter === 'sent'
                      ? 'border-[#53d48a]/60 bg-[#102117] text-[#93efb8]'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  Sent
                </button>
                <button
                  type="button"
                  onClick={() => setAlertDeliveryFilter('failed')}
                  className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
                    alertDeliveryFilter === 'failed'
                      ? 'border-[#ff7d67]/60 bg-[#2a1311] text-[#ffb5a8]'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  Failed
                </button>
              </div>

              <div className="mt-5 overflow-hidden rounded-[24px] border border-white/10 bg-black/20">
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                  <thead className="bg-white/5 text-[11px] uppercase tracking-[0.16em] text-white/45">
                    <tr>
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Alert</th>
                      <th className="px-4 py-3">Recipient</th>
                      <th className="px-4 py-3">Channel / Status</th>
                      <th className="px-4 py-3">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/75">
                    {visibleAlertDeliveries.map((delivery) => {
                      const alertLabel = delivery.alert?.title || delivery.alert?.alertName || 'Unknown alert';
                      const alertMeta = [delivery.alert?.severity, delivery.alert?.alertType, delivery.alert?.alertKey].filter(Boolean).join(' • ');
                      return (
                        <tr key={delivery.id} className="align-top">
                          <td className="px-4 py-4 text-white/65">{formatDate(delivery.sentAt || delivery.createdAt)}</td>
                          <td className="px-4 py-4">
                            <div className="font-semibold text-white">{alertLabel}</div>
                            <div className="mt-1 text-xs uppercase tracking-[0.12em] text-white/40">{alertMeta}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-semibold text-white">{delivery.recipient || 'Unknown recipient'}</div>
                            <div className="mt-1 text-xs uppercase tracking-[0.12em] text-white/40">Retries {delivery.retryCount}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-white/80">{delivery.channel}</div>
                            <div className="mt-2 inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] border-white/10 bg-white/5 text-white/70">
                              {delivery.status}
                            </div>
                            {delivery.deliveredAt ? <div className="mt-2 text-xs text-white/40">delivered {formatDate(delivery.deliveredAt)}</div> : null}
                          </td>
                          <td className="px-4 py-4">
                            {delivery.errorMessage ? (
                              <div className="rounded-2xl border border-[#ff7d67]/30 bg-[#2a1311] px-3 py-2 text-xs leading-5 text-[#ffcdc6]">
                                {delivery.errorMessage}
                              </div>
                            ) : (
                              <div className="text-sm text-[#93efb8]">Delivered or sent successfully.</div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {!loading && visibleAlertDeliveries.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-white/55">
                          No alert deliveries are available yet.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Open Alert Feed</h2>
                <p className="mt-1 text-sm text-white/55">Newest events first, using the alert APIs already wired into Supabase.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as AlertStatusFilter)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 outline-none"
                >
                  <option value="all">All statuses</option>
                  <option value="raised">Raised</option>
                  <option value="acknowledged">Acknowledged</option>
                  <option value="resolved">Resolved</option>
                  <option value="escalated">Escalated</option>
                </select>
                <select
                  value={severityFilter}
                  onChange={(event) => setSeverityFilter(event.target.value as AlertSeverityFilter)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 outline-none"
                >
                  <option value="all">All severities</option>
                  <option value="critical">Critical</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value as AlertCategoryFilter)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 outline-none"
                >
                  <option value="all">All categories</option>
                  <option value="freshness">Freshness</option>
                  <option value="ingestion">Ingestion</option>
                  <option value="validation">Validation</option>
                  <option value="system">System</option>
                  <option value="billing">Billing</option>
                  <option value="prediction">Prediction</option>
                </select>
              </div>
            </div>

            {loading || alertsLoading ? <div className="text-sm text-white/55">Loading BrewCommand data...</div> : null}
            {error ? <div className="rounded-2xl border border-[#ff7d67]/30 bg-[#2a1311] px-4 py-3 text-sm text-[#ffcdc6]">{error}</div> : null}

            {!loading && alerts.length === 0 ? (
              <div className="rounded-[28px] border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-white/60">
                No alert events are currently available.
              </div>
            ) : null}

            <div className="space-y-4">
              {alerts.map((alert) => (
                <AlertRow
                  key={alert.id}
                  alert={alert}
                  isMutating={mutatingId === alert.id}
                  onAcknowledge={(id) => updateAlert(id, 'acknowledge')}
                  onResolve={(id) => updateAlert(id, 'resolve')}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
