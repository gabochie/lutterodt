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
            <a href="https://www.tiktok.com/@lutterodtlnstitute" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-ivory/20 flex items-center justify-center hover:border-gold-light hover:text-gold-light text-ivory/55 transition-colors" aria-label="TikTok">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </a>
            <a href="https://wa.me/233243262019" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-ivory/20 flex items-center justify-center hover:border-gold-light hover:text-gold-light text-ivory/55 transition-colors" aria-label="WhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/></svg>
            </a>
            <a href="https://www.youtube.com/@LutterodtInstitute" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-ivory/20 flex items-center justify-center hover:border-gold-light hover:text-gold-light text-ivory/55 transition-colors" aria-label="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://www.linkedin.com/search/results/all/?keywords=Lutterodt" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-ivory/20 flex items-center justify-center hover:border-gold-light hover:text-gold-light text-ivory/55 transition-colors" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-mono text-[11px] tracking-widest uppercase text-gold-light mb-[18px] font-medium">Explore</h4>
          <ul className="list-none p-0 m-0 flex flex-col gap-[11px]">
            <li><Link href="/directory" className="text-[14px] text-ivory/72 hover:text-gold-light transition-colors">Directory</Link></li>
            <li><Link href="/projects" className="text-[14px] text-ivory/72 hover:text-gold-light transition-colors">Projects</Link></li>
            <li><Link href="/services" className="text-[14px] text-ivory/72 hover:text-gold-light transition-colors">Services</Link></li>
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
            <li><Link href="/services" className="text-[14px] text-ivory/72 hover:text-gold-light transition-colors">Services</Link></li>
            <li><Link href="/contact" className="text-[14px] text-ivory/72 hover:text-gold-light transition-colors">Media Enquiries</Link></li>
            <li><a href="https://wa.me/233243262019" target="_blank" rel="noopener noreferrer" className="text-[14px] text-ivory/72 hover:text-gold-light transition-colors">WhatsApp</a></li>
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