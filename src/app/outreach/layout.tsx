// Outreach layout — client-side auth check, no server-side cookies()
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/outreach", label: "Dashboard", icon: "📊" },
  { href: "/outreach/queue", label: "Queue", icon: "📋" },
  { href: "/outreach/discover", label: "Discover", icon: "🔍" },
  { href: "/outreach/blind-spots", label: "Blind Spots", icon: "🎯" },
];

export default function OutreachLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const hasToken = document.cookie.includes("admin_token=");
    if (!hasToken) {
      router.replace("/login?redirect=/outreach");
    } else {
      setAuthed(true);
    }
    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-ivory-dim flex items-center justify-center">
        <p className="text-charcoal/50 font-mono text-[12px] tracking-widest uppercase">Checking access...</p>
      </div>
    );
  }

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-ivory-dim">
      <div className="bg-burgundy-ink text-ivory px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-ivory/50 hover:text-ivory text-[13px]">&larr; Admin</Link>
          <span className="text-ivory/20">|</span>
          <span className="font-mono text-[10px] tracking-widest uppercase text-gold-dim">Outreach Console</span>
        </div>
        <div className="flex items-center gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[13px] px-3 py-1.5 rounded-sm transition-colors",
                pathname === item.href || (item.href !== "/outreach" && pathname.startsWith(item.href))
                  ? "bg-gold/15 text-gold-light"
                  : "text-ivory/60 hover:text-ivory"
              )}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-6">{children}</div>
    </div>
  );
}
