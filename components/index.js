// =============================================
// 📁 /components/index.js
// Updated: 2025-06-28T02:59 EDT
// Summary: Central export hub for UI components, layouts, dashboards, and Brew modules
// Organized by usage domain: Core App, Dashboard, Landing, Brew, Strategy, Overlays
// =============================================

// 🧭 Core App Components
export { default as NavBar } from "./NavBar";
export { default as RequireAuth } from "./RequireAuth";
export { default as DrawResultCard } from "./DrawResultCard";

// 🎯 Prediction Experience
export { default as PredictionCard } from "./predict/PredictionCard";
export { default as PredictionInsights } from "./predict/PredictionInsights";
export { default as PredictionStrategyToggle } from "./predict/PredictionStrategyToggle";
export { default as GameIntroCard } from "./predict/GameIntroCard";
export { default as DailyPickTracker } from "./predict/DailyPickTracker";
export { default as StrategyExplainModal } from "./predict/StrategyExplainModal";
export { default as ReplayModal } from "./user/ReplayModal";

// 📊 Dashboard + Admin (BrewHub)
export { default as PredictionFeed } from "./dashboard/PredictionFeed";
export { default as UploadZone } from "./dashboard/UploadZone";
export { default as RefreshTrigger } from "./dashboard/RefreshTrigger";
export { default as AuditViewer } from "./dashboard/AuditViewer";
export { default as DrawHealthMonitor } from "./dashboard/DrawHealthMonitor";
export { default as SidebarMenu } from "./dashboard/SidebarMenu";
export { default as AdminHubLayout } from "./dashboard/AdminHubLayout";
export { default as GameStrategySelector } from "./dashboard/GameStrategySelector";
export { default as PickDrawCards } from "./dashboard/PickDrawCards";
export { default as UserStatsCard } from "./dashboard/UserStatsCard";
export { default as WinRateChart } from "./dashboard/WinRateChart";

// 🛬 Landing Page Components
export { default as HamburgerMenu } from "./nav/HamburgerMenu";
export { default as LandingLayout } from "./layouts/LandingLayout";
export { default as GameCard } from "./landing/GameCard";
export { default as PricingTierCard } from "./landing/PricingTierCard";

// 🤖 Brew Interface Layer
export { default as BrewLottoBot } from "./ui/BrewLottoBot";
export { default as BrewLottoBotDock } from "./ui/BrewLottoBotDock";
export { default as BrewAvatar } from "./ui/BrewAvatar";
export { default as BrewAvatarAnimated } from "./ui/BrewAvatarAnimated";
export { default as BrewLottoBotModal } from "./ui/BrewLottoBotModal";
export { default as BrewCommentaryEngine } from "./ui/BrewCommentaryEngine";

// 📁 Player Profile & History
export { default as MyPicksCard } from "./user/MyPicksCard";
export { default as MatchScoreBadge } from "./user/MatchScoreBadge";
export { default as TierStatusBanner } from "./user/TierStatusBanner";

// 🧪 BrewVision Experimental Tools
export { default as DevCoreLaunchButton } from "./BrewVision/DevCoreLaunchButton";
export { default as EntropyMeter } from "./BrewVision/EntropyMeter";
export { default as FireballHeatMap } from "./BrewVision/FireballHeatMap";

// 🧠 BrewBrain Utilities (Coming Soon)
// export { default as BrewSettingsModal } from "./ui/BrewSettingsModal";
// export { default as BrewSentinelWatcher } from "./ui/BrewSentinelWatcher";
// export { default as StrategyStacker } from "./predict/StrategyStacker";