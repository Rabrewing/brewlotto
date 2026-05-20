'use client';

import { useEffect, useState } from 'react';
import { BrandedSelect } from '@/components/brewlotto/BrandedSelect';
import { DashboardContainer, Header, NavigationTabs } from '@/components/brewlotto/dashboard';
import { supabase } from '@/lib/supabase/browserClient';

interface QaReport {
  id: string;
  testerName: string | null;
  contactEmail: string | null;
  tierTested: string;
  journeyStage: string;
  featureArea: string;
  pagePath: string | null;
  loadedAsExpected: boolean;
  tierMatched: boolean;
  nextStepMatched: boolean;
  fireballRelevant: boolean;
  timepulseRelevant: boolean;
  expectedBehavior: string;
  actualBehavior: string;
  notes: string | null;
  status: string;
  priority: string;
  screenshotCount: number;
  createdAt: string;
  adminNotes: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  open: 'border-[#ffb5a8]/25 bg-[#2a120d]/60 text-[#ffc4b8]',
  reviewing: 'border-[#f5cf84]/25 bg-[#1a180c]/60 text-[#f5cf84]',
  triaged: 'border-[#72caff]/25 bg-[#0f1a24]/60 text-[#9edcff]',
  resolved: 'border-[#85d36c]/25 bg-[#0f1a10]/60 text-[#85d36c]',
  closed: 'border-white/10 bg-white/5 text-white/50',
};

export default function AdminQaPage() {
  const [reports, setReports] = useState<QaReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [filterTier, setFilterTier] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  async function loadReports() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/qa-reports?limit=50');
      const payload = await res.json();
      if (payload.success) setReports(payload.data || []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadReports(); }, []);

  const filtered = reports.filter((r) => {
    if (filterTier !== 'all' && r.tierTested !== filterTier) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    return true;
  });

  async function handleSave(id: string) {
    setSaving(true);
    try {
      await fetch(`/api/admin/qa-reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: editStatus, adminNotes: editNotes }),
      });
      setReports((current) =>
        current.map((r) =>
          r.id === id ? { ...r, status: editStatus, adminNotes: editNotes } : r
        )
      );
      setEditingId(null);
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DashboardContainer>
        <Header />
        <NavigationTabs />
        <div className="mb-5 mt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[40px] font-medium tracking-[-0.03em] text-[#f8cf98]">QA Reports</div>
          <button
            type="button"
            onClick={loadReports}
            className="rounded-full border border-[#72caff]/22 bg-[#72caff]/10 px-4 py-2 text-[13px] text-[#9fdcff] transition-colors hover:bg-[#72caff]/16"
          >
            Refresh
          </button>
        </div>

        <div className="mb-5 flex flex-wrap gap-3">
          <BrandedSelect
            label="Tier filter"
            value={filterTier}
            onChange={(value) => setFilterTier(value)}
            options={[
              { value: 'all', label: 'All Tiers' },
              { value: 'free', label: 'Free' },
              { value: 'starter', label: 'Starter' },
              { value: 'pro', label: 'Pro' },
              { value: 'master', label: 'Master' },
            ]}
            className="min-w-[220px]"
          />
          <BrandedSelect
            label="Status filter"
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'open', label: 'Open' },
              { value: 'reviewing', label: 'Reviewing' },
              { value: 'triaged', label: 'Triaged' },
              { value: 'resolved', label: 'Resolved' },
              { value: 'closed', label: 'Closed' },
            ]}
            className="min-w-[220px]"
          />
          <div className="self-center text-[12px] text-white/40">{filtered.length} reports</div>
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/55">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/55">No QA reports found</div>
        ) : (
          <div className="space-y-4">
            {filtered.map((report) => (
              <div key={report.id} className="rounded-[26px] border border-white/10 bg-[linear-gradient(145deg,rgba(24,22,26,0.96),rgba(14,12,16,0.96))] px-5 py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] ${STATUS_COLORS[report.status] || STATUS_COLORS.open}`}>
                      {report.status}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-white/50">{report.tierTested}</span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-white/50">{report.featureArea}</span>
                    {report.fireballRelevant ? <span className="rounded-full border border-[#72caff]/18 bg-[#111f28] px-2 py-1 text-[10px] text-[#9edcff]">Fireball</span> : null}
                    {report.timepulseRelevant ? <span className="rounded-full border border-[#ffbd39]/14 bg-[#1a140c] px-2 py-1 text-[10px] text-[#f5cf84]">TimePulse</span> : null}
                  </div>
                  <div className="text-[11px] text-white/40">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-3 text-[13px] leading-6 text-white/52">
                  <span className="font-medium text-white/70">Tester:</span> {report.testerName || report.contactEmail || 'Unknown'}
                  {report.pagePath ? <span className="ml-3 text-white/35">— {report.pagePath}</span> : null}
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[18px] border border-white/8 bg-black/20 px-4 py-3">
                    <div className="text-[10px] uppercase tracking-[0.14em] text-white/35">Expected</div>
                    <div className="mt-1 text-[13px] leading-6 text-white/72">{report.expectedBehavior}</div>
                  </div>
                  <div className="rounded-[18px] border border-white/8 bg-black/20 px-4 py-3">
                    <div className="text-[10px] uppercase tracking-[0.14em] text-white/35">Actual</div>
                    <div className="mt-1 text-[13px] leading-6 text-white/72">{report.actualBehavior}</div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-3 text-[12px] text-white/42">
                  <span>Checks: {[report.loadedAsExpected, report.tierMatched, report.nextStepMatched].filter(Boolean).length}/3</span>
                  {report.screenshotCount > 0 ? <span>{report.screenshotCount} screenshot(s)</span> : null}
                  {report.priority !== 'normal' ? <span className="font-medium text-[#ffb5a8]">Priority: {report.priority}</span> : null}
                </div>

                {report.notes ? (
                  <div className="mt-3 rounded-[18px] border border-white/8 bg-black/20 px-4 py-3 text-[13px] leading-6 text-white/62">
                    {report.notes}
                  </div>
                ) : null}

                {editingId === report.id ? (
                  <div className="mt-4 space-y-3 rounded-[18px] border border-[#ffbd39]/18 bg-[#1a140c] px-4 py-4">
                    <BrandedSelect
                      label="Report status"
                      value={editStatus}
                      onChange={(value) => setEditStatus(value)}
                      options={[
                        { value: 'open', label: 'Open' },
                        { value: 'reviewing', label: 'Reviewing' },
                        { value: 'triaged', label: 'Triaged' },
                        { value: 'resolved', label: 'Resolved' },
                        { value: 'closed', label: 'Closed' },
                      ]}
                    />
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-[#0a0a0c] px-3 py-2 text-[13px] text-white/82 outline-none"
                      rows={3}
                      placeholder="Admin notes..."
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSave(report.id)}
                        disabled={saving}
                        className="rounded-full bg-[#3b82f6] px-4 py-2 text-[12px] font-medium text-white disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="rounded-full border border-white/10 px-4 py-2 text-[12px] text-white/60"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(report.id);
                      setEditStatus(report.status);
                      setEditNotes(report.adminNotes || '');
                    }}
                    className="mt-3 rounded-full border border-white/10 px-4 py-2 text-[12px] text-white/50 transition-colors hover:text-white"
                  >
                    {report.adminNotes ? 'Edit response' : 'Respond'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </DashboardContainer>
    </main>
  );
}
