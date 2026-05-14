'use client';

import { useEffect, useState } from 'react';
import { DashboardContainer, Header, NavigationTabs } from '@/components/brewlotto/dashboard';

interface BrewwuContentRow {
  id: string;
  section_key: string;
  state_code: string | null;
  game_key: string | null;
  title: string;
  body: string;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
}

export default function BrewuAdminPage() {
  const [content, setContent] = useState<BrewwuContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  async function loadContent() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/brewu-content');
      const payload = await res.json();
      if (payload.success) setContent(payload.data || []);
    } catch {
      setMessage('Failed to load BrewU content');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadContent(); }, []);

  const grouped = content.reduce<Record<string, BrewwuContentRow[]>>((acc, row) => {
    if (!acc[row.section_key]) acc[row.section_key] = [];
    acc[row.section_key].push(row);
    return acc;
  }, {});

  async function handleSave(id: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/brewu-content/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, body: editBody }),
      });
      const payload = await res.json();
      if (payload.success) {
        setContent((current) =>
          current.map((row) => (row.id === id ? { ...row, title: editTitle, body: editBody, updated_at: new Date().toISOString() } : row))
        );
        setEditingId(null);
        setMessage('Content updated');
      } else {
        setMessage(payload.error?.message || 'Failed to save');
      }
    } catch {
      setMessage('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DashboardContainer>
        <Header />
        <NavigationTabs />
        <div className="mb-5 mt-2 text-[40px] font-medium tracking-[-0.03em] text-[#f8cf98]">BrewU Editor</div>

        {message ? (
          <div className="mb-5 rounded-[18px] border border-[#ffbd39]/20 bg-[#24160f] px-4 py-3 text-[14px] text-[#f3d7a7]">{message}</div>
        ) : null}

        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/55">Loading...</div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/55">No BrewU content found</div>
        ) : (
          <div className="space-y-5">
            {Object.entries(grouped).map(([sectionKey, rows]) => (
              <section key={sectionKey} className="rounded-[26px] border border-[#ffbd39]/18 bg-[linear-gradient(145deg,rgba(28,18,14,0.78),rgba(10,9,9,0.96))] px-5 py-5">
                <button
                  type="button"
                  onClick={() =>
                    setCollapsedSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }))
                  }
                  className="flex w-full items-center justify-between text-left"
                >
                  <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/38">{sectionKey} ({rows.length})</div>
                  <span className="text-white/35">{collapsedSections[sectionKey] ? 'Expand' : 'Collapse'}</span>
                </button>

                {!collapsedSections[sectionKey] && (
                  <div className="mt-4 space-y-4">
                    {rows.map((row) => (
                      <div key={row.id} className="rounded-[22px] border border-white/8 bg-black/20 px-4 py-4">
                        {editingId === row.id ? (
                          <div className="space-y-3">
                            <input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-[#0a0a0c] px-3 py-2 text-[15px] text-white outline-none"
                              placeholder="Title"
                            />
                            <textarea
                              value={editBody}
                              onChange={(e) => setEditBody(e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-[#0a0a0c] px-3 py-2 text-[14px] leading-7 text-white/82 outline-none"
                              rows={4}
                              placeholder="Body text"
                            />
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleSave(row.id)}
                                disabled={saving}
                                className="rounded-full bg-[#3b82f6] px-4 py-2 text-[13px] font-medium text-white disabled:opacity-50"
                              >
                                {saving ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="rounded-full border border-white/10 px-4 py-2 text-[13px] text-white/60"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-[16px] font-medium text-[#f7ddb3]">{row.title}</div>
                                {row.state_code || row.game_key ? (
                                  <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/35">
                                    {row.state_code ? `${row.state_code} ` : ''}{row.game_key ? `• ${row.game_key}` : ''} • sort {row.sort_order}
                                  </div>
                                ) : null}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingId(row.id);
                                  setEditTitle(row.title);
                                  setEditBody(row.body);
                                }}
                                className="rounded-full border border-white/10 px-3 py-1 text-[12px] text-white/50 transition-colors hover:text-white"
                              >
                                Edit
                              </button>
                            </div>
                            <div className="mt-3 text-[14px] leading-7 text-white/62">{row.body}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </DashboardContainer>
    </main>
  );
}
