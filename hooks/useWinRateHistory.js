// File: /hooks/useWinRateHistory.js
// //timestamp: 2025-09-01
// //brief: React hook to compute user win rate history (by game/strategy/time window) with trend & sparkline.
// //comment: Works with Supabase or a custom async loader; supports realtime, domain filters, and shadow mode.

/* eslint-disable no-console */

/**
 * @typedef {Object} UseWinRateHistoryOptions
 * @property {'day'|'week'|'month'|'quarter'|'year'|'all'|number} [window='month']
 *    Time window in days (number) or preset label.
 * @property {string} [gameType]           // e.g., 'pick3', 'mega', 'powerball'
 * @property {string} [strategyId]         // internal strategy id filter (e.g., 'markov_chain')
 * @property {boolean} [realtime=false]    // subscribe to Supabase changes
 * @property {(params: { userId: string, gameType?: string, strategyId?: string }) => Promise<Array>} [customLoader]
 *    Optional async loader returning an array of rows: { created_at: string|Date, outcome: 'win'|'loss', game_type?: string, strategy_id?: string }
 * @property {number} [sparklinePoints=20] // number of buckets for sparkline aggregation
 * @property {boolean} [shadow=false]      // if true, suppress external writes/side-effects (safe read-only mode)
 */

/**
 * @typedef {Object} UseWinRateHistoryReturn
 * @property {number} winRate          // 0..100
 * @property {'up'|'down'|'neutral'} trend
 * @property {Array} history           // raw filtered rows
 * @property {Array<{t:number, v:number}>} sparkline // normalized 0..1 bucketed win rates over time
 * @property {{wins:number, losses:number, total:number}} counts
 * @property {boolean} isLoading
 * @property {Error|null} error
 * @property {() => Promise<void>} reload
 * @property {() => void} unsubscribe // no-op if realtime=false
 */

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

// Optional Supabase import; guard usage if not configured
let supabase = null;
try {
    // Adjust path to your client if different
    // eslint-disable-next-line import/no-unresolved
    ({ supabase } = require('../lib/supabase/browserClient'));
} catch (_) {
    // Supabase not present; hook will fallback to customLoader or empty history
}

const PRESETS = {
    day: 1,
    week: 7,
    month: 30,
    quarter: 90,
    year: 365,
    all: Infinity,
};

/** Safe date util */
const toMs = (d) => (d instanceof Date ? d.getTime() : new Date(d).getTime());

/** Bucket array into N equal time segments, compute win ratio per bucket */
function buildSparkline(rows, buckets = 20) {
    if (!rows.length || buckets <= 1) return [];
    const times = rows.map((r) => toMs(r.created_at)).sort((a, b) => a - b);
    const minT = times[0];
    const maxT = times[times.length - 1];
    if (!isFinite(minT) || !isFinite(maxT) || minT === maxT) {
        const v = rows.filter((r) => r.outcome === 'win').length / rows.length || 0;
        return Array.from({ length: buckets }, (_, i) => ({ t: i / (buckets - 1), v }));
    }
    const step = (maxT - minT) / buckets;
    const bucketsArr = Array.from({ length: buckets }, () => ({ w: 0, n: 0 }));
    for (const r of rows) {
        const idx = Math.min(buckets - 1, Math.max(0, Math.floor((toMs(r.created_at) - minT) / step)));
        bucketsArr[idx].n += 1;
        if (r.outcome === 'win') bucketsArr[idx].w += 1;
    }
    return bucketsArr.map((b, i) => ({
        t: buckets === 1 ? 0 : i / (buckets - 1),
        v: b.n ? b.w / b.n : 0,
    }));
}

/** Compute overall win rate and short-term trend vs. global mean */
function computeStats(rows) {
    const total = rows.length;
    const wins = rows.filter((r) => r.outcome === 'win').length;
    const losses = total - wins;
    const winRate = total ? (wins / total) * 100 : 0;

    // Trend: compare last 5 (or up to 10% of sample) vs overall
    const recentN = Math.max(5, Math.floor(total * 0.1));
    const recent = rows.slice(-recentN);
    const recentWins = recent.filter((r) => r.outcome === 'win').length;
    const recentRate = recent.length ? (recentWins / recent.length) * 100 : winRate;

    let trend = 'neutral';
    const EPS = 0.5; // tolerance in percentage points
    if (recentRate > winRate + EPS) trend = 'up';
    else if (recentRate < winRate - EPS) trend = 'down';

    return { winRate, trend, counts: { wins, losses, total } };
}

