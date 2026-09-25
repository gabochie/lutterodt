"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function AdminSettings() {
  const [comingSoon, setComingSoon] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { setComingSoon(d.coming_soon); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function toggleComingSoon() {
    setToggling(true);
    setError("");
    try {
      const r = await fetch("/api/settings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ coming_soon: !comingSoon }),
        credentials: "include",
      });
      if (!r.ok) {
        const text = await r.text();
        setError(`Server returned ${r.status}: ${text.slice(0, 100)}`);
        setToggling(false);
        return;
      }
      const d = await r.json();
      setComingSoon(d.coming_soon);
    } catch (e) {
      setError(String(e));
    }
    setToggling(false);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-heading">Settings</h1>
        <p className="text-fg/50 text-[14px] mt-1">Manage site-wide configuration</p>
      </div>

      <div className="bg-surface border border-line p-6 max-w-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {loading ? (
              <Loader2 className="w-5 h-5 text-fg/30 animate-spin" />
            ) : comingSoon ? (
              <EyeOff className="w-5 h-5 text-gold-dim" />
            ) : (
              <Eye className="w-5 h-5 text-success-text" />
            )}
            <div>
              <h2 className="font-display text-[16px] text-heading">Coming Soon Mode</h2>
              <p className="text-fg/50 text-[13px] mt-0.5">
                {loading ? "Loading..." : comingSoon
                  ? "Visitors see the coming soon landing page with lead capture."
                  : "The full site is live and publicly accessible."}
              </p>
            </div>
          </div>
          {!loading && (
            <button
              onClick={toggleComingSoon}
              disabled={toggling}
              className={`relative w-[52px] h-[28px] rounded-full transition-colors shrink-0 ${
                toggling ? "opacity-50" : ""
              } ${comingSoon ? "bg-gold-dim/30" : "bg-forest"}`}
            >
              <span
                className={`absolute top-[3px] w-[22px] h-[22px] rounded-full bg-surface shadow transition-transform ${
                  comingSoon ? "left-[3px]" : "left-[27px]"
                }`}
              />
            </button>
          )}
        </div>
        {error && (
          <div className="mt-4 flex items-start gap-2 text-red-600 text-[13px]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        <div className="mt-4 pt-4 border-t border-line">
          <p className="font-mono text-[10.5px] tracking-wider text-fg/40">
            When enabled, all visitors are shown a minimal coming soon page with an email signup form.
            Admins can still access the dashboard at /admin.
          </p>
        </div>
      </div>
    </div>
  );
}
