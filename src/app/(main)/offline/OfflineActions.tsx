"use client";

import Link from "next/link";

export function OfflineActions() {
  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="btn-outline"
      >
        Try again
      </button>
      <Link href="/about" className="btn-outline">
        About the Renaissance
      </Link>
    </div>
  );
}