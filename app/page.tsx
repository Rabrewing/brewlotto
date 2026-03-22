"use client";

import { useState } from "react";
import {
  Flame,
  Snowflake,
  Sparkles,
  Mic,
  Lock,
  UserRound,
  ArrowRight,
  Home,
  Calendar,
  User,
} from "lucide-react";
import {
  GAME_CONFIGS,
  GameConfig,
  GameKey,
  getOrderedGames,
} from "@/lib/brewlotto-games";

/**
 * BrewLotto V1 mock UI
 * --------------------------------------------------
 * This is intentionally visual-first so the frontend
 * matches the premium mock as closely as possible.
 * Swap mock data with Supabase/API data later.
 */

const MOCK_HOT: Record<GameKey, number[]> = {
  pick3: [3, 1, 7],
  pick4: [1, 2, 4, 9],
  cash5: [3, 14, 29, 31, 40],
  powerball: [3, 14, 29, 41, 52],
  'mega-millions': [5, 16, 23, 42, 61],
};

const MOCK_COLD: Record<GameKey, number[]> = {
  pick3: [8, 9, 0],
  pick4: [0, 8, 6, 5],
  cash5: [2, 9, 33, 37, 43],
  powerball: [1, 7, 22, 54, 69],
  'mega-millions': [4, 18, 27, 55, 70],
};

const MOCK_BONUS_HOT: Partial<Record<GameKey, number>> = {
  powerball: 11,
  'mega-millions': 10,
};

const MOCK_BONUS_COLD: Partial<Record<GameKey, number>> = {
  powerball: 3,
  'mega-millions': 2,
};

const MOCK_MOMENTUM: Record<GameKey, number> = {
  pick3: 72,
  pick4: 64,
  cash5: 58,
  powerball: 49,
  'mega-millions': 53,
};

const DEFAULT_GAME: GameKey = "powerball";

