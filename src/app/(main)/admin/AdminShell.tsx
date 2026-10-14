"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Crest } from "@/components/shared/BrandLockup";
import {
  LayoutDashboard,
  FileText,
  Clock,
  Image,
  MessageSquare,
  Mail,
  Map,
  DollarSign,
  Target,
  Settings,
  ListChecks,
  Globe,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  CalendarDays,
  Rocket,
} from "lucide-react";

const navItems = [
  { href: "/admin/command-center", label: "Command Center", icon: Rocket },
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/timeline", label: "Timeline", icon: Clock },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/contacts", label: "Contacts", icon: MessageSquare },
  { href: "/admin/outreach", label: "Outreach", icon: Mail },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/web-finder", label: "Web Finder", icon: Globe },
  { href: "/admin/scheduler", label: "Scheduler", icon: CalendarDays },
  { href: "/admin/roadmap", label: "Roadmap", icon: Map },
  { href: "/admin/budget", label: "Budget", icon: DollarSign },
  { href: "/admin/strategy", label: "Strategy", icon: Target },
  { href: "/admin/prelaunch", label: "Prelaunch", icon: ListChecks },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-ivory-dim">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed md:sticky top-0 z-50 md:z-auto h-screen w-64 bg-azure-ink text-ivory flex flex-col transition-transform duration-300 md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-5 border-b border-line-on-dark flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <Crest className="h-7 w-[40px]" />
            <div className="flex flex-col leading-tight">
              <span className="font-display font-[650] text-[14px] tracking-wide text-ivory">Lutterodt</span>
              <span className="font-mono text-[8px] tracking-widest uppercase text-gold-dim">Admin OS</span>
            </div>
          </Link>
          <button
            className="md:hidden text-ivory/60 hover:text-ivory"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-sm text-[13.5px] transition-colors",
                  isActive
                    ? "bg-gold/15 text-gold-light"
                    : "text-ivory/60 hover:text-ivory hover:bg-surface/5"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-gold-dim" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-line-on-dark flex flex-col gap-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-[13px] text-ivory/50 hover:text-ivory hover:bg-surface/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Back to Site</span>
          </Link>
          <Link
            href="/api/logout"
            className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-[13px] text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-surface/92 backdrop-blur-md border-b border-line px-6 py-3 flex items-center gap-4">
          <button
            className="md:hidden text-fg/60 hover:text-fg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <span className="font-mono text-[10px] tracking-widest uppercase text-gold-dim">Admin</span>
        </header>

        <div className="p-6 md:p-8 lg:p-10">{children}</div>
      </div>
    </div>
  );
}