/**
 * useWinRateHistory
 * @param {string} userId
 * @param {UseWinRateHistoryOptions} [opts]
 * @returns {UseWinRateHistoryReturn}
 */
export function useWinRateHistory(userOrOptions, maybeOpts = {}) {
    const normalizedOptions =
        userOrOptions && typeof userOrOptions === 'object' && !Array.isArray(userOrOptions)
            ? userOrOptions
            : { userId: userOrOptions, ...maybeOpts };

    const {
        userId,
        window = 'month',
        gameType,
        strategyId,
        realtime = false,
        customLoader,
        sparklinePoints = 20,
        shadow = true,
    } = opts;

    const [rows, setRows] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const subRef = useRef(null);

    const daysWindow = typeof window === 'number' ? window : (PRESETS[window] ?? PRESETS.month);
    const cutoff = useMemo(() => {
        if (!isFinite(daysWindow)) return null; // 'all'
        const d = new Date();
        d.setDate(d.getDate() - daysWindow);
        return d.getTime();
    }, [daysWindow]);

    const filterLocal = useCallback(
        (data) => {
            let out = Array.isArray(data) ? data : [];
            if (gameType) out = out.filter((r) => r.game_type === gameType);
            if (strategyId) out = out.filter((r) => r.strategy_id === strategyId);
            if (cutoff != null) out = out.filter((r) => toMs(r.created_at) >= cutoff);
            // Sort ascending time
            out.sort((a, b) => toMs(a.created_at) - toMs(b.created_at));
            return out;
        },
        [gameType, strategyId, cutoff]
    );

    const load = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            let data = [];
            if (typeof customLoader === 'function') {
                data = await customLoader({ userId, gameType, strategyId });
            } else if (supabase) {
                let q = supabase.from('prediction_results').select('*').eq('user_id', userId);
                if (gameType) q = q.eq('game_type', gameType);
                if (strategyId) q = q.eq('strategy_id', strategyId);
                // We pull a wider range and cut locally to keep client-fast filters stable.
                q = q.order('created_at', { ascending: true });
                const { data: rowsDb, error: err } = await q;
                if (err) throw err;
                data = rowsDb || [];
            } else {
                // Fallback: empty dataset (or plug your own loader)
                data = [];
            }
            setRows(filterLocal(data));
        } catch (e) {
            console.error('[useWinRateHistory] load error:', e);
            setError(e);
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, [userId, gameType, strategyId, customLoader, filterLocal]);

    // initial + dep changes
    useEffect(() => {
        load();
    }, [load]);

    // Optional realtime subscription (Supabase)
    useEffect(() => {
        if (!realtime || !supabase || !userId) return;
        // Clean existing
        if (subRef.current) {
            try { subRef.current.unsubscribe(); } catch (_) { }
            subRef.current = null;
        }
        const channel = supabase
            .channel(`wins-${userId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'prediction_results', filter: `user_id=eq.${userId}` },
                () => {
                    // Lightweight reload; debounce could be added if high volume
                    load();
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    // noop
                }
            });

        subRef.current = {
            unsubscribe: () => {
                try { supabase.removeChannel(channel); } catch (_) { }
            },
        };

        return () => {
            if (subRef.current) {
                try { subRef.current.unsubscribe(); } catch (_) { }
                subRef.current = null;
            }
        };
    }, [realtime, userId, load]);

    const { winRate, trend, counts } = useMemo(() => computeStats(rows), [rows]);
    const sparkline = useMemo(() => buildSparkline(rows, sparklinePoints), [rows, sparklinePoints]);

    const unsubscribe = useCallback(() => {
        if (subRef.current) {
            try { subRef.current.unsubscribe(); } catch (_) { }
            subRef.current = null;
        }
    }, []);

    // Shadow mode (read-only) doesn’t alter behavior; just a semantic flag for upstream UIs.
    if (shadow) {
        // No extra behavior here, but preserved for future guards.
    }

    const data = useMemo(
        () =>
            sparkline.map((point, index) => ({
                date: `Window ${index + 1}`,
                winRate: point.v,
                partialRate: 0,
                missRate: Math.max(0, 1 - point.v),
            })),
        [sparkline]
    );

    return {
        data,
        winRate: Number.isFinite(winRate) ? Number(winRate.toFixed(2)) : 0,
        trend,               // 'up' | 'down' | 'neutral'
        history: rows,       // filtered & time-sorted
        sparkline,           // [{t, v}] normalized 0..1 points across window
        counts,              // {wins, losses, total}
        isLoading,
        loading: isLoading,
        error,
        reload: load,
        unsubscribe,
    };
}

export default useWinRateHistory;
