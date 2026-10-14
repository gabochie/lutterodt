import Link from "next/link";
import type { Metadata } from "next";
import { PasswordField } from "@/components/PasswordField";
import { BrandLockup } from "@/components/shared/BrandLockup";

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
          <Link href="/" className="inline-flex mb-6">
            <BrandLockup nameClassName="text-ivory" onDark />
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
