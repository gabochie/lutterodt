"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { TurnstileWidget } from "./TurnstileWidget";

type Status = "idle" | "sending" | "pending" | "error";

/**
 * Footer newsletter signup.
 *
 * Posts to the double opt-in endpoint: the address is stored as pending and
 * only becomes a subscriber once the emailed confirmation link is followed.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaReset, setCaptchaReset] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !consent) return;

    setStatus("sending");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, turnstileToken: captchaToken }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
      };

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("pending");
      setMessage(
        data.message || "Almost there — check your inbox for a confirmation link."
      );
      setEmail("");
      setConsent(false);
      setCaptchaToken(null);
      setCaptchaReset((n) => n + 1);
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex border-b border-line-on-dark pb-[10px] mt-[6px]"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          placeholder="Your email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby="newsletter-consent"
          className="bg-transparent border-0 text-ivory text-[14px] flex-1 py-[6px] font-body placeholder:text-ivory/55 focus:outline-0"
        />
        <button
          type="submit"
          disabled={status === "sending" || !consent}
          className="bg-none border-0 text-gold-light font-mono text-[11px] tracking-widest uppercase disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Subscribe"}
        </button>
      </form>

      <label
        id="newsletter-consent"
        className="mt-3 flex items-start gap-2 text-[11.5px] leading-[1.6] text-ivory/50 cursor-pointer"
      >
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-[3px] accent-gold-light shrink-0"
        />
        <span>
          Send me the quarterly archive bulletin. A few emails a year, and{" "}
          <Link
            href="/newsletter/unsubscribe"
            className="underline hover:text-gold-light"
          >
            unsubscribe
          </Link>{" "}
          in one click. See our{" "}
          <Link href="/privacy" className="underline hover:text-gold-light">
            privacy policy
          </Link>
          .
        </span>
      </label>

      {status === "pending" && (
        <p role="status" className="mt-3 text-[12px] text-green-400">
          {message}
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="mt-3 text-[12px] text-red-400">
          {message}
        </p>
      )}
      <TurnstileWidget onToken={setCaptchaToken} resetSignal={captchaReset} />
    </div>
  );
}
