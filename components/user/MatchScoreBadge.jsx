// @components/user/MatchScoreBadge.jsx
// Summary: Displays match score badge for predictions

export default function MatchScoreBadge({ score, maxScore = 5, className = "" }) {
    const percentage = (score / maxScore) * 100;
    let colorClass = "bg-gray-500";
    
    if (percentage >= 80) colorClass = "bg-green-500";
    else if (percentage >= 60) colorClass = "bg-yellow-500";
    else if (percentage >= 40) colorClass = "bg-orange-500";
    else if (percentage >= 20) colorClass = "bg-red-500";

    return (
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colorClass} ${className}`}>
            <span>Match:</span>
            <span className="font-bold">{score}/{maxScore}</span>
        </div>
    );
}
