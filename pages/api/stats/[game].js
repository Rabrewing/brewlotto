// /pages/api/stats/[game].js
// BrewLotto AI — Universal Stats API for Pick 3/4/5, Mega, Powerball
// Production-ready | 2025-06-24

import { fetchStats } from "@/utils/fetchStats.js";

export default async function handler(req, res) {
    const { game } = req.query; // 'pick3', 'pick4', 'pick5', 'mega', 'powerball'
    if (!game) return res.status(400).json({ error: "Missing game param" });
    try {
        const stats = await fetchStats(game, req.query);
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message || "Stats fetch failed" });
    }
}
