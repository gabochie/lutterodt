import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Unsubscribe from the quarterly Lutterodt archive bulletin.",
  alternates: { canonical: "/newsletter/unsubscribe" },
  robots: { index: false, follow: false },
};

/**
 * Unsubscribe landing page.
 *
 * The token is applied by the endpoint when the person presses the button, so
 * a scanner pre-fetching the link does not unsubscribe a real subscriber.
 */
export default async function UnsubscribePage({
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
            {valid ? "Stop the bulletin" : "This link is incomplete"}
          </h1>

          {valid ? (
            <>
              <p className="text-[16px] text-fg/72 leading-relaxed mb-8">
                Press the button below and we will remove this address from the
                quarterly list. You will not be mailed again, and nothing else
                about your record changes.
              </p>
              <a
                href={`/api/newsletter/unsubscribe?token=${encodeURIComponent(token as string)}`}
                className="btn-outline"
              >
                Unsubscribe me
              </a>
            </>
          ) : (
            <>
              <p className="text-[16px] text-fg/72 leading-relaxed mb-8">
                This unsubscribe link is missing its token. If you would like to
                stop the bulletin, reply to any email we have sent you and we
                will remove the address by hand.
              </p>
              <Link href="/" className="btn-outline">
                Back to the archive
              </Link>
            </>
          )}

          <p className="mt-12 text-[13.5px] text-fg/55 leading-relaxed">
            The archive itself stays open to you. This only stops the quarterly
            email.
          </p>
        </div>
      </div>
    </section>
  );
}
