"use client";

import { useEffect, useState } from "react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { INSTALL_REQUEST_EVENT } from "./InstallAppButton";
import { cn } from "@/lib/utils";

const DOWNLOAD_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CLOSE_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export function InstallPrompt() {
  const { state, canPrompt, isIOS, showInstallPrompt, dismiss } = useInstallPrompt();
  const [modalOpen, setModalOpen] = useState(false);

  // Show the iOS modal shortly after mount, once. The hook already persists
  // dismissal in localStorage, so reopening is a user choice via the chip.
  useEffect(() => {
    if (isIOS) {
      const t = setTimeout(() => setModalOpen(true), 1200);
      return () => clearTimeout(t);
    }
  }, [isIOS]);

  // Footer "Install App" button forwards here (same flow, manual trigger).
  useEffect(() => {
    const onRequest = () => {
      if (isIOS) {
        setModalOpen(true);
      } else {
        void showInstallPrompt();
      }
    };
    window.addEventListener(INSTALL_REQUEST_EVENT, onRequest);
    return () => window.removeEventListener(INSTALL_REQUEST_EVENT, onRequest);
  }, [isIOS, showInstallPrompt]);

  const visible = canPrompt || isIOS;

  if (!visible) return null;

  const heading =
    state === "available" ? "Add the Lutterodt Renaissance to your device" : "Add to your Home Screen";

  return (
    <>
      <div
        className={cn(
          "fixed z-40 backdrop-blur-md border border-gold-dim/25 shadow-lg",
          "bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:right-6 md:max-w-sm",
          isIOS ? "bg-azure-ink text-ivory" : "bg-charcoal text-ivory"
        )}
        role="region"
        aria-label="Install the Lutterodt app"
      >
        <div className="px-5 py-4 flex items-center gap-4">
          <span className="shrink-0 w-9 h-9 rounded-full border border-gold-dim/30 flex items-center justify-center text-gold-light">
            {DOWNLOAD_ICON}
          </span>
          <span className="flex-1 min-w-0">
            <button
              type="button"
              onClick={() => {
                if (isIOS) {
                  setModalOpen(true);
                } else {
                  void showInstallPrompt();
                }
              }}
              className="block w-full text-left font-display text-[15px] text-ivory hover:text-gold-light transition-colors"
            >
              Install Lutterodt
            </button>
            <p className="text-[12px] text-ivory/55 mt-0.5">
              {isIOS ? "Runs offline from your Home Screen" : "Install as an app"}
            </p>
          </span>
          <button
            type="button"
            aria-label="Dismiss install prompt"
            onClick={dismiss}
            className="shrink-0 w-7 h-7 flex items-center justify-center text-ivory/50 hover:text-ivory transition-colors"
          >
            {CLOSE_ICON}
          </button>
        </div>
      </div>

      {modalOpen && isIOS && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center" role="dialog" aria-modal="true" aria-label={heading}>
          <button
            type="button"
            aria-label="Close install instructions"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative z-10 bg-surface border border-line rounded-lg shadow-2xl max-w-sm w-full mx-4 mb-8 md:mb-0 p-6">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-fg/50 hover:text-fg"
            >
              {CLOSE_ICON}
            </button>
            <h3 className="font-display text-[20px] text-heading pr-8">{heading}</h3>
            <p className="mt-3 text-[13px] leading-relaxed text-fg/70">
              The Lutterodt Renaissance works offline once installed. Open it anytime from your Home Screen:
            </p>
            <ol className="mt-4 flex flex-col gap-3 text-[13px] text-fg/80">
              <li className="flex items-center gap-3">
                <span aria-hidden="true">1</span> Tap the{" "}
                <span className="font-mono text-[12px] border border-line rounded px-1.5 py-0.5">Share</span> button in
                Safari
              </li>
              <li className="flex items-center gap-3">
                <span aria-hidden="true">2</span> Tap{" "}
                <span className="text-gold-light font-medium">Add to Home Screen</span>
              </li>
              <li className="flex items-center gap-3">
                <span aria-hidden="true">3</span> Tap <span className="font-mono text-[12px] border border-line rounded px-1.5 py-0.5">Add</span>
              </li>
            </ol>
          </div>
        </div>
      )}
    </>
  );
}