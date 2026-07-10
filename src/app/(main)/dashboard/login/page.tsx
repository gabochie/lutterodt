"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag } from "@/components/shared/Tag";
import { PageHero } from "@/components/shared/PageHero";

export default function ClientLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", access_code: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/clients/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/dashboard");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="Client Portal"
        tag="Client Login"
        title="Access your dashboard"
        description="Enter the email and access code you received after onboarding to view your projects and services."
      />

      <section className="py-[108px]">
        <div className="container-main max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-mono text-[11px] tracking-widest uppercase text-charcoal/50 mb-1.5">Email Address</label>
              <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-ivory-dim border border-line px-4 py-3 text-[15px] outline-none focus:border-gold-dim" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block font-mono text-[11px] tracking-widest uppercase text-charcoal/50 mb-1.5">Access Code</label>
              <input required value={form.access_code} onChange={e => setForm(f => ({ ...f, access_code: e.target.value }))} className="w-full bg-ivory-dim border border-line px-4 py-3 text-[15px] outline-none focus:border-gold-dim" placeholder="Your access code" />
            </div>
            {status === "error" && <p className="text-red-600 text-[14px]">{errorMsg}</p>}
            <button type="submit" disabled={status === "loading"} className="btn-gold w-full disabled:opacity-50">
              {status === "loading" ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
