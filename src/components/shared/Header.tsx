"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/directory", label: "Directory" },
  { href: "/sponsor", label: "Sponsor" },
  { href: "/about", label: "About" },
  { href: "/history", label: "History" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ivory/92 backdrop-blur-md border-b border-line">
      <nav className="container-main flex items-center justify-between py-[18px]">
        <Link href="/" className="flex items-center gap-3">
          <BrandMark />
          <span className="flex flex-col leading-tight">
            <span className="font-display font-[650] text-[17px] tracking-wide text-burgundy-ink">
              Lutterodt
            </span>
            <span className="font-mono text-[9.5px] tracking-widest uppercase text-gold-dim">
              Renaissance
            </span>
          </span>
        </Link>

        <div
          className={cn(
            "hidden md:flex items-center gap-[30px]",
            open && "flex"
          )}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-[13.5px] tracking-wide text-charcoal/75 hover:text-charcoal py-1",
                pathname === link.href && "opacity-100"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute -bottom-[3px] left-0 right-0 h-[1.5px] bg-gold" />
              )}
            </Link>
          ))}
          <Link
            href="/contact"
            className="text-[12.5px] tracking-widest uppercase border border-burgundy text-burgundy px-[18px] py-[9px] rounded-sm hover:bg-burgundy hover:text-ivory transition-colors"
          >
            Join the Renaissance
          </Link>
        </div>

        <button
          className="md:hidden bg-none border-0 p-0"
          aria-label="Open menu"
          onClick={() => setOpen(!open)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="#211D1A"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-ivory border-b border-line px-8 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13.5px] tracking-wide text-charcoal/75"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="text-[12.5px] tracking-widest uppercase border border-burgundy text-burgundy px-[18px] py-[9px] rounded-sm text-center hover:bg-burgundy hover:text-ivory transition-colors"
            onClick={() => setOpen(false)}
          >
            Join the Renaissance
          </Link>
        </div>
      )}
    </header>
  );
}

function BrandMark() {
  return (
    <svg
      className="w-[34px] h-[34px] shrink-0"
      viewBox="0 0 40 40"
      fill="none"
    >
      <circle cx="20" cy="20" r="19" stroke="#C6A15B" strokeWidth="1" />
      <path
        d="M20 7L23.5 16.5L33 20L23.5 23.5L20 33L16.5 23.5L7 20L16.5 16.5L20 7Z"
        stroke="#5C1A2B"
        strokeWidth="1.1"
      />
      <circle cx="20" cy="20" r="3" fill="#C6A15B" />
    </svg>
  );
}
