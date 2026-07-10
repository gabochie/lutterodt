import Link from "next/link";
import { cn } from "@/lib/utils";

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-ivory/75">
      <div className="container-main py-[76px] pb-[56px] grid grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-12 max-md:grid-cols-2 max-sm:grid-cols-1">
        <div className="footer-brand">
          <Link href="/" className="flex items-center gap-3">
            <svg className="w-[34px] h-[34px] shrink-0" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="19" stroke="#C6A15B" strokeWidth="1" />
              <path d="M20 7L23.5 16.5L33 20L23.5 23.5L20 33L16.5 23.5L7 20L16.5 16.5L20 7Z" stroke="#E4C989" strokeWidth="1.1" />
              <circle cx="20" cy="20" r="3" fill="#C6A15B" />
            </svg>
            <span className="flex flex-col leading-tight">
              <span className="font-display font-[650] text-[17px] tracking-wide text-ivory">Lutterodt</span>
              <span className="font-mono text-[9.5px] tracking-widest uppercase text-gold-dim">Renaissance</span>
            </span>
          </Link>
          <p className="mt-[18px] text-[14px] max-w-[34ch] text-ivory/55">
            A digital legacy for present and future generations of the Lutterodt family.
          </p>
          <div className="flex gap-4 mt-5">
            <a href="#" className="w-9 h-9 rounded-full border border-ivory/20 flex items-center justify-center hover:border-gold-light hover:text-gold-light text-ivory/55 transition-colors" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full border border-ivory/20 flex items-center justify-center hover:border-gold-light hover:text-gold-light text-ivory/55 transition-colors" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full border border-ivory/20 flex items-center justify-center hover:border-gold-light hover:text-gold-light text-ivory/55 transition-colors" aria-label="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full border border-ivory/20 flex items-center justify-center hover:border-gold-light hover:text-gold-light text-ivory/55 transition-colors" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-mono text-[11px] tracking-widest uppercase text-gold-light mb-[18px] font-medium">Explore</h4>
          <ul className="list-none p-0 m-0 flex flex-col gap-[11px]">
            <li><Link href="/directory" className="text-[14px] text-ivory/72 hover:text-gold-light transition-colors">Directory</Link></li>
            <li><Link href="/projects" className="text-[14px] text-ivory/72 hover:text-gold-light transition-colors">Projects</Link></li>
            <li><Link href="/sponsor" className="text-[14px] text-ivory/72 hover:text-gold-light transition-colors">Sponsor</Link></li>
            <li><Link href="/about" className="text-[14px] text-ivory/72 hover:text-gold-light transition-colors">About</Link></li>
            <li><Link href="/history" className="text-[14px] text-ivory/72 hover:text-gold-light transition-colors">History</Link></li>
            <li><Link href="/gallery" className="text-[14px] text-ivory/72 hover:text-gold-light transition-colors">Gallery</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[11px] tracking-widest uppercase text-gold-light mb-[18px] font-medium">Connect</h4>
          <ul className="list-none p-0 m-0 flex flex-col gap-[11px]">
            <li><Link href="/contact" className="text-[14px] text-ivory/72 hover:text-gold-light transition-colors">Contact</Link></li>
            <li><Link href="/contact" className="text-[14px] text-ivory/72 hover:text-gold-light transition-colors">Join Interest</Link></li>
            <li><Link href="/reunion-2026" className="text-[14px] text-ivory/72 hover:text-gold-light transition-colors">Reunion 2026</Link></li>
            <li><Link href="/contact" className="text-[14px] text-ivory/72 hover:text-gold-light transition-colors">Media Enquiries</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[11px] tracking-widest uppercase text-gold-light mb-[18px] font-medium">Newsletter</h4>
          <p className="text-[13px] mb-4 text-ivory/55">Quarterly notes from the archive, sent to the whole family.</p>
          <form className="flex border-b border-line-on-dark pb-[10px] mt-[6px]">
            <input
              type="email"
              placeholder="Your email address"
              required
              className="bg-transparent border-0 text-ivory text-[14px] flex-1 py-[6px] font-body placeholder:text-ivory/40 focus:outline-0"
            />
            <button
              type="submit"
              className="bg-none border-0 text-gold-light font-mono text-[11px] tracking-widest uppercase"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="container-main border-t border-line-on-dark py-[22px] flex flex-wrap justify-between items-center text-[12.5px] text-ivory/45 gap-x-[18px] gap-y-[8px]">
        <span>© 2026 The Lutterodt Renaissance. All rights reserved.</span>
        <div className="flex gap-[18px] flex-wrap">
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-gold-light transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}