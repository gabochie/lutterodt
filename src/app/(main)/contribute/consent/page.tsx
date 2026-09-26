import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Consent and Usage Rights",
  description:
    "How the Lutterodt Renaissance handles contributed family materials, oral history, and personal data — and how to withdraw consent.",
  alternates: { canonical: "/contribute/consent" },
};

export default function ConsentPage() {
  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="Consent and Usage Rights"
        tag="Before you contribute"
        title="What happens to what you send us"
        description="This archive belongs to the family, so the rules are the family's rules. Nothing here is a legal boilerplate exercise — it is how we make sure your contribution is protected and your name is respected."
      />

      <section className="py-[108px]">
        <div className="container-main">
          <div className="max-w-[720px]">
            <h2 className="text-[clamp(24px,3vw,34px)] mb-6">The short version</h2>
            <ul className="space-y-3 mb-14 text-[15.5px] text-fg/72">
              <li><strong className="text-fg">You keep copyright.</strong> Contributing does not transfer ownership of your photographs, letters, or recordings.</li>
              <li><strong className="text-fg">We may preserve and publish it</strong> in the permanent family archive, with a credit line naming you.</li>
              <li><strong className="text-fg">You can withdraw at any time.</strong> Ask, and the material is removed or corrected. We do not argue.</li>
              <li><strong className="text-fg">We will not sell it,</strong> license it commercially, or use it in advertising.</li>
              <li><strong className="text-fg">We will contact you before publishing</strong> anything sensitive, anything involving a living person who has not consented, or anything you have asked us to hold back.</li>
            </ul>

            <h2 className="text-[clamp(24px,3vw,34px)] mb-6">What we ask you to confirm</h2>
            <p className="text-[15.5px] text-fg/72 mb-5">
              When you submit the contribution form you are confirming three things. We record your
              confirmation with the submission so that provenance is never in doubt.
            </p>
            <ol className="space-y-5 mb-14">
              <li className="border-l-2 border-gold-dim pl-5">
                <h3 className="text-[17px] mb-1">The material is yours to share</h3>
                <p className="text-[15px] text-fg/68">
                  You hold it, or you have permission from whoever holds it. If a photograph was taken
                  by someone else, or a letter was written to someone else, please say so when you send
                  it and we will record that context.
                </p>
              </li>
              <li className="border-l-2 border-gold-dim pl-5">
                <h3 className="text-[17px] mb-1">You consent to preservation and publication</h3>
                <p className="text-[15px] text-fg/68">
                  We may digitise, store, describe, and publish the contribution as part of the permanent
                  archive, online at lutterodt.org and in any printed family volume we produce.
                </p>
              </li>
              <li className="border-l-2 border-gold-dim pl-5">
                <h3 className="text-[17px] mb-1">You can name people who must approve first</h3>
                <p className="text-[15px] text-fg/68">
                  If the material involves a living person who has not consented, tell us and we will hold
                  it unpublished until they agree. A family archive should never expose someone who did
                  not choose to be part of it.
                </p>
              </li>
            </ol>

            <h2 className="text-[clamp(24px,3vw,34px)] mb-6">Privacy of living family members</h2>
            <p className="text-[15.5px] text-fg/72 mb-5">
              The archive documents real, identifiable people. We are deliberate about this:
            </p>
            <ul className="space-y-3 mb-14 text-[15.5px] text-fg/72">
              <li>Contact details are never published. Email addresses, phone numbers, and addresses stay out of the public record.</li>
              <li>We do not publish a profile for a living person without either their consent or a clear public professional record.</li>
              <li>Where someone is living and private, we record name, relationship, branch, and achievement &mdash; not personal data.</li>
              <li>The <Link href="/verify" className="text-accent-text underline">identity verification flow</Link> exists so that family members can confirm and correct their own record.</li>
            </ul>

            <h2 className="text-[clamp(24px,3vw,34px)] mb-6">Oral history and voice</h2>
            <p className="text-[15.5px] text-fg/72 mb-14">
              Recorded testimony is the most sensitive material we hold, because it carries a living
              voice. It is published only with the consent you give at the time of recording, and you can
              withdraw a recording at any point &mdash; including after publication, in which case we
              remove it and note the withdrawal in the catalogue.
            </p>

            <h2 className="text-[clamp(24px,3vw,34px)] mb-6">Withdrawing consent</h2>
            <p className="text-[15.5px] text-fg/72 mb-6">
              Write to <a href="mailto:hello@lutterodt.org" className="text-accent-text underline">hello@lutterodt.org</a>
              {" "}with the name of the person or item. We will confirm what we hold, remove or correct it, and
              tell you when it is done. We do not require a reason and we do not charge.
            </p>
            <p className="text-[14px] text-fg/55 mb-14">
              This page is a plain-language summary written by the project, not a reviewed legal
              instrument. It has not yet been through professional review &mdash; a gap we are working to
              close, and we would rather tell you than imply a formality we have not completed.
            </p>

            <div className="flex gap-4 flex-wrap">
              <Link href="/contact?intent=materials" className="btn-gold">Contribute Materials</Link>
              <Link href="/contact?intent=testimony" className="btn-outline">Share Your Memories</Link>
              <Link href="/contact?intent=verify" className="btn-outline">Verify a Profile</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
