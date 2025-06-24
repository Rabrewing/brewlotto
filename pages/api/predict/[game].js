// /pages/api/predict/[game].js
import { getSmartPick } from "../../../utils/getSmartPick";

export default async function handler(req, res) {
    const { game } = req.query;
    const { strategy = "momentum" } = req.query;
    if (!game) return res.status(400).json({ error: "Missing game param" });
    try {
        const pick = await getSmartPick(game, strategy, req.query);
        res.status(200).json(pick);
    } catch (err) {
        res.status(500).json({ error: err.message || "Prediction failed" });
    }
}