export default function Page() {
  const [selectedGame, setSelectedGame] = useState<GameKey>(DEFAULT_GAME);

  const config = GAME_CONFIGS[selectedGame];
  const hot = MOCK_HOT[selectedGame] ?? [];
  const cold = MOCK_COLD[selectedGame] ?? [];
  const bonusHot = MOCK_BONUS_HOT[selectedGame];
  const bonusCold = MOCK_BONUS_COLD[selectedGame];
  const momentum = MOCK_MOMENTUM[selectedGame] ?? 50;

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-2 text-white">
      <div className="w-full max-w-[500px] h-[88vh] max-h-[920px] flex items-center justify-center mx-auto">
        <section className="relative w-full h-full">
          {/* Outer aura */}
          <div className="pointer-events-none absolute -inset-10 rounded-[44px] bg-[radial-gradient(circle_at_center,rgba(255,184,28,0.30),transparent_58%)] blur-2xl" />

          {/* Device shell */}
          <div className="relative h-full flex flex-col overflow-hidden rounded-[42px] border border-[#ffbf3d]/60 bg-[#0a0909] shadow-[0_0_0_1px_rgba(255,210,110,0.35),0_0_22px_rgba(255,170,0,0.18),0_0_80px_rgba(255,140,0,0.14),0_0_120px_rgba(255,200,0,0.15),0_0_40px_rgba(255,200,0,0.2)]">
            {/* golden edge glow */}
            <div className="pointer-events-none absolute inset-0 rounded-[42px] ring-1 ring-[#ffd36f]/25" />
            <div className="pointer-events-none absolute inset-[1px] rounded-[41px] shadow-[inset_0_0_24px_rgba(255,179,0,0.15),inset_0_0_60px_rgba(255,140,0,0.10)]" />
            <div className="pointer-events-none absolute left-0 right-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,194,80,0.18),transparent_65%)]" />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-[radial-gradient(circle_at_bottom,rgba(255,170,0,0.14),transparent_70%)]" />

            {/* Header area - fixed */}
            <div className="px-6 pt-6 pb-2">
              <Header />
              <NavigationTabs />
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="mt-4">
                <SectionKicker />
              </div>

              <div className="mt-4">
                <GameTabs selected={selectedGame} onChange={setSelectedGame} />
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-[1.6fr_1fr] gap-3">
                <div className="space-y-3">
                  <StatCard
                    title="Hot Numbers"
                    tone="hot"
                    icon={<Flame className="h-5 w-5" />}
                  >
                    <NumberPanel
                      config={config}
                      primary={hot}
                      bonus={bonusHot}
                      tone="hot"
                    />
                  </StatCard>

                  <StatCard
                    title="Cold Numbers"
                    tone="cold"
                    icon={<Snowflake className="h-5 w-5" />}
                  >
                    <NumberPanel
                      config={config}
                      primary={cold}
                      bonus={bonusCold}
                      tone="cold"
                    />
                  </StatCard>
                </div>

                <MomentumCard value={momentum} />
              </div>

              <div className="mt-5">
                <PredictionCard config={config} />
              </div>

              <div className="mt-5">
                <button className="group relative flex h-[56px] sm:h-[64px] w-full items-center justify-center rounded-[999px] border border-[#ffd978]/80 bg-[linear-gradient(180deg,#ffcf4a_0%,#ffba19_55%,#f6a800_100%)] px-4 sm:px-6 text-[16px] sm:text-[18px] font-bold text-black shadow-[0_0_0_2px_rgba(255,200,60,0.12),0_10px_35px_rgba(255,170,0,0.35),0_0_30px_rgba(255,200,0,0.6),0_0_60px_rgba(255,140,0,0.4),inset_0_1px_0_rgba(255,255,255,0.45)] transition duration-200 hover:scale-[1.01]">
                  <span className="absolute inset-[2px] rounded-[999px] bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.02))]" />
                  <span className="relative flex items-center gap-3">
                    Generate My Smart Pick
                    <ArrowRight className="h-6 w-6 transition group-hover:translate-x-1" />
                  </span>
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <UtilityPill icon={<UserRound className="h-5 w-5" />} label="My Picks" />
                <UtilityPill icon={<Lock className="h-5 w-5" />} label="Strategy Locker" />
              </div>

              <div className="mt-5">
                <VoiceCard />
              </div>
            </div>

            {/* Bottom navigation - fixed */}
            <BottomNav />
          </div>
        </section>
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-[#f0c46b]">
          <span className="inline-block h-[2px] w-4 rounded-full bg-[#f0b63f]" />
          <span>BrewVerse Labs</span>
        </div>

        <h1 className="mt-4 text-[36px] font-black uppercase tracking-wide text-[#ffc742] drop-shadow-[0_0_18px_rgba(255,184,28,0.45)] sm:text-[40px]">
          BREWLOTTO
        </h1>

        <div className="mt-2 h-[3px] w-[160px] rounded-full bg-[linear-gradient(90deg,rgba(255,200,72,0.9),rgba(255,170,0,0.5),transparent)] shadow-[0_0_14px_rgba(255,180,0,0.65)]" />
      </div>

      <UserAvatar />
    </header>
  );
}

function UserAvatar() {
  return (
    <div className="relative mt-1 flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full border-[2px] border-[#ffd12d] overflow-hidden">
      <div className="absolute inset-0 rounded-full border border-[#ffd12d]/50 shadow-[0_0_15px_rgba(255,195,0,0.3)]" />
      <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop" alt="User Avatar" className="h-[44px] w-[44px] rounded-full object-cover" />
    </div>
  );
}

