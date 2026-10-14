"use client";

import { useInstallPrompt } from "@/hooks/useInstallPrompt";

/**
 * Persistent install entry point (footer legal bar).
 *
 * The floating InstallPrompt only appears when the browser fires
 * beforeinstallprompt (or on iOS) — desktop users who never get the event
 * otherwise have no way to install. This button renders only when
 * installation is actually possible and forwards to the same flow.
 */
export const INSTALL_REQUEST_EVENT = "lutterodt:install-request";

export function InstallAppButton() {
  const { canPrompt, isIOS } = useInstallPrompt();

  if (!canPrompt && !isIOS) return null;

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(INSTALL_REQUEST_EVENT))}
      className="hover:text-gold-light transition-colors"
    >
      Install App
    </button>
  );
}
