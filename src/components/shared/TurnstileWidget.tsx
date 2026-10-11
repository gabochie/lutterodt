"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      reset?: (widgetId?: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad";

/**
 * Invisible-friendly captcha slot. Renders nothing until
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY exists, so forms work unchanged in dev.
 */
export function TurnstileWidget({
  onToken,
  resetSignal,
}: {
  onToken: (token: string | null) => void;
  /** Increment to reset the widget (e.g. after a successful submit). */
  resetSignal?: number;
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (resetSignal === undefined || widgetIdRef.current === null) return;
    window.turnstile?.reset?.(widgetIdRef.current);
    onTokenRef.current(null);
  }, [resetSignal]);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;
    const container = containerRef.current;

    const renderWidget = () => {
      if (!window.turnstile || container.dataset.rendered === "1") return;
      container.dataset.rendered = "1";
      widgetIdRef.current = window.turnstile.render(container, {
        sitekey: siteKey,
        theme: "auto",
        callback: (token: string) => onTokenRef.current(token),
        "expired-callback": () => onTokenRef.current(null),
        "error-callback": () => onTokenRef.current(null),
      });
    };

    if (window.turnstile) {
      renderWidget();
      return;
    }
    if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      window.onTurnstileLoad = renderWidget;
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else {
      const timer = setInterval(() => {
        if (window.turnstile) {
          clearInterval(timer);
          renderWidget();
        }
      }, 250);
      return () => clearInterval(timer);
    }
  }, [siteKey]);

  if (!siteKey) return null;
  return <div ref={containerRef} className="mt-4" />;
}