function NavigationTabs() {
  const [activeTab, setActiveTab] = useState<"Dashboard" | "Results" | "My Picks">("Dashboard");
  
  return (
    <div className="flex items-center justify-between gap-2 mt-4">
      <button 
        onClick={() => setActiveTab("Dashboard")}
        className={`flex-1 py-1 text-[13px] font-medium transition-colors ${
          activeTab === "Dashboard" 
            ? "text-[#ffd364] border-b-2 border-[#ffd364]" 
            : "text-white/70 hover:text-white"
        }`}
      >
        Dashboard
      </button>
      <button 
        onClick={() => setActiveTab("Results")}
        className={`flex-1 py-1 text-[13px] font-medium transition-colors ${
          activeTab === "Results" 
            ? "text-[#ffd364] border-b-2 border-[#ffd364]" 
            : "text-white/70 hover:text-white"
        }`}
      >
        Results
      </button>
      <button 
        onClick={() => setActiveTab("My Picks")}
        className={`flex-1 py-1 text-[13px] font-medium transition-colors ${
          activeTab === "My Picks" 
            ? "text-[#ffd364] border-b-2 border-[#ffd364]" 
            : "text-white/70 hover:text-white"
        }`}
      >
        My Picks
      </button>
    </div>
  );
}

function SectionKicker() {
  return (
    <div className="text-[13px] font-medium uppercase tracking-[0.22em] text-[#d6d1cf]">
      Today&apos;s Draw Insights
    </div>
  );
}

