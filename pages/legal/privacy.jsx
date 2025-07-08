// =============================================
// 📄 /pages/legal/privacy.jsx
// Created: 2025-06-27T05:15 EDT
// Summary: BrewLotto AI Privacy Policy — styled legal info
// =============================================

import Head from "next/head";

export default function PrivacyPolicyPage() {
    return (
        <>
            <Head>
                <title>Privacy Policy | BrewLotto AI</title>
            </Head>
            <main className="max-w-3xl mx-auto px-4 py-12 text-sm text-neutral-300 leading-6">
                <h1 className="text-2xl text-yellow-400 font-bold mb-6">Privacy Policy</h1>
                <p className="mb-4 text-xs italic text-neutral-400">Last updated: June 24, 2025</p>

                <section className="space-y-4">
                    <p>
                        BrewLotto AI (“we”, “our”, or “us”) respects your privacy. This policy explains what data we collect, how it’s used, and your rights regarding your personal information.
                    </p>

                    <h2 className="text-yellow-300 font-semibold mt-6">What We Collect</h2>
                    <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Account info:</strong> Email address, device info (for account management)</li>
                        <li><strong>Usage data:</strong> Lottery picks, session data, app interaction</li>
                        <li><strong>Analytics:</strong> Crash reports, performance stats (Firebase/Supabase)</li>
                    </ul>

                    <h2 className="text-yellow-300 font-semibold mt-6">How We Use Data</h2>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>To provide predictions and functionality</li>
                        <li>To improve AI models and experience</li>
                        <li>For legal compliance (e.g. age limits)</li>
                    </ul>

                    <h2 className="text-yellow-300 font-semibold mt-6">What We Don’t Do</h2>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>We <strong>do not</strong> sell or share your data</li>
                        <li>No access to payment info or contacts</li>
                        <li>No location tracking (unless you choose to share)</li>
                    </ul>

                    <h2 className="text-yellow-300 font-semibold mt-6">Your Rights</h2>
                    <p>You can request data deletion or opt out of analytics (coming soon) at any time.</p>

                    <h2 className="text-yellow-300 font-semibold mt-6">Contact</h2>
                    <p>Email: <a href="mailto:support@brewlotto.ai" className="underline text-yellow-300">support@brewlotto.ai</a></p>
                </section>
            </main>
        </>
    );
}