import type { Metadata } from "next";

export default function Footer() {
  return (
    <footer className="bg-burgundy-ink text-center py-12">
      <div className="container-main max-w-[720px] text-sm">
        <nav aria-label="Legal Nav">
          <Link href="/privacy" className="hover:text-gold-light">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gold-light">Terms of Service</Link>
          <Link href="/disclaimer" className="hover:text-gold-light">Disclaimer</Link>
          <Link href="/cookies" className="hover:text-gold-light">Cookie Policy</Link>
          <Link href="/contact" className="hover:text-gold-light">Contact Us</Link>
        </nav>
      </div>
    </footer>
  );
}