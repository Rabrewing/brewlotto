// =============================================
// 📄 /pages/legal/terms.jsx
// Created: 2025-06-27T05:15 EDT
// Summary: BrewLotto AI Terms of Use — styled for clarity
// =============================================

import Head from "next/head";

export default function TermsPage() {
    return (
        <>
            <Head>
                <title>Terms of Use | BrewLotto AI</title>
            </Head>
            <main className="max-w-3xl mx-auto px-4 py-12 text-sm text-neutral-300 leading-6">
                <h1 className="text-2xl text-yellow-400 font-bold mb-6">Terms of Use</h1>
                <p className="mb-4 text-xs italic text-neutral-400">Last updated: June 24, 2025</p>

                <section className="space-y-4">
                    <p>By using BrewLotto AI, you agree to these terms:</p>

                    <ul className="list-disc pl-6 space-y-1">
                        <li>This app is for entertainment only</li>
                        <li>No guarantee of winning or financial gain</li>
                        <li>You must be 18 years or older to use it</li>
                        <li>AI picks are based on public data and probability</li>
                        <li>BrewLotto does <strong>not</strong> sell or enable ticket purchasing</li>
                    </ul>

                    <p className="mt-4 italic">
                        If you do not agree to these terms, do not use the app.
                    </p>

                    <h2 className="text-yellow-300 font-semibold mt-6">Responsible Gambling Disclaimer</h2>
                    <p>
                        BrewLotto AI is intended for users 18+ and for entertainment only. This app does not guarantee winnings. Play responsibly.
                    </p>

                    <h2 className="text-yellow-300 font-semibold mt-6">AI Usage</h2>
                    <p>
                        The app uses AI to analyze lottery data and suggest numbers. It does not influence, predict, or alter official results.
                    </p>
                </section>
            </main>
        </>
    );
}