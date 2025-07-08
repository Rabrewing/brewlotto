// @components/dashboard/WinRateChart.jsx
// Updated: 2025-06-28T02:46EDT
// Visualizes Brew prediction accuracy over time as a win rate chart
// Preps for strategy overlays and tier analytics (future-ready)

import { Line } from "react-chartjs-2";
import { useWinRateHistory } from "@/hooks/useWinRateHistory";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function WinRateChart({ userId }) {
    const { data, loading } = useWinRateHistory({ userId });

    if (loading) {
        return <div className="text-neutral-400">Loading Brew analytics…</div>;
    }

    const chartData = {
        labels: data.map((entry) => entry.date),
        datasets: [
            {
                label: "🟢 Full Match Rate",
                data: data.map((entry) => entry.winRate),
                borderColor: "#10B981",
                fill: false,
                tension: 0.4,
            },
            {
                label: "🟡 Partial Hit Rate",
                data: data.map((entry) => entry.partialRate),
                borderColor: "#FACC15",
                fill: false,
                tension: 0.4,
            },
            {
                label: "🔴 Miss Rate",
                data: data.map((entry) => entry.missRate),
                borderColor: "#EF4444",
                fill: false,
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "#e5e5e5",
                    padding: 12,
                },
            },
            tooltip: {
                mode: "index",
                intersect: false,
                backgroundColor: "#1a1a1a",
                titleColor: "#facc15",
                bodyColor: "#e5e5e5",
                borderColor: "#fde047",
                borderWidth: 1,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: "#333" },
                ticks: { color: "#facc15", stepSize: 0.1, callback: (v) => `${Math.round(v * 100)}%` },
            },
            x: {
                grid: { display: false },
                ticks: { color: "#aaa" },
            },
        },
    };

    return (
        <div className="bg-neutral-950 border border-yellow-500 p-4 rounded shadow-lg">
            <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                📈 Your Brew Accuracy Over Time
            </h3>
            <Line data={chartData} options={chartOptions} />
        </div>
    );
}