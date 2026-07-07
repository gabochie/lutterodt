import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-[80px] flex-1 flex items-center justify-center">
      <div className="container-main text-center">
        <span className="font-mono text-[11.5px] tracking-widest uppercase text-gold-dim">404</span>
        <h1 className="text-[clamp(32px,5vw,52px)] mt-[12px] text-burgundy-ink font-serif font-medium leading-[1.15]">
          Page not found
        </h1>
        <p className="text-[16px] text-charcoal/70 mt-[16px] max-w-[42ch] mx-auto leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4 mt-[32px]">
          <Link href="/" className="btn-primary">Home</Link>
          <Link href="/directory" className="btn-outline">Directory</Link>
        </div>
      </div>
    </section>
  );
}
