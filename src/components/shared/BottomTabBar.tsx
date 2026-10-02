"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, ScrollText, Image, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/directory", label: "Directory", icon: Users },
  { href: "/history", label: "History", icon: ScrollText },
  { href: "/gallery", label: "Gallery", icon: Image },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 md:hidden bg-surface/95 backdrop-blur-md border-t border-line pt-safe pb-safe"
      aria-label="Primary"
    >
      <div className="grid grid-cols-5">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1 pt-[10px] pb-[9px] text-[10px] tracking-[0.08em] uppercase transition-colors",
                active ? "text-gold" : "text-fg/55 hover:text-fg/80"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.7} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}