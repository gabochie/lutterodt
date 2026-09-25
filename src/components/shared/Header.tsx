"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/directory", label: "Directory" },
  { href: "/projects", label: "Projects" },
  { href: "/sponsor", label: "Sponsor" },
  { href: "/about", label: "About" },
  { href: "/history", label: "History" },
  { href: "/contact", label: "Contact" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/92 dark:bg-black/92 backdrop-blur-md border-b border-line">
      <nav className="container-main flex items-center justify-between py-[18px]">
        <Link href="/" className="flex items-center gap-3">
          <Crest />
          <span className="flex flex-col leading-tight">
            <span className="font-display font-[650] text-[17px] tracking-wide text-heading">
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
                "relative text-[13.5px] tracking-wide text-fg/75 hover:text-fg py-1",
                pathname === link.href && "opacity-100"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute -bottom-[3px] left-0 right-0 h-[1.5px] bg-gold" />
              )}
            </Link>
          ))}
          <ThemeToggle className="ml-1" />
          <Link
            href="/contact"
            className="text-[12.5px] tracking-widest uppercase border border-accent-text text-accent-text px-[18px] py-[9px] rounded-sm hover:bg-accent-text hover:text-surface transition-colors"
          >
            Join the Renaissance
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="bg-none border-0 p-0 inline-flex h-11 w-11 items-center justify-center text-fg"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {open && <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)} />}
      {open && (
        <div className="md:hidden bg-surface border-b border-line px-8 py-6 flex flex-col gap-5 relative z-50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13.5px] tracking-wide text-fg/75"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="text-[12.5px] tracking-widest uppercase border border-accent-text text-accent-text px-[18px] py-[9px] rounded-sm text-center hover:bg-accent-text hover:text-surface transition-colors"
            onClick={() => setOpen(false)}
          >
            Join the Renaissance
          </Link>
        </div>
      )}
    </header>
  );
}

function Crest() {
  return (
    <>
      <img
        src="/logo/lutterodt-logo-200.webp"
        srcSet="/logo/lutterodt-logo-200.webp 1x, /logo/lutterodt-logo-400.webp 2x"
        width={200}
        height={141}
        alt="Lutterodt — Lasz Uns Ideale Haben"
        className="h-9 w-auto shrink-0 md:h-11 dark:hidden"
      />
      <img
        src="/logo/lutterodt-dark-black-01010A-800.webp"
        srcSet="/logo/lutterodt-dark-black-01010A-800.webp 1x, /logo/lutterodt-dark-black-01010A-1200.webp 2x"
        width={800}
        height={564}
        alt="Lutterodt — Lasz Uns Ideale Haben"
        className="hidden h-9 w-auto shrink-0 md:h-11 dark:block"
      />
    </>
  );
}