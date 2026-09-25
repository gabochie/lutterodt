import Link from "next/link";
import type { Metadata } from "next";
import { PasswordField } from "@/components/PasswordField";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const error = params.error;

  return (
    <div className="min-h-screen bg-burgundy-ink flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(198,161,91,0.08),transparent_60%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="19" stroke="#EEAD16" strokeWidth="1" />
              <path d="M20 7L23.5 16.5L33 20L23.5 23.5L20 33L16.5 23.5L7 20L16.5 16.5L20 7Z" stroke="#FBC829" strokeWidth="1.1" />
              <circle cx="20" cy="20" r="3" fill="#EEAD16" />
            </svg>
            <span className="flex flex-col leading-tight text-left">
              <span className="font-display font-[650] text-[17px] tracking-wide text-ivory">Lutterodt</span>
              <span className="font-mono text-[9.5px] tracking-widest uppercase text-gold-dim">Renaissance</span>
            </span>
          </Link>
          <h1 className="text-ivory text-[24px] font-display">Admin Login</h1>
          <p className="text-ivory/50 text-[13.5px] mt-1">Sign in to the Legacy OS</p>
        </div>

        {error && (
          <div className="mb-6 p-3 border border-red-400/30 bg-red-400/10">
            <p className="font-mono text-[10.5px] tracking-wider text-red-300 text-center">{error}</p>
          </div>
        )}

        <form action="/api/login" method="POST" className="space-y-5">
          <div className="field">
            <label className="font-mono text-[10.5px] tracking-widest uppercase text-gold-light/60 block mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full border-0 border-b border-ivory/20 bg-transparent py-3 px-1 font-body text-[15px] text-ivory placeholder:text-ivory/30 focus:outline-0 focus:border-gold transition-colors"
              placeholder="hello@lutterodt.org"
            />
          </div>
          <PasswordField />
          <button type="submit" className="w-full btn btn-gold justify-center mt-2">
            Sign In
          </button>
          <div className="text-center">
            <Link href="/" className="font-mono text-[10.5px] tracking-widest uppercase text-ivory/55 hover:text-gold-light transition-colors">
              Back to site
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
