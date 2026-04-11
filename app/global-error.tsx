'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#050505] text-white">
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
          <div className="rounded-[28px] border border-[#ff7d67]/30 bg-[#2a1311] px-6 py-8 shadow-[0_0_20px_rgba(255,125,103,0.08)]">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#ffb5a8]">System Error</div>
            <h1 className="mt-3 text-2xl font-bold text-white">Brew hit an unexpected problem.</h1>
            <p className="mt-3 text-sm leading-6 text-white/70">
              The error has been captured for review. Try the action again, or return to the dashboard.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => reset()}
                className="rounded-full border border-[#ffd978]/70 bg-[linear-gradient(180deg,#ffcf4a_0%,#ffba19_55%,#f6a800_100%)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-black"
              >
                Try Again
              </button>
              <a
                href="/dashboard"
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white/80"
              >
                Dashboard
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
