import type { Metadata } from "next";
import { Crest } from "@/components/shared/BrandLockup";
import { OfflineActions } from "./OfflineActions";

export const metadata: Metadata = {
  title: "Offline",
  description: "The Lutterodt Renaissance is offline right now.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="flex-1 min-h-[70vh] flex flex-col items-center justify-center px-6 py-24 text-center">
      <Crest className="h-12 w-12" />
      <h1 className="mt-8 font-display text-[clamp(28px,4vw,40px)] text-heading">You&apos;re offline</h1>
      <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-fg/70">
        The Lutterodt archive is preserved on your device, but the connection to add new pages just dropped. Once
        you&apos;re back online, everything resumes exactly where you left it.
      </p>
      <OfflineActions />
      <p className="mt-10 font-mono text-[11px] tracking-widest uppercase text-fg/40">
        Lutterodt · installed app works offline
      </p>
    </main>
  );
}