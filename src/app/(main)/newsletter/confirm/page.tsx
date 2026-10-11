import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Confirm your subscription",
  description: "Confirm your subscription to the quarterly Lutterodt archive bulletin.",
  alternates: { canonical: "/newsletter/confirm" },
  robots: { index: false, follow: false },
};

/**
 * Confirmation landing page.
 *
 * Splitting this out from the token-consuming endpoint means a mail scanner
 * that pre-fetches the link lands on a page with a button, rather than
 * confirming the subscription on the scanner's behalf.
 */
export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const valid = Boolean(token && token.length >= 16);

  return (
    <section className="py-[108px] bg-ivory-dim">
      <div className="container-main">
        <div className="max-w-[620px]">
          <p className="font-mono text-[10.5px] tracking-[0.25em] uppercase text-gold-ink dark:text-gold-light mb-3">
            Archive bulletin
          </p>
          <h1 className="text-[clamp(30px,4.4vw,48px)] font-display font-[560] leading-tight mb-6">
            {valid ? "One click to confirm" : "This link is incomplete"}
          </h1>

          {valid ? (
            <>
              <p className="text-[16px] text-fg/72 leading-relaxed mb-8">
                Thank you for asking to hear from us. Confirm below and your
                address will be added to the quarterly list. We write a few
                times a year at most.
              </p>
              <a
                href={`/api/newsletter/confirm?token=${encodeURIComponent(token as string)}&apply=1`}
                className="btn-primary"
              >
                Confirm subscription
              </a>
            </>
          ) : (
            <>
              <p className="text-[16px] text-fg/72 leading-relaxed mb-8">
                This confirmation link is missing its token. It may have been
                truncated by your email client. You can request a fresh one from
                the newsletter box at the bottom of any page.
              </p>
              <Link href="/" className="btn-outline">
                Back to the archive
              </Link>
            </>
          )}

          <p className="mt-12 text-[13.5px] text-fg/55 leading-relaxed">
            Changed your mind? Every bulletin email carries a one-click
            unsubscribe link, and you can also write to us at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