function GameTabs({
  selected,
  onChange,
}: {
  selected: GameKey;
  onChange: (key: GameKey) => void;
}) {
  const games = getOrderedGames();

  return (
    <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {games.map((game) => {
        const active = game.key === selected;

        return (
          <button
            key={game.key}
            onClick={() => onChange(game.key)}
            className={[
              "relative flex-shrink-0 rounded-full px-3 py-2 text-[12px] font-medium transition-all duration-200",
              "border",
              active
                ? "border-[#ffcd52] bg-[linear-gradient(180deg,#6a4700_0%,#c48714_28%,#ffb61d_100%)] text-[#fff4c4] shadow-[0_0_0_1px_rgba(255,205,82,0.15),0_0_20px_rgba(255,182,29,0.35),inset_0_1px_0_rgba(255,255,255,0.25)]"
                : "border-white/10 bg-[linear-gradient(180deg,rgba(30,27,27,0.96),rgba(14,12,12,0.96))] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-[#f3bc57]/40 hover:text-white",
            ].join(" ")}
          >
            {game.label}
            {active && (
              <span className="absolute left-1/2 top-full h-[4px] w-8 -translate-x-1/2 rounded-full bg-[#ffbe27] shadow-[0_0_12px_rgba(255,190,39,0.95)]" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

function StatCard({
  title,
  icon,
  tone,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  tone: "hot" | "cold";
  children: React.ReactNode;
}) {
  const titleTone =
    tone === "hot"
      ? "text-[#ffbd39] drop-shadow-[0_0_12px_rgba(255,181,54,0.35)]"
      : "text-[#72caff] drop-shadow-[0_0_12px_rgba(61,170,255,0.28)]";

  const borderTone =
    tone === "hot"
      ? "border-[#ffb84a]/50 shadow-[0_0_15px_rgba(255,184,0,0.15),inset_0_0_20px_rgba(255,215,0,0.05),0_0_25px_rgba(255,140,0,0.1)]"
      : "border-[#58a9ff]/40 shadow-[0_0_15px_rgba(100,180,255,0.15),inset_0_0_20px_rgba(100,180,255,0.05),0_0_25px_rgba(40,110,255,0.1)]";

  return (
    <div
      className={[
        "relative overflow-hidden rounded-[30px] border bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(0,0,0,0.6))] backdrop-blur-[10px] p-3",
        borderTone,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,180,0,0.08),transparent_36%)]" />
      <div className="flex items-center gap-2">
        <span className={titleTone}>{icon}</span>
        <h2 className={`text-[17px] font-semibold ${titleTone}`}>{title}</h2>
      </div>

      <div className="mt-5">{children}</div>
    </div>
  );
}

function NumberPanel({
  config,
  primary,
  bonus,
  tone,
}: {
  config: GameConfig;
  primary: number[];
  bonus?: number;
  tone: "hot" | "cold";
}) {
  const showBonus = config.hasBonus && typeof bonus === "number";

  return (
    <div>
      <div className="flex gap-3">
        {primary.slice(0, config.primaryCount).map((n, idx) => (
          <LotteryBall key={`${tone}-${idx}-${n}`} value={n} tone={tone} config={config} />
        ))}
      </div>

      {showBonus && (
        <div className="mt-5 flex justify-center">
          <LotteryBall
            value={bonus}
            tone={tone}
            variant="bonus"
            label={config.bonusLabel ?? "Bonus"}
            config={config}
          />
        </div>
      )}
    </div>
  );
}

function LotteryBall({
  value,
  tone,
  variant = "primary",
  label,
  config,
}: {
  value: number;
  tone: "hot" | "cold";
  variant?: "primary" | "bonus";
  label?: string;
  config?: GameConfig;
}) {
  const isBonus = variant === "bonus";

  const outerClass = isBonus
    ? tone === "hot"
      ? "bg-[radial-gradient(circle_at_30%_30%,#ffb978_0%,#ff6230_35%,#c01600_100%)] shadow-[inset_0_4px_10px_rgba(255,255,255,0.4),inset_0_-6px_10px_rgba(0,0,0,0.6),0_0_12px_rgba(255,200,0,0.6),0_0_20px_rgba(255,87,34,0.45)]"
      : "bg-[radial-gradient(circle_at_30%_30%,#7fe6ff_0%,#1ea6ff_42%,#0049c6_100%)] shadow-[inset_0_4px_10px_rgba(255,255,255,0.4),inset_0_-6px_10px_rgba(0,0,0,0.6),0_0_12px_rgba(255,200,0,0.6),0_0_20px_rgba(47,156,255,0.42)]"
    : tone === "hot"
    ? "bg-[radial-gradient(circle_at_30%_25%,#fff3a1_0%,#ffd449_35%,#f0a300_78%,#b96d00_100%)] shadow-[inset_0_4px_10px_rgba(255,255,255,0.4),inset_0_-6px_10px_rgba(0,0,0,0.6),0_0_12px_rgba(255,200,0,0.6),0_0_18px_rgba(255,188,44,0.42)]"
    : "bg-[radial-gradient(circle_at_30%_25%,#ffffff_0%,#caecff_30%,#8fcfff_62%,#4a9cdb_100%)] shadow-[inset_0_4px_10px_rgba(255,255,255,0.4),inset_0_-6px_10px_rgba(0,0,0,0.6),0_0_12px_rgba(255,200,0,0.6),0_0_18px_rgba(102,197,255,0.30)]";

  const textTone = isBonus ? "text-white" : "text-[#121212]";
  
  // Calculate ball size based on game config
  let baseSize = 60; // default
  let baseTextSize = 24;
  if (config) {
    // Smaller balls for games with more numbers
    switch (config.primaryCount) {
      case 3: // Pick 3
        baseSize = 60;
        baseTextSize = 24;
        break;
      case 4: // Pick 4
        baseSize = 56;
        baseTextSize = 22;
        break;
      case 5: // Cash 5, Powerball, Mega
        // Check if it has bonus (Powerball/Mega) for even smaller balls
        if (config.hasBonus) {
          baseSize = 44;
          baseTextSize = 18;
        } else {
          baseSize = 50;
          baseTextSize = 20;
        }
        break;
      default:
        baseSize = 48;
        baseTextSize = 18;
    }
  }
  
  // Bonus balls are slightly larger
  const finalSize = isBonus ? baseSize + 8 : baseSize;
  const finalTextSize = isBonus ? baseTextSize + 4 : baseTextSize;

  return (
    <div className="flex flex-col items-center">
      <div
        className={[
          "relative flex items-center justify-center rounded-full border border-white/15 font-black tracking-tight",
          outerClass,
          textTone,
        ].join(" ")}
        style={{ width: finalSize, height: finalSize, fontSize: finalTextSize }}
      >
        <span className="absolute inset-[3px] rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_55%)]" />
        <span className="relative">{value}</span>
      </div>

      {label && (
        <div
          className={[
            "mt-2 rounded-full px-4 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]",
            tone === "hot"
              ? "bg-[linear-gradient(180deg,#80331d,#c75a2d)]"
              : "bg-[linear-gradient(180deg,#12618b,#1c9be0)]",
          ].join(" ")}
        >
          {label}
        </div>
      )}
    </div>
  );
}

function MomentumCard({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="relative overflow-hidden rounded-[30px] border border-[#ffb84a]/50 bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(0,0,0,0.6))] backdrop-blur-[10px] p-3 shadow-[0_0_15px_rgba(255,184,0,0.15),inset_0_0_20px_rgba(255,215,0,0.05),0_0_25px_rgba(255,140,0,0.1)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,180,0,0.08),transparent_42%)]" />

      <h2 className="text-[14px] font-semibold text-[#ffcf67]">Momentum Meter</h2>

      <div className="mt-4 flex flex-1 flex-col items-center justify-between">
        {/* Wavy edge container */}
        <div className="relative flex h-full min-h-[280px] w-[80px] items-end justify-center rounded-[40px] border border-[#33281c] bg-[linear-gradient(180deg,#0f0b0a,#171111_40%,#0e0909)] p-[10px] shadow-[inset_0_0_22px_rgba(0,0,0,0.75),0_0_15px_rgba(255,200,0,0.3)]">
          {/* Wavy decorative edges */}
          <div className="absolute -left-2 inset-y-8 w-2">
            <svg viewBox="0 0 8 200" className="h-full w-full" preserveAspectRatio="none">
              <path d="M4,0 Q0,25 4,50 Q8,75 4,100 Q0,125 4,150 Q8,175 4,200" 
                    fill="none" stroke="rgba(255,170,0,0.3)" strokeWidth="1.5"/>
            </svg>
          </div>
          <div className="absolute -right-2 inset-y-8 w-2">
            <svg viewBox="0 0 8 200" className="h-full w-full" preserveAspectRatio="none">
              <path d="M4,0 Q8,25 4,50 Q0,75 4,100 Q8,125 4,150 Q0,175 4,200" 
                    fill="none" stroke="rgba(255,170,0,0.3)" strokeWidth="1.5"/>
            </svg>
          </div>
          
          {/* Inner glow lines */}
          <div className="absolute inset-y-5 left-3 w-[1px] bg-[linear-gradient(180deg,transparent,rgba(255,170,0,0.15),transparent)]" />
          <div className="absolute inset-y-5 right-3 w-[1px] bg-[linear-gradient(180deg,transparent,rgba(255,170,0,0.15),transparent)]" />

          {/* Inner fill bar */}
          <div className="relative h-full w-[30px] overflow-hidden rounded-full border border-[#1b130f] bg-[linear-gradient(180deg,#070606,#120d0c)] shadow-[inset_0_0_12px_rgba(0,0,0,0.8)]">
            <div
              className="absolute bottom-0 left-0 right-0 rounded-full bg-[linear-gradient(180deg,#ff8a00_0%,#ffd700_30%,#fff3a0_60%,#ff8a00_100%)] shadow-[0_0_24px_rgba(255,153,0,0.6)]"
              style={{ height: `${clamped}%` }}
            />
            {/* Center highlight */}
            <div className="absolute inset-x-[35%] bottom-0 w-[30%] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.0),rgba(255,244,180,0.75),rgba(255,255,255,0.0))]" />
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,214,84,0.08),transparent_60%)]" />
          </div>
        </div>

        {/* Percentage and label */}
        <div className="mt-3 text-center">
          <div className="text-[36px] font-semibold leading-none text-[#ffcf68] drop-shadow-[0_0_12px_rgba(255,190,39,0.32)]">
            {clamped}%
          </div>
          <div className="mt-1 text-[12px] text-white/75">Win Probability</div>
        </div>
      </div>
    </div>
  );
}

function PredictionCard({ config }: { config: GameConfig }) {
  return (
    <div className="relative h-full overflow-hidden rounded-[30px] border border-[#ffb84a]/40 bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(0,0,0,0.6))] backdrop-blur-[10px] p-3 shadow-[0_0_15px_rgba(255,184,0,0.15),inset_0_0_20px_rgba(255,215,0,0.05),0_0_25px_rgba(255,140,0,0.1)]">
      <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 bg-[radial-gradient(circle,rgba(255,174,0,0.15),transparent_55%)]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-28 w-28 bg-[radial-gradient(circle,rgba(255,174,0,0.12),transparent_58%)]" />

      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-[#cc83ff]" />
        <h2 className="text-[16px] font-semibold text-[#e2b7ff]">Prediction</h2>
      </div>

      <p className="mt-5 text-[16px] leading-8 text-white/88">
        Brew says today&apos;s pattern for{" "}
        <span className="font-bold text-[#ffd364]">{config.label}</span> favors{" "}
        <span className="font-bold text-[#ffd364]">low &amp; even</span> numbers,
        recent <span className="font-bold text-[#ffce5c]">hot streaks</span>, and
        overdue positions.
      </p>
    </div>
  );
}

function UtilityPill({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button className="flex h-[52px] items-center justify-center gap-3 rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(28,23,23,0.96),rgba(10,10,10,0.96))] px-4 text-[15px] font-medium text-[#f3dfb0] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:border-[#ffbf47]/30 hover:text-white">
      <span className="text-[#f3cb69]">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function VoiceCard() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[28px] border border-[#ffb84a]/20 bg-[linear-gradient(180deg,rgba(18,14,14,0.96),rgba(8,8,10,0.96))] px-4 py-3 shadow-[inset_0_0_25px_rgba(255,153,0,0.03)]">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ffce61]/25 bg-[radial-gradient(circle,#2a2017,#120f0f)] text-[#ffcb60]">
          <Mic className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <div className="text-[17px] font-semibold text-[#ffcf68]">Voice Mode</div>
          <div className="mt-1 text-[14px] text-white/70">
            Tap to let Brew narrate the odds in real time.
          </div>
        </div>
      </div>

      <button className="relative flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full border border-[#ffe08e]/70 bg-[radial-gradient(circle_at_35%_30%,#ffe685_0%,#ffc926_45%,#eea700_82%,#b16e00_100%)] text-black shadow-[0_0_0_2px_rgba(255,220,120,0.12),0_0_28px_rgba(255,187,0,0.40),0_0_40px_rgba(255,187,0,0.6),0_0_80px_rgba(255,140,0,0.4),inset_0_2px_10px_rgba(255,255,255,0.28)]">
        <Mic className="h-7 w-7" />
        <span className="absolute -left-5 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-l-2 border-[#ffcb55]/60 opacity-70" />
        <span className="absolute -left-9 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full border-l-2 border-[#ffcb55]/40 opacity-50" />
      </button>
    </div>
  );
}

function BottomNav() {
  return (
    <div className="flex items-center justify-around px-4 py-3 sm:px-6 sm:py-4 border-t border-[#ffb84a]/20 shadow-[0_-2px_20px_rgba(255,200,0,0.05)]">
      <button className="flex flex-col items-center gap-1 text-[#ffcf68]">
        <Home className="h-6 w-6" />
        <span className="text-[10px] font-medium">Home</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-white/50 hover:text-white/80">
        <Calendar className="h-6 w-6" />
        <span className="text-[10px] font-medium">Calendar</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-white/50 hover:text-white/80">
        <User className="h-6 w-6" />
        <span className="text-[10px] font-medium">Profile</span>
      </button>
    </div>
  );
}