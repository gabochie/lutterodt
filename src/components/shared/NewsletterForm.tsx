"use client";

import { useState, FormEvent } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: "", subject: "Newsletter Subscription", message: "" }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex border-b border-line-on-dark pb-[10px] mt-[6px]">
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
          className="bg-transparent border-0 text-ivory text-[14px] flex-1 py-[6px] font-body placeholder:text-ivory/55 focus:outline-0"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-none border-0 text-gold-light font-mono text-[11px] tracking-widest uppercase disabled:opacity-50"
        >
          {status === "sending" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      {status === "success" && (
        <p className="mt-3 text-[12px] text-green-400">Subscribed. Welcome to the archive bulletin.</p>
      )}
      {status === "error" && (
        <p className="mt-3 text-[12px] text-red-400">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}