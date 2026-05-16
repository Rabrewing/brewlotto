"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";

import {
    DashboardContainer,
    Header,
    NavigationTabs,
    SectionCard,
} from "@/components/brewlotto/dashboard";
import { isBrewCommandAccessUser } from "@/lib/auth/brewcommandShared";
import { supabase } from "@/lib/supabase/browserClient";

type TierCode = "free" | "starter" | "pro" | "master";
type JourneyStage =
    | "start_here"
    | "onboarding"
    | "dashboard_free"
    | "starter_strategy_locker"
    | "my_picks_confirmation"
    | "results_history"
    | "billing_pricing"
    | "notifications"
    | "support"
    | "brewu"
    | "master_timepulse"
    | "other";
type FeatureArea =
    | "dashboard"
    | "strategy-locker"
    | "my-picks"
    | "results"
    | "stats"
    | "pricing"
    | "billing"
    | "notifications"
    | "support"
    | "learn"
    | "login"
    | "other";

interface QaReportFormState {
    testerName: string;
    tierTested: TierCode;
    journeyStage: JourneyStage;
    featureArea: FeatureArea;
    priority: "low" | "normal" | "high" | "urgent";
    loadedAsExpected: boolean;
    tierMatched: boolean;
    nextStepMatched: boolean;
    fireballRelevant: boolean;
    timepulseRelevant: boolean;
    expectedBehavior: string;
    actualBehavior: string;
    notes: string;
    pagePath: string;
}

interface QaMeta {
    userEmail: string;
    testerName: string;
    pagePath: string;
    browserInfo: Record<string, unknown>;
}

const TIER_OPTIONS: Array<{ value: TierCode; label: string; description: string }> = [
    { value: "free", label: "Free", description: "Dashboard showcase, onboarding, and read-only surfaces." },
    { value: "starter", label: "Starter", description: "Strategy Locker entry with a small set of strategies." },
    { value: "pro", label: "Pro", description: "Expanded strategy flow, confirmation, and tracking." },
    { value: "master", label: "Master", description: "TimePulse timing analysis and lag-based ranges." },
];

const JOURNEY_STAGES: Array<{ value: JourneyStage; label: string; description: string }> = [
    { value: "start_here", label: "Start here", description: "Login, onboarding, and the first dashboard view." },
    { value: "onboarding", label: "Onboarding", description: "Disclaimer, tutorial, and first-run setup." },
    { value: "dashboard_free", label: "Free dashboard", description: "Read-only home flow and app showcase." },
    { value: "starter_strategy_locker", label: "Starter locker", description: "Run a strategy and save a pick." },
    { value: "my_picks_confirmation", label: "My Picks", description: "Confirm a saved play and check Fireball." },
    { value: "results_history", label: "Results", description: "Draw history, dates, and match clarity." },
    { value: "billing_pricing", label: "Billing / Pricing", description: "Upgrade, downgrade, and Stripe checkout." },
    { value: "notifications", label: "Notifications", description: "Inbox, nudges, and delivery preferences." },
    { value: "support", label: "Support", description: "Report an issue and attach a screenshot." },
    { value: "brewu", label: "BrewU", description: "Help hub, play styles, and payout guidance." },
    { value: "master_timepulse", label: "Master / TimePulse", description: "Timing window, lag range, and Master-only access." },
    { value: "other", label: "Other", description: "Anything else the tester ran into." },
];

const FEATURE_AREAS: Array<{ value: FeatureArea; label: string; description: string }> = [
    { value: "dashboard", label: "Dashboard", description: "Home surface and free-tier showcase." },
    { value: "strategy-locker", label: "Strategy Locker", description: "Run / save / entitlement flow." },
    { value: "my-picks", label: "My Picks", description: "Saved picks and play confirmation." },
    { value: "results", label: "Results", description: "Date-based draw history and matches." },
    { value: "stats", label: "Stats", description: "Hit rates, wins, and performance." },
    { value: "pricing", label: "Pricing", description: "Plan selection and upgrade state." },
    { value: "billing", label: "Billing", description: "Portal, checkout, and subscription state." },
    { value: "notifications", label: "Notifications", description: "Inbox and delivery preferences." },
    { value: "support", label: "Support", description: "Issue intake and screenshot upload." },
    { value: "learn", label: "BrewU", description: "FAQ, play styles, and strategy help." },
    { value: "login", label: "Login / Auth", description: "Magic link and onboarding entry." },
    { value: "other", label: "Other", description: "Something outside the list above." },
];

const GUIDED_TEST_STEPS = [
    "Start at login or onboarding, then confirm the app opens cleanly and lands where the flow expects.",
    "Move through the tier ladder in order: Free, Starter, Pro, then Master.",
    "For Starter and Pro, run a strategy, save it to My Picks, and confirm the play when prompted.",
    "For NC Pick 3 / Pick 4, note whether Fireball appears and whether the result copy explains it clearly.",
    "For Master, check that TimePulse appears only on Master access and that the lag window copy makes sense.",
    "Check Results and Stats for the right date, divider, and confirmed-play behavior, then file the report.",
];

