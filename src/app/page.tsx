import Link from "next/link";
import { getSetting } from "@/lib/pocketbase/settings";
import { FullSite } from "@/components/home/FullSite";

async function SearchParamsMessage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const success = params.success;
  const error = params.error;

  return (
    <>
      {success && (
        <div className="mb-6 p-3 border border-emerald-400/30 bg-emerald-400/10 text-center">
          <p className="font-mono text-[10.5px] tracking-wider text-emerald-300">{success}</p>
        </div>
      )}
      {error && (
        <div className="mb-6 p-3 border border-red-400/30 bg-red-400/10 text-center">
          <p className="font-mono text-[10.5px] tracking-wider text-red-300">{error}</p>
        </div>
      )}
    </>
  );
}

function ComingSoon({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-burgundy-ink overflow-hidden px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(198,161,91,0.10),transparent_60%),radial-gradient(circle_at_80%_20%,rgba(47,74,60,0.20),transparent_50%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gold-dim/8 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-gold-dim/6 rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl text-center">
        <div className="mb-8">
          <svg className="w-16 h-16 mx-auto mb-6" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="19" stroke="#C6A15B" strokeWidth="1" />
            <path d="M20 7L23.5 16.5L33 20L23.5 23.5L20 33L16.5 23.5L7 20L16.5 16.5L20 7Z" stroke="#E4C989" strokeWidth="1.1" />
            <circle cx="20" cy="20" r="3" fill="#C6A15B" />
          </svg>
          <p className="font-mono text-[10.5px] tracking-[0.25em] uppercase text-gold-dim mb-3">Coming Soon</p>
          <h1 className="text-ivory text-[clamp(36px,5.6vw,64px)] font-display font-[560] leading-tight mb-4">
            The Lutterodt<br />
            <em className="italic font-[440] text-gold-light">Renaissance</em>
          </h1>
          <p className="text-ivory/60 text-[16px] max-w-[44ch] mx-auto leading-relaxed">
            A permanent digital archive of the Lutterodt family&mdash;six generations of history, heritage, and home.
          </p>
        </div>

        <SearchParamsMessage searchParams={searchParams} />

        <form action="/api/leads" method="POST" className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            className="flex-1 border-0 border-b border-ivory/20 bg-transparent py-3 px-1 font-body text-[15px] text-ivory placeholder:text-ivory/30 focus:outline-0 focus:border-gold transition-colors text-center"
          />
          <button type="submit" className="btn-gold shrink-0">
            Notify Me
          </button>
        </form>

        <p className="mt-6 text-ivory/40 text-[13px] font-mono tracking-wide">
          Be the first to know when the archive launches.
        </p>

        <div className="mt-12 flex items-center justify-center gap-6 text-ivory/30 font-mono text-[10px] tracking-widest uppercase">
          <Link href="/login" className="hover:text-gold-light transition-colors">Admin</Link>
          <span className="w-[1px] h-3 bg-ivory/15" />
          <span>Accra · London</span>
        </div>
      </div>
    </div>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const comingSoon = await getSetting("coming_soon");

  if (comingSoon !== "false") {
    return <ComingSoon searchParams={searchParams} />;
  }

  return <FullSite />;
}
