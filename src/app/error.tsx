"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-20 text-center">
      <div className="container-main max-w-lg">
        <span className="font-mono text-[10.5px] tracking-[0.25em] uppercase text-gold-dim">500 — Error</span>
        <h1 className="text-[clamp(28px,3.5vw,40px)] font-display text-heading mt-2">
          Something went wrong
        </h1>
        <p className="text-fg/60 text-[15px] mt-3 max-w-[42ch] mx-auto">
          The archive stumbled while serving this page. If the problem persists, please let us know via the contact form.
        </p>
        {error.digest && (
          <p className="font-mono text-[11px] text-fg/40 mt-4">Reference: {error.digest}</p>
        )}
        <div className="flex items-center justify-center gap-4 flex-wrap mt-8">
          <button onClick={reset} className="btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn-ghost">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}