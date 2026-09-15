"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-charcoal text-ivory text-center px-6">
          <div className="max-w-md">
            <span className="font-mono text-[10.5px] tracking-[0.25em] uppercase text-gold-dim">500 — Fatal Error</span>
            <h1 className="font-display text-[clamp(28px,4vw,44px)] mt-3">
              The archive needs a moment
            </h1>
            <p className="text-ivory/60 text-[15px] mt-3">
              A critical error occurred. Please refresh the page, or try again in a moment.
            </p>
            <button
              onClick={reset}
              className="mt-8 px-6 py-3 font-mono text-[11px] tracking-widest uppercase bg-gold-light text-burgundy-ink hover:bg-ivory transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}