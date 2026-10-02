"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

const IOS_DISMISS_KEY = "lutterodt-pwa-ios-dismissed";
const FEATURED_NAV = /(iPhone|iPad|iPod)/i;

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari standalone detection
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOS(): boolean {
  return FEATURED_NAV.test(window.navigator.userAgent) && "ontouchstart" in window;
}

export type InstallPromptState = "unsupported" | "installed" | "available" | "ios" | "dismissed";

export function useInstallPrompt() {
  const [state, setState] = useState<InstallPromptState>("unsupported");
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone()) {
      setState("installed");
      return;
    }

    if (isIOS()) {
      if (localStorage.getItem(IOS_DISMISS_KEY) === "1") {
        setState("dismissed");
      } else {
        setState("ios");
      }
      return;
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setState("available");
    };

    const onInstalled = () => {
      setState("installed");
      setDeferred(null);
      localStorage.setItem(IOS_DISMISS_KEY, "1");
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const showInstallPrompt = async () => {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        setState("installed");
        setDeferred(null);
      }
    } else if (state === "ios") {
      // iOS has no beforeinstallprompt; nothing to auto-open.
    }
  };

  const dismiss = () => {
    localStorage.setItem(IOS_DISMISS_KEY, "1");
    setState("dismissed");
  };

  return {
    state,
    canPrompt: state === "available",
    isIOS: state === "ios",
    showInstallPrompt,
    dismiss,
  };
}