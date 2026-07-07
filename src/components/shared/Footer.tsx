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
        </div>

        <div>
          <h4 className="font-mono text-[11px] tracking-widest uppercase text-gold-light mb-[18px] font-medium">Explore</h4>
          <ul className="list-none p-0 m-0 flex flex-col gap-[11px]">
            <li><Link href="/directory" className="text-[14px] text-ivory/72 hover:text-gold-light transition-colors">Directory</Link></li>
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
            <li><Link href="/contact" className="text-[14px] text-ivory/72 hover:text-gold-light transition-colors">Media Enquiries</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[11px] tracking-widest uppercase text-gold-light mb-[18px] font-medium">Social</h4>
          <ul className="list-none p-0 m-0 flex flex-col gap-[11px]">
            <li><a href="#" className="text-[14px] text-ivory/72 hover:text-gold-light transition-colors">Instagram</a></li>
            <li><a href="#" className="text-[14px] text-ivory/72 hover:text-gold-light transition-colors">Facebook</a></li>
            <li><a href="#" className="text-[14px] text-ivory/72 hover:text-gold-light transition-colors">YouTube</a></li>
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