const FREE_ROAM_PROMPTS = [
    "Can the tester find how to upgrade without being told where to click?",
    "Can the tester find saved picks, results, stats, notifications, BrewU, and support on their own?",
    "Can the tester tell what the current tier is and what the next step should be?",
    "Can the tester explain whether the app felt obvious or whether it needed too much coaching?",
];

const BRANDED_SELECT_CLASS =
    "w-full appearance-none rounded-[18px] border border-[#72caff]/18 bg-[linear-gradient(180deg,rgba(16,25,34,0.98),rgba(8,13,18,0.98))] px-4 py-3 pr-10 text-[#f7f2e8] outline-none transition focus:border-[#72caff]/45";

const QA_INTRO_STORAGE_KEY = "brewlotto-qa-intro-accepted";
const QA_START_DATE_STORAGE_KEY = "brewlotto-qa-start-date";
const QA_DRAFT_STORAGE_PREFIX = "brewlotto:qa-draft:";

function makeQaDraftKey(email: string) {
    return `${QA_DRAFT_STORAGE_PREFIX}${email.trim().toLowerCase()}`;
}

function safeLoadDraft(email: string): Partial<QaReportFormState> | null {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const raw = window.localStorage.getItem(makeQaDraftKey(email));
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw) as Partial<QaReportFormState>;
        if (!parsed || typeof parsed !== "object") {
            return null;
        }

        return parsed;
    } catch {
        return null;
    }
}

function safeSaveDraft(email: string, formState: QaReportFormState) {
    if (typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.setItem(makeQaDraftKey(email), JSON.stringify(formState));
    } catch {
        // ignore storage issues
    }
}

function safeClearDraft(email: string) {
    if (typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.removeItem(makeQaDraftKey(email));
    } catch {
        // ignore storage issues
    }
}

function safeLoadQaStartDate() {
    if (typeof window === "undefined") {
        return "";
    }

    try {
        return window.localStorage.getItem(QA_START_DATE_STORAGE_KEY) || "";
    } catch {
        return "";
    }
}

function safeSaveQaStartDate(nextDate: string) {
    if (typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.setItem(QA_START_DATE_STORAGE_KEY, nextDate);
    } catch {
        // ignore storage issues
    }
}

function formatQaDate(value: string) {
    if (!value) {
        return "";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

function addDays(value: string, days: number) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    date.setDate(date.getDate() + days);
    return date.toISOString();
}

function formatQaDateTime(value: string) {
    if (!value) {
        return "";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

function YesNoToggle({
    label,
    value,
    onChange,
    helper,
}: {
    label: string;
    value: boolean;
    onChange: (next: boolean) => void;
    helper: string;
}) {
    return (
        <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
            <div className="text-[12px] uppercase tracking-[0.16em] text-white/38">{label}</div>
            <div className="mt-3 flex gap-2">
                <button
                    type="button"
                    onClick={() => onChange(true)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        value
                            ? "border-[#53d48a]/40 bg-[#102117] text-[#93efb8]"
                            : "border-white/10 bg-white/5 text-white/65 hover:border-white/20 hover:bg-white/10"
                    }`}
                >
                    Yes
                </button>
                <button
                    type="button"
                    onClick={() => onChange(false)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        !value
                            ? "border-[#ff7d67]/40 bg-[#2a1311] text-[#ffb5a8]"
                            : "border-white/10 bg-white/5 text-white/65 hover:border-white/20 hover:bg-white/10"
                    }`}
                >
                    No
                </button>
            </div>
            <div className="mt-2 text-[13px] leading-6 text-white/46">{helper}</div>
        </div>
    );
}

export default function QaPage() {
    const [loading, setLoading] = useState(true);
    const [restricted, setRestricted] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [introAccepted, setIntroAccepted] = useState(false);
    const [qaStartDate, setQaStartDate] = useState("");
    const [meta, setMeta] = useState<QaMeta>({
        userEmail: "",
        testerName: "",
        pagePath: "/qa",
        browserInfo: {},
    });
    const [formState, setFormState] = useState<QaReportFormState>({
        testerName: "",
        tierTested: "free",
        journeyStage: "start_here",
        featureArea: "dashboard",
        priority: "normal",
        loadedAsExpected: true,
        tierMatched: true,
        nextStepMatched: true,
        fireballRelevant: false,
        timepulseRelevant: false,
        expectedBehavior: "",
        actualBehavior: "",
        notes: "",
        pagePath: "/qa",
    });

    useEffect(() => {
        let active = true;

        const loadUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!active) return;

                if (!user || !isBrewCommandAccessUser(user)) {
                    await supabase.auth.signOut();
                    if (!active) return;
                    setRestricted(true);
                    setLoading(false);
                    return;
                }

                const testerName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "";
                const browserInfo = {
                    userAgent: window.navigator.userAgent,
                    platform: window.navigator.platform,
                    language: window.navigator.language,
                    viewport: `${window.innerWidth}x${window.innerHeight}`,
                    screen: `${window.screen.width}x${window.screen.height}`,
                };

                setUserEmail(user.email || "");
                setMeta({
                    userEmail: user.email || "",
                    testerName,
                    pagePath: "/qa",
                    browserInfo,
                });

                const draft = user.email ? safeLoadDraft(user.email) : null;
                setFormState((current) => ({
                    ...current,
                    ...draft,
                    testerName: draft?.testerName || testerName,
                    pagePath: "/qa",
                }));
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadUser();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        try {
            setIntroAccepted(window.localStorage.getItem(QA_INTRO_STORAGE_KEY) === "true");
            setQaStartDate(safeLoadQaStartDate());
        } catch {
            setIntroAccepted(false);
            setQaStartDate("");
        }
    }, []);

    useEffect(() => {
        if (!userEmail) {
            return;
        }

        safeSaveDraft(userEmail, formState);
    }, [formState, userEmail]);

    const selectedTier = useMemo(
        () => TIER_OPTIONS.find((entry) => entry.value === formState.tierTested) || TIER_OPTIONS[0],
        [formState.tierTested],
    );
    const selectedStage = useMemo(
        () => JOURNEY_STAGES.find((entry) => entry.value === formState.journeyStage) || JOURNEY_STAGES[0],
        [formState.journeyStage],
    );
    const selectedArea = useMemo(
        () => FEATURE_AREAS.find((entry) => entry.value === formState.featureArea) || FEATURE_AREAS[0],
        [formState.featureArea],
    );

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitting(true);
        setSubmissionMessage(null);
        setError(null);

        try {
            const form = new FormData(event.currentTarget);
            form.set("testerName", formState.testerName);
            form.set("tierTested", formState.tierTested);
            form.set("journeyStage", formState.journeyStage);
            form.set("featureArea", formState.featureArea);
            form.set("priority", formState.priority);
            form.set("loadedAsExpected", String(formState.loadedAsExpected));
            form.set("tierMatched", String(formState.tierMatched));
            form.set("nextStepMatched", String(formState.nextStepMatched));
            form.set("fireballRelevant", String(formState.fireballRelevant));
            form.set("timepulseRelevant", String(formState.timepulseRelevant));
            form.set("expectedBehavior", formState.expectedBehavior);
            form.set("actualBehavior", formState.actualBehavior);
            form.set("notes", formState.notes);
            form.set("pagePath", formState.pagePath);
            form.set("contactEmail", meta.userEmail);
            form.set("browserInfo", JSON.stringify(meta.browserInfo));

            const response = await fetch("/api/qa/submit", {
                method: "POST",
                body: form,
            });

            const payload = await response.json().catch(() => null);
            if (!response.ok || !payload?.success) {
                throw new Error(payload?.error?.message || "Failed to send QA report");
            }

            setSubmissionMessage("QA report sent. BrewCommand will review it and track the next step.");
            event.currentTarget.reset();
            if (meta.userEmail) {
                safeClearDraft(meta.userEmail);
            }
            setFormState({
                testerName: meta.testerName || "",
                tierTested: "free",
                journeyStage: "start_here",
                featureArea: "dashboard",
                priority: "normal",
                loadedAsExpected: true,
                tierMatched: true,
                nextStepMatched: true,
                fireballRelevant: false,
                timepulseRelevant: false,
                expectedBehavior: "",
                actualBehavior: "",
                notes: "",
                pagePath: "/qa",
            });
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Failed to send QA report");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-[#050505] text-white">
                <DashboardContainer>
                    <Header />
                    <NavigationTabs />
                    <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/60">
                        Loading Test Lab...
                    </div>
                </DashboardContainer>
            </main>
        );
    }

    if (restricted) {
        return (
            <main className="min-h-screen bg-[#050505] text-white">
                <DashboardContainer>
                    <Header />
                    <NavigationTabs />
                    <div className="mt-8 rounded-[28px] border border-[#ff8d7b]/25 bg-[#2a120d]/60 px-5 py-8 text-center text-[#ffc4b8]">
                        Test Lab access is only available to approved BrewCommand admin and QA tester accounts.
                    </div>
                </DashboardContainer>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <DashboardContainer>
                <Header />
                <NavigationTabs />

                <div className="mb-4 mt-2 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[32px] font-medium tracking-[-0.03em] text-[#f8cf98] sm:text-[40px]">Test Lab</div>
                    <button
                        type="button"
                        onClick={() => setIntroAccepted(false)}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[13px] font-semibold text-white/72 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                    >
                        Review tester guide
                    </button>
                </div>

                {!introAccepted ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-3 py-4 backdrop-blur-md sm:px-4 sm:py-6">
                        <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[30px] border border-[#72caff]/25 bg-[radial-gradient(circle_at_top_left,rgba(114,202,255,0.22),rgba(0,0,0,0)_32%),linear-gradient(145deg,rgba(14,20,28,0.98),rgba(6,6,6,0.98))] p-4 shadow-[0_0_60px_rgba(114,202,255,0.18)] sm:p-8">
                            <div className="text-[12px] uppercase tracking-[0.18em] text-[#bde7ff]">Before you start</div>
                            <div className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-[#d8f1ff] sm:text-[30px]">Read this first so we capture the full test flow</div>
                            <div className="mt-3 max-w-2xl text-[14px] leading-7 text-white/68 sm:text-[15px]">
                                This Test Lab is for approved family testers. It uses two passes: first a guided pass so we can verify the core flow, then a free-roam pass so we can see whether the app gives enough cues for people to find their way around on their own.
                            </div>
                            <div className="mt-5 grid gap-3 text-[13px] leading-6 text-white/72 sm:grid-cols-2 sm:text-[14px] sm:leading-7">
                                {[
                                    "Guided pass: start at login or onboarding, then follow the flow in order so we can verify the app does what the page promises.",
                                    "Guided pass: work the tiers in order: Free, Starter, Pro, then Master. Do not skip ahead unless the app sends you there.",
                                    "Guided pass: Starter and Pro should show Strategy Locker. Run a strategy there first, then save it to My Picks when the app asks you to.",
                                    "Guided pass: My Picks is where the real confirmation happens. Use the I Played This / Played step so we can tell generated previews from real plays.",
                                    "Guided pass: for NC Pick 3 / Pick 4, answer the Fireball question when it appears so the result can be tracked correctly.",
                                    "Guided pass: Master testers should look for TimePulse and its lag window. It may point to a range, not the exact draw day.",
                                    "Guided pass: on the free tier, confirm the blue trial banner shows a countdown and points the user toward pricing or the next step.",
                                ].map((item) => (
                                    <div key={item} className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3">
                                        {item}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-5 rounded-[22px] border border-[#72caff]/18 bg-[#101922] px-4 py-4">
                                <div className="text-[12px] uppercase tracking-[0.16em] text-[#bde7ff]">Free-roam pass</div>
                                <div className="mt-2 text-[14px] leading-7 text-white/68">
                                    After the guided pass, try to find the important surfaces without instructions and tell us whether the app gave you enough clues.
                                </div>
                                <div className="mt-3 grid gap-2 text-[13px] leading-6 text-white/64">
                                    {FREE_ROAM_PROMPTS.map((item) => (
                                        <div key={item} className="rounded-[16px] border border-white/8 bg-black/20 px-3 py-2">
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-5 rounded-[22px] border border-[#ffc742]/18 bg-[#20170a] px-4 py-4 text-[13px] leading-6 text-[#f7ddb3] sm:text-[14px] sm:leading-7">
                                <div className="text-[12px] uppercase tracking-[0.16em] text-[#ffd873]">Testing window</div>
                                <div className="mt-2">
                                    You have <span className="font-semibold text-white">7 days</span> from your first entry to test.
                                </div>
                                <div className="mt-2 text-white/74">
                                    Start date: {qaStartDate ? formatQaDateTime(qaStartDate) : "It starts when you click Begin Test Lab."}
                                </div>
                                {qaStartDate ? (
                                    <div className="mt-1 text-white/74">
                                        Recommended by: {formatQaDateTime(addDays(qaStartDate, 7))}
                                    </div>
                                ) : null}
                            </div>
                            <div className="mt-5 rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-[13px] leading-6 text-white/66 sm:text-[14px] sm:leading-7">
                                If you reach pricing or billing, check that pricing shows the correct tier ladder and that Billing opens the manage surface. Use Stripe test cards only. For a normal successful checkout, use{" "}
                                <span className="text-[#d8f1ff]">4242 4242 4242 4242</span> with any future expiry date like <span className="text-[#d8f1ff]">09/30</span> and any 3-digit CVC like <span className="text-[#d8f1ff]">222</span>.
                                If you need to test a decline path, use Stripe&apos;s generic decline card{" "}
                                <span className="text-[#d8f1ff]">4000 0000 0000 0002</span> with any future expiry date like <span className="text-[#d8f1ff]">09/30</span> and any 3-digit CVC like <span className="text-[#d8f1ff]">222</span> instead of a real card.
                            </div>
                            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const startDate = qaStartDate || new Date().toISOString();
                                        if (!qaStartDate) {
                                            setQaStartDate(startDate);
                                            safeSaveQaStartDate(startDate);
                                        }
                                        setIntroAccepted(true);
                                        try {
                                            window.localStorage.setItem(QA_INTRO_STORAGE_KEY, "true");
                                        } catch {
                                            // ignore storage issues
                                        }
                                    }}
                                    className="rounded-full bg-gradient-to-r from-[#72caff] to-[#52aefc] px-5 py-3 text-[15px] font-semibold text-black shadow-[0_0_18px_rgba(114,202,255,0.2)] transition hover:brightness-105"
                                >
                                    Begin Test Lab
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const target = document.getElementById("qa-report-form");
                                        target?.scrollIntoView({ behavior: "smooth", block: "start" });
                                    }}
                                    className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-[15px] font-semibold text-white/72 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                                >
                                    Go to report form
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}

                <section className="rounded-[30px] border border-[#72caff]/24 bg-[radial-gradient(circle_at_top_left,rgba(114,202,255,0.18),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(18,24,34,0.9),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(114,202,255,0.08)]">
                    <div className="text-[15px] uppercase tracking-[0.16em] text-[#bde7ff]">QA / tester workflow</div>
                    <div className="mt-3 text-[26px] font-semibold text-[#d8f1ff]">Walk the app from sign-in to tier testing, then tell us what happened</div>
                    <div className="mt-2 max-w-3xl text-[15px] leading-7 text-white/62">
                        This page is for approved testers only. Start at the beginning, move through each tier, then do a second free-roam pass to see whether the app teaches itself clearly enough. Use the form below to report what happened versus what should have happened. Your report will land in BrewCommand, not customer support.
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[20px] border border-[#ffc742]/18 bg-[#20170a] px-4 py-4 text-[13px] leading-6 text-[#f7ddb3]">
                            <div className="text-[11px] uppercase tracking-[0.16em] text-[#ffd873]">Testing window</div>
                            <div className="mt-2 text-[14px] text-white/82">
                                You have <span className="font-semibold text-white">7 days</span> from your first entry to finish the guided and free-roam passes.
                            </div>
                        </div>
                        <div className="rounded-[20px] border border-[#72caff]/18 bg-[#101922] px-4 py-4 text-[13px] leading-6 text-[#d8f1ff]">
                            <div className="text-[11px] uppercase tracking-[0.16em] text-[#bde7ff]">Start date</div>
                            <div className="mt-2 text-[14px] text-white/82">
                                {qaStartDate ? formatQaDateTime(qaStartDate) : "It starts when you click Begin Test Lab."}
                            </div>
                            {qaStartDate ? (
                                <div className="mt-1 text-white/64">
                                    Recommended by: {formatQaDateTime(addDays(qaStartDate, 7))}
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-[12px] text-white/58">
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">Start at login / onboarding</span>
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">Test each tier in order</span>
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">Do a free-roam pass after</span>
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">Check the free-tier countdown banner</span>
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">Use fake Stripe test cards only</span>
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">Reports go to BrewCommand</span>
                    </div>
                    <div className="mt-3 max-w-3xl text-[13px] leading-6 text-white/48">
                        If you reach billing, use Stripe test cards only. The common test number is <span className="text-[#d8f1ff]">4242 4242 4242 4242</span> with any future expiry date like <span className="text-[#d8f1ff]">09/30</span> and any 3-digit CVC like <span className="text-[#d8f1ff]">222</span>.
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Link href="/onboarding" className="rounded-full border border-[#72caff]/20 bg-[#111f28] px-4 py-2 text-sm font-semibold text-[#d8f1ff] transition hover:border-[#72caff]/35 hover:bg-[#162732]">
                            Open onboarding
                        </Link>
                        <Link href="/dashboard" className="rounded-full border border-[#ffd978]/20 bg-[#20170a] px-4 py-2 text-sm font-semibold text-[#ffd873] transition hover:border-[#ffd978]/35 hover:bg-[#2b2210]">
                            Start at dashboard
                        </Link>
                        <Link href="/pricing" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/72 transition hover:border-white/20 hover:bg-white/10">
                            Check pricing
                        </Link>
                    </div>
                </section>

                <section className="mt-5 grid gap-4 xl:grid-cols-2">
                    <SectionCard title="How to test" description="Guided pass first, then a free-roam pass to check whether the app explains itself.">
                        <div className="space-y-3">
                            {GUIDED_TEST_STEPS.map((step, index) => (
                                <div key={step} className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#ffd873]">Step {index + 1}</div>
                                    <div className="mt-2 text-[15px] leading-7 text-white/74">{step}</div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-5 rounded-[20px] border border-[#72caff]/18 bg-[#101922] p-4">
                            <div className="text-[11px] uppercase tracking-[0.16em] text-[#bde7ff]">Free-roam prompts</div>
                            <div className="mt-3 space-y-2">
                                {FREE_ROAM_PROMPTS.map((prompt) => (
                                    <div key={prompt} className="rounded-[16px] border border-white/8 bg-black/20 px-3 py-2 text-[14px] leading-6 text-white/68">
                                        {prompt}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard title="Tier notes" description="What each tester should look for at each level, including cues and next steps.">
                        <div className="grid gap-3">
                            {TIER_OPTIONS.map((tier) => (
                                <button
                                    key={tier.value}
                                    type="button"
                                    onClick={() => setFormState((current) => ({ ...current, tierTested: tier.value }))}
                                    className={`rounded-[20px] border px-4 py-3 text-left transition ${
                                        formState.tierTested === tier.value
                                            ? "border-[#ffc742]/35 bg-[#20170a] shadow-[0_0_12px_rgba(255,199,66,0.12)]"
                                            : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/[0.04]"
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="text-[11px] uppercase tracking-[0.16em] text-white/40">{tier.value}</div>
                                            <div className="mt-1 text-[17px] font-semibold text-white">{tier.label}</div>
                                        </div>
                                        {formState.tierTested === tier.value ? (
                                            <span className="rounded-full border border-[#ffd978]/30 bg-[#20170a] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#ffd873]">
                                                Selected
                                            </span>
                                        ) : null}
                                    </div>
                                    <div className="mt-2 text-[13px] leading-6 text-white/58">{tier.description}</div>
                                </button>
                            ))}
                        </div>
                    </SectionCard>
                </section>

                <section className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                    <SectionCard title="What to report" description="Use simple yes / no answers plus one short note about what happened.">
                        <div id="qa-report-form" />
                        <div className="mb-5 rounded-[20px] border border-[#72caff]/18 bg-[#0e1720] px-4 py-4">
                            <div className="text-[12px] uppercase tracking-[0.16em] text-[#bde7ff]">Tester identity</div>
                            <div className="mt-2 text-[14px] leading-7 text-white/68">
                                Your sign-in email is captured automatically. You can confirm or tweak the display name below so BrewCommand can match your report to the right tester.
                            </div>
                            <div className="mt-3 grid gap-2 text-[13px] text-white/60 sm:grid-cols-2">
                                <div>Signed in as: {userEmail || "Unknown"}</div>
                                <div>Display name: {formState.testerName || "Not set yet"}</div>
                            </div>
                        </div>
                        <div className="mb-5 rounded-[20px] border border-white/8 bg-black/20 px-4 py-4">
                            <div className="text-[12px] uppercase tracking-[0.16em] text-white/38">What counts as a good report</div>
                            <div className="mt-2 text-[14px] leading-7 text-white/62">
                                If something feels off, say where you were, what you expected, and what actually happened. Use the priority that matches the impact: blocker, major, medium, minor, or polish.
                            </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                            <YesNoToggle
                                label="Page loaded cleanly?"
                                value={formState.loadedAsExpected}
                                onChange={(next) => setFormState((current) => ({ ...current, loadedAsExpected: next }))}
                                helper="If the page broke, blanked out, or looked wrong, choose No."
                            />
                            <YesNoToggle
                                label="Tier matched what you bought?"
                                value={formState.tierMatched}
                                onChange={(next) => setFormState((current) => ({ ...current, tierMatched: next }))}
                                helper="Use this when a free, Starter, Pro, or Master screen did not match the account."
                            />
                            <YesNoToggle
                                label="Next step sent you to the right place?"
                                value={formState.nextStepMatched}
                                onChange={(next) => setFormState((current) => ({ ...current, nextStepMatched: next }))}
                                helper="For example: save to My Picks, open billing, or return to pricing."
                            />
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="block text-[12px] uppercase tracking-[0.16em] text-white/38" htmlFor="journeyStage">
                                    Where in the flow?
                                </label>
                                <select
                                    id="journeyStage"
                                    name="journeyStage"
                                    value={formState.journeyStage}
                                    onChange={(event) => setFormState((current) => ({ ...current, journeyStage: event.target.value as JourneyStage }))}
                                    className={BRANDED_SELECT_CLASS}
                                >
                                    {JOURNEY_STAGES.map((stage) => (
                                        <option key={stage.value} value={stage.value} className="bg-[#101922] text-[#f7f2e8]">
                                            {stage.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="text-[13px] leading-6 text-white/50">{selectedStage.description}</div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[12px] uppercase tracking-[0.16em] text-white/38" htmlFor="featureArea">
                                    Which area?
                                </label>
                                <select
                                    id="featureArea"
                                    name="featureArea"
                                    value={formState.featureArea}
                                    onChange={(event) => setFormState((current) => ({ ...current, featureArea: event.target.value as FeatureArea }))}
                                    className={BRANDED_SELECT_CLASS}
                                >
                                    {FEATURE_AREAS.map((area) => (
                                        <option key={area.value} value={area.value} className="bg-[#101922] text-[#f7f2e8]">
                                            {area.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="text-[13px] leading-6 text-white/50">{selectedArea.description}</div>
                            </div>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="block text-[12px] uppercase tracking-[0.16em] text-white/38" htmlFor="testerName">
                                    Tester name
                                </label>
                                <input
                                    id="testerName"
                                    name="testerName"
                                    value={formState.testerName}
                                    onChange={(event) => setFormState((current) => ({ ...current, testerName: event.target.value }))}
                                    placeholder="Optional display name"
                                    className="w-full rounded-[18px] border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-[#72caff]/45"
                                    maxLength={80}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[12px] uppercase tracking-[0.16em] text-white/38" htmlFor="priority">
                                    Priority
                                </label>
                                <select
                                    id="priority"
                                    name="priority"
                                    value={formState.priority}
                                    onChange={(event) => setFormState((current) => ({ ...current, priority: event.target.value as QaReportFormState["priority"] }))}
                                    className={BRANDED_SELECT_CLASS}
                                >
                                    <option value="low" className="bg-[#101922] text-[#f7f2e8]">
                                        Low
                                    </option>
                                    <option value="normal" className="bg-[#101922] text-[#f7f2e8]">
                                        Normal
                                    </option>
                                    <option value="high" className="bg-[#101922] text-[#f7f2e8]">
                                        High
                                    </option>
                                    <option value="urgent" className="bg-[#101922] text-[#f7f2e8]">
                                        Urgent
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                            <button
                                type="button"
                                onClick={() => setFormState((current) => ({ ...current, fireballRelevant: !current.fireballRelevant }))}
                                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${formState.fireballRelevant ? "border-[#72caff]/35 bg-[#111f28] text-[#d8f1ff]" : "border-white/10 bg-white/5 text-white/65 hover:border-white/20 hover:bg-white/10"}`}
                            >
                                Fireball relevant {formState.fireballRelevant ? "Yes" : "No"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormState((current) => ({ ...current, timepulseRelevant: !current.timepulseRelevant }))}
                                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${formState.timepulseRelevant ? "border-[#72caff]/35 bg-[#111f28] text-[#d8f1ff]" : "border-white/10 bg-white/5 text-white/65 hover:border-white/20 hover:bg-white/10"}`}
                            >
                                TimePulse relevant {formState.timepulseRelevant ? "Yes" : "No"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormState((current) => ({ ...current, loadedAsExpected: !current.loadedAsExpected }))}
                                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${formState.loadedAsExpected ? "border-[#53d48a]/35 bg-[#102117] text-[#93efb8]" : "border-white/10 bg-white/5 text-white/65 hover:border-white/20 hover:bg-white/10"}`}
                            >
                                Loaded as expected {formState.loadedAsExpected ? "Yes" : "No"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormState((current) => ({ ...current, tierMatched: !current.tierMatched }))}
                                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${formState.tierMatched ? "border-[#53d48a]/35 bg-[#102117] text-[#93efb8]" : "border-white/10 bg-white/5 text-white/65 hover:border-white/20 hover:bg-white/10"}`}
                            >
                                Tier matched {formState.tierMatched ? "Yes" : "No"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormState((current) => ({ ...current, nextStepMatched: !current.nextStepMatched }))}
                                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${formState.nextStepMatched ? "border-[#53d48a]/35 bg-[#102117] text-[#93efb8]" : "border-white/10 bg-white/5 text-white/65 hover:border-white/20 hover:bg-white/10"}`}
                            >
                                Next step matched {formState.nextStepMatched ? "Yes" : "No"}
                            </button>
                        </div>

                        <div className="mt-5 space-y-2">
                            <label className="block text-[12px] uppercase tracking-[0.16em] text-white/38" htmlFor="expectedBehavior">
                                What should have happened?
                            </label>
                            <textarea
                                id="expectedBehavior"
                                name="expectedBehavior"
                                value={formState.expectedBehavior}
                                onChange={(event) => setFormState((current) => ({ ...current, expectedBehavior: event.target.value }))}
                                placeholder="Describe the expected flow in plain words, including the page and next step."
                                rows={4}
                                className="w-full rounded-[18px] border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-[#72caff]/45"
                            />
                        </div>

                        <div className="mt-5 space-y-2">
                            <label className="block text-[12px] uppercase tracking-[0.16em] text-white/38" htmlFor="actualBehavior">
                                What actually happened?
                            </label>
                            <textarea
                                id="actualBehavior"
                                name="actualBehavior"
                                value={formState.actualBehavior}
                                onChange={(event) => setFormState((current) => ({ ...current, actualBehavior: event.target.value }))}
                                placeholder="Tell us what you saw instead, even if the page mostly worked."
                                rows={5}
                                className="w-full rounded-[18px] border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-[#72caff]/45"
                            />
                        </div>

                        <div className="mt-5 space-y-2">
                            <label className="block text-[12px] uppercase tracking-[0.16em] text-white/38" htmlFor="notes">
                                Notes
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formState.notes}
                                onChange={(event) => setFormState((current) => ({ ...current, notes: event.target.value }))}
                                placeholder="Optional extra detail, browser quirks, or whether the app was easy to follow."
                                rows={4}
                                className="w-full rounded-[18px] border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-[#72caff]/45"
                            />
                        </div>

                        <div className="mt-5 space-y-2">
                            <label className="block text-[12px] uppercase tracking-[0.16em] text-white/38" htmlFor="screenshots">
                                Screenshots
                            </label>
                            <input
                                id="screenshots"
                                name="screenshots"
                                type="file"
                                accept="image/*"
                                multiple
                                className="w-full rounded-[18px] border border-white/10 bg-black/30 px-4 py-3 text-white file:mr-4 file:rounded-full file:border-0 file:bg-[#72caff] file:px-4 file:py-2 file:text-[12px] file:font-semibold file:text-black"
                            />
                            <div className="text-[12px] uppercase tracking-[0.14em] text-white/32">
                                Up to 4 screenshots. Attach one if it helps explain what happened.
                            </div>
                        </div>

                        <div className="mt-5 rounded-[20px] border border-white/8 bg-black/20 px-4 py-4">
                            <div className="text-[13px] font-medium text-[#d8f1ff]">Captured automatically</div>
                            <div className="mt-2 grid gap-2 text-[13px] text-white/60 sm:grid-cols-2">
                                <div>Signed in as: {userEmail || "Unknown"}</div>
                                <div>Page: {meta.pagePath}</div>
                                <div>Browser: {String(meta.browserInfo.userAgent || "Unknown")}</div>
                                <div>Viewport: {String(meta.browserInfo.viewport || "Unknown")}</div>
                            </div>
                        </div>

                        {submissionMessage ? (
                            <div className="mt-5 rounded-[20px] border border-[#53d48a]/25 bg-[#102117] px-4 py-3 text-sm text-[#c8f4d8]">
                                {submissionMessage}
                            </div>
                        ) : null}
                        {error ? (
                            <div className="mt-5 rounded-[20px] border border-[#ff8d7b]/25 bg-[#2a120d]/60 px-4 py-3 text-sm text-[#ffc4b8]">
                                {error}
                            </div>
                        ) : null}

                        <div className="mt-5 flex flex-wrap gap-3">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-full bg-gradient-to-r from-[#72caff] to-[#52aefc] px-6 py-3 text-[15px] font-semibold text-black shadow-[0_0_18px_rgba(114,202,255,0.2)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? "Sending report..." : "Send QA report"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (meta.userEmail) {
                                        safeClearDraft(meta.userEmail);
                                    }

                                    setFormState((current) => ({
                                        ...current,
                                        loadedAsExpected: true,
                                        tierMatched: true,
                                        nextStepMatched: true,
                                        fireballRelevant: false,
                                        timepulseRelevant: false,
                                        expectedBehavior: "",
                                        actualBehavior: "",
                                        notes: "",
                                    }));
                                }}
                                className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-[15px] font-semibold text-white/72 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                            >
                                Reset fields
                            </button>
                        </div>
                    </SectionCard>

                    <SectionCard
                        title="Tier reminder"
                        description={`Quick reminders for what testers should verify at each plan level, including the cue quality. Current selection: ${selectedTier.label}.`}
                    >
                        <div className="space-y-3">
                            <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                                <div className="text-[11px] uppercase tracking-[0.16em] text-white/40">Free</div>
                                <div className="mt-2 text-[15px] leading-7 text-white/72">Dashboard, BrewU, Results, Support, and the trial / upgrade prompts. Check whether the page explains what to do next.</div>
                            </div>
                            <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                                <div className="text-[11px] uppercase tracking-[0.16em] text-white/40">Starter</div>
                                <div className="mt-2 text-[15px] leading-7 text-white/72">Strategy Locker entry, run strategy, save to My Picks, and confirm the play. Check whether the app makes the save / confirm path obvious.</div>
                            </div>
                            <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                                <div className="text-[11px] uppercase tracking-[0.16em] text-white/40">Pro</div>
                                <div className="mt-2 text-[15px] leading-7 text-white/72">Expanded strategy flow, Fireball on NC Pick 3 / Pick 4, and richer stats / ratios. Check whether the extra detail still reads clearly.</div>
                            </div>
                            <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                                <div className="text-[11px] uppercase tracking-[0.16em] text-white/40">Master</div>
                                <div className="mt-2 text-[15px] leading-7 text-white/72">TimePulse timing analysis, lag range guidance, and Master-only review surface. Check whether the Master cue feels clearly different from the lower tiers.</div>
                            </div>
                        </div>
                    </SectionCard>
                </section>
            </DashboardContainer>
        </main>
    );
}
